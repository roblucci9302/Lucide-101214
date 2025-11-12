# ⚡ Proposition B: "Lucide Command"

**Philosophie:** Le cockpit de votre intelligence augmentée

**Tagline:** *"Toute votre cognition, sous contrôle"*

---

## 🎯 Vision

Lucide Command transforme l'assistant IA en **centre de commande cognitif**. Toutes les informations pertinentes sont visibles simultanément dans un layout multi-panel. La mémoire augmentée n'est pas cachée mais **affichée en permanence** dans des panels contextuels. Power users peuvent travailler à pleine vitesse avec des keyboard shortcuts avancés et des actions parallèles.

**Inspiration:** Linear, Superhuman, VS Code, Figma, Notion, Bloomberg Terminal

---

## 🖼️ Maquettes Visuelles

### Vue Principale - Command Center

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ ✨ Lucide Command          [⌘K] Quick Actions    [⌘/] Search    👤 Sarah (Dev)  14:32 │
├────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                        │
│ ┌──────────────────────┐ ┌─────────────────────────────────┐ ┌────────────────────┐  │
│ │ 🧠 MÉMOIRE ACTIVE    │ │ 💬 CONVERSATION PRINCIPALE      │ │ 📊 CONTEXTE LIVE   │  │
│ │                      │ │                                 │ │                    │  │
│ │ 📌 Épinglés:         │ │ ┌─────────────────────────────┐ │ │ 📂 Documents (3)   │  │
│ │ • Q4 Budget Analysis │ │ │ 💭 Vous           14:30     │ │ │ • rapport-Q4.pdf   │  │
│ │ • Team Roadmap 2025  │ │ │ Debug ce code Python qui... │ │ │ • budget.xlsx      │  │
│ │                      │ │ └─────────────────────────────┘ │ │ • roadmap.md       │  │
│ │ 🔗 Connexions (5):   │ │                                 │ │                    │  │
│ │ Budget ←→ Roadmap    │ │ ┌─────────────────────────────┐ │ │ 🎯 Tâches (2)      │  │
│ │ Python ←→ API Docs   │ │ │ ✨ Lucide         14:30     │ │ │ • Finir feature X  │  │
│ │                      │ │ │ J'ai identifié le problème: │ │ │ • Review PR #234   │  │
│ │ 📈 Insights:         │ │ │                             │ │ │                    │  │
│ │ • 3 décisions en     │ │ │ ```python                   │ │ │ 📅 Events          │  │
│ │   attente            │ │ │ def process():              │ │ │ • Meeting 15h30    │  │
│ │ • Pattern détecté    │ │ │   # Bug ici ─────────────►  │ │ │ • Demo 17h00       │  │
│ │   dans vos sessions  │ │ │   data = []                 │ │ │                    │  │
│ │                      │ │ │ ```                         │ │ │ 🔔 Notifications   │  │
│ │ 🎭 Actions:          │ │ │                             │ │ │ • PR approved ✓    │  │
│ │ [Créer résumé]       │ │ │ Solutions:                  │ │ │ • Build passed ✓   │  │
│ │ [Exporter tout]      │ │ │ 1. Initialiser liste       │ │ │                    │  │
│ │                      │ │ │ 2. Type hint manquant       │ │ │ 💡 Suggestions     │  │
│ │                      │ │ │ 3. Error handling           │ │ │ • "Résumer le      │  │
│ │ Scroll...            │ │ │                             │ │ │    meeting 15h30"  │  │
│ │                      │ │ │ [Copier] [Appliquer] [+]    │ │ │ • "Préparer demo"  │  │
│ │                      │ │ └─────────────────────────────┘ │ │                    │  │
│ │                      │ │                                 │ │ [Actualiser] [⚙️]  │  │
│ │ 240px width          │ │ ┌─────────────────────────────┐ │ │ 280px width        │  │
│ │ Resizable ◄►         │ │ │ 💬 Quick reply...     [🎙️] │ │ │ Resizable ◄►       │  │
│ │                      │ │ └─────────────────────────────┘ │ │                    │  │
│ └──────────────────────┘ │                                 │ └────────────────────┘  │
│                          │ Flexible, scroll infini         │                         │
│                          └─────────────────────────────────┘                         │
│                                                                                        │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ 📊 Activity: 47 conversations · 8.3h · 234 insights  │  💾 Synced 2 min ago  │  🌓  │
└────────────────────────────────────────────────────────────────────────────────────────┘

       Three-column layout - Resizable panels
       Left: Memory & Connections (240-400px)
       Center: Main conversation (flexible)
       Right: Context & Actions (280-400px)
       Bottom: Stats bar
