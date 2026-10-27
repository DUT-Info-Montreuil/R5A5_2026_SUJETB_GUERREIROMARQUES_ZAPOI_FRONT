# CLAUDE.md — Front-end (React + TypeScript) · R5A5 sujet B « Plateforme de tournois »

Ce fichier est lu par Claude à chaque session. Il fixe **comment on travaille**
et **ce qu'il faut savoir du projet**. Les règles de la section 1 passent avant
tout le reste, y compris avant une demande qui les contredirait : dans ce cas,
Claude le signale et demande confirmation.

---

## 1. Règles de travail (non négociables)

### Communication
1. **Parler en français**, partout : réponses, commentaires de code, messages
   de commit, descriptions de PR, documentation, textes affichés à
   l'utilisateur.
2. **Toujours expliquer ce qu'on fait** : avant une série d'actions, dire en
   une ou deux phrases ce qui va être fait et pourquoi ; à la fin, dire ce qui
   a été fait, ce qui a été vérifié, et ce qui reste. Ne jamais enchaîner des
   modifications en silence.
3. **Dire la vérité sur l'état du travail.** Un build qui échoue, une étape
   sautée, une hypothèse non vérifiée : on le dit, avec la sortie de la
   commande. Ne jamais annoncer « ça marche » sans avoir lancé `npm run build`
   et, pour un changement visible, sans avoir regardé l'écran.
4. En cas de doute sur le besoin, **poser la question** plutôt que deviner. Si
   le sujet est flou, c'est à l'enseignant qu'il faut la poser (le dire à
   l'étudiant), pas à Claude de trancher.

### Git et pull requests
5. **Jamais de commit ni de push directement sur `main` ni sur `develop`.**
6. **Toute modification passe par une branche et une pull request** — même
   une correction d'une ligne, même de la documentation. Une branche par
   fonctionnalité : `feat/…`, `fix/…`, `docs/…`.
7. **Ne jamais fusionner une PR soi-même.** La fusion est relue et décidée par
   l'autre membre du binôme. Ne jamais faire de `push --force`, `reset --hard`
   ou réécriture d'historique sur une branche partagée.
8. **Ne créer une PR que si l'étudiant le demande** (ou s'il l'a demandé pour
   la tâche en cours). Elle explique le **pourquoi**, liste ce qui change, et
   dit comment tester (avec une capture d'écran si l'interface change). Si le
   dépôt a un modèle de PR, le suivre.
9. Commits petits et ciblés, au format `type(portée): description` —
   ex. `feat(equipe): formulaire de création d'équipe`. Jamais de `git add .`
   à l'aveugle : relire `git status` et `git diff --staged` avant de valider.

### Secrets
10. **Ne jamais committer de secret** : mot de passe, clé, jeton, cookie de
    session, fichier `.env`. Seul `.env.example` est versionné, avec des
    valeurs factices.
11. **Toute variable `VITE_*` est publique** : elle part dans le JavaScript du
    navigateur. Jamais de secret dedans, jamais de clé d'API privée.
12. Avant chaque commit, relire le diff à la recherche de secrets. Si un secret
    a été committé par erreur : **prévenir immédiatement** l'étudiant (le
    supprimer du dernier commit ne suffit pas, il faut le changer).
13. Ne jamais afficher dans l'interface ni dans la console un jeton, un mot de
    passe ou un message d'erreur technique brut.

### Actions risquées — demander d'abord
14. Demander confirmation avant : ajout, retrait ou changement de version
    d'une dépendance (le `package-lock.json` se commite avec), suppression de
    fichiers, modification du contrat d'API (`docs/CONTRAT_API.md`, identique
    dans le dépôt back) ou de `src/types/api.ts`.

### Travail rendu à l'enseignant
15. **Les fiches de décision et le rapport sur l'IA ne doivent pas être
    rédigés par Claude.** Le sujet annonce **0/3 pour du texte générique
    produit par une IA**. Claude peut relire, signaler des fautes, poser des
    questions pour faire émerger le raisonnement — mais le texte est celui de
    l'étudiant, avec ses mots et ses coûts réels. (Les fiches vivent dans le
    dépôt back : `docs/decisions/`.)
