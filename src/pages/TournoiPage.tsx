/**
 * Page /tournois/:idTournoi — publique (B-02, B-19) : le tournoi, ses équipes et
 * son arbre, mis à jour en direct pendant la compétition.
 */

import { Link, useParams } from 'react-router-dom';

import { ArbreTournoi } from '../components/tournoi/ArbreTournoi';
import { EnteteTournoi } from '../components/tournoi/EnteteTournoi';
import { EtatChargement } from '../components/tournoi/EtatChargement';
import { ListeEquipes } from '../components/tournoi/ListeEquipes';
import { SectionTournoi } from '../components/tournoi/SectionTournoi';
import { placesRestantes } from '../components/tournoi/presentation';
import { IconeFleche } from '../components/ui/IconeFleche';
import { useAuth } from '../context/useAuth';
import { useTournoi } from '../hooks/useTournoi';

export function TournoiPage() {
    const idTournoi = Number(useParams().idTournoi);
    const { utilisateur } = useAuth();
    const { tournoi, equipes, arbre, erreur, introuvable, recharger } = useTournoi(idTournoi);

    if (!tournoi) return <EtatChargement introuvable={introuvable} erreur={erreur} onRecharger={recharger} />;

    const recrute = tournoi.statutTournoi === 'INSCRIPTIONS_OUVERTES';

    const sectionEquipes = (
        <SectionTournoi key="equipes" surtitre="Participants" titre="Équipes">
            <ListeEquipes
                equipes={equipes}
                joueursParEquipe={tournoi.jeu.joueursParEquipe}
                placesLibres={recrute ? placesRestantes(tournoi) : 0}
            />
        </SectionTournoi>
    );
    const sectionArbre = (
        <SectionTournoi key="arbre" surtitre="Compétition" titre="Arbre">
            <ArbreTournoi arbre={arbre} lance={tournoi.statutTournoi === 'EN_COURS' || tournoi.statutTournoi === 'TERMINE'} />
        </SectionTournoi>
    );

    return (
        <div className="pb-5">
            <EnteteTournoi tournoi={tournoi}>
                {recrute && !utilisateur && (
                    <Link to="/connexion" className="btn-principal">Se connecter pour participer <IconeFleche /></Link>
                )}
                {recrute && utilisateur && (
                    <>
                        {/* La création d'équipe (POST /api/tournois/{id}/equipes) arrive avec le chantier des équipes. */}
                        <button type="button" className="btn-principal" disabled>Créer son équipe</button>
                        <span className="small text-body-secondary">Bientôt disponible</span>
                    </>
                )}
                {utilisateur?.estAdministrateur && (
                    <Link to={`/admin/tournois/${tournoi.idTournoi}`} className="lien-souligne">Gérer ce tournoi</Link>
                )}
            </EnteteTournoi>
            {/* Tant que le tournoi recrute, les équipes intéressent plus que l'arbre, encore vide. */}
            {recrute ? [sectionEquipes, sectionArbre] : [sectionArbre, sectionEquipes]}
        </div>
    );
}
