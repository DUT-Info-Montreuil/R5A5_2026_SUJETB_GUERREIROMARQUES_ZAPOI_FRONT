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

## Démarrage rapide : toute la pile avec Docker

Le plus simple pour voir le site fonctionner : la base, l'API et l'interface
démarrent ensemble avec la configuration du dépôt back (`docker-compose.complet.yml`).
Les deux dépôts doivent être **côte à côte** :

```bash
mkdir agon-cup && cd agon-cup
git clone <adresse du dépôt back>  back
git clone <adresse du dépôt front> front
cd back
docker compose -f docker-compose.complet.yml up --build
```

Puis ouvrir **http://localhost:8080**. Les comptes de démonstration s'ajoutent
avec `docker compose -f docker-compose.complet.yml --profile demo run --rm demo`
(détails dans le README du back).

L'image du front (voir `Dockerfile`) construit le site puis le sert avec nginx,
qui relaie aussi `/api` et le WebSocket vers l'API : le navigateur ne parle qu'à
une seule adresse. Pour **développer** avec rechargement automatique, suivre les
sections suivantes.

---

## Prérequis

- **Node.js 20 ou plus récent** (avec npm)
- L'**API back-end démarrée** — voir le README du dépôt back

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

L'interface est disponible sur `http://localhost:5173`. La page d'accueil
provisoire vérifie que l'API, la base et le canal temps réel répondent : si les
quatre lignes sont vertes, tout est en place.

Le port 5173 doit figurer dans `CORS_ORIGINS` du `.env` du back — c'est la
valeur par défaut. Sans ça, le navigateur bloque tous les appels à l'API.

---

## Essayer avec des comptes de démonstration

Les comptes et tournois de démonstration sont créés par le **back**
(`python scripts/donnees_demo.py`, voir son README) : un administrateur
(`admin@agon-cup.fr`), 40 joueurs (`joueur01@demo.iut.fr` à `joueur40@demo.iut.fr`)
et six tournois à des étapes différentes. Pour tester plusieurs profils en même
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

`npm run build` est le meilleur test avant une pull request : il échoue à la
moindre erreur de typage.

---

## Dépannage

**« L'API est injoignable »** — le back n'est pas démarré, ou `VITE_API_URL`
pointe au mauvais endroit. Vérifier `http://localhost:5000/health`.

**Erreur CORS dans la console du navigateur** — l'API tourne mais refuse
l'origine du front. Ajouter `http://localhost:5173` à `CORS_ORIGINS` dans le
`.env` du back, puis redémarrer l'API.

**Modification du `.env` sans effet** — Vite ne relit ce fichier qu'au
démarrage : arrêter et relancer `npm run dev`.
