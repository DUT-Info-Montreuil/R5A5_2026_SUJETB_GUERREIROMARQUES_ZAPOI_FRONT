# API.md — Documentation du front-end

Ce document décrit **ce que le front consomme** de l'API et **comment il est
organisé** pour le faire : quel appel, dans quel fichier, déclenché par quel
écran. Il dit aussi ce qui reste à faire.

Le front **ne définit aucune API** : il consomme celle du dépôt back
(`…_BACK`). Pour le détail d'une route, les sources de vérité sont :

| Source | Contenu |
|---|---|
| Swagger du back — http://localhost:5000/apidoc/swagger (back démarré) | Schémas exacts, générés depuis le code |
| [`docs/CONTRAT_API.md`](docs/CONTRAT_API.md) | Règles transverses et décisions — **identique** dans les deux dépôts (v8) |
| `API.md` du dépôt back | Routes, événements temps réel, état d'avancement côté serveur |
| [`src/types/api.ts`](src/types/api.ts) | Le contrat en TypeScript : types de toutes les charges |

Légende : ✅ branché dans l'interface · ⏳ prévu au contrat, pas encore consommé. Tout le contrat actuel est consommé, sauf la route de supervision (administrateur, hors interface).

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
| `/` | `AccueilPage` — **vitrine** : hero, bande des jeux, chiffres, carrousel « à la une », tournois ouverts, atouts, mode d'emploi, histoire, témoignages, FAQ, appel final | Public | B-02 | ✅ |
| `/tournois` | `TournoisPage` — tous les tournois, en cartes ou en liste (`?statut=…&recherche=…&vue=liste`), carte ou ligne entière cliquable | Public | B-02 | ✅ |
| `/jeux` | `JeuxPage` — le catalogue : logo, postes et tournois de chaque jeu | Public | B-01, B-05 | ✅ |
| `/tournois/:idTournoi` | `TournoiPage` — en-tête, arbre, équipes, **en direct** | Public | B-02, B-19 | ✅ |
| `/connexion`, `/inscription` | `ConnexionPage`, `InscriptionPage` (plein écran) | Public | — | ✅ |
| `/diagnostic` | `DiagnosticPage` | Public | — | ✅ |
| `/admin/tournois` | `AdminTournoisPage` — liste, prochaine étape, création | Administrateur | B-01, B-03, B-04 | ✅ |
| `/admin/tournois/:idTournoi` | `AdminTournoiPage` — renommer, faire avancer, saisir les résultats | Administrateur | B-13, B-14, B-15 | ✅ |
| `/tournois/:idTournoi` — bloc « Mon équipe » : créer une équipe, demander à rejoindre | `TournoiPage` | Joueur | B-05, B-06 | ✅ |
| `/equipes/:idEquipe` | `EquipePage` — équipe, membres, demandes, postes, chat | Public pour la composition ; gestion : capitaine ; chat : membre | B-08 à B-11, B-16 à B-18 | ✅ |
| `/mes-equipes` | `MesEquipesPage` — accueil du joueur, **mon prochain match** (tour, adversaire, à jour en temps réel), mes équipes (filtres Toutes / En lice / Terminées), mes demandes en attente, point de départ s'il n'a rien | Connecté | B-06, B-16, B-19 | ✅ |

