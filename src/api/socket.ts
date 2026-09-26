/**
 * Connexion temps réel unique de l'application (Socket.IO).
 *
 * RÈGLE : aucun composant n'ouvre sa propre connexion. On importe `socket` et
 * on s'abonne aux événements du contrat (§7).
 *
 * `autoConnect: false` : la connexion ne s'ouvre que lorsqu'un écran en a
 * besoin. `withCredentials` : le cookie de session part avec la connexion.
 */

import { io } from 'socket.io-client';

import { URL_API } from './client';

export const socket = io(URL_API, { autoConnect: false, withCredentials: true });
