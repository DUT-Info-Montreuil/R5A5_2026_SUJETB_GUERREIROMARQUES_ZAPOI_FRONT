import { Link } from 'react-router-dom';

export function IntrouvablePage() {
    return (
        <div className="container-xxl px-4 px-lg-5 py-5 text-center">
            <h1 className="titre-condense display-1">Page introuvable</h1>
            <Link to="/" className="lien-souligne">Retour à l'accueil</Link>
        </div>
    );
}
