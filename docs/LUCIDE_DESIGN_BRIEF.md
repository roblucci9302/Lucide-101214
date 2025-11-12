# Lucide - Brief Design Complet pour IA Design

## 📋 RÉSUMÉ EXÉCUTIF

**Lucide** est un assistant IA de bureau avec mémoire augmentée, conçu pour accompagner les professionnels dans leur travail quotidien. C'est une application Electron (Windows/macOS/Linux) qui combine écoute audio en temps réel, analyse contextuelle, et assistants IA spécialisés par métier.

**Philosophie de design** : "Silence intelligent, présence subtile"
- Interface minimaliste qui disparaît quand non nécessaire
- Glassmorphism (transparence + blur)
- Élégante, discrète, mais puissante quand sollicitée

---

## 🎯 OBJECTIFS DE LUCIDE

### Objectif Principal
Créer un assistant IA qui :
1. **Écoute** les conversations (réunions, appels) et les transcrit
2. **Analyse** le contexte et génère des insights automatiquement
3. **Mémorise** toutes les informations dans un graphe de connaissances
4. **Assiste** l'utilisateur avec des agents spécialisés par métier
5. **Répond** aux questions en contexte avec sa mémoire augmentée

### Objectifs Secondaires
- Être **non-intrusif** : l'utilisateur ne doit pas sentir de friction
- **Productivité maximale** : raccourcis clavier, actions rapides
- **Multi-contexte** : gérer plusieurs conversations/projets simultanément
- **Personnalisation** : s'adapter au métier de l'utilisateur

---

## 👥 UTILISATEURS CIBLES

### Profils Utilisateurs (6 personas)

1. **RH (Ressources Humaines)** 👥
   - Besoin : Aide au recrutement, analyse de CVs, génération de questions d'entretien
   - Usage : Écoute d'entretiens, extraction de compétences, recommandations

2. **Exec (Direction/Management)** 💼
   - Besoin : Synthèses de réunions, suivi de décisions, aide à la stratégie
   - Usage : Prise de notes automatique, extraction d'actions, reporting

3. **Dev (Développeurs)** 💻
   - Besoin : Aide au code, debug, documentation, architecture
   - Usage : Code review, suggestions, recherche de bugs, stack overflow intelligent

4. **Marketing** 📢
   - Besoin : Génération de contenu, analyse de tendances, campagnes
   - Usage : Brainstorming, création de copies, analyse de marché

5. **Support Client** 🎧
   - Besoin : Réponses rapides, historique client, solutions
   - Usage : Recherche dans base de connaissances, suggestions de réponses

6. **Général** ✨
   - Besoin : Assistant polyvalent pour toutes tâches
   - Usage : Questions générales, aide quotidienne

### Niveaux d'Expertise
- **Novices** (40%) : Veulent simplicité et guidance
- **Intermédiaires** (40%) : Veulent efficacité et personnalisation
- **Experts** (20%) : Veulent shortcuts, automation, customisation avancée

---

## 🎨 DESIGN ACTUEL (Phase 1 + Phase 2)

### Design System

**Palette de Couleurs** :
```
PRIMARY (Lucide Purple)
- 400: rgba(167, 139, 250, 1)  #a78bfa
- 500: rgba(139, 92, 246, 1)   #8b5cf6  [PRINCIPAL]
- 600: rgba(124, 58, 237, 1)   #7c3aed

SECONDARY (User Blue)
- 400: rgba(129, 140, 248, 1)  #818cf8
- 500: rgba(99, 102, 241, 1)   #6366f1
- 600: rgba(79, 70, 229, 1)    #4f46e5

SUCCESS (Green)
- 500: rgba(16, 185, 129, 1)   #10b981

ERROR (Red)
- 500: rgba(239, 68, 68, 1)    #ef4444

WARNING (Amber)
- 500: rgba(251, 191, 36, 1)   #fbbf24

INFO (Blue)
- 500: rgba(59, 130, 246, 1)   #3b82f6

BACKGROUND (Dark Mode - défaut)
- Primary: rgba(20, 20, 30, 1)     #14141e
- Secondary: rgba(30, 30, 45, 1)   #1e1e2d
- Tertiary: rgba(40, 40, 55, 1)    #282837

TEXT
- Primary: rgba(255, 255, 255, 0.95)
- Secondary: rgba(255, 255, 255, 0.7)
- Tertiary: rgba(255, 255, 255, 0.5)
- Disabled: rgba(255, 255, 255, 0.3)

GLASS (Glassmorphism)
- Background: rgba(255, 255, 255, 0.08)
- Border: rgba(255, 255, 255, 0.15)
- Backdrop filter: blur(20px)
```

