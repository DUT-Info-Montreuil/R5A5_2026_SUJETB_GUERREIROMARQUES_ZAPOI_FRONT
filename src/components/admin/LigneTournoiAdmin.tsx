/** Une ligne de la liste d'administration : le tournoi, son état, et ce qu'on peut en faire. */

import { Link } from 'react-router-dom';

import type { Tournoi, TournoiResume } from '../../types/api';
import { LogoJeu } from '../jeux/LogoJeu';
import { LIBELLES_STATUT, POINT_STATUT } from '../tournoi/presentation';
import { ActionsTournoi } from './ActionsTournoi';

interface Props {
    tournoi: TournoiResume;
    onModifie: (tournoi: Tournoi) => void;
}

export function LigneTournoiAdmin({ tournoi, onModifie }: Props) {
    return (
        <li className="ligne-admin ligne-cliquable row align-items-center g-0 gx-4 gy-3">
            <div className="d-none d-md-block col-md-1">
                <LogoJeu nomJeu={tournoi.jeu.nomJeu} taille={56} />
            </div>
            <div className="col-12 col-md-5 d-flex flex-column gap-1">
                <Link to={`/admin/tournois/${tournoi.idTournoi}`} className="ligne-nom ligne-lien lien-etendu">{tournoi.nomTournoi}</Link>
                <span className="small text-body-secondary">
                    {tournoi.jeu.nomJeu} · {tournoi.nombreEquipesInscrites}/{tournoi.nombreEquipes} équipes
                </span>
            </div>
            <div className="col-12 col-md-2 d-flex align-items-center gap-2">
                <span className={POINT_STATUT[tournoi.statutTournoi]} />
                {LIBELLES_STATUT[tournoi.statutTournoi]}
            </div>
            <div className="col-12 col-md-4 d-flex flex-wrap align-items-center justify-content-md-end gap-3 carte-actions">
                <ActionsTournoi tournoi={tournoi} onModifie={onModifie} compact />
            </div>
        </li>
    );
}
