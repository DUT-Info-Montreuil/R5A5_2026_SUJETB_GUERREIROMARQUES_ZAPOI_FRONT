/** Page /inscription. */

import { Link, Navigate, useNavigate } from 'react-router-dom';

import { EcranAuthentification } from '../components/auth/EcranAuthentification';
import { FormulaireInscription } from '../components/auth/FormulaireInscription';
import { useAuth } from '../context/useAuth';

export function InscriptionPage() {
    const { utilisateur, chargement } = useAuth();
    const navigate = useNavigate();

    if (chargement) return null;
    if (utilisateur) return <Navigate to="/" replace />;

    return (
        <EcranAuthentification surtitre="Nouveau joueur" titre="Créer un compte">
            <FormulaireInscription onSucces={() => navigate('/', { replace: true })} />
            <p className="mt-4 text-body-secondary">
                Déjà inscrit ? <Link to="/connexion" className="lien-souligne">Se connecter</Link>
            </p>
        </EcranAuthentification>
    );
}
