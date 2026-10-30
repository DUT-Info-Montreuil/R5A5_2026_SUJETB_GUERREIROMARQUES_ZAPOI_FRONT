/**
 * La page /diagnostic dit POURQUOI le temps réel ne répond pas : l'erreur de
 * connexion du socket remonte jusqu'à l'écran, et disparaît à la connexion.
 *
 * Le socket et l'appel à l'API de santé sont remplacés par des doublures.
 */

import { act, renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useEtatChaine } from '../hooks/useEtatChaine';

const doublures = vi.hoisted(() => {
    type Rappel = (...args: unknown[]) => void;
    const abonnes = new Map<string, Set<Rappel>>();
    const socket = {
        connected: false,
        on: (evenement: string, rappel: Rappel) => {
            if (!abonnes.has(evenement)) abonnes.set(evenement, new Set());
            abonnes.get(evenement)!.add(rappel);
        },
        off: (evenement: string, rappel: Rappel) => {
            abonnes.get(evenement)?.delete(rappel);
        },
        connect: vi.fn(),
        disconnect: vi.fn(),
        io: { engine: { transport: { name: 'polling' }, once: vi.fn() } },
    };
    const recevoir = (evenement: string, charge?: unknown) => {
        for (const rappel of abonnes.get(evenement) ?? []) rappel(charge);
    };
    return { socket, recevoir };
});

vi.mock('../api/socket', () => ({ socket: doublures.socket }));
vi.mock('../api/sante', () => ({
    etatSante: vi.fn().mockResolvedValue({ baseDeDonnees: { joignable: true, schemaComplet: true, tables: 9 } }),
}));

describe('useEtatChaine', () => {
    it("expose l'erreur du socket tant que le temps réel ne répond pas", async () => {
        const { result } = renderHook(() => useEtatChaine());
        await waitFor(() => expect(result.current.chargement).toBe(false));

        act(() => doublures.recevoir('connect_error', new Error('websocket error')));

        expect(result.current.tempsReel).toBe(false);
        expect(result.current.erreurTempsReel).toBe('websocket error');
    });

    it("efface l'erreur et donne le transport une fois connecté", async () => {
        const { result } = renderHook(() => useEtatChaine());
        await waitFor(() => expect(result.current.chargement).toBe(false));
        act(() => doublures.recevoir('connect_error', new Error('xhr poll error')));

        act(() => doublures.recevoir('connect'));

        expect(result.current.tempsReel).toBe(true);
        expect(result.current.erreurTempsReel).toBeNull();
        expect(result.current.transport).toBe('polling');
    });

    it("indique l'adresse tentée par le navigateur", async () => {
        const { result } = renderHook(() => useEtatChaine());
        await waitFor(() => expect(result.current.chargement).toBe(false));

        expect(result.current.adresse).not.toBe('');
    });
});
