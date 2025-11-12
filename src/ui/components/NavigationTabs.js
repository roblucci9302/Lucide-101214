import { html, css, LitElement } from '../assets/lit-core-2.7.4.min.js';

/**
 * NavigationTabs - Navigation par onglets toujours visible
 *
 * Features:
 * - Tabs persistants pour Écoute, Analyse, Réponses, Historique
 * - Badges pour indiquer nouveaux items
 * - Indicateur visuel du tab actif (underline + glow)
 * - Support drag & drop pour réorganisation
 * - Bouton "+" pour tabs custom
 */
export class NavigationTabs extends LitElement {
    static properties = {
        activeTab: { type: String },
        tabs: { type: Array },
        badges: { type: Object },
        accentColor: { type: String }
    };

    static styles = css`
        :host {
            display: block;
            width: 100%;
            background: rgba(0, 0, 0, 0.3);
            backdrop-filter: blur(10px);
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .tabs-container {
            display: flex;
            align-items: center;
            gap: 4px;
            padding: 8px 16px;
            overflow-x: auto;
            scrollbar-width: none; /* Firefox */
        }

        .tabs-container::-webkit-scrollbar {
            display: none; /* Chrome, Safari */
        }

        .tab {
            position: relative;
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 8px 16px;
            min-width: fit-content;
            background: transparent;
            border: none;
            border-radius: var(--radius-md, 8px);
            color: rgba(255, 255, 255, 0.7);
            font-size: 13px;
            font-weight: 500;
            cursor: pointer;
            transition: all var(--timing-fast, 0.2s) var(--easing-standard, ease);
            user-select: none;
        }

        .tab:hover {
            background: rgba(255, 255, 255, 0.08);
            color: rgba(255, 255, 255, 0.9);
        }

        .tab.active {
            color: var(--accent-color, rgba(255, 255, 255, 1));
            background: rgba(255, 255, 255, 0.1);
        }

        /* Underline animé pour tab actif */
        .tab::after {
            content: '';
            position: absolute;
            bottom: -8px;
            left: 50%;
            width: 0%;
            height: 2px;
            background: var(--accent-color, rgba(100, 150, 255, 1));
            transform: translateX(-50%);
            transition: width var(--timing-normal, 0.3s) var(--easing-spring, cubic-bezier(0.34, 1.56, 0.64, 1));
            box-shadow: 0 0 8px var(--accent-color, rgba(100, 150, 255, 0.6));
        }

        .tab.active::after {
            width: 60%;
        }

        .tab-icon {
            font-size: 16px;
            line-height: 1;
            flex-shrink: 0;
        }

        .tab-label {
            white-space: nowrap;
        }

        .tab-badge {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            min-width: 18px;
            height: 18px;
            padding: 0 4px;
            background: var(--accent-color, rgba(100, 150, 255, 0.9));
            color: white;
            font-size: 10px;
            font-weight: 600;
            border-radius: 9px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
            animation: badge-appear 0.3s var(--easing-spring, cubic-bezier(0.34, 1.56, 0.64, 1)) forwards;
        }

        @keyframes badge-appear {
            0% {
                opacity: 0;
                transform: scale(0.5);
            }
            50% {
                transform: scale(1.2);
            }
            100% {
                opacity: 1;
                transform: scale(1);
            }
        }

        .tab-close {
            display: none;
            margin-left: 4px;
            padding: 2px;
            background: transparent;
            border: none;
            color: rgba(255, 255, 255, 0.5);
            font-size: 14px;
            cursor: pointer;
            transition: color 0.15s ease;
        }

        .tab:hover .tab-close {
            display: inline-flex;
        }

        .tab-close:hover {
            color: rgba(255, 255, 255, 0.9);
        }

        .tab-add {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 32px;
            height: 32px;
            margin-left: 8px;
            background: rgba(255, 255, 255, 0.08);
            border: 1px dashed rgba(255, 255, 255, 0.2);
            border-radius: var(--radius-sm, 6px);
            color: rgba(255, 255, 255, 0.6);
            font-size: 18px;
            cursor: pointer;
            transition: all 0.15s ease;
        }

        .tab-add:hover {
            background: rgba(255, 255, 255, 0.12);
            border-color: rgba(255, 255, 255, 0.4);
            color: rgba(255, 255, 255, 0.9);
            transform: scale(1.05);
        }

        /* Drag & Drop styles */
        .tab.dragging {
            opacity: 0.5;
            transform: scale(0.95);
        }

        .tab.drag-over {
            border-left: 2px solid var(--accent-color, rgba(100, 150, 255, 1));
        }

        /* Responsive */
        @media (max-width: 640px) {
            .tab-label {
                display: none;
            }

            .tab {
                padding: 8px 12px;
            }
        }

        /* Glass bypass */
        :host-context(body.has-glass) .tabs-container {
            background: transparent;
            backdrop-filter: none;
        }

        :host-context(body.has-glass) .tab {
            background: transparent !important;
        }

        :host-context(body.has-glass) .tab::after {
            display: none;
        }

        /* Reduced motion */
        @media (prefers-reduced-motion: reduce) {
            .tab,
            .tab::after,
            .tab-badge,
            .tab-add {
                transition: none;
                animation: none;
            }
        }
    `;

