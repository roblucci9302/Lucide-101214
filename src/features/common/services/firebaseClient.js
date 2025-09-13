const { initializeApp } = require('firebase/app');
const { initializeAuth } = require('firebase/auth');
const Store = require('electron-store');
const { getFirestore, setLogLevel, initializeFirestore, connectFirestoreEmulator } = require('firebase/firestore');
const { getAnalytics } = require('firebase/analytics');

// setLogLevel('debug');

/**
 * Firebase Auth expects the `persistence` option passed to `initializeAuth()` to be *classes*,
 * not instances. It then calls `new PersistenceClass()` internally.  
 *
 * The helper below returns such a class, pre-configured with an `electron-store` instance that
 * will be shared across all constructed objects. This mirrors the pattern used by Firebase's own
 * `browserLocalPersistence` implementation as well as community solutions for NodeJS.
 */
function createElectronStorePersistence(storeName = 'firebase-auth-session') {
    // Create a single `electron-store` behind the scenes – all Persistence instances will use it.
    const sharedStore = new Store({ name: storeName });

    return class ElectronStorePersistence {
        constructor() {
            this.store = sharedStore;
            this.type = 'LOCAL';
        }

        /**
         * Firebase calls this to check whether the persistence is usable in the current context.
         */
        _isAvailable() {
            return Promise.resolve(true);
        }

        async _set(key, value) {
            this.store.set(key, value);
        }

        async _get(key) {
            return this.store.get(key) ?? null;
        }

        async _remove(key) {
            this.store.delete(key);
        }

        /**
         * These are used by Firebase to react to external storage events (e.g. multi-tab).
         * Electron apps are single-renderer per process, so we can safely provide no-op
         * implementations.
         */
        _addListener(_key, _listener) {
            // no-op
        }

        _removeListener(_key, _listener) {
            // no-op
        }
    };
}

const firebaseConfig = {
    apiKey: "AIzaSyAwHfSOD7s2-z5TCMyx-_VzwYT-a0m9hKo",
    authDomain: "lucide-dream.firebaseapp.com",
    projectId: "lucide-dream",
    storageBucket: "lucide-dream.firebasestorage.app",
    messagingSenderId: "789779677981",
    appId: "1:789779677981:web:5161ec061a3569289817f4",
    measurementId: "G-06S57JVR7T"
};

let firebaseApp = null;
let firebaseAuth = null;
let firestoreInstance = null; // To hold the specific DB instance
let analyticsInstance = null; // To hold the analytics instance

function initializeFirebase() {
    if (firebaseApp) {
        console.log('[FirebaseClient] Firebase already initialized.');
        return;
    }
    try {
        firebaseApp = initializeApp(firebaseConfig);
        
        // Build a *class* persistence provider and hand it to Firebase.
        const ElectronStorePersistence = createElectronStorePersistence('firebase-auth-session');

        firebaseAuth = initializeAuth(firebaseApp, {
            // `initializeAuth` accepts a single class or an array – we pass an array for future
            // extensibility and to match Firebase examples.
            persistence: [ElectronStorePersistence],
        });

        // Initialize Firestore with the specific database ID
        // Initialisation de Firestore
        firestoreInstance = initializeFirestore(firebaseApp, {
            experimentalForceLongPolling: true,
            ignoreUndefinedProperties: true
        });

        // Initialize Analytics if possible
        try {
            analyticsInstance = getAnalytics(firebaseApp);
            console.log('[FirebaseClient] Analytics initialized successfully.');
        } catch (error) {
            console.log('[FirebaseClient] Analytics not available in this environment:', error.message);
        }

        console.log('[FirebaseClient] Firebase initialized successfully with class-based electron-store persistence.');
        console.log('[FirebaseClient] Firestore instance is targeting the "lucide-dream" database.');
    } catch (error) {
        console.error('[FirebaseClient] Firebase initialization failed:', error);
    }
}

function getFirebaseAuth() {
    if (!firebaseAuth) {
        throw new Error("Firebase Auth has not been initialized. Call initializeFirebase() first.");
    }
    return firebaseAuth;
}

function getFirestoreInstance() {
    if (!firestoreInstance) {
        throw new Error("Firestore has not been initialized. Call initializeFirebase() first.");
    }
    return firestoreInstance;
}

function getAnalyticsInstance() {
    return analyticsInstance;
}

module.exports = {
    initializeFirebase,
    getFirebaseAuth,
    getFirestoreInstance,
    getAnalyticsInstance,
}; 