```

### Multi-Conversation Mode (Tabs)

```
┌────────────────────────────────────────────────────────────────────────────────┐
│ ✨ Lucide Command                                                   👤 Sarah   │
├────────────────────────────────────────────────────────────────────────────────┤
│ ┌──────────┐┌──────────┐┌──────────┐┌──────────┐┌─────┐                      │
│ │💬 Debug  ││📊 Budget ││✉️ Email  ││📝 Draft  ││  +  │                      │
│ │  [●]     ││  [2]     ││          ││          ││     │  ← Tabs actifs       │
│ └──────────┘└──────────┘└──────────┘└──────────┘└─────┘                      │
├────────────────────────────────────────────────────────────────────────────────┤
│                                                                                │
│ [Panel gauche]    [Conversation du tab actif]         [Panel droit]           │
│                                                                                │
│ Chaque tab = contexte séparé                                                  │
│ Switch rapide: ⌘1, ⌘2, ⌘3...                                                  │
│ Badge count pour nouvelles réponses                                           │
│                                                                                │
└────────────────────────────────────────────────────────────────────────────────┘
```

### Command Palette Avancé (⌘K)

```
┌───────────────────────────────────────────────────────────────────────┐
│ ⚡ Command Palette                                      Type to search│
├───────────────────────────────────────────────────────────────────────┤
│                                                                       │
│ > debug python                                                        │
│   ▔▔▔▔▔▔▔▔▔▔▔▔                                                        │
│                                                                       │
│ 🔍 Recherche:                                                         │
│ ┌───────────────────────────────────────────────────────────────┐    │
│ │ 🐛 Debug Python code                                   ⌘D    │    │
│ ├───────────────────────────────────────────────────────────────┤    │
│ │ 💬 "Debug ce code" (conv. il y a 2h)               Ouvrir    │    │
│ ├───────────────────────────────────────────────────────────────┤    │
│ │ 📝 Python debugging guide                          Lire      │    │
│ └───────────────────────────────────────────────────────────────┘    │
│                                                                       │
│ ⚡ Actions rapides:                                                   │
│ • Nouvelle conversation                                     ⌘N       │
│ • Rechercher dans mémoire                                  ⌘F       │
│ • Exporter conversation                                    ⌘E       │
│ • Paramètres                                               ⌘,       │
│ • Changer de profil                                        ⌘P       │
│                                                                       │
│ 🎯 Suggestions contextuelles:                                        │
│ • "Continuer debug Python"                                           │
│ • "Résumer mes 3 dernières conversations"                            │
│ • "Créer action de suivi pour meeting 15h30"                         │
│                                                                       │
│ 💡 Tip: Utilisez Tab pour naviguer, Enter pour sélectionner          │
│                                                                       │
└───────────────────────────────────────────────────────────────────────┘

      Advanced command palette - Fuzzy search
      Multi-category results
      Keyboard navigation
      Recent commands history
```

### Timeline & Graph View

```
┌────────────────────────────────────────────────────────────────────────┐
│ 🧠 Mémoire Lucide              [Timeline] [Graph] [Calendar] [Search] │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│ ┌──────────────────────────────────────────────────────────────────┐  │
│ │                    GRAPH VIEW - Connexions                       │  │
│ │                                                                  │  │
│ │           ┌─────────┐                                            │  │
│ │           │ Budget  │                                            │  │
│ │           │   Q4    │──────────┐                                 │  │
│ │           └─────────┘          │                                 │  │
│ │                │               ▼                                 │  │
│ │                │          ┌─────────┐                            │  │
│ │                └─────────▶│Roadmap  │                            │  │
│ │                           │  2025   │                            │  │
│ │           ┌─────────┐     └─────────┘     ┌─────────┐            │  │
│ │           │ Python  │          │          │Marketing│            │  │
│ │           │  Debug  │──────────┘          │Campaign │            │  │
│ │           └─────────┘                     └─────────┘            │  │
│ │                │                                                 │  │
│ │                │                                                 │  │
│ │                ▼                                                 │  │
│ │           ┌─────────┐                                            │  │
│ │           │API Docs │                                            │  │
│ │           └─────────┘                                            │  │
│ │                                                                  │  │
│ │  Taille des nœuds = importance                                  │  │
│ │  Couleur = catégorie (Code, Business, Personal)                 │  │
│ │  Épaisseur liens = force de connexion                           │  │
│ │                                                                  │  │
│ └──────────────────────────────────────────────────────────────────┘  │
│                                                                        │
│ Filtres: [Tous] [Cette semaine] [Code] [Business] [Personal]          │
│                                                                        │
│ Actions: [Exporter en PNG] [Partager] [Créer résumé de cluster]       │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘

      Knowledge graph visualization
      Interactive nodes (click to open)
      Auto-clustering by topic
      Export options