    constructor() {
        super();
        this.activeTab = 'listen';
        this.tabs = [
            { id: 'listen', label: 'Écoute', icon: '🎙️', closable: false },
            { id: 'analyze', label: 'Analyse', icon: '📊', closable: false },
            { id: 'responses', label: 'Réponses', icon: '💬', closable: false },
            { id: 'history', label: 'Historique', icon: '📜', closable: false }
        ];
        this.badges = {};
        this.accentColor = 'rgba(100, 150, 255, 1)';
        this.draggedTab = null;
    }

    connectedCallback() {
        super.connectedCallback();
        this.loadTabsFromStorage();
        this.loadAccentColorFromProfile();
    }

    loadTabsFromStorage() {
        const savedTabs = localStorage.getItem('lucide-tabs');
        if (savedTabs) {
            try {
                const parsed = JSON.parse(savedTabs);
                // Merge avec tabs par défaut
                this.tabs = [...this.tabs, ...parsed.filter(t => t.custom)];
            } catch (e) {
                console.warn('[NavigationTabs] Failed to load saved tabs', e);
            }
        }
    }

    loadAccentColorFromProfile() {
        const profile = localStorage.getItem('userProfile') || 'generic';
        const colors = {
            rh: '#FF6B6B',
            exec: '#4ECDC4',
            dev: '#A8E6CF',
            marketing: '#FA58B6',
            support: '#6BCF7F'
        };
        this.accentColor = colors[profile] || 'rgba(100, 150, 255, 1)';
        this.style.setProperty('--accent-color', this.accentColor);
    }

    handleTabClick(tabId) {
        if (this.activeTab === tabId) return;

        this.activeTab = tabId;
        this.dispatchEvent(new CustomEvent('tab-change', {
            detail: { tabId },
            bubbles: true,
            composed: true
        }));

        // Sauvegarder le tab actif
        localStorage.setItem('lucide-active-tab', tabId);
    }

    handleTabClose(tabId, event) {
        event.stopPropagation();

        const tab = this.tabs.find(t => t.id === tabId);
        if (!tab || !tab.closable) return;

        // Retirer le tab
        this.tabs = this.tabs.filter(t => t.id !== tabId);

        // Si le tab fermé était actif, activer le premier
        if (this.activeTab === tabId) {
            this.activeTab = this.tabs[0]?.id || 'listen';
        }

        // Sauvegarder
        this.saveCustomTabs();
        this.requestUpdate();
    }

