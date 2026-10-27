import { Link } from 'react-router-dom';

/** Emblème : deux branches d'arbre qui se rejoignent vers le carré du vainqueur. */
export function Embleme({ taille = 34 }: { taille?: number }) {
    return (
        <svg className="embleme" width={taille} height={taille} viewBox="0 0 34 34" fill="none" aria-hidden="true">
            <path d="M3 5h7v8h7M3 29h7v-8h7M17 13v8M17 17h14" stroke="currentColor" strokeWidth="2.5" />
            <rect className="embleme-vainqueur" x="26" y="13" width="8" height="8" />
        </svg>
    );
}

/** Logo « AGÔN CUP », qui ramène à l'accueil. */
export function Marque() {
    return (
        <Link to="/" className="marque" aria-label="Agôn Cup, accueil">
            <Embleme />
            <span>
        Agôn <span className="marque-accent">Cup</span>
      </span>
        </Link>
    );
}
