/** Routes des tournois (contrat §3). */

import type { FiltreTournois, TournoiResume } from '../types/api.ts';
import { api } from './client.ts';

export function listerTournois(filtre: FiltreTournois): Promise<TournoiResume[]> {
    return api.get<TournoiResume[]>('/api/tournois', { recherche: filtre.recherche, statut: filtre.statut });
}
