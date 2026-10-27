/** Le pictogramme d'un poste, de la couleur du texte. Décoratif : le libellé du poste est toujours écrit à côté. */

import { createElement } from 'react';

import { nomIconePoste } from './iconesPostes';
import { TRACES_LUCIDE } from './traces';

interface Props {
    libelle: string;
    /** Précise le sens d'un poste qui change d'un jeu à l'autre. */
    nomJeu?: string;
    /** Pour un pictogramme qui n'est pas un poste (le trophée) : son nom dans les tracés. */
    nomIcone?: string;
    taille?: number;
    className?: string;
}

export function IconePoste({ libelle, nomJeu, nomIcone, taille = 16, className }: Props) {
    const elements = TRACES_LUCIDE[nomIcone ?? nomIconePoste(libelle, nomJeu)] ?? TRACES_LUCIDE.user ?? [];
    return (
        <svg
            className={className}
            width={taille}
            height={taille}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            {elements.map(([balise, attributs], i) => createElement(balise, { key: i, ...attributs }))}
        </svg>
    );
}
