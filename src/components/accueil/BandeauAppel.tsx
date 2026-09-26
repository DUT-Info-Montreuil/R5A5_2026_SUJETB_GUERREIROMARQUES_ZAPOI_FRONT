/** Appel à s'inscrire, à partir du premier tournoi qui recrute encore. */

import { Link } from 'react-router-dom';

import type { TournoiResume } from '../../types/api';
import { placesRestantes } from '../tournoi/presentation';

interface Props {
    tournoi: TournoiResume;
    estConnecte: boolean;
}

export function BandeauAppel({ tournoi, estConnecte }: Props) {
    const places = placesRestantes(tournoi);

    return (
        <section className="container-xxl px-4 px-lg-5 pb-5">
            <div className="appel">
                <div className="d-flex flex-column gap-3">
                    <h2 className="appel-titre titre-condense m-0">
                        Ton équipe.
                        <br />
                        Ton tournoi.
                    </h2>
                    <p className="appel-texte m-0">
                        {tournoi.nomTournoi} cherche encore {places} {places > 1 ? 'équipes' : 'équipe'}. Les inscriptions ferment à la décision de
                        l'administrateur.
                    </p>
                </div>
                {!estConnecte && (
                    <Link to="/inscription" className="btn-sombre">Créer un compte</Link>
                )}
            </div>
        </section>
    );
}
