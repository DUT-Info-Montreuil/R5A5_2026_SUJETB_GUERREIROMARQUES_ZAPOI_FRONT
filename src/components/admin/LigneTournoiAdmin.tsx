/** Une ligne de la liste d'administration : le tournoi, son état, et ce qu'on peut en faire. */

import { Link } from 'react-router-dom';

import type { Tournoi, TournoiResume } from '../../types/api';
import { VisuelJeu } from '../tournoi/VisuelJeu';
import { LIBELLES_STATUT, POINT_STATUT } from '../tournoi/presentation';
import { ActionsTournoi } from './ActionsTournoi';

interface Props {
    tournoi: TournoiResume;
    onModifie: (tournoi: Tournoi) => void;
}

export function LigneTournoiAdmin({ tournoi, onModifie }: Props) {
    return (
        <li className="ligne-admin row align-items-center g-0 gx-4 gy-3">
            <div className="d-none d-md-block col-md-2">
                <VisuelJeu nomJeu={tournoi.jeu.nomJeu} className="ligne-visuel" />
            </div>
            <div className="col-12 col-md-4 d-flex flex-column gap-1">
                <span className="ligne-nom">{tournoi.nomTournoi}</span>
                <span className="small text-body-secondary">
                    {tournoi.jeu.nomJeu} · {tournoi.nombreEquipesInscrites}/{tournoi.nombreEquipes} équipes
                </span>
            </div>
            <div className="col-12 col-md-2 d-flex align-items-center gap-2">
                <span className={POINT_STATUT[tournoi.statutTournoi]} />
                {LIBELLES_STATUT[tournoi.statutTournoi]}
            </div>
            <div className="col-12 col-md-4 d-flex flex-wrap align-items-center justify-content-md-end gap-3">
                <Link to={`/admin/tournois/${tournoi.idTournoi}`} className="lien-souligne">Détails</Link>
                <ActionsTournoi tournoi={tournoi} onModifie={onModifie} compact />
            </div>
        </li>
    );
}