    handleAddTab() {
        const newTab = {
            id: `custom-${Date.now()}`,
            label: 'Nouveau',
            icon: '📝',
            closable: true,
            custom: true
        };

        this.tabs = [...this.tabs, newTab];
        this.activeTab = newTab.id;

        this.saveCustomTabs();
        this.requestUpdate();

        this.dispatchEvent(new CustomEvent('tab-add', {
            detail: { tab: newTab },
            bubbles: true,
            composed: true
        }));
    }

    saveCustomTabs() {
        const customTabs = this.tabs.filter(t => t.custom);
        localStorage.setItem('lucide-tabs', JSON.stringify(customTabs));
    }

    // Drag & Drop handlers
    handleDragStart(tabId, event) {
        this.draggedTab = tabId;
        event.dataTransfer.effectAllowed = 'move';
        event.target.classList.add('dragging');
    }

    handleDragEnd(event) {
        event.target.classList.remove('dragging');
        this.draggedTab = null;

        // Remove drag-over class from all
        this.shadowRoot.querySelectorAll('.tab').forEach(tab => {
            tab.classList.remove('drag-over');
        });
    }

    handleDragOver(event) {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }

    handleDragEnter(tabId, event) {
        if (this.draggedTab === tabId) return;
        event.target.classList.add('drag-over');
    }

    handleDragLeave(event) {
        event.target.classList.remove('drag-over');
    }

    handleDrop(targetTabId, event) {
        event.preventDefault();
        event.target.classList.remove('drag-over');

        if (this.draggedTab === targetTabId) return;

        // Réorganiser les tabs
        const draggedIndex = this.tabs.findIndex(t => t.id === this.draggedTab);
        const targetIndex = this.tabs.findIndex(t => t.id === targetTabId);

        if (draggedIndex === -1 || targetIndex === -1) return;

        const newTabs = [...this.tabs];
        const [removed] = newTabs.splice(draggedIndex, 1);
        newTabs.splice(targetIndex, 0, removed);

        this.tabs = newTabs;
        this.saveCustomTabs();
        this.requestUpdate();
    }

    setBadge(tabId, count) {
        if (count > 0) {
            this.badges = { ...this.badges, [tabId]: count };
        } else {
            const { [tabId]: removed, ...rest } = this.badges;
            this.badges = rest;
        }
        this.requestUpdate();
    }

    render() {
        return html`
            <div class="tabs-container" role="tablist">
                ${this.tabs.map(tab => html`
                    <button
                        class="tab ${this.activeTab === tab.id ? 'active' : ''}"
                        role="tab"
                        aria-selected="${this.activeTab === tab.id}"
                        aria-controls="tab-panel-${tab.id}"
                        draggable="${tab.closable}"
                        @click="${() => this.handleTabClick(tab.id)}"
                        @dragstart="${(e) => this.handleDragStart(tab.id, e)}"
                        @dragend="${this.handleDragEnd}"
                        @dragover="${this.handleDragOver}"
                        @dragenter="${(e) => this.handleDragEnter(tab.id, e)}"
                        @dragleave="${this.handleDragLeave}"
                        @drop="${(e) => this.handleDrop(tab.id, e)}">
                        <span class="tab-icon">${tab.icon}</span>
                        <span class="tab-label">${tab.label}</span>
                        ${this.badges[tab.id] ? html`
                            <span class="tab-badge">${this.badges[tab.id]}</span>
                        ` : ''}
                        ${tab.closable ? html`
                            <button
                                class="tab-close"
                                @click="${(e) => this.handleTabClose(tab.id, e)}"
                                title="Fermer">
                                ✕
                            </button>
                        ` : ''}
                    </button>
                `)}
                <button
                    class="tab-add"
                    @click="${this.handleAddTab}"
                    title="Ajouter un onglet">
                    +
                </button>
            </div>
        `;
    }
}

customElements.define('navigation-tabs', NavigationTabs);