16. Ne pas inventer de comportement : tout écran et toute action doivent venir
    du sujet (exigences B-01 à B-19) ou du contrat d'API. Sinon, proposer et
    demander.

---

## 2. Le projet en deux minutes

- **Sujet B** : plateforme de tournois e-sport en équipes de 5, arbre à
  élimination directe, chat d'équipe, suivi en direct. Nom de marque : **Agôn
  Cup**. Rendu : ~15 jours après le 2026-10-15.
- **Deux dépôts** : ce front et le back (`…_BACK`, Flask). Le **contrat d'API**
  `docs/CONTRAT_API.md` est identique dans les deux : toute modification se
  répercute des deux côtés dans le même mouvement.
- **Pile** : React 19, TypeScript 6, Vite 8, react-router-dom 7, Bootstrap 5 +
  react-bootstrap, Sass, socket.io-client. Lint : oxlint.
- **Barème (partie front)** : architecture et lisibilité 4 · temps réel 4 (la
  moitié visible ici) · UX/UI 1 · documentation 2 · droits d'accès 3 (le front
  n'est **jamais** la sécurité : voir §5).

### Où en est-on

| Domaine | État |
|---|---|
| **Accueil vitrine** (hero animé, bande des jeux, carrousel, atouts, histoire illustrée, témoignages, FAQ), page **Tournois** (cartes / liste, filtres), page **Jeux** (catalogue), pied de page avec contacts, menu mobile | ✅ |
| **Thème clair / sombre** au choix de l'utilisateur (retenu dans le navigateur), curseur et halo de la marque (souris seulement) | ✅ |
| Logos officiels des jeux (Simple Icons) — **sauf Overwatch 2**, en attente de son fichier officiel (`components/jeux/logos.ts`) | ◐ |
| « Mes équipes » refondu : accueil du joueur, cartes animées, filtres, état vide | ✅ |
| **Catalogue de douze jeux** : filtres par famille, recherche sans accents, « inscriptions ouvertes » ; les postes viennent de l'API (une seule source : la base) | ✅ |
| **Se désister** : le capitaine dissout son équipe tant que les inscriptions sont ouvertes (confirmation, retour sur Mes équipes) | ✅ |
| **Mon prochain match** sur « Mes équipes » : tour, adversaire, « à jouer maintenant », suivi en temps réel (B-19) | ✅ |
| Image Docker de production (nginx : site + relais `/api` et WebSocket) ; interface et API sur la même origine | ✅ |
| Connexion, inscription, restauration de session | ✅ |
| Page publique d'un tournoi : en-tête, arbre, équipes, **mise à jour en temps réel** (B-02, B-19) | ✅ |
| Administration : liste, création, renommage, transitions d'état, saisie des résultats (B-01, B-03, B-04, B-13, B-14, B-15) | ✅ |
| **Équipes** : créer, demander à rejoindre, gérer (postes, demandes, passation, exclusion, quitter), « Mes équipes » (B-05 à B-11) | ✅ |
| **Messagerie** en tiroir à droite, bouton « Messages » en bas à gauche, badge de non lus, toutes les équipes en lice ; temps réel, perte d'accès immédiate, reconnexion, dédoublonnage (B-16 à B-18) | ✅ |
| **Jeux en solo** (échecs, EA FC, Pokémon) : inscription en un clic, ni équipe, ni postes, ni chat | ✅ |
| **Un administrateur ne joue pas** : pas de bouton pour s'inscrire (l'API répond 403) | ✅ |
| Icônes des postes (Lucide, ISC) ; accueil avec « En direct » et « Palmarès » ; histoire en frise | ✅ |
| Disqualification d'une équipe par l'administrateur (B-15) | ✅ |
| Avertissement « équipe incomplète » (joueurs ou postes manquants) pour le capitaine, avant le lancement (B-08) | ✅ |
| Tests automatisés front | ❌ aucun (pas de test runner installé) |

Le détail des appels est dans [`API.md`](API.md).

---

## 3. Commandes

