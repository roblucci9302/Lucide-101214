import { html, css, LitElement } from '../assets/lit-core-2.7.4.min.js';

/**
 * ZenMemoryPanel - Knowledge Graph Visualization
 *
 * Features:
 * - Visual knowledge graph (nodes + connections)
 * - Pinned items (important concepts/documents)
 * - Recent memories
 * - Connections between concepts
 * - Search through memory
 */
export class ZenMemoryPanel extends LitElement {
    static properties = {
        nodes: { type: Array },
        connections: { type: Array },
        pinnedItems: { type: Array },
        recentMemories: { type: Array },
        searchQuery: { type: String },
        selectedNodeId: { type: String }
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
        .memory-panel {
            display: flex;
            flex-direction: column;
            padding: 16px;
            gap: 16px;
        }

        /* ────────────────[ SEARCH ]─────────────── */
        .memory-search {
            position: sticky;
            top: 0;
            background: rgba(20, 20, 30, 0.95);
            backdrop-filter: blur(20px);
            z-index: 10;
            padding-bottom: 8px;
        }

        .search-input {
            width: 100%;
            background: rgba(255, 255, 255, 0.08);
            border: 1px solid rgba(255, 255, 255, 0.15);
            border-radius: 8px;
            padding: 10px 12px;
            color: rgba(255, 255, 255, 0.95);
            font-size: 13px;
            outline: none;
            transition: all 0.2s ease;
        }

        .search-input::placeholder {
            color: rgba(255, 255, 255, 0.4);
        }

        .search-input:focus {
            background: rgba(255, 255, 255, 0.12);
            border-color: rgba(139, 92, 246, 0.5);
        }

        /* ────────────────[ SECTION ]─────────────── */
        .memory-section {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }

        .section-title {
            font-size: 11px;
            font-weight: 600;
            color: rgba(255, 255, 255, 0.5);
            text-transform: uppercase;
            letter-spacing: 0.5px;
            padding: 0 4px;
        }

        /* ────────────────[ KNOWLEDGE GRAPH ]─────────────── */
        .knowledge-graph {
            position: relative;
            width: 100%;
            height: 200px;
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 12px;
            overflow: hidden;
        }

        .graph-canvas {
            width: 100%;
            height: 100%;
        }

        .graph-overlay {
            position: absolute;
            top: 8px;
            right: 8px;
            display: flex;
            gap: 4px;
        }

        .graph-btn {
            width: 28px;
            height: 28px;
            border-radius: 6px;
            background: rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            color: rgba(255, 255, 255, 0.9);
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
            transition: all 0.15s ease;
        }

        .graph-btn:hover {
            background: rgba(0, 0, 0, 0.7);
            border-color: rgba(255, 255, 255, 0.3);
        }

        /* ────────────────[ NODE (simplified visualization) ]─────────────── */
        .nodes-list {
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
            padding: 12px;
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 12px;
            min-height: 80px;
        }

        .node-chip {
            display: flex;
            align-items: center;
            gap: 6px;
            padding: 6px 10px;
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.15);
            border-radius: 16px;
            font-size: 12px;
            color: rgba(255, 255, 255, 0.9);
            cursor: pointer;
            transition: all 0.15s ease;
        }

        .node-chip:hover {
            background: rgba(255, 255, 255, 0.15);
            border-color: rgba(255, 255, 255, 0.25);
            transform: translateY(-1px);
        }

        .node-chip.selected {
            background: rgba(139, 92, 246, 0.3);
            border-color: rgba(139, 92, 246, 0.5);
        }

        .node-icon {
            font-size: 14px;
        }

        .node-label {
            font-weight: 500;
        }

        .node-count {
            background: rgba(255, 255, 255, 0.2);
            border-radius: 8px;
            padding: 2px 5px;
            font-size: 10px;
            font-weight: 600;
        }

        /* ────────────────[ PINNED ITEMS ]─────────────── */
        .pinned-item {
            display: flex;
            align-items: flex-start;
            gap: 10px;
            padding: 10px 12px;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.15s ease;
            position: relative;
        }

        .pinned-item:hover {
            background: rgba(255, 255, 255, 0.08);
            border-color: rgba(255, 255, 255, 0.15);
        }

        .pinned-icon {
            font-size: 18px;
            flex-shrink: 0;
        }

        .pinned-content {
            flex: 1;
            min-width: 0;
        }

        .pinned-title {
            font-size: 12px;
            font-weight: 600;
            color: rgba(255, 255, 255, 0.95);
            margin-bottom: 4px;
        }

        .pinned-desc {
            font-size: 11px;
            color: rgba(255, 255, 255, 0.6);
            line-height: 1.4;
        }

        .pinned-actions {
            display: flex;
            gap: 4px;
            opacity: 0;
            transition: opacity 0.15s ease;
        }

