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
    // 10 inscriptions par heure et par adresse (contrat v13) : la connexion, elle, se compte à la minute.
    if (e instanceof ErreurHttp && e.statut === 429) return "Trop de tentatives d'inscription depuis cette adresse. Réessayez dans une heure.";
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
