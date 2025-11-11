import { html, css, LitElement } from '../assets/lit-core-2.7.4.min.js';

/**
 * ResponseCard - Carte de réponse enrichie avec interactions
 * Affiche du contenu markdown avec menu contextuel, copy sur code,
 * sources cliquables et feedback inline
 * Sobre et professionnel, sans emojis
 */
export class ResponseCard extends LitElement {
    static properties = {
        content: { type: String }, // Contenu markdown/HTML
        sources: { type: Array }, // Sources [{title, url, icon}]
        streaming: { type: Boolean }, // Streaming en cours
        timestamp: { type: Number }, // Timestamp de création
        menuOpen: { type: Boolean, state: true }, // Menu contextuel ouvert
        copiedCode: { type: String, state: true }, // ID du code copié
        feedback: { type: String, state: true }, // 'up' | 'down' | null
    };

    static styles = css`
        :host {
            display: block;
            margin: var(--space-md) 0;
        }

        .response-card {
            position: relative;
            background: var(--bg-secondary);
            backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-saturation));
            border-radius: var(--radius-lg);
            border: 1px solid var(--border-subtle);
            padding: var(--space-lg);
            box-shadow: var(--shadow-sm);
            transition: all var(--timing-fast) var(--easing-standard);
        }

        .response-card:hover {
            box-shadow: var(--shadow-md);
            transform: translateY(-1px);
        }

        /* Header */
        .response-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: var(--space-md);
            padding-bottom: var(--space-sm);
            border-bottom: 1px solid var(--border-subtle);
        }

        .response-label {
            font-size: var(--text-sm);
            font-weight: var(--font-semibold);
            color: var(--text-secondary);
            text-transform: uppercase;
            letter-spacing: var(--tracking-wide);
        }

        .response-menu-container {
            position: relative;
        }

        .menu-trigger {
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: var(--radius-sm);
            cursor: pointer;
            transition: background var(--timing-fast);
            color: var(--text-tertiary);
        }

        .menu-trigger:hover {
            background: var(--bg-overlay);
            color: var(--text-secondary);
        }

        .menu-dropdown {
            position: absolute;
            top: calc(100% + 4px);
            right: 0;
            min-width: 180px;
            background: var(--bg-tertiary);
            backdrop-filter: blur(var(--glass-blur));
            border-radius: var(--radius-md);
            border: 1px solid var(--border-medium);
            box-shadow: var(--shadow-lg);
            overflow: hidden;
            z-index: var(--z-dropdown);
            opacity: 0;
            pointer-events: none;
            transform: translateY(-4px);
            transition: all var(--timing-fast) var(--easing-standard);
        }

        .menu-dropdown.open {
            opacity: 1;
            pointer-events: all;
            transform: translateY(0);
        }

        .menu-item {
            display: flex;
            align-items: center;
            gap: var(--space-sm);
            padding: 10px var(--space-md);
            font-size: var(--text-sm);
            color: var(--text-primary);
            cursor: pointer;
            transition: background var(--timing-fast);
        }

        .menu-item:hover {
            background: var(--bg-overlay);
        }

        .menu-icon {
            width: 16px;
            height: 16px;
            opacity: 0.6;
        }

        /* Content */
        .response-content {
            font-size: var(--text-base);
            color: var(--text-primary);
            line-height: var(--leading-normal);
            user-select: text;
        }

        /* Streaming animation */
        .response-content.streaming::after {
            content: '▋';
            animation: blink 1s infinite;
            margin-left: 2px;
        }

        @keyframes blink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0; }
        }

        /* Code blocks */
        .code-block-wrapper {
            position: relative;
            margin: var(--space-md) 0;
        }

        .code-block-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: var(--space-sm) var(--space-md);
            background: var(--bg-overlay);
            border-radius: var(--radius-md) var(--radius-md) 0 0;
            border-bottom: 1px solid var(--border-subtle);
        }

        .code-language {
            font-size: var(--text-xs);
            font-weight: var(--font-medium);
            color: var(--text-secondary);
            text-transform: uppercase;
            letter-spacing: var(--tracking-wide);
        }

        .copy-button {
            display: flex;
            align-items: center;
            gap: 4px;
            padding: 4px var(--space-sm);
            font-size: var(--text-xs);
            font-weight: var(--font-medium);
            color: var(--text-secondary);
            background: transparent;
            border: 1px solid var(--border-subtle);
            border-radius: var(--radius-xs);
            cursor: pointer;
            transition: all var(--timing-fast);
        }

        .copy-button:hover {
            color: var(--text-primary);
            border-color: var(--border-medium);
            background: var(--bg-overlay);
        }

        .copy-button.copied {
            color: var(--state-success);
            border-color: var(--state-success);
        }

        .copy-icon {
            width: 12px;
            height: 12px;
        }

        pre {
            margin: 0;
            padding: var(--space-md);
            background: rgba(0, 0, 0, 0.4);
            border-radius: 0 0 var(--radius-md) var(--radius-md);
            overflow-x: auto;
            font-family: var(--font-mono);
            font-size: 11px;
        }

        code {
            font-family: var(--font-mono);
            font-size: 11px;
        }

        /* Sources */
        .sources {
            display: flex;
            flex-wrap: wrap;
            gap: var(--space-sm);
            margin-top: var(--space-md);
            padding-top: var(--space-md);
            border-top: 1px solid var(--border-subtle);
        }

        .sources-label {
            width: 100%;
            font-size: var(--text-xs);
            color: var(--text-tertiary);
            margin-bottom: var(--space-xs);
        }

        .source-chip {
            display: inline-flex;
            align-items: center;
            gap: 4px;
            padding: 4px 10px;
            font-size: var(--text-xs);
            font-weight: var(--font-medium);
            color: var(--text-secondary);
            background: var(--bg-overlay);
            border: 1px solid var(--border-subtle);
            border-radius: var(--radius-full);
            cursor: pointer;
            transition: all var(--timing-fast);
        }

        .source-chip:hover {
            color: var(--text-primary);
            border-color: var(--border-medium);
            background: var(--bg-hover);
            transform: translateY(-1px);
        }

        .source-icon {
            width: 12px;
            height: 12px;
        }

        /* Feedback bar */
        .feedback-bar {
            display: flex;
            align-items: center;
            gap: var(--space-md);
            margin-top: var(--space-md);
            padding-top: var(--space-md);
            border-top: 1px solid var(--border-subtle);
        }

        .feedback-button {
            display: flex;
            align-items: center;
            gap: 6px;
            padding: 6px 10px;
            font-size: var(--text-xs);
            font-weight: var(--font-medium);
            color: var(--text-secondary);
            background: transparent;
            border: 1px solid var(--border-subtle);
            border-radius: var(--radius-sm);
            cursor: pointer;
            transition: all var(--timing-fast);
        }

        .feedback-button:hover {
            color: var(--text-primary);
            border-color: var(--border-medium);
            background: var(--bg-overlay);
        }

        .feedback-button.active {
            color: var(--state-info);
            border-color: var(--state-info);
            background: var(--state-info-bg);
        }

        .feedback-button.active-up {
            color: var(--state-success);
            border-color: var(--state-success);
            background: var(--state-success-bg);
        }

        .feedback-button.active-down {
            color: var(--state-error);
            border-color: var(--state-error);
            background: var(--state-error-bg);
        }

        .feedback-icon {
            width: 14px;
            height: 14px;
        }

        /* Responsive */
        @media (max-width: 640px) {
            .response-card {
                padding: var(--space-md);
            }

            .feedback-bar {
                flex-wrap: wrap;
            }

            .feedback-button {
                flex: 1;
                justify-content: center;
            }
        }

        /* Reduced motion */
        @media (prefers-reduced-motion: reduce) {
            .response-card,
            .menu-dropdown,
            .copy-button,
            .source-chip {
                transition: none;
            }

            .response-content.streaming::after {
                animation: none;
            }
        }

        /* Glass bypass */
        :host-context(body.has-glass) .response-card {
            background: transparent;
            backdrop-filter: none;
            box-shadow: none;
        }
    `;

