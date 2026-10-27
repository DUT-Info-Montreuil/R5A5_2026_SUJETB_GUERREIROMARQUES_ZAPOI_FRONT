/** Création d'un tournoi (B-01) : état d'envoi et message d'erreur. */

import { creerTournoi } from '../api/tournois';
import type { CreationTournoi, Tournoi } from '../types/api';
import { useAction } from './useAction';

export function useCreationTournoi() {
    const { executer, envoi, erreur } = useAction();

    /** Le tournoi créé, ou null si l'API a refusé (l'erreur est alors affichable). */
    const creer = (creation: CreationTournoi): Promise<Tournoi | null> => executer(() => creerTournoi(creation));

    return { creer, envoi, erreur };
}
