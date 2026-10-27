/**
 * Le contenu de la page d'une équipe : composition, demandes d'adhésion
 * (capitaine) et espace d'échange (membres), selon qui regarde.
 *
 * Aucun droit n'est déduit ici : on affiche des commandes en fonction de ce
 * que l'API a renvoyé (les membres de l'équipe, l'étape du tournoi), et l'API
 * refuse tout appel d'un autre que le capitaine.
 */

import { useState } from 'react';
import { Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

import { useAuth } from '../../context/useAuth';
import { useMessagerieContexte } from '../../context/useMessagerieContexte';
import { useDemandesEquipe } from '../../hooks/useDemandesEquipe';
import { useGestionEquipe } from '../../hooks/useGestionEquipe';
import { usePostes } from '../../hooks/usePostes';
import { useSuiviTournoi } from '../../hooks/useSuiviTournoi';
import type { FinDAcces } from '../../hooks/useChatEquipe';
import type { Equipe, Tournoi } from '../../types/api';
import { SectionTournoi } from '../tournoi/SectionTournoi';
import { estSolo } from '../tournoi/vocabulaire';
import { BoutonConfirme } from '../ui/BoutonConfirme';
import { ChatEquipe } from './ChatEquipe';
import { EnteteEquipe } from './EnteteEquipe';
import { FormulaireRenommageEquipe } from './FormulaireRenommageEquipe';
import { MembresEquipe } from './MembresEquipe';
import { PanneauDemandes } from './PanneauDemandes';
import { AVIS_ESPACE_FERME, AVIS_FIN_D_ACCES } from './presentation';

interface Props {
    equipe: Equipe;
    tournoi: Tournoi;
    onRecharger: () => void;
}

export function VueEquipe({ equipe, tournoi, onRecharger }: Props) {
    const { utilisateur } = useAuth();
    const messagerie = useMessagerieContexte();
    const navigate = useNavigate();
    const [finDAcces, setFinDAcces] = useState<FinDAcces | null>(null);

    const moi = equipe.membres.find((m) => m.idUtilisateur === utilisateur?.idUtilisateur);
    const estCapitaine = moi?.estCapitaine === true;
    const estAdministrateur = utilisateur?.estAdministrateur === true;
    const enLice = equipe.statutEquipe === 'EN_LICE';
    // B-11 : une fois les inscriptions closes, l'effectif et les postes ne bougent plus.
    const modifiable = tournoi.statutTournoi === 'INSCRIPTIONS_OUVERTES';
    const placeLibre = equipe.membres.length < tournoi.jeu.joueursParEquipe;
    // B-08 : pour jouer, l'équipe doit avoir tous ses joueurs ET un poste pour chacun, sinon elle est forfait au lancement.
    const joueursManquants = Math.max(0, tournoi.jeu.joueursParEquipe - equipe.membres.length);
    const sansPoste = equipe.membres.filter((m) => m.role === undefined).length;
    const incomplete = joueursManquants > 0 || sansPoste > 0;

    // Une clôture, une élimination : l'équipe affichée a changé, on la relit.
    useSuiviTournoi(tournoi.idTournoi, { surTournoi: onRecharger, surRencontre: onRecharger });

    const { postes } = usePostes(tournoi.jeu.idJeu);
    const gestion = useGestionEquipe(equipe.idEquipe, onRecharger);
    const { demandes, recharger: rechargerDemandes } = useDemandesEquipe(equipe.idEquipe, estCapitaine && modifiable);

    async function traiter(idDemande: number, statut: 'ACCEPTEE' | 'REFUSEE') {
        gestion.effacerErreur();
        if (await gestion.traiterDemande(idDemande, statut)) rechargerDemandes();
    }

    async function seDesister() {
        if (await gestion.dissoudre()) navigate('/mes-equipes');
    }

    function surFinDAcces(fin: FinDAcces) {
        setFinDAcces(fin);
        onRecharger();
    }

    // Le chat : membre d'une équipe en lice (il écrit), ou administrateur (il lit).
    const chatOuvert = utilisateur !== null && ((moi !== undefined && enLice) || estAdministrateur);
    const avisChat = finDAcces !== null
        ? AVIS_FIN_D_ACCES[finDAcces]
        : moi !== undefined && !enLice && !estAdministrateur
            ? AVIS_ESPACE_FERME[equipe.statutEquipe as Exclude<typeof equipe.statutEquipe, 'EN_LICE'>]
            : null;

    // Un jeu en solo : une inscription, rien à composer, personne avec qui échanger.
    if (estSolo(tournoi.jeu.joueursParEquipe)) {
        return (
            <div className="pb-5">
                <EnteteEquipe equipe={equipe} tournoi={tournoi}>
                    <Link to={`/tournois/${tournoi.idTournoi}`} className="lien-souligne">Page du tournoi</Link>
                    {utilisateur && <Link to="/mes-equipes" className="lien-souligne">Mes inscriptions</Link>}
                </EnteteEquipe>
                <SectionTournoi surtitre="Ton inscription" titre={moi ? 'Tu es inscrit' : 'Un joueur inscrit'}>
                    {gestion.erreur && <Alert variant="danger" className="m-0" dismissible onClose={gestion.effacerErreur}>{gestion.erreur}</Alert>}
                    <p className="text-body-secondary m-0">
                        {tournoi.jeu.nomJeu} se joue en solo : {moi ? 'tu' : equipe.nomEquipe} affronte{moi ? 's' : ''} les autres joueurs en
                        élimination directe. Rien d'autre à préparer : suis l'arbre du tournoi pour connaître ton prochain match.
                    </p>
                    {moi && modifiable && (
                        <BoutonConfirme
                            libelle="Annuler mon inscription"
                            avertissement="Ta place sera libérée pour un autre joueur."
                            desactive={gestion.envoi}
                            onConfirme={() => { gestion.effacerErreur(); void seDesister(); }}
                        />
                    )}
                </SectionTournoi>
            </div>
        );
    }

    return (
        <div className="pb-5">
            <EnteteEquipe equipe={equipe} tournoi={tournoi}>
                {estCapitaine && modifiable && (
                    <FormulaireRenommageEquipe
                        nomActuel={equipe.nomEquipe}
                        envoi={gestion.envoi}
                        onRenomme={async (nom) => { gestion.effacerErreur(); return gestion.renommer(nom); }}
                    />
                )}
                <Link to={`/tournois/${tournoi.idTournoi}`} className="lien-souligne">Page du tournoi</Link>
                {utilisateur && <Link to="/mes-equipes" className="lien-souligne">Mes équipes</Link>}
            </EnteteEquipe>

            <SectionTournoi
                surtitre="Composition"
                titre="Joueurs"
                entete={
                    <p className="texte-section m-0">
                        {modifiable
                            ? estCapitaine
                                ? 'Attribuez les postes, recrutez par les demandes, passez la main si besoin.'
                                : 'La composition peut encore changer jusqu\'à la clôture des inscriptions.'
                            : 'Les inscriptions sont closes : la composition est figée.'}
                    </p>
                }
            >
                {gestion.erreur && <Alert variant="danger" className="m-0" dismissible onClose={gestion.effacerErreur}>{gestion.erreur}</Alert>}
                {modifiable && enLice && incomplete && moi !== undefined && (
                    <Alert variant="warning" className="m-0">
                        Pour jouer, l'équipe doit compter {tournoi.jeu.joueursParEquipe} joueurs, chacun avec un poste.
                        {joueursManquants > 0 && ` Il manque ${joueursManquants} ${joueursManquants > 1 ? 'joueurs' : 'joueur'}.`}
                        {sansPoste > 0 && ` ${sansPoste} ${sansPoste > 1 ? 'joueurs n\'ont' : 'joueur n\'a'} pas de poste.`}
                        {' '}Sinon, elle est déclarée forfait au lancement.
                    </Alert>
                )}
                <MembresEquipe
                    membres={equipe.membres}
                    joueursParEquipe={tournoi.jeu.joueursParEquipe}
                    postes={postes}
                    moiId={utilisateur?.idUtilisateur}
                    estCapitaine={estCapitaine}
                    modifiable={modifiable}
                    envoi={gestion.envoi}
                    surPoste={(idUtilisateur, idRole) => { gestion.effacerErreur(); void gestion.attribuerPoste(idUtilisateur, idRole); }}
                    surPasserLaMain={(idUtilisateur) => { gestion.effacerErreur(); void gestion.passerLaMain(idUtilisateur); }}
                    surRetirer={(idUtilisateur) => { gestion.effacerErreur(); void gestion.retirer(idUtilisateur); }}
                />
            </SectionTournoi>

            {estCapitaine && modifiable && (
                <SectionTournoi surtitre="Zone sensible" titre="Se désister">
                    <div className="d-flex flex-column gap-3 align-items-start">
                        <p className="text-body-secondary m-0">
                            Dissoudre l'équipe la retire du tournoi : sa place est libérée, les joueurs et les demandes
                            en attente sont renvoyés. Pour partir en laissant l'équipe, passez d'abord la main à un membre.
                        </p>
                        <BoutonConfirme
                            libelle="Dissoudre l'équipe"
                            avertissement={`« ${equipe.nomEquipe} » sera dissoute et ses ${equipe.membres.length > 1 ? `${equipe.membres.length} membres` : 'membre'} renvoyé${equipe.membres.length > 1 ? 's' : ''}.`}
                            desactive={gestion.envoi}
                            onConfirme={() => { gestion.effacerErreur(); void seDesister(); }}
                        />
                    </div>
                </SectionTournoi>
            )}

            {estCapitaine && modifiable && (
                <SectionTournoi surtitre="Recrutement" titre="Demandes">
                    <PanneauDemandes demandes={demandes} placeLibre={placeLibre} envoi={gestion.envoi} onTraiter={traiter} />
                </SectionTournoi>
            )}

            {(chatOuvert || avisChat) && (
                <SectionTournoi surtitre="Échanges" titre="Espace d'équipe">
                    {avisChat && <Alert variant="secondary" className="m-0">{avisChat}</Alert>}
                    {/* Un membre discute depuis la messagerie latérale, accessible de toutes les pages. */}
                    {moi !== undefined && enLice && !avisChat && (
                        <div className="d-flex flex-wrap align-items-center gap-3">
                            <button type="button" className="btn-principal" onClick={() => messagerie.ouvrir(equipe.idEquipe)}>
                                Ouvrir la messagerie
                            </button>
                            {messagerie.nonLus(equipe.idEquipe) > 0 && (
                                <span className="etiquette"><span className="point" /> {messagerie.nonLus(equipe.idEquipe)} non lu{messagerie.nonLus(equipe.idEquipe) > 1 ? 's' : ''}</span>
                            )}
                            <span className="small text-body-secondary">Le bouton « Messages » en bas à gauche suit les échanges partout sur le site.</span>
                        </div>
                    )}
                    {/* L'administrateur, lui, consulte l'espace sans y écrire (B-18). */}
                    {chatOuvert && !avisChat && utilisateur && moi === undefined && (
                        <ChatEquipe idEquipe={equipe.idEquipe} moiId={utilisateur.idUtilisateur} surFinDAcces={surFinDAcces} />
                    )}
                </SectionTournoi>
            )}
        </div>
    );
}