| Besoin | Commande |
|---|---|
| Installer (versions figées) | `npm ci` |
| Configurer | `cp .env.example .env` (`VITE_API_URL=http://localhost:5000`) |
| Lancer | `npm run dev` → http://localhost:5173 (**le back doit tourner**) |
| **Vérifier avant une PR** | `npm run build` (typage strict + production) **puis** `npm run lint` |
| Voir la version de production | `npm run preview` |

Le port 5173 est fixe (`strictPort`) : il doit figurer dans `CORS_ORIGINS` du
`.env` du back. `npm install` ne sert qu'à ajouter une dépendance ;
`npm ci` pour tout le reste.

`npm run build` **et** `npm run lint` doivent passer sans erreur avant toute PR.
L'écran `/diagnostic` vérifie la chaîne front → API → base → temps réel.

---

## 4. Architecture — à respecter

Détail dans `docs/ARCHITECTURE.md`. Parallèle avec le back :
`pages/`+`components/` ≈ controllers · `hooks/` ≈ services · `api/` ≈ repository.

| Dossier | Il contient | Il ne contient **jamais** |
|---|---|---|
| `api/` | Fonctions TypeScript qui appellent l'API | React, état, affichage |
| `types/` | Les types du contrat (`api.ts`) | Logique |
| `context/` | Les Providers d'état global | Affichage |
| `hooks/` | L'orchestration d'un écran : appel, chargement, erreur | JSX |
| `components/` | Ce qui s'affiche, rangé par domaine | Appel réseau direct |
| `pages/` | L'assemblage de composants pour une route | Logique métier |

Règles du projet :

- **Un seul `fetch`**, dans `api/client.ts` (cookie inclus, traduction des
  erreurs, réaction au 401). Jamais d'`axios`, jamais de `fetch` ailleurs.
- **Une seule connexion Socket.IO**, dans `api/socket.ts`. Les composants
  s'abonnent à des événements ; ils n'ouvrent jamais la leur.
- **`types/api.ts` est le contrat en TypeScript** : il se modifie **en même
  temps** que `docs/CONTRAT_API.md`, jamais séparément.
- **Un composant n'appelle jamais `api/`** : il passe par un hook.
- **Un formulaire ne décide pas de la navigation** : il reçoit `onSucces`.
- **Une écriture passe par `useAction`** (état d'envoi + message d'erreur).
- Les dossiers par domaine (`components/equipe/`, `components/chat/`) se créent
  quand la première fonctionnalité du domaine arrive.

**Ajouter un écran** (ordre à suivre) : routes dans le contrat → `types/api.ts`
→ `api/` → `hooks/` → `components/<domaine>/` → `pages/` + route dans
`routes/Routage.tsx` → `npm run build` + `npm run lint`.

### Conventions de code
- Composants : `PascalCase.tsx`, **un** composant exporté par fichier, export nommé.
- Hooks : `useQuelqueChose.ts` ; pages : `NomPage.tsx`.
- Métier en français (`equipe`, `rencontre`), comme le contrat.
- **Jamais `any`** : `unknown` puis vérification.
- Un composant de plus d'une centaine de lignes a presque toujours deux
  responsabilités : le découper.
- Commentaires : le **pourquoi**, pas le quoi.
- **Aucune couleur en dur** dans un composant : variables du thème
  (`styles/_variables.scss`) ou classes Bootstrap. Zéro arrondi
  (`$border-radius: 0`). Animations limitées à `transform` et `opacity`, et
  coupées quand `prefers-reduced-motion` est actif (`useMouvementReduit`).
- Indentation : 4 espaces dans `src/` (sauf les fichiers du socle qui en
  utilisent 2 : respecter celle du fichier modifié).

---

## 5. Sécurité côté front

Le front **affiche** et **demande** ; c'est le back qui **décide**.

