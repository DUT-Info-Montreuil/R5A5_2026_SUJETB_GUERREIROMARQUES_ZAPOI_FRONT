/**
 * Le dessin du logo d'un jeu, sans cadre : le pictogramme officiel (rempli de la
 * couleur du texte), le fichier officiel s'il a été fourni, ou — à défaut — le
 * sigle du jeu en lettres. Utilisé par la tuile (LogoJeu) et par le filigrane
 * des visuels (VisuelJeu).
 */

import { identiteJeu } from '../tournoi/identitesJeux';
import { FICHIERS_OFFICIELS, LOGOS_VECTORIELS } from './logos';

interface Props {
    nomJeu: string;
    className?: string;
}

export function EmblemeJeu({ nomJeu, className }: Props) {
    const vectoriel = LOGOS_VECTORIELS[nomJeu];
    if (vectoriel) {
        return (
            <svg className={className} viewBox={vectoriel.viewBox} fill="currentColor" aria-hidden="true">
                <path d={vectoriel.chemin} />
            </svg>
        );
    }

    const fichier = FICHIERS_OFFICIELS[nomJeu];
    if (fichier) return <img className={className} src={fichier} alt="" />;

    // Pas de logo disponible : le sigle, en toutes lettres, plutôt qu'un dessin inventé.
    return (
        <svg className={className} viewBox="0 0 48 48" aria-hidden="true">
            <text x="24" y="31" textAnchor="middle" fontSize="19" fontWeight="900" fill="currentColor">
                {identiteJeu(nomJeu).mot}
            </text>
        </svg>
    );
}
