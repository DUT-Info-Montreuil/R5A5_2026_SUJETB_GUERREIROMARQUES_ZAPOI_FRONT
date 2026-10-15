# API.md — Documentation du front-end

Ce document décrit **ce que le front consomme** de l'API et **comment il est
organisé** pour le faire : quel appel, dans quel fichier, déclenché par quel
écran. Il dit aussi ce qui reste à faire.

Le front **ne définit aucune API** : il consomme celle du dépôt back
(`…_BACK`). Pour le détail d'une route, les sources de vérité sont :

| Source | Contenu |
|---|---|
| Swagger du back — http://localhost:5000/apidoc/swagger (back démarré) | Schémas exacts, générés depuis le code |
| [`docs/CONTRAT_API.md`](docs/CONTRAT_API.md) | Règles transverses et décisions — **identique** dans les deux dépôts (v5) |
| `API.md` du dépôt back | Routes, événements temps réel, état d'avancement côté serveur |
| [`src/types/api.ts`](src/types/api.ts) | Le contrat en TypeScript : types de toutes les charges |

Légende : ✅ branché dans l'interface · ⏳ prévu au contrat, pas encore consommé.

---

## 1. Démarrage

```bash
npm ci
cp .env.example .env     # VITE_API_URL=http://localhost:5000
npm run dev              # http://localhost:5173 — le back doit tourner
```

| Variable | Rôle |
|---|---|
| `VITE_API_URL` | Adresse de l'API **et** du canal temps réel. Valeur par défaut : `http://localhost:5000`. Publique (visible dans le navigateur) : jamais de secret |

Prérequis côté back : `http://localhost:5173` dans `CORS_ORIGINS`, sinon le
navigateur bloque tous les appels.
Vérification en un coup d'œil : la page `/diagnostic` teste l'API, la base et le
canal temps réel.

---

## 2. Écrans (routes du navigateur)

| Route | Page | Accès | Exigences | |
|---|---|---|---|---|
| `/` | `AccueilPage` — une, chiffres, jeux, calendrier filtrable (`?statut=…&recherche=…`) | Public | B-02 | ✅ |
| `/tournois/:idTournoi` | `TournoiPage` — en-tête, arbre, équipes, **en direct** | Public | B-02, B-19 | ✅ |
| `/connexion`, `/inscription` | `ConnexionPage`, `InscriptionPage` (plein écran) | Public | — | ✅ |
| `/diagnostic` | `DiagnosticPage` | Public | — | ✅ |
| `/admin/tournois` | `AdminTournoisPage` — liste, prochaine étape, création | Administrateur | B-01, B-03, B-04 | ✅ |
| `/admin/tournois/:idTournoi` | `AdminTournoiPage` — renommer, faire avancer, saisir les résultats | Administrateur | B-13, B-14, B-15 | ✅ |
| `/tournois/:id` — créer/rejoindre une équipe | — | Joueur | B-05, B-06 | ⏳ |
| `/equipes/:id` — gestion de l'équipe, demandes | — | Capitaine / membre | B-08 à B-11 | ⏳ |
| `/equipes/:id/chat` — espace d'échange | — | Membre (ou admin en lecture) | B-16 à B-18 | ⏳ |

`RouteProtegee` enveloppe `/admin/*` : si l'utilisateur n'est pas connecté →
redirection vers `/connexion` ; s'il n'est pas administrateur → « Accès
réservé ». **C'est du confort, pas de la sécurité** : c'est l'API qui refuse
(403).

---

## 3. Appels HTTP

Tout passe par **un seul client**, `src/api/client.ts` :

- `fetch` avec `credentials: 'include'` : le navigateur joint le cookie `jeton`
  (`HttpOnly`) — le front ne voit jamais le jeton ;
- URL construite depuis `VITE_API_URL`, paramètres vides ignorés ;
- réponse `204` → `undefined` ; toute réponse non `2xx` → `ErreurHttp`
  (`statut`, `message`, `detail`) ;
- réseau coupé → `ErreurHttp` de statut `0`, message « L'API est injoignable » ;
- **chaque `401` appelle `surSessionPerdue`** : le contexte d'authentification
  repasse l'utilisateur à `null`.

