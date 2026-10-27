import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';

import type { TournoiResume } from '../../types/api';
import { LogoJeu } from '../jeux/LogoJeu';
import { dotationAffichee } from './dotations';
import { identiteJeu } from './identitesJeux';
import { LIBELLES_STATUT, POINT_STATUT, jourEtMois } from './presentation';
import { motParticipants } from './vocabulaire';

/** Jauge de remplissage : une case par place, pleine quand une équipe l'occupe. */
function JaugeEquipes({ inscrites, total, mot }: { inscrites: number; total: number; mot: string }) {
    return (
        <span className="jauge" role="img" aria-label={`${inscrites} ${mot} inscrits sur ${total}`}>
            {Array.from({ length: total }, (_, i) => (
                <span key={i} className={i < inscrites ? 'jauge-case jauge-pleine' : 'jauge-case'} />
            ))}
        </span>
    );
}

/**
 * Une ligne du calendrier : date, logo du jeu, nom, état, dotation, remplissage.
 * Toute la ligne est cliquable : le lien du nom s'étend sur elle (lien-etendu).
 */
export function LigneTournoi({ tournoi }: { tournoi: TournoiResume }) {
    const { jour, mois } = jourEtMois(tournoi.creeLe);

    return (
        <li className="ligne-tournoi row align-items-center g-0 gx-3 gx-md-4" style={{ '--jeu-couleur': identiteJeu(tournoi.jeu.nomJeu).couleur } as CSSProperties}>
            <div className="col-2 col-md-1 d-flex flex-column">
                <span className="ligne-jour">{jour}</span>
                <span className="libelle small text-body-secondary">{mois}</span>
            </div>
            <div className="col-auto d-none d-sm-block">
                <LogoJeu nomJeu={tournoi.jeu.nomJeu} taille={56} className="ligne-logo" />
            </div>
            <div className="ligne-titre col d-flex flex-column gap-1">
                {/* Le décalage au survol s'applique aux textes, jamais au lien : un parent transformé
                    deviendrait le repère du lien étendu, et le clic sur la ligne serait perdu. */}
                <Link to={`/tournois/${tournoi.idTournoi}`} className="ligne-nom ligne-lien lien-etendu">
                    <span className="ligne-decalable">{tournoi.nomTournoi}</span>
                </Link>
                <span className="small text-body-secondary ligne-decalable">{tournoi.jeu.nomJeu} · Élimination directe</span>
            </div>
            <div className="col-12 col-lg-auto d-flex flex-wrap align-items-center gap-3 gap-lg-4 mt-3 mt-lg-0 ligne-infos">
                <span className="d-flex align-items-center gap-2 ligne-statut">
                    <span className={POINT_STATUT[tournoi.statutTournoi]} />
                    {LIBELLES_STATUT[tournoi.statutTournoi]}
                </span>
                <span className="ligne-dotation">{dotationAffichee(tournoi)}</span>
                <span className="d-flex align-items-center gap-3 ms-lg-auto">
                    <JaugeEquipes inscrites={tournoi.nombreEquipesInscrites} total={tournoi.nombreEquipes} mot={motParticipants(tournoi.jeu.joueursParEquipe)} />
                    <span className="small text-body-secondary">{tournoi.nombreEquipesInscrites}/{tournoi.nombreEquipes}</span>
                </span>
            </div>
        </li>
    );
}
