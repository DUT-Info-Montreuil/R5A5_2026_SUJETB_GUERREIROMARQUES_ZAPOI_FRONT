/** Partie droite de l'en-tête : bouton de connexion, ou pseudo et déconnexion. */

import { Link } from 'react-router-dom';

import { useAuth } from '../../context/useAuth';

function initiales(pseudo: string): string {
    return pseudo.slice(0, 2).toUpperCase();
}

export function ZoneCompte() {
    const { utilisateur, chargement, deconnexion } = useAuth();

    // Tant que la session n'est pas vérifiée, rien plutôt qu'un bouton qui clignote.
    if (chargement) return null;

    if (utilisateur === null) {
        return (
            <Link to="/connexion" className="btn-principal">
                Se connecter
            </Link>
        );
    }

    return (
        <div className="d-flex align-items-center gap-4">
      <span className="d-flex align-items-center gap-2 fw-semibold">
        <span className="avatar" aria-hidden="true">{initiales(utilisateur.pseudo)}</span>
          {utilisateur.pseudo}
      </span>
            <button type="button" className="bouton-texte" onClick={deconnexion}>
                Se déconnecter
            </button>
        </div>
    );
}
