/**
 * Dotation (« cash prize ») affichée sur les tournois.
 *
 * ATTENTION : ce n'est PAS une donnée de l'API. Le schéma et le contrat n'ont
 * aucun champ de dotation ; ce montant est calculé ici, uniquement pour
 * l'habillage du site (contenu fictif). Il dépend du jeu et de la taille de
 * l'arbre, et se double pour une « Coupe ». Pour une vraie dotation, il
 * faudrait une colonne en base et un champ dans le contrat (décision à deux).
 */

import type { TournoiResume } from '../../types/api';

const BASE_PAR_JEU: Record<string, number> = {
    'League of Legends': 600,
    Valorant: 500,
    'Counter-Strike 2': 500,
    'Overwatch 2': 400,
    'Dota 2': 300,
};
const BASE_PAR_DEFAUT = 200;
const POIDS_D_UN_ARBRE_DE_HUIT = 8;
const PALIER = 50;

const FORMAT_EUROS = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });

export function dotationEnEuros(tournoi: Pick<TournoiResume, 'nomTournoi' | 'nombreEquipes' | 'jeu'>): number {
    const base = BASE_PAR_JEU[tournoi.jeu.nomJeu] ?? BASE_PAR_DEFAUT;
    const coupe = tournoi.nomTournoi.startsWith('Coupe') ? 2 : 1;
    const brut = (base * coupe * tournoi.nombreEquipes) / POIDS_D_UN_ARBRE_DE_HUIT;
    return Math.max(PALIER, Math.round(brut / PALIER) * PALIER);
}

/** « 1 200 € » : le montant prêt à afficher. */
export function dotationAffichee(tournoi: Pick<TournoiResume, 'nomTournoi' | 'nombreEquipes' | 'jeu'>): string {
    return FORMAT_EUROS.format(dotationEnEuros(tournoi)).replace(/\s/g, ' ');
}
