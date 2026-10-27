/** Création d'une équipe pour un tournoi (B-05) : état d'envoi et message d'erreur. */

import { creerEquipe } from '../api/equipes';
import type { CreationEquipe, Equipe } from '../types/api';
import { useAction } from './useAction';

export function useCreationEquipe() {
    const { executer, envoi, erreur, effacerErreur } = useAction();

    /** L'équipe créée, ou null si l'API a refusé (l'erreur est alors affichable). */
    const creer = (idTournoi: number, creation: CreationEquipe): Promise<Equipe | null> =>
        executer(() => creerEquipe(idTournoi, creation));

    return { creer, envoi, erreur, effacerErreur };
}
