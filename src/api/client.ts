/**
 * Client HTTP unique de l'application.
 *
 * RÈGLE : aucun `fetch` ailleurs dans le code, tout passe par ici.
 *
 * Le jeton de session est un cookie HttpOnly posé par l'API : ce fichier ne le
 * voit jamais. `credentials: 'include'` demande au navigateur de le joindre.
 */

import type { ErreurApi } from '../types/api.ts';

/**
 * Adresse de l'API. Vide : la même adresse que la page, comme dans l'image Docker de production,
 * où nginx sert l'interface ET transmet /api et /socket.io au back.
 */
export const URL_API: string = import.meta.env.VITE_API_URL ?? 'http://localhost:5000';

const ORIGINE_DE_L_API: string = URL_API || window.location.origin;

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

// Prévenu à chaque 401 : la session a expiré ou a été révoquée. Le contexte
// d'authentification s'y inscrit au démarrage ; ce fichier ne connaît pas React.
let surSessionPerdue: () => void = () => {};

export function definirGestionSessionPerdue(rappel: () => void): void {
    surSessionPerdue = rappel;
}

type Methode = 'GET' | 'POST' | 'PATCH' | 'DELETE';
type Parametres = Record<string, string | undefined>;

function construireUrl(chemin: string, parametres?: Parametres): string {
    const url = new URL(chemin, ORIGINE_DE_L_API);
    for (const [cle, valeur] of Object.entries(parametres ?? {})) {
        if (valeur) url.searchParams.set(cle, valeur);
    }
    return url.toString();
}

async function requete<T>(methode: Methode, chemin: string, corps?: unknown, parametres?: Parametres): Promise<T> {
    // `let` : déclarée avant le try, affectée dedans, utilisée après.
    let reponse: Response;
    try {
        reponse = await fetch(construireUrl(chemin, parametres), {
            method: methode,
            credentials: 'include',
            headers: corps === undefined ? undefined : { 'Content-Type': 'application/json' },
            body: corps === undefined ? undefined : JSON.stringify(corps),
        });
    } catch {
        throw new ErreurHttp(0, "L'API est injoignable. Le serveur back est-il démarré ?");
    }

    if (reponse.status === 401) surSessionPerdue();
    if (reponse.status === 204) return undefined as T;

    const texte = await reponse.text();
    const charge: unknown = texte ? JSON.parse(texte) : null;

    if (!reponse.ok) {
        const erreur = charge as ErreurApi | null;
        const message = typeof erreur?.detail === 'string' ? erreur.detail : (erreur?.erreur ?? `Erreur ${reponse.status}`);
        throw new ErreurHttp(reponse.status, message, erreur?.detail);
    }
    return charge as T;
}

export const api = {
    get: <T>(chemin: string, parametres?: Parametres) => requete<T>('GET', chemin, undefined, parametres),
    post: <T>(chemin: string, corps?: unknown) => requete<T>('POST', chemin, corps),
    patch: <T>(chemin: string, corps?: unknown) => requete<T>('PATCH', chemin, corps),
    delete: <T>(chemin: string) => requete<T>('DELETE', chemin),
};
