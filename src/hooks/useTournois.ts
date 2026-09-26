/**
 * Liste des tournois pour un filtre donné, rechargée quand le filtre change.
 *
 * Le chargement n'est pas un état à part : il se déduit du fait que le
 * résultat affiché ne correspond pas encore au filtre demandé. L'effet ne
 * modifie ainsi l'état qu'à l'arrivée de la réponse.
 */

import { useEffect, useState } from 'react';

import { ErreurHttp } from '../api/client';
import { listerTournois } from '../api/tournois';
import type { FiltreTournois, TournoiResume } from '../types/api';

interface Resultat {
    cle: string;
    tournois: TournoiResume[];
    erreur: string | null;
}

export function useTournois(filtre: FiltreTournois) {
    const { recherche, statut } = filtre;
    const [tentative, setTentative] = useState(0);
    const [resultat, setResultat] = useState<Resultat | null>(null);

    const cle = JSON.stringify([recherche, statut, tentative]);

    useEffect(() => {
        // Ignore une réponse arrivée après un changement de filtre.
        let actuelle = true;
        listerTournois({ recherche, statut })
            .then((tournois) => {
                if (actuelle) setResultat({ cle, tournois, erreur: null });
            })
            .catch((e: unknown) => {
                const message = e instanceof ErreurHttp ? e.message : 'Impossible de charger les tournois.';
                if (actuelle) setResultat({ cle, tournois: [], erreur: message });
            });
        return () => {
            actuelle = false;
        };
    }, [cle, recherche, statut]);

    return {
        tournois: resultat?.tournois ?? [],
        erreur: resultat?.cle === cle ? resultat.erreur : null,
        chargement: resultat?.cle !== cle,
        recharger: () => setTentative((n) => n + 1),
    };
}
