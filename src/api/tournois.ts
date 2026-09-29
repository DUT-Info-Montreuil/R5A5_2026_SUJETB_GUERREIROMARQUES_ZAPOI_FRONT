/** Routes des tournois (contrat §3). */

import type {
    CreationTournoi,
    EquipeDuTournoi,
    FiltreTournois,
    Jeu,
    ModificationTournoi,
    Rencontre,
    Tournoi,
    TournoiResume,
} from '../types/api.ts';
import { api } from './client.ts';

export function listerTournois(filtre: FiltreTournois): Promise<TournoiResume[]> {
    return api.get<TournoiResume[]>('/api/tournois', { recherche: filtre.recherche, statut: filtre.statut });
}

export function detailTournoi(idTournoi: number): Promise<Tournoi> {
    return api.get<Tournoi>(`/api/tournois/${idTournoi}`);
}

export function equipesDuTournoi(idTournoi: number): Promise<EquipeDuTournoi[]> {
    return api.get<EquipeDuTournoi[]>(`/api/tournois/${idTournoi}/equipes`);
}

/** Vide tant que les inscriptions sont ouvertes. */
export function arbreDuTournoi(idTournoi: number): Promise<Rencontre[]> {
    return api.get<Rencontre[]>(`/api/tournois/${idTournoi}/arbre`);
}

/** Administrateur. */
export function creerTournoi(creation: CreationTournoi): Promise<Tournoi> {
    return api.post<Tournoi>('/api/tournois', creation);
}

/** Administrateur. Un changement de statutTournoi déclenche une transition d'état. */
export function modifierTournoi(idTournoi: number, modification: ModificationTournoi): Promise<Tournoi> {
    return api.patch<Tournoi>(`/api/tournois/${idTournoi}`, modification);
}

export function listerJeux(): Promise<Jeu[]> {
    return api.get<Jeu[]>('/api/jeux');
}