**Typography** :
```
Font Family: 'Helvetica Neue', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif
Monospace: 'Monaco', 'Menlo', 'Consolas', monospace

Sizes:
- Display: 32px / 48px (titles)
- H1: 24px / 32px
- H2: 20px / 28px
- H3: 18px / 24px
- Body: 14px / 21px
- Small: 12px / 18px
- Tiny: 11px / 16px
- Caption: 10px / 14px

Weights:
- Light: 300
- Regular: 400
- Medium: 500
- Semibold: 600
- Bold: 700
```

**Spacing Scale** :
```
xs:  4px
sm:  8px
md:  12px
lg:  16px
xl:  20px
2xl: 24px
3xl: 32px
4xl: 40px
5xl: 48px
```

**Border Radius** :
```
sm:   6px  (buttons, inputs)
md:   8px  (cards small)
lg:   12px (cards medium)
xl:   16px (panels)
2xl:  20px (modals)
pill: 9000px (rounded full)
```

**Shadows** :
```
sm: 0 2px 8px rgba(0, 0, 0, 0.3)
md: 0 4px 16px rgba(0, 0, 0, 0.4)
lg: 0 8px 32px rgba(0, 0, 0, 0.5)
xl: 0 20px 60px rgba(0, 0, 0, 0.6)
```

**Animations** :
```
Timing:
- Fast: 150ms
- Normal: 200ms
- Slow: 300ms
- Slower: 400ms

Easings:
- Standard: cubic-bezier(0.34, 1.56, 0.64, 1)
- Ease-out: ease-out
- Ease-in-out: ease-in-out

Keyframes:
- fadeIn: opacity 0→1 + translateY(10px→0)
- slideIn: translateX(20px→0) + opacity 0→1
- bubbleIn: translateY(10px→0) + scale(0.95→1)
- pulse: opacity 1→0.7→1 + scale(1→1.05→1)
```

---

## 🏗️ ARCHITECTURE DE L'APPLICATION

### Structure de l'Interface