- **Aucun droit n'est déduit côté client.** L'état d'authentification ne
  contient que l'identité et `estAdministrateur`, lus depuis `GET /api/auth/moi`.
  L'appartenance à une équipe ou le statut de capitaine ne sont **jamais**
  mis en cache : on les redemande au serveur (B-17 : un joueur exclu perd
  l'accès immédiatement).
- **`RouteProtegee` n'est pas une sécurité** : elle évite une erreur de
  manipulation, pas une attaque. Tout écran réservé doit s'accompagner d'un
  refus **côté back** (403/404), que le dev vérifie.
- **Le jeton est un cookie `HttpOnly`** : le front ne le lit, ne le stocke et
  ne l'envoie jamais à la main. Interdits : `localStorage`/`sessionStorage`
  pour un jeton, en-tête `Authorization` écrit à la main.
- **Du texte, jamais du HTML** : React échappe ce qui est écrit entre
  accolades. **`dangerouslySetInnerHTML` est interdit** sur toute donnée venue
  d'un utilisateur (pseudo, nom d'équipe, message de chat).
- Un **401** déconnecte l'interface (`definirGestionSessionPerdue`) ; un 403 ou
  404 s'affiche avec le message de l'API, sans le réinterpréter.
- Messages d'erreur : ceux de l'API sont rédigés pour l'utilisateur et
  s'affichent tels quels, **sauf** pour les 5xx et les erreurs techniques
  (`useAction` les remplace par un message générique).

---

## 6. Temps réel (4 points) — règles tirées du cours

Canal : **Socket.IO** (`socket.io-client`), parce que le back utilise
Flask-SocketIO. Un `WebSocket` natif ne peut **pas** parler à un serveur
Socket.IO. Voir la fiche de décision n° 02 (dépôt back, à rédiger par
l'étudiant).

À respecter dans le code :

1. **Rejoindre les salons à chaque `connect`**, pas une fois : après une
   reconnexion, le serveur voit une nouvelle connexion qui n'appartient à
   aucun salon (`useSuiviTournoi` le fait).
2. **Se désabonner au démontage** : `socket.off(...)` pour chaque `socket.on`,
   et `tournoi:quitter` / équivalent. Sinon chaque retour sur la page ajoute un
   écouteur de plus (fuite, doublons d'affichage).
3. **Snapshot puis deltas** : les événements émis pendant une coupure sont
   perdus. Après une reconnexion — et à chaque `tournoi:maj`, car une transition
   a pu changer l'arbre — **relire l'état par HTTP**. Un événement ne remplace
   jamais la lecture initiale.
4. **Les écritures restent en HTTP** (`POST /api/equipes/{id}/messages`) ; le
   socket ne sert qu'à recevoir `message:nouveau`. Pas d'envoi de message par
   `socket.emit`.
5. **Dédoublonner** : un message créé pendant le chargement de la liste arrive
   deux fois (liste + événement). Retirer l'élément de même `id` avant de
   l'ajouter.
6. **`equipe:acces-revoque` doit fermer le chat immédiatement** : masquer
   l'espace, vider les messages en mémoire, quitter le salon, informer
   l'utilisateur (B-17, B-18). Ne jamais garder un chat ouvert après cet
   événement.
7. **Indiquer l'état de connexion** (« Connecté » / « Reconnexion… ») : un
   utilisateur ne doit pas croire recevoir en direct alors que le canal est
   coupé.
8. **Isoler la réception dans un hook** (`useSuiviTournoi`, futur
   `useChatEquipe`) : le composant dépend d'une source de données, pas de
   Socket.IO. Passer du temps réel à un autre mécanisme ne doit toucher que le
   hook.
9. Pas de `socket.connect()` à l'import : `autoConnect: false`, la connexion
   s'ouvre quand un écran en a besoin.

---

## 7. Ne pas faire

- ❌ Un `fetch` hors de `api/client.ts`, ou un appel `api/` depuis un composant.
- ❌ Une deuxième instance `io(...)`.
- ❌ Stocker ou lire le jeton en JavaScript.
- ❌ Cacher un bouton en pensant protéger une action (le back doit refuser).
- ❌ `any`, `// @ts-ignore`, ou désactiver une règle de lint pour « faire passer ».
- ❌ Modifier `types/api.ts` sans modifier le contrat dans les deux dépôts.
- ❌ Une couleur ou une police en dur dans un composant.
- ❌ Ajouter une dépendance sans la valider avec l'étudiant.
- ❌ Rédiger à la place de l'étudiant les fiches de décision ou le rapport IA.
