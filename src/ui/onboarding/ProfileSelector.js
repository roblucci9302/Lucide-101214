import { html, css, LitElement } from '../assets/lit-core-2.7.4.min.js';

/**
 * ProfileSelector - Sélection du profil utilisateur (onboarding)
 *
 * Permet à l'utilisateur de choisir son rôle pour personnaliser
 * l'expérience Lucide avec un assistant spécialisé.
 *
 * Profils disponibles:
 * - RH (Ressources Humaines)
 * - Exec (Dirigeant)
 * - Dev (Développeur)
 * - Marketing
 * - Support
 * - Autre (générique)
 */
export class ProfileSelector extends LitElement {
    static properties = {
        selectedProfile: { type: String, state: true },
        hoveredProfile: { type: String, state: true }
    };

    static styles = css`
        :host {
            display: block;
            width: 100%;
            height: 100%;
            background: linear-gradient(
                135deg,
                rgba(10, 10, 15, 0.95) 0%,
                rgba(20, 20, 30, 0.95) 100%
            );
            backdrop-filter: blur(40px);
        }

        .profile-selector {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            padding: 48px 24px;
        }

        .header {
            text-align: center;
            margin-bottom: 48px;
        }

        .logo {
            font-size: 48px;
            margin-bottom: 16px;
            animation: logo-glow 2s ease-in-out infinite;
        }

        @keyframes logo-glow {
            0%, 100% {
                opacity: 0.8;
                filter: drop-shadow(0 0 20px rgba(100, 150, 255, 0.5));
            }
            50% {
                opacity: 1;
                filter: drop-shadow(0 0 30px rgba(100, 150, 255, 0.8));
            }
        }

        .title {
            font-size: clamp(24px, 5vw, 36px);
            font-weight: 700;
            color: rgba(255, 255, 255, 0.95);
            margin: 0 0 8px 0;
            font-family: var(--font-display, 'SF Pro Display', sans-serif);
        }

        .subtitle {
            font-size: clamp(14px, 3vw, 18px);
            color: rgba(255, 255, 255, 0.6);
            margin: 0;
        }

        .profiles-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 240px));
            gap: 24px;
            max-width: 900px;
            margin-bottom: 48px;
        }

        .profile-card {
            position: relative;
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 32px 24px;
            background: rgba(30, 30, 40, 0.6);
            backdrop-filter: blur(20px);
            border: 2px solid rgba(255, 255, 255, 0.1);
            border-radius: 16px;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
            overflow: hidden;
        }

        .profile-card::before {
            content: '';
            position: absolute;
            inset: 0;
            background: linear-gradient(
                135deg,
                var(--profile-color, rgba(255, 255, 255, 0.05)) 0%,
                transparent 50%
            );
            opacity: 0;
            transition: opacity 0.3s ease;
        }

        .profile-card:hover::before,
        .profile-card.selected::before {
            opacity: 1;
        }

        .profile-card:hover {
            transform: translateY(-8px) scale(1.02);
            border-color: var(--profile-color, rgba(255, 255, 255, 0.3));
            box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4),
                        0 0 20px var(--profile-color, rgba(255, 255, 255, 0.2));
        }

        .profile-card.selected {
            border-color: var(--profile-color, rgba(100, 150, 255, 1));
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5),
                        0 0 30px var(--profile-color, rgba(100, 150, 255, 0.6));
            background: rgba(40, 40, 50, 0.8);
        }

        .profile-icon {
            font-size: 48px;
            margin-bottom: 16px;
            filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
            transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .profile-card:hover .profile-icon,
        .profile-card.selected .profile-icon {
            transform: scale(1.15);
        }

        .profile-name {
            font-size: 18px;
            font-weight: 600;
            color: rgba(255, 255, 255, 0.95);
            margin: 0 0 8px 0;
            text-align: center;
        }

        .profile-role {
            font-size: 13px;
            color: rgba(255, 255, 255, 0.6);
            margin: 0 0 12px 0;
            text-align: center;
        }

        .profile-description {
            font-size: 12px;
            line-height: 1.5;
            color: rgba(255, 255, 255, 0.5);
            text-align: center;
            margin: 0;
        }

        .selected-indicator {
            position: absolute;
            top: 12px;
            right: 12px;
            width: 24px;
            height: 24px;
            background: var(--profile-color, rgba(100, 150, 255, 1));
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transform: scale(0);
            transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .profile-card.selected .selected-indicator {
            opacity: 1;
            transform: scale(1);
        }

        .checkmark {
            color: white;
            font-size: 14px;
            font-weight: bold;
        }

        .actions {
            display: flex;
            gap: 16px;
        }

        .btn {
            padding: 14px 32px;
            font-size: 15px;
            font-weight: 600;
            border-radius: 12px;
            cursor: pointer;
            transition: all 0.2s ease;
            border: none;
            font-family: inherit;
        }

        .btn-primary {
            background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%);
            color: white;
            box-shadow: 0 4px 16px rgba(99, 102, 241, 0.4);
        }

        .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 24px rgba(99, 102, 241, 0.6);
        }

        .btn-primary:disabled {
            opacity: 0.5;
            cursor: not-allowed;
            transform: none;
        }

        .btn-secondary {
            background: rgba(255, 255, 255, 0.1);
            color: rgba(255, 255, 255, 0.8);
            border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .btn-secondary:hover {
            background: rgba(255, 255, 255, 0.15);
            border-color: rgba(255, 255, 255, 0.3);
        }

        /* Profile-specific colors */
        .profile-card[data-profile="rh"] {
            --profile-color: #FF6B6B;
        }

        .profile-card[data-profile="exec"] {
            --profile-color: #4ECDC4;
        }

        .profile-card[data-profile="dev"] {
            --profile-color: #A8E6CF;
        }

        .profile-card[data-profile="marketing"] {
            --profile-color: #FA58B6;
        }

        .profile-card[data-profile="support"] {
            --profile-color: #6BCF7F;
        }

        .profile-card[data-profile="other"] {
            --profile-color: #95A5A6;
        }

        /* Responsive */
        @media (max-width: 768px) {
            .profiles-grid {
                grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
                gap: 16px;
            }

            .profile-card {
                padding: 24px 16px;
            }

            .profile-icon {
                font-size: 36px;
            }
        }

        /* Reduced motion */
        @media (prefers-reduced-motion: reduce) {
            .profile-card,
            .profile-icon,
            .selected-indicator,
            .btn {
                transition: none;
            }

            .logo {
                animation: none;
            }
        }
    `;

