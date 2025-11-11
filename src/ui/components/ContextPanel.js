import { html, css, LitElement } from '../assets/lit-core-2.7.4.min.js';

/**
 * ContextPanel - Panneau contextuel rétractable
 * Affiche des informations pertinentes, suggestions et actions rapides
 * Sobre et professionnel, sans emojis
 */
export class ContextPanel extends LitElement {
    static TYPES = {
        DISCOVERY: 'discovery',   // Ressources trouvées
        TEMPORAL: 'temporal',     // Contexte temporel
        SUGGESTION: 'suggestion', // Suggestions proactives
        ERROR: 'error'           // Erreurs et avertissements
    };

    static properties = {
        visible: { type: Boolean, reflect: true },
        collapsed: { type: Boolean, reflect: true },
        type: { type: String }, // 'discovery' | 'temporal' | 'suggestion' | 'error'
        title: { type: String },
        items: { type: Array },
        actions: { type: Array },
        storageKey: { type: String } // Clé pour localStorage
    };

    static styles = css`
        :host {
            display: block;
            margin-bottom: var(--space-lg);
            opacity: 0;
            transform: translateY(-8px);
            transition: all var(--timing-normal) var(--easing-standard);
            will-change: opacity, transform;
        }

        :host([visible]) {
            opacity: 1;
            transform: translateY(0);
        }

        :host([hidden]),
        :host(:not([visible])) {
            display: none;
        }

        .panel {
            background: var(--bg-secondary);
            backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-saturation));
            border-radius: var(--radius-lg);
            border: 1px solid var(--border-subtle);
            overflow: hidden;
            box-shadow: var(--shadow-sm);
            transition: box-shadow var(--timing-fast) var(--easing-standard);
        }

        .panel:hover {
            box-shadow: var(--shadow-md);
        }

        /* Types de panel */
        .panel--discovery {
            border-left: 3px solid var(--state-info);
        }

        .panel--temporal {
            border-left: 3px solid var(--state-warning);
        }

        .panel--suggestion {
            border-left: 3px solid var(--state-success);
        }

        .panel--error {
            border-left: 3px solid var(--state-error);
        }

        .panel-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: var(--space-md) var(--space-lg);
            cursor: pointer;
            user-select: none;
            transition: background var(--timing-fast);
        }

        .panel-header:hover {
            background: var(--bg-overlay);
        }

        .panel-header:active {
            background: var(--bg-hover);
        }

        .panel-title-container {
            display: flex;
            align-items: center;
            gap: var(--space-sm);
        }

        .panel-icon {
            width: 16px;
            height: 16px;
            flex-shrink: 0;
            opacity: 0.8;
        }

        .panel-icon svg {
            width: 100%;
            height: 100%;
        }

        /* Couleurs d'icônes selon le type */
        .panel--discovery .panel-icon {
            color: var(--state-info);
        }

        .panel--temporal .panel-icon {
            color: var(--state-warning);
        }

        .panel--suggestion .panel-icon {
            color: var(--state-success);
        }

        .panel--error .panel-icon {
            color: var(--state-error);
        }

        .panel-title {
            font-size: var(--text-sm);
            font-weight: var(--font-semibold);
            color: var(--text-primary);
            text-transform: uppercase;
            letter-spacing: var(--tracking-wide);
        }

        .panel-toggle {
            width: 16px;
            height: 16px;
            transition: transform var(--timing-fast);
            opacity: 0.6;
        }

        :host([collapsed]) .panel-toggle {
            transform: rotate(-90deg);
        }

        .panel-content {
            max-height: 500px;
            overflow: hidden;
            transition: max-height var(--timing-normal) var(--easing-standard),
                        opacity var(--timing-fast) var(--easing-standard);
            opacity: 1;
        }

        :host([collapsed]) .panel-content {
            max-height: 0;
            opacity: 0;
        }

        .panel-body {
            padding: 0 var(--space-lg) var(--space-lg);
        }

        .context-item {
            display: flex;
            align-items: flex-start;
            gap: var(--space-sm);
            padding: var(--space-sm) 0;
            font-size: var(--text-sm);
            color: var(--text-secondary);
            line-height: var(--leading-normal);
        }

        .context-item:not(:last-child) {
            border-bottom: 1px solid var(--border-subtle);
        }

        .context-icon {
            width: 16px;
            height: 16px;
            flex-shrink: 0;
            margin-top: 2px;
            opacity: 0.6;
        }

        .context-text {
            flex: 1;
        }

        .actions {
            display: flex;
            gap: var(--space-sm);
            margin-top: var(--space-md);
            flex-wrap: wrap;
        }

        .action-button {
            padding: 6px var(--space-md);
            font-size: var(--text-sm);
            font-weight: var(--font-medium);
            border-radius: var(--radius-sm);
            border: 1px solid var(--border-medium);
            background: transparent;
            color: var(--text-primary);
            cursor: pointer;
            transition: all var(--timing-fast);
            white-space: nowrap;
        }

        .action-button:hover {
            background: var(--bg-overlay);
            border-color: var(--border-strong);
            transform: translateY(-1px);
        }

        .action-button:active {
            transform: translateY(0);
        }

        .action-button--primary {
            background: var(--state-info);
            color: white;
            border-color: var(--state-info);
        }

        .action-button--primary:hover {
            opacity: 0.9;
            background: var(--state-info-hover);
        }

        /* Responsive */
        @media (max-width: 640px) {
            .panel-header {
                padding: var(--space-sm) var(--space-md);
            }

            .panel-body {
                padding: 0 var(--space-md) var(--space-md);
            }

            .actions {
                flex-direction: column;
            }

            .action-button {
                width: 100%;
            }
        }

        /* Reduced motion */
        @media (prefers-reduced-motion: reduce) {
            :host,
            .panel-content,
            .panel-toggle {
                transition: none;
            }
        }

        /* Glass bypass */
        :host-context(body.has-glass) .panel {
            background: transparent;
            backdrop-filter: none;
            box-shadow: none;
        }
    `;

