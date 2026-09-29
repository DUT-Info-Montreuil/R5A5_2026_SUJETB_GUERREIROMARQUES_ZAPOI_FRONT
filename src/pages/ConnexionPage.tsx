/** Page /connexion. Assemble l'écran et décide de la navigation. */

import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';

import { EcranAuthentification } from '../components/auth/EcranAuthentification';
import { FormulaireConnexion } from '../components/auth/FormulaireConnexion';
import { useAuth } from '../context/useAuth';

export function ConnexionPage() {
    const { utilisateur, chargement } = useAuth();
    const navigate = useNavigate();
    // Envoyé par RouteProtegee : la page demandée avant la connexion.
    const depuis = (useLocation().state as { depuis?: string } | null)?.depuis ?? '/';

    if (chargement) return null;
    // Déjà connecté : `replace` évite que « Retour » ramène ici.
    if (utilisateur) return <Navigate to={depuis} replace />;

    return (
        <EcranAuthentification surtitre="Espace joueur" titre="Connexion">
            <FormulaireConnexion onSucces={() => navigate(depuis, { replace: true })} />
            <p className="mt-4 text-body-secondary">
                Pas encore de compte ? <Link to="/inscription" className="lien-souligne">Créer un compte</Link>
            </p>
        </EcranAuthentification>
    );
}
