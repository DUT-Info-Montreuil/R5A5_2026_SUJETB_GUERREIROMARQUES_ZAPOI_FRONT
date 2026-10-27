/**
 * Modification d'un tournoi par l'administrateur : renommer, ou le faire passer
 * à l'étape suivante (B-03, B-04). Un changement de statut déclenche une
 * transition d'état avec ses effets (contrat §3).
 */

import { modifierTournoi } from '../api/tournois';
import type { ModificationTournoi, Tournoi } from '../types/api';
import { useAction } from './useAction';

export function useModificationTournoi() {
    const { executer, envoi, erreur, effacerErreur } = useAction();

    /** Le tournoi mis à jour, ou null si l'API a refusé. */
    const modifier = (idTournoi: number, modification: ModificationTournoi): Promise<Tournoi | null> =>
        executer(() => modifierTournoi(idTournoi, modification));

    return { modifier, envoi, erreur, effacerErreur };
}
