/**
 * Enveloppe des routes réservées aux administrateurs.
 *
 * Ce n'est PAS une sécurité : cacher un écran évite une erreur de
 * manipulation, pas une attaque. N'importe qui peut appeler l'API directement ;
 * c'est elle qui refuse (403).
 */

import { Link, Navigate, Outlet, useLocation } from 'react-router-dom';

import { useAuth } from '../context/useAuth';

export function RouteProtegee() {
    const { utilisateur, chargement } = useAuth();
    const emplacement = useLocation();

    // Session pas encore vérifiée : ni redirection ni contenu, sinon un
    // administrateur qui recharge la page serait renvoyé vers la connexion.
    if (chargement) return null;
    if (utilisateur === null) return <Navigate to="/connexion" replace state={{ depuis: emplacement.pathname }} />;

    if (!utilisateur.estAdministrateur) {
        return (
            <div className="container-xxl px-4 px-lg-5 py-5 text-center d-flex flex-column align-items-center gap-3">
                <h1 className="titre-condense display-3 m-0">Accès réservé</h1>
                <p className="text-body-secondary m-0">Cet espace est réservé aux administrateurs.</p>
                <Link to="/" className="lien-souligne">Retour à l'accueil</Link>
            </div>
        );
    }
    return <Outlet />;
}
