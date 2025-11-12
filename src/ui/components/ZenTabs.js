import { html, css, LitElement } from '../assets/lit-core-2.7.4.min.js';

/**
 * ZenTabs - Multi-conversation tabs
 *
 * Features:
 * - Multiple conversations open simultaneously
 * - Drag & drop to reorder tabs
 * - Badges for notifications
 * - Close tabs (except first one)
 * - Active tab indicator
 * - Keyboard navigation (⌘1-9)
 */
export class ZenTabs extends LitElement {
    static properties = {
        tabs: { type: Array },
        activeTabId: { type: String },
        draggedTabId: { type: String },
        maxTabs: { type: Number }
    };

    static styles = css`
        :host {
            display: block;
            width: 100%;
        }

        * {
            font-family: 'Helvetica Neue', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        /* ────────────────[ TABS CONTAINER ]─────────────── */
        .tabs-container {
            display: flex;
            align-items: center;
            gap: 4px;
            padding: 8px 12px;
            background: rgba(0, 0, 0, 0.3);
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            overflow-x: auto;
            overflow-y: hidden;
        }

        .tabs-container::-webkit-scrollbar {
            height: 4px;
        }

        .tabs-container::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.05);
        }

        .tabs-container::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.2);
            border-radius: 2px;
        }

        /* ────────────────[ TAB ]─────────────── */
        .tab {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 8px 12px;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.15s ease;
            min-width: 140px;
            max-width: 200px;
            user-select: none;
            position: relative;
        }

        .tab:hover {
            background: rgba(255, 255, 255, 0.08);
            border-color: rgba(255, 255, 255, 0.15);
        }

        .tab.active {
            background: linear-gradient(135deg, rgba(139, 92, 246, 0.3) 0%, rgba(167, 139, 250, 0.3) 100%);
            border-color: rgba(139, 92, 246, 0.5);
        }

        .tab.dragging {
            opacity: 0.5;
            cursor: grabbing;
        }

        .tab.drag-over {
            border-color: rgba(139, 92, 246, 0.8);
            box-shadow: 0 0 8px rgba(139, 92, 246, 0.4);
        }

        /* ────────────────[ TAB CONTENT ]─────────────── */
        .tab-icon {
            font-size: 16px;
            flex-shrink: 0;
        }

        .tab-content {
            flex: 1;
            min-width: 0;
            display: flex;
            flex-direction: column;
            gap: 2px;
        }

        .tab-title {
            font-size: 13px;
            font-weight: 500;
            color: rgba(255, 255, 255, 0.9);
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .tab.active .tab-title {
            color: rgba(255, 255, 255, 1);
        }

        .tab-subtitle {
            font-size: 11px;
            color: rgba(255, 255, 255, 0.5);
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        /* ────────────────[ TAB BADGE ]─────────────── */
        .tab-badge {
            position: absolute;
            top: -4px;
            right: -4px;
            min-width: 18px;
            height: 18px;
            padding: 0 5px;
            background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
            border: 2px solid rgba(20, 20, 30, 1);
            border-radius: 10px;
            font-size: 10px;
            font-weight: 600;
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 4px rgba(239, 68, 68, 0.4);
            animation: badgePulse 2s ease-in-out infinite;
        }

        @keyframes badgePulse {
            0%, 100% {
                transform: scale(1);
            }
            50% {
                transform: scale(1.1);
            }
        }

        /* ────────────────[ TAB CLOSE ]─────────────── */
        .tab-close {
            width: 18px;
            height: 18px;
            border-radius: 4px;
            background: transparent;
            border: none;
            color: rgba(255, 255, 255, 0.5);
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
            transition: all 0.15s ease;
            flex-shrink: 0;
            opacity: 0;
        }

        .tab:hover .tab-close {
            opacity: 1;
        }

        .tab-close:hover {
            background: rgba(239, 68, 68, 0.3);
            color: rgba(255, 255, 255, 0.9);
        }

        .tab-close:active {
            transform: scale(0.9);
        }

        /* ────────────────[ NEW TAB BUTTON ]─────────────── */
        .tab-add {
            width: 36px;
            height: 36px;
            border-radius: 8px;
            background: rgba(255, 255, 255, 0.08);
            border: 1px solid rgba(255, 255, 255, 0.12);
            color: rgba(255, 255, 255, 0.7);
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;
            transition: all 0.15s ease;
            flex-shrink: 0;
        }

        .tab-add:hover {
            background: rgba(255, 255, 255, 0.12);
            border-color: rgba(255, 255, 255, 0.2);
            color: rgba(255, 255, 255, 1);
        }

        .tab-add:active {
            transform: scale(0.95);
        }

        .tab-add:disabled {
            opacity: 0.4;
            cursor: not-allowed;
        }

        /* ────────────────[ TAB STATUS ]─────────────── */
        .tab-status {
            width: 6px;
            height: 6px;
            border-radius: 50%;
            flex-shrink: 0;
        }

        .tab-status.idle {
            background: rgba(255, 255, 255, 0.3);
        }

        .tab-status.active {
            background: #10b981;
            box-shadow: 0 0 6px rgba(16, 185, 129, 0.6);
        }

        .tab-status.processing {
            background: #fbbf24;
            animation: statusPulse 1s ease-in-out infinite;
        }

        .tab-status.error {
            background: #ef4444;
        }

        @keyframes statusPulse {
            0%, 100% {
                opacity: 1;
            }
            50% {
                opacity: 0.5;
            }
        }

        /* ────────────────[ GLASS BYPASS ]─────────────── */
        :host-context(body.has-glass) .tabs-container {
            background: transparent !important;
            border: none !important;
        }

        :host-context(body.has-glass) .tab {
            background: transparent !important;
            border: none !important;
        }

        :host-context(body.has-glass) .tab:hover,
        :host-context(body.has-glass) .tab.active {
            background: transparent !important;
        }

        /* ────────────────[ RESPONSIVE ]─────────────── */
        @media (max-width: 768px) {
            .tab {
                min-width: 120px;
                max-width: 160px;
            }

            .tab-subtitle {
                display: none;
            }
        }
    `;

