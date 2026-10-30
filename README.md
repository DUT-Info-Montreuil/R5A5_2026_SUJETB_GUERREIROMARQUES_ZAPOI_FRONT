# Agôn Cup — Interface

Interface web de la plateforme de tournois de l'association étudiante
(R5A5, sujet B).

Ce dépôt ne fonctionne **pas seul** : il consomme l'API du dépôt
**`R5A5_2026_SUJETB_GUERREIROMARQUES_ZAPOI_BACK`**, qui doit être lancée en
premier.

| Document | Contenu |
|---|---|
| [`API.md`](API.md) | Ce que le front consomme de l'API : appels, écrans, temps réel, état d'avancement |
| [`CLAUDE.md`](CLAUDE.md) | Règles de travail avec Claude (français, PR obligatoires, pas de secret…) et contexte du projet |
| [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) | Organisation du code, règles, thème visuel |
| [`docs/CONTRAT_API.md`](docs/CONTRAT_API.md) | Contrat figé entre le front et le back — identique dans les deux dépôts |

---

## Démarrage rapide sous Windows : toute la pile avec Docker

Le plus simple pour voir le site fonctionner (et pour la correction) : la base,
l'API et l'interface démarrent ensemble avec la configuration du dépôt back
(`docker-compose.complet.yml`). Il ne faut que **Docker Desktop** (démarré) et
**Git**. Les deux dépôts doivent être **côte à côte**. Dans **PowerShell** :

```powershell
mkdir agon-cup
cd agon-cup
git clone https://github.com/DUT-Info-Montreuil/R5A5_2026_SUJETB_GUERREIROMARQUES_ZAPOI_BACK.git back
git clone https://github.com/DUT-Info-Montreuil/R5A5_2026_SUJETB_GUERREIROMARQUES_ZAPOI_FRONT.git front
cd back
docker compose -f docker-compose.complet.yml up --build
```

Puis ouvrir **http://localhost:8080**. Sans données, le site est vide : dans un
second PowerShell, depuis le dossier `back`, charger la démonstration (comptes,
équipes, tournois) :

```powershell
docker compose -f docker-compose.complet.yml --profile demo run --rm demo
```

Le détail (réglages, mise à jour, dépannage) est dans le README du back.

L'image du front (voir `Dockerfile`) construit le site puis le sert avec nginx,
qui relaie aussi `/api` et le WebSocket vers l'API : le navigateur ne parle qu'à
une seule adresse. Pour **développer** avec rechargement automatique, suivre les
sections suivantes.

---

## Prérequis (développement)

- **Node.js 22** (avec npm 10) — la version avec laquelle le front est testé
  et construit dans l'image Docker
- L'**API back-end démarrée** — voir le README du dépôt back (Python 3.13,
  PostgreSQL 16 dans Docker)

Principales versions figées dans `package-lock.json` : React 19, React Router 7,
Vite 8.3.5, TypeScript 6.0, Socket.IO client 4.8, Bootstrap 5.3, Vitest.

---

## Installation

```bash
npm ci
cp .env.example .env
```

`npm ci` installe **exactement** les versions figées dans `package-lock.json` —
tout le monde a donc les mêmes. `npm install` ne sert qu'à ajouter ou mettre à
jour une dépendance, et le `package-lock.json` modifié se commite avec.

Le `.env` contient une seule variable :

```
VITE_API_URL=http://localhost:5000
```

À adapter uniquement si l'API tourne ailleurs. Toute variable préfixée
`VITE_` est visible dans le navigateur : n'y mettez **jamais** de secret.
Laissée **vide**, l'interface appelle la même adresse que la page : c'est le
réglage de l'image Docker.

---

## Lancement

```bash
npm run dev
```

L'interface est disponible sur `http://localhost:5173` (**pas** `127.0.0.1`, qui
n'est pas une origine autorisée par défaut). La page `/diagnostic` vérifie que
l'API, la base et le canal temps réel répondent : si les quatre lignes sont
vertes, tout est en place.

Le port 5173 doit figurer dans `CORS_ORIGINS` du `.env` du back — c'est la
valeur par défaut. Sans ça, le navigateur bloque tous les appels à l'API.

---

## Essayer avec des comptes de démonstration

Les comptes et tournois de démonstration sont créés par le **back**
(`python scripts/donnees_demo.py`, voir son README) : un administrateur
(`admin@agon-cup.fr`), 40 joueurs (`joueur01@demo.iut.fr` à `joueur40@demo.iut.fr`)
et treize tournois (six à des étapes différentes, deux ouverts sans équipe, deux en solo, trois de plus pour le palmarès et le direct). Pour tester plusieurs profils en même
temps, ouvrir des fenêtres de navigation privée distinctes : le cookie de
session est partagé dans une même fenêtre. Un visiteur est simplement quelqu'un
qui n'est pas connecté.

---

## Autres commandes

| Commande | Rôle |
|---|---|
| `npm run build` | Vérifie le typage TypeScript puis produit la version de production dans `dist/` |
| `npm run preview` | Sert la version de production en local |
| `npm run lint` | Analyse statique du code |
| `npm test` | Lance les tests automatisés (Vitest), une fois |
| `npm run test:watch` | Relance les tests à chaque modification |