```ts
import { api } from './client';
api.get<Tournoi>('/api/tournois/1');
api.patch<Tournoi>('/api/tournois/1', { statutTournoi: 'INSCRIPTIONS_CLOSES' });
```

### Carte des appels

| Fonction (`src/api/…`) | Route de l'API | Utilisée par | Écran | |
|---|---|---|---|---|
| `auth.seConnecter` | `POST /api/auth/connexion` | `useConnexion` | Connexion | ✅ |
| `auth.sInscrire` | `POST /api/auth/inscription` | `useInscription` | Inscription | ✅ |
| `auth.profil` | `GET /api/auth/moi` | `FournisseurAuth` | Au chargement de toute page | ✅ |
| `auth.seDeconnecter` | `POST /api/auth/deconnexion` | `FournisseurAuth` | En-tête | ✅ |
| `tournois.listerTournois` | `GET /api/tournois` | `useTournois` | Accueil | ✅ |
| `tournois.detailTournoi` | `GET /api/tournois/{id}` | `useTournoi` | Page tournoi, admin | ✅ |
| `tournois.equipesDuTournoi` | `GET /api/tournois/{id}/equipes` | `useTournoi` | Page tournoi, admin | ✅ |
| `tournois.arbreDuTournoi` | `GET /api/tournois/{id}/arbre` | `useTournoi` | Page tournoi, admin | ✅ |
| `tournois.listerJeux` | `GET /api/jeux` | `useJeux` | Création de tournoi | ✅ |
| `tournois.creerTournoi` | `POST /api/tournois` | `ModaleCreationTournoi` | Admin | ✅ |
| `tournois.modifierTournoi` | `PATCH /api/tournois/{id}` | `ActionsTournoi`, `FormulaireRenommage` | Admin | ✅ |
| `rencontres.saisirResultat` | `PATCH /api/rencontres/{id}` | `ModaleResultat` | Admin | ✅ |
| `sante.etatSante` | `GET /health` | `useEtatChaine` | Diagnostic | ✅ |
| Création d'équipe, demandes, membres | `POST/GET/PATCH/DELETE /api/equipes…`, `/api/demandes/{id}` | — | — | ⏳ |
| Messages d'équipe | `GET/POST /api/equipes/{id}/messages` | — | — | ⏳ |

### Authentification dans l'interface

1. Au démarrage, `FournisseurAuth` appelle `GET /api/auth/moi`. Un `401` pour un
   visiteur est **normal** (visible dans la console du navigateur).
2. Connexion/inscription : l'API pose le cookie ; le front ne reçoit que
   `{ utilisateur }` et le range dans le contexte (`ouvrirSession`).
3. Déconnexion : `POST /api/auth/deconnexion` (seul moyen d'effacer un cookie
   `HttpOnly`) ; l'interface se considère déconnectée même si l'appel échoue.
4. Lecture dans un composant : `const { utilisateur, chargement } = useAuth()`.
   `chargement` est vrai tant que la session n'est pas vérifiée : ne rien
   rediriger pendant ce temps.

L'état d'authentification ne contient **que** `Utilisateur`
(`idUtilisateur`, `pseudo`, `email`, `estAdministrateur`).

### Gestion des erreurs

| Code | Ce que fait l'interface |
|---|---|
| `0` | « L'API est injoignable. Le serveur back est-il démarré ? » |
| `400` | `useAction` : « Certains champs sont invalides. » (le détail par champ est dans `ErreurHttp.detail.champs`) |
| `401` | Session perdue : contexte remis à `null` ; `useConnexion` affiche « E-mail ou mot de passe incorrect. » |
| `403` | `useAction` : « Action réservée aux administrateurs. » — **à nuancer** quand les actions de capitaine arriveront (§6) |
| `404` | Page tournoi : écran « introuvable » |
| `409` | Message de l'API affiché tel quel (« La finale n'a pas encore de vainqueur. ») ; à l'inscription, indique si le pseudo ou l'e-mail est pris |
| `422` | Message de l'API affiché tel quel |
| `5xx` | « Le serveur a rencontré une erreur. Réessayez. » — jamais le détail technique |

---

## 4. Temps réel

Une seule connexion Socket.IO, créée dans `src/api/socket.ts`
(`autoConnect: false`, `withCredentials: true`). Le protocole est **Socket.IO** :
un `new WebSocket(...)` natif ne peut pas parler à ce serveur.

