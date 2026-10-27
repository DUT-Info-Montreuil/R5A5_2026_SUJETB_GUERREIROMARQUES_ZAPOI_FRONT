/** Une demande d'adhésion qui attend la réponse d'un capitaine. */

import { Link } from 'react-router-dom';

import type { MaDemande, TournoiResume } from '../../types/api';
import { LogoJeu } from '../jeux/LogoJeu';
import { dateLongue } from '../tournoi/presentation';

interface Props {
    demande: MaDemande;
    tournoi?: TournoiResume;
}

export function CarteMaDemande({ demande, tournoi }: Props) {
    return (
        <li className="carte-demande">
            {tournoi && <LogoJeu nomJeu={tournoi.jeu.nomJeu} taille={44} />}
            <div className="d-flex flex-column gap-1 flex-grow-1">
                <Link to={`/equipes/${demande.idEquipe}`} className="carte-demande-nom ligne-lien">{demande.nomEquipe}</Link>
                <span className="small text-body-secondary">{demande.nomTournoi} · demandée le {dateLongue(demande.creeLe)}</span>
            </div>
            <span className="etiquette etiquette-attente">
                <span className="sablier" aria-hidden="true" /> En attente du capitaine
            </span>
        </li>
    );
}
