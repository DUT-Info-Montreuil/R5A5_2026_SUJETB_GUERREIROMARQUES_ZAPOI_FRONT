import type { TournoiResume } from '../../types/api';

/** Étiquette d'état, jeu, et grand titre sur deux lignes. */
export function EnteteDiapositive({ tournoi }: { tournoi: TournoiResume }) {
    // « Coupe Inter-IUT — Automne 2026 » s'affiche sur deux lignes.
    const lignes = tournoi.nomTournoi.split(' — ');

    return (
        <>
            <p className="libelle apparition d-flex flex-wrap align-items-center gap-3 m-0">
                {tournoi.statutTournoi === 'EN_COURS' && (
                    <span className="etiquette etiquette-pleine">
            <span className="point point-blanc point-direct" /> En direct
          </span>
                )}
                {tournoi.statutTournoi === 'INSCRIPTIONS_OUVERTES' && <span className="etiquette">Inscriptions ouvertes</span>}
                {tournoi.statutTournoi === 'INSCRIPTIONS_CLOSES' && <span className="etiquette">Inscriptions closes</span>}
                <span className="text-body-secondary">{tournoi.jeu.nomJeu}</span>
            </p>
            <h1 className="une-titre titre-condense m-0">
                {lignes.map((ligne) => (
                    <span key={ligne} className="ligne-revelee">
            <span>{ligne}</span>
          </span>
                ))}
            </h1>
        </>
    );
}