    constructor() {
        super();
        this.tabs = [
            {
                id: '1',
                icon: '✨',
                title: 'Nouvelle conversation',
                subtitle: 'Conversation active',
                status: 'active',
                badge: 0,
                closable: false
            }
        ];
        this.activeTabId = '1';
        this.draggedTabId = null;
        this.maxTabs = 10;
    }

    connectedCallback() {
        super.connectedCallback();
        this._keydownHandler = this.handleKeydown.bind(this);
        window.addEventListener('keydown', this._keydownHandler);
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        if (this._keydownHandler) {
            window.removeEventListener('keydown', this._keydownHandler);
        }
    }

    handleKeydown(e) {
        // ⌘1-9 to switch tabs
        if ((e.metaKey || e.ctrlKey) && e.key >= '1' && e.key <= '9') {
            e.preventDefault();
            const index = parseInt(e.key) - 1;
            if (index < this.tabs.length) {
                this.selectTab(this.tabs[index].id);
            }
        }

        // ⌘W to close current tab
        if ((e.metaKey || e.ctrlKey) && e.key === 'w') {
            e.preventDefault();
            const activeTab = this.tabs.find(t => t.id === this.activeTabId);
            if (activeTab && activeTab.closable) {
                this.closeTab(this.activeTabId);
            }
        }

        // ⌘⇧] to next tab
        if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === ']') {
            e.preventDefault();
            this.nextTab();
        }