    constructor() {
        super();
        this.content = '';
        this.sources = [];
        this.streaming = false;
        this.timestamp = Date.now();
        this.menuOpen = false;
        this.copiedCode = null;
        this.feedback = null;
    }

    toggleMenu() {
        this.menuOpen = !this.menuOpen;

        // Fermer le menu si on clique ailleurs
        if (this.menuOpen) {
            setTimeout(() => {
                const closeMenu = (e) => {
                    if (!e.composedPath().includes(this.shadowRoot.querySelector('.response-menu-container'))) {
                        this.menuOpen = false;
                        document.removeEventListener('click', closeMenu);
                    }
                };
                document.addEventListener('click', closeMenu);
            }, 0);
        }
    }

    handleMenuAction(action) {
        this.menuOpen = false;

        switch (action) {
            case 'copy':
                this.copyResponse();
                break;
            case 'export':
                this.exportMarkdown();
                break;
            case 'save':
                this.saveToFavorites();
                break;
            case 'delete':
                this.deleteResponse();
                break;
        }

        this.dispatchEvent(new CustomEvent('menu-action', {
            detail: { action },
            bubbles: true,
            composed: true
        }));
    }

    copyResponse() {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(this.content).then(() => {
                console.log('[ResponseCard] Response copied to clipboard');
            }).catch(err => {
                console.error('[ResponseCard] Failed to copy:', err);
            });
        }
    }

    exportMarkdown() {
        const blob = new Blob([this.content], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `lucide-response-${this.timestamp}.md`;
        a.click();
        URL.revokeObjectURL(url);
    }

    saveToFavorites() {
        console.log('[ResponseCard] Save to favorites');
        // À implémenter avec le backend
    }

    deleteResponse() {
        console.log('[ResponseCard] Delete response');
        this.dispatchEvent(new CustomEvent('delete-response', {
            detail: { timestamp: this.timestamp },
            bubbles: true,
            composed: true
        }));
    }

    copyCode(code, id) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(code).then(() => {
                this.copiedCode = id;
                setTimeout(() => {
                    this.copiedCode = null;
                }, 2000);
            }).catch(err => {
                console.error('[ResponseCard] Failed to copy code:', err);
            });
        }
    }

    handleSourceClick(source) {
        console.log('[ResponseCard] Source clicked:', source);
        this.dispatchEvent(new CustomEvent('source-click', {
            detail: { source },
            bubbles: true,
            composed: true
        }));
    }

    handleFeedback(type) {
        this.feedback = this.feedback === type ? null : type;

        this.dispatchEvent(new CustomEvent('feedback', {
            detail: { type: this.feedback, timestamp: this.timestamp },
            bubbles: true,
            composed: true
        }));
    }

    handleReformulate() {
        this.dispatchEvent(new CustomEvent('reformulate', {
            detail: { content: this.content },
            bubbles: true,
            composed: true
        }));
    }

    renderMenu() {
        return html`
            <div class="response-menu-container">
                <div class="menu-trigger" @click="${this.toggleMenu}">
                    <svg viewBox="0 0 16 16" fill="currentColor" width="16" height="16">
                        <circle cx="8" cy="3" r="1.5"/>
                        <circle cx="8" cy="8" r="1.5"/>
                        <circle cx="8" cy="13" r="1.5"/>
                    </svg>
                </div>

                <div class="menu-dropdown ${this.menuOpen ? 'open' : ''}">
                    <div class="menu-item" @click="${() => this.handleMenuAction('copy')}">
                        <svg class="menu-icon" viewBox="0 0 16 16" fill="currentColor">
                            <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/>
                            <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/>
                        </svg>
                        <span>Copier la réponse</span>
                    </div>
                    <div class="menu-item" @click="${() => this.handleMenuAction('export')}">
                        <svg class="menu-icon" viewBox="0 0 16 16" fill="currentColor">
                            <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
                            <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/>
                        </svg>
                        <span>Exporter en Markdown</span>
                    </div>
                    <div class="menu-item" @click="${() => this.handleMenuAction('save')}">
                        <svg class="menu-icon" viewBox="0 0 16 16" fill="currentColor">
                            <path d="M2 1a1 1 0 0 0-1 1v4.586a1 1 0 0 0 .293.707l7 7a1 1 0 0 0 1.414 0l4.586-4.586a1 1 0 0 0 0-1.414l-7-7A1 1 0 0 0 6.586 1H2zm4 3.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
                        </svg>
                        <span>Sauvegarder</span>
                    </div>
                    <div class="menu-item" @click="${() => this.handleMenuAction('delete')}">
                        <svg class="menu-icon" viewBox="0 0 16 16" fill="currentColor">
                            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                            <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                        </svg>
                        <span>Supprimer</span>
                    </div>
                </div>
            </div>
        `;
    }

    render() {
        return html`
            <div class="response-card">
                <div class="response-header">
                    <span class="response-label">Réponse</span>
                    ${this.renderMenu()}
                </div>

                <div class="response-content ${this.streaming ? 'streaming' : ''}">
                    <slot></slot>
                </div>

                ${this.sources && this.sources.length > 0 ? html`
                    <div class="sources">
                        <div class="sources-label">Sources:</div>
                        ${this.sources.map(source => html`
                            <div class="source-chip" @click="${() => this.handleSourceClick(source)}">
                                <svg class="source-icon" viewBox="0 0 16 16" fill="currentColor">
                                    <path d="M5 0h6a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2z"/>
                                </svg>
                                <span>${source.title || source.url}</span>
                            </div>
                        `)}
                    </div>
                ` : ''}

                <div class="feedback-bar">
                    <button
                        class="feedback-button ${this.feedback === 'up' ? 'active-up' : ''}"
                        @click="${() => this.handleFeedback('up')}">
                        <svg class="feedback-icon" viewBox="0 0 16 16" fill="currentColor">
                            <path d="M8.864.046C7.908-.193 7.02.53 6.956 1.466c-.072 1.051-.23 2.016-.428 2.59-.125.36-.479 1.013-1.04 1.639-.557.623-1.282 1.178-2.131 1.41C2.685 7.288 2 7.87 2 8.72v4.001c0 .845.682 1.464 1.448 1.545 1.07.114 1.564.415 2.068.723l.048.03c.272.165.578.348.97.484.397.136.861.217 1.466.217h3.5c.937 0 1.599-.477 1.934-1.064a1.86 1.86 0 0 0 .254-.912c0-.152-.023-.312-.077-.464.201-.263.38-.578.488-.901.11-.33.172-.762.004-1.149.069-.13.12-.269.159-.403.077-.27.113-.568.113-.857 0-.288-.036-.585-.113-.856a2.144 2.144 0 0 0-.138-.362 1.9 1.9 0 0 0 .234-1.734c-.206-.592-.682-1.1-1.2-1.272-.847-.282-1.803-.276-2.516-.211a9.84 9.84 0 0 0-.443.05 9.365 9.365 0 0 0-.062-4.509A1.38 1.38 0 0 0 9.125.111L8.864.046zM11.5 14.721H8c-.51 0-.863-.069-1.14-.164-.281-.097-.506-.228-.776-.393l-.04-.024c-.555-.339-1.198-.731-2.49-.868-.333-.036-.554-.29-.554-.55V8.72c0-.254.226-.543.62-.65 1.095-.3 1.977-.996 2.614-1.708.635-.71 1.064-1.475 1.238-1.978.243-.7.407-1.768.482-2.85.025-.362.36-.594.667-.518l.262.066c.16.04.258.143.288.255a8.34 8.34 0 0 1-.145 4.725.5.5 0 0 0 .595.644l.003-.001.014-.003.058-.014a8.908 8.908 0 0 1 1.036-.157c.663-.06 1.457-.054 2.11.164.175.058.45.3.57.65.107.308.087.67-.266 1.022l-.353.353.353.354c.043.043.105.141.154.315.048.167.075.37.075.581 0 .212-.027.414-.075.582-.05.174-.111.272-.154.315l-.353.353.353.354c.047.047.109.177.005.488a2.224 2.224 0 0 1-.505.805l-.353.353.353.354c.006.005.041.05.041.17a.866.866 0 0 1-.121.416c-.165.288-.503.56-1.066.56z"/>
                        </svg>
                        <span>Utile</span>
                    </button>

                    <button
                        class="feedback-button ${this.feedback === 'down' ? 'active-down' : ''}"
                        @click="${() => this.handleFeedback('down')}">
                        <svg class="feedback-icon" viewBox="0 0 16 16" fill="currentColor">
                            <path d="M8.864 15.674c-.956.24-1.843-.484-1.908-1.42-.072-1.05-.23-2.015-.428-2.59-.125-.36-.479-1.012-1.04-1.638-.557-.624-1.282-1.179-2.131-1.41C2.685 8.432 2 7.85 2 7V3c0-.845.682-1.464 1.448-1.546 1.07-.113 1.564-.415 2.068-.723l.048-.029c.272-.166.578-.349.97-.484C6.931.08 7.395 0 8 0h3.5c.937 0 1.599.478 1.934 1.064.164.287.254.607.254.913 0 .152-.023.312-.077.464.201.262.38.577.488.9.11.33.172.762.004 1.15.069.13.12.268.159.403.077.27.113.567.113.856 0 .289-.036.586-.113.856-.035.12-.08.244-.138.363.394.571.418 1.2.234 1.733-.206.592-.682 1.1-1.2 1.272-.847.283-1.803.276-2.516.211a9.877 9.877 0 0 1-.443-.05 9.364 9.364 0 0 1-.062 4.51c-.138.508-.55.848-1.012.964l-.261.065zM11.5 1H8c-.51 0-.863.068-1.14.163-.281.097-.506.229-.776.393l-.04.025c-.555.338-1.198.73-2.49.868-.333.035-.554.29-.554.55V7c0 .255.226.543.62.65 1.095.3 1.977.997 2.614 1.709.635.71 1.064 1.475 1.238 1.977.243.7.407 1.768.482 2.85.025.362.36.595.667.518l.262-.065c.16-.04.258-.144.288-.255a8.34 8.34 0 0 0-.145-4.726.5.5 0 0 1 .595-.643h.003l.014.004.058.013a8.912 8.912 0 0 0 1.036.157c.663.06 1.457.054 2.11-.163.175-.059.45-.301.57-.651.107-.308.087-.67-.266-1.021L12.793 7l.353-.354c.043-.042.105-.14.154-.315.048-.167.075-.37.075-.581 0-.211-.027-.414-.075-.581-.05-.174-.111-.273-.154-.315l-.353-.354.353-.354c.047-.047.109-.176.005-.488a2.224 2.224 0 0 0-.505-.804l-.353-.354.353-.354c.006-.005.041-.05.041-.17a.866.866 0 0 0-.121-.415C12.4 1.272 12.063 1 11.5 1z"/>
                        </svg>
                        <span>Pas utile</span>
                    </button>

                    <button class="feedback-button" @click="${() => this.handleReformulate()}">
                        <svg class="feedback-icon" viewBox="0 0 16 16" fill="currentColor">
                            <path fill-rule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"/>
                            <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"/>
                        </svg>
                        <span>Reformuler</span>
                    </button>
                </div>
            </div>
        `;
    }
}

customElements.define('response-card', ResponseCard);
