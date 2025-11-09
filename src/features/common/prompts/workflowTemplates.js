/**
 * Phase 3: Specialized Workflows - Templates and Quick Actions
 *
 * Defines pre-configured workflow templates for each agent profile.
 * These workflows provide structured prompts and forms for common tasks.
 */

const WORKFLOW_TEMPLATES = {
    // ============================================================
    // HR SPECIALIST WORKFLOWS
    // ============================================================
    hr_specialist: {
        create_job_posting: {
            id: 'create_job_posting',
            title: 'Créer une offre d\'emploi',
            icon: '📝',
            description: 'Générer une offre d\'emploi professionnelle et attractive',
            prompt: `Je souhaite créer une offre d'emploi professionnelle.

Informations nécessaires :
- Titre du poste
- Département/Équipe
- Niveau d'expérience requis
- Compétences techniques clés
- Compétences interpersonnelles recherchées
- Responsabilités principales
- Avantages et culture d'entreprise

Peux-tu m'aider à structurer une offre d'emploi complète et attractive ?`,
            category: 'recruitment',
            estimatedTime: '5-10 min',
            hasForm: true,
            formFields: [
                { name: 'jobTitle', label: 'Titre du poste', type: 'text', required: true },
                { name: 'department', label: 'Département', type: 'text', required: true },
                { name: 'experience', label: 'Expérience requise', type: 'select', options: ['Junior (0-2 ans)', 'Intermédiaire (2-5 ans)', 'Senior (5+ ans)', 'Expert (10+ ans)'], required: true },
                { name: 'location', label: 'Localisation', type: 'text', required: false },
                { name: 'remotePolicy', label: 'Politique télétravail', type: 'select', options: ['100% présentiel', 'Hybride', '100% remote'], required: false }
            ]
        },
        analyze_cv: {
            id: 'analyze_cv',
            title: 'Analyser un CV',
            icon: '🔍',
            description: 'Évaluer un CV par rapport à un poste',
            prompt: `Je souhaite analyser un CV de candidat.

Merci de fournir :
1. Le CV du candidat (copier-coller le texte)
2. Le titre du poste visé
3. Les critères d'évaluation prioritaires

Je vais effectuer une analyse détaillée incluant :
- Adéquation profil/poste
- Points forts du candidat
- Points à clarifier en entretien
- Recommandation d'embauche`,
            category: 'recruitment',
            estimatedTime: '3-5 min',
            hasForm: false
        },
        onboarding_plan: {
            id: 'onboarding_plan',
            title: 'Plan d\'onboarding',
            icon: '🎯',
            description: 'Créer un plan d\'intégration structuré',
            prompt: `Je souhaite créer un plan d'onboarding pour un nouveau collaborateur.

Informations nécessaires :
- Poste du nouveau collaborateur
- Département
- Durée de la période d'essai
- Équipe et manager

Je vais créer un plan d'intégration structuré sur 30-60-90 jours incluant :
- Objectifs par période
- Formations nécessaires
- Rencontres clés
- Jalons de validation`,
            category: 'onboarding',
            estimatedTime: '10-15 min',
            hasForm: true,
            formFields: [
                { name: 'position', label: 'Poste', type: 'text', required: true },
                { name: 'department', label: 'Département', type: 'text', required: true },
                { name: 'probationPeriod', label: 'Période d\'essai', type: 'select', options: ['1 mois', '2 mois', '3 mois', '6 mois'], required: true }
            ]
        },
        salary_grid: {
            id: 'salary_grid',
            title: 'Grille salariale',
            icon: '💰',
            description: 'Établir une grille de rémunération équitable',
            prompt: `Je souhaite établir une grille salariale pour mon organisation.

Informations nécessaires :
- Secteur d'activité
- Localisation géographique
- Taille de l'entreprise
- Postes concernés
- Budget global disponible

Je vais proposer une grille salariale équitable basée sur :
- Benchmarks du marché
- Équité interne
- Fourchettes par niveau d'expérience
- Packages de rémunération globale`,
            category: 'compensation',
            estimatedTime: '15-20 min',
            hasForm: false
        },
        conflict_resolution: {
            id: 'conflict_resolution',
            title: 'Résoudre un conflit',
            icon: '🤝',
            description: 'Guide de médiation et résolution de conflits',
            prompt: `Je souhaite résoudre un conflit au sein de mon équipe.

Pour vous aider efficacement, merci de décrire :
- La nature du conflit
- Les parties impliquées
- Le contexte et l'historique
- L'impact sur l'équipe

Je vais proposer :
- Une stratégie de médiation adaptée
- Des scripts de conversation
- Des techniques de désamorçage
- Un plan d'action étape par étape`,
            category: 'employee_relations',
            estimatedTime: '10-15 min',
            hasForm: false
        }
    },

    // ============================================================
    // IT EXPERT WORKFLOWS
    // ============================================================
    it_expert: {
        code_review: {
            id: 'code_review',
            title: 'Review de code',
            icon: '🔍',
            description: 'Analyser du code avec best practices',
            prompt: `Je souhaite faire reviewer du code.

Merci de fournir :
1. Le code source (langage et framework)
2. Le contexte fonctionnel
3. Les points d'attention spécifiques

Je vais effectuer une revue complète incluant :
- Qualité et lisibilité du code
- Sécurité et vulnérabilités potentielles
- Performance et optimisations
- Best practices et patterns
- Suggestions d'amélioration avec exemples`,
            category: 'development',
            estimatedTime: '5-10 min',
            hasForm: false
        },
        debug_error: {
            id: 'debug_error',
            title: 'Débugger une erreur',
            icon: '🐛',
            description: 'Identifier et résoudre un bug',
            prompt: `Je rencontre un bug que je souhaite résoudre.

Informations nécessaires :
1. Message d'erreur complet
2. Stack trace si disponible
3. Code concerné
4. Contexte d'exécution (environnement, inputs)
5. Comportement attendu vs réel

Je vais :
- Analyser la cause racine (root cause analysis)
- Proposer des solutions avec code
- Suggérer des tests pour éviter la régression
- Recommander des améliorations générales`,
            category: 'debugging',
            estimatedTime: '5-10 min',
            hasForm: false
        },
        system_architecture: {
            id: 'system_architecture',
            title: 'Architecture système',
            icon: '🏗️',
            description: 'Concevoir une architecture technique',
            prompt: `Je souhaite concevoir l'architecture d'un système.

Informations nécessaires :
- Objectif du système
- Contraintes techniques (scale, latence, etc.)
- Technologies envisagées
- Contraintes budgétaires/temporelles

Je vais proposer :
- Une architecture détaillée avec diagrammes
- Choix technologiques justifiés
- Patterns architecturaux adaptés (microservices, monolithe, etc.)
- Stratégie de scalabilité
- Considérations sécurité et résilience`,
            category: 'architecture',
            estimatedTime: '15-20 min',
            hasForm: true,
            formFields: [
                { name: 'systemType', label: 'Type de système', type: 'select', options: ['Web application', 'Mobile app', 'API backend', 'Data pipeline', 'Microservices'], required: true },
                { name: 'expectedUsers', label: 'Utilisateurs attendus', type: 'select', options: ['< 1K', '1K - 10K', '10K - 100K', '100K+'], required: true },
                { name: 'criticalRequirements', label: 'Exigences critiques', type: 'textarea', required: false }
            ]
        },
        performance_optimization: {
            id: 'performance_optimization',
            title: 'Optimiser la performance',
            icon: '⚡',
            description: 'Analyser et améliorer les performances',
            prompt: `Je souhaite optimiser les performances de mon application.

Informations nécessaires :
- Type d'application (web, mobile, backend)
- Métriques actuelles (temps de réponse, throughput, etc.)
- Goulots d'étranglement identifiés
- Profiling data si disponible

Je vais proposer :
- Analyse des performances actuelles
- Optimisations prioritaires avec impact estimé
- Code optimisé avec exemples
- Stratégies de caching et indexation
- Monitoring et métriques à suivre`,
            category: 'performance',
            estimatedTime: '10-15 min',
            hasForm: false
        },
        security_audit: {
            id: 'security_audit',
            title: 'Audit sécurité',
            icon: '🔒',
            description: 'Évaluer la sécurité d\'une application',
            prompt: `Je souhaite effectuer un audit de sécurité.

Merci de fournir :
- Architecture de l'application
- Stack technique
- Données sensibles manipulées
- Mécanismes de sécurité actuels

Je vais effectuer :
- Analyse des vulnérabilités OWASP Top 10
- Revue de l'authentification/autorisation
- Évaluation de la protection des données
- Recommandations de sécurisation
- Checklist de mise en conformité (RGPD, etc.)`,
            category: 'security',
            estimatedTime: '15-20 min',
            hasForm: false
        }
    },

    // ============================================================
    // MARKETING EXPERT WORKFLOWS
    // ============================================================
    marketing_expert: {
        create_campaign: {
            id: 'create_campaign',
            title: 'Créer une campagne',
            icon: '🎯',
            description: 'Concevoir une campagne marketing complète',
            prompt: `Je souhaite créer une campagne marketing.

Informations nécessaires :
- Objectif de la campagne (awareness, conversion, rétention)
- Cible (persona, démographie)
- Budget disponible
- Canaux envisagés (social, email, display, etc.)
- Durée de la campagne

Je vais proposer :
- Stratégie de campagne multi-canaux
- Calendrier éditorial
- Messages clés par audience
- KPIs et objectifs mesurables
- Budget allocation par canal`,
            category: 'campaigns',
            estimatedTime: '15-20 min',
            hasForm: true,
            formFields: [
                { name: 'campaignGoal', label: 'Objectif principal', type: 'select', options: ['Awareness', 'Lead generation', 'Conversion', 'Rétention'], required: true },
                { name: 'budget', label: 'Budget', type: 'select', options: ['< 5K€', '5K - 20K€', '20K - 50K€', '50K+€'], required: true },
                { name: 'duration', label: 'Durée', type: 'select', options: ['1 semaine', '1 mois', '3 mois', '6 mois+'], required: true }
            ]
        },
        linkedin_post: {
            id: 'linkedin_post',
            title: 'Post LinkedIn',
            icon: '💼',
            description: 'Rédiger un post LinkedIn engageant',
            prompt: `Je souhaite créer un post LinkedIn impactant.

Informations nécessaires :
- Sujet/message principal
- Objectif (engagement, partage, génération de leads)
- Ton souhaité (professionnel, inspirant, éducatif)
- Call-to-action

Je vais créer :
- 3 variations de post optimisées
- Structure avec hook accrocheur
- Hashtags pertinents
- Suggestions de visuels
- Meilleur timing de publication`,
            category: 'content',
            estimatedTime: '5-7 min',
            hasForm: false
        },
        competitive_analysis: {
            id: 'competitive_analysis',
            title: 'Analyse concurrentielle',
            icon: '📊',
            description: 'Analyser la concurrence et le marché',
            prompt: `Je souhaite effectuer une analyse concurrentielle.

Informations nécessaires :
- Votre produit/service
- Concurrents identifiés (3-5 principaux)
- Marché cible
- Différenciation actuelle

Je vais fournir :
- Matrice concurrentielle (fonctionnalités, prix, positionnement)
- Analyse SWOT de chaque concurrent
- Opportunités de différenciation
- Recommandations stratégiques
- Veille concurrentielle à mettre en place`,
            category: 'strategy',
            estimatedTime: '20-30 min',
            hasForm: true,
            formFields: [
                { name: 'productName', label: 'Votre produit/service', type: 'text', required: true },
                { name: 'competitors', label: 'Concurrents (séparés par des virgules)', type: 'textarea', required: true },
                { name: 'market', label: 'Marché cible', type: 'text', required: true }
            ]
        },
        content_strategy: {
            id: 'content_strategy',
            title: 'Stratégie de contenu',
            icon: '📝',
            description: 'Élaborer un plan de contenu éditorial',
            prompt: `Je souhaite créer une stratégie de contenu.

Informations nécessaires :
- Objectifs marketing (SEO, engagement, expertise)
- Audience cible
- Canaux de diffusion
- Ressources disponibles (équipe, budget)
- Fréquence de publication souhaitée

Je vais créer :
- Piliers de contenu alignés avec vos objectifs
- Calendrier éditorial sur 3 mois
- Mix de formats (blog, vidéo, infographie, etc.)
- Thématiques et angles
- Process de production et validation`,
            category: 'content',
            estimatedTime: '20-25 min',
            hasForm: false
        },
        email_marketing: {
            id: 'email_marketing',
            title: 'Email marketing',
            icon: '📧',
            description: 'Créer une campagne email persuasive',
            prompt: `Je souhaite créer une campagne email marketing.

Informations nécessaires :
- Objectif de l'email (promotion, nurturing, re-engagement)
- Audience ciblée
- Offre ou message principal
- Call-to-action souhaité

Je vais créer :
- Objet d'email accrocheur (3 variations)
- Structure de l'email optimisée
- Copywriting persuasif
- Design et placement des CTA
- Stratégie de test A/B
- Métriques à suivre (open rate, CTR, conversion)`,
            category: 'email',
            estimatedTime: '10-12 min',
            hasForm: true,
            formFields: [
                { name: 'emailGoal', label: 'Objectif', type: 'select', options: ['Promotion', 'Newsletter', 'Nurturing', 'Re-engagement', 'Invitation événement'], required: true },
                { name: 'audience', label: 'Audience', type: 'text', required: true }
            ]
        }
    },

    // ============================================================
    // GENERAL ASSISTANT (No specific workflows - free usage)
    // ============================================================
    lucide_assistant: {}
};

