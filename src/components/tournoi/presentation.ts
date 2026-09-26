/** Libellés, dates et textes d'affichage des tournois, partagés par les composants. */

import type { StatutTournoi, TournoiResume } from '../../types/api';

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
const FORMAT_DATE = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });

export function jourEtMois(dateIso: string): { jour: string; mois: string } {
    const date = new Date(dateIso);
    return { jour: String(date.getDate()).padStart(2, '0'), mois: FORMAT_MOIS.format(date) };
}

export function dateLongue(dateIso: string): string {
    return FORMAT_DATE.format(new Date(dateIso));
}

export function placesRestantes(t: TournoiResume): number {
    return Math.max(0, t.nombreEquipes - t.nombreEquipesInscrites);
}

// Ordre de la une : ce qui se joue, puis ce qui recrute, puis ce qui va commencer.
const PRIORITE_UNE: StatutTournoi[] = ['EN_COURS', 'INSCRIPTIONS_OUVERTES', 'INSCRIPTIONS_CLOSES'];

export function tournoisALaUne(tournois: TournoiResume[], maximum = 3): TournoiResume[] {
    return PRIORITE_UNE.flatMap((statut) => tournois.filter((t) => t.statutTournoi === statut)).slice(0, maximum);
}

/** Texte de présentation, construit à partir des données réelles du tournoi. */
export function descriptionTournoi(t: TournoiResume): string {
    const places = placesRestantes(t);
    switch (t.statutTournoi) {
        case 'EN_COURS':
            return `${t.nombreEquipesInscrites} équipes s'affrontent en élimination directe. Le tournoi est lancé : les résultats s'affichent au fil des matchs.`;
        case 'INSCRIPTIONS_OUVERTES':
            return `Montez votre équipe de ${t.jeu.joueursParEquipe} joueurs et réservez votre place. Encore ${places} ${places > 1 ? 'places' : 'place'} sur ${t.nombreEquipes} avant la clôture.`;
        case 'INSCRIPTIONS_CLOSES':
            return `Les ${t.nombreEquipesInscrites} équipes sont connues et l'arbre est prêt. Le coup d'envoi approche.`;
        case 'TERMINE':
            return "Le tournoi est terminé. L'arbre complet reste consultable.";
    }
}
