/**
 * Bande de logos qui défile en continu. La liste est doublée pour que la
 * boucle soit sans coupure ; elle s'arrête au survol, et elle reste fixe
 * (et se replie sur plusieurs lignes) si l'utilisateur demande moins de mouvement.
 */

import { Link } from 'react-router-dom';

import { LogoJeu } from '../jeux/LogoJeu';

export function BandeauJeux({ jeux }: { jeux: string[] }) {
    if (jeux.length === 0) return null;
    // Plusieurs fois la liste, pour couvrir les très grands écrans.
    const repetee = [...jeux, ...jeux, ...jeux, ...jeux];

    return (
        <section className="bandeau-jeux" aria-label="Les jeux au programme">
            <div className="bandeau-piste">
                {[0, 1].map((copie) => (
                    <ul key={copie} className="bandeau-liste" aria-hidden={copie === 1 ? true : undefined}>
                        {repetee.map((nom, i) => (
                            <li key={`${nom}-${i}`} className="bandeau-jeu">
                                <LogoJeu nomJeu={nom} taille={36} />
                                <span>{nom}</span>
                                <span className="bandeau-separateur" aria-hidden="true">✦</span>
                            </li>
                        ))}
                    </ul>
                ))}
            </div>
            <Link to="/jeux" className="bandeau-lien lien-souligne">Voir tous les jeux</Link>
        </section>
    );
}