`RouteProtegee` enveloppe `/admin/*` et `/mes-equipes` : si l'utilisateur n'est pas connecté →
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
| `tournois.listerPostes` | `GET /api/jeux/{id}/roles` | `usePostes` | Création d'équipe | ✅ |
| `equipes.detailEquipe` | `GET /api/equipes/{id}` | `useEquipe` | Équipe | ✅ |
| `equipes.creerEquipe` | `POST /api/tournois/{id}/equipes` | `useCreationEquipe` | Page tournoi | ✅ |
| `equipes.modifierEquipe` | `PATCH /api/equipes/{id}` | `useGestionEquipe` (nom), `useDisqualification` (admin) | Équipe, admin | ✅ |
| `equipes.modifierMembre` | `PATCH /api/equipes/{id}/membres/{id}` | `useGestionEquipe` (poste, capitanat) | Équipe | ✅ |
| `equipes.retirerMembre` | `DELETE /api/equipes/{id}/membres/{id}` | `useGestionEquipe` (exclure, quitter) | Équipe | ✅ |
| `equipes.dissoudreEquipe` | `DELETE /api/equipes/{id}` | `useGestionEquipe` (se désister, capitaine, inscriptions ouvertes) | Équipe | ✅ |
| `equipes.mesEquipes` | `GET /api/moi/equipes` | `useMesParticipations` | Mes équipes, page tournoi | ✅ |
| `demandes.demanderAdhesion` | `POST /api/equipes/{id}/demandes` | `useDemandeAdhesion` | Page tournoi | ✅ |
| `demandes.demandesDeLEquipe` | `GET /api/equipes/{id}/demandes` | `useDemandesEquipe` | Équipe (capitaine) | ✅ |
| `demandes.traiterDemande` | `PATCH /api/demandes/{id}` | `useGestionEquipe` | Équipe (capitaine) | ✅ |
| `demandes.mesDemandes` | `GET /api/moi/demandes` | `useMesParticipations` | Mes équipes | ✅ |
| `messages.messagesDeLEquipe` | `GET /api/equipes/{id}/messages` | `useChatEquipe` | Chat | ✅ |
| `messages.envoyerMessage` | `POST /api/equipes/{id}/messages` | `useChatEquipe` | Chat | ✅ |
| `sante.etatSante` | `GET /health` | `useEtatChaine` | Diagnostic | ✅ |
| — | `GET /api/metriques/temps-reel` | — (supervision, à appeler à la main) | — | — |

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
| `403` | `useAction` : affiche le message de l'API (« Seul le capitaine… », « Action réservée aux administrateurs. »), jamais un texte figé |
| `404` | Page tournoi ou équipe : écran « introuvable ». Pour le chat : l'espace se ferme (« tu n'y as pas accès ») sans dire pourquoi |
| `409` | Message de l'API affiché tel quel (« La finale n'a pas encore de vainqueur. ») ; à l'inscription, indique si le pseudo ou l'e-mail est pris |
| `422` | Message de l'API affiché tel quel |
| `429` | Message de l'API affiché tel quel (trop de messages envoyés) |
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
| → serveur | `equipe:suivre` | `{ idEquipe }` → accusé `{ ok }` | `useChatEquipe`, à **chaque** `connect` | ✅ |
| → serveur | `equipe:quitter` | `{ idEquipe }` | `useChatEquipe`, au démontage | ✅ |
| ← serveur | `message:nouveau` | `Message` | `useChatEquipe` → fusion par identifiant | ✅ |
| ← serveur | `equipe:acces-revoque` | `{ idEquipe, motif }` | `useChatEquipe` → ferme l'espace, vide les messages, prévient la page | ✅ |

