/**
 * Phase 4: RAG Service (Retrieval Augmented Generation)
 *
 * Orchestrates context retrieval from knowledge base and injection into prompts.
 * Manages citations and context window limits.
 */

const { v4: uuidv4 } = require('uuid');
const indexingService = require('./indexingService');
const documentService = require('./documentService');
const { estimateTokens } = require('../utils/tokenUtils');

/**
 * @class RAGService
 * @description Service for RAG (Retrieval Augmented Generation)
 */
class RAGService {
    constructor() {
        this.citationsRepository = null;
        this.MAX_CONTEXT_TOKENS = 4000; // Maximum tokens for injected context
        this.MIN_RELEVANCE_SCORE = 0.7; // Minimum similarity score
        console.log('[RAGService] Service initialized');
    }

    /**
     * Initialize service with repository
     * @param {Object} citationsRepo - Citations repository
     */
    initialize(citationsRepo) {
        this.citationsRepository = citationsRepo;
        console.log('[RAGService] Repository connected');
    }

    /**
     * Retrieve relevant context for a query
     * @param {string} query - User query
     * @param {Object} options - Retrieval options
     * @returns {Promise<Object>} Context data with sources
     */
    async retrieveContext(query, options = {}) {
        const {
            maxChunks = 5,
            documentIds = null,
            minScore = this.MIN_RELEVANCE_SCORE
        } = options;

        console.log(`[RAGService] Retrieving context for query: "${query.substring(0, 50)}..."`);

        try {
            // Search for relevant chunks
            const chunks = await indexingService.semanticSearch(query, {
                limit: maxChunks,
                minScore,
                documentIds
            });

            if (chunks.length === 0) {
                console.log('[RAGService] No relevant context found');
                return {
                    hasContext: false,
                    chunks: [],
                    sources: [],
                    totalTokens: 0
                };
            }

            // Get document metadata for chunks (batch query to avoid N+1)
            const uniqueDocIds = [...new Set(chunks.map(c => c.document_id))];
            const documentMap = new Map();

            if (uniqueDocIds.length > 0) {
                // Fetch all documents in one query
                const query = `
                    SELECT id, uid, title, filename, file_type, file_size,
                           tags, description, chunk_count, indexed,
                           created_at, updated_at
                    FROM documents
                    WHERE id IN (${uniqueDocIds.map(() => '?').join(',')})
                `;

                try {
                    const docs = await documentService.documentsRepository.query(query, uniqueDocIds);
                    docs.forEach(doc => {
                        documentMap.set(doc.id, {
                            ...doc,
                            tags: doc.tags ? JSON.parse(doc.tags) : []
                        });
                    });
                } catch (error) {
                    console.error('[RAGService] Error fetching documents:', error);
                }
            }

            // Build sources list
            const sources = chunks.map(chunk => {
                const doc = documentMap.get(chunk.document_id);
                return {
                    chunk_id: chunk.id,
                    document_id: chunk.document_id,
                    document_title: doc ? doc.title : 'Unknown',
                    document_filename: doc ? doc.filename : 'Unknown',
                    content: chunk.content,
                    relevance_score: chunk.relevance_score,
                    chunk_index: chunk.chunk_index
                };
            });

            // Calculate total tokens
            const totalTokens = chunks.reduce((sum, c) => sum + (c.token_count || 0), 0);

            console.log(`[RAGService] Retrieved ${chunks.length} chunks (${totalTokens} tokens)`);

            return {
                hasContext: true,
                chunks,
                sources,
                totalTokens
            };
        } catch (error) {
            console.error('[RAGService] Error retrieving context:', error);
            return {
                hasContext: false,
                chunks: [],
                sources: [],
                totalTokens: 0
            };
        }
    }

