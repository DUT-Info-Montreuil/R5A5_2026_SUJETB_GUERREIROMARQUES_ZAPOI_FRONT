/** Les équipes inscrites : nom (lien vers sa page), effectif par rapport au jeu, état dans le tournoi, et des actions. */

import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

import type { EquipeDuTournoi } from '../../types/api';
import { LIBELLES_STATUT_EQUIPE } from './presentation';
import { estSolo } from './vocabulaire';

interface Props {
    equipes: EquipeDuTournoi[];
    joueursParEquipe: number;
    /** Places affichées vides tant que le tournoi recrute. */
    placesLibres: number;
    /** Actions propres à chaque équipe (demander à rejoindre, disqualifier…). */
    actions?: (equipe: EquipeDuTournoi) => ReactNode;
}

export function ListeEquipes({ equipes, joueursParEquipe, placesLibres, actions }: Props) {
    if (equipes.length === 0 && placesLibres === 0) {
        return <p className="text-body-secondary m-0">{estSolo(joueursParEquipe) ? 'Aucun joueur inscrit.' : 'Aucune équipe inscrite.'}</p>;
    }

    return (
        <ul className="row g-3 m-0 p-0 list-unstyled">
            {equipes.map((equipe) => {
                const complete = equipe.nombreMembres >= joueursParEquipe;
                return (
                    <li key={equipe.idEquipe} className="col-12 col-sm-6 col-lg-3 ps-0">
                        <div className={`carte-equipe carte-equipe-${equipe.statutEquipe.toLowerCase()} carte-cliquable h-100`}>
                            <Link to={`/equipes/${equipe.idEquipe}`} className="carte-equipe-nom text-truncate ligne-lien lien-etendu">
                                {equipe.nomEquipe}
                            </Link>
                            {!estSolo(joueursParEquipe) && (
                                <span className="small text-body-secondary">
                                    {equipe.nombreMembres}/{joueursParEquipe} joueurs{complete ? '' : ' · incomplète'}
                                </span>
                            )}
                            <span className="libelle small mt-auto">{LIBELLES_STATUT_EQUIPE[equipe.statutEquipe]}</span>
                            {equipe.motifSortie && <span className="small text-body-secondary">{equipe.motifSortie}</span>}
                            {/* Au-dessus du lien étendu : les boutons restent cliquables. */}
                            {actions && <div className="carte-actions">{actions(equipe)}</div>}
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
