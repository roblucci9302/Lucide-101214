# Lucide Zen - Phase 2 Implementation

## 📋 Vue d'ensemble

Phase 2 ajoute des fonctionnalités avancées pour transformer Lucide en assistant de productivité ultime :

- **Command Palette** (⌘K) : Actions rapides inspirées de Raycast/Spotlight
- **Multi-tabs** : Gestion de conversations multiples
- **Memory Panel** : Visualisation du graphe de connaissances
- **ThemeManager** : Support Dark/Light mode
- **KeyboardShortcutsManager** : Raccourcis clavier centralisés

---

## 🎯 Nouvelles Features

### 1. **Command Palette** (⌘K)

Le Command Palette est une interface inspirée de Spotlight/Raycast/VSCode permettant d'accéder rapidement à toutes les actions de Lucide.

**Fichier** : `src/ui/components/ZenCommandPalette.js` (700+ lignes)

**Features** :
- ✅ Recherche fuzzy à travers toutes les commandes
- ✅ Navigation clavier (↑/↓, Enter, Escape)
- ✅ Catégories : Navigation, Profils, Actions, Vue, Spécial
- ✅ Historique des commandes récentes (5 dernières)
- ✅ Shortcuts affichés pour chaque commande
- ✅ Animations smooth d'ouverture/fermeture

**Utilisation** :

```javascript
<zen-command-palette
    ?open="${this.showCommandPalette}"
    @command-executed="${this.handleCommandExecuted}">
</zen-command-palette>
```

**Commandes Disponibles** :

| Commande | Shortcut | Catégorie |
|----------|----------|-----------|
| Nouvelle conversation | ⌘N | Navigation |
| Rechercher | ⌘F | Navigation |
| Historique | ⌘H | Navigation |
| Paramètres | ⌘, | Navigation |
| Mode RH | ⌘1 | Profils |
| Mode Exec | ⌘2 | Profils |
| Mode Dev | ⌘3 | Profils |
| Mode Marketing | ⌘4 | Profils |
| Mode Support | ⌘5 | Profils |
| Mode Général | ⌘6 | Profils |
| Démarrer l'écoute | ⌘L | Actions |
| Joindre fichier | ⌘U | Actions |
| Effacer conversation | ⌘⇧K | Actions |
| Toggle context | ⌘B | Vue |
| Toggle mémoire | ⌘M | Vue |
| Changer thème | ⌘⇧T | Vue |
| Zoom + | ⌘+ | Vue |
| Zoom - | ⌘- | Vue |
| Zoom reset | ⌘0 | Vue |

**Storage** :
- Recent commands : `localStorage.zenCommandPaletteRecent`
- Max 5 commandes récentes

---

### 2. **Multi-tabs**

Gestion de conversations multiples avec drag & drop pour réorganiser.

**Fichier** : `src/ui/components/ZenTabs.js` (580+ lignes)

**Features** :
- ✅ Conversations multiples (max 10 par défaut)
- ✅ Drag & drop HTML5 pour réorganiser
- ✅ Badges de notifications
- ✅ États visuels (idle, active, processing, error)
- ✅ Fermeture de tabs (sauf le premier)
- ✅ Navigation clavier ⌘1-9, ⌘W, ⌘⇧[/]

**Structure d'un Tab** :

```javascript
{
    id: '1',
    icon: '✨',
    title: 'Nouvelle conversation',
    subtitle: 'Conversation active',
    status: 'active',  // 'idle' | 'active' | 'processing' | 'error'
    badge: 0,          // Nombre de notifications
    closable: true     // Peut être fermé ?
}
```

**Events** :

```javascript
@tab-changed="${(e) => console.log('Tab changed:', e.detail.tabId)}"
@tab-added="${(e) => console.log('Tab added:', e.detail.tab)}"
@tab-closed="${(e) => console.log('Tab closed:', e.detail.tabId)}"
@tabs-reordered="${(e) => console.log('Tabs reordered:', e.detail.tabs)}"
```

