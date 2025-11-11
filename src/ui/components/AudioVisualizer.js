import { html, css, LitElement } from '../assets/lit-core-2.7.4.min.js';

/**
 * AudioVisualizer - Composant de visualisation audio fréquentielle
 * Affiche 32 barres représentant les fréquences audio en temps réel
 * Sobre et professionnel, sans emojis, avec animations lumineuses subtiles
 */
export class AudioVisualizer extends LitElement {
    static properties = {
        active: { type: Boolean }, // Actif/Inactif
        frequencies: { type: Array, state: true }, // Tableau des fréquences normalisées [0-1]
        barCount: { type: Number }, // Nombre de barres (défaut: 32)
    };

    static styles = css`
        :host {
            display: flex;
            align-items: flex-end;
            justify-content: space-between;
            gap: 1px;
            height: 24px;
            width: 100%;
            padding: 0 8px;
            box-sizing: border-box;
            position: relative;
        }

        :host([hidden]) {
            display: none;
        }

        .visualizer-container {
            display: flex;
            align-items: flex-end;
            justify-content: space-between;
            gap: 1px;
            width: 100%;
            height: 100%;
        }

        .bar {
            flex: 1;
            min-width: 2px;
            max-width: 4px;
            background: var(--state-info);
            border-radius: 2px 2px 0 0;
            transition: height var(--timing-instant) var(--easing-standard);
            opacity: 0.8;
            position: relative;
        }

        /* État idle - barres minimes */
        :host(:not([active])) .bar {
            opacity: 0.2;
            height: 2px !important;
            background: var(--text-tertiary);
        }

        /* Glow subtil sur les barres actives */
        :host([active]) .bar {
            box-shadow: 0 0 4px var(--state-info-glow);
        }

        /* Animation de pulsation sur les barres hautes */
        @keyframes bar-glow {
            0%, 100% {
                box-shadow: 0 0 4px var(--state-info-glow);
            }
            50% {
                box-shadow: 0 0 8px var(--state-info-glow);
            }
        }

        .bar.high {
            animation: bar-glow 1s ease-in-out infinite;
        }

        /* Responsive - réduire le nombre de barres sur mobile */
        @media (max-width: 640px) {
            :host {
                padding: 0 4px;
            }

            .bar:nth-child(2n) {
                display: none;
            }
        }

        /* Reduced motion - pas d'animations */
        @media (prefers-reduced-motion: reduce) {
            .bar {
                transition: none;
                animation: none !important;
            }
        }

        /* Glass bypass - désactiver tous les effets */
        :host-context(body.has-glass) {
            display: none;
        }
    `;

    constructor() {
        super();
        this.active = false;
        this.frequencies = new Array(32).fill(0);
        this.barCount = 32;
        this.analyserNode = null;
        this.audioContext = null;
        this.animationFrameId = null;
        this.frequencyData = null;
    }

    /**
     * Initialise l'analyseur audio avec un MediaStream
     * @param {MediaStream} stream - Stream audio du microphone
     * @param {AudioContext} audioContext - Contexte audio existant
     */
    initializeAnalyser(stream, audioContext) {
        if (!stream || !audioContext) {
            console.warn('[AudioVisualizer] Invalid stream or audioContext');
            return;
        }

        try {
            this.audioContext = audioContext;

            // Créer l'AnalyserNode
            this.analyserNode = audioContext.createAnalyser();
            this.analyserNode.fftSize = 128; // 64 bins de fréquences (128/2)
            this.analyserNode.smoothingTimeConstant = 0.7; // Lissage subtil

            // Connecter le stream au analyser
            const source = audioContext.createMediaStreamSource(stream);
            source.connect(this.analyserNode);

            // Créer le buffer pour les données de fréquence
            const bufferLength = this.analyserNode.frequencyBinCount;
            this.frequencyData = new Uint8Array(bufferLength);

            console.log('[AudioVisualizer] Analyser initialized:', {
                fftSize: this.analyserNode.fftSize,
                bufferLength,
                sampleRate: audioContext.sampleRate
            });

            // Démarrer l'analyse en boucle
            this.startAnalysis();
        } catch (error) {
            console.error('[AudioVisualizer] Failed to initialize analyser:', error);
        }
    }

    /**
     * Démarre l'analyse en boucle des fréquences
     */
    startAnalysis() {
        if (!this.analyserNode || !this.frequencyData) {
            return;
        }

        const analyze = () => {
            if (!this.active) {
                // Reset frequencies when inactive
                this.frequencies = new Array(this.barCount).fill(0);
                this.requestUpdate();
                this.animationFrameId = requestAnimationFrame(analyze);
                return;
            }

            // Récupérer les données de fréquence (0-255)
            this.analyserNode.getByteFrequencyData(this.frequencyData);

            // Regrouper les fréquences en 32 barres
            const newFrequencies = this.groupFrequencies(this.frequencyData);

            // Mettre à jour seulement si changement significatif
            if (this.hasSignificantChange(newFrequencies)) {
                this.frequencies = newFrequencies;
                this.requestUpdate();
            }

            this.animationFrameId = requestAnimationFrame(analyze);
        };

        analyze();
    }

    /**
     * Groupe les fréquences en N barres (32 par défaut)
     * @param {Uint8Array} data - Données de fréquence brutes (0-255)
     * @returns {Array<number>} - Tableau normalisé [0-1] de longueur barCount
     */
    groupFrequencies(data) {
        const grouped = [];
        const binSize = Math.floor(data.length / this.barCount);

        for (let i = 0; i < this.barCount; i++) {
            let sum = 0;
            const start = i * binSize;
            const end = start + binSize;

            for (let j = start; j < end && j < data.length; j++) {
                sum += data[j];
            }

            const average = sum / binSize;
            // Normaliser 0-255 → 0-1, avec boost pour meilleure visibilité
            const normalized = Math.min(1, (average / 255) * 2.5);
            grouped.push(normalized);
        }

        return grouped;
    }

    /**
     * Vérifie si le changement de fréquences est significatif
     * @param {Array<number>} newFreq - Nouvelles fréquences
     * @returns {boolean}
     */
    hasSignificantChange(newFreq) {
        if (!this.frequencies || this.frequencies.length !== newFreq.length) {
            return true;
        }

        const threshold = 0.02; // 2% de changement minimum
        for (let i = 0; i < newFreq.length; i++) {
            if (Math.abs(newFreq[i] - this.frequencies[i]) > threshold) {
                return true;
            }
        }

        return false;
    }

    /**
     * Arrête l'analyse
     */
    stopAnalysis() {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }

        // Reset
        this.frequencies = new Array(this.barCount).fill(0);
        this.requestUpdate();
    }

    /**
     * Cleanup lors de la déconnexion
     */
    disconnectedCallback() {
        super.disconnectedCallback();
        this.stopAnalysis();

        if (this.analyserNode) {
            this.analyserNode.disconnect();
            this.analyserNode = null;
        }

        this.audioContext = null;
        this.frequencyData = null;
    }

    /**
     * Render
     */
    render() {
        return html`
            <div class="visualizer-container">
                ${this.frequencies.map((freq, index) => {
                    const height = Math.max(2, freq * 100); // Min 2%, max 100%
                    const isHigh = freq > 0.7; // Barres hautes > 70%

                    return html`
                        <div
                            class="bar ${isHigh ? 'high' : ''}"
                            style="height: ${height}%">
                        </div>
                    `;
                })}
            </div>
        `;
    }
}

customElements.define('audio-visualizer', AudioVisualizer);
