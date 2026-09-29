import { NavLink } from 'react-router-dom';

import { useAuth } from '../../context/useAuth';
import { Marque } from '../ui/Marque';
import { ZoneCompte } from './ZoneCompte';

/** En-tête commun. « Mes équipes » s'ajoutera avec sa page. */
export function EnTete() {
    const { utilisateur } = useAuth();

    return (
        <header className="entete">
            <div className="container-xxl h-100 d-flex align-items-center gap-3 gap-md-5 px-4 px-lg-5">
                <Marque />
                <nav aria-label="Navigation principale" className="d-none d-md-flex gap-4 flex-grow-1">
                    <NavLink to="/" end className="entete-lien">Tournois</NavLink>
                    <a href="/#jeux" className="entete-lien">Jeux</a>
                    {utilisateur?.estAdministrateur && <NavLink to="/admin/tournois" className="entete-lien">Administration</NavLink>}
                </nav>
                <div className="d-flex align-items-center gap-3 ms-auto">
                    <a href="/#calendrier" className="bouton-carre" aria-label="Rechercher un tournoi">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                            <circle cx="11" cy="11" r="7" />
                            <path d="M20 20l-3.5-3.5" />
                        </svg>
                    </a>
                    <ZoneCompte />
                </div>
            </div>
        </header>
    );
}
