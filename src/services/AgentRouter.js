/**
 * AgentRouter - Routage vers assistants spécialisés par profil
 *
 * Gère la connexion aux différents agents IA spécialisés selon le profil utilisateur.
 * Chaque profil (RH, Exec, Dev, etc.) dispose d'un agent avec:
 * - Modèle d'IA optimisé
 * - System prompt spécialisé
 * - Knowledge base dédiée
 * - Tools/capabilities spécifiques
 */

class AgentRouter {
    constructor() {
        this.currentProfile = null;
        this.currentAgent = null;
        this.knowledgeBaseLoaded = false;

        // Registry des agents spécialisés
        this.agentRegistry = {
            rh: {
                name: 'HR Expert Assistant',
                model: 'gpt-4-hr-specialized',
                systemPrompt: this.getSystemPrompt('rh'),
                tools: [
                    'cv_analyzer',
                    'job_description_generator',
                    'interview_questions_generator',
                    'candidate_evaluator',
                    'hr_compliance_checker'
                ],
                knowledgeBase: 'HR_DOCUMENTS',
                temperature: 0.7,
                maxTokens: 2000
            },
            exec: {
                name: 'Strategic Advisor',
                model: 'gpt-4-business',
                systemPrompt: this.getSystemPrompt('exec'),
                tools: [
                    'market_analyzer',
                    'kpi_dashboard',
                    'financial_report_generator',
                    'competitive_intelligence',
                    'decision_framework'
                ],
                knowledgeBase: 'BUSINESS_INTELLIGENCE',
                temperature: 0.5,
                maxTokens: 2500
            },
            dev: {
                name: 'Senior Developer Assistant',
                model: 'gpt-4-code',
                systemPrompt: this.getSystemPrompt('dev'),
                tools: [
                    'code_analyzer',
                    'debugger',
                    'test_generator',
                    'documentation_generator',
                    'performance_profiler',
                    'architecture_advisor'
                ],
                knowledgeBase: 'CODE_REPOSITORIES',
                temperature: 0.3,
                maxTokens: 3000
            },
            marketing: {
                name: 'Marketing Strategist',
                model: 'gpt-4-creative',
                systemPrompt: this.getSystemPrompt('marketing'),
                tools: [
                    'trend_analyzer',
                    'copy_generator',
                    'campaign_planner',
                    'seo_optimizer',
                    'social_media_scheduler'
                ],
                knowledgeBase: 'MARKETING_DATA',
                temperature: 0.8,
                maxTokens: 2000
            },
            support: {
                name: 'Customer Support Specialist',
                model: 'gpt-4-support',
                systemPrompt: this.getSystemPrompt('support'),
                tools: [
                    'ticket_analyzer',
                    'faq_generator',
                    'response_template',
                    'escalation_detector',
                    'satisfaction_tracker'
                ],
                knowledgeBase: 'SUPPORT_TICKETS',
                temperature: 0.6,
                maxTokens: 1500
            },
            other: {
                name: 'General Assistant',
                model: 'gpt-4',
                systemPrompt: this.getSystemPrompt('other'),
                tools: [
                    'general_search',
                    'summarizer',
                    'translator',
                    'calculator'
                ],
                knowledgeBase: 'GENERAL_KNOWLEDGE',
                temperature: 0.7,
                maxTokens: 2000
            }
        };

        this.initialize();
    }

    async initialize() {
        // Charger le profil sauvegardé
        const savedProfile = localStorage.getItem('userProfile');
        if (savedProfile && this.agentRegistry[savedProfile]) {
            await this.switchProfile(savedProfile);
        }

        console.log('[AgentRouter] Initialized with profile:', this.currentProfile);
    }

    /**
     * Changer de profil utilisateur et d'agent associé
     * @param {string} profileId - ID du profil (rh, exec, dev, etc.)
     * @returns {Promise<Object>} Agent configuré
     */
    async switchProfile(profileId) {
        if (!this.agentRegistry[profileId]) {
            throw new Error(`Profile "${profileId}" not found in registry`);
        }

        console.log(`[AgentRouter] Switching to profile: ${profileId}`);

        this.currentProfile = profileId;
        this.currentAgent = this.agentRegistry[profileId];
        this.knowledgeBaseLoaded = false;

        // Sauvegarder le profil
        localStorage.setItem('userProfile', profileId);

        // Charger la knowledge base spécifique
        await this.loadKnowledgeBase(profileId);

        // Émettre événement de changement
        window.dispatchEvent(new CustomEvent('profile-changed', {
            detail: {
                profile: profileId,
                agent: this.currentAgent
            }
        }));

        console.log(`[AgentRouter] Switched to ${this.currentAgent.name}`);
        return this.currentAgent;
    }

