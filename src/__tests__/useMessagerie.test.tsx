/**
 * Messagerie : les messages arrivés pendant l'absence de l'utilisateur restent « non lus »
 * après un rechargement de la page.
 *
 * Au rechargement, la session est restaurée par l'API APRÈS le premier affichage : le hook
 * reçoit d'abord un identifiant nul, puis l'identifiant réel. Ce qui avait été vu doit alors
 * être relu dans le navigateur, avant que la première lecture des messages ne fixe une
 * ligne de départ — sinon elle écrase la mémoire et tout devient « lu ».
 */

import { renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useMessagerie } from '../hooks/useMessagerie';
import type { Message } from '../types/api';

const doublures = vi.hoisted(() => ({
    socket: { connected: true, on: vi.fn(), off: vi.fn(), emit: vi.fn(), connect: vi.fn() },
    messagesDeLEquipe: vi.fn(),
    envoyerMessage: vi.fn(),
}));

vi.mock('../api/socket', () => ({ socket: doublures.socket }));
vi.mock('../api/messages', () => ({
    messagesDeLEquipe: doublures.messagesDeLEquipe,
    envoyerMessage: doublures.envoyerMessage,
}));

const ID_EQUIPE = 20;
const MOI = 17;
const CLE = `agon-messages-lus-${MOI}`;

const message = (idMessage: number, idAuteur = 99): Message => ({
    idMessage, idEquipe: ID_EQUIPE, idAuteur, pseudo: 'camarade', contenu: `message ${idMessage}`, envoyeLe: '2026-10-31T10:00:00Z',
});

describe('useMessagerie', () => {
    beforeEach(() => {
        window.localStorage.clear();
        doublures.messagesDeLEquipe.mockReset();
    });

    it("garde « non lu » un message arrivé pendant l'absence, après un rechargement", async () => {
        // L'utilisateur avait vu jusqu'au message 4 ; le 5 est arrivé quand il n'était pas là.
        window.localStorage.setItem(CLE, JSON.stringify({ [ID_EQUIPE]: 4 }));
        doublures.messagesDeLEquipe.mockResolvedValue([message(3), message(4), message(5)]);

        // Premier rendu : la session n'est pas encore restaurée (identifiant nul, aucune équipe).
        const rendu = renderHook(({ ids, moi }) => useMessagerie(ids, moi), {
            initialProps: { ids: [] as number[], moi: null as number | null },
        });
        // Puis l'API répond : on connaît l'utilisateur et ses équipes.
        rendu.rerender({ ids: [ID_EQUIPE], moi: MOI });

        await waitFor(() => expect(rendu.result.current.etat(ID_EQUIPE).chargement).toBe(false));
        expect(rendu.result.current.nonLus(ID_EQUIPE)).toBe(1);
        expect(JSON.parse(window.localStorage.getItem(CLE) ?? '{}')[ID_EQUIPE]).toBe(4);
    });

    it("n'affiche aucun badge la toute première fois (aucun historique de lecture)", async () => {
        doublures.messagesDeLEquipe.mockResolvedValue([message(1), message(2)]);

        const rendu = renderHook(() => useMessagerie([ID_EQUIPE], MOI));

        await waitFor(() => expect(rendu.result.current.etat(ID_EQUIPE).chargement).toBe(false));
        expect(rendu.result.current.nonLus(ID_EQUIPE)).toBe(0);
    });
});
