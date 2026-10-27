/** Les jeux proposés à la création d'un tournoi. */

import { useEffect, useState } from 'react';

import { listerJeux } from '../api/tournois';
import type { Jeu } from '../types/api';

export function useJeux() {
    const [jeux, setJeux] = useState<Jeu[] | null>(null);
    const [erreur, setErreur] = useState<string | null>(null);

    useEffect(() => {
        let actuel = true;
        listerJeux()
            .then((liste) => {
                if (actuel) setJeux(liste);
            })
            .catch(() => {
                if (actuel) setErreur('Impossible de charger la liste des jeux.');
            });
        return () => {
            actuel = false;
        };
    }, []);

    return { jeux: jeux ?? [], chargement: jeux === null && erreur === null, erreur };
}
