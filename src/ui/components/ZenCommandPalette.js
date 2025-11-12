import { html, css, LitElement } from '../assets/lit-core-2.7.4.min.js';

/**
 * ZenCommandPalette - Command Palette (⌘K)
 *
 * Inspired by Spotlight, Raycast, VSCode Command Palette
 *
 * Features:
 * - Fuzzy search through all commands
 * - Keyboard navigation (Arrow keys, Enter, Escape)
 * - Categorized actions
 * - Recent commands history
 * - Shortcuts display
 */
export class ZenCommandPalette extends LitElement {
    static properties = {
        open: { type: Boolean },
        query: { type: String },
        selectedIndex: { type: Number },
        filteredCommands: { type: Array },
        recentCommands: { type: Array }
    };

    static styles = css`
        :host {
            display: block;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 9999;
            pointer-events: none;
        }

        :host([open]) {
            pointer-events: auto;
        }

        * {
            font-family: 'Helvetica Neue', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        /* ────────────────[ BACKDROP ]─────────────── */
        .palette-backdrop {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.6);
            backdrop-filter: blur(4px);
            opacity: 0;
            transition: opacity 0.2s ease;
            pointer-events: none;
        }

        :host([open]) .palette-backdrop {
            opacity: 1;
        }

        /* ────────────────[ PALETTE CONTAINER ]─────────────── */
        .palette-container {
            position: absolute;
            top: 15%;
            left: 50%;
            transform: translateX(-50%) scale(0.95);
            width: 90%;
            max-width: 600px;
            background: rgba(20, 20, 30, 0.95);
            backdrop-filter: blur(40px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 16px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
            opacity: 0;
            transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
            overflow: hidden;
        }

        :host([open]) .palette-container {
            opacity: 1;
            transform: translateX(-50%) scale(1);
        }

        /* ────────────────[ SEARCH INPUT ]─────────────── */
        .palette-search {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 16px 20px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .search-icon {
            font-size: 20px;
            color: rgba(255, 255, 255, 0.5);
            flex-shrink: 0;
        }

        .search-input {
            flex: 1;
            background: transparent;
            border: none;
            outline: none;
            color: rgba(255, 255, 255, 0.95);
            font-size: 16px;
            font-weight: 400;
        }

        .search-input::placeholder {
            color: rgba(255, 255, 255, 0.4);
        }

        .search-shortcut {
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.15);
            border-radius: 6px;
            padding: 4px 8px;
            font-size: 12px;
            color: rgba(255, 255, 255, 0.6);
            font-family: 'Monaco', 'Menlo', monospace;
            flex-shrink: 0;
        }

        /* ────────────────[ COMMANDS LIST ]─────────────── */
        .palette-commands {
            max-height: 400px;
            overflow-y: auto;
            padding: 8px;
        }

        .palette-commands::-webkit-scrollbar {
            width: 6px;
        }

        .palette-commands::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.05);
        }

        .palette-commands::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.2);
            border-radius: 3px;
        }

        /* ────────────────[ COMMAND ITEM ]─────────────── */
        .command-item {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 10px 12px;
            border-radius: 8px;
            cursor: pointer;
            transition: background 0.1s ease;
            margin-bottom: 2px;
        }

        .command-item:hover {
            background: rgba(255, 255, 255, 0.08);
        }

        .command-item.selected {
            background: rgba(139, 92, 246, 0.3);
            border: 1px solid rgba(139, 92, 246, 0.5);
        }

        .command-icon {
            font-size: 20px;
            width: 24px;
            text-align: center;
            flex-shrink: 0;
        }

        .command-content {
            flex: 1;
            min-width: 0;
        }

        .command-title {
            font-size: 14px;
            font-weight: 500;
            color: rgba(255, 255, 255, 0.95);
            margin-bottom: 2px;
        }

        .command-subtitle {
            font-size: 12px;
            color: rgba(255, 255, 255, 0.5);
        }

        .command-shortcuts {
            display: flex;
            gap: 4px;
            flex-shrink: 0;
        }

        .command-key {
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.15);
            border-radius: 4px;
            padding: 2px 6px;
            font-size: 11px;
            color: rgba(255, 255, 255, 0.7);
            font-family: 'Monaco', 'Menlo', monospace;
        }

        /* ────────────────[ CATEGORY ]─────────────── */
        .command-category {
            padding: 8px 12px 4px 12px;
            font-size: 11px;
            font-weight: 600;
            color: rgba(255, 255, 255, 0.5);
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        /* ────────────────[ EMPTY STATE ]─────────────── */
        .palette-empty {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 40px 20px;
            color: rgba(255, 255, 255, 0.4);
            text-align: center;
        }

        .empty-icon {
            font-size: 48px;
            opacity: 0.3;
            margin-bottom: 12px;
        }

        .empty-text {
            font-size: 14px;
            line-height: 1.5;
        }

        /* ────────────────[ FOOTER ]─────────────── */
        .palette-footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 16px;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
            font-size: 11px;
            color: rgba(255, 255, 255, 0.5);
        }

        .footer-hints {
            display: flex;
            gap: 12px;
        }

        .footer-hint {
            display: flex;
            align-items: center;
            gap: 4px;
        }

        /* ────────────────[ ANIMATIONS ]─────────────── */
        @keyframes commandIn {
            from {
                opacity: 0;
                transform: translateY(-4px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .command-item {
            animation: commandIn 0.15s ease-out backwards;
        }

        .command-item:nth-child(1) { animation-delay: 0.02s; }
        .command-item:nth-child(2) { animation-delay: 0.04s; }
        .command-item:nth-child(3) { animation-delay: 0.06s; }
        .command-item:nth-child(4) { animation-delay: 0.08s; }
        .command-item:nth-child(5) { animation-delay: 0.10s; }

        /* ────────────────[ RESPONSIVE ]─────────────── */
        @media (max-width: 768px) {
            .palette-container {
                top: 10%;
                width: 95%;
            }

            .palette-commands {
                max-height: 300px;
            }

            .footer-hints {
                display: none;
            }
        }
    `;

