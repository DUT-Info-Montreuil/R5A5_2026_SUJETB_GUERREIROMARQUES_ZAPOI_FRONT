/**
 * L'histoire d'Agôn Cup, en cinq dates. Contenu éditorial, fictif : il ne vient
 * pas de l'API et ne change qu'à la main. Chaque date a son chiffre-clé, en grand :
 * c'est lui qui raconte, pas une illustration. Une ligne relie les étapes et se
 * remplit à mesure que l'on descend.
 */

import { LogoJeu } from '../jeux/LogoJeu';
import { Revele } from '../vitrine/Revele';
import { EnteteSection } from './EnteteSection';

interface Chapitre {
    date: string;
    titre: string;
    texte: string;
    /** Le chiffre-clé de l'étape, et ce qu'il compte. */
    chiffre: string;
    legende: string;
}

const CHAPITRES: Chapitre[] = [
    {
        date: 'Octobre 2024',
        titre: 'Le switch de la salle B12',
        texte: "Un jeudi soir, le TP de réseaux est bouclé avec une heure d'avance. Quelqu'un branche un switch, deux groupes de la même promo se retrouvent sur le même serveur CS2. Quarante minutes plus tard, le couloir s'est vidé et la salle s'est remplie. Le perdant offre les croissants du lendemain : la tradition est née.",
        chiffre: '2',
        legende: 'groupes, un switch, une salle',
    },
    {
        date: 'Février 2025',
        titre: 'Seize joueurs, un tableau blanc',
        texte: "Tout l'amphi réclame la revanche. Alors on s'organise : quatre équipes, un arbre dessiné au feutre et un arbitre qui court d'une salle à l'autre avec les scores sur un post-it. La finale se joue devant une salle debout. Le soir même, le groupe de la promo compte quarante et un messages : « on recommence quand ? ».",
        chiffre: '16',
        legende: 'joueurs au premier tournoi',
    },
    {
        date: 'Septembre 2025',
        titre: 'Le tableur de trop',
        texte: "Deuxième saison, six tournois, un tableur partagé que plus personne ne sait lire. Les inscriptions arrivent par messages privés, et l'arbre est redessiné trois fois parce qu'une équipe a déclaré forfait à la dernière minute. Le bureau des étudiants le dit sans détour : il faut une vraie plateforme, et il la faut avant les vacances d'hiver.",
        chiffre: '6',
        legende: 'tournois dans un seul tableur',
    },
    {
        date: 'Mars 2026',
        titre: 'Une plateforme, trois règles',
        texte: "Le cahier des charges tient en une soirée et trois règles. Chacun ne voit que ce qu'il a le droit de voir. Un résultat saisi apparaît chez tout le monde sans recharger la page. Plus jamais d'arbre redessiné à la main. Résultat : inscriptions en ligne, arbre généré à la clôture, résultats en direct et un espace d'échange réservé à chaque équipe.",
        chiffre: '3',
        legende: 'règles, écrites en une soirée',
    },
    {
        date: "Aujourd'hui",
        titre: 'Douze jeux, une communauté',
        texte: "Agôn, c'est le mot grec du concours : l'épreuve où l'on se mesure à armes égales. Aujourd'hui, du MOBA aux échecs, ça se joue à cinq, à trois ou en duel, entre les IUT de la région et toute l'année. Une règle de la première soirée tient toujours : les croissants sont pour les perdants.",
        chiffre: '12',
        legende: 'jeux au catalogue',
    },
];

const JEUX_DU_FINAL = ['League of Legends', 'Valorant', 'Counter-Strike 2', 'Fortnite', 'Minecraft', 'Pokémon', 'Échecs'];

export function NotreHistoire() {
    return (
        <section className="container-xxl px-4 px-lg-5 section-vitrine d-flex flex-column gap-5">
            <Revele><EnteteSection surtitre="Notre histoire" titre="Née dans une salle de TP" /></Revele>
            <ol className="chapitres">
                {CHAPITRES.map((chapitre, i) => (
                    <li key={chapitre.date} className="chapitre">
                        <Revele className="chapitre-repere">
                            <span className="chapitre-chiffre titre-condense" aria-hidden="true">{chapitre.chiffre}</span>
                            <span className="chapitre-legende">{chapitre.legende}</span>
                        </Revele>
                        {/* La ligne et le point vivent dans leur propre colonne : ils sont toujours alignés avec le texte. */}
                        <span className="chapitre-rail" aria-hidden="true" />
                        <Revele delai={120} className="chapitre-texte">
                            <span className="libelle small text-primary">{chapitre.date}</span>
                            <h3 className="chapitre-titre">{chapitre.titre}</h3>
                            <p className="text-body-secondary m-0">{chapitre.texte}</p>
                            {i === CHAPITRES.length - 1 && (
                                <span className="chapitre-logos" aria-hidden="true">
                                    {JEUX_DU_FINAL.map((nom) => <LogoJeu key={nom} nomJeu={nom} taille={44} />)}
                                </span>
                            )}
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
