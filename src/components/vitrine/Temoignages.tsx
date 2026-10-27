/** Ce que disent les joueurs. Témoignages fictifs, comme l'histoire : voir le pied de page. */

import type { CSSProperties } from 'react';

import { EnteteSection } from '../accueil/EnteteSection';
import { Revele } from './Revele';

interface Temoignage {
    texte: string;
    nom: string;
    role: string;
    couleur: string;
}

const TEMOIGNAGES: Temoignage[] = [
    {
        texte: "On a monté l'équipe le lundi, on jouait la finale le vendredi. Voir l'arbre bouger en direct pendant qu'on était en match, c'était dingue.",
        nom: 'Inès', role: 'Capitaine · League of Legends', couleur: '#C8AA6E',
    },
    {
        texte: "Je ne connaissais personne en dehors de ma promo. J'ai demandé à rejoindre une équipe, le capitaine m'a accepté en dix minutes. J'ai trouvé mon poste, et mes coéquipiers.",
        nom: 'Karim', role: 'Soutien · Overwatch 2', couleur: '#F99E1A',
    },
    {
        texte: "Côté orga, c'est le jour et la nuit : plus de tableur ni de messages perdus. Je saisis le résultat, le vainqueur monte, tout le monde le voit.",
        nom: 'Léa', role: 'Organisatrice · association', couleur: '#8B5CF6',
    },
];

export function Temoignages() {
    return (
        <section className="container-xxl px-4 px-lg-5 section-vitrine d-flex flex-column gap-5">
            <Revele><EnteteSection surtitre="Ils ont joué" titre="La parole aux joueurs" /></Revele>
            <ul className="temoignages">
                {TEMOIGNAGES.map((t, i) => (
                    <li key={t.nom}>
                        <Revele delai={i * 100} className="h-100">
                            <figure className="temoignage" style={{ '--couleur': t.couleur } as CSSProperties} data-lumiere>
                                <span className="temoignage-guillemet" aria-hidden="true">“</span>
                                <blockquote className="m-0">{t.texte}</blockquote>
                                <figcaption>
                                    <span className="temoignage-avatar" aria-hidden="true">{t.nom.slice(0, 1)}</span>
                                    <span className="d-flex flex-column"><strong>{t.nom}</strong><small className="text-body-secondary">{t.role}</small></span>
                                </figcaption>
                            </figure>
                        </Revele>
                    </li>
                ))}
            </ul>
        </section>
    );
}
