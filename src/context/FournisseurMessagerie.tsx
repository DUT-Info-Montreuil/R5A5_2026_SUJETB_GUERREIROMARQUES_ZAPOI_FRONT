/**
 * La messagerie de l'utilisateur connecté : elle suit en direct toutes ses équipes
 * en lice (hors jeux en solo, où personne n'est à qui parler) et monte le tiroir
 * de messages, accessible de toutes les pages. Un visiteur, ou un administrateur
 * (qui ne joue pas), n'a ni bouton ni tiroir.
 */

import { useCallback, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';

import { TiroirMessagerie } from '../components/chat/TiroirMessagerie';
import { estSolo } from '../components/tournoi/vocabulaire';
import { useMesParticipations } from '../hooks/useMesParticipations';
import { useMessagerie } from '../hooks/useMessagerie';
import { useTournois } from '../hooks/useTournois';
import type { FiltreTournois } from '../types/api';
import { MessagerieContext } from './MessagerieContext';
import type { ValeurMessagerie } from './MessagerieContext';
import { useAuth } from './useAuth';

const SANS_FILTRE: FiltreTournois = {};

export function FournisseurMessagerie({ children }: { children: ReactNode }) {
    const { utilisateur } = useAuth();
    const joueur = utilisateur !== null && !utilisateur.estAdministrateur;
    const { equipes, recharger } = useMesParticipations(joueur);
    const { tournois } = useTournois(SANS_FILTRE);
    const { pathname } = useLocation();
    const [ouvert, setOuvert] = useState(false);
    const [selection, setSelection] = useState<number | null>(null);

    // Créer une équipe, en être exclu, voir son tournoi se terminer : la liste se relit à chaque changement de page.
    useEffect(() => {
        if (joueur) recharger();
    }, [pathname, joueur, recharger]);

    // Les équipes qui ont un chat : en lice, dans un tournoi qui n'est pas fini, dans un jeu qui se joue à plusieurs.
    const equipesDeChat = useMemo(() => equipes.filter((e) => {
        if (e.statutEquipe !== 'EN_LICE' || e.statutTournoi === 'TERMINE') return false;
        const tournoi = tournois.find((t) => t.idTournoi === e.idTournoi);
        return tournoi !== undefined && !estSolo(tournoi.jeu.joueursParEquipe);
    }), [equipes, tournois]);

    const messagerie = useMessagerie(equipesDeChat.map((e) => e.idEquipe), joueur ? utilisateur.idUtilisateur : null);

    // Une équipe dont l'accès vient d'être retiré (éliminée, exclue…) quitte le tiroir.
    const equipesOuvertes = equipesDeChat.filter((e) => messagerie.etat(e.idEquipe).fin === null);

    const ouvrir = useCallback((idEquipe?: number) => {
        if (idEquipe !== undefined) setSelection(idEquipe);
        setOuvert(true);
    }, []);

    const valeur: ValeurMessagerie = useMemo(() => ({
        ouvrir,
        nonLus: messagerie.nonLus,
        aUnChat: (idEquipe) => equipesOuvertes.some((e) => e.idEquipe === idEquipe),
    }), [ouvrir, messagerie.nonLus, equipesOuvertes]);

    return (
        <MessagerieContext.Provider value={valeur}>
            {children}
            {joueur && equipesOuvertes.length > 0 && (
                <TiroirMessagerie
                    equipes={equipesOuvertes}
                    moiId={utilisateur.idUtilisateur}
                    messagerie={messagerie}
                    ouvert={ouvert}
                    selection={selection}
                    onSelection={setSelection}
                    onOuvrir={() => setOuvert(true)}
                    onFermer={() => setOuvert(false)}
                />
            )}
        </MessagerieContext.Provider>
    );
}
