/**
 * Client HTTP unique de l'application.
 *
 * RÈGLE : aucun `fetch` ailleurs dans le code, tout passe par ici.
 *
 * Cette couche est au front ce que `repository/` est au back : le seul endroit
 * qui sait où vivent les données et comment les atteindre. Le reste du code
 * appelle des fonctions, sans savoir qu'il y a du HTTP derrière.
 *
 * Quand l'authentification arrivera, c'est ici — et seulement ici — que le
 * jeton sera ajouté aux requêtes.
 */

import type { ErreurApi } from '../types/api';

export const URL_API: string = import.meta.env.VITE_API_URL ?? 'http://localhost:5000';

/** Erreur renvoyée par l'API, avec son code HTTP (contrat §1.2). */
export class ErreurHttp extends Error {
  // Champs déclarés explicitement : le gabarit Vite active `erasableSyntaxOnly`,
  // qui interdit les propriétés déclarées dans le constructeur.
  readonly statut: number;
  readonly detail?: unknown;

  constructor(statut: number, message: string, detail?: unknown) {
    super(message);
    this.name = 'ErreurHttp';
    this.statut = statut;
    this.detail = detail;
  }
}

type Methode = 'GET' | 'POST' | 'PATCH' | 'DELETE';

async function requete<T>(chemin: string, methode: Methode = 'GET', corps?: unknown): Promise<T> {
  let reponse: Response;
  try {
    reponse = await fetch(`${URL_API}${chemin}`, {
      method: methode,
      headers: corps === undefined ? undefined : { 'Content-Type': 'application/json' },
      body: corps === undefined ? undefined : JSON.stringify(corps),
    });
  } catch {
    // Panne réseau ou API éteinte : fetch rejette sans réponse HTTP.
    throw new ErreurHttp(0, "L'API est injoignable. Le serveur back est-il démarré ?");
  }

  if (reponse.status === 204) return undefined as T;

  const texte = await reponse.text();
  const charge: unknown = texte ? JSON.parse(texte) : null;

  if (!reponse.ok) {
    const erreur = charge as ErreurApi | null;
    throw new ErreurHttp(reponse.status, erreur?.erreur ?? `Erreur ${reponse.status}`, erreur?.detail);
  }
  return charge as T;
}

export const api = {
  get: <T>(chemin: string) => requete<T>(chemin),
  post: <T>(chemin: string, corps?: unknown) => requete<T>(chemin, 'POST', corps),
  patch: <T>(chemin: string, corps?: unknown) => requete<T>(chemin, 'PATCH', corps),
  delete: <T>(chemin: string) => requete<T>(chemin, 'DELETE'),
};
