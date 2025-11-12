import { html, css, LitElement } from '../assets/lit-core-2.7.4.min.js';

/**
 * ZenInput - Zone de saisie principale de l'interface Zen
 *
 * Features :
 * - Auto-resize textarea
 * - Support markdown
 * - États visuels (idle, listening, processing)
 * - Actions rapides (Send, Listen, Attach)
 * - Shortcuts clavier
 */
export class ZenInput extends LitElement {
    static properties = {
        state: { type: String },
        value: { type: String },
        isProcessing: { type: Boolean },
        placeholder: { type: String },
        maxHeight: { type: Number }
    };

    static styles = css`
        :host {
            display: block;
            width: 100%;
        }

        * {
            font-family: 'Helvetica Neue', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        /* ────────────────[ INPUT CONTAINER ]─────────────── */
        .input-wrapper {
            display: flex;
            align-items: flex-end;
            gap: 12px;
            width: 100%;
            position: relative;
        }

        /* ────────────────[ TEXTAREA ]─────────────── */
        .input-field {
            flex: 1;
            background: rgba(255, 255, 255, 0.08);
            border: 1px solid rgba(255, 255, 255, 0.15);
            border-radius: 12px;
            padding: 12px 16px;
            color: rgba(255, 255, 255, 0.95);
            font-size: 14px;
            line-height: 1.5;
            resize: none;
            outline: none;
            min-height: 44px;
            max-height: 200px;
            overflow-y: auto;
            transition: all 0.2s ease;
            font-family: inherit;
        }

        .input-field::placeholder {
            color: rgba(255, 255, 255, 0.4);
        }

        .input-field:focus {
            background: rgba(255, 255, 255, 0.12);
            border-color: rgba(139, 92, 246, 0.5);
            box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
        }

        .input-field:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }

        /* Custom scrollbar */
        .input-field::-webkit-scrollbar {
            width: 4px;
        }

        .input-field::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 2px;
        }

        .input-field::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.2);
            border-radius: 2px;
        }

        /* ────────────────[ ACTION BUTTONS ]─────────────── */
        .input-actions {
            display: flex;
            gap: 8px;
            align-items: center;
        }

        .action-btn {
            width: 44px;
            height: 44px;
            border-radius: 12px;
            border: 1px solid rgba(255, 255, 255, 0.15);
            background: rgba(255, 255, 255, 0.08);
            color: rgba(255, 255, 255, 0.9);
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;
            transition: all 0.2s ease;
            flex-shrink: 0;
            position: relative;
            overflow: hidden;
        }

        .action-btn:hover {
            background: rgba(255, 255, 255, 0.12);
            border-color: rgba(255, 255, 255, 0.25);
            transform: translateY(-1px);
        }

        .action-btn:active {
            transform: translateY(0) scale(0.95);
        }

        .action-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
            transform: none !important;
        }

        /* Send Button - Primary */
        .action-btn.send {
            background: linear-gradient(135deg, rgba(99, 102, 241, 0.8) 0%, rgba(139, 92, 246, 0.8) 100%);
            border-color: rgba(139, 92, 246, 0.5);
        }

        .action-btn.send:hover {
            background: linear-gradient(135deg, rgba(99, 102, 241, 0.9) 0%, rgba(139, 92, 246, 0.9) 100%);
            box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
        }

        .action-btn.send:disabled {
            background: rgba(255, 255, 255, 0.08);
            border-color: rgba(255, 255, 255, 0.15);
        }

        /* Listen Button - Active state */
        .action-btn.listen.active {
            background: linear-gradient(135deg, rgba(239, 68, 68, 0.8) 0%, rgba(220, 38, 38, 0.8) 100%);
            border-color: rgba(239, 68, 68, 0.5);
            animation: pulse-listen 2s ease-in-out infinite;
        }

        @keyframes pulse-listen {
            0%, 100% {
                box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.5);
            }
            50% {
                box-shadow: 0 0 0 6px rgba(239, 68, 68, 0);
            }
        }

        /* Processing state */
        .action-btn.processing {
            pointer-events: none;
        }

        .action-btn.processing::after {
            content: '';
            position: absolute;
            width: 20px;
            height: 20px;
            border: 2px solid rgba(255, 255, 255, 0.3);
            border-top-color: rgba(255, 255, 255, 0.9);
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
            to {
                transform: rotate(360deg);
            }
        }

        /* ────────────────[ HINTS ]─────────────── */
        .input-hints {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 8px;
            font-size: 11px;
            color: rgba(255, 255, 255, 0.4);
        }

        .hint-left {
            display: flex;
            gap: 12px;
        }

        .hint-item {
            display: flex;
            align-items: center;
            gap: 4px;
        }

        .hint-shortcut {
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.15);
            border-radius: 4px;
            padding: 2px 6px;
            font-family: 'Monaco', 'Menlo', monospace;
            font-size: 10px;
        }

        .hint-right {
            color: rgba(255, 255, 255, 0.3);
        }

        /* ────────────────[ STATUS INDICATOR ]─────────────── */
        .status-bar {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 8px;
            padding: 8px 12px;
            background: rgba(0, 0, 0, 0.2);
            border-radius: 8px;
            font-size: 12px;
            color: rgba(255, 255, 255, 0.7);
            opacity: 0;
            transform: translateY(-5px);
            transition: all 0.2s ease;
        }

        .status-bar.visible {
            opacity: 1;
            transform: translateY(0);
        }

        .status-icon {
            font-size: 14px;
        }

        .status-text {
            flex: 1;
        }

        /* ────────────────[ GLASS BYPASS ]─────────────── */
        :host-context(body.has-glass) .input-field,
        :host-context(body.has-glass) .action-btn {
            background: transparent !important;
            backdrop-filter: none !important;
            border: none !important;
        }

        :host-context(body.has-glass) .action-btn:hover {
            background: transparent !important;
        }

        :host-context(body.has-glass) .status-bar {
            background: transparent !important;
        }

        /* ────────────────[ RESPONSIVE ]─────────────── */
        @media (max-width: 768px) {
            .input-field {
                font-size: 16px; /* Prevent iOS zoom */
            }

            .action-btn {
                width: 40px;
                height: 40px;
            }

            .input-hints {
                font-size: 10px;
            }

            .hint-left {
                display: none; /* Hide hints on mobile */
            }
        }
    `;