        .pinned-item:hover .pinned-actions {
            opacity: 1;
        }

        .action-icon-btn {
            width: 20px;
            height: 20px;
            border-radius: 4px;
            background: rgba(255, 255, 255, 0.1);
            border: none;
            color: rgba(255, 255, 255, 0.7);
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            transition: all 0.15s ease;
        }

        .action-icon-btn:hover {
            background: rgba(255, 255, 255, 0.2);
            color: rgba(255, 255, 255, 1);
        }

        .pin-badge {
            position: absolute;
            top: 8px;
            right: 8px;
            font-size: 12px;
            color: rgba(251, 191, 36, 0.8);
        }

        /* ────────────────[ CONNECTIONS ]─────────────── */
        .connection-item {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 8px 10px;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 8px;
            font-size: 12px;
            color: rgba(255, 255, 255, 0.8);
        }

        .connection-from,
        .connection-to {
            padding: 4px 8px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 6px;
            font-weight: 500;
        }

        .connection-arrow {
            color: rgba(255, 255, 255, 0.4);
            font-size: 10px;
        }

        .connection-type {
            margin-left: auto;
            font-size: 10px;
            color: rgba(255, 255, 255, 0.5);
        }

        /* ────────────────[ MEMORIES ]─────────────── */
        .memory-item {
            display: flex;
            align-items: flex-start;
            gap: 10px;
            padding: 10px 12px;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.15s ease;
        }

        .memory-item:hover {
            background: rgba(255, 255, 255, 0.08);
            border-color: rgba(255, 255, 255, 0.15);
        }

        .memory-time {
            font-size: 10px;
            color: rgba(255, 255, 255, 0.5);
            white-space: nowrap;
        }

        .memory-text {
            flex: 1;
            font-size: 12px;
            color: rgba(255, 255, 255, 0.8);
            line-height: 1.5;
        }

        /* ────────────────[ EMPTY STATE ]─────────────── */
        .empty-state {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 32px 16px;
            text-align: center;
            color: rgba(255, 255, 255, 0.4);
        }

        .empty-icon {
            font-size: 40px;
            opacity: 0.3;
            margin-bottom: 8px;
        }

        .empty-text {
            font-size: 12px;
            line-height: 1.4;
        }

        /* ────────────────[ GLASS BYPASS ]─────────────── */
        :host-context(body.has-glass) .knowledge-graph,
        :host-context(body.has-glass) .nodes-list,
        :host-context(body.has-glass) .pinned-item,
        :host-context(body.has-glass) .connection-item,
        :host-context(body.has-glass) .memory-item,
        :host-context(body.has-glass) .node-chip,
        :host-context(body.has-glass) .search-input {
            background: transparent !important;
            border: none !important;
        }

        :host-context(body.has-glass) .pinned-item:hover,
        :host-context(body.has-glass) .memory-item:hover,
        :host-context(body.has-glass) .node-chip:hover {
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
        this.nodes = [];
        this.connections = [];
        this.pinnedItems = [];
        this.recentMemories = [];
        this.searchQuery = '';
        this.selectedNodeId = null;
    }

    handleSearch(e) {
        this.searchQuery = e.target.value;
        this.filterResults();
    }

    filterResults() {
        // Filter nodes, pinned items, and memories based on search query
        // This would be implemented with actual search logic
        this.requestUpdate();
    }

    selectNode(nodeId) {
        this.selectedNodeId = this.selectedNodeId === nodeId ? null : nodeId;

        this.dispatchEvent(new CustomEvent('node-selected', {
            detail: { nodeId: this.selectedNodeId },
            bubbles: true,
            composed: true
        }));

        this.requestUpdate();
    }

    pinItem(item) {
        if (!this.pinnedItems.find(p => p.id === item.id)) {
            this.pinnedItems = [...this.pinnedItems, item];

            this.dispatchEvent(new CustomEvent('item-pinned', {
                detail: { item },
                bubbles: true,
                composed: true
            }));
        }

        this.requestUpdate();
    }

    unpinItem(itemId) {
        this.pinnedItems = this.pinnedItems.filter(p => p.id !== itemId);

        this.dispatchEvent(new CustomEvent('item-unpinned', {
            detail: { itemId },
            bubbles: true,
            composed: true
        }));

        this.requestUpdate();
    }

    openPinnedItem(item) {
        this.dispatchEvent(new CustomEvent('pinned-item-clicked', {
            detail: { item },
            bubbles: true,
            composed: true
        }));
    }

    openMemory(memory) {
        this.dispatchEvent(new CustomEvent('memory-clicked', {
            detail: { memory },
            bubbles: true,
            composed: true
        }));
    }

