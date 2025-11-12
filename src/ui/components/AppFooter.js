import { html, css, LitElement } from '../assets/lit-core-2.7.4.min.js';

/**
 * AppFooter - Footer avec indicateur de profil et quick access
 *
 * Features:
 * - Indicateur du profil utilisateur actuel
 * - Quick access aux Settings
 * - Statistiques d'utilisation
 * - Statut de synchronisation
 * - Version de l'application
 */
export class AppFooter extends LitElement {
    static properties = {
        profile: { type: String },
        lastSync: { type: Number },
        version: { type: String },
        syncStatus: { type: String },
        stats: { type: Object }
    };

    static styles = css`
        :host {
            display: block;
            width: 100%;
        }

        .app-footer {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 12px 20px;
            background: rgba(0, 0, 0, 0.4);
            backdrop-filter: blur(10px);
            border-top: 1px solid rgba(255, 255, 255, 0.08);
            font-size: 12px;
            color: rgba(255, 255, 255, 0.6);
            gap: 16px;
        }

        .footer-section {
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .footer-left {
            flex: 1;
            min-width: 0;
        }

        .footer-center {
            flex-shrink: 0;
        }

        .footer-right {
            flex: 1;
            justify-content: flex-end;
            text-align: right;
        }

        .footer-btn {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 6px 12px;
            background: transparent;
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 6px;
            color: rgba(255, 255, 255, 0.7);
            font-size: 12px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.15s ease;
            font-family: inherit;
        }

        .footer-btn:hover {
            background: rgba(255, 255, 255, 0.08);
            border-color: rgba(255, 255, 255, 0.2);
            color: rgba(255, 255, 255, 0.9);
        }

        .footer-btn.active {
            background: var(--accent-color, rgba(100, 150, 255, 0.15));
            border-color: var(--accent-color, rgba(100, 150, 255, 0.4));
            color: var(--accent-color, rgba(100, 150, 255, 1));
        }

        .profile-indicator {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 6px 10px;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 6px;
            border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .profile-indicator::before {
            content: '';
            width: 8px;
            height: 8px;
            background: var(--accent-color, rgba(100, 150, 255, 1));
            border-radius: 50%;
            box-shadow: 0 0 8px var(--accent-color, rgba(100, 150, 255, 0.6));
        }

        .profile-name {
            font-weight: 500;
            color: rgba(255, 255, 255, 0.9);
        }

        .sync-status {
            display: inline-flex;
            align-items: center;
            gap: 4px;
            padding: 4px 8px;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 4px;
            font-size: 11px;
        }

        .sync-status.syncing {
            color: rgba(100, 150, 255, 0.9);
        }

        .sync-status.synced {
            color: rgba(50, 200, 100, 0.9);
        }

        .sync-status.error {
            color: rgba(255, 100, 100, 0.9);
        }

        .sync-icon {
            width: 12px;
            height: 12px;
            animation: spin 1s linear infinite;
        }

        .sync-status:not(.syncing) .sync-icon {
            animation: none;
        }

        @keyframes spin {
            to { transform: rotate(360deg); }
        }

        .version {
            font-size: 11px;
            color: rgba(255, 255, 255, 0.4);
            font-family: var(--font-mono, monospace);
        }

        .stats-summary {
            display: inline-flex;
            align-items: center;
            gap: 12px;
            padding: 4px 0;
        }

        .stat-item {
            display: inline-flex;
            align-items: center;
            gap: 4px;
            font-size: 11px;
        }

        .stat-icon {
            opacity: 0.6;
        }

        .stat-value {
            font-weight: 500;
            color: rgba(255, 255, 255, 0.8);
        }

        /* Responsive */
        @media (max-width: 768px) {
            .app-footer {
                flex-direction: column;
                gap: 8px;
                padding: 12px 16px;
            }

            .footer-section {
                width: 100%;
                justify-content: center;
            }

            .footer-left,
            .footer-right {
                text-align: center;
            }

            .stats-summary {
                flex-wrap: wrap;
                justify-content: center;
            }
        }

        /* Glass bypass */
        :host-context(body.has-glass) .app-footer {
            background: transparent;
            backdrop-filter: none;
        }

        :host-context(body.has-glass) .footer-btn,
        :host-context(body.has-glass) .profile-indicator,
        :host-context(body.has-glass) .sync-status {
            background: transparent;
            border: none;
        }

        /* Reduced motion */
        @media (prefers-reduced-motion: reduce) {
            .footer-btn,
            .sync-icon {
                transition: none;
                animation: none;
            }
        }
    `;

    constructor() {
        super();
        this.profile = localStorage.getItem('userProfile') || 'other';
        this.lastSync = Date.now();
        this.version = '0.3.0'; // Version avec refonte UX
        this.syncStatus = 'synced';
        this.stats = {
            sessions: 0,
            questions: 0,
            responses: 0
        };

        this.syncInterval = null;
        this.loadAccentColorFromProfile();
    }