    constructor() {
        super();
        this.state = 'idle';
        this.value = '';
        this.isProcessing = false;
        this.placeholder = 'Posez une question à Lucide...';
        this.maxHeight = 200;
    }

    connectedCallback() {
        super.connectedCallback();
        this._keypressHandler = this.handleKeyPress.bind(this);
    }

    disconnectedCallback() {
        super.disconnectedCallback();
    }

    firstUpdated() {
        const textarea = this.shadowRoot.querySelector('.input-field');
        if (textarea) {
            textarea.addEventListener('keydown', this._keypressHandler);
            textarea.addEventListener('input', () => this.autoResize());
        }
    }

    handleKeyPress(e) {
        // Enter to send (without Shift)
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            this.handleSend();
        }

        // Shift+Enter for new line (default behavior)
    }

    autoResize() {
        const textarea = this.shadowRoot.querySelector('.input-field');
        if (!textarea) return;

        // Reset height to auto to get the correct scrollHeight
        textarea.style.height = 'auto';

        // Set new height (min 44px, max maxHeight)
        const newHeight = Math.min(textarea.scrollHeight, this.maxHeight);
        textarea.style.height = `${newHeight}px`;
    }

    handleInput(e) {
        this.value = e.target.value;
        this.autoResize();
    }

    async handleSend() {
        if (!this.value.trim() || this.isProcessing) return;

        const message = {
            author: 'user',
            content: this.value.trim(),
            timestamp: Date.now(),
            type: 'text'
        };

        // Dispatch event
        this.dispatchEvent(new CustomEvent('message-sent', {
            detail: { message },
            bubbles: true,
            composed: true
        }));

        // Clear input
        this.value = '';
        const textarea = this.shadowRoot.querySelector('.input-field');
        if (textarea) {
            textarea.value = '';
            textarea.style.height = 'auto';
        }

        // Focus back to input
        this.updateComplete.then(() => {
            textarea?.focus();
        });
    }

    async handleListen() {
        // Toggle listen mode via IPC
        if (window.api) {
            try {
                await window.api.mainHeader.sendListenButtonClick(
                    this.state === 'listening' ? 'Stop' : 'Écouter'
                );
            } catch (error) {
                console.error('[ZenInput] Failed to toggle listen:', error);
            }
        }

        // Toggle local state
        this.state = this.state === 'listening' ? 'idle' : 'listening';
    }

    handleAttach() {
        // Future: Open file picker for attachments
        console.log('[ZenInput] Attach file (future feature)');

        this.dispatchEvent(new CustomEvent('attach-file', {
            bubbles: true,
            composed: true
        }));
    }

    getPlaceholder() {
        switch (this.state) {
            case 'listening':
                return 'Lucide écoute... Parlez maintenant';
            case 'processing':
                return 'Lucide réfléchit...';
            default:
                return this.placeholder;
        }
    }

    getStatusMessage() {
        switch (this.state) {
            case 'listening':
                return { icon: '🎙️', text: 'En écoute active' };
            case 'processing':
                return { icon: '⚡', text: 'Traitement en cours...' };
            default:
                return null;
        }
    }

    render() {
        const canSend = this.value.trim().length > 0 && !this.isProcessing;
        const isListening = this.state === 'listening';
        const statusMessage = this.getStatusMessage();

        return html`
            <div class="zen-input">
                <!-- Status Bar -->
                ${statusMessage ? html`
                    <div class="status-bar visible">
                        <span class="status-icon">${statusMessage.icon}</span>
                        <span class="status-text">${statusMessage.text}</span>
                    </div>
                ` : ''}

                <!-- Input Wrapper -->
                <div class="input-wrapper">
                    <!-- Textarea -->
                    <textarea
                        class="input-field"
                        .value="${this.value}"
                        @input="${this.handleInput}"
                        placeholder="${this.getPlaceholder()}"
                        ?disabled="${this.isProcessing || isListening}"
                        rows="1"></textarea>

                    <!-- Actions -->
                    <div class="input-actions">
                        <!-- Attach Button -->
                        <button
                            class="action-btn attach"
                            @click="${this.handleAttach}"
                            ?disabled="${this.isProcessing || isListening}"
                            title="Joindre un fichier">
                            📎
                        </button>

                        <!-- Listen Button -->
                        <button
                            class="action-btn listen ${isListening ? 'active' : ''}"
                            @click="${this.handleListen}"
                            ?disabled="${this.isProcessing}"
                            title="${isListening ? 'Arrêter l\'écoute' : 'Activer l\'écoute'}">
                            ${isListening ? '⏹️' : '🎙️'}
                        </button>

                        <!-- Send Button -->
                        <button
                            class="action-btn send ${this.isProcessing ? 'processing' : ''}"
                            @click="${this.handleSend}"
                            ?disabled="${!canSend}"
                            title="Envoyer (Enter)">
                            ${this.isProcessing ? '' : '➤'}
                        </button>
                    </div>
                </div>

                <!-- Hints -->
                <div class="input-hints">
                    <div class="hint-left">
                        <div class="hint-item">
                            <span class="hint-shortcut">Enter</span>
                            <span>Envoyer</span>
                        </div>
                        <div class="hint-item">
                            <span class="hint-shortcut">Shift + Enter</span>
                            <span>Nouvelle ligne</span>
                        </div>
                    </div>
                    <div class="hint-right">
                        ${this.value.length} / 4000 caractères
                    </div>
                </div>
            </div>
        `;
    }
}

customElements.define('zen-input', ZenInput);