    renderKnowledgeGraph() {
        return html`
            <div class="knowledge-graph">
                <canvas class="graph-canvas"></canvas>
                <div class="graph-overlay">
                    <button class="graph-btn" @click="${this.resetGraphView}" title="Reset view">
                        ⟲
                    </button>
                    <button class="graph-btn" @click="${this.expandGraph}" title="Expand">
                        ⊕
                    </button>
                </div>
            </div>
        `;
    }

    renderNodes() {
        if (this.nodes.length === 0) {
            return html`
                <div class="empty-state">
                    <div class="empty-icon">🧠</div>
                    <div class="empty-text">Aucun concept découvert</div>
                </div>
            `;
        }

        return html`
            <div class="nodes-list">
                ${this.nodes.map(node => html`
                    <div
                        class="node-chip ${this.selectedNodeId === node.id ? 'selected' : ''}"
                        @click="${() => this.selectNode(node.id)}">
                        <span class="node-icon">${node.icon}</span>
                        <span class="node-label">${node.label}</span>
                        ${node.count ? html`
                            <span class="node-count">${node.count}</span>
                        ` : ''}
                    </div>
                `)}
            </div>
        `;
    }

    renderPinnedItems() {
        if (this.pinnedItems.length === 0) {
            return html`
                <div class="empty-state">
                    <div class="empty-icon">📌</div>
                    <div class="empty-text">Aucun élément épinglé</div>
                </div>
            `;
        }

        return html`
            ${this.pinnedItems.map(item => html`
                <div class="pinned-item" @click="${() => this.openPinnedItem(item)}">
                    <span class="pin-badge">📌</span>
                    <span class="pinned-icon">${item.icon}</span>
                    <div class="pinned-content">
                        <div class="pinned-title">${item.title}</div>
                        <div class="pinned-desc">${item.description}</div>
                    </div>
                    <div class="pinned-actions">
                        <button
                            class="action-icon-btn"
                            @click="${(e) => { e.stopPropagation(); this.unpinItem(item.id); }}"
                            title="Désépingler">
                            ×
                        </button>
                    </div>
                </div>
            `)}
        `;
    }

    renderConnections() {
        if (this.connections.length === 0) {
            return html`
                <div class="empty-state">
                    <div class="empty-icon">🔗</div>
                    <div class="empty-text">Aucune connexion établie</div>
                </div>
            `;
        }

        return html`
            ${this.connections.map(conn => html`
                <div class="connection-item">
                    <span class="connection-from">${conn.from}</span>
                    <span class="connection-arrow">→</span>
                    <span class="connection-to">${conn.to}</span>
                    <span class="connection-type">${conn.type}</span>
                </div>
            `)}
        `;
    }

    renderRecentMemories() {
        if (this.recentMemories.length === 0) {
            return html`
                <div class="empty-state">
                    <div class="empty-icon">💭</div>
                    <div class="empty-text">Aucune mémoire récente</div>
                </div>
            `;
        }

        return html`
            ${this.recentMemories.map(memory => html`
                <div class="memory-item" @click="${() => this.openMemory(memory)}">
                    <div class="memory-time">${memory.time}</div>
                    <div class="memory-text">${memory.text}</div>
                </div>
            `)}
        `;
    }

    resetGraphView() {
        console.log('[ZenMemoryPanel] Reset graph view');
    }

    expandGraph() {
        console.log('[ZenMemoryPanel] Expand graph');
    }

    render() {
        return html`
            <div class="memory-panel">
                <!-- Search -->
                <div class="memory-search">
                    <input
                        class="search-input"
                        type="text"
                        placeholder="Rechercher dans la mémoire..."
                        .value="${this.searchQuery}"
                        @input="${this.handleSearch}" />
                </div>

                <!-- Knowledge Graph -->
                <div class="memory-section">
                    <div class="section-title">🧠 Graphe de Connaissances</div>
                    ${this.renderKnowledgeGraph()}
                </div>

                <!-- Nodes -->
                <div class="memory-section">
                    <div class="section-title">🔵 Concepts (${this.nodes.length})</div>
                    ${this.renderNodes()}
                </div>

                <!-- Pinned Items -->
                <div class="memory-section">
                    <div class="section-title">📌 Épinglés (${this.pinnedItems.length})</div>
                    ${this.renderPinnedItems()}
                </div>

                <!-- Connections -->
                <div class="memory-section">
                    <div class="section-title">🔗 Connexions (${this.connections.length})</div>
                    ${this.renderConnections()}
                </div>

                <!-- Recent Memories -->
                <div class="memory-section">
                    <div class="section-title">💭 Mémoires Récentes</div>
                    ${this.renderRecentMemories()}
                </div>
            </div>
        `;
    }
}

customElements.define('zen-memory-panel', ZenMemoryPanel);