    constructor() {
        super();
        this.selectedProfile = null;
        this.hoveredProfile = null;

        this.profiles = [
            {
                id: 'rh',
                icon: '👥',
                name: 'Ressources Humaines',
                role: 'HR Expert',
                description: 'Assistant RH expert en recrutement, gestion des talents et conformité légale.'
            },
            {
                id: 'exec',
                icon: '💼',
                name: 'Dirigeant',
                role: 'Strategic Advisor',
                description: 'Conseiller stratégique pour analyses de marché et aide à la décision.'
            },
            {
                id: 'dev',
                icon: '💻',
                name: 'Développeur',
                role: 'Senior Developer',
                description: 'Assistant technique expert en code, debugging et architecture logicielle.'
            },
            {
                id: 'marketing',
                icon: '📢',
                name: 'Marketing',
                role: 'Marketing Strategist',
                description: 'Stratège créatif pour campagnes, copywriting et analyse de tendances.'
            },
            {
                id: 'support',
                icon: '🎯',
                name: 'Support',
                role: 'Customer Success',
                description: 'Spécialiste du support client et résolution de problèmes efficace.'
            },
            {
                id: 'other',
                icon: '➕',
                name: 'Autre',
                role: 'General Assistant',
                description: 'Assistant généraliste polyvalent pour tous types de tâches.'
            }
        ];
    }

    handleProfileClick(profileId) {
        this.selectedProfile = profileId;
    }

    handleContinue() {
        if (!this.selectedProfile) return;

        // Sauvegarder le profil
        localStorage.setItem('userProfile', this.selectedProfile);
        localStorage.setItem('onboarding-complete', 'true');

        // Émettre événement
        this.dispatchEvent(new CustomEvent('profile-selected', {
            detail: {
                profileId: this.selectedProfile,
                profile: this.profiles.find(p => p.id === this.selectedProfile)
            },
            bubbles: true,
            composed: true
        }));
    }

    handleSkip() {
        // Définir profil générique par défaut
        localStorage.setItem('userProfile', 'other');
        localStorage.setItem('onboarding-complete', 'true');

        this.dispatchEvent(new CustomEvent('profile-skipped', {
            bubbles: true,
            composed: true
        }));
    }

    render() {
        return html`
            <div class="profile-selector">
                <div class="header">
                    <div class="logo">✨</div>
                    <h1 class="title">Bienvenue dans Lucide</h1>
                    <p class="subtitle">Qui êtes-vous ?</p>
                </div>

                <div class="profiles-grid">
                    ${this.profiles.map(profile => html`
                        <div
                            class="profile-card ${this.selectedProfile === profile.id ? 'selected' : ''}"
                            data-profile="${profile.id}"
                            @click="${() => this.handleProfileClick(profile.id)}"
                            @mouseenter="${() => this.hoveredProfile = profile.id}"
                            @mouseleave="${() => this.hoveredProfile = null}">

                            <div class="selected-indicator">
                                <span class="checkmark">✓</span>
                            </div>

                            <div class="profile-icon">${profile.icon}</div>
                            <h3 class="profile-name">${profile.name}</h3>
                            <div class="profile-role">${profile.role}</div>
                            <p class="profile-description">${profile.description}</p>
                        </div>
                    `)}
                </div>

                <div class="actions">
                    <button
                        class="btn btn-secondary"
                        @click="${this.handleSkip}">
                        Passer
                    </button>
                    <button
                        class="btn btn-primary"
                        ?disabled="${!this.selectedProfile}"
                        @click="${this.handleContinue}">
                        Continuer
                    </button>
                </div>
            </div>
        `;
    }
}

customElements.define('profile-selector', ProfileSelector);
