/**
 * Page /admin/tournois — tous les tournois, avec leur prochaine étape à un clic,
 * et la création d'un nouveau tournoi.
 */

import { useState } from 'react';
import { Alert, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

import { EnteteSection } from '../../components/accueil/EnteteSection';
import { LigneTournoiAdmin } from '../../components/admin/LigneTournoiAdmin';
import { ModaleCreationTournoi } from '../../components/admin/ModaleCreationTournoi';
import { FiltresTournois } from '../../components/tournoi/FiltresTournois';
import { useTournois } from '../../hooks/useTournois';
import type { FiltreTournois } from '../../types/api';

export function AdminTournoisPage() {
    const navigate = useNavigate();
    const [filtre, setFiltre] = useState<FiltreTournois>({});
    const { tournois, chargement, erreur, recharger } = useTournois(filtre);
    const [creation, setCreation] = useState(false);

    return (
        <section className="container-xxl px-4 px-lg-5 section-tournoi d-flex flex-column gap-4 pb-5">
            <EnteteSection surtitre="Administration" titre="Tournois">
                <button type="button" className="btn-principal" onClick={() => setCreation(true)}>Créer un tournoi</button>
            </EnteteSection>

            <FiltresTournois filtre={filtre} onChange={setFiltre} />

            {erreur && (
                <Alert variant="danger" className="d-flex justify-content-between align-items-center">
                    {erreur}
                    <button type="button" className="bouton-texte" onClick={recharger}>Réessayer</button>
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
                        <LigneTournoiAdmin key={tournoi.idTournoi} tournoi={tournoi} onModifie={recharger} />
                    ))}
                </ul>
            )}

            <ModaleCreationTournoi
                visible={creation}
                onFermer={() => setCreation(false)}
                onCree={(tournoi) => navigate(`/admin/tournois/${tournoi.idTournoi}`)}
            />
        </section>
    );
}