    constructor() {
        super();
        this.visible = false;
        this.collapsed = false;
        this.type = ContextPanel.TYPES.DISCOVERY;
        this.title = '';
        this.items = [];
        this.actions = [];
        this.storageKey = 'context-panel-collapsed';
    }

    connectedCallback() {
        super.connectedCallback();
        // Restaurer l'état collapsed depuis localStorage
        const savedState = localStorage.getItem(this.storageKey);
        if (savedState !== null) {
            this.collapsed = savedState === 'true';
        }
    }

    toggleCollapse() {
        this.collapsed = !this.collapsed;
        localStorage.setItem(this.storageKey, this.collapsed.toString());

        // Dispatch event pour notifier le parent
        this.dispatchEvent(new CustomEvent('panel-toggle', {
            detail: { collapsed: this.collapsed },
            bubbles: true,
            composed: true
        }));
    }

    getIconPath(iconType) {
        const icons = {
            // Discovery
            search: 'M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z',

            // Temporal
            time: 'M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0z',

            // Link/Relation
            link: 'M4.715 6.542L3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.001 1.001 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243L6.586 4.672z',

            // Lightbulb/Suggestion
            lightbulb: 'M8 0a5 5 0 0 0-3 9v2.5A1.5 1.5 0 0 0 6.5 13h3a1.5 1.5 0 0 0 1.5-1.5V9a5 5 0 0 0-3-9zm2 8.5V11h-4V8.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .5.5zM8 1a4 4 0 0 1 2.5 7.086V8h-5v.086A4 4 0 0 1 8 1z M6.5 14.5a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1h-3z',

            // Document
            document: 'M5 0h6a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2zm0 1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H5z M6 5.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5z',

            // Warning
            warning: 'M7.938 2.016A.13.13 0 0 1 8.002 2a.13.13 0 0 1 .063.016.146.146 0 0 1 .054.057l6.857 11.667c.036.06.035.124.002.183a.163.163 0 0 1-.054.06.116.116 0 0 1-.066.017H1.146a.115.115 0 0 1-.066-.017.163.163 0 0 1-.054-.06.176.176 0 0 1 .002-.183L7.884 2.073a.147.147 0 0 1 .054-.057zm1.044-.45a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566z M7.002 12a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 5.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995z',

            // Info
            info: 'M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z M8.93 6.588l-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z'
        };

        return icons[iconType] || icons.info;
    }

    renderIcon(type) {
        const iconMap = {
            search: 'search',
            time: 'time',
            link: 'link',
            lightbulb: 'lightbulb',
            document: 'document',
            warning: 'warning',
            info: 'info'
        };

        const iconType = iconMap[type] || 'info';

        return html`
            <svg class="context-icon" viewBox="0 0 16 16" fill="currentColor">
                <path d="${this.getIconPath(iconType)}"/>
            </svg>
        `;
    }

    renderPanelIcon() {
        const typeIcons = {
            [ContextPanel.TYPES.DISCOVERY]: 'search',
            [ContextPanel.TYPES.TEMPORAL]: 'time',
            [ContextPanel.TYPES.SUGGESTION]: 'lightbulb',
            [ContextPanel.TYPES.ERROR]: 'warning'
        };

        const iconType = typeIcons[this.type] || 'info';

        return html`
            <div class="panel-icon">
                <svg viewBox="0 0 16 16" fill="currentColor">
                    <path d="${this.getIconPath(iconType)}"/>
                </svg>
            </div>
        `;
    }

    render() {
        if (!this.visible || !this.items || this.items.length === 0) {
            return html``;
        }

        return html`
            <div class="panel panel--${this.type}">
                <div class="panel-header" @click="${this.toggleCollapse}">
                    <div class="panel-title-container">
                        ${this.renderPanelIcon()}
                        <span class="panel-title">${this.title}</span>
                    </div>

                    <svg class="panel-toggle" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M4 6l4 4 4-4z"/>
                    </svg>
                </div>

                <div class="panel-content">
                    <div class="panel-body">
                        ${this.items.map(item => html`
                            <div class="context-item">
                                ${this.renderIcon(item.iconType || 'info')}
                                <span class="context-text">${item.text}</span>
                            </div>
                        `)}

                        ${this.actions && this.actions.length > 0 ? html`
                            <div class="actions">
                                ${this.actions.map(action => html`
                                    <button
                                        class="action-button ${action.primary ? 'action-button--primary' : ''}"
                                        @click="${action.handler}">
                                        ${action.label}
                                    </button>
                                `)}
                            </div>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
    }
}

customElements.define('context-panel', ContextPanel);