    /**
     * Build enriched prompt with knowledge base context
     * @param {string} userQuery - Original user query
     * @param {string} basePrompt - Base system prompt
     * @param {Object} contextData - Context from retrieveContext()
     * @returns {Promise<Object>} Enriched prompt and metadata
     */
    async buildEnrichedPrompt(userQuery, basePrompt, contextData) {
        console.log('[RAGService] Building enriched prompt');

        try {
            if (!contextData.hasContext || contextData.chunks.length === 0) {
                return {
                    prompt: basePrompt,
                    userQuery,
                    hasContext: false,
                    sources: []
                };
            }

            // Filter chunks to fit context window
            const filteredSources = this._filterByTokenLimit(
                contextData.sources,
                this.MAX_CONTEXT_TOKENS
            );

            // Build context section
            const contextSection = this._formatContext(filteredSources);

            // Build enriched prompt
            const enrichedPrompt = `${basePrompt}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📚 KNOWLEDGE BASE CONTEXT

The following information from the knowledge base may be relevant to answer the user's question. Use this context to provide accurate, cited responses.

${contextSection}

IMPORTANT INSTRUCTIONS FOR USING CONTEXT:
1. When using information from the context, cite the source: [Source: {document_title}]
2. If the context doesn't contain relevant information, rely on your general knowledge
3. Be transparent about which information comes from the knowledge base vs. your training
4. Prioritize context information over general knowledge when they conflict
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;

            console.log(`[RAGService] Context injected: ${filteredSources.length} sources`);

            return {
                prompt: enrichedPrompt,
                userQuery,
                hasContext: true,
                sources: filteredSources,
                contextTokens: filteredSources.reduce((sum, s) => sum + estimateTokens(s.content), 0)
            };
        } catch (error) {
            console.error('[RAGService] Error building enriched prompt:', error);
            return {
                prompt: basePrompt,
                userQuery,
                hasContext: false,
                sources: []
            };
        }
    }

    /**
     * Track citation usage in a conversation
     * @param {string} sessionId - Session ID
     * @param {string} messageId - AI message ID
     * @param {Array} sources - Sources that were used
     * @returns {Promise<Array>} Created citation records
     */
    async trackCitations(sessionId, messageId, sources) {
        console.log(`[RAGService] Tracking ${sources.length} citations`);

        try {
            if (sources.length === 0) return [];

            const citations = sources.map(source => ({
                id: uuidv4(),
                session_id: sessionId,
                message_id: messageId,
                document_id: source.document_id,
                chunk_id: source.chunk_id,
                relevance_score: source.relevance_score,
                context_used: source.content,
                created_at: Date.now(),
                sync_state: 'clean'
            }));

            // Batch insert: all citations in one query
            const columns = Object.keys(citations[0]).join(', ');
            const placeholderRow = `(${Object.keys(citations[0]).map(() => '?').join(', ')})`;
            const allPlaceholders = citations.map(() => placeholderRow).join(', ');

            const query = `INSERT INTO document_citations (${columns}) VALUES ${allPlaceholders}`;
            const allValues = citations.flatMap(citation => Object.values(citation));

            await this.citationsRepository.execute(query, allValues);

            console.log(`[RAGService] Citations tracked: ${citations.length}`);

            return citations;
        } catch (error) {
            console.error('[RAGService] Error tracking citations:', error);
            return [];
        }
    }

    /**
     * Get citations for a session
     * @param {string} sessionId - Session ID
     * @returns {Promise<Array>} Citations with document metadata
     */
    async getSessionCitations(sessionId) {
        console.log(`[RAGService] Getting citations for session: ${sessionId}`);

        try {
            const query = `
                SELECT
                    c.*,
                    d.title as document_title,
                    d.filename as document_filename
                FROM document_citations c
                LEFT JOIN documents d ON c.document_id = d.id
                WHERE c.session_id = ?
                ORDER BY c.created_at DESC
            `;

            const citations = await this.citationsRepository.query(query, [sessionId]);

            return citations;
        } catch (error) {
            console.error('[RAGService] Error getting citations:', error);
            return [];
        }
    }

    /**
     * Get most cited documents for a user
     * @param {string} uid - User ID
     * @param {number} limit - Number of results
     * @returns {Promise<Array>} Top cited documents
     */
    async getTopCitedDocuments(uid, limit = 10) {
        console.log(`[RAGService] Getting top cited documents for user: ${uid}`);

        try {
            const query = `
                SELECT
                    d.id,
                    d.title,
                    d.filename,
                    COUNT(c.id) as citation_count,
                    AVG(c.relevance_score) as avg_relevance
                FROM documents d
                INNER JOIN document_citations c ON d.id = c.document_id
                WHERE d.uid = ?
                GROUP BY d.id
                ORDER BY citation_count DESC, avg_relevance DESC
                LIMIT ?
            `;

            const results = await this.citationsRepository.query(query, [uid, limit]);

            return results;
        } catch (error) {
            console.error('[RAGService] Error getting top cited documents:', error);
            return [];
        }
    }

    /**
     * Format context sources for prompt injection
     * @private
     * @param {Array} sources - Filtered sources
     * @returns {string} Formatted context string
     */
    _formatContext(sources) {
        return sources.map((source, index) => {
            return `
┌─ Source ${index + 1}: ${source.document_title}
│  File: ${source.document_filename}
│  Relevance: ${(source.relevance_score * 100).toFixed(1)}%
│
│  ${source.content}
└─────────────────────────────────────────────────────
`;
        }).join('\n');
    }

    /**
     * Filter sources by token limit
     * @private
     * @param {Array} sources - All sources
     * @param {number} maxTokens - Maximum tokens allowed
     * @returns {Array} Filtered sources
     */
    _filterByTokenLimit(sources, maxTokens) {
        const filtered = [];
        let currentTokens = 0;

        for (const source of sources) {
            const sourceTokens = estimateTokens(source.content);

            if (currentTokens + sourceTokens <= maxTokens) {
                filtered.push(source);
                currentTokens += sourceTokens;
            } else {
                break;
            }
        }

        return filtered;
    }

    /**
     * Set maximum context tokens
     * @param {number} maxTokens - Maximum tokens
     */
    setMaxContextTokens(maxTokens) {
        this.MAX_CONTEXT_TOKENS = maxTokens;
        console.log(`[RAGService] Max context tokens set to: ${maxTokens}`);
    }

    /**
     * Set minimum relevance score
     * @param {number} minScore - Minimum score (0-1)
     */
    setMinRelevanceScore(minScore) {
        this.MIN_RELEVANCE_SCORE = minScore;
        console.log(`[RAGService] Min relevance score set to: ${minScore}`);
    }
}

// Singleton instance
const ragService = new RAGService();

module.exports = ragService;
