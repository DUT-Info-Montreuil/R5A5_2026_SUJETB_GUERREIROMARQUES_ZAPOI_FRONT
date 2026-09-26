/** Libellés et formats d'affichage des tournois, partagés par les composants. */

import type { StatutTournoi } from '../../types/api';

export const LIBELLES_STATUT: Record<StatutTournoi, string> = {
    INSCRIPTIONS_OUVERTES: 'Inscriptions ouvertes',
    INSCRIPTIONS_CLOSES: 'Inscriptions closes',
    EN_COURS: 'En cours',
    TERMINE: 'Terminé',
};

/** Pastille : violette qui respire en direct, violette pour ce qui recrute, vide sinon. */
export const POINT_STATUT: Record<StatutTournoi, string> = {
    EN_COURS: 'point point-direct',
    INSCRIPTIONS_OUVERTES: 'point',
    INSCRIPTIONS_CLOSES: 'point point-vide',
    TERMINE: 'point point-vide',
};

const FORMAT_MOIS = new Intl.DateTimeFormat('fr-FR', { month: 'short' });

export function jourEtMois(dateIso: string): { jour: string; mois: string } {
    const date = new Date(dateIso);
    return { jour: String(date.getDate()).padStart(2, '0'), mois: FORMAT_MOIS.format(date) };
}

/** Le tournoi mis en avant : celui qui se joue, sinon le premier qui recrute. */
export function tournoiALaUne<T extends { statutTournoi: StatutTournoi }>(tournois: T[]): T | undefined {
    return tournois.find((t) => t.statutTournoi === 'EN_COURS') ?? tournois.find((t) => t.statutTournoi === 'INSCRIPTIONS_OUVERTES');
}
