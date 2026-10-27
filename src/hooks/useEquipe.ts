/**
 * Tout ce qu'affiche la page d'une équipe : l'équipe, ses membres, et son
 * tournoi (jeu, étape). Même principe que useTournoi : pendant un
 * rechargement, les anciennes données restent à l'écran.
 */

import { useCallback, useEffect, useState } from 'react';

import { ErreurHttp } from '../api/client';
import { detailEquipe } from '../api/equipes';
import { detailTournoi } from '../api/tournois';
import type { Equipe, Tournoi } from '../types/api';
import { useRechargeAuRetour } from './useRechargeAuRetour';

interface Donnees {
    cle: string;
    equipe: Equipe | null;
    tournoi: Tournoi | null;
    erreur: string | null;
    introuvable: boolean;
}

export function useEquipe(idEquipe: number) {
    const [tentative, setTentative] = useState(0);
    const [donnees, setDonnees] = useState<Donnees | null>(null);
    const cle = `${idEquipe}-${tentative}`;

    useEffect(() => {
        let actuelle = true;
        detailEquipe(idEquipe)
            .then(async (equipe) => ({ equipe, tournoi: await detailTournoi(equipe.idTournoi) }))
            .then(({ equipe, tournoi }) => {
                if (actuelle) setDonnees({ cle, equipe, tournoi, erreur: null, introuvable: false });
            })
            .catch((e: unknown) => {
                if (!actuelle) return;
                const introuvable = e instanceof ErreurHttp && e.statut === 404;
                const erreur = e instanceof ErreurHttp ? e.message : "Impossible de charger l'équipe.";
                setDonnees({ cle, equipe: null, tournoi: null, erreur, introuvable });
            });
        return () => {
            actuelle = false;
        };
    }, [cle, idEquipe]);

    const recharger = useCallback(() => setTentative((n) => n + 1), []);
    useRechargeAuRetour(recharger);

    return {
        equipe: donnees?.equipe ?? null,
        tournoi: donnees?.tournoi ?? null,
        erreur: donnees?.cle === cle ? donnees.erreur : null,
        introuvable: donnees?.cle === cle && donnees.introuvable,
        chargement: donnees?.cle !== cle,
        recharger,
    };
}
