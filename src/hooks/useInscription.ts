/** Envoi du formulaire d'inscription : appel, état d'envoi, message d'erreur. */

import { useState } from 'react';

import { sInscrire } from '../api/auth';
import { ErreurHttp } from '../api/client';
import { useAuth } from '../context/useAuth';
import type { DemandeInscription } from '../types/api';

function messageErreur(e: unknown): string {
    // 409 : l'API précise lequel, du pseudo ou de l'e-mail, est déjà pris.
    if (e instanceof ErreurHttp && (e.statut === 409 || e.statut === 0)) return e.message;
    if (e instanceof ErreurHttp && e.statut === 400) return 'Vérifiez les champs : un format ne convient pas.';
    if (e instanceof ErreurHttp && e.statut === 429) return 'Trop de tentatives. Réessayez dans une minute.';
    return "L'inscription a échoué. Réessayez.";
}

export function useInscription() {
    const { ouvrirSession } = useAuth();
    const [envoi, setEnvoi] = useState(false);
    const [erreur, setErreur] = useState<string | null>(null);

    async function inscription(demande: DemandeInscription): Promise<boolean> {
        setErreur(null);
        setEnvoi(true);
        try {
            const { utilisateur } = await sInscrire(demande);
            ouvrirSession(utilisateur);
            return true;
        } catch (e: unknown) {
            setErreur(messageErreur(e));
            return false;
        } finally {
            setEnvoi(false);
        }
    }

    return { inscription, envoi, erreur };
}
