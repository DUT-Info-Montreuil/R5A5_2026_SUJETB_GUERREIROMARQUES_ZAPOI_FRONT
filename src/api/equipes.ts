/** Routes des équipes et de leur composition (contrat §4). */

import type {
    CreationEquipe,
    Equipe,
    ModificationEquipe,
    ModificationMembre,
    MonEquipe,
} from '../types/api.ts';
import { api } from './client.ts';

export function detailEquipe(idEquipe: number): Promise<Equipe> {
    return api.get<Equipe>(`/api/equipes/${idEquipe}`);
}

/** Joueur connecté : il devient capitaine de la nouvelle équipe. */
export function creerEquipe(idTournoi: number, creation: CreationEquipe): Promise<Equipe> {
    return api.post<Equipe>(`/api/tournois/${idTournoi}/equipes`, creation);
}

/** Capitaine : nomEquipe. Administrateur : statutEquipe (disqualification) et motifSortie. */
export function modifierEquipe(idEquipe: number, modification: ModificationEquipe): Promise<Equipe> {
    return api.patch<Equipe>(`/api/equipes/${idEquipe}`, modification);
}

/** Capitaine : attribue un poste ou passe la main. */
export function modifierMembre(idEquipe: number, idUtilisateur: number, modification: ModificationMembre): Promise<Equipe> {
    return api.patch<Equipe>(`/api/equipes/${idEquipe}/membres/${idUtilisateur}`, modification);
}

/** Le capitaine exclut un membre, ou le membre part de lui-même. */
export function retirerMembre(idEquipe: number, idUtilisateur: number): Promise<void> {
    return api.delete<void>(`/api/equipes/${idEquipe}/membres/${idUtilisateur}`);
}

/** Les équipes de l'utilisateur connecté. */
export function mesEquipes(): Promise<MonEquipe[]> {
    return api.get<MonEquipe[]>('/api/moi/equipes');
}
