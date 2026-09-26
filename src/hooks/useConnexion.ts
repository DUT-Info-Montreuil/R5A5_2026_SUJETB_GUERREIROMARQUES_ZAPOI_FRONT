/** Envoi du formulaire de connexion : appel, état d'envoi, message d'erreur. */

import { useState } from 'react';

import { seConnecter } from '../api/auth';
import { ErreurHttp } from '../api/client';
import { useAuth } from '../context/useAuth';
import type { IdentifiantsConnexion } from '../types/api';

function messageErreur(e: unknown): string {
    if (e instanceof ErreurHttp && e.statut === 401) return 'E-mail ou mot de passe incorrect.';
    if (e instanceof ErreurHttp && e.statut === 429) return 'Trop de tentatives. Réessayez dans une minute.';
    if (e instanceof ErreurHttp && e.statut === 0) return e.message;
    return 'La connexion a échoué. Réessayez.';
}

export function useConnexion() {
    const { ouvrirSession } = useAuth();
    const [envoi, setEnvoi] = useState(false);
    const [erreur, setErreur] = useState<string | null>(null);

    /** Vrai si la session est ouverte, pour que l'appelant enchaîne. */
    async function connexion(identifiants: IdentifiantsConnexion): Promise<boolean> {
        setErreur(null);
        setEnvoi(true);
        try {
            const { utilisateur } = await seConnecter(identifiants);
            ouvrirSession(utilisateur);
            return true;
        } catch (e: unknown) {
            setErreur(messageErreur(e));
            return false;
        } finally {
            setEnvoi(false);
        }
    }

    return { connexion, envoi, erreur };
}
