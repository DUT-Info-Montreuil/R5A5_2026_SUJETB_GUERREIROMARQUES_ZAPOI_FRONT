/**
 * Thème de l'interface : sombre (par défaut) ou clair, au choix de l'utilisateur.
 *
 * Le choix est un simple confort : il se garde dans le navigateur
 * (localStorage, jamais envoyé à l'API) et s'applique avec l'attribut
 * `data-bs-theme` de <html>, que Bootstrap et nos styles (_theme.scss) lisent.
 * Si le stockage est bloqué (navigation privée stricte), le thème marche
 * quand même, pour la durée de la page.
 */

export type Theme = 'sombre' | 'clair';

const CLE = 'agon-theme';
const ATTRIBUT: Record<Theme, string> = { sombre: 'dark', clair: 'light' };
const COULEUR_BARRE: Record<Theme, string> = { sombre: '#0B0B0D', clair: '#F7F6FB' };

let courant: Theme = 'sombre';
const abonnes = new Set<() => void>();

function lireChoix(): Theme {
    try {
        const valeur = localStorage.getItem(CLE);
        if (valeur === 'clair' || valeur === 'sombre') return valeur;
    } catch {
        // Stockage inaccessible : on garde le thème par défaut.
    }
    return 'sombre';
}

function appliquer(theme: Theme) {
    document.documentElement.setAttribute('data-bs-theme', ATTRIBUT[theme]);
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', COULEUR_BARRE[theme]);
}

/** À appeler une fois, avant le premier rendu, pour ne pas voir le mauvais thème un instant. */
export function initialiserTheme() {
    courant = lireChoix();
    appliquer(courant);
}

export function choisirTheme(theme: Theme) {
    courant = theme;
    appliquer(theme);
    try {
        localStorage.setItem(CLE, theme);
    } catch {
        // Le choix ne sera pas retenu au prochain chargement, mais il s'applique maintenant.
    }
    abonnes.forEach((rappel) => rappel());
}

export function themeCourant(): Theme {
    return courant;
}

export function suivreTheme(rappel: () => void): () => void {
    abonnes.add(rappel);
    return () => {
        abonnes.delete(rappel);
    };
}
