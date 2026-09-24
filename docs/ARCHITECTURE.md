# Architecture du front-end

Ce document explique **comment le code est organisé et pourquoi**. À lire avant
d'écrire le premier composant.

---

## 1. Technologies

| Rôle | Bibliothèque | Version |
|---|---|---|
| Interface | React | 19 |
| Typage | TypeScript | 6.0 |
| Outil de build | Vite | 8 |
| Navigation entre écrans | react-router-dom | 7.18.4 |
| Composants et grille | Bootstrap + react-bootstrap | 5.3.8 / 2.10.10 |
| Thème (surcharge de Bootstrap) | sass | 1.105.0 |
| Temps réel | socket.io-client | 4.8.3 |

Pourquoi `socket.io-client` : le back utilise Flask-SocketIO, qui parle le
protocole Socket.IO. Un `WebSocket` natif du navigateur ne suffit pas.

---

## 2. Organisation des dossiers

```
R5A5_..._FRONT/
├── index.html
├── package.json / package-lock.json   Dépendances, versions figées par le lock
├── vite.config.ts                     Port 5173, options Sass
├── .env.example                       VITE_API_URL
├── public/favicon.svg                 Le logo
├── docs/
└── src/
    ├── main.tsx                       Point d'entrée, importe le thème
    ├── App.tsx                        Racine : fournisseurs + routage
    ├── api/                           Seule couche qui parle au réseau
    │   ├── client.ts                  Le seul fetch du projet
    │   ├── socket.ts                  La seule connexion temps réel
    │   └── sante.ts                   Modèle : un fichier par ressource
    ├── types/api.ts                   Le contrat d'API en TypeScript
    ├── context/                       État global (vide — l'authentification viendra ici)
    ├── hooks/
    │   └── useEtatChaine.ts           Modèle : la logique d'un écran
    ├── components/
    │   ├── layout/MiseEnPage.tsx      En-tête, contenu, pied de page
    │   └── ui/                        Briques génériques (vide)
    ├── pages/
    │   ├── AccueilPage.tsx            Modèle : une page qui s'appuie sur un hook
    │   └── IntrouvablePage.tsx
    ├── routes/Routage.tsx             Déclaration des routes
    ├── styles/
    │   ├── _variables.scss            Palette, typographie, zéro arrondi
    │   ├── _biseau.scss               Classes propres au projet
    │   └── main.scss
    └── assets/logo.svg
```

Les dossiers par domaine (`components/tournoi/`, `components/equipe/`,
`components/chat/`) se créent au moment où la première fonctionnalité de ce
domaine arrive. **La page d'accueil est la seule fonctionnalité du socle** :
elle vérifie la chaîne complète, et sert de modèle à recopier.

| Dossier | Il contient | Il ne contient **jamais** |
|---|---|---|
| `api/` | Fonctions TypeScript qui appellent l'API | De React, d'état, d'affichage |
| `types/` | Les types du contrat | De logique |
| `context/` | Les Providers d'état global | D'affichage |
| `hooks/` | L'orchestration d'un écran : appel, état d'envoi, message d'erreur | De JSX |
| `components/` | Ce qui s'affiche | D'appel réseau direct |
| `pages/` | L'assemblage de composants pour une route, et la navigation | De logique métier |

Le parallèle avec le back, qui aide à s'y retrouver :

| Back | Front | Rôle |
|---|---|---|
| `controllers/` | `pages/`, `components/` | Point d'entrée |
| `services/` | `hooks/` | Logique |
| `repository/` | `api/` | Accès à la donnée qui vit ailleurs |

---

## 3. Règles

**Un seul `fetch`.** Tout appel réseau passe par `api/client.ts`, qui ajoute le
jeton, lit `VITE_API_URL`, traduit les erreurs et gère le 401. Un `fetch` écrit
ailleurs contourne tout ça.

**Une seule connexion WebSocket.** `api/socket.ts` crée l'unique instance
Socket.IO ; les composants s'abonnent à des événements, ils n'ouvrent jamais
leur propre connexion.

**`types/api.ts` est le contrat.** Quand le back change un champ, c'est le seul
fichier à modifier : TypeScript signale ensuite tous les écrans cassés. Il se
modifie **en même temps** que `docs/CONTRAT_API.md`, jamais séparément.

