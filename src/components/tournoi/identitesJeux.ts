/**
 * Identité visuelle de chaque jeu : son mot court, sa famille, ses deux couleurs
 * et une phrase de présentation. Les postes, eux, viennent de l'API (un seul
 * endroit où ils sont définis : la base). Ce sont des choix de présentation,
 * pas des données métier : un jeu absent de la liste reçoit une identité par
 * défaut. L'emblème de chaque jeu est dessiné dans components/jeux/emblemes.tsx.
 */

/** Les familles de jeux, pour filtrer le catalogue. */
export type Genre = 'MOBA' | 'Jeu de tir' | 'Battle royale' | 'Sport' | 'Réflexion et stratégie' | 'Construction';

export const GENRES: Genre[] = ['MOBA', 'Jeu de tir', 'Battle royale', 'Sport', 'Construction', 'Réflexion et stratégie'];

export interface IdentiteJeu {
    mot: string;
    genre: Genre | null;
    couleur: string;
    fond: string;
    description: string;
}

function identite(mot: string, genre: Genre | null, couleur: string, fond: string, description: string): IdentiteJeu {
    return { mot, genre, couleur, fond, description };
}

const IDENTITES: Record<string, IdentiteJeu> = {
    'League of Legends': identite(
        'LoL', 'MOBA', '#C8AA6E', '#0B1B3A',
        'Cinq voies, une base à défendre. Le MOBA de référence : coordination, timing et sang-froid.',
    ),
    'Overwatch 2': identite(
        'OW2', 'Jeu de tir', '#F99E1A', '#1D2A4F',
        'Du six contre six nerveux où chaque héros compte : deux tanks, deux DPS, deux soutiens qui soignent.',
    ),
    Valorant: identite(
        'VAL', 'Jeu de tir', '#FF4655', '#2A0C16',
        'Jeu de tir et capacités : chaque round se gagne au placement avant de se gagner à la visée.',
    ),
    'Counter-Strike 2': identite(
        'CS2', 'Jeu de tir', '#4DA3FF', '#0E2038',
        "Le classique du tir tactique : économie, utilitaires, et une communication sans faille.",
    ),
    'Dota 2': identite(
        'DOTA', 'MOBA', '#E2573C', '#2A0E0C',
        'Le MOBA des détails : cinq positions, des centaines de décisions à la minute.',
    ),
    'Rocket League': identite(
        'RL', 'Sport', '#1E9BFF', '#0B1B3A',
        'Du football en voitures : trois joueurs, des passes aériennes, et un but dans les dernières secondes.',
    ),
    Fortnite: identite(
        'FN', 'Battle royale', '#A56BFF', '#1B1040',
        'Quatre joueurs, une île qui rétrécit : construire vite, se placer bien, survivre jusqu’à la dernière zone.',
    ),
    PUBG: identite(
        'PUBG', 'Battle royale', '#F2A900', '#2A2108',
        'Le battle royale réaliste : on se pose, on s’équipe, on se replie. Chaque décision de placement compte.',
    ),
    Minecraft: identite(
        'MC', 'Construction', '#62C466', '#16301A',
        'Bed Wars à quatre : protéger son lit, ravitailler l’équipe et aller détruire celui des autres.',
    ),
    'EA Sports FC': identite(
        'FC', 'Sport', '#3DDC84', '#0C2A1A',
        'Du football en un contre un, manette en main : le duel le plus simple à organiser, et le plus disputé.',
    ),
    'Pokémon': identite(
        'POKÉ', 'Réflexion et stratégie', '#FFCB05', '#1D2F7A',
        'Composer son équipe de six, anticiper celle de l’adversaire : le combat de stratégie au tour par tour.',
    ),
    'Échecs': identite(
        '♞', 'Réflexion et stratégie', '#E8E6E1', '#262421',
        'Le duel de réflexion par excellence : un blitz de trois minutes, un arbre, un seul vainqueur.',
    ),
};

/** Rang d'un jeu dans le catalogue (les plus connus d'abord) : sert à ordonner les listes. */
export function rangJeu(nomJeu: string): number {
    const rang = Object.keys(IDENTITES).indexOf(nomJeu);
    return rang === -1 ? Number.MAX_SAFE_INTEGER : rang;
}

export function identiteJeu(nomJeu: string): IdentiteJeu {
    return IDENTITES[nomJeu] ?? identite(nomJeu.slice(0, 4), null, '#8B5CF6', '#1F0A3D', 'Des équipes, un arbre, une finale.');
}
