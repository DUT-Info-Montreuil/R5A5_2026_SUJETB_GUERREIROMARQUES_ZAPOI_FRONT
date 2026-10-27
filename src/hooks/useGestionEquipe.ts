/**
 * Les actions du capitaine sur son équipe, et celles d'un membre qui la quitte :
 * renommer, attribuer un poste, passer la main, exclure, traiter une demande,
 * se désister (dissoudre l'équipe).
 *
 * Chaque action renvoie vrai si elle a réussi ; `onModifie` prévient alors la
 * page, qui relit l'équipe. L'erreur éventuelle est dans `erreur`, rédigée par
 * l'API (« Ce poste est déjà tenu… »).
 */

import { traiterDemande } from '../api/demandes';
import { dissoudreEquipe, modifierEquipe, modifierMembre, retirerMembre } from '../api/equipes';
import { useAction } from './useAction';

export function useGestionEquipe(idEquipe: number, onModifie: () => void) {
    const { executer, envoi, erreur, effacerErreur } = useAction();

    async function appliquer<T>(action: () => Promise<T>): Promise<boolean> {
        const resultat = await executer(action);
        if (resultat === null) return false;
        onModifie();
        return true;
    }

    return {
        envoi,
        erreur,
        effacerErreur,
        renommer: (nomEquipe: string) => appliquer(() => modifierEquipe(idEquipe, { nomEquipe })),
        attribuerPoste: (idUtilisateur: number, idRole: number) =>
            appliquer(() => modifierMembre(idEquipe, idUtilisateur, { idRole })),
        passerLaMain: (idUtilisateur: number) =>
            appliquer(() => modifierMembre(idEquipe, idUtilisateur, { estCapitaine: true })),
        retirer: (idUtilisateur: number) => appliquer(() => retirerMembre(idEquipe, idUtilisateur)),
        // Pas de relecture : l'équipe n'existe plus, la page quitte la sienne.
        dissoudre: async () => (await executer(() => dissoudreEquipe(idEquipe))) !== null,
        traiterDemande: (idDemande: number, statut: 'ACCEPTEE' | 'REFUSEE') =>
            appliquer(() => traiterDemande(idDemande, statut)),
    };
}
