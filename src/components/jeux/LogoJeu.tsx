/**
 * Le logo d'un jeu : son pictogramme officiel sur une tuile aux couleurs du jeu.
 * Partout où un jeu apparaît (tournoi, équipe, catalogue), c'est ce composant.
 */

import type { CSSProperties } from 'react';

import { identiteJeu } from '../tournoi/identitesJeux';
import { EmblemeJeu } from './EmblemeJeu';

interface Props {
    nomJeu: string;
    /** Côté de la tuile, en pixels. */
    taille?: number;
    /** `tuile` : logo sur fond coloré. `nu` : le logo seul, de la couleur du texte. */
    variante?: 'tuile' | 'nu';
    /** Annonce le nom du jeu aux lecteurs d'écran. Sans titre, le logo est décoratif. */
    titre?: boolean;
    className?: string;
}

export function LogoJeu({ nomJeu, taille = 48, variante = 'tuile', titre = false, className = '' }: Props) {
    const { couleur, fond } = identiteJeu(nomJeu);
    // --taille sert à calculer la marge intérieure : un pourcentage se rapporterait au parent, pas à la tuile.
    const style = { '--jeu-couleur': couleur, '--jeu-fond': fond, '--taille': `${taille}px`, width: taille, height: taille } as CSSProperties;

    return (
        <span
            className={`logo-jeu logo-jeu-${variante} ${className}`}
            style={style}
            role={titre ? 'img' : undefined}
            aria-label={titre ? nomJeu : undefined}
            aria-hidden={titre ? undefined : true}
        >
            <EmblemeJeu nomJeu={nomJeu} />
        </span>
    );
}
