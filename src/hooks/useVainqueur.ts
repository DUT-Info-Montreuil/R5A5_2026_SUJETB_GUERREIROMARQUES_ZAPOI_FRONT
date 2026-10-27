/** Le vainqueur d'un tournoi terminé : l'équipe au statut VAINQUEUR. Absent tant que la réponse n'est pas arrivée. */

import { useEffect, useState } from 'react';

import { equipesDuTournoi } from '../api/tournois';
import type { EquipeDuTournoi } from '../types/api';

export function useVainqueur(idTournoi: number): EquipeDuTournoi | null {
    const [resultat, setResultat] = useState<{ idTournoi: number; vainqueur: EquipeDuTournoi | null } | null>(null);

    useEffect(() => {
        let actuel = true;
        equipesDuTournoi(idTournoi)
            .then((equipes) => {
                if (actuel) setResultat({ idTournoi, vainqueur: equipes.find((e) => e.statutEquipe === 'VAINQUEUR') ?? null });
            })
            .catch(() => {
                if (actuel) setResultat({ idTournoi, vainqueur: null });
            });
        return () => {
            actuel = false;
        };
    }, [idTournoi]);

    return resultat?.idTournoi === idTournoi ? resultat.vainqueur : null;
}
