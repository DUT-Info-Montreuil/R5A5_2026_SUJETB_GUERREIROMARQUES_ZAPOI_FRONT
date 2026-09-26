/** Grand bandeau du tournoi mis en avant, en haut de l'accueil. */

import { Link } from 'react-router-dom';

import type { TournoiResume } from '../../types/api';
import { IconeFleche } from '../ui/IconeFleche';
import { LIBELLES_STATUT, POINT_STATUT } from './presentation';

interface Props {
    tournoi: TournoiResume;
    estConnecte: boolean;
}

export function HeroTournoi({ tournoi, estConnecte }: Props) {
    // « Coupe Inter-IUT — Automne 2026 » s'affiche sur deux lignes.
    const lignes = tournoi.nomTournoi.split(' — ');

    return (
        <section className="hero">
            <div className="container-xxl px-4 px-lg-5 d-flex flex-column gap-4">
                <p className="libelle apparition d-flex align-items-center gap-3 m-0">
          <span className="d-inline-flex align-items-center gap-2">
            <span className={POINT_STATUT[tournoi.statutTournoi]} />
              {tournoi.statutTournoi === 'EN_COURS' ? 'En direct' : LIBELLES_STATUT[tournoi.statutTournoi]}
          </span>
                    <span className="text-body-tertiary">/</span>
                    <span className="text-body-secondary">
            {tournoi.jeu.nomJeu} · {tournoi.nombreEquipesInscrites} / {tournoi.nombreEquipes} équipes
          </span>
                </p>

                <h1 className="hero-titre titre-condense m-0">
                    {lignes.map((ligne) => (
                        <span key={ligne} className="ligne-revelee">
              <span>{ligne}</span>
            </span>
                    ))}
                </h1>

                <div className="apparition d-flex flex-wrap align-items-center gap-4 pt-2">
                    <a href="#calendrier" className="btn-principal">
                        Voir le calendrier <IconeFleche />
                    </a>
                    {!estConnecte && (
                        <Link to="/inscription" className="lien-souligne">
                            Créer un compte pour jouer
                        </Link>
                    )}
                </div>
            </div>
        </section>
    );
}
