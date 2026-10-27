/**
 * Page /mes-equipes — l'espace du joueur : ses équipes (filtrables), ses
 * demandes d'adhésion en attente, et un point de départ quand il n'a encore
 * rien. Le jeu de chaque équipe vient de la liste des tournois : l'API des
 * équipes de l'utilisateur ne le donne pas.
 */

import { useState } from 'react';
import { Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import { EnteteSection } from '../components/accueil/EnteteSection';
import { CarteMaDemande } from '../components/equipe/CarteMaDemande';
import { CarteMonEquipe } from '../components/equipe/CarteMonEquipe';
import { Embleme } from '../components/ui/Marque';
import { IconeFleche } from '../components/ui/IconeFleche';
import { useAuth } from '../context/useAuth';
import { useMesParticipations } from '../hooks/useMesParticipations';
import { useTitrePage } from '../hooks/useTitrePage';
import { useTournois } from '../hooks/useTournois';
import type { FiltreTournois, MonEquipe } from '../types/api';

const SANS_FILTRE: FiltreTournois = {};

type Onglet = 'toutes' | 'en-lice' | 'terminees';

const ONGLETS: { cle: Onglet; libelle: string; garde: (e: MonEquipe) => boolean }[] = [
    { cle: 'toutes', libelle: 'Toutes', garde: () => true },
    { cle: 'en-lice', libelle: 'En lice', garde: (e) => e.statutEquipe === 'EN_LICE' },
    { cle: 'terminees', libelle: 'Terminées', garde: (e) => e.statutEquipe !== 'EN_LICE' },
];

function phraseDAccueil(nombreEquipes: number, enLice: number, nombreDemandes: number): string {
    if (nombreEquipes === 0 && nombreDemandes === 0) return "Tu n'as pas encore d'équipe : choisis un tournoi et lance-toi.";
    const morceaux: string[] = [];
    if (enLice > 0) morceaux.push(`${enLice} ${enLice > 1 ? 'équipes sont en lice' : 'équipe est en lice'}`);
    if (nombreDemandes > 0) morceaux.push(`${nombreDemandes} ${nombreDemandes > 1 ? 'demandes attendent' : 'demande attend'} une réponse`);
    return morceaux.length > 0 ? `${morceaux.join(' · ')}.` : "Aucune équipe en lice pour l'instant : un prochain tournoi t'attend.";
}

/** Des cartes grisées qui occupent la place des équipes pendant le chargement. */
function CartesEnAttente() {
    return (
        <ul className="grille-equipes" aria-hidden="true">
            {[0, 1, 2].map((i) => <li key={i} className="carte-attente"><span className="squelette" /></li>)}
        </ul>
    );
}

export function MesEquipesPage() {
    useTitrePage('Mes équipes');
    const { utilisateur } = useAuth();
    const { equipes, demandes, erreur, chargement, recharger } = useMesParticipations(true);
    const { tournois } = useTournois(SANS_FILTRE);
    const [onglet, setOnglet] = useState<Onglet>('toutes');

    const tournoiDe = (idTournoi: number) => tournois.find((t) => t.idTournoi === idTournoi);
    const enLice = equipes.filter((e) => e.statutEquipe === 'EN_LICE').length;
    const garde = ONGLETS.find((o) => o.cle === onglet)?.garde ?? (() => true);
    const visibles = equipes.filter(garde);
    const vide = !chargement && !erreur && equipes.length === 0 && demandes.length === 0;

    return (
        <>
            <section className="accueil-joueur">
                <div className="container-xxl px-4 px-lg-5 d-flex flex-column gap-3">
                    <span className="surtitre">Espace joueur</span>
                    <h1 className="accueil-joueur-titre titre-condense m-0">
                        Salut, <span className="text-primary">{utilisateur?.pseudo}</span>
                    </h1>
                    <p className="accueil-joueur-texte m-0">
                        {chargement ? 'Chargement de tes équipes…' : phraseDAccueil(equipes.length, enLice, demandes.length)}
                    </p>
                    {!vide && (
                        <div className="d-flex flex-wrap gap-3 pt-2">
                            <Link to="/tournois?statut=INSCRIPTIONS_OUVERTES" className="btn-principal btn-principal-compact">
                                Trouver un tournoi <IconeFleche />
                            </Link>
                            <Link to="/jeux" className="btn-contour">Découvrir les jeux</Link>
                        </div>
                    )}
                </div>
            </section>

            <section className="container-xxl px-4 px-lg-5 d-flex flex-column gap-5 pb-5 section-joueur">
                {erreur && (
                    <Alert variant="danger" className="d-flex justify-content-between align-items-center">
                        {erreur}
                        <button type="button" className="bouton-texte" onClick={recharger}>Réessayer</button>
                    </Alert>
                )}

                {chargement && <CartesEnAttente />}

                {vide && (
                    <div className="vide-joueur">
                        <Embleme taille={72} />
                        <h2 className="titre-condense m-0">Ton aventure commence ici</h2>
                        <p className="text-body-secondary m-0">
                            Crée ton équipe dans un tournoi qui recrute, ou demande à rejoindre celle d'un capitaine.
                            Tes équipes et tes demandes apparaîtront ici.
                        </p>
                        <div className="d-flex flex-wrap justify-content-center gap-3">
                            <Link to="/tournois?statut=INSCRIPTIONS_OUVERTES" className="btn-principal">
                                Voir les tournois ouverts <IconeFleche />
                            </Link>
                            <Link to="/jeux" className="btn-contour">Découvrir les jeux</Link>
                        </div>
                    </div>
                )}

                {equipes.length > 0 && (
                    <div className="d-flex flex-column gap-4">
                        <EnteteSection surtitre="Où tu joues" titre="Mes équipes">
                            <div className="d-flex flex-wrap gap-4" role="group" aria-label="Filtrer mes équipes">
                                {ONGLETS.map((o) => (
                                    <button key={o.cle} type="button" className="filtre" aria-pressed={onglet === o.cle} onClick={() => setOnglet(o.cle)}>
                                        {o.libelle} <span className="filtre-compte">{equipes.filter(o.garde).length}</span>
                                    </button>
                                ))}
                            </div>
                        </EnteteSection>
                        {visibles.length === 0 ? (
                            <p className="text-body-secondary m-0">Aucune équipe dans cette catégorie.</p>
                        ) : (
                            // key : changer d'onglet rejoue l'apparition des cartes.
                            <ul key={onglet} className="grille-equipes">
                                {visibles.map((equipe) => (
                                    <li key={equipe.idEquipe}>
                                        <CarteMonEquipe equipe={equipe} tournoi={tournoiDe(equipe.idTournoi)} />
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                )}

                {demandes.length > 0 && (
                    <div className="d-flex flex-column gap-4">
                        <EnteteSection surtitre="En attente" titre="Mes demandes" />
                        <ul className="liste-demandes" aria-label="Demandes en attente">
                            {demandes.map((demande) => (
                                <CarteMaDemande key={demande.idDemande} demande={demande} tournoi={tournoiDe(demande.idTournoi)} />
                            ))}
                        </ul>
                    </div>
                )}
            </section>
        </>
    );
}
