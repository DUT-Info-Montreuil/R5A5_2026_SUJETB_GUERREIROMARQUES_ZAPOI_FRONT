import { Link } from 'react-router-dom';

/** Logo textuel « AGÔN CUP », qui ramène à l'accueil. */
export function Marque() {
    return (
        <Link to="/" className="marque">
            Agôn <span>Cup</span>
        </Link>
    );
}
