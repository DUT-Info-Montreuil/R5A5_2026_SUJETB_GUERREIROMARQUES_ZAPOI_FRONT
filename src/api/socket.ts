/**
 * Connexion temps réel unique de l'application (Socket.IO).
 *
 * RÈGLE : aucun composant n'ouvre sa propre connexion. On importe `socket` et
 * on s'abonne aux événements du contrat (§7).
 *
 * `autoConnect: false` : la connexion ne s'ouvre que lorsqu'un écran en a
 * besoin, via `socket.connect()`.
 */

import { io } from 'socket.io-client';

import { URL_API } from './client';

export const socket = io(URL_API, { autoConnect: false });
