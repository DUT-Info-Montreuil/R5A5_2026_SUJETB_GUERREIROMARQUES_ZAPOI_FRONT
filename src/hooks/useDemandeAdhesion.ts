/** Demande à rejoindre une équipe (B-06) : état d'envoi et message d'erreur. */

import { demanderAdhesion } from '../api/demandes';
import type { DemandeAdhesion } from '../types/api';
import { useAction } from './useAction';

export function useDemandeAdhesion() {
    const { executer, envoi, erreur } = useAction();

    /** La demande créée, ou null si l'API a refusé. */
    const demander = (idEquipe: number): Promise<DemandeAdhesion | null> => executer(() => demanderAdhesion(idEquipe));

    return { demander, envoi, erreur };
}
