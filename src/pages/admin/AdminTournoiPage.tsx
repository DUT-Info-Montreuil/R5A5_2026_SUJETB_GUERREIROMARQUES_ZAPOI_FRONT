/**
 * Page /admin/tournois/:idTournoi — la page du tournoi, avec les commandes de
 * l'administrateur : renommer, faire avancer le tournoi, saisir les résultats.
 */

import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import { ActionsTournoi } from '../../components/admin/ActionsTournoi';
import { FormulaireRenommage } from '../../components/admin/FormulaireRenommage';
import { ModaleResultat } from '../../components/admin/ModaleResultat';
import { ArbreTournoi } from '../../components/tournoi/ArbreTournoi';
import { EnteteTournoi } from '../../components/tournoi/EnteteTournoi';
import { EtatChargement } from '../../components/tournoi/EtatChargement';
import { ListeEquipes } from '../../components/tournoi/ListeEquipes';
import { SectionTournoi } from '../../components/tournoi/SectionTournoi';
import { useTournoi } from '../../hooks/useTournoi';
import type { Rencontre, StatutTournoi } from '../../types/api';

// Pas de consigne tant que les inscriptions sont ouvertes : l'arbre vide le dit déjà.
const CONSIGNES: Partial<Record<StatutTournoi, string>> = {
    INSCRIPTIONS_CLOSES: 'Les résultats se saisissent une fois le tournoi lancé.',
    EN_COURS: 'Saisissez le résultat de chaque rencontre jouable : le vainqueur passe au tour suivant.',
    TERMINE: 'Le tournoi est terminé.',
};

export function AdminTournoiPage() {
    const idTournoi = Number(useParams().idTournoi);
    const { tournoi, equipes, arbre, erreur, introuvable, recharger } = useTournoi(idTournoi);
    const [aSaisir, setASaisir] = useState<Rencontre | null>(null);

    if (!tournoi) return <EtatChargement introuvable={introuvable} erreur={erreur} onRecharger={recharger} />;

    const enCours = tournoi.statutTournoi === 'EN_COURS';
    const actionsRencontre = (rencontre: Rencontre) =>
        enCours && rencontre.statutRencontre === 'JOUABLE' ? (
            <button type="button" className="bouton-texte small" onClick={() => setASaisir(rencontre)}>
                Saisir le résultat
            </button>
        ) : null;

    return (
        <div className="pb-5">
            <EnteteTournoi tournoi={tournoi} surtitre={`Administration · ${tournoi.jeu.nomJeu}`}>
                <ActionsTournoi tournoi={tournoi} onModifie={recharger} />
                <FormulaireRenommage tournoi={tournoi} onModifie={recharger} />
                <Link to={`/tournois/${tournoi.idTournoi}`} className="lien-souligne">Page publique</Link>
                <Link to="/admin/tournois" className="lien-souligne">Tous les tournois</Link>
            </EnteteTournoi>

            <SectionTournoi surtitre="Compétition" titre="Arbre" entete={CONSIGNES[tournoi.statutTournoi] && <p className="texte-section m-0">{CONSIGNES[tournoi.statutTournoi]}</p>}>
                <ArbreTournoi arbre={arbre} lance={tournoi.statutTournoi === 'EN_COURS' || tournoi.statutTournoi === 'TERMINE'} actions={actionsRencontre} />
            </SectionTournoi>

            <SectionTournoi surtitre="Participants" titre="Équipes">
                <ListeEquipes equipes={equipes} joueursParEquipe={tournoi.jeu.joueursParEquipe} placesLibres={0} />
            </SectionTournoi>

            {aSaisir && (
                <ModaleResultat
                    key={aSaisir.idRencontre}
                    rencontre={aSaisir}
                    onFermer={() => setASaisir(null)}
                    onEnregistre={() => {
                        setASaisir(null);
                        recharger();
                    }}
                />
            )}
        </div>
    );
}
