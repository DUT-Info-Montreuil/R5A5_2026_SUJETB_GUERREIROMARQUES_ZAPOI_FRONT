/**
 * L'arbre du tournoi, une colonne par tour, du premier tour (à gauche) à la
 * finale (à droite). Les rencontres arrivent triées par tour puis par position :
 * dans chaque colonne, les cartes se répartissent sur la hauteur, chacune face
 * à la rencontre qu'elle alimente.
 */

import type { ReactNode } from 'react';

import type { Rencontre } from '../../types/api';
import { CarteRencontre } from './CarteRencontre';
import { cleEmplacement, emplacementsMorts } from './emplacementsMorts';
import { nomDuTour } from './presentation';

interface Props {
    arbre: Rencontre[];
    /** Vrai une fois le tournoi lancé : les rencontres prêtes deviennent « à jouer ». */
    lance: boolean;
    /** Actions à afficher sur une rencontre : l'administrateur y saisit les résultats. */
    actions?: (rencontre: Rencontre) => ReactNode;
}

export function ArbreTournoi({ arbre, lance, actions }: Props) {
    if (arbre.length === 0) {
        return <p className="text-body-secondary m-0">L'arbre sera tiré au sort à la clôture des inscriptions.</p>;
    }

    const nombreDeTours = Math.max(...arbre.map((r) => r.tour));
    const tours = Array.from({ length: nombreDeTours }, (_, i) => i + 1);
    const morts = emplacementsMorts(arbre);

    return (
        <div className="arbre">
            {tours.map((tour) => (
                <section key={tour} className="arbre-tour" aria-label={nomDuTour(tour, nombreDeTours)}>
                    <h3 className="libelle small text-body-secondary m-0">{nomDuTour(tour, nombreDeTours)}</h3>
                    <div className="arbre-tour-rencontres">
                        {arbre.filter((r) => r.tour === tour).map((rencontre) => (
                            <CarteRencontre
                                key={rencontre.idRencontre}
                                rencontre={rencontre}
                                lance={lance}
                                sansAdversaireA={morts.has(cleEmplacement(rencontre.idRencontre, 'A'))}
                                sansAdversaireB={morts.has(cleEmplacement(rencontre.idRencontre, 'B'))}
                                actions={actions?.(rencontre)}
                            />
                        ))}
                    </div>
                </section>
            ))}
        </div>
    );
}