    /**
     * Router une requête vers l'agent approprié
     * @param {string} query - Question/requête de l'utilisateur
     * @param {Object} context - Contexte additionnel (transcription, screenshots, etc.)
     * @returns {Promise<Object>} Réponse de l'agent
     */
    async routeQuery(query, context = {}) {
        if (!this.currentAgent) {
            throw new Error('No agent selected. Please select a profile first via switchProfile()');
        }

        console.log('[AgentRouter] Routing query to:', this.currentAgent.name);

        // Construire le prompt complet
        const prompt = this.buildPrompt(query, context);

        // Déterminer les tools nécessaires
        const requiredTools = this.detectRequiredTools(query);

        // Envoyer au bon agent
        const response = await this.sendToAgent(this.currentAgent, prompt, requiredTools);

        return response;
    }

    /**
     * Construire le prompt avec contexte
     * @param {string} query - Requête utilisateur
     * @param {Object} context - Contexte
     * @returns {string} Prompt complet
     */
    buildPrompt(query, context) {
        let prompt = this.currentAgent.systemPrompt + '\n\n';

        // Ajouter contexte de transcription si disponible
        if (context.transcript) {
            prompt += `Transcription de la conversation:\n${context.transcript}\n\n`;
        }

        // Ajouter contexte de screenshot si disponible
        if (context.screenshots && context.screenshots.length > 0) {
            prompt += `Contexte visuel: ${context.screenshots.length} screenshot(s) disponible(s)\n\n`;
        }

        // Ajouter historique si disponible
        if (context.history && context.history.length > 0) {
            prompt += `Historique récent:\n`;
            context.history.forEach((msg, i) => {
                prompt += `${i + 1}. ${msg.role}: ${msg.content}\n`;
            });
            prompt += '\n';
        }

        // Requête principale
        prompt += `Question/Requête:\n${query}`;

        return prompt;
    }

    /**
     * Détecter les tools nécessaires selon la requête
     * @param {string} query - Requête
     * @returns {Array<string>} Liste de tools
     */
    detectRequiredTools(query) {
        const tools = [];
        const queryLower = query.toLowerCase();

        // Mapping keywords → tools
        const toolKeywords = {
            cv_analyzer: ['cv', 'curriculum', 'résumé', 'candidat'],
            code_analyzer: ['code', 'function', 'class', 'bug', 'error'],
            debugger: ['debug', 'erreur', 'exception', 'crash'],
            test_generator: ['test', 'unittest', 'coverage'],
            market_analyzer: ['marché', 'tendance', 'concurrent'],
            copy_generator: ['copywriting', 'slogan', 'publicité'],
            ticket_analyzer: ['ticket', 'problème client', 'support']
        };

        // Vérifier présence de keywords
        Object.entries(toolKeywords).forEach(([tool, keywords]) => {
            if (keywords.some(kw => queryLower.includes(kw))) {
                // Vérifier que le tool est disponible pour cet agent
                if (this.currentAgent.tools.includes(tool)) {
                    tools.push(tool);
                }
            }
        });

        return tools;
    }

