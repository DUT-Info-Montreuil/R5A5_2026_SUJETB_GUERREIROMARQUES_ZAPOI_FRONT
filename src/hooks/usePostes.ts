/** Les postes d'un jeu (Top, Jungle, Tank…), pour choisir le sien ou l'attribuer. */

import { useEffect, useState } from 'react';

import { listerPostes } from '../api/tournois';
import type { RoleJeu } from '../types/api';

interface Resultat {
    idJeu: number;
    postes: RoleJeu[];
    erreur: string | null;
}

export function usePostes(idJeu: number) {
    const [resultat, setResultat] = useState<Resultat | null>(null);

    useEffect(() => {
        let actuel = true;
        listerPostes(idJeu)
            .then((postes) => {
                if (actuel) setResultat({ idJeu, postes, erreur: null });
            })
            .catch(() => {
                if (actuel) setResultat({ idJeu, postes: [], erreur: 'Impossible de charger les postes du jeu.' });
            });
        return () => {
            actuel = false;
        };
    }, [idJeu]);

    // Le chargement se déduit : le résultat affiché n'est pas encore celui du jeu demandé.
    const courant = resultat?.idJeu === idJeu ? resultat : null;
    return { postes: courant?.postes ?? [], chargement: courant === null, erreur: courant?.erreur ?? null };
}
