/**
 * État d'authentification partagé par toute l'application.
 *
 * Il ne contient que l'identité et le statut d'administrateur, lus depuis
 * l'API. L'appartenance aux équipes n'y est jamais mise en cache : un joueur
 * exclu doit perdre l'accès tout de suite (B-17).
 */

import { useCallback, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

import { profil, seDeconnecter } from '../api/auth';
import { definirGestionSessionPerdue } from '../api/client';
import type { Utilisateur } from '../types/api';
import { AuthContext } from './AuthContext';
import type { ValeurAuth } from './AuthContext';

export function FournisseurAuth({ children }: { children: ReactNode }) {
    const [utilisateur, setUtilisateur] = useState<Utilisateur | null>(null);
    const [chargement, setChargement] = useState(true);

    const ouvrirSession = useCallback((connecte: Utilisateur) => setUtilisateur(connecte), []);

    const deconnexion = useCallback(async () => {
        // Même si l'API ne répond pas, l'interface considère la session fermée.
        await seDeconnecter().catch(() => undefined);
        setUtilisateur(null);
    }, []);

    useEffect(() => {
        definirGestionSessionPerdue(() => setUtilisateur(null));
    }, []);

    // Le cookie est illisible en JavaScript : seul l'API sait s'il existe et
    // s'il est encore valide. On lui demande au chargement de la page.
    useEffect(() => {
        let actuel = true;
        profil()
            .then((connecte) => {
                if (actuel) setUtilisateur(connecte);
            })
            .catch(() => undefined)
            .finally(() => {
                if (actuel) setChargement(false);
            });
        return () => {
            actuel = false;
        };
    }, []);

    const valeur = useMemo<ValeurAuth>(
        () => ({ utilisateur, chargement, ouvrirSession, deconnexion }),
        [utilisateur, chargement, ouvrirSession, deconnexion],
    );

    return <AuthContext.Provider value={valeur}>{children}</AuthContext.Provider>;
}
