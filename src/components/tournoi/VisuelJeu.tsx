/**
 * Visuel d'un jeu généré en CSS : dégradé aux couleurs du jeu, hachures qui
 * défilent, et le logo du jeu en grand, en filigrane.
 */

import type { CSSProperties } from 'react';

import { EmblemeJeu } from '../jeux/EmblemeJeu';
import { identiteJeu } from './identitesJeux';

interface Props {
    nomJeu: string;
    className?: string;
}

export function VisuelJeu({ nomJeu, className = '' }: Props) {
    const { couleur, fond } = identiteJeu(nomJeu);
    // Variables CSS : la mise en forme reste dans _visuels.scss.
    const couleurs = { '--jeu-couleur': couleur, '--jeu-fond': fond } as CSSProperties;

    return (
        <div className={`visuel-jeu ${className}`} style={couleurs} aria-hidden="true">
            <EmblemeJeu nomJeu={nomJeu} className="visuel-embleme" />
        </div>
    );
}