```
┌─────────────────────────────────────────────────────────────┐
│                      Main Header                             │
│  [Listen] [Question] [Show/Hide] [Theme] [Settings]         │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    ZEN LAYOUT                                │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              ÉTAT IDLE (Repos)                       │   │
│  │                                                      │   │
│  │              ┌─────────────────┐                    │   │
│  │              │       ✨        │                    │   │
│  │              │  Bonjour, je    │                    │   │
│  │              │  suis Lucide    │                    │   │
│  │              │                 │                    │   │
│  │              │  ⌘ Space pour   │                    │   │
│  │              │   commencer     │                    │   │
│  │              └─────────────────┘                    │   │
│  │                                                      │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
│  OU                                                          │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │          ÉTAT ACTIVE (Conversation)                  │   │
│  │                                                      │   │
│  │  ┌──────────────────────────────────────────────┐  │   │
│  │  │  [Tab 1] [Tab 2] [Tab 3] ... [+]            │  │   │
│  │  └──────────────────────────────────────────────┘  │   │
│  │                                                      │   │
│  │  ┌──────────────────────────────────────────────┐  │   │
│  │  │  Lucide [●] En écoute   [💭 Mémoire] [→ Ctx]│  │   │
│  │  └──────────────────────────────────────────────┘  │   │
│  │                                                      │   │
│  │  ┌────────────────────────┬────────────────────┐   │   │
│  │  │                        │                    │   │   │
│  │  │  CONVERSATION          │   CONTEXT/MEMORY   │   │   │
│  │  │                        │                    │   │   │
│  │  │  👤 User bubble        │  📌 Pinned Items   │   │   │
│  │  │  ✨ Lucide bubble      │  🧠 Concepts       │   │   │
│  │  │  👤 User bubble        │  🔗 Connections    │   │   │
│  │  │  ✨ Lucide bubble      │  💭 Memories       │   │   │
│  │  │                        │                    │   │   │
│  │  └────────────────────────┴────────────────────┘   │   │
│  │                                                      │   │
│  │  ┌──────────────────────────────────────────────┐  │   │
│  │  │  [📎] [🎙️] [...input...] [➤]               │  │   │
│  │  └──────────────────────────────────────────────┘  │   │
│  │                                                      │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
└─────────────────────────────────────────────────────────────┘

OVERLAY (Command Palette - ⌘K)
┌─────────────────────────────────────────────────────────────┐
│                    [Backdrop blur]                           │
│                                                              │
│           ┌─────────────────────────────┐                   │
│           │ 🔍 Rechercher...        ⌘K │                   │
│           ├─────────────────────────────┤                   │
│           │ NAVIGATION                  │                   │
│           │ 💬 Nouvelle conversation ⌘N │ ← selected        │
│           │ 🔍 Rechercher            ⌘F │                   │
│           │ 📜 Historique            ⌘H │                   │
│           │ ⚙️  Paramètres           ⌘, │                   │
│           ├─────────────────────────────┤                   │
│           │ PROFILS                     │                   │
│           │ 👥 Mode RH               ⌘1 │                   │
│           │ 💼 Mode Exec             ⌘2 │                   │
│           │ ...                         │                   │
│           └─────────────────────────────┘                   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## ⚙️ FONCTIONNALITÉS DÉTAILLÉES

### 1. **Main Header** (Barre supérieure)

**Éléments** :
- **[Écouter]** : Bouton principal pour démarrer/arrêter l'écoute audio
  - États : "Écouter" (repos) → "Stop" (actif) → "Terminé" (fini)
  - Couleur : Transparent → Rouge pulsant → Vert
  - Icon : Barres audio ││| → Carré ■

- **[Question]** : Ouvrir le mode question/réponse
  - Shortcut : ⌘ + touche
  - Ouvre une vue pour poser une question écrite

- **[Afficher/Masquer]** : Toggle visibilité de toutes les fenêtres
  - Shortcut : ⌘ \ D
  - Masque/affiche toutes les fenêtres Lucide

- **[Theme Toggle]** : Bouton icône soleil/lune
  - Toggle dark/light mode
  - Shortcut : ⌘⇧T

- **[Settings]** : Bouton trois points verticaux
  - Hover → ouvre fenêtre paramètres
  - Contient : profils, langue, API keys, raccourcis

**Contraintes** :
- Min-width: 520px (CRITIQUE - sinon boutons invisibles)
- Height: 47px
- Glassmorphism avec border gradient
- Draggable (peut être déplacé sur l'écran)

---

### 2. **ZenLayout - Container Principal**

#### État IDLE (Repos)
**Quand** : Aucune conversation active, interface au repos

**Affichage** :
- Écran centré verticalement et horizontalement
- Icône Lucide ✨ (48px, pulsante)
- Titre : "Bonjour, je suis Lucide" (24px, weight 300)
- Subtitle : "Appuyez sur ⌘ Space pour commencer" (13px)
- Background : Transparent ou très subtle

**Animations** :
- Icône : pulse-glow (3s infinite) - opacity 1→0.7→1 + scale 1→1.05→1
- Apparition : fadeIn 0.3s

**Interactions** :
- ⌘Space → passe en état ACTIVE
- Click anywhere → passe en état ACTIVE (optionnel)

---

#### État ACTIVE (Conversation)

**Quand** : Utilisateur a commencé une conversation

**Composants** :

##### A. **Tabs Bar** (Multi-conversations)
- Barre horizontale en haut
- Tabs avec :
  - Icône (emoji du type de conversation)
  - Titre (tronqué si trop long)
  - Subtitle optionnel (grisé, petit)
  - Badge de notifications (coin supérieur droit)
  - Status indicator (point coloré : vert=actif, jaune=processing, rouge=erreur)
  - Bouton × pour fermer (sauf premier tab)
- Bouton [+] à droite pour nouveau tab
- Drag & drop pour réorganiser
- Shortcut ⌘1-9 pour switch
- Max 10 tabs

**Design** :
```
┌────────────────────────────────────────────────────────┐
│ [✨ Conv 1] [💬 Conv 2 (●3)] [📄 Conv 3] ... [+]     │
│   ─────────  (inactive)      (inactive)               │
└────────────────────────────────────────────────────────┘
```

##### B. **Header Bar** (Sous les tabs)
- Gauche :
  - Logo "Lucide" (text 14px)
  - Status indicator si actif (point + texte : "En écoute...", "Prêt", etc.)

- Droite :
  - Bouton [💭 Mémoire] → toggle Memory Panel
  - Bouton [→ Contexte] → toggle Context Panel

**Design** :
```
┌────────────────────────────────────────────────────────┐
│ Lucide [●] En écoute...         [💭 Mémoire] [→ Ctx] │
└────────────────────────────────────────────────────────┘
```

##### C. **Main Content Area** (Conversation + Panels)

**Layout** : 2 colonnes flexibles

**Colonne Gauche** : Conversation (flex: 1)
- Wrapper scrollable avec messages
- Messages sous forme de bubbles :

  **User Bubble** :
  - Aligné à droite
  - Background : Gradient violet (rgba(99, 102, 241, 0.8) → rgba(139, 92, 246, 0.8))
  - Border-radius : 16px avec coin bottom-right coupé (4px)
  - Padding : 12px 16px
  - Shadow : 0 2px 8px rgba(99, 102, 241, 0.3)
  - Avatar : 👤 dans cercle violet
  - Metadata : "Vous • Il y a 5 min" en petit sous la bulle

  **Lucide Bubble** :
  - Aligné à gauche
  - Background : Glassmorphism rgba(255, 255, 255, 0.1)
  - Border : 1px solid rgba(255, 255, 255, 0.15)
  - Border-radius : 16px avec coin bottom-left coupé (4px)
  - Backdrop-filter : blur(10px)
  - Padding : 12px 16px
  - Avatar : ✨ (ou icône du profil actif) dans cercle purple gradient
  - Metadata : "Lucide • Il y a 2 min"
  - Actions au hover : [📋 Copier] [🔄 Reformuler]

  **Special Bubbles** :
  - **Insight** : Background vert rgba(16, 185, 129, 0.2) + border emerald
  - **Error** : Background rouge rgba(239, 68, 68, 0.2) + border red
  - **Code Block** : Background noir rgba(0, 0, 0, 0.5) avec syntax highlighting

**Animations** :
- Chaque message : bubbleIn avec staggered delay (50ms entre chaque)
- Scroll auto vers le bas quand nouveau message

**Empty State** (si aucun message) :
```
        💬
    Commencez une conversation
    avec Lucide.

    Posez une question ou lancez
    l'écoute.

    ⌘K pour les actions rapides
