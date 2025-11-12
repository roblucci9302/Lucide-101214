import { html, css, LitElement } from '../assets/lit-core-2.7.4.min.js';

/**
 * ZenConversation - Affiche les messages de conversation avec style bubble
 *
 * Chaque message a :
 * - author: 'user' | 'lucide'
 * - content: texte ou markdown
 * - timestamp: Date
 * - type: 'text' | 'code' | 'insight'
 * - actions: tableau d'actions disponibles
 */
export class ZenConversation extends LitElement {
    static properties = {
        messages: { type: Array },
        selectedProfile: { type: String },
        isStreaming: { type: Boolean }
    };

    static styles = css`
        :host {
            display: block;
            width: 100%;
        }

        * {
            font-family: 'Helvetica Neue', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        /* ────────────────[ MESSAGES CONTAINER ]─────────────── */
        .messages {
            display: flex;
            flex-direction: column;
            gap: 20px;
            width: 100%;
        }

        /* ────────────────[ MESSAGE BUBBLE ]─────────────── */
        .message {
            display: flex;
            flex-direction: column;
            max-width: 85%;
            animation: bubbleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
            opacity: 0;
            animation-fill-mode: forwards;
        }

        @keyframes bubbleIn {
            from {
                opacity: 0;
                transform: translateY(10px) scale(0.95);
            }
            to {
                opacity: 1;
                transform: translateY(0) scale(1);
            }
        }

        .message.user {
            align-self: flex-end;
            align-items: flex-end;
        }

        .message.lucide {
            align-self: flex-start;
            align-items: flex-start;
        }

        /* ────────────────[ BUBBLE CONTENT ]─────────────── */
        .bubble {
            padding: 12px 16px;
            border-radius: 16px;
            position: relative;
            word-wrap: break-word;
            word-break: break-word;
            user-select: text;
            cursor: text;
        }

        .message.user .bubble {
            background: linear-gradient(135deg, rgba(99, 102, 241, 0.8) 0%, rgba(139, 92, 246, 0.8) 100%);
            color: white;
            border-bottom-right-radius: 4px;
            box-shadow: 0 2px 8px rgba(99, 102, 241, 0.3);
        }

        .message.lucide .bubble {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            color: rgba(255, 255, 255, 0.95);
            border: 1px solid rgba(255, 255, 255, 0.15);
            border-bottom-left-radius: 4px;
        }

        /* ────────────────[ MESSAGE METADATA ]─────────────── */
        .message-meta {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-top: 6px;
            font-size: 11px;
            color: rgba(255, 255, 255, 0.5);
        }

        .message-author {
            font-weight: 500;
            color: rgba(255, 255, 255, 0.7);
        }

        .message.user .message-author {
            color: rgba(99, 102, 241, 0.9);
        }

        .message.lucide .message-author {
            color: rgba(139, 92, 246, 0.9);
        }

        .message-time {
            font-size: 10px;
            color: rgba(255, 255, 255, 0.4);
        }

        /* ────────────────[ MESSAGE ACTIONS ]─────────────── */
        .message-actions {
            display: flex;
            gap: 4px;
            margin-top: 8px;
            opacity: 0;
            transition: opacity 0.2s ease;
        }

        .message:hover .message-actions {
            opacity: 1;
        }

        .action-btn {
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.15);
            border-radius: 6px;
            padding: 4px 8px;
            font-size: 11px;
            color: rgba(255, 255, 255, 0.8);
            cursor: pointer;
            transition: all 0.15s ease;
            display: flex;
            align-items: center;
            gap: 4px;
        }

        .action-btn:hover {
            background: rgba(255, 255, 255, 0.15);
            border-color: rgba(255, 255, 255, 0.25);
            color: rgba(255, 255, 255, 1);
        }

        .action-btn:active {
            transform: scale(0.95);
        }

        /* ────────────────[ MARKDOWN CONTENT ]─────────────── */
        .bubble-content {
            line-height: 1.6;
            font-size: 14px;
        }

        .bubble-content p {
            margin: 0 0 8px 0;
        }

        .bubble-content p:last-child {
            margin-bottom: 0;
        }

        .bubble-content code {
            background: rgba(0, 0, 0, 0.3);
            padding: 2px 6px;
            border-radius: 4px;
            font-family: 'Monaco', 'Menlo', 'Consolas', monospace;
            font-size: 13px;
            color: #ffd700;
        }

        .bubble-content pre {
            background: rgba(0, 0, 0, 0.5);
            border-radius: 8px;
            padding: 12px;
            overflow-x: auto;
            margin: 8px 0;
            border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .bubble-content pre code {
            background: transparent;
            padding: 0;
            color: inherit;
            font-size: 12px;
            line-height: 1.5;
        }

        .bubble-content ul,
        .bubble-content ol {
            margin: 8px 0;
            padding-left: 20px;
        }

        .bubble-content li {
            margin: 4px 0;
        }

        .bubble-content strong {
            font-weight: 600;
            color: rgba(255, 255, 255, 1);
        }

        .bubble-content em {
            font-style: italic;
            color: rgba(255, 255, 255, 0.9);
        }

        .bubble-content a {
            color: #60a5fa;
            text-decoration: underline;
            cursor: pointer;
        }

        .bubble-content a:hover {
            color: #93c5fd;
        }

        /* ────────────────[ SPECIAL MESSAGE TYPES ]─────────────── */
        .message.insight .bubble {
            background: linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(5, 150, 105, 0.2) 100%);
            border: 1px solid rgba(16, 185, 129, 0.3);
        }

        .message.error .bubble {
            background: linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(220, 38, 38, 0.2) 100%);
            border: 1px solid rgba(239, 68, 68, 0.3);
        }

        /* ────────────────[ STREAMING INDICATOR ]─────────────── */
        .streaming-indicator {
            display: inline-flex;
            align-items: center;
            gap: 4px;
            margin-left: 8px;
        }

        .streaming-dot {
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.6);
            animation: pulse-dot 1.4s infinite ease-in-out both;
        }

        .streaming-dot:nth-child(1) {
            animation-delay: -0.32s;
        }

        .streaming-dot:nth-child(2) {
            animation-delay: -0.16s;
        }

        @keyframes pulse-dot {
            0%, 80%, 100% {
                opacity: 0.3;
                transform: scale(0.8);
            }
            40% {
                opacity: 1;
                transform: scale(1);
            }
        }

        /* ────────────────[ AVATAR ]─────────────── */
        .message-avatar {
            width: 28px;
            height: 28px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
            margin-bottom: 8px;
            flex-shrink: 0;
        }

        .message.user .message-avatar {
            background: linear-gradient(135deg, rgba(99, 102, 241, 0.3) 0%, rgba(139, 92, 246, 0.3) 100%);
            border: 1px solid rgba(99, 102, 241, 0.5);
        }

        .message.lucide .message-avatar {
            background: linear-gradient(135deg, rgba(139, 92, 246, 0.3) 0%, rgba(167, 139, 250, 0.3) 100%);
            border: 1px solid rgba(139, 92, 246, 0.5);
        }

        /* ────────────────[ GLASS BYPASS ]─────────────── */
        :host-context(body.has-glass) .bubble {
            background: transparent !important;
            backdrop-filter: none !important;
            border: none !important;
            box-shadow: none !important;
        }

        :host-context(body.has-glass) .action-btn {
            background: transparent !important;
            border: none !important;
        }

        :host-context(body.has-glass) .message-avatar {
            background: transparent !important;
            border: none !important;
        }

        /* ────────────────[ RESPONSIVE ]─────────────── */
        @media (max-width: 768px) {
            .message {
                max-width: 90%;
            }

            .bubble {
                padding: 10px 14px;
                font-size: 13px;
            }

            .message-avatar {
                width: 24px;
                height: 24px;
                font-size: 12px;
            }
        }
    `;

