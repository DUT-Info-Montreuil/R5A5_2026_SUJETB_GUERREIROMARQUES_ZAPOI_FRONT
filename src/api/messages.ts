/** Routes de l'espace d'échange d'une équipe (contrat §6). */

import type { Message } from '../types/api.ts';
import { api } from './client.ts';

/** Membres d'une équipe en lice et administrateurs. 404 pour tout autre appelant. */
export function messagesDeLEquipe(idEquipe: number): Promise<Message[]> {
    return api.get<Message[]>(`/api/equipes/${idEquipe}/messages`);
}

/** Membres d'une équipe en lice. L'écriture reste en HTTP : le socket ne fait que notifier. */
export function envoyerMessage(idEquipe: number, contenu: string): Promise<Message> {
    return api.post<Message>(`/api/equipes/${idEquipe}/messages`, { contenu });
}
