import { LitElement, html, css } from '../assets/lit-core-2.7.4.min.js';

/**
 * ThemeToggle - Composant de basculement entre thème clair et sombre
 *
 * @fires theme-changed - Émis lorsque le thème change
 *
 * Fonctionnalités :
 * - Basculement Dark/Light theme
 * - Persistence dans localStorage
 * - Respect de prefers-color-scheme
 * - Animation subtile
 * - Icônes SVG professionnelles
 */
export class ThemeToggle extends LitElement {
    static properties = {
        theme: { type: String, state: true },
        transitioning: { type: Boolean, state: true }
    };

    static THEMES = {
        DARK: 'dark',
        LIGHT: 'light'
    };

    static STORAGE_KEY = 'lucide-theme-preference';

    static styles = css`
        :host {
            display: inline-block;
        }

        .theme-toggle {
            position: relative;
            width: 48px;
            height: 28px;
            background: var(--bg-secondary);
            border: 1px solid var(--border-primary);
            border-radius: 14px;
            cursor: pointer;
            transition: background var(--timing-normal) var(--easing-standard),
                        border-color var(--timing-normal) var(--easing-standard);
            overflow: hidden;
        }

        .theme-toggle:hover {
            background: var(--bg-tertiary);
            border-color: var(--border-hover);
        }

        .theme-toggle:active {
            transform: scale(0.98);
        }

        /* Track avec gradient subtil */
        .toggle-track {
            position: absolute;
            inset: 0;
            border-radius: 14px;
            background: linear-gradient(
                to right,
                rgba(59, 130, 246, 0.1),
                rgba(251, 191, 36, 0.1)
            );
            opacity: 0.5;
        }

        /* Thumb (bouton glissant) */
        .toggle-thumb {
            position: absolute;
            top: 2px;
            left: 2px;
            width: 22px;
            height: 22px;
            background: var(--bg-primary);
            border: 1px solid var(--border-primary);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: transform var(--timing-normal) var(--easing-spring),
                        background var(--timing-normal) var(--easing-standard),
                        box-shadow var(--timing-normal) var(--easing-standard);
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        /* Position pour thème clair */
        :host([theme="light"]) .toggle-thumb {
            transform: translateX(20px);
        }

        /* Glow subtil selon le thème */
        :host([theme="dark"]) .toggle-thumb {
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2),
                        0 0 8px rgba(147, 197, 253, 0.3);
        }

        :host([theme="light"]) .toggle-thumb {
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2),
                        0 0 8px rgba(251, 191, 36, 0.3);
        }

        /* Icônes SVG */
        .icon {
            width: 14px;
            height: 14px;
            fill: var(--text-primary);
            transition: opacity var(--timing-fast) var(--easing-standard),
                        transform var(--timing-fast) var(--easing-standard);
        }

        .icon-moon,
        .icon-sun {
            position: absolute;
        }

        /* Animation de rotation lors du changement */
        :host([transitioning]) .icon {
            animation: icon-spin 0.4s var(--easing-standard);
        }

        @keyframes icon-spin {
            0% {
                transform: rotate(0deg) scale(1);
                opacity: 1;
            }
            50% {
                transform: rotate(180deg) scale(0.8);
                opacity: 0.5;
            }
            100% {
                transform: rotate(360deg) scale(1);
                opacity: 1;
            }
        }

        /* Icône lune (thème sombre) */
        .icon-moon {
            opacity: 1;
        }

        :host([theme="light"]) .icon-moon {
            opacity: 0;
            pointer-events: none;
        }

        /* Icône soleil (thème clair) */
        .icon-sun {
            opacity: 0;
        }

        :host([theme="light"]) .icon-sun {
            opacity: 1;
        }

        /* Respecter reduced motion */
        @media (prefers-reduced-motion: reduce) {
            .theme-toggle,
            .toggle-thumb,
            .icon {
                transition-duration: 0.01ms !important;
                animation-duration: 0.01ms !important;
            }
        }

        /* Accessibilité clavier */
        .theme-toggle:focus-visible {
            outline: 2px solid var(--state-info);
            outline-offset: 2px;
        }

        /* États désactivé */
        :host([disabled]) .theme-toggle {
            opacity: 0.5;
            cursor: not-allowed;
        }
    `;

    constructor() {
        super();
        this.theme = ThemeToggle.THEMES.DARK;
        this.transitioning = false;

        // Charger la préférence sauvegardée ou utiliser la préférence système
        this.initializeTheme();
    }

    /**
     * Initialise le thème au démarrage
     * Priorité : localStorage > prefers-color-scheme > dark (défaut)
     */
    initializeTheme() {
        const savedTheme = localStorage.getItem(ThemeToggle.STORAGE_KEY);

        if (savedTheme && Object.values(ThemeToggle.THEMES).includes(savedTheme)) {
            this.theme = savedTheme;
        } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
            this.theme = ThemeToggle.THEMES.LIGHT;
        } else {
            this.theme = ThemeToggle.THEMES.DARK;
        }

