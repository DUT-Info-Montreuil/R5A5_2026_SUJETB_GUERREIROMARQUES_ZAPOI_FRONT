/**
 * Page /jeux — le catalogue : chaque jeu avec son logo, ses postes et ses
 * tournois. La liste des jeux vient de l'API (GET /api/jeux) : un jeu sans
 * tournoi apparaît quand même.
 */

import { Alert, Spinner } from 'react-bootstrap';

import { EnteteSection } from '../components/accueil/EnteteSection';
import { CarteJeu } from '../components/jeux/CarteJeu';
import { useJeux } from '../hooks/useJeux';
import { useTitrePage } from '../hooks/useTitrePage';
import { useTournois } from '../hooks/useTournois';
import type { FiltreTournois } from '../types/api';

const SANS_FILTRE: FiltreTournois = {};

export function JeuxPage() {
    useTitrePage('Jeux');
    const { jeux, chargement, erreur } = useJeux();
    const { tournois } = useTournois(SANS_FILTRE);

    return (
        <section className="container-xxl px-4 px-lg-5 section-tournoi d-flex flex-column gap-5 pb-5">
            <EnteteSection surtitre="Les jeux" titre="Choisis ton terrain">
                <p className="texte-section m-0">
                    Des jeux en équipes, avec des postes définis. Chaque tournoi garde les postes propres à son jeu :
                    cinq joueurs, un rôle chacun.
                </p>
            </EnteteSection>

            {erreur && <Alert variant="danger">{erreur}</Alert>}
            {chargement && <div className="py-5 text-center"><Spinner aria-label="Chargement des jeux" /></div>}

            <div className="jeux">
                {jeux.map((jeu) => (
                    <CarteJeu key={jeu.idJeu} jeu={jeu} tournois={tournois.filter((t) => t.jeu.idJeu === jeu.idJeu)} />
                ))}
            </div>
        </section>
    );
}
