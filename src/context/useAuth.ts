import { useContext } from 'react';

import { AuthContext } from './AuthContext';
import type { ValeurAuth } from './AuthContext';

export function useAuth(): ValeurAuth {
    const valeur = useContext(AuthContext);
    if (valeur === null) {
        throw new Error('useAuth() doit être appelé sous <FournisseurAuth>.');
    }
    return valeur;
}