```

**Colonne Droite** : Context Panel OU Memory Panel (width: 280px)

Deux panels mutuellement exclusifs :

##### D. **Context Panel** (par défaut)

**Sections collapsibles** :

1. **Profil Actif**
   - Card avec :
     - Avatar (icône grande 40px + background gradient)
     - Nom du profil (ex: "Expert RH")
     - Rôle (ex: "Ressources Humaines")
     - Bouton [🔄 Changer de profil]

2. **Documents** (nombre)
   - Liste de documents actifs
   - Chaque item :
     - Icône 📄
     - Nom du document (tronqué)
     - Type + taille ("PDF • 2.3 MB")
     - Click → ouvre le document

3. **Insights** (nombre)
   - Cards avec fond vert subtil
   - Titre de l'insight
   - Texte court
   - Icon 💡

4. **Statistiques**
   - Grid 2×2 :
     - Messages (nombre)
     - Sessions (nombre)
     - Documents (nombre)
     - Insights (nombre)

5. **Historique**
   - Liste des conversations récentes
   - Chaque item :
     - Timestamp ("Il y a 2h")
     - Titre de la conversation
     - Click → réouvre

**Empty states** : Icône + "Aucun {type}"

##### E. **Memory Panel** (alternatif)

**Sections** :

1. **Recherche**
   - Input de recherche sticky en haut
   - Placeholder : "Rechercher dans la mémoire..."

2. **Graphe de Connaissances**
   - Canvas placeholder (200px height)
   - Boutons overlay : [⟲ Reset] [⊕ Expand]
   - Future : D3.js graph visualization

3. **Concepts** (nombre)
   - Chips cliquables
   - Format : [icon] Label (count)
   - Example : [⚛️] React Hooks (5)
   - Click → sélectionne le concept

4. **Épinglés** (nombre)
   - Items épinglés importants
   - Card format :
     - Icon 📌 en coin
     - Icon principal
     - Titre
     - Description
     - Bouton × au hover pour unpin

5. **Connexions** (nombre)
   - Liste de connexions
   - Format : Concept A → Concept B (type)

6. **Mémoires Récentes**
   - Liste chronologique
   - Timestamp + texte court

##### F. **Input Area** (Zone de saisie)

**Layout** :
- Textarea auto-resize (min 44px, max 200px)
- 3 boutons d'action :

1. **[📎] Attach** (gauche)
   - Joindre un fichier
   - Click → ouvre file picker
   - Shortcut : ⌘U

2. **[🎙️] Listen** (centre)
   - Toggle écoute audio
   - États :
     - Idle : 🎙️ gris
     - Active : 🎙️ rouge pulsant + animation
     - Recording : ⏹️ carré rouge
   - Shortcut : ⌘L

3. **[➤] Send** (droite)
   - Envoyer le message
   - Background : Gradient violet (primary)
   - Disabled si input vide
   - Processing : spinner à la place de la flèche
   - Shortcut : Enter (Shift+Enter = nouvelle ligne)

**Hints en bas** :
- Gauche : "Enter Envoyer • Shift+Enter Nouvelle ligne"
- Droite : "0 / 4000 caractères"

---

### 3. **Command Palette** (⌘K)

**Overlay global** qui apparaît par-dessus tout

**Design** :
- Backdrop : rgba(0, 0, 0, 0.6) + blur(4px)
- Container :
  - Centré horizontal
  - Top : 15% de l'écran
  - Width : 90% max 600px
  - Background : rgba(20, 20, 30, 0.95) + blur(40px)
  - Border : 1px solid rgba(255, 255, 255, 0.2)
  - Border-radius : 16px
  - Shadow : 0 20px 60px rgba(0, 0, 0, 0.5)

**Structure** :

```
┌─────────────────────────────────────────┐
│ 🔍 Rechercher une commande...      ⌘K  │
├─────────────────────────────────────────┤
│ NAVIGATION                              │
│ 💬 Nouvelle conversation           ⌘N  │ ← selected
│ 🔍 Rechercher                      ⌘F  │
│ 📜 Historique                      ⌘H  │
│ ⚙️  Paramètres                     ⌘,  │
├─────────────────────────────────────────┤
│ PROFILS                                 │
│ 👥 Basculer en mode RH             ⌘1  │
│ 💼 Basculer en mode Exec           ⌘2  │
│ ...                                     │
├─────────────────────────────────────────┤
│ ↑↓ Naviguer   ↵ Exécuter   Esc Fermer  │
│                        15 commandes     │
└─────────────────────────────────────────┘
```

**Comportement** :
- Ouvrir : ⌘K
- Fermer : Escape ou click backdrop
- Recherche : fuzzy search en temps réel
- Navigation : ↑/↓ pour sélectionner
- Exécution : Enter
- Item sélectionné : Background violet + border

**Catégories** :
1. Navigation (💬 🔍 📜 ⚙️)
2. Profils (👥 💼 💻 📢 🎧 ✨)
3. Actions (🎙️ 📎 🗑️)
4. Vue (📊 🌓 🔍)

**Historique** :
- Affiche les 5 dernières commandes utilisées en premier
- Storage : localStorage

---

### 4. **Thème Dark/Light**

**Dark Mode** (défaut) :
```
Background:
- Primary: #14141e
- Secondary: #1e1e2d

