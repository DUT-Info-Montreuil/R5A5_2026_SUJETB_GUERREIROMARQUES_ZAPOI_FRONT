/** Les équipes inscrites : nom, effectif par rapport au jeu, et état dans le tournoi. */

import type { EquipeDuTournoi } from '../../types/api';
import { LIBELLES_STATUT_EQUIPE } from './presentation';

interface Props {
    equipes: EquipeDuTournoi[];
    joueursParEquipe: number;
    /** Places affichées vides tant que le tournoi recrute. */
    placesLibres: number;
}

export function ListeEquipes({ equipes, joueursParEquipe, placesLibres }: Props) {
    if (equipes.length === 0 && placesLibres === 0) {
        return <p className="text-body-secondary m-0">Aucune équipe inscrite.</p>;
    }

    return (
        <ul className="row g-3 m-0 p-0 list-unstyled">
            {equipes.map((equipe) => {
                const complete = equipe.nombreMembres >= joueursParEquipe;
                return (
                    <li key={equipe.idEquipe} className="col-12 col-sm-6 col-lg-3 ps-0">
                        <div className={`carte-equipe carte-equipe-${equipe.statutEquipe.toLowerCase()} h-100`}>
                            <span className="carte-equipe-nom text-truncate">{equipe.nomEquipe}</span>
                            <span className="small text-body-secondary">
                                {equipe.nombreMembres}/{joueursParEquipe} joueurs{complete ? '' : ' · incomplète'}
                            </span>
                            <span className="libelle small mt-auto">{LIBELLES_STATUT_EQUIPE[equipe.statutEquipe]}</span>
                            {equipe.motifSortie && <span className="small text-body-secondary">{equipe.motifSortie}</span>}
                        </div>
                    </li>
                );
            })}
            {Array.from({ length: placesLibres }, (_, i) => (
                <li key={`libre-${i}`} className="col-12 col-sm-6 col-lg-3 ps-0">
                    <div className="carte-equipe carte-equipe-libre h-100">Place libre</div>
                </li>
            ))}
        </ul>
    );
}
