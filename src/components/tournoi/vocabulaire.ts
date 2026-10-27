/**
 * Les mots qui changent selon le format du jeu. Aux échecs, à EA FC ou à
 * Pokémon, on joue seul : parler d'« équipe » de un joueur serait absurde. L'API
 * garde une équipe d'un joueur (même modèle pour tous les jeux), l'interface
 * parle alors d'inscription et de joueurs.
 */

/** Un jeu qui se joue seul : pas de recrutement, pas de postes à répartir, pas de chat. */
export function estSolo(joueursParEquipe: number): boolean {
    return joueursParEquipe === 1;
}

/** « 3 équipes » ou « 3 joueurs », accordé. */
export function participants(joueursParEquipe: number, nombre: number): string {
    const mot = estSolo(joueursParEquipe) ? 'joueur' : 'équipe';
    return `${nombre} ${mot}${nombre > 1 ? 's' : ''}`;
}

/** Le mot seul, au pluriel : « équipes » ou « joueurs ». */
export function motParticipants(joueursParEquipe: number): string {
    return estSolo(joueursParEquipe) ? 'joueurs' : 'équipes';
}

/** « 5 joueurs par équipe », ou « en solo » pour un duel. */
export function formatDuJeu(joueursParEquipe: number): string {
    return estSolo(joueursParEquipe) ? 'en solo' : `${joueursParEquipe} joueurs par équipe`;
}
