import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';

import { useAuth } from '../../context/useAuth';
import { Marque } from '../ui/Marque';
import { BoutonTheme } from './BoutonTheme';
import { ZoneCompte } from './ZoneCompte';

/**
 * En-tête commun : navigation soulignée sur grand écran, menu déroulant sur
 * téléphone (sans lui, un visiteur mobile n'avait aucun moyen de naviguer).
 */
export function EnTete() {
    const { utilisateur } = useAuth();
    const emplacement = useLocation();
    // Le menu retient la page sur laquelle il a été ouvert : changer de page le referme, sans effet.
    const [ouvertSur, setOuvertSur] = useState<string | null>(null);
    const menuOuvert = ouvertSur === emplacement.pathname;

    // Échap referme le menu.
    useEffect(() => {
        if (!menuOuvert) return;
        const surTouche = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setOuvertSur(null);
        };
        document.addEventListener('keydown', surTouche);
        return () => document.removeEventListener('keydown', surTouche);
    }, [menuOuvert]);

    const liens = (
        <>
            <NavLink to="/" end className="entete-lien">Accueil</NavLink>
            <NavLink to="/tournois" className="entete-lien">Tournois</NavLink>
            <NavLink to="/jeux" className="entete-lien">Jeux</NavLink>
            {utilisateur && <NavLink to="/mes-equipes" className="entete-lien">Mes équipes</NavLink>}
            {utilisateur?.estAdministrateur && <NavLink to="/admin/tournois" className="entete-lien">Administration</NavLink>}
        </>
    );

    return (
        <header className="entete">
            <div className="container-xxl h-100 d-flex align-items-center gap-3 gap-md-5 px-4 px-lg-5">
                <Marque />
                <nav aria-label="Navigation principale" className="d-none d-md-flex gap-4 flex-grow-1 h-100">
                    {liens}
                </nav>
                <div className="d-flex align-items-center gap-3 ms-auto">
                    <Link to="/tournois" state={{ rechercher: true }} className="bouton-carre" aria-label="Rechercher un tournoi">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                            <circle cx="11" cy="11" r="7" />
                            <path d="M20 20l-3.5-3.5" />
                        </svg>
                    </Link>
                    <BoutonTheme className="d-none d-md-inline-flex" />
                    <ZoneCompte />
                    <button
                        type="button"
                        className="bouton-carre bouton-menu d-md-none"
                        aria-label={menuOuvert ? 'Fermer le menu' : 'Ouvrir le menu'}
                        aria-expanded={menuOuvert}
                        aria-controls="menu-mobile"
                        onClick={() => setOuvertSur(menuOuvert ? null : emplacement.pathname)}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                            {menuOuvert ? <path d="M5 5l14 14M19 5L5 19" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
                        </svg>
                    </button>
                </div>
            </div>
            {menuOuvert && (
                <nav id="menu-mobile" aria-label="Menu" className="menu-mobile d-md-none">
                    {liens}
                    <BoutonTheme avecTexte />
                </nav>
            )}
        </header>
    );
}