```

### Split Screen Multi-Task

```
┌──────────────────────────────────────────────────────────────────────────┐
│ ✨ Lucide Command - Multi-task Mode                             ⌘M     │
├──────────────────────────────────────────────────────────────────────────┤
│                           │                                              │
│  💬 Conversation 1        │  💬 Conversation 2                           │
│  "Debug Python"           │  "Rédiger email"                             │
│                           │                                              │
│  ┌─────────────────────┐  │  ┌─────────────────────┐                    │
│  │ 💭 Vous             │  │  │ 💭 Vous             │                    │
│  │ Explique ce bug     │  │  │ Draft email pour... │                    │
│  └─────────────────────┘  │  └─────────────────────┘                    │
│                           │                                              │
│  ┌─────────────────────┐  │  ┌─────────────────────┐                    │
│  │ ✨ Lucide           │  │  │ ✨ Lucide           │                    │
│  │ Le bug vient de...  │  │  │ Voici un draft:     │                    │
│  │ [Code example]      │  │  │ Subject: ...        │                    │
│  └─────────────────────┘  │  └─────────────────────┘                    │
│                           │                                              │
│  💬 Reply...       [🎙️]  │  💬 Reply...       [🎙️]                     │
│                           │                                              │
├───────────────────────────┼──────────────────────────────────────────────┤
│ [Switch] [Merge] [Close]  │  [Switch] [Merge] [Close]                   │
└──────────────────────────────────────────────────────────────────────────┘

      Side-by-side conversations
      Independent contexts
      Cross-reference possible
      Merge conversations option
```

---

## 🎨 Système de Design Command

### Palette de couleurs - High Contrast

```css
/* Base Command - High visibility */
--cmd-bg-primary: rgba(15, 15, 18, 0.95);        /* Noir profond */
--cmd-bg-secondary: rgba(25, 25, 28, 0.97);      /* Gris très foncé */
--cmd-bg-tertiary: rgba(35, 35, 38, 0.98);       /* Gris foncé */
--cmd-bg-elevated: rgba(45, 45, 50, 0.98);       /* Gris moyen foncé */

/* Light mode Command - Pro terminal style */
--cmd-light-primary: rgba(245, 245, 248, 0.95);
--cmd-light-secondary: rgba(235, 235, 240, 0.97);
--cmd-light-tertiary: rgba(225, 225, 230, 0.98);

/* Accents vifs - Terminal inspired */
--cmd-accent-blue: #0EA5E9;      /* Cyan électrique */
--cmd-accent-green: #10B981;     /* Vert success */
--cmd-accent-yellow: #F59E0B;    /* Ambre warning */
--cmd-accent-red: #EF4444;       /* Rouge error */
--cmd-accent-purple: #8B5CF6;    /* Violet info */
--cmd-accent-pink: #EC4899;      /* Rose highlight */

/* Semantic colors */
--cmd-text-primary: rgba(255, 255, 255, 0.98);
--cmd-text-secondary: rgba(255, 255, 255, 0.75);
--cmd-text-tertiary: rgba(255, 255, 255, 0.50);
--cmd-text-disabled: rgba(255, 255, 255, 0.30);

/* Borders - Subtle but visible */
--cmd-border-subtle: rgba(255, 255, 255, 0.08);
--cmd-border-medium: rgba(255, 255, 255, 0.15);
--cmd-border-strong: rgba(255, 255, 255, 0.25);
--cmd-border-accent: rgba(14, 165, 233, 0.5);

/* Glassmorphisme Command - Plus prononcé */
--cmd-glass-blur: 40px;
--cmd-glass-opacity: 0.92;
--cmd-glass-saturation: 180%;
```

### Typographie Command - Monospace first

```css
/* Primary font - Code editor style */
--cmd-font-primary: 'JetBrains Mono', 'Fira Code', 'SF Mono', monospace;
--cmd-font-display: 'Inter', 'SF Pro Display', system-ui, sans-serif;

/* Tailles - Compact pour info density */
--cmd-text-xs: 10px;       /* Labels, metadata */
--cmd-text-sm: 12px;       /* Secondary text */
--cmd-text-base: 14px;     /* Body text */
--cmd-text-md: 16px;       /* Emphasized */
--cmd-text-lg: 18px;       /* Headings */
--cmd-text-xl: 22px;       /* Page titles */
--cmd-text-2xl: 28px;      /* Hero */