    constructor() {
        super();
        this.open = false;
        this.query = '';
        this.selectedIndex = 0;
        this.filteredCommands = [];
        this.recentCommands = this.loadRecentCommands();

        // Define all available commands
        this.commands = [
            // Navigation
            {
                id: 'new-conversation',
                category: 'Navigation',
                icon: '💬',
                title: 'Nouvelle conversation',
                subtitle: 'Démarrer une nouvelle conversation',
                shortcuts: ['⌘', 'N'],
                action: () => this.handleNewConversation()
            },
            {
                id: 'search',
                category: 'Navigation',
                icon: '🔍',
                title: 'Rechercher',
                subtitle: 'Rechercher dans les conversations et documents',
                shortcuts: ['⌘', 'F'],
                action: () => this.handleSearch()
            },
            {
                id: 'history',
                category: 'Navigation',
                icon: '📜',
                title: 'Historique',
                subtitle: 'Voir l\'historique des conversations',
                shortcuts: ['⌘', 'H'],
                action: () => this.handleHistory()
            },
            {
                id: 'settings',
                category: 'Navigation',
                icon: '⚙️',
                title: 'Paramètres',
                subtitle: 'Ouvrir les paramètres',
                shortcuts: ['⌘', ','],
                action: () => this.handleSettings()
            },

            // Profils
            {
                id: 'profile-rh',
                category: 'Profils',
                icon: '👥',
                title: 'Basculer en mode RH',
                subtitle: 'Expert en ressources humaines',
                shortcuts: ['⌘', '1'],
                action: () => this.handleChangeProfile('rh')
            },
            {
                id: 'profile-exec',
                category: 'Profils',
                icon: '💼',
                title: 'Basculer en mode Exec',
                subtitle: 'Assistant direction et management',
                shortcuts: ['⌘', '2'],
                action: () => this.handleChangeProfile('exec')
            },
            {
                id: 'profile-dev',
                category: 'Profils',
                icon: '💻',
                title: 'Basculer en mode Dev',
                subtitle: 'Assistant développement logiciel',
                shortcuts: ['⌘', '3'],
                action: () => this.handleChangeProfile('dev')
            },
            {
                id: 'profile-marketing',
                category: 'Profils',
                icon: '📢',
                title: 'Basculer en mode Marketing',
                subtitle: 'Expert marketing et communication',
                shortcuts: ['⌘', '4'],
                action: () => this.handleChangeProfile('marketing')
            },
            {
                id: 'profile-support',
                category: 'Profils',
                icon: '🎧',
                title: 'Basculer en mode Support',
                subtitle: 'Expert service client',
                shortcuts: ['⌘', '5'],
                action: () => this.handleChangeProfile('support')
            },
            {
                id: 'profile-general',
                category: 'Profils',
                icon: '✨',
                title: 'Basculer en mode Général',
                subtitle: 'Assistant général Lucide',
                shortcuts: ['⌘', '6'],
                action: () => this.handleChangeProfile('lucide_assistant')
            },

            // Actions
            {
                id: 'start-listening',
                category: 'Actions',
                icon: '🎙️',
                title: 'Démarrer l\'écoute',
                subtitle: 'Activer le mode écoute audio',
                shortcuts: ['⌘', 'L'],
                action: () => this.handleStartListening()
            },
            {
                id: 'attach-file',
                category: 'Actions',
                icon: '📎',
                title: 'Joindre un fichier',
                subtitle: 'Ajouter un document à la conversation',
                shortcuts: ['⌘', 'U'],
                action: () => this.handleAttachFile()
            },
            {
                id: 'clear-conversation',
                category: 'Actions',
                icon: '🗑️',
                title: 'Effacer la conversation',
                subtitle: 'Réinitialiser la conversation actuelle',
                shortcuts: ['⌘', '⇧', 'K'],
                action: () => this.handleClearConversation()
            },

            // Vue
            {
                id: 'toggle-context',
                category: 'Vue',
                icon: '📊',
                title: 'Toggle panel contextuel',
                subtitle: 'Afficher/masquer le panel de contexte',
                shortcuts: ['⌘', 'B'],
                action: () => this.handleToggleContext()
            },
            {
                id: 'toggle-theme',
                category: 'Vue',
                icon: '🌓',
                title: 'Changer le thème',
                subtitle: 'Basculer entre clair et sombre',
                shortcuts: ['⌘', '⇧', 'T'],
                action: () => this.handleToggleTheme()
            },
            {
                id: 'zoom-in',
                category: 'Vue',
                icon: '🔍',
                title: 'Zoom avant',
                subtitle: 'Augmenter la taille du texte',
                shortcuts: ['⌘', '+'],
                action: () => this.handleZoomIn()
            },
            {
                id: 'zoom-out',
                category: 'Vue',
                icon: '🔍',
                title: 'Zoom arrière',
                subtitle: 'Réduire la taille du texte',
                shortcuts: ['⌘', '-'],
                action: () => this.handleZoomOut()
            }
        ];

        this.updateFilteredCommands();
    }

