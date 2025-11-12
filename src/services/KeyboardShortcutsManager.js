/**
 * KeyboardShortcutsManager - Gestion centralisée des raccourcis clavier
 *
 * Features:
 * - Enregistrement de shortcuts avec handlers
 * - Gestion des conflits
 * - Customization par l'utilisateur
 * - Liste de tous les shortcuts disponibles
 * - Support des combinaisons complexes (⌘⇧K, etc.)
 */
class KeyboardShortcutsManager {
    constructor() {
        this.shortcuts = new Map();
        this.enabled = true;
        this.listeners = new Set();

        this.init();
    }

    init() {
        // Register global keydown listener
        this._keydownHandler = this.handleKeydown.bind(this);
        window.addEventListener('keydown', this._keydownHandler, true);

        // Load custom shortcuts from localStorage
        this.loadCustomShortcuts();

        // Register default shortcuts
        this.registerDefaultShortcuts();

        console.log('[KeyboardShortcutsManager] Initialized', {
            shortcuts: this.shortcuts.size
        });
    }

    handleKeydown(e) {
        if (!this.enabled) return;

        // Skip if typing in input/textarea
        if (this.isTyping(e.target)) return;

        // Build shortcut key
        const key = this.buildKey(e);

        // Find matching shortcut
        const shortcut = this.shortcuts.get(key);
        if (shortcut && shortcut.handler) {
            e.preventDefault();
            e.stopPropagation();

            try {
                shortcut.handler(e);
                console.log('[KeyboardShortcutsManager] Executed:', key);
            } catch (error) {
                console.error('[KeyboardShortcutsManager] Handler error:', error);
            }
        }
    }

    isTyping(element) {
        const tagName = element.tagName.toLowerCase();
        return (
            tagName === 'input' ||
            tagName === 'textarea' ||
            element.contentEditable === 'true' ||
            element.closest('[contenteditable="true"]')
        );
    }

    buildKey(e) {
        const parts = [];

        if (e.ctrlKey) parts.push('Ctrl');
        if (e.metaKey) parts.push('Cmd');
        if (e.altKey) parts.push('Alt');
        if (e.shiftKey) parts.push('Shift');

        // Add main key
        const key = e.key;
        if (key && key.length === 1) {
            parts.push(key.toUpperCase());
        } else {
            parts.push(key);
        }

        return parts.join('+');
    }

    register(key, handler, description, category = 'General') {
        if (this.shortcuts.has(key)) {
            console.warn('[KeyboardShortcutsManager] Shortcut already registered:', key);
        }

        this.shortcuts.set(key, {
            key,
            handler,
            description,
            category,
            custom: false
        });

        console.log('[KeyboardShortcutsManager] Registered:', key);
    }

    unregister(key) {
        this.shortcuts.delete(key);
        console.log('[KeyboardShortcutsManager] Unregistered:', key);
    }

    enable() {
        this.enabled = true;
    }

    disable() {
        this.enabled = false;
    }

    getAllShortcuts() {
        return Array.from(this.shortcuts.values());
    }

    getShortcutsByCategory() {
        const grouped = {};
        this.shortcuts.forEach(shortcut => {
            if (!grouped[shortcut.category]) {
                grouped[shortcut.category] = [];
            }
            grouped[shortcut.category].push(shortcut);
        });
        return grouped;
    }

    loadCustomShortcuts() {
        try {
            const stored = localStorage.getItem('customShortcuts');
            if (stored) {
                const custom = JSON.parse(stored);
                // Merge with defaults
                // This would need more logic for actual customization
                console.log('[KeyboardShortcutsManager] Loaded custom shortcuts');
            }
        } catch (error) {
            console.error('[KeyboardShortcutsManager] Failed to load custom shortcuts:', error);
        }
    }

    saveCustomShortcuts() {
        try {
            const custom = Array.from(this.shortcuts.values())
                .filter(s => s.custom)
                .map(s => ({ key: s.key, description: s.description, category: s.category }));

            localStorage.setItem('customShortcuts', JSON.stringify(custom));
            console.log('[KeyboardShortcutsManager] Saved custom shortcuts');
        } catch (error) {
            console.error('[KeyboardShortcutsManager] Failed to save custom shortcuts:', error);
        }
    }

