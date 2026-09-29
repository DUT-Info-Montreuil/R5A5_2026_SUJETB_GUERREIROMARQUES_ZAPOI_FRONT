/**
 * Tout ce qu'affiche la page d'un tournoi : le tournoi, ses équipes, son arbre,
 * tenus à jour en temps réel.
 *
 * Même principe que useTournois : le chargement se déduit du fait que les
 * données affichées ne correspondent pas encore à la dernière demande. Pendant
 * un rechargement, les anciennes données restent à l'écran.
 */

import { useCallback, useEffect, useState } from 'react';

import { ErreurHttp } from '../api/client';
import { arbreDuTournoi, detailTournoi, equipesDuTournoi } from '../api/tournois';
import type { EquipeDuTournoi, Rencontre, Tournoi } from '../types/api';
import { useSuiviTournoi } from './useSuiviTournoi';

interface Donnees {
    cle: string;
    tournoi: Tournoi | null;
    equipes: EquipeDuTournoi[];
    arbre: Rencontre[];
    erreur: string | null;
    introuvable: boolean;
}

export function useTournoi(idTournoi: number) {
    const [tentative, setTentative] = useState(0);
    const [donnees, setDonnees] = useState<Donnees | null>(null);
    const cle = `${idTournoi}-${tentative}`;

    useEffect(() => {
        let actuelle = true;
        Promise.all([detailTournoi(idTournoi), equipesDuTournoi(idTournoi), arbreDuTournoi(idTournoi)])
            .then(([tournoi, equipes, arbre]) => {
                if (actuelle) setDonnees({ cle, tournoi, equipes, arbre, erreur: null, introuvable: false });
            })
            .catch((e: unknown) => {
                if (!actuelle) return;
                const introuvable = e instanceof ErreurHttp && e.statut === 404;
                const erreur = e instanceof ErreurHttp ? e.message : 'Impossible de charger le tournoi.';
                setDonnees({ cle, tournoi: null, equipes: [], arbre: [], erreur, introuvable });
            });
        return () => {
            actuelle = false;
        };
    }, [cle, idTournoi]);

    const recharger = useCallback(() => setTentative((n) => n + 1), []);

    useSuiviTournoi(idTournoi, {
        // Une transition a pu générer l'arbre ou déclarer des forfaits : on relit tout.
        surTournoi: recharger,
        surRencontre: (rencontre) => {
            setDonnees((d) => d && {
                ...d,
                arbre: d.arbre.map((r) => (r.idRencontre === rencontre.idRencontre ? rencontre : r)),
            });
            // Le perdant vient d'être éliminé : seul le statut des équipes a changé.
            equipesDuTournoi(idTournoi)
                .then((equipes) => setDonnees((d) => d && { ...d, equipes }))
                .catch(() => undefined);
        },
    });

    return {
        tournoi: donnees?.tournoi ?? null,
        equipes: donnees?.equipes ?? [],
        arbre: donnees?.arbre ?? [],
        erreur: donnees?.cle === cle ? donnees.erreur : null,
        introuvable: donnees?.cle === cle && donnees.introuvable,
        chargement: donnees?.cle !== cle,
        recharger,
    };
}
