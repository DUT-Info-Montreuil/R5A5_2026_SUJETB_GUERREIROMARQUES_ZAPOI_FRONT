/**
 * Une équipe de l'utilisateur, sur « Mes équipes » : logo du jeu, nom, tournoi,
 * état et rôle. Toute la carte mène à l'espace de l'équipe (lien étendu sur le nom).
 */

import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';

import type { MonEquipe, TournoiResume } from '../../types/api';
import { LogoJeu } from '../jeux/LogoJeu';
import { identiteJeu } from '../tournoi/identitesJeux';
import { LIBELLES_STATUT, LIBELLES_STATUT_EQUIPE } from '../tournoi/presentation';
import { IconeFleche } from '../ui/IconeFleche';
import { estSolo } from '../tournoi/vocabulaire';

interface Props {
    equipe: MonEquipe;
    /** Le tournoi de l'équipe, pour en connaître le jeu. Absent tant que la liste des tournois charge. */
    tournoi?: TournoiResume;
}

function IconeCouronne() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M3 8l4.5 4L12 5l4.5 7L21 8l-2 11H5z" />
        </svg>
    );
}

export function CarteMonEquipe({ equipe, tournoi }: Props) {
    const vivante = equipe.statutEquipe === 'EN_LICE' || equipe.statutEquipe === 'VAINQUEUR';
    // Le jeu n'est connu qu'une fois la liste des tournois chargée : en attendant, on affiche le format d'équipe.
    const solo = tournoi !== undefined && estSolo(tournoi.jeu.joueursParEquipe);

    return (
        // La carte prend la couleur de son jeu : filet du haut et liseré du bas.
        <article
            className={`carte-mon-equipe carte-mon-equipe-${equipe.statutEquipe.toLowerCase()}`}
            style={tournoi ? ({ '--jeu-couleur': identiteJeu(tournoi.jeu.nomJeu).couleur } as CSSProperties) : undefined}
            data-lumiere
        >
            <div className="d-flex align-items-start justify-content-between gap-3">
                {tournoi ? <LogoJeu nomJeu={tournoi.jeu.nomJeu} taille={56} titre /> : <span className="squelette squelette-logo" />}
                <span className="d-flex flex-wrap justify-content-end gap-2">
                    {equipe.estCapitaine && !solo && (
                        <span className="badge-capitaine"><IconeCouronne /> Capitaine</span>
                    )}
                    <span className={vivante ? 'etiquette' : 'etiquette etiquette-eteinte'}>
                        <span className={vivante ? 'point' : 'point point-vide'} />
                        {LIBELLES_STATUT_EQUIPE[equipe.statutEquipe]}
                    </span>
                </span>
            </div>

            <div className="d-flex flex-column gap-1">
                <h3 className="carte-mon-equipe-nom m-0">
                    <Link to={`/equipes/${equipe.idEquipe}`} className="lien-etendu">{equipe.nomEquipe}</Link>
                </h3>
                <span className="small text-body-secondary">
                    {tournoi ? `${tournoi.jeu.nomJeu} · ` : ''}{equipe.nomTournoi}
                </span>
                <span className="small text-body-tertiary">{LIBELLES_STATUT[equipe.statutTournoi]}</span>
            </div>

            <span className="carte-mon-equipe-action">
                {solo ? "Voir mon inscription" : equipe.statutEquipe === 'EN_LICE' ? "Ouvrir l'espace d'équipe" : "Voir l'équipe"} <IconeFleche />
            </span>
        </article>
    );
}