        // ⌘⇧[ to previous tab
        if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === '[') {
            e.preventDefault();
            this.previousTab();
        }
    }

    selectTab(tabId) {
        if (this.activeTabId === tabId) return;

        this.activeTabId = tabId;

        this.dispatchEvent(new CustomEvent('tab-changed', {
            detail: { tabId },
            bubbles: true,
            composed: true
        }));

        this.requestUpdate();
    }

    closeTab(tabId, e) {
        if (e) {
            e.stopPropagation();
        }

        const tab = this.tabs.find(t => t.id === tabId);
        if (!tab || !tab.closable) return;

        // Find next tab to activate
        const index = this.tabs.findIndex(t => t.id === tabId);
        const nextTab = this.tabs[index + 1] || this.tabs[index - 1];

        // Remove tab
        this.tabs = this.tabs.filter(t => t.id !== tabId);

        // Switch to next tab if closing active
        if (this.activeTabId === tabId && nextTab) {
            this.selectTab(nextTab.id);
        }

        this.dispatchEvent(new CustomEvent('tab-closed', {
            detail: { tabId },
            bubbles: true,
            composed: true
        }));

        this.requestUpdate();
    }

    addTab() {
        if (this.tabs.length >= this.maxTabs) {
            console.warn('[ZenTabs] Maximum tabs reached');
            return;
        }

        const newTab = {
            id: Date.now().toString(),
            icon: '💬',
            title: `Conversation ${this.tabs.length + 1}`,
            subtitle: 'Nouvelle conversation',
            status: 'idle',
            badge: 0,
            closable: true
        };

        this.tabs = [...this.tabs, newTab];
        this.selectTab(newTab.id);

        this.dispatchEvent(new CustomEvent('tab-added', {
            detail: { tab: newTab },
            bubbles: true,
            composed: true
        }));

        this.requestUpdate();
    }

    nextTab() {
        const currentIndex = this.tabs.findIndex(t => t.id === this.activeTabId);
        const nextIndex = (currentIndex + 1) % this.tabs.length;
        this.selectTab(this.tabs[nextIndex].id);
    }

    previousTab() {
        const currentIndex = this.tabs.findIndex(t => t.id === this.activeTabId);
        const prevIndex = (currentIndex - 1 + this.tabs.length) % this.tabs.length;
        this.selectTab(this.tabs[prevIndex].id);
    }

    updateTabBadge(tabId, badge) {
        const tab = this.tabs.find(t => t.id === tabId);
        if (tab) {
            tab.badge = badge;
            this.requestUpdate();
        }
    }

    updateTabStatus(tabId, status) {
        const tab = this.tabs.find(t => t.id === tabId);
        if (tab) {
            tab.status = status;
            this.requestUpdate();
        }
    }

    // ────────────────[ DRAG & DROP ]─────────────── //

    handleDragStart(e, tabId) {
        this.draggedTabId = tabId;
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', tabId);

        // Add dragging class after a short delay
        setTimeout(() => {
            const tab = this.shadowRoot.querySelector(`[data-tab-id="${tabId}"]`);
            if (tab) tab.classList.add('dragging');
        }, 0);
    }

    handleDragEnd(e, tabId) {
        this.draggedTabId = null;

        // Remove all drag classes
        const tabs = this.shadowRoot.querySelectorAll('.tab');
        tabs.forEach(tab => {
            tab.classList.remove('dragging', 'drag-over');
        });

        this.requestUpdate();
    }

    handleDragOver(e, tabId) {
        if (this.draggedTabId === tabId) return;

        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';

        // Add drag-over class
        const tab = this.shadowRoot.querySelector(`[data-tab-id="${tabId}"]`);
        if (tab) tab.classList.add('drag-over');
    }

    handleDragLeave(e, tabId) {
        const tab = this.shadowRoot.querySelector(`[data-tab-id="${tabId}"]`);
        if (tab) tab.classList.remove('drag-over');
    }

    handleDrop(e, targetTabId) {
        e.preventDefault();

        if (!this.draggedTabId || this.draggedTabId === targetTabId) return;

        // Find indices
        const draggedIndex = this.tabs.findIndex(t => t.id === this.draggedTabId);
        const targetIndex = this.tabs.findIndex(t => t.id === targetTabId);

        // Reorder tabs
        const newTabs = [...this.tabs];
        const [draggedTab] = newTabs.splice(draggedIndex, 1);
        newTabs.splice(targetIndex, 0, draggedTab);

        this.tabs = newTabs;

        // Remove drag-over class
        const tab = this.shadowRoot.querySelector(`[data-tab-id="${targetTabId}"]`);
        if (tab) tab.classList.remove('drag-over');

        this.dispatchEvent(new CustomEvent('tabs-reordered', {
            detail: { tabs: this.tabs },
            bubbles: true,
            composed: true
        }));

        this.requestUpdate();
    }

    renderTab(tab, index) {
        const isActive = tab.id === this.activeTabId;

        return html`
            <div
                class="tab ${isActive ? 'active' : ''}"
                data-tab-id="${tab.id}"
                draggable="true"
                @click="${() => this.selectTab(tab.id)}"
                @dragstart="${(e) => this.handleDragStart(e, tab.id)}"
                @dragend="${(e) => this.handleDragEnd(e, tab.id)}"
                @dragover="${(e) => this.handleDragOver(e, tab.id)}"
                @dragleave="${(e) => this.handleDragLeave(e, tab.id)}"
                @drop="${(e) => this.handleDrop(e, tab.id)}">

                <span class="tab-icon">${tab.icon}</span>

                <div class="tab-content">
                    <div class="tab-title">${tab.title}</div>
                    ${tab.subtitle ? html`
                        <div class="tab-subtitle">${tab.subtitle}</div>
                    ` : ''}
                </div>

                ${tab.status !== 'idle' ? html`
                    <span class="tab-status ${tab.status}"></span>
                ` : ''}

                ${tab.badge > 0 ? html`
                    <span class="tab-badge">${tab.badge}</span>
                ` : ''}

                ${tab.closable ? html`
                    <button
                        class="tab-close"
                        @click="${(e) => this.closeTab(tab.id, e)}"
                        title="Fermer (⌘W)">
                        ×
                    </button>
                ` : ''}
            </div>
        `;
    }

    render() {
        return html`
            <div class="tabs-container">
                ${this.tabs.map((tab, index) => this.renderTab(tab, index))}

                <button
                    class="tab-add"
                    @click="${this.addTab}"
                    ?disabled="${this.tabs.length >= this.maxTabs}"
                    title="Nouvelle conversation (⌘N)">
                    +
                </button>
            </div>
        `;
    }
}

customElements.define('zen-tabs', ZenTabs);
