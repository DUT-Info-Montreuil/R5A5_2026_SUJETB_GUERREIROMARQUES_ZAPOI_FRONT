/**
 * Visuel d'un jeu généré en CSS : dégradé aux couleurs du jeu, hachures qui
 * défilent, et le nom du jeu en contour. Remplaçable par une vraie image.
 */

import type { CSSProperties } from 'react';

import { identiteJeu } from './identitesJeux';

interface Props {
    nomJeu: string;
    className?: string;
}

export function VisuelJeu({ nomJeu, className = '' }: Props) {
    const { mot, couleur, fond } = identiteJeu(nomJeu);
    // Variables CSS : la mise en forme reste dans _visuels.scss.
    const couleurs = { '--jeu-couleur': couleur, '--jeu-fond': fond } as CSSProperties;

    return (
        <div className={`visuel-jeu ${className}`} style={couleurs} aria-hidden="true">
            <span className="visuel-mot">{mot}</span>
        </div>
    );
}
