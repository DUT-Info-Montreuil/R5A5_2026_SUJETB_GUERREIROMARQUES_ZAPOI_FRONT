/**
 * L'histoire d'Agôn Cup, en cinq chapitres illustrés. Contenu éditorial,
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

/** Un tableur illisible : les colonnes débordent, les cases s'allument en rouge. */
function TableurDeTrop() {
    const lignes = [0, 1, 2, 3, 4];
    return (
        <svg viewBox="0 0 400 260" role="presentation" aria-hidden="true" className="scene">
            <rect x="30" y="26" width="340" height="206" className="scene-fenetre" />
            <rect x="30" y="26" width="340" height="24" className="scene-barre" />
            {[0, 1, 2, 3].map((c) => <line key={c} x1={78 + c * 74} y1="50" x2={78 + c * 74} y2="232" className="scene-grille" />)}
            {lignes.map((l) => <line key={l} x1="30" y1={74 + l * 31} x2="370" y2={74 + l * 31} className="scene-grille" />)}
            {lignes.flatMap((l) => [0, 1, 2, 3].map((c) => (
                <rect key={`${l}-${c}`} x={38 + c * 74} y={82 + l * 31} width={c === 0 ? 30 : 46 - ((l * 7 + c * 11) % 18)} height="8" className={(l * 3 + c * 5) % 7 === 0 ? 'scene-erreur' : 'scene-ligne'} style={{ animationDelay: `${(l + c) * 0.15}s` }} />
            )))}
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
    const jeux = ['League of Legends', 'Valorant', 'Counter-Strike 2', 'Fortnite', 'Minecraft', 'Pokémon', 'Échecs'];
    return (
        <div className="scene scene-mosaique" aria-hidden="true">
            {jeux.map((nom, i) => <LogoJeu key={nom} nomJeu={nom} taille={i === 0 ? 92 : 64} className={`mosaique-logo mosaique-logo-${i + 1}`} />)}
        </div>
    );
}

const CHAPITRES: Chapitre[] = [
    {
        date: 'Octobre 2024',
        titre: 'Le switch de la salle B12',
        texte: "Un jeudi soir, le TP de réseaux est bouclé avec une heure d'avance. Quelqu'un branche un switch, deux groupes de la même promo se retrouvent sur le même serveur CS2. Quarante minutes plus tard, le couloir s'est vidé et la salle s'est remplie. Le perdant offre les croissants du lendemain : la tradition est née.",
        scene: <SalleDeTP />,
    },
    {
        date: 'Février 2025',
        titre: 'Seize joueurs, un tableau blanc',
        texte: "Tout l'amphi réclame la revanche. Alors on s'organise : seize joueurs, quatre équipes, un arbre dessiné au feutre et un arbitre qui court d'une salle à l'autre avec les scores sur un post-it. La finale se joue devant une salle debout. Le soir même, le groupe de la promo compte quarante et un messages : « on recommence quand ? ».",
        scene: <TableauBlanc />,
    },
    {
        date: 'Septembre 2025',
        titre: 'Le tableur de trop',
        texte: "Deuxième saison, six tournois, un tableur partagé que plus personne ne sait lire. Les inscriptions arrivent par messages privés, et l'arbre est redessiné trois fois parce qu'une équipe a déclaré forfait à la dernière minute. Le bureau des étudiants le dit sans détour : il faut une vraie plateforme, et il la faut avant les vacances d'hiver.",
        scene: <TableurDeTrop />,
    },
    {
        date: 'Mars 2026',
        titre: 'Une plateforme, trois règles',
        texte: "Le cahier des charges tient en une soirée et trois règles. Chacun ne voit que ce qu'il a le droit de voir. Un résultat saisi apparaît chez tout le monde sans recharger la page. Plus jamais d'arbre redessiné à la main. Résultat : inscriptions en ligne, arbre généré à la clôture, résultats en direct et un espace d'échange réservé à chaque équipe.",
        scene: <FenetrePlateforme />,
    },
    {
        date: "Aujourd'hui",
        titre: 'Douze jeux, une communauté',
        texte: "Agôn, c'est le mot grec du concours : l'épreuve où l'on se mesure à armes égales. Aujourd'hui, du MOBA aux échecs, ça se joue à cinq, à trois ou en duel, entre les IUT de la région et toute l'année. Une règle de la première soirée tient toujours : les croissants sont pour les perdants.",
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
