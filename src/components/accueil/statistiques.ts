/** Calculs de la page d'accueil, tirés de la liste des tournois. */

import type { Chiffre } from './ChiffresSaison';
import type { Jeu, TournoiResume } from '../../types/api';

export function chiffresDeLaSaison(tournois: TournoiResume[]): Chiffre[] {
    const equipes = tournois.reduce((total, t) => total + t.nombreEquipesInscrites, 0);
    const ouverts = tournois.filter((t) => t.statutTournoi === 'INSCRIPTIONS_OUVERTES').length;
    return [
        { valeur: tournois.length, libelle: tournois.length > 1 ? 'tournois cette saison' : 'tournoi cette saison' },
        { valeur: equipes, libelle: 'équipes inscrites' },
        { valeur: jeuxPresents(tournois).length, libelle: 'jeux au programme' },
        { valeur: ouverts, libelle: 'inscriptions ouvertes' },
    ];
}

/** Un jeu et le nombre de tournois qui le jouent. */
export interface JeuPresent {
    jeu: Jeu;
    nombreTournois: number;
}

/** Chaque jeu une seule fois, avec son nombre de tournois, le plus joué d'abord. */
export function jeuxPresents(tournois: TournoiResume[]): JeuPresent[] {
    const parJeu = new Map<number, JeuPresent>();
    for (const { jeu } of tournois) {
        const present = parJeu.get(jeu.idJeu);
        if (present) present.nombreTournois += 1;
        else parJeu.set(jeu.idJeu, { jeu, nombreTournois: 1 });
    }
    return [...parJeu.values()].sort((a, b) => b.nombreTournois - a.nombreTournois);
}
