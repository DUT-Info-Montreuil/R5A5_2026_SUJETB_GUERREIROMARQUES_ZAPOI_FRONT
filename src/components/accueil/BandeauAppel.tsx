/** Appel final à s'inscrire : un grand bandeau coloré, à la fin de la page d'accueil. */

import { Link } from 'react-router-dom';

import type { TournoiResume } from '../../types/api';
import { LogoJeu } from '../jeux/LogoJeu';
import { IconeFleche } from '../ui/IconeFleche';
import { Revele } from '../vitrine/Revele';
import { placesRestantes } from '../tournoi/presentation';

interface Props {
    /** Le premier tournoi qui recrute, s'il y en a un : sa place libre sert d'argument. */
    tournoi?: TournoiResume;
    estConnecte: boolean;
    jeux: string[];
}

export function BandeauAppel({ tournoi, estConnecte, jeux }: Props) {
    const places = tournoi ? placesRestantes(tournoi) : 0;

    return (
        <section className="container-xxl px-4 px-lg-5 pb-5">
            <Revele>
                <div className="appel">
                    <div className="appel-logos" aria-hidden="true">
                        {jeux.slice(0, 4).map((nom, i) => <LogoJeu key={nom} nomJeu={nom} taille={56} className={`appel-logo appel-logo-${i + 1}`} />)}
                    </div>
                    <div className="d-flex flex-column gap-3 appel-texte-bloc">
                        <h2 className="appel-titre titre-condense m-0">
                            Ton équipe.
                            <br />
                            Ton tournoi.
                        </h2>
                        <p className="appel-texte m-0">
                            {tournoi
                                ? `${tournoi.nomTournoi} cherche encore ${places} ${places > 1 ? 'équipes' : 'équipe'}. Crée ton compte, monte ton équipe et viens jouer.`
                                : "Crée ton compte, monte ton équipe et viens jouer."}
                        </p>
                        <div className="d-flex flex-wrap gap-3 pt-2">
                            {estConnecte ? (
                                <Link to="/tournois?statut=INSCRIPTIONS_OUVERTES" className="btn-sombre">Voir les tournois ouverts <IconeFleche /></Link>
                            ) : (
                                <Link to="/inscription" className="btn-sombre">Créer un compte <IconeFleche /></Link>
                            )}
                            <Link to="/jeux" className="btn-clair-contour">Découvrir les jeux</Link>
                        </div>
                    </div>
                </div>
            </Revele>
        </section>
    );
}
