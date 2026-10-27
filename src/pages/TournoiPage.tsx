/**
 * Page /tournois/:idTournoi — publique (B-02, B-19) : le tournoi, ses équipes et
 * son arbre, mis à jour en direct pendant la compétition. Un joueur connecté y
 * crée son équipe ou demande à en rejoindre une (B-05, B-06).
 */

import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { BoutonDemande } from '../components/equipe/BoutonDemande';
import { ModaleCreationEquipe } from '../components/equipe/ModaleCreationEquipe';
import { ArbreTournoi } from '../components/tournoi/ArbreTournoi';
import { EnteteTournoi } from '../components/tournoi/EnteteTournoi';
import { EtatChargement } from '../components/tournoi/EtatChargement';
import { ListeEquipes } from '../components/tournoi/ListeEquipes';
import { SectionTournoi } from '../components/tournoi/SectionTournoi';
import { placesRestantes } from '../components/tournoi/presentation';
import { IconeFleche } from '../components/ui/IconeFleche';
import { useAuth } from '../context/useAuth';
import { useMesParticipations } from '../hooks/useMesParticipations';
import { useTournoi } from '../hooks/useTournoi';
import type { EquipeDuTournoi } from '../types/api';

export function TournoiPage() {
    const idTournoi = Number(useParams().idTournoi);
    const navigate = useNavigate();
    const { utilisateur } = useAuth();
    const { tournoi, equipes, arbre, erreur, introuvable, recharger } = useTournoi(idTournoi);
    const participations = useMesParticipations(utilisateur !== null);
    const [creation, setCreation] = useState(false);

    if (!tournoi) return <EtatChargement introuvable={introuvable} erreur={erreur} onRecharger={recharger} />;

    const recrute = tournoi.statutTournoi === 'INSCRIPTIONS_OUVERTES';
    const monEquipe = participations.equipes.find((e) => e.idTournoi === idTournoi);
    const demandeEnAttente = (idEquipe: number) => participations.demandes.some((d) => d.idEquipe === idEquipe);

    // Sur la carte d'une équipe : rejoindre, tant qu'on n'a pas d'équipe ici et qu'il reste une place (B-06, B-07).
    const actionsEquipe = (equipe: EquipeDuTournoi) => {
        if (!recrute || !utilisateur || monEquipe) return null;
        if (demandeEnAttente(equipe.idEquipe)) return <span className="libelle small">Demande envoyée</span>;
        if (equipe.nombreMembres >= tournoi.jeu.joueursParEquipe) return null;
        return <BoutonDemande idEquipe={equipe.idEquipe} onDemandee={participations.recharger} />;
    };

    const sectionEquipes = (
        <SectionTournoi key="equipes" surtitre="Participants" titre="Équipes">
            <ListeEquipes
                equipes={equipes}
                joueursParEquipe={tournoi.jeu.joueursParEquipe}
                placesLibres={recrute ? placesRestantes(tournoi) : 0}
                actions={actionsEquipe}
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
                    <Link to="/connexion" state={{ depuis: `/tournois/${idTournoi}` }} className="btn-principal">
                        Se connecter pour participer <IconeFleche />
                    </Link>
                )}
                {monEquipe && (
                    <Link to={`/equipes/${monEquipe.idEquipe}`} className="btn-principal">
                        Mon équipe : {monEquipe.nomEquipe} <IconeFleche />
                    </Link>
                )}
                {recrute && utilisateur && !monEquipe && !participations.chargement && (
                    <>
                        <button type="button" className="btn-principal" onClick={() => setCreation(true)}>Créer mon équipe</button>
                        <span className="small text-body-secondary">ou demandez à rejoindre une équipe ci-dessous</span>
                    </>
                )}
                {utilisateur?.estAdministrateur && (
                    <Link to={`/admin/tournois/${tournoi.idTournoi}`} className="lien-souligne">Gérer ce tournoi</Link>
                )}
            </EnteteTournoi>
            {/* Tant que le tournoi recrute, les équipes intéressent plus que l'arbre, encore vide. */}
            {recrute ? [sectionEquipes, sectionArbre] : [sectionArbre, sectionEquipes]}

            <ModaleCreationEquipe
                visible={creation}
                tournoi={tournoi}
                onFermer={() => setCreation(false)}
                onCree={(equipe) => navigate(`/equipes/${equipe.idEquipe}`)}
            />
        </div>
    );
}
