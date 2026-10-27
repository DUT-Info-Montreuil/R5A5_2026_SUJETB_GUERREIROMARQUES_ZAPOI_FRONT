/**
 * La messagerie de toutes les équipes de l'utilisateur, tenue à jour en temps réel.
 *
 * Même motif que useChatEquipe (snapshot HTTP puis événements, relecture après
 * une coupure, dédoublonnage par identifiant, fermeture immédiate sur
 * `equipe:acces-revoque`), mais pour plusieurs équipes à la fois : c'est ce qui
 * permet de dire « 3 messages non lus » sans avoir ouvert aucun chat. Une seule
 * série d'écouteurs sur l'unique connexion de api/socket.ts.
 *
 * « Non lu » : un message d'un autre, plus récent que le dernier vu dans cette
 * équipe. Le dernier vu est gardé dans le navigateur (par utilisateur), pour que
 * l'indicateur survive à un rechargement ; à la toute première lecture, l'historique
 * déjà présent compte comme lu.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { ErreurHttp } from '../api/client';
import { envoyerMessage, messagesDeLEquipe } from '../api/messages';
import { socket } from '../api/socket';
import type { AccesRevoque, Message } from '../types/api';
import type { FinDAcces } from './useChatEquipe';
import { useAction } from './useAction';

export interface EtatEquipe {
    messages: Message[];
    chargement: boolean;
    erreur: string | null;
    fin: FinDAcces | null;
}

const VIDE: EtatEquipe = { messages: [], chargement: true, erreur: null, fin: null };

function fusionner(actuels: Message[], nouveaux: Message[]): Message[] {
    const parId = new Map<number, Message>();
    for (const message of [...actuels, ...nouveaux]) parId.set(message.idMessage, message);
    return [...parId.values()].sort((a, b) => a.idMessage - b.idMessage);
}

const cleStockage = (moiId: number) => `agon-messages-lus-${moiId}`;

function lireLus(moiId: number | null): Record<number, number> {
    if (moiId === null) return {};
    try {
        const brut = window.localStorage.getItem(cleStockage(moiId));
        return brut ? (JSON.parse(brut) as Record<number, number>) : {};
    } catch {
        return {}; // stockage bloqué ou contenu illisible : tout recommence comme « lu »
    }
}

export function useMessagerie(idsEquipes: number[], moiId: number | null) {
    const [etats, setEtats] = useState<Record<number, EtatEquipe>>({});
    const [lus, setLus] = useState<Record<number, number>>(() => lireLus(moiId));
    const [connecte, setConnecte] = useState(socket.connected);
    const [relecture, setRelecture] = useState(0);
    const { executer, envoi, erreur: erreurEnvoi, effacerErreur } = useAction();
    const aEteCoupe = useRef(false);

    // Une clé stable : le tableau change d'identité à chaque rendu, pas son contenu.
    const cle = [...idsEquipes].sort((a, b) => a - b).join(',');
    const ids = useMemo(() => (cle === '' ? [] : cle.split(',').map(Number)), [cle]);

    const modifier = useCallback((idEquipe: number, changement: (etat: EtatEquipe) => EtatEquipe) => {
        setEtats((avant) => ({ ...avant, [idEquipe]: changement(avant[idEquipe] ?? VIDE) }));
    }, []);

    // Le dernier message vu est gardé tel que lu : la première lecture d'une équipe fixe la ligne de départ.
    const memoriserLus = useCallback((suite: (avant: Record<number, number>) => Record<number, number>) => {
        setLus((avant) => {
            const apres = suite(avant);
            if (moiId !== null && apres !== avant) {
                try {
                    window.localStorage.setItem(cleStockage(moiId), JSON.stringify(apres));
                } catch {
                    // stockage indisponible : l'indicateur ne survivra pas au rechargement, rien de plus
                }
            }
            return apres;
        });
    }, [moiId]);

    // Snapshot : à l'arrivée d'une équipe, puis après chaque reconnexion.
    useEffect(() => {
        let actuel = true;
        for (const idEquipe of ids) {
            messagesDeLEquipe(idEquipe)
                .then((liste) => {
                    if (!actuel) return;
                    modifier(idEquipe, (e) => ({ ...e, messages: fusionner(e.messages, liste), chargement: false, erreur: null }));
                    memoriserLus((avant) => (idEquipe in avant ? avant : { ...avant, [idEquipe]: liste.at(-1)?.idMessage ?? 0 }));
                })
                .catch((e: unknown) => {
                    if (!actuel) return;
                    if (e instanceof ErreurHttp && e.statut === 404) {
                        modifier(idEquipe, () => ({ messages: [], chargement: false, erreur: null, fin: 'refuse' }));
                        return;
                    }
                    modifier(idEquipe, (etat) => ({ ...etat, chargement: false, erreur: 'Impossible de charger les messages.' }));
                });
        }
        return () => {
            actuel = false;
        };
    }, [ids, relecture, modifier, memoriserLus]);

    // Deltas : une seule série d'écouteurs pour toutes les équipes.
    useEffect(() => {
        if (ids.length === 0) return;

        const suivreTout = () => {
            for (const idEquipe of ids) socket.emit('equipe:suivre', { idEquipe });
        };
        const surConnexion = () => {
            setConnecte(true);
            suivreTout();
            // Les événements émis pendant la coupure sont perdus : on relit tout.
            if (aEteCoupe.current) setRelecture((n) => n + 1);
        };
        const surDeconnexion = () => {
            aEteCoupe.current = true;
            setConnecte(false);
        };
        const surMessage = (message: Message) => {
            if (ids.includes(message.idEquipe)) modifier(message.idEquipe, (e) => ({ ...e, messages: fusionner(e.messages, [message]) }));
        };
        const surRevocation = (acces: AccesRevoque) => {
            if (ids.includes(acces.idEquipe)) modifier(acces.idEquipe, () => ({ messages: [], chargement: false, erreur: null, fin: acces.motif }));
        };

        socket.on('connect', surConnexion);
        socket.on('disconnect', surDeconnexion);
        socket.on('message:nouveau', surMessage);
        socket.on('equipe:acces-revoque', surRevocation);
        if (socket.connected) suivreTout();
        else socket.connect();

        return () => {
            for (const idEquipe of ids) socket.emit('equipe:quitter', { idEquipe });
            socket.off('connect', surConnexion);
            socket.off('disconnect', surDeconnexion);
            socket.off('message:nouveau', surMessage);
            socket.off('equipe:acces-revoque', surRevocation);
        };
    }, [ids, modifier]);

    const nonLus = useCallback((idEquipe: number): number => {
        const etat = etats[idEquipe];
        if (!etat || etat.fin !== null) return 0;
        const dernierVu = lus[idEquipe] ?? Number.MAX_SAFE_INTEGER;
        return etat.messages.filter((m) => m.idMessage > dernierVu && m.idAuteur !== moiId).length;
    }, [etats, lus, moiId]);

    /** L'utilisateur a vu tout ce qui est arrivé dans cette équipe. */
    const marquerLu = useCallback((idEquipe: number) => {
        const dernier = etats[idEquipe]?.messages.at(-1)?.idMessage;
        if (dernier === undefined) return;
        memoriserLus((avant) => ((avant[idEquipe] ?? 0) >= dernier ? avant : { ...avant, [idEquipe]: dernier }));
    }, [etats, memoriserLus]);

    /** Vrai si le message est parti : le champ de saisie peut alors se vider. */
    const envoyer = useCallback(async (idEquipe: number, contenu: string): Promise<boolean> => {
        const message = await executer(() => envoyerMessage(idEquipe, contenu));
        if (message === null) return false;
        modifier(idEquipe, (e) => ({ ...e, messages: fusionner(e.messages, [message]) }));
        return true;
    }, [executer, modifier]);

    return {
        etat: (idEquipe: number): EtatEquipe => etats[idEquipe] ?? VIDE,
        nonLus,
        totalNonLus: ids.reduce((somme, id) => somme + nonLus(id), 0),
        marquerLu,
        envoyer,
        connecte,
        envoi,
        erreurEnvoi,
        effacerErreurEnvoi: effacerErreur,
    };
}
