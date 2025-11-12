import { html, css, LitElement } from '../assets/lit-core-2.7.4.min.js';
import './ZenConversation.js';
import './ZenInput.js';
import './ZenContextPanel.js';
import './ZenCommandPalette.js';
import './ZenTabs.js';
import './ZenMemoryPanel.js';
import themeManager from '../../services/ThemeManager.js';
import keyboardShortcutsManager from '../../services/KeyboardShortcutsManager.js';

/**
 * ZenLayout - Container principal de l'interface Lucide Zen
 *
 * Gère deux états principaux :
 * - IDLE : Interface minimale, centrée, en attente
 * - ACTIVE : Interface complète avec conversation, input, contexte
 *
 * Philosophie : "Silence intelligent, présence subtile"
 */
export class ZenLayout extends LitElement {
    static STATES = {
        IDLE: 'idle',           // Repos, minimal
        ACTIVE: 'active',       // Conversation active
        LISTENING: 'listening', // En écoute
        PROCESSING: 'processing', // Traitement en cours
        ERROR: 'error'          // Erreur
    };

    static properties = {
        state: { type: String },
        messages: { type: Array },
        contextData: { type: Object },
        showContextPanel: { type: Boolean },
        showMemoryPanel: { type: Boolean },
        showCommandPalette: { type: Boolean },
        isProcessing: { type: Boolean },
        selectedProfile: { type: String },
        activeTab: { type: String },
        tabs: { type: Array },
        activeTabId: { type: String }
    };

