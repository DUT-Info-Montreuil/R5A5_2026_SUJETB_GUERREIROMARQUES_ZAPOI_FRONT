/** Ce qu'affiche une page de tournoi tant qu'elle n'a pas son tournoi : attente, introuvable, ou erreur. */

import { Alert, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';

interface Props {
    introuvable: boolean;
    erreur: string | null;
    onRecharger: () => void;
}

export function EtatChargement({ introuvable, erreur, onRecharger }: Props) {
    if (introuvable) {
        return (
            <div className="container-xxl px-4 px-lg-5 py-5 text-center d-flex flex-column align-items-center gap-3">
                <h1 className="titre-condense display-3 m-0">Tournoi introuvable</h1>
                <Link to="/#calendrier" className="lien-souligne">Voir tous les tournois</Link>
            </div>
        );
    }
    if (erreur) {
        return (
            <div className="container-xxl px-4 px-lg-5 py-5">
                <Alert variant="danger" className="d-flex justify-content-between align-items-center">
                    {erreur}
                    <button type="button" className="bouton-texte" onClick={onRecharger}>Réessayer</button>
                </Alert>
            </div>
        );
    }
    return <div className="py-5 text-center"><Spinner aria-label="Chargement du tournoi" /></div>;
}