Avant une pull request : `npm test`, puis `npm run build`, qui échoue à la
moindre erreur de typage (tests compris), puis `npm run lint`.

Les tests (25) vivent dans `src/__tests__/`. Ils couvrent le client HTTP (cookie
joint, traduction des erreurs, réaction au 401), `RouteProtegee`, l'espace
d'échange (`useChatEquipe` : dédoublonnage, perte d'accès immédiate, relecture
après reconnexion) et le diagnostic du temps réel (`useEtatChaine` : transport,
erreur de connexion). Le socket et l'API y sont remplacés par des doublures :
aucun back n'est nécessaire.

---

## Les écrans

| Adresse | Page | Qui y accède |
|---|---|---|
| `/` | Accueil : tournois en direct, palmarès, jeux, histoire, FAQ | Tout le monde |
| `/tournois`, `/tournois/:id` | Liste filtrable ; détail avec arbre et équipes, **à jour en temps réel** | Tout le monde |
| `/jeux` | Catalogue des jeux, leurs postes et leurs tournois | Tout le monde |
| `/connexion`, `/inscription` | Authentification | Tout le monde |
| `/equipes/:id` | Équipe : composition, gestion (capitaine), demandes | Public ; gestion réservée au capitaine |
| `/mes-equipes` | Mon prochain match, mes équipes et mes demandes | Joueur connecté |
| `/admin/tournois`, `/admin/tournois/:id` | Créer, faire avancer, saisir les résultats | Administrateur |
| `/diagnostic` | État de la chaîne front → API → base → temps réel | Tout le monde |

La messagerie d'équipe est un **tiroir** ouvert depuis le bouton « Messages » en
bas à gauche, présent sur toutes les pages pour un joueur connecté. Les pages
d'administration sont chargées à la demande (`React.lazy`) : un visiteur ne
télécharge pas leur code.

---

## Organisation du code

```
src/
├── api/          Seule couche qui parle au réseau : un fetch, une connexion Socket.IO
├── types/        Le contrat d'API en TypeScript
├── context/      État global : session, messagerie
├── hooks/        Orchestration d'un écran : appel, chargement, erreur, temps réel
├── components/   Ce qui s'affiche, rangé par domaine (tournoi, equipe, admin, chat…)
├── pages/        Une page par route
├── routes/       Déclaration des routes, RouteProtegee
├── styles/       Thème Bootstrap surchargé en Sass, sombre et clair
└── __tests__/    Tests Vitest
```

Une page n'appelle jamais `api/` directement : elle passe par un hook. Le détail
des règles est dans [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

---

## Image Docker de production

Le `Dockerfile` a deux étapes : `node:22-alpine` construit le site (`npm ci`,
`npm run build`), puis `nginx:1.27-alpine` sert le dossier `dist/`.
`nginx.conf` fait trois choses :

- sert l'application, et renvoie `index.html` pour toute adresse inconnue (le
  routage est côté navigateur) ;
- relaie `/api`, `/health`, `/apidoc` et `/socket.io` vers le service `api` ;
  le navigateur ne parle donc qu'à **une seule adresse**, sans CORS ;
- plafonne à 20 les connexions temps réel par adresse et pose les en-têtes de sécurité.

`VITE_API_URL` est **vide** dans l'image (même adresse que la page). Cette image
ne démarre que dans la pile du dépôt back, où l'hôte `api` existe :
`docker compose -f docker-compose.complet.yml up --build` (voir plus haut).

---

## Dépannage

**« L'API est injoignable »** — le back n'est pas démarré, ou `VITE_API_URL`
pointe au mauvais endroit. Vérifier `http://localhost:5000/health`.

**Erreur CORS dans la console du navigateur** — l'API tourne mais refuse
l'origine du front. Ajouter `http://localhost:5173` à `CORS_ORIGINS` dans le
`.env` du back, puis redémarrer l'API.

**Modification du `.env` sans effet** — Vite ne relit ce fichier qu'au
démarrage : arrêter et relancer `npm run dev`.

**Page blanche, ou « Outdated Optimize Dep » dans la console** — Vite a mis en cache
d'anciennes versions des dépendances (après `npm ci`, ou un changement de branche).
Arrêter le serveur, puis `npm run dev -- --force`.

**Un autre programme occupe le port 5000 ou 5173** — l'« API injoignable » vient
souvent d'une ancienne instance du back restée en arrière-plan. Voir le dépannage
du README du back (`Get-NetTCPConnection -LocalPort 5000`). Le port 5173 est
fixe : si Vite refuse de démarrer, c'est qu'une ancienne instance l'occupe.

**Le temps réel ne charge pas** — ouvrir `/diagnostic` : la ligne « Temps réel »
doit être verte. Sinon, vérifier l'adresse ouverte (`http://localhost:5173`), que
le back est bien démarré, et la section « Le temps réel ne charge pas » du README
du back (plafond de 20 connexions par adresse, dépendances à jour, pare-feu).

**Windows : fins de ligne** — le dépôt contient un `.gitattributes` qui force le
LF pour `nginx.conf` et le `Dockerfile` ; sans lui, Git pour Windows peut les
convertir en CRLF et casser l'image Docker.
