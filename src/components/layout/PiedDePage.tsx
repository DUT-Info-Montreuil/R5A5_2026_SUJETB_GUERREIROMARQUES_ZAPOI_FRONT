/**
 * Pied de page : la marque, les rubriques, l'association et ses contacts.
 * Les coordonnées sont FICTIVES (projet pédagogique) : adresse en `.example`,
 * numéro de la plage réservée à la fiction, réseaux sans lien.
 */

import { Link } from 'react-router-dom';

import { useAuth } from '../../context/useAuth';
import { Embleme } from '../ui/Marque';

export function PiedDePage() {
    const { utilisateur } = useAuth();

    return (
        <footer className="pied">
            <div className="container-xxl px-4 px-lg-5">
                <div className="row g-5">
                    <div className="col-12 col-lg-4 d-flex flex-column gap-3">
                        <Link to="/" className="marque" aria-label="Agôn Cup, accueil">
                            <Embleme taille={30} />
                            <span>Agôn <span className="marque-accent">Cup</span></span>
                        </Link>
                        <p className="text-body-secondary m-0 pied-texte">
                            La plateforme de tournois de l'association étudiante : cinq joueurs, un rôle chacun,
                            et une finale entre les IUT de la région.
                        </p>
                    </div>

                    <nav className="col-6 col-lg-2 d-flex flex-column gap-2" aria-label="Plateforme">
                        <span className="pied-titre">Plateforme</span>
                        <Link to="/" className="pied-lien">Accueil</Link>
                        <Link to="/tournois" className="pied-lien">Tournois</Link>
                        <Link to="/jeux" className="pied-lien">Jeux</Link>
                        {utilisateur ? (
                            <Link to="/mes-equipes" className="pied-lien">Mes équipes</Link>
                        ) : (
                            <Link to="/inscription" className="pied-lien">Créer un compte</Link>
                        )}
                    </nav>

                    <div className="col-6 col-lg-3 d-flex flex-column gap-2">
                        <span className="pied-titre">L'association</span>
                        <span className="text-body-secondary">Bureau des étudiants — Agôn</span>
                        <span className="text-body-secondary">IUT, bâtiment B, salle B12</span>
                        <span className="text-body-secondary">Permanence : mardi et jeudi, 12 h – 14 h</span>
                    </div>

                    <div className="col-12 col-lg-3 d-flex flex-column gap-2">
                        <span className="pied-titre">Nous contacter</span>
                        <a href="mailto:contact@agon-cup.example" className="pied-lien">contact@agon-cup.example</a>
                        <a href="tel:+33199001234" className="pied-lien">01 99 00 12 34</a>
                        <span className="text-body-secondary">Discord : agon-cup · Instagram : @agoncup</span>
                    </div>
                </div>

                <div className="pied-bas d-flex flex-wrap justify-content-between gap-2 small text-body-tertiary">
                    <span>Projet R5A5 · IUT de Montreuil · 2026–2027</span>
                    <span>Histoire, coordonnées et dotations : contenus fictifs, créés pour le projet.</span>
                </div>
            </div>
        </footer>
    );
}
