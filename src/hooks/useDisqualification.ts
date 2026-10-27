/** Disqualification d'une équipe par l'administrateur (B-15) : état d'envoi et message d'erreur. */

import { modifierEquipe } from '../api/equipes';
import type { Equipe } from '../types/api';
import { useAction } from './useAction';

export function useDisqualification() {
    const { executer, envoi, erreur, effacerErreur } = useAction();

    /** L'équipe mise à jour, ou null si l'API a refusé. Le motif est facultatif. */
    const disqualifier = (idEquipe: number, motif: string): Promise<Equipe | null> =>
        executer(() => modifierEquipe(idEquipe, { statutEquipe: 'DISQUALIFIEE', motifSortie: motif.trim() || undefined }));

    return { disqualifier, envoi, erreur, effacerErreur };
}
