/** Libellés et textes d'affichage des équipes et de leur espace d'échange. */

import type { StatutEquipe } from '../../types/api';
import type { FinDAcces } from '../../hooks/useChatEquipe';

/** Ce que voit un joueur quand l'accès à l'espace d'échange lui est retiré (B-17, B-18). */
export const AVIS_FIN_D_ACCES: Record<FinDAcces, string> = {
    exclusion: "Vous ne faites plus partie de cette équipe : son espace d'échange est fermé pour vous.",
    elimination: "Votre équipe est éliminée : son espace d'échange est fermé.",
    disqualification: "Votre équipe a été disqualifiée : son espace d'échange est fermé.",
    refuse: "Vous n'avez plus accès à cet espace d'échange.",
};

/** Ce que voit un membre qui arrive sur une équipe dont l'espace est déjà fermé. */
export const AVIS_ESPACE_FERME: Record<Exclude<StatutEquipe, 'EN_LICE'>, string> = {
    ELIMINEE: AVIS_FIN_D_ACCES.elimination,
    DISQUALIFIEE: AVIS_FIN_D_ACCES.disqualification,
    VAINQUEUR: "Le tournoi est terminé : l'espace d'échange de votre équipe est fermé.",
};

const FORMAT_HEURE = new Intl.DateTimeFormat('fr-FR', { hour: '2-digit', minute: '2-digit' });
const FORMAT_JOUR_HEURE = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });

/** « 14:32 » pour un message du jour, « 12 oct., 14:32 » sinon. */
export function horodatage(dateIso: string): string {
    const date = new Date(dateIso);
    return date.toDateString() === new Date().toDateString() ? FORMAT_HEURE.format(date) : FORMAT_JOUR_HEURE.format(date);
}