Text:
- Primary: rgba(255, 255, 255, 0.95)
- Secondary: rgba(255, 255, 255, 0.7)

Glass:
- BG: rgba(255, 255, 255, 0.08)
- Border: rgba(255, 255, 255, 0.15)
```

**Light Mode** :
```
Background:
- Primary: #fafaff
- Secondary: #f0f0f8

Text:
- Primary: rgba(20, 20, 30, 0.95)
- Secondary: rgba(20, 20, 30, 0.7)

Glass:
- BG: rgba(255, 255, 255, 0.6)
- Border: rgba(20, 20, 30, 0.12)
```

**Toggle** :
- Button dans Main Header (icône ☀️/🌙)
- Shortcut : ⌘⇧T
- Mode "Auto" : suit le système (prefers-color-scheme)

**Transition** :
- All CSS variables changent instantanément
- Smooth transitions sur les éléments individuels (200ms)

---

## 🎬 USER FLOWS PRINCIPAUX

### Flow 1 : Première utilisation

```
1. Utilisateur ouvre Lucide
   └→ Main Header apparaît (slideDown animation)
   └→ ZenLayout en état IDLE
   └→ Message : "Bonjour, je suis Lucide" + hint "⌘ Space"

2. Utilisateur appuie sur ⌘Space OU click
   └→ Transition IDLE → ACTIVE (400ms)
   └→ Tabs bar apparaît avec 1 tab
   └→ Header bar apparaît
   └→ Input area apparaît
   └→ Empty state dans conversation : "Commencez une conversation..."

