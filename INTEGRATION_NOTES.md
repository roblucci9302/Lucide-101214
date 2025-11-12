# Notes d'intégration du Design System Lucide

Ce document décrit l'état actuel des intégrations et les prochaines étapes.

## Composants créés et intégrés

### Phase 1: Design System (Commit: cf2bac6)
- ✅ **design-tokens.css**: Tokens complets (couleurs, typographie, spacing)
- ✅ **responsive.css**: Système mobile-first avec breakpoints
- ✅ **animations.css**: 6 animations subtiles
- ✅ Intégré dans content.html et header.html

### Phase 2: Smart Bar & Audio Visualizer (Commit: 6c35b8e)
- ✅ **AudioVisualizer.js**: Analyse FFT réelle (32 bars, smoothing 0.7)
- ✅ **MainHeader.js**: 6 états enrichis, badges, animations
- ✅ Intégré dans MainHeader
- ⚠️ **AudioVisualizer pas encore connecté à l'audio réel** (voir section ci-dessous)

### Phase 3: Context Panel (Commit: 769f985)
- ✅ **ContextPanel.js**: Panel contextuel collapsible
- ✅ 4 types: discovery, temporal, suggestion, error
- ✅ Persistence localStorage
- ✅ **Intégré dans ListenView** (Commit: 402d0c3)
  - Affiche le contexte selon le mode (insights/transcript/suggestions)
  - Actions contextuelles (voir analyses, nouvelle session)
- ✅ **Intégré dans AskView** (Commit: 402d0c3)
  - Affiche le contexte selon l'état (loading, streaming, idle)
  - Actions contextuelles (workflows)

### Phase 4: Response Cards (Commit: 827b0d2)
- ✅ **ResponseCard.js**: Cards riches pour réponses IA
- ✅ Menu contextuel, code copy, sources, feedback
- ⚠️ **Pas encore intégré dans les vues**
  - ResponseCard est créé mais attend d'être utilisé pour afficher les réponses markdown de l'IA
  - Peut être intégré dans AskView pour remplacer le rendu markdown actuel

### Phase 5: Theme Toggle (Commit: fde13cf)
- ✅ **ThemeToggle.js**: Toggle dark/light professionnel
- ✅ Intégré dans MainHeader
- ✅ Persistence localStorage, prefers-color-scheme
- ✅ Responsive finalisé

---

## Tâche en suspens: Connecter AudioVisualizer à l'audio réel

### État actuel
AudioVisualizer.js a été créé avec toutes les fonctionnalités nécessaires :
- Analyse FFT avec AnalyserNode
- 32 bars de fréquence (16 sur mobile)
- Smoothing constant 0.7
- Méthode `initializeAnalyser(stream, audioContext)` prête

Actuellement, AudioVisualizer affiche des bars statiques car il n'est pas connecté au stream audio réel.

### Où se trouve l'audio stream
Le stream audio est créé dans `/src/ui/listen/audioCore/listenCapture.js` :
- **Ligne 298**: `const micAudioContext = new AudioContext({ sampleRate: 24000 })`
- **Ligne 300**: `const micSource = micAudioContext.createMediaStreamSource(micStream)`

### Solution recommandée

#### Option 1: Événement custom au démarrage de la session
1. Dans `listenCapture.js`, après la création du `micAudioContext` (ligne 298-301) :
```javascript
// Émettre un événement avec le stream et le context
window.dispatchEvent(new CustomEvent('audio-stream-ready', {
    detail: {
        stream: micStream,
        audioContext: micAudioContext
    }
}));
```

2. Dans `MainHeader.js`, écouter cet événement dans `connectedCallback()` :
```javascript
this._audioStreamReadyListener = (event) => {
    const { stream, audioContext } = event.detail;

    // Récupérer le composant AudioVisualizer
    this.updateComplete.then(() => {
        const visualizer = this.shadowRoot.querySelector('audio-visualizer');
        if (visualizer) {
            visualizer.initializeAnalyser(stream, audioContext);
        }
    });
};
window.addEventListener('audio-stream-ready', this._audioStreamReadyListener);
```