/* Line heights - Compact */
--cmd-leading-tight: 1.3;
--cmd-leading-normal: 1.5;
--cmd-leading-relaxed: 1.6;

/* Letter spacing - Terminal style */
--cmd-tracking-tight: -0.02em;
--cmd-tracking-normal: 0;
--cmd-tracking-wide: 0.02em;

/* Font weights */
--cmd-weight-normal: 400;
--cmd-weight-medium: 500;
--cmd-weight-semibold: 600;
--cmd-weight-bold: 700;
```

### Layout Grid - Precise 4px baseline

```css
--cmd-space-1: 4px;
--cmd-space-2: 8px;
--cmd-space-3: 12px;
--cmd-space-4: 16px;
--cmd-space-5: 20px;
--cmd-space-6: 24px;
--cmd-space-8: 32px;
--cmd-space-10: 40px;
--cmd-space-12: 48px;
--cmd-space-16: 64px;

/* Panel widths */
--cmd-panel-min: 240px;
--cmd-panel-default: 280px;
--cmd-panel-max: 400px;

/* Content widths */
--cmd-content-narrow: 600px;
--cmd-content-medium: 800px;
--cmd-content-wide: 1200px;
--cmd-content-full: 1600px;
```

### Animations Command - Snappy & Precise

```css
/* Timing - Fast for responsiveness */
--cmd-duration-instant: 0.1s;
--cmd-duration-fast: 0.15s;
--cmd-duration-normal: 0.2s;
--cmd-duration-slow: 0.3s;

/* Easing - Sharp transitions */
--cmd-ease-sharp: cubic-bezier(0.4, 0, 0.6, 1);
--cmd-ease-standard: cubic-bezier(0.4, 0, 0.2, 1);
--cmd-ease-emphasized: cubic-bezier(0.2, 0, 0, 1);
--cmd-ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
```

### Shadows - Elevated layers

```css
--cmd-shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.3),
                 0 0 0 1px rgba(255, 255, 255, 0.05);
--cmd-shadow-md: 0 4px 8px rgba(0, 0, 0, 0.4),
                 0 0 0 1px rgba(255, 255, 255, 0.08);
--cmd-shadow-lg: 0 8px 16px rgba(0, 0, 0, 0.5),
                 0 0 0 1px rgba(255, 255, 255, 0.1);
--cmd-shadow-xl: 0 16px 32px rgba(0, 0, 0, 0.6),
                 0 0 0 1px rgba(255, 255, 255, 0.12);

/* Glow effects */
--cmd-glow-accent: 0 0 20px rgba(14, 165, 233, 0.4);
--cmd-glow-success: 0 0 20px rgba(16, 185, 129, 0.4);
--cmd-glow-error: 0 0 20px rgba(239, 68, 68, 0.4);
```

---

## 🧩 Composants Clés Command

### CommandPanel (Resizable Container)

```javascript
class CommandPanel extends LitElement {
    static properties = {
        title: { type: String },
        width: { type: Number },
        minWidth: { type: Number },
        maxWidth: { type: Number },
        resizable: { type: Boolean },
        collapsed: { type: Boolean, state: true }
    };

    static styles = css`
        :host {
            display: flex;
            flex-direction: column;
            background: var(--cmd-bg-secondary);
            backdrop-filter: blur(var(--cmd-glass-blur));
            border-right: 1px solid var(--cmd-border-medium);
            position: relative;
            transition: width var(--cmd-duration-normal) var(--cmd-ease-standard);
        }

        :host([collapsed]) {
            width: 48px !important;
            min-width: 48px !important;
        }

        .panel-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: var(--cmd-space-4);
            border-bottom: 1px solid var(--cmd-border-subtle);
            background: var(--cmd-bg-tertiary);
            min-height: 48px;
        }

        .panel-title {
            font-size: var(--cmd-text-sm);
            font-weight: var(--cmd-weight-semibold);
            color: var(--cmd-text-primary);
            font-family: var(--cmd-font-display);
            text-transform: uppercase;
            letter-spacing: var(--cmd-tracking-wide);
        }

        .panel-actions {
            display: flex;
            gap: var(--cmd-space-2);
        }

        .panel-action-btn {
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: transparent;
            border: none;
            border-radius: 4px;
            color: var(--cmd-text-secondary);
            cursor: pointer;
            transition: all var(--cmd-duration-fast) var(--cmd-ease-sharp);
        }

        .panel-action-btn:hover {
            background: rgba(255, 255, 255, 0.08);
            color: var(--cmd-text-primary);
        }

        .panel-content {
            flex: 1;
            overflow-y: auto;
            overflow-x: hidden;
            padding: var(--cmd-space-4);
        }

        :host([collapsed]) .panel-content {
            display: none;
        }

        .resize-handle {
            position: absolute;
            top: 0;
            right: 0;
            width: 4px;
            height: 100%;
            cursor: col-resize;
            background: transparent;
            transition: background var(--cmd-duration-fast);
        }

        .resize-handle:hover {
            background: var(--cmd-accent-blue);
        }

        .resize-handle.dragging {
            background: var(--cmd-accent-blue);
            box-shadow: var(--cmd-glow-accent);
        }

        /* Scrollbar styling */
        .panel-content::-webkit-scrollbar {
            width: 8px;
        }

        .panel-content::-webkit-scrollbar-track {
            background: transparent;
        }

        .panel-content::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.2);
            border-radius: 4px;
        }

        .panel-content::-webkit-scrollbar-thumb:hover {
            background: rgba(255, 255, 255, 0.3);
        }
    `;

