/**
 * L'espace d'échange d'une équipe (B-16 à B-18), tenu à jour en temps réel.
 *
 * Motif « snapshot puis deltas » : la liste est lue par HTTP, puis complétée
 * par les événements `message:nouveau`. Les événements émis pendant une
 * coupure sont perdus : à chaque reconnexion, on relit donc la liste. Un
 * message n'est jamais affiché deux fois (il peut arriver par la réponse du
 * POST, par l'événement, et par la relecture) : on fusionne par identifiant.
 *
 * Les écritures restent en HTTP (POST) ; le socket ne sert qu'à recevoir.
 * Passe par l'unique connexion de api/socket.ts. Le salon est rejoint à
 * nouveau à chaque connexion : le serveur oublie les salons d'un socket perdu.
 *
 * `equipe:acces-revoque` ferme tout, tout de suite : l'utilisateur ne doit pas
 * garder un chat ouvert après une exclusion, une élimination ou une
 * disqualification (B-17, B-18).
 */

import { useEffect, useRef, useState } from 'react';

import { ErreurHttp } from '../api/client';
import { envoyerMessage, messagesDeLEquipe } from '../api/messages';
import { socket } from '../api/socket';
import type { AccesRevoque, Message, MotifAccesRevoque } from '../types/api';
import { useAction } from './useAction';

/** Pourquoi l'espace n'est plus accessible : un motif du serveur, ou « refuse » (404 à la lecture). */
export type FinDAcces = MotifAccesRevoque | 'refuse';

/** Fusionne par identifiant, du plus ancien au plus récent : jamais de doublon, jamais de perte. */
function fusionner(actuels: Message[], nouveaux: Message[]): Message[] {
    const parId = new Map<number, Message>();
    for (const message of [...actuels, ...nouveaux]) parId.set(message.idMessage, message);
    return [...parId.values()].sort((a, b) => a.idMessage - b.idMessage);
}

interface Options {
    /** Faux : rien n'est chargé ni écouté (visiteur, espace fermé). */
    actif: boolean;
    /** Appelé quand l'accès est retiré (événement du serveur, ou 404 à la lecture) : la page relit l'équipe. */
    surFinDAcces?: (fin: FinDAcces) => void;
}

export function useChatEquipe(idEquipe: number, { actif, surFinDAcces }: Options) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [chargement, setChargement] = useState(true);
    const [erreurChargement, setErreurChargement] = useState<string | null>(null);
    const [connecte, setConnecte] = useState(socket.connected);
    const [finDAcces, setFinDAcces] = useState<FinDAcces | null>(null);
    const [relecture, setRelecture] = useState(0);
    const { executer, envoi, erreur: erreurEnvoi, effacerErreur } = useAction();

    // Le dernier rappel, sans se réabonner à chaque rendu.
    const dernierRappel = useRef(surFinDAcces);
    useEffect(() => {
        dernierRappel.current = surFinDAcces;
    });
    // Vrai dès qu'une coupure a eu lieu : seule une RE-connexion impose de relire les messages.
    const aEteCoupe = useRef(false);

    const ouvert = actif && finDAcces === null;

    // Snapshot : lecture initiale, puis après chaque reconnexion.
    useEffect(() => {
        if (!ouvert) return;
        let actuel = true;
        messagesDeLEquipe(idEquipe)
            .then((liste) => {
                if (!actuel) return;
                setMessages((deja) => fusionner(deja, liste));
                setErreurChargement(null);
                setChargement(false);
            })
            .catch((e: unknown) => {
                if (!actuel) return;
                if (e instanceof ErreurHttp && e.statut === 404) {
                    // L'accès a disparu pendant une coupure : même effet qu'un événement de révocation.
                    setMessages([]);
                    setFinDAcces('refuse');
                    dernierRappel.current?.('refuse');
                    return;
                }
                setErreurChargement(e instanceof ErreurHttp ? e.message : 'Impossible de charger les messages.');
                setChargement(false);
            });
        return () => {
            actuel = false;
        };
    }, [idEquipe, ouvert, relecture]);

    // Deltas : abonnement au salon de l'équipe.
    useEffect(() => {
        if (!ouvert) return;

        const suivre = () => {
            socket.emit('equipe:suivre', { idEquipe }, (reponse: { ok: boolean }) => {
                if (!reponse.ok) setErreurChargement("Le direct n'a pas pu s'ouvrir : les nouveaux messages n'apparaîtront pas tout seuls.");
            });
        };
        const surConnexion = () => {
            setConnecte(true);
            suivre();
            // Les événements émis pendant la coupure sont perdus : on relit tout.
            if (aEteCoupe.current) setRelecture((n) => n + 1);
        };
        const surDeconnexion = () => {
            aEteCoupe.current = true;
            setConnecte(false);
        };
        const surMessage = (message: Message) => {
            if (message.idEquipe === idEquipe) setMessages((deja) => fusionner(deja, [message]));
        };
        const surRevocation = (acces: AccesRevoque) => {
            if (acces.idEquipe !== idEquipe) return;
            setMessages([]);
            setFinDAcces(acces.motif);
            dernierRappel.current?.(acces.motif);
        };

        socket.on('connect', surConnexion);
        socket.on('disconnect', surDeconnexion);
        socket.on('message:nouveau', surMessage);
        socket.on('equipe:acces-revoque', surRevocation);
        // Déjà connecté : `connecte` vaut vrai dès l'état initial. Sinon, l'événement `connect` s'en chargera.
        if (socket.connected) suivre();
        else socket.connect();

        return () => {
            socket.emit('equipe:quitter', { idEquipe });
            socket.off('connect', surConnexion);
            socket.off('disconnect', surDeconnexion);
            socket.off('message:nouveau', surMessage);
            socket.off('equipe:acces-revoque', surRevocation);
        };
    }, [idEquipe, ouvert]);

    /** Vrai si le message est parti : le champ de saisie peut alors se vider. */
    async function envoyer(contenu: string): Promise<boolean> {
        const message = await executer(() => envoyerMessage(idEquipe, contenu));
        if (message === null) return false;
        setMessages((deja) => fusionner(deja, [message]));
        return true;
    }

    return {
        messages,
        chargement: ouvert && chargement,
        erreurChargement,
        connecte,
        finDAcces,
        envoyer,
        envoi,
        erreurEnvoi,
        effacerErreurEnvoi: effacerErreur,
    };
}
