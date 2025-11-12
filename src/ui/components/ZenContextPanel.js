import { html, css, LitElement } from '../assets/lit-core-2.7.4.min.js';

/**
 * ZenContextPanel - Panel contextuel latéral
 *
 * Affiche :
 * - Profil actif
 * - Documents actifs
 * - Insights générés
 * - Suggestions
 * - Historique récent
 */
export class ZenContextPanel extends LitElement {
    static properties = {
        contextData: { type: Object },
        selectedProfile: { type: String },
        activeSection: { type: String }
    };

    static styles = css`
        :host {
            display: block;
            width: 100%;
            height: 100%;
            overflow-y: auto;
        }

        * {
            font-family: 'Helvetica Neue', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        /* ────────────────[ PANEL CONTAINER ]─────────────── */
        .context-panel {
            display: flex;
            flex-direction: column;
            padding: 16px;
            gap: 16px;
        }

        /* ────────────────[ SECTION ]─────────────── */
        .context-section {
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 12px;
            overflow: hidden;
            transition: all 0.2s ease;
        }

        .context-section.collapsed {
            max-height: 48px;
        }

        .section-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 12px 14px;
            cursor: pointer;
            user-select: none;
            transition: background 0.15s ease;
        }

        .section-header:hover {
            background: rgba(255, 255, 255, 0.05);
        }

        .section-title {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 13px;
            font-weight: 600;
            color: rgba(255, 255, 255, 0.9);
        }

        .section-icon {
            font-size: 16px;
        }

        .section-badge {
            background: rgba(139, 92, 246, 0.3);
            border: 1px solid rgba(139, 92, 246, 0.5);
            border-radius: 10px;
            padding: 2px 8px;
            font-size: 11px;
            font-weight: 600;
            color: rgba(255, 255, 255, 0.9);
        }

        .section-toggle {
            font-size: 12px;
            color: rgba(255, 255, 255, 0.5);
            transition: transform 0.2s ease;
        }

        .context-section.collapsed .section-toggle {
            transform: rotate(-90deg);
        }

        .section-content {
            padding: 0 14px 14px 14px;
            display: flex;
            flex-direction: column;
            gap: 8px;
        }

        /* ────────────────[ PROFILE CARD ]─────────────── */
        .profile-card {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 12px;
            background: rgba(139, 92, 246, 0.15);
            border: 1px solid rgba(139, 92, 246, 0.3);
            border-radius: 10px;
        }

        .profile-avatar {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: linear-gradient(135deg, rgba(139, 92, 246, 0.4) 0%, rgba(167, 139, 250, 0.4) 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            border: 2px solid rgba(139, 92, 246, 0.5);
        }

        .profile-info {
            flex: 1;
        }

        .profile-name {
            font-size: 13px;
            font-weight: 600;
            color: rgba(255, 255, 255, 0.95);
            margin-bottom: 2px;
        }

        .profile-role {
            font-size: 11px;
            color: rgba(255, 255, 255, 0.6);
        }

        /* ────────────────[ ITEM LIST ]─────────────── */
        .context-item {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 10px 12px;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.15s ease;
        }

        .context-item:hover {
            background: rgba(255, 255, 255, 0.08);
            border-color: rgba(255, 255, 255, 0.15);
            transform: translateX(2px);
        }

        .item-icon {
            font-size: 18px;
            flex-shrink: 0;
        }

        .item-content {
            flex: 1;
            min-width: 0;
        }

        .item-title {
            font-size: 12px;
            font-weight: 500;
            color: rgba(255, 255, 255, 0.9);
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .item-subtitle {
            font-size: 11px;
            color: rgba(255, 255, 255, 0.5);
            margin-top: 2px;
        }

        .item-action {
            font-size: 12px;
            color: rgba(255, 255, 255, 0.4);
            flex-shrink: 0;
        }

        /* ────────────────[ INSIGHT CARD ]─────────────── */
        .insight-card {
            padding: 12px;
            background: linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.1) 100%);
            border: 1px solid rgba(16, 185, 129, 0.2);
            border-radius: 10px;
        }

        .insight-title {
            font-size: 12px;
            font-weight: 600;
            color: rgba(16, 185, 129, 1);
            margin-bottom: 6px;
            display: flex;
            align-items: center;
            gap: 6px;
        }

        .insight-text {
            font-size: 12px;
            line-height: 1.5;
            color: rgba(255, 255, 255, 0.85);
        }

        /* ────────────────[ EMPTY STATE ]─────────────── */
        .empty-state {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 24px 12px;
            text-align: center;
            color: rgba(255, 255, 255, 0.4);
        }

        .empty-icon {
            font-size: 32px;
            opacity: 0.5;
            margin-bottom: 8px;
        }

        .empty-text {
            font-size: 12px;
            line-height: 1.4;
        }

        /* ────────────────[ STATS ]─────────────── */
        .stats-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 8px;
        }

        .stat-card {
            padding: 10px;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 8px;
            text-align: center;
        }

        .stat-value {
            font-size: 20px;
            font-weight: 600;
            color: rgba(255, 255, 255, 0.95);
            margin-bottom: 4px;
        }

        .stat-label {
            font-size: 10px;
            color: rgba(255, 255, 255, 0.5);
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        /* ────────────────[ QUICK ACTIONS ]─────────────── */
        .quick-actions {
            display: flex;
            flex-direction: column;
            gap: 6px;
        }

        .quick-action-btn {
            padding: 10px 12px;
            background: rgba(255, 255, 255, 0.08);
            border: 1px solid rgba(255, 255, 255, 0.12);
            border-radius: 8px;
            color: rgba(255, 255, 255, 0.9);
            font-size: 12px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.15s ease;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .quick-action-btn:hover {
            background: rgba(255, 255, 255, 0.12);
            border-color: rgba(255, 255, 255, 0.2);
            transform: translateX(2px);
        }

        /* ────────────────[ GLASS BYPASS ]─────────────── */
        :host-context(body.has-glass) .context-section,
        :host-context(body.has-glass) .profile-card,
        :host-context(body.has-glass) .context-item,
        :host-context(body.has-glass) .insight-card,
        :host-context(body.has-glass) .stat-card,
        :host-context(body.has-glass) .quick-action-btn {
            background: transparent !important;
            border: none !important;
        }

        :host-context(body.has-glass) .section-header:hover,
        :host-context(body.has-glass) .context-item:hover,
        :host-context(body.has-glass) .quick-action-btn:hover {
            background: transparent !important;
            transform: none !important;
        }

        /* ────────────────[ SCROLLBAR ]─────────────── */
        :host::-webkit-scrollbar {
            width: 4px;
        }

        :host::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.05);
        }

        :host::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.2);
            border-radius: 2px;
        }
    `;