3. Utilisateur tape un message "Bonjour"
   └→ Bouton Send devient actif (gradient violet)

4. Utilisateur appuie sur Enter
   └→ Message user apparaît (bubble violet, slideIn)
   └→ État passe à PROCESSING
   └→ Bubble Lucide apparaît avec "..." (typing indicator)
   └→ Réponse de Lucide s'affiche progressivement
   └→ État revient à ACTIVE

5. Utilisateur peut :
   - Continuer la conversation
   - Ouvrir Command Palette (⌘K)
   - Changer de profil (⌘1-6)
   - Activer l'écoute (⌘L)
```

### Flow 2 : Utilisation de l'écoute audio

```
1. Utilisateur en état ACTIVE
   └→ Click sur bouton [🎙️ Listen] OU ⌘L

2. Système demande permission micro (si première fois)
   └→ Utilisateur accepte

3. Écoute démarre :
   └→ Bouton passe en rouge pulsant
   └→ Status indicator : "En écoute..."
   └→ Main Header montre animation audio bars
   └→ Timer commence : "00:00"

4. Lucide transcrit en temps réel :
   └→ Texte apparaît dans conversation
   └→ Format : bubble Lucide avec texte transcrit

5. Lucide génère insights :
   └→ Insights apparaissent dans Context Panel
   └→ Badge de notification sur Context Panel

6. Utilisateur arrête (click ⏹️ OU ⌘L) :
   └→ Bouton revient à l'état normal
   └→ Status : "Prêt"
   └→ Résumé final apparaît
   └→ Option "Utile / Pas utile / Reformuler"
```

### Flow 3 : Utilisation Command Palette

```
1. Utilisateur appuie sur ⌘K
   └→ Backdrop apparaît (fade 200ms)
   └→ Palette apparaît (scale 0.95→1 + opacity)
   └→ Focus automatique sur input

2. Palette affiche :
   └→ Commandes récentes en premier
   └→ Toutes les autres par catégorie

3. Utilisateur tape "nouv"
   └→ Filtrage instantané
   └→ "Nouvelle conversation" sélectionné automatiquement

4. Utilisateur appuie sur Enter
   └→ Palette ferme (200ms)
   └→ Action exécutée (nouvelle tab créée)
   └→ Commande ajoutée à l'historique
```

### Flow 4 : Multi-tabs

```
1. Utilisateur a une conversation active (Tab 1)
   └→ Click sur bouton [+] OU ⌘N

2. Nouveau tab créé :
   └→ Tab 2 apparaît avec animation slideIn
   └→ Tab 2 devient actif
   └→ Conversation vide dans Tab 2

3. Utilisateur travaille dans Tab 2
   └→ Badge (3) apparaît sur Tab 1 (notifications)

4. Utilisateur veut revenir à Tab 1 :
   - Option A : Click sur Tab 1
   - Option B : ⌘1

5. Tabs peuvent être réorganisés :
   └→ Drag Tab 2
   └→ Drop avant Tab 1
   └→ Ordre sauvegardé

6. Fermer Tab 2 :
   - Option A : Click sur ×
   - Option B : ⌘W (quand Tab 2 actif)
   └→ Tab disparaît (fadeOut)
   └→ Tab 1 devient actif
