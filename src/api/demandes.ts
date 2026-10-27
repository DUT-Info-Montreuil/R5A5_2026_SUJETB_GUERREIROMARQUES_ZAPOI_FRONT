/** Routes des demandes d'adhésion (contrat §4, B-06). */

import type { DemandeAdhesion, MaDemande, StatutDemande } from '../types/api.ts';
import { api } from './client.ts';

/** Joueur connecté : demande à rejoindre une équipe. */
export function demanderAdhesion(idEquipe: number): Promise<DemandeAdhesion> {
    return api.post<DemandeAdhesion>(`/api/equipes/${idEquipe}/demandes`);
}

/** Capitaine seul : 404 pour tout autre appelant. */
export function demandesDeLEquipe(idEquipe: number, statut?: StatutDemande): Promise<DemandeAdhesion[]> {
    return api.get<DemandeAdhesion[]>(`/api/equipes/${idEquipe}/demandes`, { statut });
}

/** Capitaine seul : l'acceptation ajoute le joueur à l'équipe, sans poste. */
export function traiterDemande(idDemande: number, statut: 'ACCEPTEE' | 'REFUSEE'): Promise<DemandeAdhesion> {
    return api.patch<DemandeAdhesion>(`/api/demandes/${idDemande}`, { statutDemande: statut });
}

/** Les demandes de l'utilisateur connecté qui attendent une réponse. */
export function mesDemandes(): Promise<MaDemande[]> {
    return api.get<MaDemande[]>('/api/moi/demandes');
}
