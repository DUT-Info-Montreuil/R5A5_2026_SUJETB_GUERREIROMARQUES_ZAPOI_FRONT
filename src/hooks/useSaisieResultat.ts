/** Saisie du résultat d'une rencontre par l'administrateur (B-13 à B-15) : état d'envoi et message d'erreur. */

import { saisirResultat } from '../api/rencontres';
import type { Rencontre, ResultatRencontre } from '../types/api';
import { useAction } from './useAction';

export function useSaisieResultat() {
    const { executer, envoi, erreur } = useAction();

    /** La rencontre mise à jour, ou null si l'API a refusé. */
    const enregistrer = (idRencontre: number, resultat: ResultatRencontre): Promise<Rencontre | null> =>
        executer(() => saisirResultat(idRencontre, resultat));

    return { enregistrer, envoi, erreur };
}