```

---

## 📱 RESPONSIVE & ADAPTATIONS

### Desktop (> 1024px)
- Layout 2 colonnes (conversation + panel)
- Tous les boutons visibles
- Shortcuts clavier fonctionnels
- Drag & drop actif

### Tablet (768px - 1024px)
- Panel devient overlay (position absolute)
- Toggle pour afficher/masquer panel
- Shortcuts clavier désactivés partiellement
- Tabs condensés

### Mobile (< 768px)
- Panel fullscreen en overlay
- Tabs en mode carousel horizontal
- Input simplifié (moins de hints)
- Touch gestures pour navigation
- Shortcuts désactivés

---

## 🎯 CONTRAINTES TECHNIQUES

### Technologie
- **Framework** : Lit Web Components (LitElement)
- **Platform** : Electron (desktop app)
- **Styling** : CSS-in-JS (css tagged template literals)
- **State** : Reactive properties
- **Storage** : localStorage pour préférences

### Performance
- **Render** : < 16ms (60fps)
- **Animations** : GPU-accelerated (transform, opacity)
- **Bundle** : < 500kb gzipped
- **Memory** : < 200MB RAM

### Browser Support
- Chrome/Edge : Full support
- Electron : v28+
- No IE/Legacy browsers

### Accessibilité
- Keyboard navigation complète
- ARIA labels sur interactive elements
- Focus indicators visibles
- Screen reader support (future)
- High contrast mode (future)

---

## 🎨 DESIGN PRINCIPLES

### 1. Glassmorphism
Tous les éléments utilisent glassmorphism :
```css
background: rgba(255, 255, 255, 0.08);
backdrop-filter: blur(20px);
border: 1px solid rgba(255, 255, 255, 0.15);
```

### 2. Minimalism
- Pas de clutter visuel
- Espaces généreux (spacing system)
- Typographie claire et lisible
- Couleurs utilisées avec parcimonie

### 3. Feedback Visuel
- Hover states sur tout ce qui est cliquable
- Loading states explicites
- Success/Error states clairs
- Animations smooth (pas de jump)

### 4. Cohérence
- Mêmes border-radius partout (system)
- Mêmes spacing (system)
- Mêmes couleurs (palette stricte)
- Mêmes animations (timing/easing)

### 5. Progressive Disclosure
- Features avancées cachées par défaut
- Command Palette pour power users
- Shortcuts non-intrusifs
- Empty states instructifs

---

## 📐 ASSETS NÉCESSAIRES

### Icons
- Tous emoji Unicode (pas d'icon font)
- SVG pour certains (copy, settings, arrows)
- Pas de custom illustrations (minimalisme)

### Images
- Pas d'images décoratives
- Avatars = emoji ou initiales

### Animations
- CSS keyframes uniquement
- Pas de GIF/videos
- Lottie possible pour futurs loaders

---

## 🔄 ÉTATS DE L'APPLICATION

### ZenLayout States
1. **IDLE** : Repos, interface minimale
2. **ACTIVE** : Conversation en cours
3. **LISTENING** : Écoute audio active
4. **PROCESSING** : Traitement en cours
5. **ERROR** : Erreur survenue

### Button States
1. **Default** : État repos
2. **Hover** : Souris dessus
3. **Active** : Click enfoncé
4. **Disabled** : Non-cliquable
5. **Loading** : Action en cours

### Tab States
1. **Active** : Tab sélectionné
2. **Inactive** : Autres tabs
3. **Has notifications** : Badge visible
4. **Processing** : Status jaune
5. **Error** : Status rouge

---

## 🎬 ANIMATIONS CLÉS

### Page Transitions
```
IDLE → ACTIVE :
- Idle fadeOut + translateY(-10px) 300ms
- Active fadeIn + translateY(0) 400ms delay 100ms

ACTIVE → IDLE :
- Active fadeOut 300ms
- Idle fadeIn 300ms delay 100ms
```

### Element Animations
```
Message Bubble :
- bubbleIn: translateY(10px→0) + scale(0.95→1) 300ms
- Stagger delay: 50ms entre chaque

Command Palette :
- Open: backdrop fade + container scale(0.95→1) 200ms
- Close: backdrop fade + container scale(1→0.95) 200ms

Tab Add :
- slideIn: translateX(20px→0) + opacity(0→1) 200ms

Button Click :
- scale(1→0.95) 100ms ease-out
```

### Micro-interactions
```
Input Focus :
- border-color transition 200ms
- box-shadow fade 200ms

Hover Button :
- background-color 150ms
- transform: translateY(-1px) 150ms

