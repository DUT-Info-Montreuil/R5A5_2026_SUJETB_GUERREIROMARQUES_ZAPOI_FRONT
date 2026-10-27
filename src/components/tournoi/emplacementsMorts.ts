/**
 * Côtés de l'arbre qui ne recevront jamais d'équipe — même règle que le back
 * (services/arbre.py) : un côté vide au premier tour, ou alimenté par une
 * rencontre dont les deux côtés sont eux-mêmes morts.
 *
 * Sert uniquement à l'affichage : « Pas d'adversaire » plutôt que « À déterminer ».
 */

import type { Emplacement, Rencontre } from '../../types/api';

export function cleEmplacement(idRencontre: number, emplacement: Emplacement): string {
    return `${idRencontre}-${emplacement}`;
}

export function emplacementsMorts(arbre: Rencontre[]): Set<string> {
    const source = new Map<string, Rencontre>();
    for (const r of arbre) {
        if (r.idRencontreSuivante !== undefined && r.emplacementSuivant !== undefined) {
            source.set(cleEmplacement(r.idRencontreSuivante, r.emplacementSuivant), r);
        }
    }

    function emplacementMort(r: Rencontre, emplacement: Emplacement): boolean {
        if ((emplacement === 'A' ? r.equipeA : r.equipeB) !== undefined) return false;
        const alimentee = source.get(cleEmplacement(r.idRencontre, emplacement));
        return alimentee === undefined || rencontreMorte(alimentee);
    }

    function rencontreMorte(r: Rencontre): boolean {
        return r.statutRencontre !== 'TERMINE' && emplacementMort(r, 'A') && emplacementMort(r, 'B');
    }

    const morts = new Set<string>();
    for (const r of arbre) {
        for (const emplacement of ['A', 'B'] as const) {
            if (emplacementMort(r, emplacement)) morts.add(cleEmplacement(r.idRencontre, emplacement));
        }
    }
    return morts;
}
