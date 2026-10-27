/**
 * Quelle icône pour quel poste. Les libellés viennent de la base (le catalogue
 * de jeux du schéma SQL) : un poste sans icône connue en reçoit une par défaut.
 * Un poste dont le sens dépend du jeu (« Attaquant » à Rocket League et à
 * Minecraft) se règle par `Jeu|Poste`, qui passe avant le libellé seul.
 */

const PAR_LIBELLE: Record<string, string> = {
    // League of Legends
    Top: 'shield', Jungle: 'trees', Mid: 'wand-sparkles', ADC: 'crosshair', Support: 'heart-handshake',
    // Overwatch 2
    'Tank 1': 'shield', 'Tank 2': 'shield', 'DPS 1': 'swords', 'DPS 2': 'swords', 'Heal 1': 'heart-pulse', 'Heal 2': 'heart-pulse',
    // Valorant
    Duelliste: 'zap', Initiateur: 'radar', Contrôleur: 'cloud', Sentinelle: 'eye', Flex: 'shuffle',
    // Counter-Strike 2
    Entry: 'footprints', AWPer: 'scan-eye', Lurker: 'ghost', IGL: 'megaphone',
    // Dota 2
    'Carry (pos. 1)': 'sword', 'Mid (pos. 2)': 'wand-sparkles', 'Offlane (pos. 3)': 'shield',
    'Soutien (pos. 4)': 'heart-handshake', 'Soutien complet (pos. 5)': 'life-buoy',
    // Rocket League, Fortnite, PUBG, Minecraft
    Milieu: 'compass', Défenseur: 'shield', Attaquant: 'swords', Meneur: 'crown', Fragger: 'crosshair',
    Constructeur: 'hammer', Soutien: 'heart-handshake', Sniper: 'target', Bâtisseur: 'blocks', Collecteur: 'pickaxe',
    // Les jeux en solo
    Joueur: 'gamepad-2', Dresseur: 'circle-dot',
};

const PAR_JEU: Record<string, string> = {
    'Rocket League|Attaquant': 'rocket',
};

const PAR_DEFAUT = 'user';

/** Le nom de l'icône (dans `TRACES_LUCIDE`) du poste d'un jeu. */
export function nomIconePoste(libelle: string, nomJeu?: string): string {
    return (nomJeu !== undefined ? PAR_JEU[`${nomJeu}|${libelle}`] : undefined) ?? PAR_LIBELLE[libelle] ?? PAR_DEFAUT;
}
