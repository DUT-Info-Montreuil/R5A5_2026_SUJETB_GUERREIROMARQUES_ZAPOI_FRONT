/** Ce qu'affiche une page tant qu'elle n'a pas ses données : attente, introuvable, ou erreur. Par défaut, ceux d'un tournoi. */

import { Alert, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';

interface Props {
    introuvable: boolean;
    erreur: string | null;
    onRecharger: () => void;
    titreIntrouvable?: string;
    libelleChargement?: string;
}

export function EtatChargement({
    introuvable, erreur, onRecharger, titreIntrouvable = 'Tournoi introuvable', libelleChargement = 'Chargement du tournoi',
}: Props) {
    if (introuvable) {
        return (
            <div className="container-xxl px-4 px-lg-5 py-5 text-center d-flex flex-column align-items-center gap-3">
                <h1 className="titre-condense display-3 m-0">{titreIntrouvable}</h1>
                <Link to="/tournois" className="lien-souligne">Voir tous les tournois</Link>
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
    return <div className="py-5 text-center"><Spinner aria-label={libelleChargement} /></div>;
}
