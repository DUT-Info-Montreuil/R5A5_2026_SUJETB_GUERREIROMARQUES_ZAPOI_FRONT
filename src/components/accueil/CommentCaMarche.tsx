/** Les trois temps d'un tournoi, de l'inscription à la finale, reliés par un fil. */

import type { ReactNode } from 'react';

import { Revele } from '../vitrine/Revele';
import { EnteteSection } from './EnteteSection';

interface Etape {
    titre: string;
    texte: string;
    icone: ReactNode;
}

const ETAPES: Etape[] = [
    {
        titre: 'Monte ton équipe',
        texte: 'Crée une équipe pour un tournoi et deviens capitaine, ou demande à rejoindre une équipe existante. De un à six joueurs selon le jeu, un rôle chacun.',
        icone: <><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20c0-3.5 3-5.5 6.5-5.5s6.5 2 6.5 5.5M19 8v6M16 11h6" /></>,
    },
    {
        titre: 'Prépare-toi',
        texte: "Échange avec ton équipe dans votre espace privé. À la clôture des inscriptions, l'effectif est figé et l'arbre est généré.",
        icone: <><rect x="3" y="5" width="18" height="16" /><path d="M3 10h18M8 3v4M16 3v4M9 15l2 2 4-4" /></>,
    },
    {
        titre: "Joue et suis l'arbre",
        texte: "Les résultats validés font avancer les gagnants. Joueurs et spectateurs voient l'arbre évoluer en direct, sans recharger.",
        icone: <path d="M3 5h5v5h5M3 19h5v-5h5M13 10v4M13 12h8" />,
    },
];

export function CommentCaMarche() {
    return (
        <section className="container-xxl px-4 px-lg-5 section-vitrine d-flex flex-column gap-5">
            <Revele><EnteteSection surtitre="Comment ça marche" titre="De l'inscription à la finale" /></Revele>
            {/* Liste ordonnée : les étapes se suivent vraiment, d'où la numérotation. */}
            <ol className="etapes">
                {ETAPES.map((etape, i) => (
                    <li key={etape.titre}>
                        <Revele delai={i * 120} className="h-100">
                            <div className="etape">
                                <div className="d-flex align-items-center justify-content-between">
                                    <span className="etape-icone">
                                        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">{etape.icone}</svg>
                                    </span>
                                    <span className="etape-numero titre-condense" aria-hidden="true">0{i + 1}</span>
                                </div>
                                <h3 className="etape-titre">{etape.titre}</h3>
                                <p className="text-body-secondary m-0">{etape.texte}</p>
                            </div>
                        </Revele>
                    </li>
                ))}
            </ol>
        </section>
    );
}
