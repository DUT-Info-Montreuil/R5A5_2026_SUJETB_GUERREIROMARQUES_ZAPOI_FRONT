/** Les demandes d'adhésion en attente d'une équipe. Réservé à son capitaine : `actif` faux, rien n'est demandé. */

import { useCallback, useEffect, useState } from 'react';

import { demandesDeLEquipe } from '../api/demandes';
import type { DemandeAdhesion } from '../types/api';
import { useRechargeAuRetour } from './useRechargeAuRetour';

interface Donnees {
    tentative: number;
    demandes: DemandeAdhesion[];
    erreur: string | null;
}

export function useDemandesEquipe(idEquipe: number, actif: boolean) {
    const [tentative, setTentative] = useState(0);
    const [donnees, setDonnees] = useState<Donnees | null>(null);

    useEffect(() => {
        if (!actif) return;
        let actuelle = true;
        demandesDeLEquipe(idEquipe, 'EN_ATTENTE')
            .then((demandes) => {
                if (actuelle) setDonnees({ tentative, demandes, erreur: null });
            })
            .catch(() => {
                if (actuelle) setDonnees({ tentative, demandes: [], erreur: 'Impossible de charger les demandes.' });
            });
        return () => {
            actuelle = false;
        };
    }, [idEquipe, actif, tentative]);

    const recharger = useCallback(() => setTentative((n) => n + 1), []);
    useRechargeAuRetour(recharger);

    return {
        demandes: actif ? (donnees?.demandes ?? []) : [],
        erreur: actif && donnees?.tentative === tentative ? donnees.erreur : null,
        recharger,
    };
}
