# Fix pour lancer Lucide sur macOS

## Problème
Les dépendances esbuild ont été installées pour Linux pendant le développement. Sur macOS, npm refuse d'installer les packages Linux.

## Solution rapide

Exécute ces commandes dans le terminal depuis le dossier du projet :

```bash
# 1. Nettoyer les dépendances Linux
rm -rf node_modules package-lock.json

# 2. Nettoyer le cache npm (optionnel mais recommandé)
npm cache clean --force

# 3. Réinstaller les dépendances pour macOS
npm install

# 4. Installer les binaires esbuild pour macOS
npm install --save-dev @esbuild/darwin-x64 @esbuild/darwin-arm64

# 5. Builder le projet
npm run build:all

# 6. Lancer l'application
npm start
```

## Alternative : Script de setup macOS

Ou simplement :

```bash
npm run clean && npm install && npm run build:all && npm start
```

## Si le problème persiste

1. Vérifier que tu es bien sur macOS :
```bash
uname -a
```

2. Vérifier ta version de Node.js (minimum 16.x recommandé) :
```bash
node --version
npm --version
```

3. Si npm install échoue encore, essayer avec --legacy-peer-deps :
```bash
npm install --legacy-peer-deps
```

## Dépendances esbuild par plateforme

- **macOS Intel** : `@esbuild/darwin-x64`
- **macOS Apple Silicon (M1/M2)** : `@esbuild/darwin-arm64`
- **Linux** : `@esbuild/linux-x64`
- **Windows** : `@esbuild/win32-x64`

Le nouveau design system (phases 1-5) est déjà intégré et prêt à fonctionner une fois les dépendances correctement installées.