    constructor() {
        super();
        this.width = 280;
        this.minWidth = 240;
        this.maxWidth = 400;
        this.resizable = true;
        this.collapsed = false;
        this.isDragging = false;
    }

    connectedCallback() {
        super.connectedCallback();
        if (this.resizable) {
            this.handleMouseMove = this.handleMouseMove.bind(this);
            this.handleMouseUp = this.handleMouseUp.bind(this);
        }
    }

    handleResizeStart(e) {
        if (!this.resizable) return;

        e.preventDefault();
        this.isDragging = true;
        this.startX = e.clientX;
        this.startWidth = this.width;

        const handle = this.shadowRoot.querySelector('.resize-handle');
        handle.classList.add('dragging');

        document.addEventListener('mousemove', this.handleMouseMove);
        document.addEventListener('mouseup', this.handleMouseUp);
    }

    handleMouseMove(e) {
        if (!this.isDragging) return;

        const delta = e.clientX - this.startX;
        const newWidth = Math.max(
            this.minWidth,
            Math.min(this.maxWidth, this.startWidth + delta)
        );

        this.width = newWidth;
        this.style.width = `${newWidth}px`;
    }

    handleMouseUp() {
        this.isDragging = false;
        const handle = this.shadowRoot.querySelector('.resize-handle');
        handle?.classList.remove('dragging');

        document.removeEventListener('mousemove', this.handleMouseMove);
        document.removeEventListener('mouseup', this.handleMouseUp);

        // Save width preference
        localStorage.setItem(`panel-width-${this.title}`, this.width);
    }

    toggleCollapse() {
        this.collapsed = !this.collapsed;
    }

    render() {
        return html`
            <div class="panel-header">
                <div class="panel-title">
                    ${this.collapsed ? this.title.substring(0, 2) : this.title}
                </div>
                <div class="panel-actions">
                    <button
                        class="panel-action-btn"
                        @click="${this.toggleCollapse}"
                        title="${this.collapsed ? 'Expand' : 'Collapse'}">
                        ${this.collapsed ? '▶' : '◀'}
                    </button>
                </div>
            </div>

            <div class="panel-content">
                <slot></slot>
            </div>

            ${this.resizable && !this.collapsed ? html`
                <div
                    class="resize-handle"
                    @mousedown="${this.handleResizeStart}">
                </div>
            ` : ''}
        `;
    }
}

customElements.define('command-panel', CommandPanel);
```

### ConversationTabs

```javascript
class ConversationTabs extends LitElement {
    static properties = {
        tabs: { type: Array },
        activeTabId: { type: String },
        maxTabs: { type: Number }
    };

