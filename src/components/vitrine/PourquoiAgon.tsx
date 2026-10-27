/** Les six raisons de s'inscrire : des cartes à lueur, une couleur et une icône chacune. Toutes décrivent ce que fait réellement la plateforme. */

import type { CSSProperties, ReactNode } from 'react';

import { EnteteSection } from '../accueil/EnteteSection';
import { Revele } from './Revele';

interface Atout {
    titre: string;
    texte: string;
    couleur: string;
    icone: ReactNode;
}

const ATOUTS: Atout[] = [
    {
        titre: 'Arbre automatique',
        texte: "À la clôture des inscriptions, l'arbre est tiré au sort et généré tout seul. Plus de tableur, plus de tableau blanc.",
        couleur: '#8B5CF6',
        icone: <path d="M3 5h5v5h5M3 19h5v-5h5M13 10v4M13 12h8" />,
    },
    {
        titre: 'Résultats en direct',
        texte: "Chaque résultat validé fait avancer le vainqueur. Joueurs et spectateurs voient l'arbre bouger sans recharger la page.",
        couleur: '#F472B6',
        icone: <><circle cx="12" cy="12" r="3" /><path d="M5 12a7 7 0 0 1 7-7M19 12a7 7 0 0 1-7 7M2 12a10 10 0 0 1 10-10M22 12a10 10 0 0 1-10 10" /></>,
    },
    {
        titre: "Espace privé d'équipe",
        texte: "Un chat réservé aux membres pour s'organiser. Quand une équipe est éliminée, son espace se ferme : rien ne traîne.",
        couleur: '#22D3EE',
        icone: <path d="M4 5h16v11H9l-5 4z" />,
    },
    {
        titre: 'Un rôle par joueur',
        texte: 'Chaque jeu a ses postes. Le capitaine les attribue : cinq joueurs, cinq rôles, aucune équipe bancale.',
        couleur: '#F99E1A',
        icone: <><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20c0-3.5 3-5.5 6.5-5.5s6.5 2 6.5 5.5M17 6l2 2 3-3" /></>,
    },
    {
        titre: 'Des dotations à gagner',
        texte: 'Chaque tournoi affiche sa dotation, des coupes de saison aux nuits thématiques. Le meilleur gagne, tout le monde joue.',
        couleur: '#C8AA6E',
        icone: <path d="M7 4h10v5a5 5 0 0 1-10 0zM7 6H4v2a3 3 0 0 0 3 3M17 6h3v2a3 3 0 0 1-3 3M12 14v4M8 20h8" />,
    },
    {
        titre: 'Ouvert à tous les IUT',
        texte: "Crée ton compte en une minute, monte ton équipe ou rejoins celle d'un capitaine. Les inscriptions se font en ligne.",
        couleur: '#4ADE80',
        icone: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" /></>,
    },
];

export function PourquoiAgon() {
    return (
        <section className="container-xxl px-4 px-lg-5 section-vitrine d-flex flex-column gap-5">
            <Revele><EnteteSection surtitre="Pourquoi Agôn Cup" titre="Tout pour jouer, rien pour te ralentir" /></Revele>
            <ul className="atouts">
                {ATOUTS.map((atout, i) => (
                    <li key={atout.titre}>
                        <Revele delai={i * 70} className="h-100">
                            <article className="atout" style={{ '--atout': atout.couleur } as CSSProperties} data-lumiere>
                                <span className="atout-icone">
                                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{atout.icone}</svg>
                                </span>
                                <h3 className="atout-titre">{atout.titre}</h3>
                                <p className="text-body-secondary m-0">{atout.texte}</p>
                            </article>
                        </Revele>
                    </li>
                ))}
            </ul>
        </section>
    );
}