    connectedCallback() {
        super.connectedCallback();
        this._keydownHandler = this.handleGlobalKeydown.bind(this);
        window.addEventListener('keydown', this._keydownHandler);
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        if (this._keydownHandler) {
            window.removeEventListener('keydown', this._keydownHandler);
        }
    }

    handleGlobalKeydown(e) {
        // ⌘K or Ctrl+K to open
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
            e.preventDefault();
            this.toggle();
            return;
        }

        // Only handle these if palette is open
        if (!this.open) return;

        switch (e.key) {
            case 'Escape':
                e.preventDefault();
                this.close();
                break;

            case 'ArrowDown':
                e.preventDefault();
                this.moveSelection(1);
                break;

            case 'ArrowUp':
                e.preventDefault();
                this.moveSelection(-1);
                break;

            case 'Enter':
                e.preventDefault();
                this.executeSelected();
                break;
        }
    }

    toggle() {
        this.open = !this.open;
        if (this.open) {
            this.query = '';
            this.selectedIndex = 0;
            this.updateFilteredCommands();
            this.updateComplete.then(() => {
                const input = this.shadowRoot.querySelector('.search-input');
                if (input) input.focus();
            });
        }
    }

    close() {
        this.open = false;
        this.query = '';
        this.selectedIndex = 0;
    }

    handleSearchInput(e) {
        this.query = e.target.value;
        this.selectedIndex = 0;
        this.updateFilteredCommands();
    }

    updateFilteredCommands() {
        if (!this.query.trim()) {
            // Show recent commands first, then all commands
            this.filteredCommands = [
                ...this.getRecentCommandObjects(),
                ...this.commands
            ].filter((cmd, index, self) =>
                index === self.findIndex(c => c.id === cmd.id)
            );
        } else {
            // Fuzzy search
            const query = this.query.toLowerCase();
            this.filteredCommands = this.commands
                .filter(cmd =>
                    cmd.title.toLowerCase().includes(query) ||
                    cmd.subtitle.toLowerCase().includes(query) ||
                    cmd.category.toLowerCase().includes(query)
                )
                .sort((a, b) => {
                    // Prioritize exact matches
                    const aExact = a.title.toLowerCase().startsWith(query);
                    const bExact = b.title.toLowerCase().startsWith(query);
                    if (aExact && !bExact) return -1;
                    if (!aExact && bExact) return 1;
                    return 0;
                });
        }

        this.requestUpdate();
    }

    moveSelection(direction) {
        this.selectedIndex = Math.max(
            0,
            Math.min(this.filteredCommands.length - 1, this.selectedIndex + direction)
        );

        // Scroll selected item into view
        this.updateComplete.then(() => {
            const selected = this.shadowRoot.querySelector('.command-item.selected');
            if (selected) {
                selected.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
            }
        });
    }

    executeCommand(command) {
        if (!command) return;

        // Add to recent commands
        this.addToRecentCommands(command.id);

        // Execute action
        command.action?.();

        // Close palette
        this.close();

        // Dispatch event
        this.dispatchEvent(new CustomEvent('command-executed', {
            detail: { command },
            bubbles: true,
            composed: true
        }));
    }

    executeSelected() {
        const command = this.filteredCommands[this.selectedIndex];
        this.executeCommand(command);
    }

    loadRecentCommands() {
        try {
            const stored = localStorage.getItem('zenCommandPaletteRecent');
            return stored ? JSON.parse(stored) : [];
        } catch {
            return [];
        }
    }

    saveRecentCommands() {
        try {
            localStorage.setItem('zenCommandPaletteRecent', JSON.stringify(this.recentCommands));
        } catch (e) {
            console.error('[ZenCommandPalette] Failed to save recent commands:', e);
        }
    }

    addToRecentCommands(commandId) {
        // Remove if already exists
        this.recentCommands = this.recentCommands.filter(id => id !== commandId);

        // Add to front
        this.recentCommands.unshift(commandId);

        // Keep only last 5
        this.recentCommands = this.recentCommands.slice(0, 5);

        this.saveRecentCommands();
    }

    getRecentCommandObjects() {
        return this.recentCommands
            .map(id => this.commands.find(cmd => cmd.id === id))
            .filter(Boolean);
    }

    // ────────────────[ ACTION HANDLERS ]─────────────── //

    handleNewConversation() {
        this.dispatchEvent(new CustomEvent('new-conversation', {
            bubbles: true,
            composed: true
        }));
    }

    handleSearch() {
        this.dispatchEvent(new CustomEvent('open-search', {
            bubbles: true,
            composed: true
        }));
    }

    handleHistory() {
        this.dispatchEvent(new CustomEvent('open-history', {
            bubbles: true,
            composed: true
        }));
    }

    handleSettings() {
        if (window.api) {
            window.api.mainHeader.showSettingsWindow();
        }
    }

    handleChangeProfile(profileId) {
        this.dispatchEvent(new CustomEvent('change-profile', {
            detail: { profileId },
            bubbles: true,
            composed: true
        }));
    }

    handleStartListening() {
        if (window.api) {
            window.api.mainHeader.sendListenButtonClick('Écouter');
        }
    }

    handleAttachFile() {
        this.dispatchEvent(new CustomEvent('attach-file', {
            bubbles: true,
            composed: true
        }));
    }

    handleClearConversation() {
        this.dispatchEvent(new CustomEvent('clear-conversation', {
            bubbles: true,
            composed: true
        }));
    }

    handleToggleContext() {
        this.dispatchEvent(new CustomEvent('toggle-context', {
            bubbles: true,
            composed: true
        }));
    }

    handleToggleTheme() {
        this.dispatchEvent(new CustomEvent('toggle-theme', {
            bubbles: true,
            composed: true
        }));
    }

    handleZoomIn() {
        document.documentElement.style.fontSize =
            `${parseFloat(getComputedStyle(document.documentElement).fontSize) * 1.1}px`;
    }

    handleZoomOut() {
        document.documentElement.style.fontSize =
            `${parseFloat(getComputedStyle(document.documentElement).fontSize) / 1.1}px`;
    }

    // ────────────────[ RENDER ]─────────────── //

    renderCommandsByCategory() {
        if (this.filteredCommands.length === 0) {
            return html`
                <div class="palette-empty">
                    <div class="empty-icon">🔍</div>
                    <div class="empty-text">
                        Aucune commande trouvée pour "${this.query}"
                    </div>
                </div>
            `;
        }

        // Group by category
        const grouped = {};
        this.filteredCommands.forEach(cmd => {
            if (!grouped[cmd.category]) {
                grouped[cmd.category] = [];
            }
            grouped[cmd.category].push(cmd);
        });

        // Render each category
        return Object.entries(grouped).map(([category, commands]) => html`
            <div class="command-category">${category}</div>
            ${commands.map((cmd, index) => {
                const globalIndex = this.filteredCommands.indexOf(cmd);
                return this.renderCommand(cmd, globalIndex);
            })}
        `);
    }

    renderCommand(command, index) {
        const isSelected = index === this.selectedIndex;

        return html`
            <div
                class="command-item ${isSelected ? 'selected' : ''}"
                @click="${() => this.executeCommand(command)}"
                @mouseenter="${() => { this.selectedIndex = index; }}">

                <span class="command-icon">${command.icon}</span>

                <div class="command-content">
                    <div class="command-title">${command.title}</div>
                    <div class="command-subtitle">${command.subtitle}</div>
                </div>

                ${command.shortcuts ? html`
                    <div class="command-shortcuts">
                        ${command.shortcuts.map(key => html`
                            <span class="command-key">${key}</span>
                        `)}
                    </div>
                ` : ''}
            </div>
        `;
    }

    render() {
        return html`
            <div class="palette-backdrop" @click="${this.close}"></div>

            <div class="palette-container">
                <!-- Search -->
                <div class="palette-search">
                    <span class="search-icon">🔍</span>
                    <input
                        class="search-input"
                        type="text"
                        placeholder="Rechercher une commande..."
                        .value="${this.query}"
                        @input="${this.handleSearchInput}" />
                    <span class="search-shortcut">⌘K</span>
                </div>

                <!-- Commands List -->
                <div class="palette-commands">
                    ${this.renderCommandsByCategory()}
                </div>

                <!-- Footer -->
                <div class="palette-footer">
                    <div class="footer-hints">
                        <div class="footer-hint">
                            <span class="command-key">↑</span>
                            <span class="command-key">↓</span>
                            <span>Naviguer</span>
                        </div>
                        <div class="footer-hint">
                            <span class="command-key">↵</span>
                            <span>Exécuter</span>
                        </div>
                        <div class="footer-hint">
                            <span class="command-key">Esc</span>
                            <span>Fermer</span>
                        </div>
                    </div>
                    <div>${this.filteredCommands.length} commandes</div>
                </div>
            </div>
        `;
    }
}

customElements.define('zen-command-palette', ZenCommandPalette);