    static styles = css`
        :host {
            display: block;
            background: var(--cmd-bg-tertiary);
            border-bottom: 1px solid var(--cmd-border-medium);
        }

        .tabs-container {
            display: flex;
            align-items: center;
            overflow-x: auto;
            scrollbar-width: none;
            gap: var(--cmd-space-1);
            padding: var(--cmd-space-2);
        }

        .tabs-container::-webkit-scrollbar {
            display: none;
        }

        .tab {
            display: flex;
            align-items: center;
            gap: var(--cmd-space-2);
            padding: var(--cmd-space-2) var(--cmd-space-4);
            background: transparent;
            border: 1px solid transparent;
            border-radius: 6px;
            cursor: pointer;
            transition: all var(--cmd-duration-fast) var(--cmd-ease-sharp);
            white-space: nowrap;
            min-width: 120px;
            max-width: 200px;
        }

        .tab:hover {
            background: rgba(255, 255, 255, 0.05);
            border-color: var(--cmd-border-subtle);
        }

        .tab.active {
            background: var(--cmd-bg-primary);
            border-color: var(--cmd-accent-blue);
            box-shadow: 0 0 0 1px var(--cmd-accent-blue),
                        var(--cmd-glow-accent);
        }

        .tab-icon {
            font-size: 16px;
            flex-shrink: 0;
        }

        .tab-label {
            flex: 1;
            font-size: var(--cmd-text-sm);
            color: var(--cmd-text-secondary);
            overflow: hidden;
            text-overflow: ellipsis;
            font-family: var(--cmd-font-primary);
        }

        .tab.active .tab-label {
            color: var(--cmd-text-primary);
            font-weight: var(--cmd-weight-medium);
        }

        .tab-badge {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            min-width: 18px;
            height: 18px;
            padding: 0 4px;
            background: var(--cmd-accent-blue);
            color: white;
            font-size: 10px;
            font-weight: var(--cmd-weight-bold);
            border-radius: 9px;
            box-shadow: 0 0 8px rgba(14, 165, 233, 0.5);
        }

        .tab-close {
            display: none;
            width: 16px;
            height: 16px;
            align-items: center;
            justify-content: center;
            background: transparent;
            border: none;
            border-radius: 3px;
            color: var(--cmd-text-tertiary);
            cursor: pointer;
            font-size: 12px;
            transition: all var(--cmd-duration-fast);
        }

        .tab:hover .tab-close {
            display: flex;
        }

        .tab-close:hover {
            background: rgba(239, 68, 68, 0.2);
            color: var(--cmd-accent-red);
        }

        .tab-add {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 32px;
            height: 32px;
            margin-left: var(--cmd-space-2);
            background: transparent;
            border: 1px dashed var(--cmd-border-medium);
            border-radius: 6px;
            color: var(--cmd-text-secondary);
            cursor: pointer;
            transition: all var(--cmd-duration-fast);
            flex-shrink: 0;
        }

        .tab-add:hover {
            background: rgba(14, 165, 233, 0.1);
            border-color: var(--cmd-accent-blue);
            color: var(--cmd-accent-blue);
        }

        /* Drag & drop */
        .tab.dragging {
            opacity: 0.5;
        }

        .tab.drag-over {
            border-left: 2px solid var(--cmd-accent-blue);
        }
    `;

    constructor() {
        super();
        this.tabs = [];
        this.activeTabId = null;
        this.maxTabs = 8;
    }

    handleTabClick(tabId) {
        this.activeTabId = tabId;
        this.dispatchEvent(new CustomEvent('tab-change', {
            detail: { tabId },
            bubbles: true,
            composed: true
        }));
    }

    handleTabClose(tabId, event) {
        event.stopPropagation();

        this.dispatchEvent(new CustomEvent('tab-close', {
            detail: { tabId },
            bubbles: true,
            composed: true
        }));
    }

    handleTabAdd() {
        if (this.tabs.length >= this.maxTabs) {
            alert(`Maximum ${this.maxTabs} tabs`);
            return;
        }

        this.dispatchEvent(new CustomEvent('tab-add', {
            bubbles: true,
            composed: true
        }));
    }

    render() {
        return html`
            <div class="tabs-container">
                ${this.tabs.map(tab => html`
                    <div
                        class="tab ${this.activeTabId === tab.id ? 'active' : ''}"
                        @click="${() => this.handleTabClick(tab.id)}"
                        draggable="true">
                        <span class="tab-icon">${tab.icon}</span>
                        <span class="tab-label">${tab.label}</span>
                        ${tab.badge > 0 ? html`
                            <span class="tab-badge">${tab.badge}</span>
                        ` : ''}
                        <button
                            class="tab-close"
                            @click="${(e) => this.handleTabClose(tab.id, e)}"
                            title="Close tab">
                            ✕
                        </button>
                    </div>
                `)}

                <button
                    class="tab-add"
                    @click="${this.handleTabAdd}"
                    title="New conversation">
                    +
                </button>
            </div>
        `;
    }
}

customElements.define('conversation-tabs', ConversationTabs);
```

### ContextCard (Info widgets dans panel droit)

```javascript
class ContextCard extends LitElement {
    static properties = {
        title: { type: String },
        icon: { type: String },
        type: { type: String }, // 'docs' | 'tasks' | 'events' | 'suggestions'
        items: { type: Array },
        collapsible: { type: Boolean },
        collapsed: { type: Boolean, state: true }
    };

