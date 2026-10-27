/**
 * Le prochain match d'une équipe, déduit de l'arbre du tournoi. Aucune requête
 * de plus : l'arbre contient déjà tout, et il est tenu à jour en temps réel.
 */

import type { EquipeDeRencontre, Rencontre } from '../../types/api';

export interface ProchainMatch {
    rencontre: Rencontre;
    /** Absent tant que l'autre moitié de l'arbre n'a pas désigné son vainqueur. */
    adversaire?: EquipeDeRencontre;
    /** Vrai quand les deux équipes sont connues et que le match peut se jouer. */
    jouable: boolean;
}

/**
 * La première rencontre non terminée où figure l'équipe, dans l'ordre de l'arbre.
 * `undefined` si l'équipe n'a plus de match à venir (éliminée, ou vainqueur).
 */
export function prochainMatch(arbre: Rencontre[], idEquipe: number): ProchainMatch | undefined {
    const rencontre = arbre
        .filter((r) => r.statutRencontre !== 'TERMINE' && (r.equipeA?.idEquipe === idEquipe || r.equipeB?.idEquipe === idEquipe))
        .sort((a, b) => a.tour - b.tour || a.position - b.position)[0];
    if (!rencontre) return undefined;

    const adversaire = rencontre.equipeA?.idEquipe === idEquipe ? rencontre.equipeB : rencontre.equipeA;
    return { rencontre, adversaire, jouable: rencontre.statutRencontre === 'JOUABLE' };
}

/** « Quart de finale », « Demi-finale », « Finale »… selon le nombre de tours de l'arbre. */
export function nomDuTour(tour: number, arbre: Rencontre[]): string {
    const dernier = Math.max(...arbre.map((r) => r.tour));
    switch (dernier - tour) {
        case 0: return 'Finale';
        case 1: return 'Demi-finale';
        case 2: return 'Quart de finale';
        default: return `Tour ${tour}`;
    }
}
