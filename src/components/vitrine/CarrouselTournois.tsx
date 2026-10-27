/**
 * « À la une » : un carrousel de grandes cartes de tournoi. Le défilement est
 * celui du navigateur (scroll-snap) : au doigt sur téléphone, à la molette ou
 * aux flèches ailleurs. Il avance seul toutes les 7 secondes, sauf au survol,
 * au focus, après une action de l'utilisateur ou si le mouvement est réduit.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';

import { useMouvementReduit } from '../../hooks/useMouvementReduit';
import type { TournoiResume } from '../../types/api';
import { LogoJeu } from '../jeux/LogoJeu';
import { IconeFleche } from '../ui/IconeFleche';
import { LignesDeTitre } from '../tournoi/LignesDeTitre';
import { VisuelJeu } from '../tournoi/VisuelJeu';
import { dotationAffichee } from '../tournoi/dotations';
import { identiteJeu } from '../tournoi/identitesJeux';
import { LIBELLES_STATUT, POINT_STATUT, dateLongue, descriptionTournoi } from '../tournoi/presentation';
import { estSolo, motParticipants } from '../tournoi/vocabulaire';

const DUREE_MS = 7000;

function Diapositive({ tournoi, estConnecte }: { tournoi: TournoiResume; estConnecte: boolean }) {
    const { couleur } = identiteJeu(tournoi.jeu.nomJeu);
    const recrute = tournoi.statutTournoi === 'INSCRIPTIONS_OUVERTES';

    return (
        <article className="diapo" style={{ '--jeu-couleur': couleur } as CSSProperties}>
            <div className="diapo-texte">
                <span className="d-flex flex-wrap align-items-center gap-3">
                    <LogoJeu nomJeu={tournoi.jeu.nomJeu} taille={48} />
                    <span className="libelle diapo-jeu">{tournoi.jeu.nomJeu}</span>
                    <span className="etiquette"><span className={POINT_STATUT[tournoi.statutTournoi]} /> {LIBELLES_STATUT[tournoi.statutTournoi]}</span>
                </span>
                <h3 className="diapo-titre titre-condense m-0"><LignesDeTitre nom={tournoi.nomTournoi} /></h3>
                <p className="diapo-description m-0">{descriptionTournoi(tournoi)}</p>
                <div className="diapo-faits">
                    <span><strong>{dotationAffichee(tournoi)}</strong><small>de dotation</small></span>
                    <span><strong>{tournoi.nombreEquipesInscrites}/{tournoi.nombreEquipes}</strong><small>{motParticipants(tournoi.jeu.joueursParEquipe)}</small></span>
                    {estSolo(tournoi.jeu.joueursParEquipe)
                        ? <span><strong>Solo</strong><small>en duel</small></span>
                        : <span><strong>{tournoi.jeu.joueursParEquipe}</strong><small>joueurs par équipe</small></span>}
                </div>
                <div className="d-flex flex-wrap align-items-center gap-3 pt-1">
                    <Link to={`/tournois/${tournoi.idTournoi}`} className="btn-principal">
                        {recrute ? 'Rejoindre le tournoi' : tournoi.statutTournoi === 'EN_COURS' ? "Suivre l'arbre" : 'Voir le tournoi'} <IconeFleche />
                    </Link>
                    {recrute && !estConnecte && <Link to="/inscription" className="btn-contour">Créer un compte</Link>}
                    <span className="small text-body-secondary">{dateLongue(tournoi.creeLe)}</span>
                </div>
            </div>
            <div className="diapo-visuel">
                <VisuelJeu nomJeu={tournoi.jeu.nomJeu} />
                <span className="diapo-dotation" aria-hidden="true">{dotationAffichee(tournoi)}</span>
            </div>
        </article>
    );
}

export function CarrouselTournois({ tournois, estConnecte }: { tournois: TournoiResume[]; estConnecte: boolean }) {
    const reduit = useMouvementReduit();
    const piste = useRef<HTMLDivElement>(null);
    const [actif, setActif] = useState(0);
    const [enPause, setEnPause] = useState(false);
    const [touche, setTouche] = useState(false);

    // Quelle diapositive est visible : celle dont le bord gauche est le plus proche du début de la piste.
    const surDefilement = useCallback(() => {
        const element = piste.current;
        if (!element || element.children.length === 0) return;
        const largeur = (element.children[0] as HTMLElement).offsetWidth + 24;
        setActif(Math.max(0, Math.min(tournois.length - 1, Math.round(element.scrollLeft / largeur))));
    }, [tournois.length]);

    const aller = useCallback((indice: number) => {
        const element = piste.current;
        if (!element || tournois.length === 0) return;
        const cible = ((indice % tournois.length) + tournois.length) % tournois.length;
        const largeur = (element.children[0] as HTMLElement).offsetWidth + 24;
        element.scrollTo({ left: cible * largeur, behavior: reduit ? 'auto' : 'smooth' });
    }, [reduit, tournois.length]);

    useEffect(() => {
        if (tournois.length < 2 || reduit || enPause || touche) return;
        const minuteur = setInterval(() => aller(actif + 1), DUREE_MS);
        return () => clearInterval(minuteur);
    }, [actif, aller, enPause, reduit, touche, tournois.length]);

    if (tournois.length === 0) return null;

    return (
        <div
            className="carrousel"
            aria-roledescription="carrousel"
            aria-label="Tournois à la une"
            onMouseEnter={() => setEnPause(true)}
            onMouseLeave={() => setEnPause(false)}
            onFocus={() => setEnPause(true)}
            onBlur={() => setEnPause(false)}
            onPointerDown={() => setTouche(true)}
        >
            <div ref={piste} className="carrousel-piste" onScroll={surDefilement}>
                {tournois.map((tournoi, i) => (
                    <div key={tournoi.idTournoi} className="carrousel-element" role="group" aria-roledescription="diapositive" aria-label={`${i + 1} sur ${tournois.length}`}>
                        <Diapositive tournoi={tournoi} estConnecte={estConnecte} />
                    </div>
                ))}
            </div>

            {tournois.length > 1 && (
                <div className="carrousel-commandes">
                    <div className="carrousel-points" role="tablist" aria-label="Choisir un tournoi">
                        {tournois.map((t, i) => (
                            <button key={t.idTournoi} type="button" role="tab" aria-selected={i === actif} aria-label={t.nomTournoi} className="carrousel-point" onClick={() => { setTouche(true); aller(i); }}>
                                {i === actif && !reduit && !enPause && !touche && <span key={actif} className="carrousel-progression" style={{ animationDuration: `${DUREE_MS}ms` }} />}
                            </button>
                        ))}
                    </div>
                    <div className="d-flex gap-2">
                        <button type="button" className="bouton-carre" aria-label="Tournoi précédent" onClick={() => { setTouche(true); aller(actif - 1); }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true"><path d="M19 12H5M11 6l-6 6 6 6" /></svg>
                        </button>
                        <button type="button" className="bouton-carre" aria-label="Tournoi suivant" onClick={() => { setTouche(true); aller(actif + 1); }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