Comportement garanti par `useSuiviTournoi` et `useChatEquipe` : le salon est rejoint à chaque
connexion (le serveur oublie les salons d'un socket perdu), les écouteurs sont
retirés au démontage, et les rappels du composant sont lus via une référence
pour ne pas se réabonner à chaque rendu.

Rappel : **pas de rejeu des événements manqués** pendant une coupure. Le motif
suivi est « snapshot HTTP, puis deltas par événements ».

### La messagerie latérale (`useMessagerie`, `FournisseurMessagerie`)

Les membres discutent depuis un **tiroir à droite de l'écran**, ouvert par un bouton « Messages » en bas
à gauche, présent sur toutes les pages. Un badge compte les messages non lus (ceux des autres, plus
récents que le dernier vu ; le dernier vu est gardé dans le navigateur, par utilisateur). Une seule série
d'écouteurs suit **toutes** les équipes en lice (hors jeux en solo). L'administrateur, qui ne joue pas,
n'a pas de messagerie : il lit l'espace d'une équipe depuis sa page (`useChatEquipe`, lecture seule).

### Le chat d'équipe (`useChatEquipe`, lecture seule de l'administrateur)

1. snapshot : `GET /api/equipes/{id}/messages` ;
2. `equipe:suivre` à chaque connexion ; si l'accusé est `{ ok: false }`, l'espace est considéré comme inaccessible (le serveur ne dit pas pourquoi) ;
3. `message:nouveau` fusionné par identifiant : un message peut arriver par la réponse du `POST`, par l'événement et par la relecture, il n'est affiché qu'une fois ;
4. à chaque **re**connexion, les messages sont relus (les événements émis pendant la coupure sont perdus) ;
5. envoi par `POST` (HTTP), jamais par `socket.emit` ;
6. `equipe:acces-revoque` : l'espace se ferme tout de suite (B-17, B-18) ;
7. si le serveur coupe la connexion (`io server disconnect`, jeton expiré ou plafond dépassé), `api/socket.ts` se reconnecte explicitement : Socket.IO ne le fait pas tout seul dans ce cas ;
8. l'état de la connexion est affiché (« Connecté » / « Reconnexion… »).

---

## 5. Types du contrat

`src/types/api.ts` contient tout ce qui traverse le réseau :
`Utilisateur`, `IdentifiantsConnexion`, `DemandeInscription`, `Jeu`,
`TournoiResume`, `Tournoi`, `CreationTournoi`, `ModificationTournoi`,
`FiltreTournois`, `EquipeDuTournoi`, `Rencontre`, `ResultatRencontre`,
`EtatSante`, `ErreurApi`, `RoleJeu`, `Membre`, `Equipe`, `CreationEquipe`, `ModificationEquipe`, `ModificationMembre`, `DemandeAdhesion`, `MonEquipe`, `MaDemande`, `Message`, `AccesRevoque`, et les unions `StatutTournoi`, `StatutEquipe`,
`StatutRencontre`, `TypeResultat`, `StatutDemande`, `MotifAccesRevoque`.

Règles : un champ facultatif (`?`) correspond à un champ **omis** par l'API
(jamais `null`) ; les dates sont des chaînes ISO 8601 ; ce fichier se modifie
**en même temps** que le contrat, dans les deux dépôts.
---

## 6. Limites connues

À connaître avant l'oral.

0. **Contenus éditoriaux fictifs, non fournis par l'API** : l'histoire d'Agôn Cup
   (`NotreHistoire.tsx`), les témoignages (`Temoignages.tsx`), les coordonnées du pied de page, et la **dotation**
   (« cash prize ») des tournois, calculée dans `components/tournoi/dotations.ts`
   à partir du jeu et de la taille de l'arbre. Le schéma et le contrat n'ont
   aucun champ de dotation : une vraie dotation demande une colonne en base et
   un champ dans le contrat (décision à deux, voir `CLAUDE.md`).
   **Logos des jeux** : pictogrammes officiels de la bibliothèque Simple Icons
   (`components/jeux/logos.ts`), sauf **Overwatch 2** (absent de cette
   bibliothèque) : son sigle s'affiche en attendant le fichier officiel.
   Les marques restent la propriété de leurs éditeurs.

1. **Tests front ciblés, pas de bout en bout** : `npm test` (Vitest, `src/__tests__/`)
   couvre le client HTTP, `RouteProtegee` et le hook du chat, avec un socket et une
   API simulés. Les écrans ne sont pas tous testés ; les parcours complets se jouent
   à la main avec les données de démonstration du back
   (`python scripts/donnees_demo.py`). Les droits d'accès, eux, sont testés côté
   back, seul endroit où ils comptent.
2. **L'interface cache, le serveur refuse.** Les boutons masqués ou grisés
   (capitaine, administrateur, composition figée) sont du confort : la sécurité
   est dans l'API (403/404 testés).
3. **Le chat charge tout l'historique, sans pagination** (décision du contrat
   §6) : un très long historique alourdirait la page.
4. **Un capitaine seul ne peut pas quitter son équipe** : le back refuse (`422`)
   et ne propose pas de suppression d'équipe ; l'interface ne lui offre donc pas le bouton « Quitter ».
5. **Les demandes d'adhésion et les postes ne sont pas poussés en temps réel** :
   `useRechargeAuRetour` relit les données quand on revient sur l'onglet, plutôt
   qu'un polling permanent.
