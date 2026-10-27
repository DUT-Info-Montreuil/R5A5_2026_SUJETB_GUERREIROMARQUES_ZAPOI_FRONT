/** Bascule entre le thème sombre et le thème clair. Le choix est retenu dans le navigateur. */

import { useTheme } from '../../hooks/useTheme';

interface Props {
    /** Affiche le libellé à côté de l'icône (dans le menu du téléphone, où il y a de la place). */
    avecTexte?: boolean;
    className?: string;
}

export function BoutonTheme({ avecTexte = false, className = '' }: Props) {
    const { theme, basculer } = useTheme();
    const versClair = theme === 'sombre';

    return (
        <button
            type="button"
            className={avecTexte ? `bouton-theme-large ${className}` : `bouton-carre bouton-theme ${className}`}
            onClick={basculer}
            aria-label={versClair ? 'Passer au thème clair' : 'Passer au thème sombre'}
            title={versClair ? 'Thème clair' : 'Thème sombre'}
        >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                {versClair ? (
                    // Soleil : on va vers le clair.
                    <>
                        <circle cx="12" cy="12" r="4" />
                        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
                    </>
                ) : (
                    // Lune : on va vers le sombre.
                    <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" />
                )}
            </svg>
            {avecTexte && <span>{versClair ? 'Thème clair' : 'Thème sombre'}</span>}
        </button>
    );
}