    static styles = css`
        :host {
            display: block;
            margin-bottom: var(--cmd-space-4);
        }

        .card {
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid var(--cmd-border-subtle);
            border-radius: 8px;
            overflow: hidden;
            transition: all var(--cmd-duration-fast);
        }

        .card:hover {
            border-color: var(--cmd-border-medium);
            background: rgba(255, 255, 255, 0.05);
        }

        .card-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: var(--cmd-space-3);
            background: rgba(255, 255, 255, 0.02);
            cursor: pointer;
            user-select: none;
        }

        .card-header-left {
            display: flex;
            align-items: center;
            gap: var(--cmd-space-2);
        }

        .card-icon {
            font-size: 16px;
        }

        .card-title {
            font-size: var(--cmd-text-sm);
            font-weight: var(--cmd-weight-semibold);
            color: var(--cmd-text-primary);
            font-family: var(--cmd-font-primary);
        }

        .card-count {
            font-size: var(--cmd-text-xs);
            color: var(--cmd-text-tertiary);
            font-family: var(--cmd-font-primary);
        }

        .card-toggle {
            color: var(--cmd-text-tertiary);
            transition: transform var(--cmd-duration-fast);
        }

        .card-toggle.collapsed {
            transform: rotate(-90deg);
        }

        .card-content {
            padding: var(--cmd-space-3);
            max-height: 300px;
            overflow-y: auto;
        }

        :host([collapsed]) .card-content {
            display: none;
        }

        .card-item {
            display: flex;
            align-items: center;
            gap: var(--cmd-space-2);
            padding: var(--cmd-space-2);
            margin-bottom: var(--cmd-space-1);
            background: transparent;
            border: 1px solid transparent;
            border-radius: 4px;
            cursor: pointer;
            transition: all var(--cmd-duration-fast);
            font-size: var(--cmd-text-sm);
            font-family: var(--cmd-font-primary);
            color: var(--cmd-text-secondary);
        }

        .card-item:hover {
            background: rgba(255, 255, 255, 0.05);
            border-color: var(--cmd-border-subtle);
            color: var(--cmd-text-primary);
        }

        .item-icon {
            flex-shrink: 0;
            opacity: 0.7;
        }

        .item-text {
            flex: 1;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        .item-action {
            opacity: 0;
            transition: opacity var(--cmd-duration-fast);
        }

        .card-item:hover .item-action {
            opacity: 1;
        }

        /* Type-specific styling */
        .card.type-docs .card-header {
            border-left: 3px solid var(--cmd-accent-blue);
        }

        .card.type-tasks .card-header {
            border-left: 3px solid var(--cmd-accent-green);
        }

        .card.type-events .card-header {
            border-left: 3px solid var(--cmd-accent-yellow);
        }

        .card.type-suggestions .card-header {
            border-left: 3px solid var(--cmd-accent-purple);
        }
    `;

    constructor() {
        super();
        this.collapsible = true;
        this.collapsed = false;
        this.items = [];
    }

    toggleCollapse() {
        if (!this.collapsible) return;
        this.collapsed = !this.collapsed;
    }

    handleItemClick(item) {
        this.dispatchEvent(new CustomEvent('item-click', {
            detail: item,
            bubbles: true,
            composed: true
        }));
    }

    render() {
        return html`
            <div class="card type-${this.type}">
                <div class="card-header" @click="${this.toggleCollapse}">
                    <div class="card-header-left">
                        <span class="card-icon">${this.icon}</span>
                        <span class="card-title">${this.title}</span>
                        <span class="card-count">(${this.items.length})</span>
                    </div>
                    ${this.collapsible ? html`
                        <span class="card-toggle ${this.collapsed ? 'collapsed' : ''}">
                            ▼
                        </span>
                    ` : ''}
                </div>

                ${!this.collapsed ? html`
                    <div class="card-content">
                        ${this.items.length > 0 ? this.items.map(item => html`
                            <div
                                class="card-item"
                                @click="${() => this.handleItemClick(item)}">
                                <span class="item-icon">${item.icon}</span>
                                <span class="item-text">${item.text}</span>
                                <span class="item-action">→</span>
                            </div>
                        `) : html`
                            <div style="text-align: center; color: var(--cmd-text-tertiary); padding: var(--cmd-space-4);">
                                Aucun élément
                            </div>
                        `}
                    </div>
                ` : ''}
            </div>
        `;
    }
}

customElements.define('context-card', ContextCard);
```

---

## 🚀 Parcours Utilisateur Command

### Scénario 1: Power User Morning Routine

```
7:00 AM - User lance Lucide Command
    ↓
