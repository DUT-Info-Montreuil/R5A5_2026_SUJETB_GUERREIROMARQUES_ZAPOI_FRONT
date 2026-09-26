/**
 * La une : jusqu'à trois tournois qui défilent, avec onglets et barre de
 * progression. Le visuel, le titre et le texte se rejouent à chaque changement.
 */

import { Link } from 'react-router-dom';

import { useCarrousel } from '../../hooks/useCarrousel';
import type { TournoiResume } from '../../types/api';
import { IconeFleche } from '../ui/IconeFleche';
import { EnteteDiapositive } from './EnteteDiapositive';
import { VisuelJeu } from './VisuelJeu';
import { dateLongue, descriptionTournoi } from './presentation';

const DUREE_DIAPOSITIVE_MS = 6000;

interface Props {
    tournois: TournoiResume[];
    estConnecte: boolean;
}

export function CarrouselUne({ tournois, estConnecte }: Props) {
    const { actif, choisir, defilementAuto, cle } = useCarrousel(tournois.length, DUREE_DIAPOSITIVE_MS);
    const tournoi = tournois[actif];
    if (!tournoi) return null;

    const inscriptionPossible = tournoi.statutTournoi === 'INSCRIPTIONS_OUVERTES' && !estConnecte;

    return (
        <section className="une" aria-roledescription="carrousel" aria-label="Tournois à la une">
            {/* key : changer de diapositive recrée le bloc, donc rejoue ses animations. */}
            <div key={tournoi.idTournoi} className="une-diapositive">
                <VisuelJeu nomJeu={tournoi.jeu.nomJeu} className="une-visuel" />
                <div className="une-voile" />
                <div className="une-contenu container-xxl px-4 px-lg-5">
                    <EnteteDiapositive tournoi={tournoi} />
                    <p className="une-texte apparition">{descriptionTournoi(tournoi)}</p>
                    <div className="apparition-lente d-flex flex-wrap align-items-center gap-4 pt-1">
                        {inscriptionPossible ? (
                            <Link to="/inscription" className="btn-principal">Créer un compte <IconeFleche /></Link>
                        ) : (
                            <a href="#calendrier" className="btn-principal">Voir le calendrier <IconeFleche /></a>
                        )}
                        <span className="une-meta">
              {dateLongue(tournoi.creeLe)} · {tournoi.nombreEquipesInscrites}/{tournoi.nombreEquipes} équipes · Élimination directe
            </span>
                    </div>
                </div>
            </div>

            {tournois.length > 1 && (
                <div className="une-onglets" role="tablist" aria-label="Choisir un tournoi">
                    {tournois.map((t, i) => (
                        <button key={t.idTournoi} type="button" role="tab" aria-selected={i === actif} className="une-onglet" onClick={() => choisir(i)}>
                            {i === actif && defilementAuto && <span key={cle} className="une-progression" />}
                            <span className="libelle small">0{i + 1} · {t.jeu.nomJeu}</span>
                            <span className="une-onglet-titre">{t.nomTournoi.split(' — ')[0]}</span>
                        </button>
                    ))}
                </div>
            )}
        </section>
    );
}
