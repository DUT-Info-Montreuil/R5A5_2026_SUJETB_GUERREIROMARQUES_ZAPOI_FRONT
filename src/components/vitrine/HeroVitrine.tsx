/**
 * Le haut de la page d'accueil, pensé comme une vitrine : une promesse, deux
 * boutons, l'arbre d'un tournoi qui se trace, des logos qui flottent, et — au
 * seul endroit du site avec la page d'un tournoi — le badge « en direct » du
 * tournoi qui se joue.
 */

import { Link } from 'react-router-dom';

import type { TournoiResume } from '../../types/api';
import { LogoJeu } from '../jeux/LogoJeu';
import { LIBELLES_STATUT } from '../tournoi/presentation';
import { IconeFleche } from '../ui/IconeFleche';
import { IllustrationArbre } from './IllustrationArbre';

interface Props {
    estConnecte: boolean;
    /** Le tournoi mis en avant : celui qui se joue, à défaut un qui recrute. */
    vedette?: TournoiResume;
    /** Trois chiffres de la saison, affichés sous les boutons. */
    chiffres: { valeur: number; libelle: string }[];
    /** Les noms des jeux dont les logos flottent autour de l'arbre. */
    jeux: string[];
}

export function HeroVitrine({ estConnecte, vedette, chiffres, jeux }: Props) {
    return (
        <section className="hero">
            <div className="hero-fond" aria-hidden="true">
                <span className="hero-lueur hero-lueur-1" />
                <span className="hero-lueur hero-lueur-2" />
                <span className="hero-lueur hero-lueur-3" />
                <span className="hero-grille" />
            </div>

            <div className="container-xxl px-4 px-lg-5 hero-contenu">
                <div className="hero-texte">
                    <span className="etiquette hero-pastille">
                        <span className="point" /> Saison 2026 · Tournois inter-IUT
                    </span>
                    <h1 className="hero-titre titre-condense m-0">
                        Joue en équipe.
                        <span className="hero-titre-degrade">Gagne ta finale.</span>
                    </h1>
                    <p className="hero-sous-titre m-0">
                        Cinq joueurs, un rôle chacun, un arbre à élimination directe. Monte ton équipe et défie les IUT de la région
                        sur les jeux du moment, avec une dotation à la clé.
                    </p>
                    <div className="d-flex flex-wrap gap-3 pt-2">
                        {estConnecte ? (
                            <Link to="/mes-equipes" className="btn-principal btn-grand">Voir mes équipes <IconeFleche /></Link>
                        ) : (
                            <Link to="/inscription" className="btn-principal btn-grand">Créer mon compte <IconeFleche /></Link>
                        )}
                        <Link to="/tournois" className="btn-contour btn-grand">Découvrir les tournois</Link>
                    </div>
                    <dl className="hero-chiffres m-0">
                        {chiffres.map((c) => (
                            <div key={c.libelle}>
                                <dt className="visually-hidden">{c.libelle}</dt>
                                <dd className="m-0"><strong>{c.valeur}</strong> <span>{c.libelle}</span></dd>
                            </div>
                        ))}
                    </dl>
                </div>

                <div className="hero-scene">
                    <IllustrationArbre />
                    {jeux.slice(0, 4).map((nom, i) => (
                        <LogoJeu key={nom} nomJeu={nom} taille={i % 2 === 0 ? 64 : 52} className={`hero-flottant hero-flottant-${i + 1}`} />
                    ))}
                    {vedette && (
                        <Link to={`/tournois/${vedette.idTournoi}`} className="hero-vedette">
                            <LogoJeu nomJeu={vedette.jeu.nomJeu} taille={44} />
                            <span className="d-flex flex-column">
                                {vedette.statutTournoi === 'EN_COURS' ? (
                                    <span className="hero-direct"><span className="point point-blanc point-direct" /> En direct</span>
                                ) : (
                                    <span className="hero-direct hero-direct-calme">{LIBELLES_STATUT[vedette.statutTournoi]}</span>
                                )}
                                <strong>{vedette.nomTournoi}</strong>
                            </span>
                            <IconeFleche />
                        </Link>
                    )}
                </div>
            </div>
        </section>
    );
}