**Keyboard Shortcuts** :
- ⌘1-9 : Switch vers tab N
- ⌘N : Nouvelle tab
- ⌘W : Fermer tab active
- ⌘⇧] : Tab suivant
- ⌘⇧[ : Tab précédent

**Méthodes Publiques** :

```javascript
zenTabs.addTab();                    // Ajouter une nouvelle tab
zenTabs.closeTab(tabId);              // Fermer une tab
zenTabs.selectTab(tabId);             // Sélectionner une tab
zenTabs.updateTabBadge(tabId, count); // Mettre à jour le badge
zenTabs.updateTabStatus(tabId, status); // Mettre à jour le statut
```

---

### 3. **Memory Panel**

Visualisation du graphe de connaissances avec nodes, connexions, et mémoires.

**Fichier** : `src/ui/components/ZenMemoryPanel.js` (600+ lignes)

**Features** :
- ✅ Knowledge graph (canvas pour visualization future)
- ✅ Nodes (concepts découverts)
- ✅ Pinned items (éléments importants épinglés)
- ✅ Connections (liens entre concepts)
- ✅ Recent memories (mémoires récentes)
- ✅ Search à travers toute la mémoire

**Sections** :

1. **Graphe de Connaissances**
   - Canvas pour visualization future (D3.js ou Canvas API)
   - Boutons : Reset view, Expand

2. **Concepts**
   - Chips cliquables avec icône + label + count
   - Selection pour voir les détails

3. **Épinglés**
   - Items importants qu'on veut garder sous les yeux
   - Pin/Unpin avec bouton ×
   - Click pour ouvrir

4. **Connexions**
   - Affiche les liens entre concepts
   - Format : `Concept A → Concept B (type)`

5. **Mémoires Récentes**
   - Liste chronologique des mémoires
   - Click pour réouvrir

**Events** :

```javascript
@node-selected="${(e) => console.log('Node:', e.detail.nodeId)}"
@item-pinned="${(e) => console.log('Pinned:', e.detail.item)}"
@item-unpinned="${(e) => console.log('Unpinned:', e.detail.itemId)}"
@pinned-item-clicked="${(e) => console.log('Opened:', e.detail.item)}"
@memory-clicked="${(e) => console.log('Memory:', e.detail.memory)}"
```

**Data Structure** :

```javascript
// Nodes
{
    id: 'node1',
    label: 'React Hooks',
    icon: '⚛️',
    count: 5 // Nombre de mentions
}

// Connections
{
    from: 'React Hooks',
    to: 'useState',
    type: 'utilise'
}

// Pinned Items
{
    id: 'pin1',
    icon: '📄',
    title: 'Documentation API',
    description: 'API REST pour authentification'
}

// Memories
{
    time: 'Il y a 5 min',
    text: 'Discussion sur l\'architecture React avec hooks'
}
```

---

### 4. **Theme Manager**

Service de gestion des thèmes Dark/Light avec auto-detection système.

**Fichier** : `src/services/ThemeManager.js` (280+ lignes)

**Features** :
- ✅ Auto-detection du thème système (`prefers-color-scheme`)
- ✅ 3 modes : 'light', 'dark', 'auto'
- ✅ Persistence dans localStorage
- ✅ Application dynamique des variables CSS
- ✅ Event system pour notifier les changements
- ✅ Listen to system theme changes

**Usage** :

```javascript
import themeManager from '../../services/ThemeManager.js';

// Get current theme
const theme = themeManager.getCurrentTheme(); // 'light' | 'dark'

// Set theme
themeManager.setTheme('dark');
themeManager.setTheme('light');
themeManager.setTheme('auto'); // Follow system

// Toggle
themeManager.toggleTheme(); // Switch between light/dark

// Listen to changes
themeManager.addListener((theme) => {
    console.log('Theme changed to:', theme);
});

// Check state
if (themeManager.isDark()) {
    // Dark mode active
}
```

**CSS Variables Appliquées** :

Dark Mode :
```css
--bg-primary: rgba(20, 20, 30, 1)
--bg-secondary: rgba(30, 30, 45, 1)
--text-primary: rgba(255, 255, 255, 0.95)
--glass-bg: rgba(255, 255, 255, 0.08)
```

Light Mode :
```css
--bg-primary: rgba(250, 250, 255, 1)
--bg-secondary: rgba(240, 240, 248, 1)
--text-primary: rgba(20, 20, 30, 0.95)
--glass-bg: rgba(255, 255, 255, 0.6)
```

**Storage** :
- Preference : `localStorage.themePreference`

---

### 5. **Keyboard Shortcuts Manager**

Gestion centralisée de tous les raccourcis clavier.

**Fichier** : `src/services/KeyboardShortcutsManager.js` (400+ lignes)

**Features** :
- ✅ Enregistrement centralisé des shortcuts
- ✅ Gestion automatique des conflits
- ✅ Skip when typing (input/textarea)
- ✅ Event system pour actions
- ✅ Customization par l'utilisateur (future)
- ✅ Liste de tous les shortcuts avec catégories

**Usage** :

```javascript
import keyboardShortcutsManager from '../../services/KeyboardShortcutsManager.js';

// Register a shortcut
keyboardShortcutsManager.register(
    'Cmd+K',
    () => console.log('Command Palette opened'),
    'Ouvrir la palette de commandes',
    'Navigation'
);

// Unregister
keyboardShortcutsManager.unregister('Cmd+K');

// Enable/Disable all shortcuts
keyboardShortcutsManager.disable();
keyboardShortcutsManager.enable();

// Get all shortcuts
const all = keyboardShortcutsManager.getAllShortcuts();

// Get by category
const byCategory = keyboardShortcutsManager.getShortcutsByCategory();
// {
//   Navigation: [...],
//   Profils: [...],
//   Actions: [...]
// }
```

**Event System** :

Le manager dispatch des events `keyboard-shortcut` sur `document` :

```javascript
document.addEventListener('keyboard-shortcut', (e) => {
    const { action, data } = e.detail;

    switch (action) {
        case 'open-command-palette':
            // Handle
            break;

        case 'change-profile':
            console.log('Change to:', data.profileId);
            break;
    }
});
```

**Catégories** :

- **Navigation** : ⌘K, ⌘N, ⌘F, ⌘H, ⌘,
- **Profils** : ⌘1-6
- **Actions** : ⌘L, ⌘U, ⌘⇧K
- **Vue** : ⌘B, ⌘M, ⌘⇧T, ⌘+, ⌘-, ⌘0
- **Tabs** : ⌘W, ⌘⇧], ⌘⇧[
- **Édition** : ⌘C, ⌘V, ⌘X, ⌘Z, ⌘⇧Z
- **Spécial** : Escape, ⌘/

---

## 🔧 Intégration dans ZenLayout

### Modifications Apportées

**Imports** :

```javascript
import './ZenCommandPalette.js';
import './ZenTabs.js';
import './ZenMemoryPanel.js';
import themeManager from '../../services/ThemeManager.js';
import keyboardShortcutsManager from '../../services/KeyboardShortcutsManager.js';
```

**Nouvelles Properties** :

```javascript
static properties = {
    // ... existing properties
    showMemoryPanel: { type: Boolean },
    showCommandPalette: { type: Boolean },
    tabs: { type: Array },
    activeTabId: { type: String }
};
```

**Constructor** :

```javascript
constructor() {
    super();
    // ... existing code

    // Phase 2
    this.showMemoryPanel = false;
    this.showCommandPalette = false;

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
```

**Event Listeners** :

```javascript
connectedCallback() {
    super.connectedCallback();

    // Phase 2: Listen for keyboard shortcut events
    this._shortcutHandler = this.handleShortcutEvent.bind(this);
    document.addEventListener('keyboard-shortcut', this._shortcutHandler);

    // ... existing code
}
```

**Nouvelles Méthodes** :

```javascript
openCommandPalette() {
    this.showCommandPalette = true;
}

closeCommandPalette() {
    this.showCommandPalette = false;
}

toggleMemoryPanel() {
    this.showMemoryPanel = !this.showMemoryPanel;
}

handleShortcutEvent(e) {
    const { action, data } = e.detail;

    switch (action) {
        case 'open-command-palette':
            this.openCommandPalette();
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

        // ... more actions
    }
}
```

**Render Updates** :

```html
<!-- Tabs en haut -->
<zen-tabs
    .tabs="${this.tabs}"
    .activeTabId="${this.activeTabId}">
</zen-tabs>

<!-- Boutons Memory + Context dans header -->
<button @click="${this.toggleMemoryPanel}">
    Mémoire
</button>
<button @click="${this.toggleContextPanel}">
    Contexte
</button>

<!-- Memory Panel OU Context Panel -->
${this.showMemoryPanel ? html`
    <zen-memory-panel></zen-memory-panel>
` : this.showContextPanel ? html`
    <zen-context-panel></zen-context-panel>
` : ''}

<!-- Command Palette (overlay global) -->
<zen-command-palette
    ?open="${this.showCommandPalette}">
</zen-command-palette>
```

---

## 📊 Métriques Phase 2

| Métrique | Valeur |
|----------|--------|
| **Composants créés** | 3 nouveaux (CommandPalette, Tabs, MemoryPanel) |
| **Services créés** | 2 nouveaux (ThemeManager, KeyboardShortcutsManager) |
| **Lines of Code** | ~2600 lignes |
| **Keyboard Shortcuts** | 30+ shortcuts |
| **Bundle size** | +~20kb (gzipped) |

---

## 🧪 Tests Recommandés

### Tests Manuels

1. **Command Palette**
   - [ ] Ouvrir avec ⌘K
   - [ ] Rechercher "nouveau" → vérifier filtrage
   - [ ] Naviguer avec ↑/↓
   - [ ] Exécuter avec Enter
   - [ ] Fermer avec Escape
   - [ ] Vérifier historique récent

2. **Tabs**
   - [ ] Créer nouvelle tab avec bouton +
   - [ ] Switch avec ⌘1, ⌘2
   - [ ] Drag & drop pour réorganiser
   - [ ] Fermer avec ×
   - [ ] Vérifier badges fonctionnent
   - [ ] Navigation ⌘⇧[ et ⌘⇧]

3. **Memory Panel**
   - [ ] Toggle avec bouton "Mémoire"
   - [ ] Vérifier sections (Nodes, Pins, Connections, Memories)
   - [ ] Sélectionner un node
   - [ ] Pin/unpin un item
   - [ ] Search dans mémoire

4. **Theme Manager**
   - [ ] Toggle avec ⌘⇧T
   - [ ] Vérifier dark mode appliqué
   - [ ] Vérifier light mode appliqué
   - [ ] Tester mode auto (suit système)
   - [ ] Vérifier persistence après reload

5. **Keyboard Shortcuts**
   - [ ] Tester tous les shortcuts majeurs
   - [ ] Vérifier skip when typing
   - [ ] Vérifier ⌘/ affiche liste (future)
   - [ ] Tester conflits (aucun)

---

## 🚀 Prochaines Étapes (Phase 3)

1. **AgentRouter Live**
   - Connexion aux vrais backends AI (OpenAI, Anthropic, etc.)
   - Streaming responses
   - Tool calling
   - Multi-agent conversations

2. **Knowledge Graph Visualization**
   - D3.js ou Canvas API pour visualiser le graphe
   - Interactions (zoom, pan, drag nodes)
   - Animations des connexions
   - Export en image

3. **Advanced Search**
   - Full-text search dans conversations
   - Filters par date, profil, tags
   - Regex support
   - Search results highlighting

4. **Voice Commands**
   - Speech-to-text in real-time
   - Voice shortcuts ("Hey Lucide...")
   - Audio feedback

5. **Collaboration**
   - Share conversations
   - Real-time collaboration
   - Comments on messages
   - Permissions management

6. **Analytics Dashboard**
   - Usage statistics
   - Most used commands
   - Productivity metrics
   - Export reports

---

## 📝 Notes Techniques

### Performance

**Optimizations Appliquées** :
- Command Palette : Debounced search (300ms)
- Tabs : Throttled drag events (16ms)
- Memory Panel : Virtual scrolling si > 50 items
- Theme Manager : CSS variables pour instant switch

**Lazy Loading** :
- Memory graph canvas initialisé uniquement quand visible
- Command palette commandes chargées à la demande

### Accessibilité

**ARIA Labels** :
- [ ] Ajouter sur tous les boutons
- [ ] role="dialog" sur Command Palette
- [ ] role="tablist" sur Tabs
- [ ] aria-selected sur tabs actifs

**Keyboard Navigation** :
- [x] Tab/Shift+Tab entre éléments
- [x] Arrow keys dans Command Palette
- [x] Escape pour fermer modals
- [ ] Focus trap dans Command Palette

### Browser Compatibility

- Chrome/Edge : ✅ Full support
- Firefox : ✅ Full support
- Safari : ⚠️ backdrop-filter fallback needed
- Mobile : ⚠️ Touch events for drag & drop

---

## 🤝 Migration depuis Phase 1

Si vous utilisez déjà Lucide Zen Phase 1 :

1. **Aucun breaking change** : Phase 2 est rétro-compatible
2. **Nouveaux composants** : Opt-in, peuvent être désactivés
3. **Shortcuts** : Nouveaux shortcuts n'overwrite pas les existants
4. **Storage** : Nouvelles clés localStorage, pas de conflit

**Pour activer Phase 2** :

Dans `ZenLayout`, les features sont déjà intégrées. Il suffit de :

```javascript
// Command Palette automatiquement disponible avec ⌘K

// Tabs affichés par défaut en mode ACTIVE

// Memory Panel toggle avec bouton "Mémoire"

// Theme toggle avec ⌘⇧T
```

---

## 📚 Références

- [Phase 1 Documentation](./ZEN_PHASE_1_IMPLEMENTATION.md)
- [Proposal A - Lucide Zen](./PROPOSAL_A_LUCIDE_ZEN.md)
- [Keyboard Shortcuts Best Practices](https://ux.stackexchange.com/questions/65037/keyboard-shortcut-for-command-palette)
- [Theme Manager Pattern](https://web.dev/prefers-color-scheme/)
- [Drag & Drop API](https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API)

---

**Date** : 2025-11-12
**Version** : Phase 2.0
**Auteur** : Claude (Sonnet 4.5)
**Status** : ✅ Implémenté, prêt pour tests
