/** Routes des rencontres (contrat §5). */

import type { Rencontre, ResultatRencontre } from '../types/api.ts';
import { api } from './client.ts';

/** Administrateur. Le vainqueur remonte dans l'arbre, le perdant est éliminé. */
export function saisirResultat(idRencontre: number, resultat: ResultatRencontre): Promise<Rencontre> {
    return api.patch<Rencontre>(`/api/rencontres/${idRencontre}`, resultat);
}