    static styles = css`
        :host {
            display: block;
            width: 100%;
            height: 100%;
            position: relative;
            overflow: hidden;
        }

        * {
            font-family: 'Helvetica Neue', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            cursor: default;
            user-select: none;
        }

        /* ────────────────[ CONTAINER PRINCIPAL ]─────────────── */
        .zen-container {
            display: flex;
            flex-direction: column;
            width: 100%;
            height: 100%;
            position: relative;
            transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        /* ────────────────[ ÉTAT IDLE ]─────────────── */
        .zen-idle {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 24px;
            opacity: 1;
            transition: opacity 0.3s ease-out, transform 0.3s ease-out;
            pointer-events: auto;
        }

        .zen-container.active .zen-idle {
            opacity: 0;
            transform: translate(-50%, -60%);
            pointer-events: none;
        }

        .zen-icon {
            font-size: 48px;
            animation: pulse-glow 3s ease-in-out infinite;
        }

        @keyframes pulse-glow {
            0%, 100% {
                opacity: 1;
                transform: scale(1);
            }
            50% {
                opacity: 0.7;
                transform: scale(1.05);
            }
        }

        .zen-title {
            color: rgba(255, 255, 255, 0.95);
            font-size: 24px;
            font-weight: 300;
            text-align: center;
            letter-spacing: 0.5px;
        }

        .zen-subtitle {
            color: rgba(255, 255, 255, 0.6);
            font-size: 13px;
            font-weight: 400;
            text-align: center;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .shortcut {
            background: rgba(255, 255, 255, 0.15);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 6px;
            padding: 4px 10px;
            font-size: 12px;
            font-weight: 500;
            color: rgba(255, 255, 255, 0.9);
            font-family: 'Monaco', 'Menlo', monospace;
        }

        /* ────────────────[ ÉTAT ACTIVE ]─────────────── */
        .zen-active {
            display: flex;
            flex-direction: column;
            width: 100%;
            height: 100%;
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.4s ease-out, transform 0.4s ease-out;
            pointer-events: none;
        }

        .zen-container.active .zen-active {
            opacity: 1;
            transform: translateY(0);
            pointer-events: auto;
        }

        /* ────────────────[ HEADER ZEN ]─────────────── */
        .zen-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 16px 20px;
            background: rgba(0, 0, 0, 0.3);
            backdrop-filter: blur(20px);
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            flex-shrink: 0;
        }

        .zen-header-left {
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .zen-header-title {
            color: rgba(255, 255, 255, 0.9);
            font-size: 14px;
            font-weight: 500;
        }

        .zen-header-status {
            display: flex;
            align-items: center;
            gap: 6px;
            color: rgba(255, 255, 255, 0.6);
            font-size: 12px;
        }

        .status-indicator {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: var(--status-color, rgba(255, 255, 255, 0.4));
        }

        .status-indicator.listening {
            --status-color: #4ade80;
            animation: pulse-status 2s ease-in-out infinite;
        }

        .status-indicator.processing {
            --status-color: #fbbf24;
            animation: pulse-status 1s ease-in-out infinite;
        }

        .status-indicator.error {
            --status-color: #ef4444;
        }

        @keyframes pulse-status {
            0%, 100% {
                opacity: 1;
                box-shadow: 0 0 0 0 var(--status-color);
            }
            50% {
                opacity: 0.7;
                box-shadow: 0 0 0 4px rgba(255, 255, 255, 0.1);
            }
        }

        .zen-header-actions {
            display: flex;
            gap: 8px;
        }

        .zen-action-btn {
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.15);
            border-radius: 8px;
            padding: 6px 12px;
            color: rgba(255, 255, 255, 0.9);
            font-size: 12px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.15s ease;
            display: flex;
            align-items: center;
            gap: 6px;
        }

        .zen-action-btn:hover {
            background: rgba(255, 255, 255, 0.15);
            border-color: rgba(255, 255, 255, 0.25);
        }

        .zen-action-btn:active {
            transform: scale(0.95);
        }

        /* ────────────────[ MAIN CONTENT AREA ]─────────────── */
        .zen-main {
            display: flex;
            flex: 1;
            overflow: hidden;
            position: relative;
        }

        .zen-conversation-container {
            flex: 1;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            background: rgba(0, 0, 0, 0.2);
        }

        .zen-conversation-wrapper {
            flex: 1;
            overflow-y: auto;
            padding: 20px;
            display: flex;
            flex-direction: column;
            gap: 16px;
        }

        /* Custom Scrollbar */
        .zen-conversation-wrapper::-webkit-scrollbar {
            width: 6px;
        }

        .zen-conversation-wrapper::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 3px;
        }

        .zen-conversation-wrapper::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.2);
            border-radius: 3px;
        }

        .zen-conversation-wrapper::-webkit-scrollbar-thumb:hover {
            background: rgba(255, 255, 255, 0.3);
        }

        /* ────────────────[ CONTEXT PANEL ]─────────────── */
        .zen-context-panel {
            width: 280px;
            background: rgba(0, 0, 0, 0.4);
            backdrop-filter: blur(20px);
            border-left: 1px solid rgba(255, 255, 255, 0.1);
            overflow-y: auto;
            transform: translateX(0);
            transition: transform 0.3s ease-out, opacity 0.3s ease-out;
            opacity: 1;
        }

        .zen-context-panel.hidden {
            transform: translateX(100%);
            opacity: 0;
        }

        .zen-context-panel::-webkit-scrollbar {
            width: 4px;
        }

        .zen-context-panel::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.05);
        }

        .zen-context-panel::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.2);
            border-radius: 2px;
        }

        /* ────────────────[ INPUT AREA ]─────────────── */
        .zen-input-container {
            flex-shrink: 0;
            padding: 16px 20px;
            background: rgba(0, 0, 0, 0.3);
            backdrop-filter: blur(20px);
            border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        /* ────────────────[ EMPTY STATE ]─────────────── */
        .zen-empty-state {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100%;
            gap: 16px;
            color: rgba(255, 255, 255, 0.5);
            font-size: 14px;
            text-align: center;
            padding: 40px;
        }

        .zen-empty-state-icon {
            font-size: 64px;
            opacity: 0.3;
        }

        .zen-empty-state-text {
            max-width: 300px;
            line-height: 1.6;
        }

        .zen-empty-state-hint {
            font-size: 12px;
            color: rgba(255, 255, 255, 0.4);
            display: flex;
            align-items: center;
            gap: 8px;
        }

        /* ────────────────[ GLASS BYPASS ]─────────────── */
        :host-context(body.has-glass) .zen-header,
        :host-context(body.has-glass) .zen-input-container,
        :host-context(body.has-glass) .zen-context-panel,
        :host-context(body.has-glass) .zen-conversation-container {
            background: transparent !important;
            backdrop-filter: none !important;
            border: none !important;
        }

        :host-context(body.has-glass) .zen-action-btn {
            background: transparent !important;
            border: none !important;
        }

        :host-context(body.has-glass) .zen-action-btn:hover {
            background: transparent !important;
        }

        /* ────────────────[ RESPONSIVE ]─────────────── */
        @media (max-width: 768px) {
            .zen-context-panel {
                position: absolute;
                right: 0;
                top: 0;
                bottom: 0;
                z-index: 10;
                box-shadow: -4px 0 12px rgba(0, 0, 0, 0.3);
            }

            .zen-header-title {
                font-size: 13px;
            }

            .zen-conversation-wrapper {
                padding: 16px;
            }
        }

        /* ────────────────[ ANIMATIONS ]─────────────── */
        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        @keyframes slideIn {
            from {
                transform: translateX(20px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `;

