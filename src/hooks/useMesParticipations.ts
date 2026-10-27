/**
 * Où joue l'utilisateur connecté : ses équipes, et ses demandes d'adhésion qui
 * attendent une réponse. Sans connexion (`actif` faux), rien n'est demandé.
 */

import { useCallback, useEffect, useState } from 'react';

import { ErreurHttp } from '../api/client';
import { mesDemandes } from '../api/demandes';
import { mesEquipes } from '../api/equipes';
import type { MaDemande, MonEquipe } from '../types/api';

interface Donnees {
    tentative: number;
    equipes: MonEquipe[];
    demandes: MaDemande[];
    erreur: string | null;
}

export function useMesParticipations(actif: boolean) {
    const [tentative, setTentative] = useState(0);
    const [donnees, setDonnees] = useState<Donnees | null>(null);

    useEffect(() => {
        if (!actif) return;
        let actuelle = true;
        Promise.all([mesEquipes(), mesDemandes()])
            .then(([equipes, demandes]) => {
                if (actuelle) setDonnees({ tentative, equipes, demandes, erreur: null });
            })
            .catch((e: unknown) => {
                if (!actuelle) return;
                const erreur = e instanceof ErreurHttp ? e.message : 'Impossible de charger vos équipes.';
                setDonnees({ tentative, equipes: [], demandes: [], erreur });
            });
        return () => {
            actuelle = false;
        };
    }, [actif, tentative]);

    const recharger = useCallback(() => setTentative((n) => n + 1), []);
    const courant = actif && donnees?.tentative === tentative ? donnees : null;

    return {
        // Déconnecté : jamais de données d'une session précédente.
        equipes: actif ? (donnees?.equipes ?? []) : [],
        demandes: actif ? (donnees?.demandes ?? []) : [],
        erreur: courant?.erreur ?? null,
        chargement: actif && courant === null,
        recharger,
    };
}
