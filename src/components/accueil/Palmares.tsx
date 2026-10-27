/**
 * Le palmarès : les derniers tournois terminés et leur vainqueur. Tout vient de
 * l'API (le tournoi, puis ses équipes pour trouver celle qui a gagné) : un tournoi
 * qui se termine entre dans le palmarès sans toucher au code.
 */

import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';

import { useVainqueur } from '../../hooks/useVainqueur';
import type { TournoiResume } from '../../types/api';
import { IconePoste } from '../jeux/IconePoste';
import { LogoJeu } from '../jeux/LogoJeu';
import { dotationAffichee } from '../tournoi/dotations';
import { identiteJeu } from '../tournoi/identitesJeux';
import { dateLongue } from '../tournoi/presentation';
import { estSolo } from '../tournoi/vocabulaire';
import { Revele } from '../vitrine/Revele';
import { EnteteSection } from './EnteteSection';

function CartePalmares({ tournoi }: { tournoi: TournoiResume }) {
    const vainqueur = useVainqueur(tournoi.idTournoi);
    const { couleur } = identiteJeu(tournoi.jeu.nomJeu);

    return (
        <article className="palmares-carte" style={{ '--jeu-couleur': couleur } as CSSProperties} data-lumiere>
            <div className="d-flex align-items-center justify-content-between gap-3">
                <LogoJeu nomJeu={tournoi.jeu.nomJeu} taille={44} titre />
                <span className="palmares-coupe"><IconePoste libelle="trophée" taille={26} nomIcone="trophy" /></span>
            </div>
            <div className="d-flex flex-column gap-1">
                <span className="libelle small text-body-secondary">{estSolo(tournoi.jeu.joueursParEquipe) ? 'Champion' : 'Champions'}</span>
                <h3 className="palmares-vainqueur titre-condense m-0">
                    {vainqueur ? vainqueur.nomEquipe : <span className="squelette squelette-ligne" aria-hidden="true" />}
                </h3>
                <Link to={`/tournois/${tournoi.idTournoi}`} className="palmares-tournoi lien-etendu">{tournoi.nomTournoi}</Link>
                <span className="small text-body-secondary">{tournoi.jeu.nomJeu} · {dateLongue(tournoi.creeLe)}</span>
            </div>
            <span className="palmares-dotation">{dotationAffichee(tournoi)}</span>
        </article>
    );
}

export function Palmares({ tournois }: { tournois: TournoiResume[] }) {
    if (tournois.length === 0) return null;
    return (
        <section className="container-xxl px-4 px-lg-5 section-vitrine d-flex flex-column gap-4">
            <Revele><EnteteSection surtitre="Palmarès" titre="Ils ont gagné" /></Revele>
            <ul className="palmares">
                {tournois.map((tournoi, i) => (
                    <li key={tournoi.idTournoi}>
                        <Revele delai={i * 90} className="h-100"><CartePalmares tournoi={tournoi} /></Revele>
                    </li>
                ))}
            </ul>
        </section>
    );
}
