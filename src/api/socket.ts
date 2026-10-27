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

// `undefined` : Socket.IO se connecte à l'adresse de la page (URL_API vide, voir client.ts).
export const socket = io(URL_API || undefined, { autoConnect: false, withCredentials: true });

// Quand c'est le SERVEUR qui ferme la connexion (jeton expiré, trop d'événements),
// Socket.IO ne se reconnecte pas tout seul : contrairement à une coupure réseau, il
// considère la fermeture comme voulue. On rouvre donc la connexion à la main. Si la
// session a expiré, elle s'ouvre en visiteur : le prochain appel à l'API reçoit un
// 401, et l'interface renvoie l'utilisateur vers la connexion.
socket.on('disconnect', (raison) => {
    if (raison === 'io server disconnect') socket.connect();
});
