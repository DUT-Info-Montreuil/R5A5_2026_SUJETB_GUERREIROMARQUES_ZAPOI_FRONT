/** Le thème courant et de quoi le changer. Tous les composants qui l'utilisent restent à jour ensemble. */

import { useSyncExternalStore } from 'react';

import { choisirTheme, suivreTheme, themeCourant } from '../theme/theme';
import type { Theme } from '../theme/theme';

export function useTheme() {
    const theme: Theme = useSyncExternalStore(suivreTheme, themeCourant);
    return {
        theme,
        basculer: () => choisirTheme(theme === 'sombre' ? 'clair' : 'sombre'),
    };
}