    constructor() {
        super();
        this.contextData = {};
        this.selectedProfile = 'lucide_assistant';
        this.activeSection = 'all'; // 'all', 'profile', 'documents', 'insights', 'history'
        this.collapsedSections = new Set();
    }

    getProfileInfo() {
        const profiles = {
            'rh': {
                icon: '👥',
                name: 'Expert RH',
                role: 'Ressources Humaines'
            },
            'exec': {
                icon: '💼',
                name: 'Assistant Exec',
                role: 'Direction / Management'
            },
            'dev': {
                icon: '💻',
                name: 'Dev Assistant',
                role: 'Développement Logiciel'
            },
            'marketing': {
                icon: '📢',
                name: 'Marketing Expert',
                role: 'Marketing & Communication'
            },
            'support': {
                icon: '🎧',
                name: 'Support Expert',
                role: 'Service Client'
            },
            'lucide_assistant': {
                icon: '✨',
                name: 'Lucide',
                role: 'Assistant Général'
            }
        };

        return profiles[this.selectedProfile] || profiles['lucide_assistant'];
    }

    toggleSection(sectionId) {
        if (this.collapsedSections.has(sectionId)) {
            this.collapsedSections.delete(sectionId);
        } else {
            this.collapsedSections.add(sectionId);
        }
        this.requestUpdate();
    }

    renderSection(id, icon, title, badge, content) {
        const isCollapsed = this.collapsedSections.has(id);

        return html`
            <div class="context-section ${isCollapsed ? 'collapsed' : ''}">
                <div class="section-header" @click="${() => this.toggleSection(id)}">
                    <div class="section-title">
                        <span class="section-icon">${icon}</span>
                        <span>${title}</span>
                        ${badge ? html`<span class="section-badge">${badge}</span>` : ''}
                    </div>
                    <span class="section-toggle">▼</span>
                </div>
                ${!isCollapsed ? html`
                    <div class="section-content">
                        ${content}
                    </div>
                ` : ''}
            </div>
        `;
    }