        // Appliquer le thème immédiatement (sans animation au démarrage)
        this.applyTheme(false);
    }

    connectedCallback() {
        super.connectedCallback();

        // Écouter les changements de préférence système
        if (window.matchMedia) {
            this.mediaQueryList = window.matchMedia('(prefers-color-scheme: light)');
            this.handleSystemThemeChange = (e) => {
                // Seulement si l'utilisateur n'a pas de préférence explicite
                if (!localStorage.getItem(ThemeToggle.STORAGE_KEY)) {
                    this.theme = e.matches ? ThemeToggle.THEMES.LIGHT : ThemeToggle.THEMES.DARK;
                    this.applyTheme(true);
                }
            };
            this.mediaQueryList.addEventListener('change', this.handleSystemThemeChange);
        }
    }

    disconnectedCallback() {
        super.disconnectedCallback();

        if (this.mediaQueryList && this.handleSystemThemeChange) {
            this.mediaQueryList.removeEventListener('change', this.handleSystemThemeChange);
        }
    }

    /**
     * Bascule entre dark et light theme
     */
    toggleTheme() {
        this.transitioning = true;

        this.theme = this.theme === ThemeToggle.THEMES.DARK
            ? ThemeToggle.THEMES.LIGHT
            : ThemeToggle.THEMES.DARK;

        this.applyTheme(true);

        // Retirer l'état transitioning après l'animation
        setTimeout(() => {
            this.transitioning = false;
        }, 400);
    }

    /**
     * Applique le thème au document
     * @param {boolean} animated - Si true, applique avec animation
     */
    applyTheme(animated = true) {
        // Sauvegarder la préférence
        localStorage.setItem(ThemeToggle.STORAGE_KEY, this.theme);

        // Appliquer au document HTML (pour content.html et header.html)
        const htmlElements = [];

        // Document actuel (peut être dans un iframe)
        if (document.documentElement) {
            htmlElements.push(document.documentElement);
        }

        // Document parent (si dans iframe)
        if (window.parent && window.parent.document && window.parent.document.documentElement) {
            htmlElements.push(window.parent.document.documentElement);
        }

        // Essayer d'accéder au document de la fenêtre principale via Electron
        if (window.api && window.api.theme) {
            window.api.theme.setTheme(this.theme);
        }

        htmlElements.forEach(htmlElement => {
            if (this.theme === ThemeToggle.THEMES.LIGHT) {
                htmlElement.classList.remove('dark-theme');
                htmlElement.classList.add('light-theme');
            } else {
                htmlElement.classList.remove('light-theme');
                htmlElement.classList.add('dark-theme');
            }
        });

        // Émettre événement pour les autres composants
        this.dispatchEvent(new CustomEvent('theme-changed', {
            detail: { theme: this.theme, animated },
            bubbles: true,
            composed: true
        }));
    }

    /**
     * Définit le thème programmatiquement
     * @param {string} theme - 'dark' ou 'light'
     */
    setTheme(theme) {
        if (Object.values(ThemeToggle.THEMES).includes(theme)) {
            this.theme = theme;
            this.applyTheme(true);
        }
    }

    handleClick() {
        this.toggleTheme();
    }

    handleKeyDown(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.toggleTheme();
        }
    }

    render() {
        return html`
            <button
                class="theme-toggle"
                role="switch"
                aria-checked="${this.theme === ThemeToggle.THEMES.LIGHT}"
                aria-label="Basculer entre thème clair et sombre"
                @click=${this.handleClick}
                @keydown=${this.handleKeyDown}
                tabindex="0">

                <div class="toggle-track"></div>

                <div class="toggle-thumb">
                    <!-- Icône Lune (Dark theme) -->
                    <svg class="icon icon-moon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
                              fill="currentColor"
                              stroke="currentColor"
                              stroke-width="2"
                              stroke-linecap="round"
                              stroke-linejoin="round"/>
                    </svg>

                    <!-- Icône Soleil (Light theme) -->
                    <svg class="icon icon-sun" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="5"
                                fill="currentColor"
                                stroke="currentColor"
                                stroke-width="2"/>
                        <line x1="12" y1="1" x2="12" y2="3"
                              stroke="currentColor"
                              stroke-width="2"
                              stroke-linecap="round"/>
                        <line x1="12" y1="21" x2="12" y2="23"
                              stroke="currentColor"
                              stroke-width="2"
                              stroke-linecap="round"/>
                        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"
                              stroke="currentColor"
                              stroke-width="2"
                              stroke-linecap="round"/>
                        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"
                              stroke="currentColor"
                              stroke-width="2"
                              stroke-linecap="round"/>
                        <line x1="1" y1="12" x2="3" y2="12"
                              stroke="currentColor"
                              stroke-width="2"
                              stroke-linecap="round"/>
                        <line x1="21" y1="12" x2="23" y2="12"
                              stroke="currentColor"
                              stroke-width="2"
                              stroke-linecap="round"/>
                        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"
                              stroke="currentColor"
                              stroke-width="2"
                              stroke-linecap="round"/>
                        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"
                              stroke="currentColor"
                              stroke-width="2"
                              stroke-linecap="round"/>
                    </svg>
                </div>
            </button>
        `;
    }
}

customElements.define('theme-toggle', ThemeToggle);
