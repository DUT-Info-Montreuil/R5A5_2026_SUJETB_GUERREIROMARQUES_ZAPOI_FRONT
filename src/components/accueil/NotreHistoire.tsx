/**
 * L'histoire d'Agôn Cup, en quatre chapitres illustrés. Contenu éditorial,
 * fictif : il ne vient pas de l'API et ne change qu'à la main. Les
 * illustrations sont des dessins vectoriels décoratifs.
 */

import type { ReactNode } from 'react';

import { LogoJeu } from '../jeux/LogoJeu';
import { Revele } from '../vitrine/Revele';
import { EnteteSection } from './EnteteSection';

interface Chapitre {
    date: string;
    titre: string;
    texte: string;
    scene: ReactNode;
}

/** Une rangée d'écrans allumés : la salle de TP. */
function SalleDeTP() {
    return (
        <svg viewBox="0 0 400 260" role="presentation" aria-hidden="true" className="scene">
            <rect x="0" y="206" width="400" height="54" className="scene-sol" />
            {[0, 1, 2, 3].map((i) => (
                <g key={i} transform={`translate(${24 + i * 92} ${96})`}>
                    <rect width="76" height="54" className="scene-ecran" />
                    <rect x="8" y="8" width="60" height="6" className="scene-ligne" style={{ animationDelay: `${i * 0.3}s` }} />
                    <rect x="8" y="20" width="40" height="6" className="scene-ligne" style={{ animationDelay: `${i * 0.3 + 0.4}s` }} />
                    <rect x="8" y="32" width="52" height="6" className="scene-ligne" style={{ animationDelay: `${i * 0.3 + 0.8}s` }} />
                    <rect x="30" y="54" width="16" height="22" className="scene-pied" />
                    <rect x="18" y="76" width="40" height="5" className="scene-pied" />
                </g>
            ))}
            <circle cx="326" cy="48" r="26" className="scene-lune" />
        </svg>
    );
}

/** Un tableau blanc avec l'arbre griffonné au feutre. */
function TableauBlanc() {
    return (
        <svg viewBox="0 0 400 260" role="presentation" aria-hidden="true" className="scene">
            <rect x="30" y="24" width="340" height="190" className="scene-tableau" />
            <g className="scene-feutre" fill="none" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M60 60h50v28h50M60 116h50V88" pathLength={1} />
                <path d="M60 150h50v28h50M60 206h0" pathLength={1} style={{ animationDelay: '.4s' }} />
                <path d="M160 88h50v60h50" pathLength={1} style={{ animationDelay: '.8s' }} />
                <path d="M160 178h50v-30" pathLength={1} style={{ animationDelay: '1.1s' }} />
                <path d="M260 148h60" pathLength={1} style={{ animationDelay: '1.4s' }} />
            </g>
            <rect x="250" y="226" width="90" height="8" className="scene-rebord" />
            <rect x="262" y="218" width="44" height="8" className="scene-feutre-corps" />
        </svg>
    );
}

/** Une fenêtre de navigateur avec un arbre : la plateforme. */
function FenetrePlateforme() {
    return (
        <svg viewBox="0 0 400 260" role="presentation" aria-hidden="true" className="scene">
            <rect x="30" y="26" width="340" height="206" className="scene-fenetre" />
            <rect x="30" y="26" width="340" height="28" className="scene-barre" />
            {[0, 1, 2].map((i) => <circle key={i} cx={48 + i * 16} cy="40" r="4" className="scene-bouton" />)}
            <g className="scene-arbre" fill="none" strokeWidth="3">
                <path d="M62 84h56v26h56M62 136h56v-26" />
                <path d="M62 168h56v26h56M62 220h0" />
                <path d="M174 110h56v50h60M174 194h56v-34" />
            </g>
            {[84, 136, 168, 194].map((y, i) => <rect key={y} x="62" y={y - 8} width="44" height="16" className="scene-equipe" style={{ animationDelay: `${i * 0.2}s` }} />)}
            <rect x="290" y="146" width="52" height="28" className="scene-vainqueur" />
        </svg>
    );
}

/** Les logos des jeux, en mosaïque : aujourd'hui. */
function MosaiqueJeux() {
    const jeux = ['League of Legends', 'Valorant', 'Counter-Strike 2', 'Dota 2', 'Overwatch 2'];
    return (
        <div className="scene scene-mosaique" aria-hidden="true">
            {jeux.map((nom, i) => <LogoJeu key={nom} nomJeu={nom} taille={i === 0 ? 96 : 72} className={`mosaique-logo mosaique-logo-${i + 1}`} />)}
        </div>
    );
}

const CHAPITRES: Chapitre[] = [
    {
        date: 'Octobre 2024',
        titre: 'Le match de la salle B12',
        texte: "Un jeudi soir, un TP de réseaux qui traîne, un switch, deux groupes de la même promo : la première partie de CS2 inter-groupes. Le perdant paie les croissants.",
        scene: <SalleDeTP />,
    },
    {
        date: 'Février 2025',
        titre: 'Le premier tournoi',
        texte: "Le lendemain, tout l'amphi voulait la revanche. Seize joueurs, quatre équipes, un arbre dessiné au tableau blanc et une finale suivie par tout le monde.",
        scene: <TableauBlanc />,
    },
    {
        date: 'Septembre 2025',
        titre: 'La plateforme naît',
        texte: "Un tableur, quatre cents messages non lus et trois arbres griffonnés plus tard, il fallait une vraie plateforme : inscriptions en ligne, arbre généré à la clôture, résultats en direct.",
        scene: <FenetrePlateforme />,
    },
    {
        date: "Aujourd'hui",
        titre: 'Cinq jeux, une communauté',
        texte: "Agôn, c'est le mot grec du concours, l'épreuve où l'on se mesure à armes égales. Des tournois toute l'année entre les IUT de la région, et toujours des croissants pour les perdants.",
        scene: <MosaiqueJeux />,
    },
];

export function NotreHistoire() {
    return (
        <section className="container-xxl px-4 px-lg-5 section-vitrine d-flex flex-column gap-5">
            <Revele><EnteteSection surtitre="Notre histoire" titre="Née dans une salle de TP" /></Revele>
            <ol className="chapitres">
                {CHAPITRES.map((chapitre, i) => (
                    <li key={chapitre.date} className="chapitre">
                        <Revele className="chapitre-scene">{chapitre.scene}</Revele>
                        <Revele delai={120} className="chapitre-texte">
                            <span className="chapitre-numero titre-condense" aria-hidden="true">0{i + 1}</span>
                            <span className="libelle small text-primary">{chapitre.date}</span>
                            <h3 className="chapitre-titre">{chapitre.titre}</h3>
                            <p className="text-body-secondary m-0">{chapitre.texte}</p>
                        </Revele>
                    </li>
                ))}
            </ol>
            <Revele>
                <blockquote className="histoire-citation m-0">
                    «&nbsp;On voulait juste une revanche. On a fini avec une&nbsp;coupe.&nbsp;»
                    <cite>Les fondateurs, association des étudiants</cite>
                </blockquote>
            </Revele>
        </section>
    );
}