Loading Spinner :
- rotate 360deg 0.8s linear infinite
```

---

## 📊 MÉTRIQUES DE SUCCÈS

### UX Metrics
- **Time to first action** : < 3 seconds
- **Commands discovery** : > 50% users use ⌘K in first week
- **Tab usage** : > 30% users use multiple tabs
- **Theme preference** : 50/50 dark/light

### Technical Metrics
- **Load time** : < 2 seconds
- **FPS** : Constant 60fps
- **Memory** : < 200MB
- **CPU** : < 5% idle

---

## 🎯 CAS D'USAGE TYPIQUES

### Cas 1 : Développeur en debug session
```
1. Ouvre Lucide
2. ⌘3 pour mode Dev
3. Tape : "Explique moi cette erreur: [paste error]"
4. Lucide analyse et suggère solutions
5. Dev copie la solution
6. ⌘N pour nouvelle session
7. Tape : "Comment optimiser cette fonction ?"
```

### Cas 2 : RH en entretien
```
1. Ouvre Lucide
2. ⌘1 pour mode RH
3. Click [🎙️] pour démarrer écoute
4. Entretien se déroule (30 min)
5. Lucide transcrit + génère insights
6. RH arrête écoute
7. Consulte insights dans Context Panel
8. Click "Générer questions de suivi"
```

### Cas 3 : Manager en réunion stratégique
```
1. Ouvre Lucide
2. ⌘2 pour mode Exec
3. ⌘L pour écoute
4. Réunion 1h avec équipe
5. Lucide note décisions + actions
6. Manager arrête
7. Click "Générer compte-rendu"
8. Partage le CR par email
```

---

## 🚀 ÉVOLUTIONS FUTURES (Phase 3+)

### Vision Long-terme
1. **Knowledge Graph 3D** : Visualisation interactive des concepts
2. **Voice Commands** : "Hey Lucide, résume cette conversation"
3. **Collaboration** : Share conversations, real-time collab
4. **Mobile App** : iOS/Android companion
5. **Web Version** : Access from anywhere
6. **Plugins** : Extensibility system
7. **AI Models Choice** : GPT-4, Claude, Gemini, local models
8. **Advanced Analytics** : Productivity dashboard
9. **Integration** : Slack, Teams, Gmail, Calendar
10. **Multi-language** : FR, EN, ES, DE support

---

## 📋 CHECKLIST POUR L'IA DESIGN

Quand vous créez les designs, assurez-vous de :

✅ **Respect du Design System**
- [ ] Couleurs de la palette uniquement
- [ ] Spacing system respecté
- [ ] Border-radius system respecté
- [ ] Typography system respecté

✅ **Glassmorphism**
- [ ] Background blur sur tous les panels
- [ ] Transparence cohérente
- [ ] Borders subtils

✅ **States**
- [ ] Tous les états de boutons (default, hover, active, disabled, loading)
- [ ] États de l'application (idle, active, listening, processing, error)
- [ ] États des tabs (active, inactive, notifications, processing, error)

✅ **Responsive**
- [ ] Desktop layout (> 1024px)
- [ ] Tablet layout (768-1024px)
- [ ] Mobile layout (< 768px)

✅ **Accessibility**
- [ ] Contraste suffisant (WCAG AA minimum)
- [ ] Focus indicators visibles
- [ ] Touch targets ≥ 44px sur mobile

✅ **Animations**
- [ ] Timings cohérents
- [ ] Easings appropriés
- [ ] Pas de jump/flash

✅ **Dark & Light Mode**
- [ ] Designs pour les deux thèmes
- [ ] Variables CSS utilisées

---

## 📦 LIVRABLES ATTENDUS

### Fichiers Figma/Sketch
1. **Main Header** (tous états)
2. **ZenLayout - IDLE** (état repos)
3. **ZenLayout - ACTIVE** (conversation)
4. **Tabs Bar** (tous états de tabs)
5. **Message Bubbles** (user, lucide, insight, error, code)
6. **Context Panel** (toutes sections)
7. **Memory Panel** (toutes sections)
8. **Input Area** (tous états)
9. **Command Palette** (recherche + résultats)
10. **Thème Dark** (vue complète)
11. **Thème Light** (vue complète)
12. **Mobile** (adaptation responsive)

### Specifications
- Export des assets (SVG, PNG @2x)
- CSS variables pour couleurs
- Spacing measurements
- Typography specs
- Animation specs (timing, easing, keyframes)

### Prototypes
- Prototype interactif des flows principaux
- Animations clés
- Micro-interactions

---

## 💡 CONSEILS POUR L'IA DESIGN

1. **Inspirez-vous de** :
   - Raycast (command palette)
   - Arc Browser (tabs)
   - Linear (glassmorphism)
   - Notion (bubbles de conversation)
   - Slack (multi-conversations)

2. **Évitez** :
   - Trop de couleurs
   - Éléments trop petits (< 24px touch targets)
   - Animations trop rapides (< 100ms) ou trop lentes (> 500ms)
   - Glassmorphism sur glassmorphism (layering excessif)
   - Texte avec contraste insuffisant

3. **Focalisez sur** :
   - Clarté et lisibilité
   - Espaces généreux
   - Hiérarchie visuelle claire
   - Feedback visuel immédiat
   - Cohérence absolue

---

**Fin du Brief Design Lucide**

Version: 2.0
Date: 2025-11-12
Auteur: Claude (Sonnet 4.5)
Pour: Design avec IA spécialisée

Ce document contient TOUT ce qu'une IA design a besoin pour créer l'interface de Lucide ! 🎨✨
