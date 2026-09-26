/**
 * Carrousel qui avance seul toutes les `dureeMs`. Choisir une diapositive
 * relance le minuteur, pour ne pas changer sous les yeux de l'utilisateur.
 */

import { useEffect, useState } from 'react';

import { useMouvementReduit } from './useMouvementReduit';

export function useCarrousel(nombre: number, dureeMs: number) {
    const mouvementReduit = useMouvementReduit();
    const [actif, setActif] = useState(0);
    // Incrémenté à chaque choix manuel : relance l'effet, donc le minuteur.
    const [cycle, setCycle] = useState(0);

    useEffect(() => {
        if (nombre < 2 || mouvementReduit) return;
        const minuteur = setInterval(() => setActif((i) => (i + 1) % nombre), dureeMs);
        return () => clearInterval(minuteur);
    }, [nombre, dureeMs, cycle, mouvementReduit]);

    function choisir(indice: number) {
        setActif(indice);
        setCycle((c) => c + 1);
    }

    return {
        // Modulo : si la liste raccourcit, l'indice reste valide.
        actif: nombre > 0 ? actif % nombre : 0,
        choisir,
        defilementAuto: nombre > 1 && !mouvementReduit,
        cle: `${actif}-${cycle}`,
    };
}