3. Cleanup dans `disconnectedCallback()` :
```javascript
window.removeEventListener('audio-stream-ready', this._audioStreamReadyListener);
```

#### Option 2: Via IPC Electron
1. Exposer le stream via `window.api.listenCapture.getAudioStream()`
2. MainHeader appelle cette API quand `showAudioVisualizer` devient `true`
3. Plus propre mais nécessite des modifications dans le main process

#### Option 3: Module global
Créer un module `audioStreamManager.js` qui :
- Stocke une référence au stream actif
- Expose des méthodes `getActiveStream()` et `setActiveStream()`
- MainHeader récupère le stream quand nécessaire

### Recommandation
**Option 1 (événement custom)** est la plus simple et la moins invasive. Elle nécessite ~10 lignes de code et fonctionne immédiatement.

---

## Tâche en suspens: Intégrer ResponseCard pour les réponses IA

### État actuel
ResponseCard.js est créé mais pas utilisé. AskView utilise actuellement un rendu markdown custom dans `.response-container`.

### Solution recommandée
1. Importer ResponseCard dans AskView :
```javascript
import '../components/ResponseCard.js';
```

2. Remplacer le div `.response-container` par des instances de `<response-card>` :
```javascript
${this.currentResponse ? html`
    <response-card
        .content=${this.currentResponse}
        .sources=${[]}
        .streaming=${this.isStreaming}
        @feedback=${this.handleFeedback}
        @source-click=${this.handleSourceClick}
    ></response-card>
` : ''}
```

3. Gérer les événements émis par ResponseCard :
```javascript
handleFeedback(event) {
    const { type, timestamp } = event.detail;
    console.log('Feedback:', type);
    // Envoyer le feedback au backend
}

handleSourceClick(event) {
    const { source } = event.detail;
    console.log('Source clicked:', source);
    // Ouvrir le document source
}
```

---

## Résumé des commits

| Phase | Commit | Description | Statut |
|-------|--------|-------------|--------|
| 1 | cf2bac6 | Design tokens, responsive, animations | ✅ Intégré |
| 2 | 6c35b8e | Smart Bar, AudioVisualizer | ✅ Intégré (audio non connecté) |
| 3 | 769f985 | ContextPanel créé | ✅ Intégré |
| - | 402d0c3 | ContextPanel dans ListenView & AskView | ✅ Intégré |
| 4 | 827b0d2 | ResponseCard créé | ⏳ À intégrer |
| 5 | fde13cf | ThemeToggle | ✅ Intégré |

---

## Prochaines étapes recommandées

1. **Connecter AudioVisualizer** (15 minutes)
   - Implémenter Option 1 (événement custom)
   - Tester avec une session audio réelle

2. **Intégrer ResponseCard** (30 minutes)
   - Remplacer le rendu markdown actuel dans AskView
   - Implémenter les handlers d'événements
   - Tester avec des réponses IA réelles

3. **Polish final** (optionnel)
   - Ajuster les animations selon les retours utilisateur
   - Affiner les données contextuelles dans ContextPanel
   - Ajouter plus d'actions dans les panels

4. **Documentation utilisateur**
   - Créer un guide pour basculer entre thèmes
   - Documenter les nouveaux panneaux contextuels
   - Expliquer les badges et états du Smart Bar

---

## Notes techniques

### Performance
- Tous les composants utilisent Shadow DOM pour l'encapsulation
- Animations respectent `prefers-reduced-motion`
- AudioVisualizer utilise `requestAnimationFrame` pour l'efficacité
- ContextPanel persiste l'état collapsed pour éviter les re-layouts

### Accessibilité
- Tous les boutons ont des labels ARIA appropriés
- Navigation clavier fonctionnelle sur tous les composants
- Contrastes respectent WCAG AA
- Support de `prefers-color-scheme` et `prefers-contrast`

### Compatibilité
- Testé sur Chrome/Electron (moteur principal)
- Glass bypass mode maintenu pour screen recording
- Responsive sur tous les breakpoints (640px+)

---

Dernière mise à jour: 2025-11-12
Auteur: Claude (session 011CV2psQPDXsZRctJUu5jwT)