    renderProfileSection() {
        const profile = this.getProfileInfo();

        return this.renderSection(
            'profile',
            '👤',
            'Profil Actif',
            null,
            html`
                <div class="profile-card">
                    <div class="profile-avatar">${profile.icon}</div>
                    <div class="profile-info">
                        <div class="profile-name">${profile.name}</div>
                        <div class="profile-role">${profile.role}</div>
                    </div>
                </div>

                <div class="quick-actions">
                    <button class="quick-action-btn" @click="${() => this.changeProfile()}">
                        🔄 Changer de profil
                    </button>
                </div>
            `
        );
    }

    renderDocumentsSection() {
        const documents = this.contextData?.documents || [];

        const content = documents.length > 0 ? html`
            ${documents.map(doc => html`
                <div class="context-item" @click="${() => this.openDocument(doc)}">
                    <span class="item-icon">📄</span>
                    <div class="item-content">
                        <div class="item-title">${doc.name}</div>
                        <div class="item-subtitle">${doc.type} • ${doc.size}</div>
                    </div>
                    <span class="item-action">→</span>
                </div>
            `)}
        ` : html`
            <div class="empty-state">
                <div class="empty-icon">📭</div>
                <div class="empty-text">Aucun document actif</div>
            </div>
        `;

        return this.renderSection(
            'documents',
            '📚',
            'Documents',
            documents.length > 0 ? documents.length : null,
            content
        );
    }

    renderInsightsSection() {
        const insights = this.contextData?.insights || [];

        const content = insights.length > 0 ? html`
            ${insights.map(insight => html`
                <div class="insight-card">
                    <div class="insight-title">
                        💡 ${insight.title}
                    </div>
                    <div class="insight-text">${insight.text}</div>
                </div>
            `)}
        ` : html`
            <div class="empty-state">
                <div class="empty-icon">💭</div>
                <div class="empty-text">Aucun insight généré</div>
            </div>
        `;

        return this.renderSection(
            'insights',
            '💡',
            'Insights',
            insights.length > 0 ? insights.length : null,
            content
        );
    }

    renderStatsSection() {
        const stats = this.contextData?.stats || {
            messages: 0,
            sessions: 0,
            documents: 0,
            insights: 0
        };

        return this.renderSection(
            'stats',
            '📊',
            'Statistiques',
            null,
            html`
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-value">${stats.messages}</div>
                        <div class="stat-label">Messages</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">${stats.sessions}</div>
                        <div class="stat-label">Sessions</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">${stats.documents}</div>
                        <div class="stat-label">Documents</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">${stats.insights}</div>
                        <div class="stat-label">Insights</div>
                    </div>
                </div>
            `
        );
    }

    renderHistorySection() {
        const history = this.contextData?.history || [];

        const content = history.length > 0 ? html`
            ${history.map(item => html`
                <div class="context-item" @click="${() => this.openHistory(item)}">
                    <span class="item-icon">🕐</span>
                    <div class="item-content">
                        <div class="item-title">${item.title}</div>
                        <div class="item-subtitle">${item.time}</div>
                    </div>
                    <span class="item-action">→</span>
                </div>
            `)}
        ` : html`
            <div class="empty-state">
                <div class="empty-icon">📜</div>
                <div class="empty-text">Historique vide</div>
            </div>
        `;

        return this.renderSection(
            'history',
            '📜',
            'Historique',
            history.length > 0 ? history.length : null,
            content
        );
    }

    changeProfile() {
        this.dispatchEvent(new CustomEvent('change-profile', {
            bubbles: true,
            composed: true
        }));
    }

    openDocument(doc) {
        this.dispatchEvent(new CustomEvent('open-document', {
            detail: { document: doc },
            bubbles: true,
            composed: true
        }));
    }

    openHistory(item) {
        this.dispatchEvent(new CustomEvent('open-history', {
            detail: { item },
            bubbles: true,
            composed: true
        }));
    }

    render() {
        return html`
            <div class="context-panel">
                ${this.renderProfileSection()}
                ${this.renderDocumentsSection()}
                ${this.renderInsightsSection()}
                ${this.renderStatsSection()}
                ${this.renderHistorySection()}
            </div>
        `;
    }
}

customElements.define('zen-context-panel', ZenContextPanel);