/**
 * Get all workflows for a specific agent profile
 * @param {string} profileId - Agent profile ID
 * @returns {Object} Workflows for the profile
 */
function getWorkflowsForProfile(profileId) {
    return WORKFLOW_TEMPLATES[profileId] || {};
}

/**
 * Get a specific workflow by profile and workflow ID
 * @param {string} profileId - Agent profile ID
 * @param {string} workflowId - Workflow ID
 * @returns {Object|null} Workflow object or null if not found
 */
function getWorkflow(profileId, workflowId) {
    const profileWorkflows = WORKFLOW_TEMPLATES[profileId] || {};
    return profileWorkflows[workflowId] || null;
}

/**
 * Get all workflow IDs for a profile (for quick access)
 * @param {string} profileId - Agent profile ID
 * @returns {Array<string>} Array of workflow IDs
 */
function getWorkflowIds(profileId) {
    const profileWorkflows = WORKFLOW_TEMPLATES[profileId] || {};
    return Object.keys(profileWorkflows);
}

/**
 * Build a complete prompt from a workflow template with form data
 * @param {string} profileId - Agent profile ID
 * @param {string} workflowId - Workflow ID
 * @param {Object} formData - Form data if workflow has a form
 * @returns {string} Complete prompt ready to send to LLM
 */
function buildWorkflowPrompt(profileId, workflowId, formData = {}) {
    const workflow = getWorkflow(profileId, workflowId);
    if (!workflow) return '';

    let prompt = workflow.prompt;

    // If workflow has a form and form data is provided, enrich the prompt
    if (workflow.hasForm && workflow.formFields && Object.keys(formData).length > 0) {
        prompt += '\n\nInformations fournies :\n';
        workflow.formFields.forEach(field => {
            const value = formData[field.name];
            if (value) {
                prompt += `- ${field.label} : ${value}\n`;
            }
        });
    }

    return prompt;
}

module.exports = {
    WORKFLOW_TEMPLATES,
    getWorkflowsForProfile,
    getWorkflow,
    getWorkflowIds,
    buildWorkflowPrompt
};
