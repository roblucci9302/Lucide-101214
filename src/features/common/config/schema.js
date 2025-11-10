const LATEST_SCHEMA = {
    users: {
        columns: [
            { name: 'uid', type: 'TEXT PRIMARY KEY' },
            { name: 'display_name', type: 'TEXT NOT NULL' },
            { name: 'email', type: 'TEXT NOT NULL' },
            { name: 'created_at', type: 'INTEGER' },
            { name: 'auto_update_enabled', type: 'INTEGER DEFAULT 1' },
            { name: 'has_migrated_to_firebase', type: 'INTEGER DEFAULT 0' },
            { name: 'active_agent_profile', type: 'TEXT DEFAULT \'lucide_assistant\'' }
        ]
    },
    sessions: {
        columns: [
            { name: 'id', type: 'TEXT PRIMARY KEY' },
            { name: 'uid', type: 'TEXT NOT NULL' },
            { name: 'title', type: 'TEXT' },
            { name: 'session_type', type: 'TEXT DEFAULT \'ask\'' },
            { name: 'started_at', type: 'INTEGER' },
            { name: 'ended_at', type: 'INTEGER' },
            { name: 'sync_state', type: 'TEXT DEFAULT \'clean\'' },
            { name: 'updated_at', type: 'INTEGER' },
            // Phase 2: Enhanced conversation history
            { name: 'tags', type: 'TEXT' }, // JSON array: ["work", "personal", etc.]
            { name: 'description', type: 'TEXT' }, // Optional longer description
            { name: 'agent_profile', type: 'TEXT' }, // Which Lucy profile was used
            { name: 'message_count', type: 'INTEGER DEFAULT 0' }, // Number of messages
            { name: 'auto_title', type: 'INTEGER DEFAULT 1' } // 1 if title auto-generated
        ]
    },
    transcripts: {
        columns: [
            { name: 'id', type: 'TEXT PRIMARY KEY' },
            { name: 'session_id', type: 'TEXT NOT NULL' },
            { name: 'start_at', type: 'INTEGER' },
            { name: 'end_at', type: 'INTEGER' },
            { name: 'speaker', type: 'TEXT' },
            { name: 'text', type: 'TEXT' },
            { name: 'lang', type: 'TEXT' },
            { name: 'created_at', type: 'INTEGER' },
            { name: 'sync_state', type: 'TEXT DEFAULT \'clean\'' }
        ]
    },
    ai_messages: {
        columns: [
            { name: 'id', type: 'TEXT PRIMARY KEY' },
            { name: 'session_id', type: 'TEXT NOT NULL' },
            { name: 'sent_at', type: 'INTEGER' },
            { name: 'role', type: 'TEXT' },
            { name: 'content', type: 'TEXT' },
            { name: 'tokens', type: 'INTEGER' },
            { name: 'model', type: 'TEXT' },
            { name: 'created_at', type: 'INTEGER' },
            { name: 'sync_state', type: 'TEXT DEFAULT \'clean\'' }
        ]
    },
    summaries: {
        columns: [
            { name: 'session_id', type: 'TEXT PRIMARY KEY' },
            { name: 'generated_at', type: 'INTEGER' },
            { name: 'model', type: 'TEXT' },
            { name: 'text', type: 'TEXT' },
            { name: 'tldr', type: 'TEXT' },
            { name: 'bullet_json', type: 'TEXT' },
            { name: 'action_json', type: 'TEXT' },
            { name: 'tokens_used', type: 'INTEGER' },
            { name: 'updated_at', type: 'INTEGER' },
            { name: 'sync_state', type: 'TEXT DEFAULT \'clean\'' }
        ]
    },
    prompt_presets: {
        columns: [
            { name: 'id', type: 'TEXT PRIMARY KEY' },
            { name: 'uid', type: 'TEXT NOT NULL' },
            { name: 'title', type: 'TEXT NOT NULL' },
            { name: 'prompt', type: 'TEXT NOT NULL' },
            { name: 'is_default', type: 'INTEGER NOT NULL' },
            { name: 'created_at', type: 'INTEGER' },
            { name: 'sync_state', type: 'TEXT DEFAULT \'clean\'' }
        ]
    },
    ollama_models: {
        columns: [
            { name: 'name', type: 'TEXT PRIMARY KEY' },
            { name: 'size', type: 'TEXT NOT NULL' },
            { name: 'installed', type: 'INTEGER DEFAULT 0' },
            { name: 'installing', type: 'INTEGER DEFAULT 0' }
        ]
    },
    whisper_models: {
        columns: [
            { name: 'id', type: 'TEXT PRIMARY KEY' },
            { name: 'name', type: 'TEXT NOT NULL' },
            { name: 'size', type: 'TEXT NOT NULL' },
            { name: 'installed', type: 'INTEGER DEFAULT 0' },
            { name: 'installing', type: 'INTEGER DEFAULT 0' }
        ]
    },
    provider_settings: {
        columns: [
            { name: 'provider', type: 'TEXT NOT NULL' },
            { name: 'api_key', type: 'TEXT' },
            { name: 'selected_llm_model', type: 'TEXT' },
            { name: 'selected_stt_model', type: 'TEXT' },
            { name: 'is_active_llm', type: 'INTEGER DEFAULT 0' },
            { name: 'is_active_stt', type: 'INTEGER DEFAULT 0' },
            { name: 'created_at', type: 'INTEGER' },
            { name: 'updated_at', type: 'INTEGER' }
        ],
        constraints: ['PRIMARY KEY (provider)']
    },
    shortcuts: {
        columns: [
            { name: 'action', type: 'TEXT PRIMARY KEY' },
            { name: 'accelerator', type: 'TEXT NOT NULL' },
            { name: 'created_at', type: 'INTEGER' }
        ]
    },
    permissions: {
        columns: [
            { name: 'uid', type: 'TEXT PRIMARY KEY' },
            { name: 'keychain_completed', type: 'INTEGER DEFAULT 0' }
        ]
    },
    // Phase 4: Knowledge Base - Document Management
    documents: {
        columns: [
            { name: 'id', type: 'TEXT PRIMARY KEY' },
            { name: 'uid', type: 'TEXT NOT NULL' }, // Owner
            { name: 'title', type: 'TEXT NOT NULL' }, // Document title
            { name: 'filename', type: 'TEXT NOT NULL' }, // Original filename
            { name: 'file_type', type: 'TEXT NOT NULL' }, // pdf, docx, txt, md
            { name: 'file_size', type: 'INTEGER' }, // Size in bytes
            { name: 'file_path', type: 'TEXT' }, // Local file path or cloud URL
            { name: 'content', type: 'TEXT' }, // Extracted text content
            { name: 'tags', type: 'TEXT' }, // JSON array of tags
            { name: 'description', type: 'TEXT' }, // Optional description
            { name: 'chunk_count', type: 'INTEGER DEFAULT 0' }, // Number of chunks
            { name: 'indexed', type: 'INTEGER DEFAULT 0' }, // 1 if indexed with embeddings
            { name: 'created_at', type: 'INTEGER' },
            { name: 'updated_at', type: 'INTEGER' },
            { name: 'sync_state', type: 'TEXT DEFAULT \'clean\'' }
        ]
    },
    // Phase 4: Knowledge Base - Document Chunks for Semantic Search
    document_chunks: {
        columns: [
            { name: 'id', type: 'TEXT PRIMARY KEY' },
            { name: 'document_id', type: 'TEXT NOT NULL' }, // Foreign key to documents
            { name: 'chunk_index', type: 'INTEGER NOT NULL' }, // Order in document
            { name: 'content', type: 'TEXT NOT NULL' }, // Chunk text
            { name: 'char_start', type: 'INTEGER' }, // Start position in original
            { name: 'char_end', type: 'INTEGER' }, // End position in original
            { name: 'token_count', type: 'INTEGER' }, // Estimated tokens
            { name: 'embedding', type: 'TEXT' }, // JSON array of vector floats
            { name: 'created_at', type: 'INTEGER' },
            { name: 'sync_state', type: 'TEXT DEFAULT \'clean\'' }
        ]
    },
    // Phase 4: Knowledge Base - Citation Tracking
    document_citations: {
        columns: [
            { name: 'id', type: 'TEXT PRIMARY KEY' },
            { name: 'session_id', type: 'TEXT NOT NULL' }, // Related conversation
            { name: 'message_id', type: 'TEXT' }, // AI message that cited
            { name: 'document_id', type: 'TEXT NOT NULL' }, // Cited document
            { name: 'chunk_id', type: 'TEXT' }, // Specific chunk cited
            { name: 'relevance_score', type: 'REAL' }, // Similarity score
            { name: 'context_used', type: 'TEXT' }, // Actual text included in prompt
            { name: 'created_at', type: 'INTEGER' },
            { name: 'sync_state', type: 'TEXT DEFAULT \'clean\'' }
        ]
    }
};

module.exports = LATEST_SCHEMA; 