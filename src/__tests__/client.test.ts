/**
 * Client HTTP unique (api/client.ts) : c'est lui qui joint le cookie de session
 * et qui traduit les erreurs du contrat (§1.1) pour toute l'application.
 */

import { beforeEach, describe, expect, it, vi } from 'vitest';

import { api, definirGestionSessionPerdue, ErreurHttp } from '../api/client';

function reponse(statut: number, corps?: unknown): Response {
    return new Response(corps === undefined ? null : JSON.stringify(corps), {
        status: statut,
        headers: { 'Content-Type': 'application/json' },
    });
}

/** Remplace `fetch` et renvoie l'espion, pour inspecter la requête envoyée. */
function simulerFetch(...reponses: Response[]) {
    const espion = vi.fn<typeof fetch>();
    for (const r of reponses) espion.mockResolvedValueOnce(r);
    vi.stubGlobal('fetch', espion);
    return espion;
}

/** L'erreur levée par la promesse, pour en vérifier le code et le message. */
async function erreurDe(promesse: Promise<unknown>): Promise<ErreurHttp> {
    try {
        await promesse;
    } catch (e) {
        if (e instanceof ErreurHttp) return e;
        throw e;
    }
    throw new Error("La requête aurait dû échouer.");
}

describe('client HTTP', () => {
    beforeEach(() => {
        definirGestionSessionPerdue(() => {});
    });

    it('joint le cookie de session à chaque requête', async () => {
        const espion = simulerFetch(reponse(200, []));

        await api.get('/api/tournois');

        expect(espion).toHaveBeenCalledOnce();
        expect(espion.mock.calls[0][1]?.credentials).toBe('include');
    });

    it('envoie le corps en JSON et ignore les paramètres vides', async () => {
        const espion = simulerFetch(reponse(201, { idMessage: 1 }), reponse(200, []));

        await api.post('/api/equipes/4/messages', { contenu: 'Salut' });
        await api.get('/api/tournois', { recherche: 'coupe', statut: undefined });

        const [, options] = espion.mock.calls[0];
        expect(options?.method).toBe('POST');
        expect(options?.body).toBe(JSON.stringify({ contenu: 'Salut' }));
        expect(new Headers(options?.headers).get('Content-Type')).toBe('application/json');
        expect(String(espion.mock.calls[1][0])).toMatch(/\?recherche=coupe$/);
    });

    it('prévient la session perdue à chaque 401', async () => {
        const sessionPerdue = vi.fn();
        definirGestionSessionPerdue(sessionPerdue);
        simulerFetch(reponse(401, { erreur: 'Unauthorized', detail: 'Session expirée. Reconnectez-vous.' }));

        const erreur = await erreurDe(api.get('/api/auth/moi'));

        expect(sessionPerdue).toHaveBeenCalledOnce();
        expect(erreur.statut).toBe(401);
    });

    it('ne prévient pas la session perdue sur un 403 ou un 404', async () => {
        const sessionPerdue = vi.fn();
        definirGestionSessionPerdue(sessionPerdue);
        simulerFetch(
            reponse(403, { erreur: 'Forbidden', detail: 'Action réservée aux administrateurs.' }),
            reponse(404, { erreur: 'Not Found', detail: 'Équipe introuvable.' }),
        );

        await erreurDe(api.patch('/api/tournois/1', { nomTournoi: 'x' }));
        await erreurDe(api.get('/api/equipes/9/messages'));

        expect(sessionPerdue).not.toHaveBeenCalled();
    });

    it("reprend le message d'erreur de l'API (contrat §1.1)", async () => {
        simulerFetch(reponse(409, { erreur: 'Conflict', detail: 'Les inscriptions sont closes.' }));

        const erreur = await erreurDe(api.post('/api/tournois/1/equipes', {}));

        expect(erreur.statut).toBe(409);
        expect(erreur.message).toBe('Les inscriptions sont closes.');
    });

    it('garde le détail par champ quand le corps est invalide (400)', async () => {
        const detail = { champs: [{ champ: 'contenu', message: 'Field required' }] };
        simulerFetch(reponse(400, { erreur: 'Bad Request', detail }));

        const erreur = await erreurDe(api.post('/api/equipes/4/messages', {}));

        expect(erreur.message).toBe('Bad Request');
        expect(erreur.detail).toEqual(detail);
    });

    it('signale une API injoignable par un statut 0', async () => {
        vi.stubGlobal('fetch', vi.fn<typeof fetch>().mockRejectedValue(new TypeError('Failed to fetch')));

        const erreur = await erreurDe(api.get('/health'));

        expect(erreur.statut).toBe(0);
    });

    it('renvoie undefined pour un 204', async () => {
        simulerFetch(reponse(204));

        await expect(api.delete('/api/equipes/4/membres/7')).resolves.toBeUndefined();
    });
});