**Un composant n'appelle jamais `api/` directement.** Il passe par un hook, qui
porte l'état de chargement et le message d'erreur. Le composant reste
réutilisable et se contente d'afficher.

**Un formulaire ne décide pas de la navigation.** Il reçoit une fonction
`onSucces` ; c'est la page qui choisit où aller ensuite.

**Aucun droit n'est déduit côté client.** L'état d'authentification ne contient
que l'identité et le statut d'administrateur, lus depuis l'API — jamais décodés
depuis le jeton. L'appartenance aux équipes se demande au serveur à chaque fois
(B-17).

**`RouteProtegee` n'est pas une sécurité.** Cacher un écran évite une erreur de
manipulation, pas une attaque : n'importe qui peut appeler l'API directement. La
vraie protection est dans le back.

**Taille des fichiers.** Un composant qui dépasse une centaine de lignes a
presque toujours deux responsabilités : on le découpe.

---

## 4. Thème visuel

La maquette de référence (noir, blanc, violet, angles vifs et biseautés) a été
prototypée en Tailwind. Le projet utilise **Bootstrap** : on reproduit ce
rendu en surchargeant les variables Sass de Bootstrap, pas en luttant contre
ses classes une par une.

```
styles/
├── _variables.scss      Palette, typographie, suppression des arrondis
├── _biseau.scss         Classes utilitaires propres au projet
└── main.scss            Point d'entrée, importé une fois dans main.tsx
```

**Palette**

| Rôle | Valeur |
|---|---|
| Violet profond | `#4C1D95` |
| Violet principal | `#8B5CF6` |
| Violet clair | `#C084FC` |
| Fond | `#08070C` |
| Panneau | `#0C0A14` |
| Texte | `#F4F4F5` |
| Bordure | `#27272A` |

**Zéro arrondi.** Un seul réglage supprime les coins arrondis de tous les
composants Bootstrap :

```scss
$enable-rounded: false;
$border-radius: 0;  $border-radius-sm: 0;  $border-radius-lg: 0;
$border-radius-xl: 0;  $border-radius-xxl: 0;  $border-radius-pill: 0;
```

Seuls les éléments volontairement circulaires (indicateur de chargement,
interrupteur) gardent leur forme.

**Biseaux.** Les coins coupés en diagonale ne sont pas une notion Bootstrap :
ce sont des classes du projet, dans `_biseau.scss`, à base de `clip-path`.

**Avertissements Sass.** Bootstrap 5.3 utilise encore une syntaxe Sass en cours
d'abandon. Les avertissements sont inoffensifs et masqués dans
`vite.config.ts` :

```ts
css: {
  preprocessorOptions: {
    scss: {
      quietDeps: true,
      silenceDeprecations: ['import', 'global-builtin', 'color-functions', 'if-function'],
    },
  },
},
```

**Aucune couleur en dur dans les composants.** Tout passe par les variables du
thème ou les classes Bootstrap : changer l'identité visuelle se fait dans
`styles/`, pas dans quarante fichiers.

**Accessibilité.** Toute animation est désactivée quand le système demande de
réduire les mouvements (`prefers-reduced-motion`).

---

## 5. Conventions

| Sujet | Règle |
|---|---|
| Composants | `PascalCase.tsx`, un composant exporté par fichier, export nommé |
| Hooks | `useQuelqueChose.ts` |
| Pages | `NomPage.tsx` |
| Langue | Français pour le métier (`equipe`, `rencontre`), comme le contrat |
| Types | Jamais `any` ; `unknown` puis vérification quand le type n'est pas connu |
| Branches, commits, fusion | Mêmes règles que le dépôt back |

---

## 6. Ajouter un écran — liste de contrôle

1. Les routes nécessaires sont-elles dans le **contrat d'API** ?
2. `types/api.ts` : les types de la ressource.
3. `api/` : les fonctions d'appel.
4. `hooks/` : l'orchestration — appel, chargement, erreur.
5. `components/<domaine>/` : les éléments d'affichage.
6. `pages/` : l'assemblage, et la route dans `routes/`.
7. Réservé à un rôle ? L'envelopper dans `RouteProtegee`, **et** vérifier que
   le back refuse bien l'appel.
8. `npm run build` passe sans erreur.