    /**
     * Envoyer la requête à l'agent (via API backend)
     * @param {Object} agent - Configuration de l'agent
     * @param {string} prompt - Prompt complet
     * @param {Array<string>} tools - Tools requis
     * @returns {Promise<Object>} Réponse
     */
    async sendToAgent(agent, prompt, tools = []) {
        console.log('[AgentRouter] Sending to agent:', {
            name: agent.name,
            model: agent.model,
            tools: tools,
            promptLength: prompt.length
        });

        try {
            // TODO: Remplacer par vraie API call
            // const response = await fetch('/api/agent/query', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({
            //         agent: agent.name,
            //         model: agent.model,
            //         prompt: prompt,
            //         tools: tools,
            //         temperature: agent.temperature,
            //         maxTokens: agent.maxTokens
            //     })
            // });
            // return await response.json();

            // Mock response pour développement
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve({
                        content: `Réponse de ${agent.name} à votre requête. [Mock response]`,
                        sources: [],
                        toolsUsed: tools,
                        model: agent.model,
                        timestamp: Date.now()
                    });
                }, 1000);
            });

        } catch (error) {
            console.error('[AgentRouter] Error sending to agent:', error);
            throw error;
        }
    }

    /**
     * Charger la knowledge base spécifique au profil
     * @param {string} profileId - ID du profil
     */
    async loadKnowledgeBase(profileId) {
        const knowledgeBases = {
            rh: ['cv_database', 'hr_policies', 'labor_law', 'onboarding_docs'],
            exec: ['financial_reports', 'market_data', 'industry_news', 'kpi_definitions'],
            dev: ['code_repositories', 'documentation', 'stack_overflow', 'api_references'],
            marketing: ['campaign_data', 'trends', 'competitor_analysis', 'brand_guidelines'],
            support: ['product_docs', 'faq', 'ticket_history', 'troubleshooting_guides'],
            other: ['general_knowledge', 'company_wiki']
        };

        const docs = knowledgeBases[profileId] || [];

        console.log(`[AgentRouter] Loading knowledge base for ${profileId}:`, docs);

        // TODO: Implémenter chargement réel des documents
        // for (const docType of docs) {
        //     await this.loadDocumentType(docType);
        // }

        this.knowledgeBaseLoaded = true;
        console.log('[AgentRouter] Knowledge base loaded');
    }

    /**
     * Obtenir le system prompt pour un profil
     * @param {string} profileId - ID du profil
     * @returns {string} System prompt
     */
    getSystemPrompt(profileId) {
        const prompts = {
            rh: `Vous êtes un expert RH senior avec 15 ans d'expérience en recrutement, gestion des talents et conformité légale.

Votre expertise couvre:
- Analyse de CV et profils candidats
- Rédaction d'offres d'emploi attractives
- Préparation de questions d'entretien pertinentes
- Évaluation des soft skills et fit culturel
- Conformité RGPD et droit du travail français
- Onboarding et développement des talents

Vous aidez les professionnels RH à prendre des décisions éclairées et à optimiser leurs processus.
Soyez professionnel, empathique et orienté humain dans vos réponses.`,

            exec: `Vous êtes un conseiller stratégique senior avec expertise en stratégie d'entreprise, analyse financière et prise de décision.

Votre expertise couvre:
- Analyse stratégique et positionnement marché
- Interprétation de KPIs et métriques business
- Synthèse de rapports complexes
- Support décisionnel data-driven
- Veille concurrentielle et tendances sectorielles

Vous fournissez des insights concis, actionnables et orientés résultats.
Soyez analytique, factuel et direct dans vos réponses.`,

            dev: `Vous êtes un développeur senior expert en architecture logicielle, debugging et best practices.

Votre expertise couvre:
- Code review et suggestions d'amélioration
- Debugging et résolution de bugs complexes
- Architecture et design patterns
- Optimisation de performance
- Génération de tests unitaires et documentation
- Best practices multi-langages (JS, Python, Java, Go, Rust, etc.)

Vous aidez à écrire du code propre, performant et maintenable.
Soyez technique, précis et pédagogique dans vos réponses.`,

            marketing: `Vous êtes un stratège marketing créatif avec expertise en digital marketing, branding et analyse de tendances.

Votre expertise couvre:
- Stratégie de campagnes multicanales
- Copywriting persuasif et storytelling
- Analyse de tendances et insights consommateurs
- SEO, SEM et social media marketing
- Mesure de ROI et optimisation

Vous aidez à créer des campagnes impactantes et mesurables.
Soyez créatif, data-driven et orienté conversion dans vos réponses.`,

            support: `Vous êtes un spécialiste du support client avec excellence en résolution de problèmes et communication empathique.

Votre expertise couvre:
- Analyse et résolution de tickets clients
- Génération de réponses claires et rassurantes
- Détection d'escalades nécessaires
- Création de FAQ et documentation
- Amélioration de la satisfaction client

Vous aidez à fournir un support exceptionnel et efficient.
Soyez empathique, clair et orienté solution dans vos réponses.`,

            other: `Vous êtes un assistant intelligent polyvalent capable d'aider sur une large variété de tâches.

Votre expertise couvre:
- Recherche d'informations et synthèse
- Résumé de documents et contenus
- Traduction et reformulation
- Calculs et analyses basiques
- Support général de productivité

Vous vous adaptez aux besoins de l'utilisateur.
Soyez clair, utile et polyvalent dans vos réponses.`
        };

        return prompts[profileId] || prompts.other;
    }

    /**
     * Obtenir le profil et l'agent actuels
     * @returns {Object} { profile, agent }
     */
    getCurrentState() {
        return {
            profile: this.currentProfile,
            agent: this.currentAgent,
            knowledgeBaseLoaded: this.knowledgeBaseLoaded
        };
    }

    /**
     * Vérifier si un profil est disponible
     * @param {string} profileId - ID du profil
     * @returns {boolean}
     */
    isProfileAvailable(profileId) {
        return !!this.agentRegistry[profileId];
    }

    /**
     * Lister tous les profils disponibles
     * @returns {Array<Object>} Liste des profils
     */
    listAvailableProfiles() {
        return Object.keys(this.agentRegistry).map(id => ({
            id,
            name: this.agentRegistry[id].name,
            tools: this.agentRegistry[id].tools.length,
            knowledgeBase: this.agentRegistry[id].knowledgeBase
        }));
    }
}

// Export singleton instance
export const agentRouter = new AgentRouter();

// Export class for testing
export { AgentRouter };
