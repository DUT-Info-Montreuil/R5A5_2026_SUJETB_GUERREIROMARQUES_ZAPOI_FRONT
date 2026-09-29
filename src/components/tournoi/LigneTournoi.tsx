import { Link } from 'react-router-dom';

import type { TournoiResume } from '../../types/api';
import { VisuelJeu } from './VisuelJeu';
import { LIBELLES_STATUT, POINT_STATUT, jourEtMois } from './presentation';

/** Jauge de remplissage : une case par place, pleine quand une équipe l'occupe. */
function JaugeEquipes({ inscrites, total }: { inscrites: number; total: number }) {
    return (
        <span className="jauge" role="img" aria-label={`${inscrites} équipes inscrites sur ${total}`}>
      {Array.from({ length: total }, (_, i) => (
          <span key={i} className={i < inscrites ? 'jauge-case jauge-pleine' : 'jauge-case'} />
      ))}
    </span>
    );
}

/** Une ligne du calendrier : date, visuel, nom, état, remplissage. */
export function LigneTournoi({ tournoi }: { tournoi: TournoiResume }) {
    const { jour, mois } = jourEtMois(tournoi.creeLe);

    return (
        <li className="ligne-tournoi row align-items-center g-0 gx-4">
            <div className="col-3 col-md-1 d-flex flex-column">
                <span className="ligne-jour">{jour}</span>
                <span className="libelle small text-body-secondary">{mois}</span>
            </div>
            <div className="d-none d-md-block col-md-2">
                <VisuelJeu nomJeu={tournoi.jeu.nomJeu} className="ligne-visuel" />
            </div>
            <div className="ligne-titre col-9 col-md-4 d-flex flex-column gap-1">
                <Link to={`/tournois/${tournoi.idTournoi}`} className="ligne-nom ligne-lien">{tournoi.nomTournoi}</Link>
                <span className="small text-body-secondary">{tournoi.jeu.nomJeu} · Élimination directe</span>
            </div>
            <div className="col-6 col-md-2 d-flex align-items-center gap-2 mt-2 mt-md-0">
                <span className={POINT_STATUT[tournoi.statutTournoi]} />
                {LIBELLES_STATUT[tournoi.statutTournoi]}
            </div>
            <div className="col-6 col-md-3 d-flex align-items-center justify-content-end gap-3 mt-2 mt-md-0">
                <JaugeEquipes inscrites={tournoi.nombreEquipesInscrites} total={tournoi.nombreEquipes} />
                <span className="small text-body-secondary">{tournoi.nombreEquipesInscrites}/{tournoi.nombreEquipes}</span>
            </div>
        </li>
    );
}