Interface charge en 3-column layout
Left: Mémoire active (conversations épinglées)
Center: Dernière conversation ouverte
Right: Contexte live (calendrier, tasks, docs)
    ↓
User scanne rapidement les 3 panels
Voit "3 suggestions" dans panel droit
    ↓
Clique sur "Préparer meeting 9h30"
    ↓
Nouveau tab s'ouvre: "Meeting 9h30"
Lucide analyse:
• Agenda Google
• Emails liés
• Documents partagés
• Notes de meetings précédents
    ↓
Génère brief structuré:
• Objectifs du meeting
• Points à discuter
• Décisions nécessaires
• Action items précédents
    ↓
User switche entre tabs avec ⌘1, ⌘2
Tab 1: Meeting prep
Tab 2: Ancien debug Python (toujours ouvert)
    ↓
Multi-tasking sans friction
```

### Scénario 2: Research & Knowledge Graph

```
14:00 - User recherche dans mémoire
    ↓
Presse ⌘F (Search in memory)
    ↓
Command Palette ouvre en mode search
Tape: "python api"
    ↓
Fuzzy search retourne:
• 5 conversations mentionnant Python + API
• 3 documents
• 2 code snippets sauvegardés
    ↓
User clique "View in Graph"
    ↓
Graph View s'affiche
Nœuds liés:
- Python Debug (hier)
- API Documentation (3 jours ago)
- REST API Design (semaine dernière)
- Microservices Architecture (2 semaines)
    ↓
Connexions automatiques détectées
User voit pattern: "API design evolution"
    ↓
Clique "Create summary of cluster"
    ↓
Lucide génère résumé chronologique:
"Votre parcours API ces 2 semaines:
1. Architecture microservices
2. Design REST API
3. Documentation
4. Debug & troubleshooting"
    ↓
User exporte en Markdown
```

### Scénario 3: Multi-Conversation Parallel Work

```
16:00 - User doit gérer plusieurs tâches
    ↓
Tab 1: Debug production issue (urgent)
Tab 2: Rédiger email client (important)
Tab 3: Review code PR (peut attendre)
    ↓
Active ⌘M (Multi-task mode)
    ↓
Interface split en 2 colonnes
Left: Tab 1 (Debug)
Right: Tab 2 (Email)
    ↓
User debug à gauche
Pendant que Lucide génère email à droite
    ↓
Trouve solution au bug
Copie fix dans Tab 1
    ↓
Switche focus Tab 2
Email draft ready
Ajoute contexte perso
Envoie
    ↓
Exit split mode
Retour à layout normal
    ↓
Badge [1] apparaît sur Tab 3
Lucide a fini review du code
```

---

## 📊 Avantages Lucide Command

### ✅ Forces

1. **Information Density** - Tout visible en un coup d'œil
2. **Multi-tasking natif** - Tabs + Split screen
3. **Keyboard mastery** - Shortcuts pour tout
4. **Professional UX** - Terminal/IDE-inspired, familier pour devs
5. **Knowledge graph** - Visualisation des connexions mémoire
6. **Resizable panels** - Personnalisation totale layout
7. **Context always visible** - Panel droit = awareness permanente
8. **Power user paradise** - Conçu pour productivité max

### ⚠️ Challenges

1. **Complexité initiale** - Beaucoup de features à découvrir
2. **Information overload** - Peut être intimidant
3. **Requires large screen** - Mobile difficile
4. **Learning curve** - Shortcuts à apprendre
5. **CPU/Memory intensive** - Multiple panels + glassmorphisme
6. **Not beginner-friendly** - Optimisé pour experts

---

## 🎬 Prochaines étapes si choisi

1. **Prototyper layout 3-column** responsive
2. **Implémenter système de tabs** avec state management
3. **Créer panel resizing** logic
4. **Développer keyboard shortcuts** system complet
5. **Intégrer knowledge graph** visualization (D3.js/Vis.js)
6. **Optimiser performance** pour multi-panel rendering
7. **Tests avec power users** (devs, analysts, researchers)

---

## 💡 Citations Design

> "The details are not the details. They make the design"
> — Charles Eames

> "Everything should be made as simple as possible, but not simpler"
> — Albert Einstein

> "Good design is obvious. Great design is transparent"
> — Joe Sparano

---

**Lucide Command** = Le cockpit de votre intelligence. Toutes les informations, tous les contrôles, instantanément accessibles. Pour ceux qui veulent TOUT contrôler.

⚡ **Command, mais élégant.**
