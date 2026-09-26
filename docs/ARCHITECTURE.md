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
| Police Archivo, servie par le projet | @fontsource-variable/archivo | 5.3.0 |

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
├── docs/
└── src/
    ├── main.tsx                       Point d'entrée : police et thème
    ├── App.tsx                        Racine : FournisseurAuth + routage
    ├── api/                           Seule couche qui parle au réseau
    │   ├── client.ts                  Le seul fetch du projet (cookie inclus)
    │   ├── socket.ts                  La seule connexion temps réel
    │   ├── auth.ts                    Connexion, inscription, moi, déconnexion
    │   ├── tournois.ts
    │   └── sante.ts
    ├── types/api.ts                   Le contrat d'API en TypeScript
    ├── context/
    │   ├── AuthContext.ts             Forme de l'état + objet contexte
    │   ├── FournisseurAuth.tsx        Le composant qui porte l'état
    │   └── useAuth.ts                 Lecture de l'état depuis un composant
    ├── hooks/                         useConnexion, useInscription, useTournois, useEtatChaine,
    │                                  useCarrousel, useCompteurAnime, useMouvementReduit
    ├── components/
    │   ├── ui/                        Marque (et son emblème), IconeFleche, ChampTexte, ChampMotDePasse
    │   ├── layout/                    MiseEnPage, EnTete, ZoneCompte, PiedDePage
    │   ├── auth/                      EcranAuthentification, formulaires
    │   ├── tournoi/                   CarrouselUne, EnteteDiapositive, CalendrierTournois,
    │   │                              FiltresTournois, LigneTournoi, VisuelJeu,
    │   │                              identitesJeux.ts, presentation.ts (libellés, dates, textes)
    │   └── accueil/                   Sections de l'accueil : chiffres, jeux, étapes, appel,
    │                                  statistiques.ts (calculs tirés de la liste des tournois)
    ├── pages/                         Accueil, Connexion, Inscription, Diagnostic, Introuvable
    ├── routes/Routage.tsx             Déclaration des routes
    └── styles/                        Thème « Piste A » (§4)
```

Les dossiers par domaine (`components/equipe/`, `components/chat/`…) se créent
au moment où la première fonctionnalité de ce domaine arrive.

| Route | Page |
|---|---|
| `/` | Une (carrousel), chiffres, jeux, calendrier filtrable (`?statut=…&recherche=…`), étapes, appel |
| `/connexion`, `/inscription` | Plein écran, hors du cadre commun |
| `/diagnostic` | État de la chaîne front → API → base → temps réel |

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

**Un seul `fetch`.** Tout appel réseau passe par `api/client.ts`, qui lit
`VITE_API_URL`, demande au navigateur de joindre le cookie de session
(`credentials: 'include'`), traduit les erreurs et prévient le contexte à
chaque 401. Un `fetch` écrit ailleurs contourne tout ça.

**Le front ne voit jamais le jeton.** Il vit dans un cookie `HttpOnly` que le
JavaScript ne peut pas lire (contrat §2). Au chargement, le front demande à
l'API qui est connecté (`GET /api/auth/moi`) ; pour se déconnecter, il appelle
`POST /api/auth/deconnexion`, seul moyen d'effacer ce cookie. Un 401 sur
`/api/auth/moi` dans la console du navigateur, pour un visiteur, est donc normal.

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
que l'identité et le statut d'administrateur, lus depuis l'API. L'appartenance aux équipes se demande au serveur à chaque fois
(B-17).

**`RouteProtegee` n'est pas une sécurité.** Cacher un écran évite une erreur de
manipulation, pas une attaque : n'importe qui peut appeler l'API directement. La
vraie protection est dans le back.

**Du texte, jamais du HTML.** React échappe tout ce qui est écrit entre
accolades : un pseudo ou un message de chat contenant `<img onerror=…>`
s'affiche tel quel. `dangerouslySetInnerHTML` est interdit sur une donnée venue
d'un utilisateur.

**Taille des fichiers.** Un composant qui dépasse une centaine de lignes a
presque toujours deux responsabilités : on le découpe.

---

## 4. Thème visuel

Direction retenue : **« Piste A v2 »** (toile Design du projet,
`AccueilV2.dc.html`). Noir neutre, **un seul violet d'accent**, angles droits,
titres en capitales condensées. Le projet utilise **Bootstrap** : on reproduit
ce rendu en surchargeant ses variables Sass, pas en luttant contre ses classes.

```
styles/
├── _variables.scss        Palette, police, zéro arrondi, champs, mode sombre
├── _utilitaires.scss      Titres condensés, libellés, bouton principal, pastilles,
│                          apparitions, fond hachuré animé (mixin fond-hachure)
├── _visuels.scss          Visuels de jeu générés en CSS (VisuelJeu)
├── _entete.scss           Marque, navigation soulignée, recherche, avatar
├── _accueil.scss          Une, chiffres, jeux, calendrier, étapes, bandeau d'appel
├── _pied.scss             Pied de page
├── _authentification.scss Écrans de connexion et d'inscription
└── main.scss              Point d'entrée, importé une fois dans main.tsx
```

**Palette**

| Rôle | Valeur |
|---|---|
| Fond | `#0B0B0D` |
| Surface (survol des lignes, champs) | `#141418` |
| Fond du hero | `#17171B` |
| Traits / traits forts | `#222226` / `#2E2E34` |
| Texte / atténué / discret | `#F2F1F5` / `#9C9AA6` / `#6E6C78` |
| Violet d'accent (`$primary`) | `#8B5CF6` |
| Focus / liens / liens survolés | `#A78BFA` / `#C4B5FD` / `#DDD6FE` |

**Police** : Archivo, installée par npm (`@fontsource-variable/archivo`) et non
chargée depuis Google Fonts : aucune requête vers un tiers, et la page
s'affiche aussi hors ligne. Ses deux axes servent : la graisse, et la largeur
(`font-stretch: 70 %`) pour les titres condensés (`.titre-condense`).

**Bouton principal** (`.btn-principal`) : blanc, il passe au violet au survol
et sa flèche avance.

**Visuels de jeu** : tant que les jeux n'ont pas d'image, `VisuelJeu` en
génère un en CSS (dégradé, hachures, nom du jeu en contour). Les couleurs et
les rôles de chaque jeu sont dans `components/tournoi/identitesJeux.ts`.

**Textes et chiffres** : tout ce qui s'affiche vient de l'API. Les
descriptions de la une sont construites à partir de l'état du tournoi
(`descriptionTournoi`), les chiffres à partir de la liste (`statistiques.ts`).
Le bandeau « match en cours » de la maquette attend l'API des rencontres.

**Animations** : `transform` et `opacity` uniquement, entre 150 et 300 ms pour
les survols. Hachures qui défilent et lueur qui dérive sur les fonds `hero`,
titres révélés ligne par ligne, lignes du calendrier dont le fond glisse,
carrousel qui avance toutes les 6 secondes, chiffres qui montent. Les deux
derniers sont pilotés en JavaScript : `useMouvementReduit` les coupe quand le
système demande moins de mouvement.

**Zéro arrondi.** Un seul réglage supprime les coins arrondis de tous les
composants Bootstrap :

```scss
$enable-rounded: false;
$border-radius: 0;  $border-radius-sm: 0;  $border-radius-lg: 0;
$border-radius-xl: 0;  $border-radius-xxl: 0;  $border-radius-pill: 0;
```

Seuls les éléments volontairement circulaires (pastilles d'état, avatar,
indicateur de chargement) gardent leur forme.

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
