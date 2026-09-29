/**
 * Abonnement temps réel au salon d'un tournoi (contrat §7, B-19).
 *
 * Passe par l'unique connexion de api/socket.ts. Le salon est rejoint à nouveau
 * après chaque reconnexion : le serveur oublie les salons d'un socket perdu.
 */

import { useEffect, useRef } from 'react';

import { socket } from '../api/socket';
import type { Rencontre, Tournoi } from '../types/api';

interface Rappels {
    surTournoi: (tournoi: Tournoi) => void;
    surRencontre: (rencontre: Rencontre) => void;
}

export function useSuiviTournoi(idTournoi: number, rappels: Rappels) {
    // Les rappels changent à chaque rendu : on garde le dernier sans se réabonner.
    const derniers = useRef(rappels);
    useEffect(() => {
        derniers.current = rappels;
    });

    useEffect(() => {
        const suivre = () => socket.emit('tournoi:suivre', { idTournoi });
        const tournoiMaj = (tournoi: Tournoi) => {
            if (tournoi.idTournoi === idTournoi) derniers.current.surTournoi(tournoi);
        };
        const rencontreMaj = (rencontre: Rencontre) => derniers.current.surRencontre(rencontre);

        socket.on('connect', suivre);
        socket.on('tournoi:maj', tournoiMaj);
        socket.on('rencontre:maj', rencontreMaj);
        if (socket.connected) suivre();
        else socket.connect();

        return () => {
            socket.emit('tournoi:quitter', { idTournoi });
            socket.off('connect', suivre);
            socket.off('tournoi:maj', tournoiMaj);
            socket.off('rencontre:maj', rencontreMaj);
        };
    }, [idTournoi]);
}
