/**
 * Exécution d'une action d'écriture : état d'envoi et message d'erreur.
 *
 * Les messages de l'API sont déjà rédigés pour l'utilisateur (« La finale n'a
 * pas encore de vainqueur. ») : on les affiche tels quels, sauf quand ils
 * décrivent un problème technique.
 */

import { useCallback, useState } from 'react';

import { ErreurHttp } from '../api/client';

function messageErreur(e: unknown): string {
    if (!(e instanceof ErreurHttp)) return "L'action a échoué. Réessayez.";
    if (e.statut === 400 && typeof e.detail !== 'string') return 'Certains champs sont invalides.';
    if (e.statut === 401) return 'Votre session a expiré. Reconnectez-vous.';
    // 403 : l'API dit elle-même qui a le droit (« Seul le capitaine… », « Action réservée aux administrateurs. »).
    if (e.statut === 403) return e.message;
    if (e.statut >= 500) return 'Le serveur a rencontré une erreur. Réessayez.';
    return e.message;
}

export function useAction() {
    const [envoi, setEnvoi] = useState(false);
    const [erreur, setErreur] = useState<string | null>(null);

    /** Le résultat de l'action, ou null si elle a échoué (l'erreur est alors affichable). */
    async function executer<T>(action: () => Promise<T>): Promise<T | null> {
        setErreur(null);
        setEnvoi(true);
        try {
            return await action();
        } catch (e: unknown) {
            setErreur(messageErreur(e));
            return null;
        } finally {
            setEnvoi(false);
        }
    }

    const effacerErreur = useCallback(() => setErreur(null), []);

    return { executer, envoi, erreur, effacerErreur };
}