    constructor() {
        super();
        this.messages = [];
        this.selectedProfile = 'lucide_assistant';
        this.isStreaming = false;
    }

    formatTimestamp(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now - date;

        // Less than 1 minute
        if (diff < 60000) {
            return 'À l\'instant';
        }

        // Less than 1 hour
        if (diff < 3600000) {
            const minutes = Math.floor(diff / 60000);
            return `Il y a ${minutes} min`;
        }

        // Less than 24 hours
        if (diff < 86400000) {
            const hours = Math.floor(diff / 3600000);
            return `Il y a ${hours}h`;
        }

        // Format as time
        return date.toLocaleTimeString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    getAuthorName(author) {
        if (author === 'user') {
            return 'Vous';
        }

        // Map profile to agent name
        const profileNames = {
            'rh': 'Lucide RH',
            'exec': 'Lucide Exec',
            'dev': 'Lucide Dev',
            'marketing': 'Lucide Marketing',
            'support': 'Lucide Support',
            'lucide_assistant': 'Lucide'
        };

        return profileNames[this.selectedProfile] || 'Lucide';
    }

    getAuthorIcon(author) {
        if (author === 'user') {
            return '👤';
        }

        // Map profile to icon
        const profileIcons = {
            'rh': '👥',
            'exec': '💼',
            'dev': '💻',
            'marketing': '📢',
            'support': '🎧',
            'lucide_assistant': '✨'
        };

        return profileIcons[this.selectedProfile] || '✨';
    }

    async handleCopy(content) {
        try {
            await navigator.clipboard.writeText(content);
            console.log('[ZenConversation] Content copied');
        } catch (err) {
            console.error('[ZenConversation] Failed to copy:', err);
        }
    }

    handleReformulate(message) {
        this.dispatchEvent(new CustomEvent('reformulate-request', {
            detail: { message },
            bubbles: true,
            composed: true
        }));
    }

    renderMessageContent(message) {
        // Simple markdown-like rendering
        // For production, use marked.js or similar
        let content = message.content;

        // Escape HTML
        const div = document.createElement('div');
        div.textContent = content;
        content = div.innerHTML;

        // Basic markdown patterns
        content = content.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
        content = content.replace(/\*(.+?)\*/g, '<em>$1</em>');
        content = content.replace(/`(.+?)`/g, '<code>$1</code>');
        content = content.replace(/\n/g, '<br/>');

        return html`<div class="bubble-content" .innerHTML="${content}"></div>`;
    }

    renderMessage(message, index) {
        const author = message.author || 'lucide';
        const messageType = message.type || 'text';
        const timestamp = message.timestamp || Date.now();

        return html`
            <div
                class="message ${author} ${messageType}"
                style="animation-delay: ${index * 0.05}s">

                <div class="message-avatar">
                    ${this.getAuthorIcon(author)}
                </div>

                <div class="bubble">
                    ${this.renderMessageContent(message)}

                    ${this.isStreaming && index === this.messages.length - 1 ? html`
                        <span class="streaming-indicator">
                            <span class="streaming-dot"></span>
                            <span class="streaming-dot"></span>
                            <span class="streaming-dot"></span>
                        </span>
                    ` : ''}
                </div>

                <div class="message-meta">
                    <span class="message-author">${this.getAuthorName(author)}</span>
                    <span>•</span>
                    <span class="message-time">${this.formatTimestamp(timestamp)}</span>
                </div>

                ${author === 'lucide' ? html`
                    <div class="message-actions">
                        <button
                            class="action-btn"
                            @click="${() => this.handleCopy(message.content)}"
                            title="Copier">
                            📋 Copier
                        </button>
                        <button
                            class="action-btn"
                            @click="${() => this.handleReformulate(message)}"
                            title="Reformuler">
                            🔄 Reformuler
                        </button>
                    </div>
                ` : ''}
            </div>
        `;
    }

    render() {
        if (this.messages.length === 0) {
            return html``;
        }

        return html`
            <div class="messages">
                ${this.messages.map((msg, index) => this.renderMessage(msg, index))}
            </div>
        `;
    }
}

customElements.define('zen-conversation', ZenConversation);