### Événements gérés

| Sens | Événement | Charge | Géré par | |
|---|---|---|---|---|
| → serveur | `tournoi:suivre` | `{ idTournoi }` | `useSuiviTournoi`, à **chaque** `connect` | ✅ |
| → serveur | `tournoi:quitter` | `{ idTournoi }` | `useSuiviTournoi`, au démontage | ✅ |
| ← serveur | `tournoi:maj` | `Tournoi` | `useTournoi` → relit tout (l'arbre a pu changer) | ✅ |
| ← serveur | `rencontre:maj` | `Rencontre` | `useTournoi` → remplace la rencontre dans l'arbre, relit les équipes (statut) | ✅ |
| ← serveur | `bienvenue` | `{ message }` | non utilisé (diagnostic) | — |
| ← serveur | `message:nouveau` | `Message` | — | ⏳ |
| ← serveur | `equipe:acces-revoque` | `{ idEquipe, motif }` | — | ⏳ |

Comportement garanti par `useSuiviTournoi` : le salon est rejoint à chaque
connexion (le serveur oublie les salons d'un socket perdu), les écouteurs sont
retirés au démontage, et les rappels du composant sont lus via une référence
pour ne pas se réabonner à chaque rendu.

Rappel : **pas de rejeu des événements manqués** pendant une coupure. Le motif
suivi est « snapshot HTTP, puis deltas par événements ».

### Point à venir : le chat d'équipe

À prévoir dans un hook dédié (`useChatEquipe`), pas dans un composant :

1. charger `GET /api/equipes/{id}/messages` (snapshot) ;
2. écouter `message:nouveau`, en retirant un éventuel doublon de même `id` ;
3. envoyer par `POST …/messages` (HTTP), pas par `socket.emit` ;
4. sur `equipe:acces-revoque` : fermer l'espace, vider les messages, informer ;
5. afficher l'état de la connexion.

L'abonnement au salon `equipe:{id}` n'existe pas encore côté back.

---

## 5. Types du contrat

`src/types/api.ts` contient tout ce qui traverse le réseau :
`Utilisateur`, `IdentifiantsConnexion`, `DemandeInscription`, `Jeu`,
`TournoiResume`, `Tournoi`, `CreationTournoi`, `ModificationTournoi`,
`FiltreTournois`, `EquipeDuTournoi`, `Rencontre`, `ResultatRencontre`,
`EtatSante`, `ErreurApi`, et les unions `StatutTournoi`, `StatutEquipe`,
`StatutRencontre`, `TypeResultat`.

Règles : un champ facultatif (`?`) correspond à un champ **omis** par l'API
(jamais `null`) ; les dates sont des chaînes ISO 8601 ; ce fichier se modifie
**en même temps** que le contrat, dans les deux dépôts.
Types **à ajouter** pour les équipes : `Equipe`, `Membre`, `DemandeAdhesion`,
`Message`, `RoleJeu`, et les corps de création/modification correspondants.

---

## 6. Écarts et points d'attention

À traiter avant le rendu ou à justifier.

1. **Architecture : quatre composants appellent `api/` directement**
   (`ModaleResultat`, `ModaleCreationTournoi`, `ActionsTournoi`,
   `FormulaireRenommage`), alors que `docs/ARCHITECTURE.md` impose de passer par
   un hook. Correction simple : un hook `useAdministrationTournoi` (ou un hook
   par action) qui encapsule `executer(() => …)`. Le sujet note l'architecture
   sur 4 points.
2. **Message 403 figé** dans `useAction` : « Action réservée aux
   administrateurs. ». Faux dès qu'un capitaine reçoit un 403 sur une équipe
   qui n'est pas la sienne. Utiliser le `detail` de l'API ou un message par
   contexte.
3. **Aucun test automatisé côté front** (pas de test runner dans
   `package.json`). La vérification actuelle est `npm run build` (typage) et
   `npm run lint`.
4. **Fonctionnalités du sujet non faites côté interface** : équipes
   (B-05 à B-11), chat (B-16 à B-18), disqualification. Elles dépendent
   d'abord des routes du back (voir son `API.md`, §4).
5. **Contrat et back** : l'authentification du socket (contrat §7) et la durée
   du cookie sont à aligner côté back — voir §7 de son `API.md`.
