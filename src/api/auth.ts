/** Routes d'authentification (contrat §2). */

import type { DemandeInscription, IdentifiantsConnexion, ReponseAuthentification, Utilisateur } from '../types/api.ts';
import { api } from './client.ts';

export function seConnecter(identifiants: IdentifiantsConnexion): Promise<ReponseAuthentification> {
    return api.post<ReponseAuthentification>('/api/auth/connexion', identifiants);
}

export function sInscrire(demande: DemandeInscription): Promise<ReponseAuthentification> {
    return api.post<ReponseAuthentification>('/api/auth/inscription', demande);
}

/** L'utilisateur de la session en cours ; 401 s'il n'y en a pas. */
export function profil(): Promise<Utilisateur> {
    return api.get<Utilisateur>('/api/auth/moi');
}

/** Le cookie est HttpOnly : seule l'API peut l'effacer. */
export function seDeconnecter(): Promise<void> {
    return api.post<void>('/api/auth/deconnexion');
}