    registerDefaultShortcuts() {
        // ────────────────[ NAVIGATION ]─────────────── //

        this.register(
            'Cmd+K',
            () => this.trigger('open-command-palette'),
            'Ouvrir la palette de commandes',
            'Navigation'
        );

        this.register(
            'Cmd+N',
            () => this.trigger('new-conversation'),
            'Nouvelle conversation',
            'Navigation'
        );

        this.register(
            'Cmd+F',
            () => this.trigger('open-search'),
            'Rechercher',
            'Navigation'
        );

        this.register(
            'Cmd+H',
            () => this.trigger('open-history'),
            'Voir l\'historique',
            'Navigation'
        );

        this.register(
            'Cmd+,',
            () => this.trigger('open-settings'),
            'Ouvrir les paramètres',
            'Navigation'
        );

        // ────────────────[ PROFILS ]─────────────── //

        this.register(
            'Cmd+1',
            () => this.trigger('change-profile', { profileId: 'rh' }),
            'Basculer en mode RH',
            'Profils'
        );

        this.register(
            'Cmd+2',
            () => this.trigger('change-profile', { profileId: 'exec' }),
            'Basculer en mode Exec',
            'Profils'
        );

        this.register(
            'Cmd+3',
            () => this.trigger('change-profile', { profileId: 'dev' }),
            'Basculer en mode Dev',
            'Profils'
        );

        this.register(
            'Cmd+4',
            () => this.trigger('change-profile', { profileId: 'marketing' }),
            'Basculer en mode Marketing',
            'Profils'
        );

        this.register(
            'Cmd+5',
            () => this.trigger('change-profile', { profileId: 'support' }),
            'Basculer en mode Support',
            'Profils'
        );

        this.register(
            'Cmd+6',
            () => this.trigger('change-profile', { profileId: 'lucide_assistant' }),
            'Basculer en mode Général',
            'Profils'
        );

        // ────────────────[ ACTIONS ]─────────────── //

        this.register(
            'Cmd+L',
            () => this.trigger('start-listening'),
            'Démarrer l\'écoute',
            'Actions'
        );

        this.register(
            'Cmd+U',
            () => this.trigger('attach-file'),
            'Joindre un fichier',
            'Actions'
        );

        this.register(
            'Cmd+Shift+K',
            () => this.trigger('clear-conversation'),
            'Effacer la conversation',
            'Actions'
        );

        // ────────────────[ VUE ]─────────────── //

        this.register(
            'Cmd+B',
            () => this.trigger('toggle-context'),
            'Toggle panel contextuel',
            'Vue'
        );

        this.register(
            'Cmd+M',
            () => this.trigger('toggle-memory'),
            'Toggle panel mémoire',
            'Vue'
        );

        this.register(
            'Cmd+Shift+T',
            () => this.trigger('toggle-theme'),
            'Changer le thème',
            'Vue'
        );

        this.register(
            'Cmd+=',
            () => this.trigger('zoom-in'),
            'Zoom avant',
            'Vue'
        );

        this.register(
            'Cmd+-',
            () => this.trigger('zoom-out'),
            'Zoom arrière',
            'Vue'
        );

        this.register(
            'Cmd+0',
            () => this.trigger('zoom-reset'),
            'Réinitialiser le zoom',
            'Vue'
        );

        // ────────────────[ TABS ]─────────────── //

        this.register(
            'Cmd+W',
            () => this.trigger('close-tab'),
            'Fermer l\'onglet actif',
            'Tabs'
        );

        this.register(
            'Cmd+Shift+]',
            () => this.trigger('next-tab'),
            'Onglet suivant',
            'Tabs'
        );

        this.register(
            'Cmd+Shift+[',
            () => this.trigger('previous-tab'),
            'Onglet précédent',
            'Tabs'
        );

        // ────────────────[ EDITING ]─────────────── //

        this.register(
            'Cmd+C',
            () => {}, // Let browser handle
            'Copier',
            'Édition'
        );

        this.register(
            'Cmd+V',
            () => {}, // Let browser handle
            'Coller',
            'Édition'
        );

        this.register(
            'Cmd+X',
            () => {}, // Let browser handle
            'Couper',
            'Édition'
        );

        this.register(
            'Cmd+Z',
            () => {}, // Let browser handle
            'Annuler',
            'Édition'
        );

        this.register(
            'Cmd+Shift+Z',
            () => {}, // Let browser handle
            'Refaire',
            'Édition'
        );

        // ────────────────[ SPECIAL ]─────────────── //

        this.register(
            'Escape',
            () => this.trigger('escape'),
            'Fermer les modals/panels',
            'Spécial'
        );

        this.register(
            'Cmd+/',
            () => this.trigger('show-shortcuts'),
            'Afficher tous les raccourcis',
            'Spécial'
        );
    }

    // Event system
    trigger(action, data = {}) {
        const event = new CustomEvent('keyboard-shortcut', {
            detail: { action, data },
            bubbles: true,
            composed: true
        });

        document.dispatchEvent(event);

        console.log('[KeyboardShortcutsManager] Triggered:', action, data);
    }

    addListener(callback) {
        this.listeners.add(callback);
        return () => this.listeners.delete(callback);
    }

    removeListener(callback) {
        this.listeners.delete(callback);
    }

    destroy() {
        window.removeEventListener('keydown', this._keydownHandler, true);
        this.shortcuts.clear();
        this.listeners.clear();
    }
}

// Singleton instance
const keyboardShortcutsManager = new KeyboardShortcutsManager();

// Export
export default keyboardShortcutsManager;
export { KeyboardShortcutsManager };
