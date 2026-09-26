/** Nombre qui monte de 0 à `cible` en ralentissant à l'arrivée. */

import { useEffect, useState } from 'react';

import { useMouvementReduit } from './useMouvementReduit';

const DUREE_MS = 1400;

export function useCompteurAnime(cible: number): number {
    const mouvementReduit = useMouvementReduit();
    const [progression, setProgression] = useState(0);

    useEffect(() => {
        if (mouvementReduit) return;
        let image = 0;
        const debut = performance.now();
        const avancer = (maintenant: number) => {
            const t = Math.min(1, (maintenant - debut) / DUREE_MS);
            setProgression(t);
            if (t < 1) image = requestAnimationFrame(avancer);
        };
        image = requestAnimationFrame(avancer);
        return () => cancelAnimationFrame(image);
    }, [cible, mouvementReduit]);

    if (mouvementReduit) return cible;
    const adouci = 1 - (1 - progression) ** 3;
    return Math.round(cible * adouci);
}