    connectedCallback() {
        super.connectedCallback();
        this.loadStats();
        this.startSyncMonitor();

        // Écouter changements de profil
        window.addEventListener('profile-changed', this.handleProfileChange.bind(this));
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this.stopSyncMonitor();
        window.removeEventListener('profile-changed', this.handleProfileChange.bind(this));
    }

    loadAccentColorFromProfile() {
        const colors = {
            rh: '#FF6B6B',
            exec: '#4ECDC4',
            dev: '#A8E6CF',
            marketing: '#FA58B6',
            support: '#6BCF7F'
        };
        const color = colors[this.profile] || 'rgba(100, 150, 255, 1)';
        this.style.setProperty('--accent-color', color);
    }

    handleProfileChange(event) {
        this.profile = event.detail.profile;
        this.loadAccentColorFromProfile();
        this.requestUpdate();
    }

    loadStats() {
        // Charger depuis localStorage
        const savedStats = localStorage.getItem('lucide-stats');
        if (savedStats) {
            try {
                this.stats = JSON.parse(savedStats);
            } catch (e) {
                console.warn('[AppFooter] Failed to load stats', e);
            }
        }
    }

    saveStats() {
        localStorage.setItem('lucide-stats', JSON.stringify(this.stats));
    }

    startSyncMonitor() {
        // Vérifier le statut de sync toutes les 30 secondes
        this.syncInterval = setInterval(() => {
            this.checkSyncStatus();
        }, 30000);
    }

    stopSyncMonitor() {
        if (this.syncInterval) {
            clearInterval(this.syncInterval);
            this.syncInterval = null;
        }
    }

    async checkSyncStatus() {
        // TODO: Vérifier vraie sync avec le backend
        this.syncStatus = 'synced';
        this.lastSync = Date.now();
        this.requestUpdate();
    }

    handleProfileClick() {
        // Ouvrir modal de changement de profil
        this.dispatchEvent(new CustomEvent('open-profile-selector', {
            bubbles: true,
            composed: true
        }));
    }

    handleSettingsClick() {
        // Ouvrir settings
        if (window.api) {
            window.api.mainHeader.showSettingsWindow();
        }
    }

    handleStatsClick() {
        // Ouvrir fenêtre de stats détaillées
        this.dispatchEvent(new CustomEvent('open-stats', {
            bubbles: true,
            composed: true
        }));
    }

    getProfileLabel() {
        const labels = {
            rh: 'Ressources Humaines',
            exec: 'Dirigeant',
            dev: 'Développeur',
            marketing: 'Marketing',
            support: 'Support',
            other: 'Général'
        };
        return labels[this.profile] || 'Général';
    }

    formatLastSync() {
        if (!this.lastSync) return 'Jamais';

        const now = Date.now();
        const diff = now - this.lastSync;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (minutes < 1) return 'À l\'instant';
        if (minutes < 60) return `il y a ${minutes} min`;
        if (hours < 24) return `il y a ${hours}h`;
        return `il y a ${days}j`;
    }

    getSyncStatusIcon() {
        switch (this.syncStatus) {
            case 'syncing':
                return html`
                    <svg class="sync-icon" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41zm-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9z"/>
                        <path d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5.002 5.002 0 0 0 8 3zM3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9H3.1z"/>
                    </svg>
                `;
            case 'synced':
                return '✓';
            case 'error':
                return '⚠';
            default:
                return '○';
        }
    }

    render() {
        return html`
            <footer class="app-footer">
                <div class="footer-section footer-left">
                    <button class="footer-btn" @click="${this.handleProfileClick}">
                        <span>👤</span>
                        <span class="profile-name">${this.getProfileLabel()}</span>
                    </button>
                </div>

                <div class="footer-section footer-center">
                    <button class="footer-btn" @click="${this.handleSettingsClick}">
                        <span>⚙️</span>
                        <span>Paramètres</span>
                    </button>
                    <button class="footer-btn" @click="${this.handleStatsClick}">
                        <span>📊</span>
                        <span>Statistiques</span>
                    </button>
                </div>

                <div class="footer-section footer-right">
                    <div class="stats-summary">
                        <div class="stat-item">
                            <span class="stat-icon">🎙️</span>
                            <span class="stat-value">${this.stats.sessions}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-icon">💬</span>
                            <span class="stat-value">${this.stats.responses}</span>
                        </div>
                    </div>
                    <span class="sync-status ${this.syncStatus}">
                        ${this.getSyncStatusIcon()}
                        ${this.formatLastSync()}
                    </span>
                    <span class="version">v${this.version}</span>
                </div>
            </footer>
        `;
    }
}

customElements.define('app-footer', AppFooter);
