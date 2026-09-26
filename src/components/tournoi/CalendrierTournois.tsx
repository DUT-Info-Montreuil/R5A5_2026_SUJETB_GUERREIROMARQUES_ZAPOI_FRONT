/** Calendrier : titre, filtres, et la liste avec ses trois états (chargement, erreur, vide). */

import { Alert, Spinner } from 'react-bootstrap';

import type { FiltreTournois, TournoiResume } from '../../types/api';
import { EnteteSection } from '../accueil/EnteteSection';
import { FiltresTournois } from './FiltresTournois';
import { LigneTournoi } from './LigneTournoi';

interface Props {
    tournois: TournoiResume[];
    chargement: boolean;
    erreur: string | null;
    onRecharger: () => void;
    filtre: FiltreTournois;
    onFiltreChange: (filtre: FiltreTournois) => void;
}

export function CalendrierTournois({ tournois, chargement, erreur, onRecharger, filtre, onFiltreChange }: Props) {
    return (
        <section id="calendrier" className="container-xxl px-4 px-lg-5 section-accueil d-flex flex-column gap-4">
            <EnteteSection surtitre="Calendrier" titre="Tous les tournois">
                {/* key : la saisie repart de l'URL si elle change (bouton « Retour »). */}
                <FiltresTournois key={filtre.recherche ?? ''} filtre={filtre} onChange={onFiltreChange} />
            </EnteteSection>

            {erreur && (
                <Alert variant="danger" className="d-flex justify-content-between align-items-center">
                    {erreur}
                    <button type="button" className="bouton-texte" onClick={onRecharger}>Réessayer</button>
                </Alert>
            )}

            {chargement && tournois.length === 0 && (
                <div className="py-5 text-center"><Spinner aria-label="Chargement des tournois" /></div>
            )}

            {!chargement && !erreur && tournois.length === 0 && (
                <p className="py-5 text-center text-body-secondary">Aucun tournoi ne correspond.</p>
            )}

            {tournois.length > 0 && (
                <ul className="calendrier" aria-busy={chargement}>
                    {tournois.map((tournoi) => (
                        <LigneTournoi key={tournoi.idTournoi} tournoi={tournoi} />
                    ))}
                </ul>
            )}
        </section>
    );
}
