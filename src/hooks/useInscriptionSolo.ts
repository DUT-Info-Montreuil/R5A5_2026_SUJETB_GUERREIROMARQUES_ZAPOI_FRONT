/**
 * S'inscrire en solo (échecs, EA FC, Pokémon…) : un clic, sans formulaire.
 * L'API garde une équipe d'un joueur ; on la nomme d'après le pseudo et on lui
 * donne l'unique poste du jeu. L'utilisateur n'a ni nom d'équipe ni poste à choisir.
 */

import { creerEquipe } from '../api/equipes';
import { useAuth } from '../context/useAuth';
import type { Equipe, Tournoi } from '../types/api';
import { useAction } from './useAction';
import { usePostes } from './usePostes';

export function useInscriptionSolo(tournoi: Tournoi) {
    const { utilisateur } = useAuth();
    const { postes, chargement } = usePostes(tournoi.jeu.idJeu);
    const { executer, envoi, erreur, effacerErreur } = useAction();

    const poste = postes[0];
    const pret = utilisateur !== null && poste !== undefined && !chargement;

    /** L'inscription créée, ou null si l'API a refusé (l'erreur est alors affichable). */
    const sInscrire = (): Promise<Equipe | null> =>
        executer(() => {
            if (!utilisateur || !poste) return Promise.reject(new Error('inscription impossible'));
            return creerEquipe(tournoi.idTournoi, { nomEquipe: utilisateur.pseudo, idRole: poste.idRole });
        });

    return { sInscrire, envoi, erreur, effacerErreur, pret };
}
