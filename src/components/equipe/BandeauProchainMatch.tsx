/**
 * « Mon prochain match » : pour une équipe encore en lice dans un tournoi lancé,
 * le tour, l'adversaire et un lien vers l'arbre. Il suit le tournoi en temps
 * réel (useTournoi) : dès qu'un résultat tombe, le bandeau passe au match suivant.
 */

import { Link } from 'react-router-dom';

import { useTournoi } from '../../hooks/useTournoi';
import type { MonEquipe } from '../../types/api';
import { IconeFleche } from '../ui/IconeFleche';
import { nomDuTour, prochainMatch } from './prochainMatch';

interface Props {
    equipe: MonEquipe;
}

export function BandeauProchainMatch({ equipe }: Props) {
    const { arbre, chargement, erreur } = useTournoi(equipe.idTournoi);

    if (chargement) return <div className="bandeau-match bandeau-match-attente" aria-hidden="true"><span className="squelette" /></div>;
    if (erreur) return null;

    const suivant = prochainMatch(arbre, equipe.idEquipe);
    if (!suivant) return null;

    const { rencontre, adversaire, jouable } = suivant;
    return (
        <article className={jouable ? 'bandeau-match bandeau-match-jouable' : 'bandeau-match'} data-lumiere>
            <div className="d-flex flex-column gap-1">
                <span className="surtitre">{jouable ? 'À jouer maintenant' : 'Prochain match'} · {nomDuTour(rencontre.tour, arbre)}</span>
                <p className="bandeau-match-duel m-0">
                    <span>{equipe.nomEquipe}</span>
                    <span className="bandeau-match-contre">contre</span>
                    <span className={adversaire ? '' : 'text-body-secondary'}>{adversaire?.nomEquipe ?? 'adversaire à déterminer'}</span>
                </p>
                <span className="small text-body-secondary">{equipe.nomTournoi}</span>
            </div>
            <Link to={`/tournois/${equipe.idTournoi}`} className="btn-contour">
                Voir l'arbre <IconeFleche />
            </Link>
        </article>
    );
}
