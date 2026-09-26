/** Les jeux présents dans les tournois, avec leurs rôles. */

import type { Jeu } from '../../types/api';
import { VisuelJeu } from '../tournoi/VisuelJeu';
import { identiteJeu } from '../tournoi/identitesJeux';
import { EnteteSection } from './EnteteSection';

export interface JeuPresent {
    jeu: Jeu;
    nombreTournois: number;
}

export function SectionJeux({ jeux }: { jeux: JeuPresent[] }) {
    return (
        <section id="jeux" className="container-xxl px-4 px-lg-5 section-accueil d-flex flex-column gap-4">
            <EnteteSection surtitre="Les jeux" titre="Choisis ton terrain">
                <p className="texte-section m-0">Des jeux en équipes de cinq, avec des rôles définis. Chaque tournoi garde les rôles propres à son jeu.</p>
            </EnteteSection>
            <ul className="grille-jeux">
                {jeux.map(({ jeu, nombreTournois }) => (
                    <li key={jeu.idJeu} className="carte-jeu">
                        <div className="carte-jeu-visuel">
                            <VisuelJeu nomJeu={jeu.nomJeu} />
                            <span className="carte-jeu-compte">{nombreTournois} {nombreTournois > 1 ? 'tournois' : 'tournoi'}</span>
                        </div>
                        <span className="carte-jeu-nom">{jeu.nomJeu}</span>
                        <span className="small text-body-secondary">{identiteJeu(jeu.nomJeu).roles}</span>
                        <span className="carte-jeu-trait" />
                    </li>
                ))}
            </ul>
        </section>
    );
}
