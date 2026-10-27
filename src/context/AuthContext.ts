/**
 * Forme de l'état d'authentification et objet React qui le transporte.
 * Séparé du fournisseur : Vite ne recharge à chaud un fichier que s'il
 * n'exporte que des composants.
 */

import { createContext } from 'react';

import type { Utilisateur } from '../types/api';

export interface ValeurAuth {
    utilisateur: Utilisateur | null;
    /** Vrai tant que la session du cookie n'a pas été vérifiée au démarrage. */
    chargement: boolean;
    ouvrirSession: (utilisateur: Utilisateur) => void;
    deconnexion: () => Promise<void>;
}

export const AuthContext = createContext<ValeurAuth | null>(null);