    constructor() {
        super();
        this.state = ZenLayout.STATES.IDLE;
        this.messages = [];
        this.contextData = null;
        this.showContextPanel = true;
        this.showMemoryPanel = false;
        this.showCommandPalette = false;
        this.isProcessing = false;
        this.selectedProfile = localStorage.getItem('selectedProfile') || 'lucide_assistant';
        this.activeTab = 'conversation';

        // Phase 2: Multi-tabs support
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
    }

    connectedCallback() {
        super.connectedCallback();

        // Listen for keyboard shortcuts
        this._keydownHandler = this.handleKeyDown.bind(this);
        window.addEventListener('keydown', this._keydownHandler);

        // Phase 2: Listen for keyboard shortcut events
        this._shortcutHandler = this.handleShortcutEvent.bind(this);
        document.addEventListener('keyboard-shortcut', this._shortcutHandler);

        // Listen for IPC events if available
        if (window.api) {
            window.api.listenView?.onSessionStateChanged?.((event, { isActive }) => {
                if (isActive) {
                    this.state = ZenLayout.STATES.LISTENING;
                    if (this.state === ZenLayout.STATES.IDLE) {
                        this.state = ZenLayout.STATES.ACTIVE;
                    }
                } else {
                    this.state = ZenLayout.STATES.ACTIVE;
                }
            });
        }
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        if (this._keydownHandler) {
            window.removeEventListener('keydown', this._keydownHandler);
        }
        if (this._shortcutHandler) {
            document.removeEventListener('keyboard-shortcut', this._shortcutHandler);
        }
    }

    handleKeyDown(e) {
        // ⌘Space or Ctrl+Space to toggle active state
        if ((e.metaKey || e.ctrlKey) && e.code === 'Space') {
            e.preventDefault();
            this.toggleActive();
        }

        // ⌘K or Ctrl+K for command palette (future)
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
            e.preventDefault();
            this.openCommandPalette();
        }

