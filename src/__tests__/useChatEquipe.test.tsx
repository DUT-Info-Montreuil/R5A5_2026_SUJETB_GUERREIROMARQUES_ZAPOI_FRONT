/**
 * Espace d'échange côté interface (B-16 à B-18) : un message n'apparaît
 * jamais deux fois, et une perte d'accès vide l'écran tout de suite.
 *
 * Le socket et les routes de messages sont remplacés par des doublures : on
 * teste la réaction du hook aux événements du contrat (§7), pas le réseau.
 */

import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useChatEquipe } from '../hooks/useChatEquipe';
import type { Message } from '../types/api';

const doublures = vi.hoisted(() => {
    type Rappel = (...args: unknown[]) => void;
    const abonnes = new Map<string, Set<Rappel>>();
    const socket = {
        connected: true,
        on: (evenement: string, rappel: Rappel) => {
            if (!abonnes.has(evenement)) abonnes.set(evenement, new Set());
            abonnes.get(evenement)!.add(rappel);
        },
        off: (evenement: string, rappel: Rappel) => {
            abonnes.get(evenement)?.delete(rappel);
        },
        // Le serveur accepte l'abonnement : l'accusé de réception répond { ok: true }.
        emit: vi.fn((_evenement: string, _charge: unknown, accuse?: (r: { ok: boolean }) => void) => {
            accuse?.({ ok: true });
        }),
        connect: vi.fn(),
    };
    /** Simule un événement poussé par le serveur. */
    const recevoir = (evenement: string, charge?: unknown) => {
        for (const rappel of abonnes.get(evenement) ?? []) rappel(charge);
    };
    return { socket, recevoir, abonnes, messagesDeLEquipe: vi.fn(), envoyerMessage: vi.fn() };
});

vi.mock('../api/socket', () => ({ socket: doublures.socket }));
vi.mock('../api/messages', () => ({
    messagesDeLEquipe: doublures.messagesDeLEquipe,
    envoyerMessage: doublures.envoyerMessage,
}));

const ID_EQUIPE = 4;

function message(idMessage: number, contenu = `message ${idMessage}`, idEquipe = ID_EQUIPE): Message {
    return { idMessage, idEquipe, idAuteur: 1, pseudo: 'alice', contenu, envoyeLe: '2026-10-27T20:00:00Z' };
}

/** Monte le hook et attend la fin de la lecture initiale. */
async function ouvrirChat(surFinDAcces = vi.fn()) {
    const rendu = renderHook(() => useChatEquipe(ID_EQUIPE, { actif: true, surFinDAcces }));
    await waitFor(() => expect(rendu.result.current.chargement).toBe(false));
    return { ...rendu, surFinDAcces };
}

describe('useChatEquipe', () => {
    beforeEach(() => {
        doublures.abonnes.clear();
        doublures.socket.emit.mockClear();
        doublures.messagesDeLEquipe.mockReset().mockResolvedValue([message(1), message(2)]);
        doublures.envoyerMessage.mockReset();
    });

    it("charge l'historique puis rejoint le salon de l'équipe", async () => {
        const { result } = await ouvrirChat();

        expect(result.current.messages.map((m) => m.idMessage)).toEqual([1, 2]);
        expect(doublures.socket.emit).toHaveBeenCalledWith('equipe:suivre', { idEquipe: ID_EQUIPE }, expect.any(Function));
    });

    it("ajoute un message reçu en direct, mais pas celui d'une autre équipe", async () => {
        const { result } = await ouvrirChat();

        act(() => {
            doublures.recevoir('message:nouveau', message(3));
            doublures.recevoir('message:nouveau', message(50, 'ailleurs', 99));
        });

        expect(result.current.messages.map((m) => m.idMessage)).toEqual([1, 2, 3]);
    });

    it("n'affiche jamais deux fois un message reçu par le POST puis par le socket", async () => {
        doublures.envoyerMessage.mockResolvedValue(message(3, 'gg'));
        const { result } = await ouvrirChat();

        await act(async () => {
            await result.current.envoyer('gg');
        });
        act(() => doublures.recevoir('message:nouveau', message(3, 'gg')));

        expect(result.current.messages.filter((m) => m.idMessage === 3)).toHaveLength(1);
    });

    it("vide l'écran et prévient la page dès que l'accès est révoqué (B-17)", async () => {
        const { result, surFinDAcces } = await ouvrirChat();

        act(() => doublures.recevoir('equipe:acces-revoque', { idEquipe: ID_EQUIPE, motif: 'exclusion' }));

        expect(result.current.messages).toEqual([]);
        expect(result.current.finDAcces).toBe('exclusion');
        expect(surFinDAcces).toHaveBeenCalledWith('exclusion');
    });

    it("cesse d'écouter le salon après une révocation", async () => {
        const { result } = await ouvrirChat();

        act(() => doublures.recevoir('equipe:acces-revoque', { idEquipe: ID_EQUIPE, motif: 'disqualification' }));
        act(() => doublures.recevoir('message:nouveau', message(9)));

        expect(result.current.messages).toEqual([]);
        expect(doublures.socket.emit).toHaveBeenCalledWith('equipe:quitter', { idEquipe: ID_EQUIPE });
    });

    it("ignore la révocation d'une autre équipe", async () => {
        const { result, surFinDAcces } = await ouvrirChat();

        act(() => doublures.recevoir('equipe:acces-revoque', { idEquipe: 99, motif: 'exclusion' }));

        expect(result.current.messages).toHaveLength(2);
        expect(surFinDAcces).not.toHaveBeenCalled();
    });

    it("traite un 404 à la lecture comme une perte d'accès (B-18)", async () => {
        const { ErreurHttp } = await import('../api/client');
        doublures.messagesDeLEquipe.mockRejectedValue(new ErreurHttp(404, 'Équipe introuvable.'));
        const surFinDAcces = vi.fn();

        const { result } = renderHook(() => useChatEquipe(ID_EQUIPE, { actif: true, surFinDAcces }));

        await waitFor(() => expect(result.current.finDAcces).toBe('refuse'));
        expect(surFinDAcces).toHaveBeenCalledWith('refuse');
    });

    it('relit tout après une reconnexion : les événements de la coupure sont perdus', async () => {
        await ouvrirChat();
        expect(doublures.messagesDeLEquipe).toHaveBeenCalledTimes(1);

        act(() => doublures.recevoir('disconnect'));
        act(() => doublures.recevoir('connect'));

        await waitFor(() => expect(doublures.messagesDeLEquipe).toHaveBeenCalledTimes(2));
    });

    it('ne charge ni n\'écoute rien quand le chat est inactif', () => {
        renderHook(() => useChatEquipe(ID_EQUIPE, { actif: false }));

        expect(doublures.messagesDeLEquipe).not.toHaveBeenCalled();
        expect(doublures.socket.emit).not.toHaveBeenCalled();
    });
});
