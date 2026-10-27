/**
 * Recharge des données quand l'utilisateur revient sur l'onglet.
 *
 * Certains changements ne sont pas poussés en temps réel (une demande
 * d'adhésion qui arrive, un poste attribué par le capitaine) : plutôt qu'un
 * polling permanent, on relit à chaque retour sur la page. Un onglet caché ne
 * consomme rien.
 */

import { useEffect } from 'react';

export function useRechargeAuRetour(recharger: () => void) {
    useEffect(() => {
        const auRetour = () => {
            if (document.visibilityState === 'visible') recharger();
        };
        document.addEventListener('visibilitychange', auRetour);
        return () => document.removeEventListener('visibilitychange', auRetour);
    }, [recharger]);
}