        // Escape to close context panel
        if (e.key === 'Escape' && this.showContextPanel) {
            this.showContextPanel = false;
        }
    }

    toggleActive() {
        if (this.state === ZenLayout.STATES.IDLE) {
            this.state = ZenLayout.STATES.ACTIVE;
        } else {
            this.state = ZenLayout.STATES.IDLE;
            this.messages = [];
        }
    }

    openCommandPalette() {
        this.showCommandPalette = true;
        this.requestUpdate();
    }

    closeCommandPalette() {
        this.showCommandPalette = false;
        this.requestUpdate();
    }

    toggleContextPanel() {
        this.showContextPanel = !this.showContextPanel;
    }

    toggleMemoryPanel() {
        this.showMemoryPanel = !this.showMemoryPanel;
    }

    // Phase 2: Handle keyboard shortcut events
    handleShortcutEvent(e) {
        const { action, data } = e.detail;

        switch (action) {
            case 'open-command-palette':
                this.openCommandPalette();
                break;

            case 'new-conversation':
                this.handleNewConversation();
                break;

            case 'toggle-context':
                this.toggleContextPanel();
                break;

            case 'toggle-memory':
                this.toggleMemoryPanel();
                break;

            case 'toggle-theme':
                themeManager.toggleTheme();
                break;

            case 'change-profile':
                this.handleChangeProfile(data.profileId);
                break;

            case 'escape':
                this.handleEscape();
                break;

            default:
                console.log('[ZenLayout] Unhandled shortcut action:', action);
        }
    }

    handleNewConversation() {
        // Reset current conversation
        this.messages = [];
        this.state = ZenLayout.STATES.ACTIVE;
        console.log('[ZenLayout] New conversation started');
    }

    handleChangeProfile(profileId) {
        this.selectedProfile = profileId;
        localStorage.setItem('selectedProfile', profileId);
        console.log('[ZenLayout] Profile changed to:', profileId);
    }

    handleEscape() {
        // Close any open panels/modals
        if (this.showCommandPalette) {
            this.closeCommandPalette();
        } else if (this.showMemoryPanel) {
            this.showMemoryPanel = false;
        } else if (this.showContextPanel) {
            this.showContextPanel = false;
        }
    }

    handleNewMessage(event) {
        const { message } = event.detail;
        this.messages = [...this.messages, message];

        // Auto-activate if in idle state
        if (this.state === ZenLayout.STATES.IDLE) {
            this.state = ZenLayout.STATES.ACTIVE;
        }

        // Scroll to bottom
        this.updateComplete.then(() => {
            const wrapper = this.shadowRoot.querySelector('.zen-conversation-wrapper');
            if (wrapper) {
                wrapper.scrollTop = wrapper.scrollHeight;
            }
        });
    }

    getStatusText() {
        switch (this.state) {
            case ZenLayout.STATES.LISTENING:
                return 'En écoute...';
            case ZenLayout.STATES.PROCESSING:
                return 'Traitement en cours...';
            case ZenLayout.STATES.ERROR:
                return 'Erreur';
            case ZenLayout.STATES.ACTIVE:
                return 'Prêt';
            default:
                return '';
        }
    }

    getStatusClass() {
        switch (this.state) {
            case ZenLayout.STATES.LISTENING:
                return 'listening';
            case ZenLayout.STATES.PROCESSING:
                return 'processing';
            case ZenLayout.STATES.ERROR:
                return 'error';
            default:
                return '';
        }
    }

    renderIdleState() {
        return html`
            <div class="zen-idle">
                <div class="zen-icon">✨</div>
                <h1 class="zen-title">Bonjour, je suis Lucide</h1>
                <p class="zen-subtitle">
                    Appuyez sur
                    <span class="shortcut">⌘ Space</span>
                    pour commencer
                </p>
            </div>
        `;
    }

    renderActiveState() {
        return html`
            <div class="zen-active">
                <!-- Phase 2: Tabs -->
                <zen-tabs
                    .tabs="${this.tabs}"
                    .activeTabId="${this.activeTabId}"
                    @tab-changed="${(e) => { this.activeTabId = e.detail.tabId; }}"
                    @tab-added="${(e) => { this.tabs = [...this.tabs]; }}"
                    @tab-closed="${(e) => { this.tabs = this.tabs.filter(t => t.id !== e.detail.tabId); }}">
                </zen-tabs>

                <!-- Header -->
                <div class="zen-header">
                    <div class="zen-header-left">
                        <div class="zen-header-title">Lucide</div>
                        ${this.state !== ZenLayout.STATES.IDLE ? html`
                            <div class="zen-header-status">
                                <span class="status-indicator ${this.getStatusClass()}"></span>
                                <span>${this.getStatusText()}</span>
                            </div>
                        ` : ''}
                    </div>
                    <div class="zen-header-actions">
                        <button
                            class="zen-action-btn"
                            @click="${this.toggleMemoryPanel}"
                            title="Toggle memory panel (⌘M)">
                            ${this.showMemoryPanel ? '🧠' : '💭'} Mémoire
                        </button>
                        <button
                            class="zen-action-btn"
                            @click="${this.toggleContextPanel}"
                            title="Toggle context panel (⌘B)">
                            ${this.showContextPanel ? '→' : '←'} Contexte
                        </button>
                    </div>
                </div>

                <!-- Main Content -->
                <div class="zen-main">
                    <div class="zen-conversation-container">
                        <div class="zen-conversation-wrapper">
                            ${this.messages.length === 0 ? html`
                                <div class="zen-empty-state">
                                    <div class="zen-empty-state-icon">💬</div>
                                    <div class="zen-empty-state-text">
                                        Commencez une conversation avec Lucide.
                                        <br/>
                                        Posez une question ou lancez l'écoute.
                                    </div>
                                    <div class="zen-empty-state-hint">
                                        <span class="shortcut">⌘K</span>
                                        pour les actions rapides
                                    </div>
                                </div>
                            ` : html`
                                <!-- Messages will be rendered by ZenConversation component -->
                                <zen-conversation
                                    .messages="${this.messages}"
                                    .selectedProfile="${this.selectedProfile}">
                                </zen-conversation>
                            `}
                        </div>

                        <!-- Input Area -->
                        <div class="zen-input-container">
                            <zen-input
                                .state="${this.state}"
                                .isProcessing="${this.isProcessing}"
                                @message-sent="${this.handleNewMessage}">
                            </zen-input>
                        </div>
                    </div>

                    <!-- Phase 2: Memory Panel or Context Panel -->
                    ${this.showMemoryPanel ? html`
                        <div class="zen-context-panel">
                            <zen-memory-panel>
                            </zen-memory-panel>
                        </div>
                    ` : this.showContextPanel ? html`
                        <div class="zen-context-panel">
                            <zen-context-panel
                                .contextData="${this.contextData}"
                                .selectedProfile="${this.selectedProfile}">
                            </zen-context-panel>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }

    render() {
        const isActive = this.state !== ZenLayout.STATES.IDLE;

        return html`
            <div class="zen-container ${isActive ? 'active' : ''}">
                ${this.renderIdleState()}
                ${this.renderActiveState()}

                <!-- Phase 2: Command Palette -->
                <zen-command-palette
                    ?open="${this.showCommandPalette}"
                    @command-executed="${this.handleCommandExecuted}">
                </zen-command-palette>
            </div>
        `;
    }

    handleCommandExecuted(e) {
        const { command } = e.detail;
        console.log('[ZenLayout] Command executed:', command);

        // Close palette after execution
        this.closeCommandPalette();
    }
}

customElements.define('zen-layout', ZenLayout);
