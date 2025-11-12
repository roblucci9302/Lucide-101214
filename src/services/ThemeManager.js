/**
 * ThemeManager - Gestion des thèmes Dark/Light
 *
 * Features:
 * - Auto-detection du thème système
 * - Persistence dans localStorage
 * - Application dynamique des variables CSS
 * - Events pour notifier les changements
 * - Support prefers-color-scheme
 */
class ThemeManager {
    constructor() {
        this.currentTheme = null;
        this.themePreference = null; // 'light', 'dark', 'auto'
        this.systemTheme = null;
        this.listeners = new Set();

        // Initialize
        this.init();
    }

    init() {
        // Load saved preference
        this.themePreference = localStorage.getItem('themePreference') || 'auto';

        // Detect system theme
        this.detectSystemTheme();

        // Listen for system theme changes
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        mediaQuery.addEventListener('change', (e) => {
            this.systemTheme = e.matches ? 'dark' : 'light';
            if (this.themePreference === 'auto') {
                this.applyTheme(this.systemTheme);
            }
        });

        // Apply initial theme
        this.applyCurrentTheme();

        console.log('[ThemeManager] Initialized', {
            preference: this.themePreference,
            system: this.systemTheme,
            current: this.currentTheme
        });
    }

    detectSystemTheme() {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        this.systemTheme = prefersDark ? 'dark' : 'light';
    }

    getTheme() {
        if (this.themePreference === 'auto') {
            return this.systemTheme;
        }
        return this.themePreference;
    }

    setTheme(theme) {
        // theme can be 'light', 'dark', or 'auto'
        if (!['light', 'dark', 'auto'].includes(theme)) {
            console.error('[ThemeManager] Invalid theme:', theme);
            return;
        }

        this.themePreference = theme;
        localStorage.setItem('themePreference', theme);

        this.applyCurrentTheme();

        console.log('[ThemeManager] Theme changed to:', theme);
    }

    toggleTheme() {
        const current = this.getTheme();
        const next = current === 'dark' ? 'light' : 'dark';
        this.setTheme(next);
    }

    applyCurrentTheme() {
        const theme = this.getTheme();
        this.applyTheme(theme);
    }

    applyTheme(theme) {
        if (this.currentTheme === theme) return;

        this.currentTheme = theme;

        // Apply theme class to document
        document.documentElement.classList.remove('theme-light', 'theme-dark');
        document.documentElement.classList.add(`theme-${theme}`);

        // Apply CSS variables
        this.applyCSSVariables(theme);

        // Notify listeners
        this.notifyListeners(theme);

        console.log('[ThemeManager] Theme applied:', theme);
    }

    applyCSSVariables(theme) {
        const root = document.documentElement;

        if (theme === 'dark') {
            // Dark theme variables
            root.style.setProperty('--bg-primary', 'rgba(20, 20, 30, 1)');
            root.style.setProperty('--bg-secondary', 'rgba(30, 30, 45, 1)');
            root.style.setProperty('--bg-tertiary', 'rgba(40, 40, 55, 1)');

            root.style.setProperty('--text-primary', 'rgba(255, 255, 255, 0.95)');
            root.style.setProperty('--text-secondary', 'rgba(255, 255, 255, 0.7)');
            root.style.setProperty('--text-tertiary', 'rgba(255, 255, 255, 0.5)');

            root.style.setProperty('--border-primary', 'rgba(255, 255, 255, 0.15)');
            root.style.setProperty('--border-secondary', 'rgba(255, 255, 255, 0.1)');

            root.style.setProperty('--glass-bg', 'rgba(255, 255, 255, 0.08)');
            root.style.setProperty('--glass-border', 'rgba(255, 255, 255, 0.15)');

            root.style.setProperty('--shadow-sm', '0 2px 8px rgba(0, 0, 0, 0.3)');
            root.style.setProperty('--shadow-md', '0 4px 16px rgba(0, 0, 0, 0.4)');
            root.style.setProperty('--shadow-lg', '0 8px 32px rgba(0, 0, 0, 0.5)');

        } else {
            // Light theme variables
            root.style.setProperty('--bg-primary', 'rgba(250, 250, 255, 1)');
            root.style.setProperty('--bg-secondary', 'rgba(240, 240, 248, 1)');
            root.style.setProperty('--bg-tertiary', 'rgba(230, 230, 240, 1)');

            root.style.setProperty('--text-primary', 'rgba(20, 20, 30, 0.95)');
            root.style.setProperty('--text-secondary', 'rgba(20, 20, 30, 0.7)');
            root.style.setProperty('--text-tertiary', 'rgba(20, 20, 30, 0.5)');

            root.style.setProperty('--border-primary', 'rgba(20, 20, 30, 0.15)');
            root.style.setProperty('--border-secondary', 'rgba(20, 20, 30, 0.1)');

            root.style.setProperty('--glass-bg', 'rgba(255, 255, 255, 0.6)');
            root.style.setProperty('--glass-border', 'rgba(20, 20, 30, 0.12)');

            root.style.setProperty('--shadow-sm', '0 2px 8px rgba(20, 20, 30, 0.1)');
            root.style.setProperty('--shadow-md', '0 4px 16px rgba(20, 20, 30, 0.12)');
            root.style.setProperty('--shadow-lg', '0 8px 32px rgba(20, 20, 30, 0.15)');
        }

        // Common variables (theme-agnostic)
        root.style.setProperty('--primary-500', 'rgba(139, 92, 246, 1)');
        root.style.setProperty('--primary-600', 'rgba(124, 58, 237, 1)');
        root.style.setProperty('--primary-400', 'rgba(167, 139, 250, 1)');

        root.style.setProperty('--success-500', 'rgba(16, 185, 129, 1)');
        root.style.setProperty('--error-500', 'rgba(239, 68, 68, 1)');
        root.style.setProperty('--warning-500', 'rgba(251, 191, 36, 1)');
        root.style.setProperty('--info-500', 'rgba(59, 130, 246, 1)');

        root.style.setProperty('--radius-sm', '6px');
        root.style.setProperty('--radius-md', '8px');
        root.style.setProperty('--radius-lg', '12px');
        root.style.setProperty('--radius-xl', '16px');

        root.style.setProperty('--spacing-xs', '4px');
        root.style.setProperty('--spacing-sm', '8px');
        root.style.setProperty('--spacing-md', '12px');
        root.style.setProperty('--spacing-lg', '16px');
        root.style.setProperty('--spacing-xl', '20px');

        root.style.setProperty('--blur-sm', '10px');
        root.style.setProperty('--blur-md', '20px');
        root.style.setProperty('--blur-lg', '40px');
    }

    // Event listeners
    addListener(callback) {
        this.listeners.add(callback);
        return () => this.listeners.delete(callback);
    }

    removeListener(callback) {
        this.listeners.delete(callback);
    }

    notifyListeners(theme) {
        this.listeners.forEach(callback => {
            try {
                callback(theme);
            } catch (error) {
                console.error('[ThemeManager] Listener error:', error);
            }
        });
    }

    // Getters
    getPreference() {
        return this.themePreference;
    }

    getCurrentTheme() {
        return this.currentTheme;
    }

    getSystemTheme() {
        return this.systemTheme;
    }

    isDark() {
        return this.currentTheme === 'dark';
    }

    isLight() {
        return this.currentTheme === 'light';
    }

    isAuto() {
        return this.themePreference === 'auto';
    }
}

// Singleton instance
const themeManager = new ThemeManager();

// Export
export default themeManager;
export { ThemeManager };
