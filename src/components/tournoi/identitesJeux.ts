/**
 * Identité visuelle de chaque jeu : son mot court, ses deux couleurs, ses
 * postes et une phrase de présentation. Ce sont des choix de présentation,
 * pas des données métier : un jeu absent de la liste reçoit une identité par
 * défaut. L'emblème de chaque jeu est dessiné dans components/jeux/emblemes.tsx.
 */

export interface IdentiteJeu {
    mot: string;
    couleur: string;
    fond: string;
    /** Les postes, pour les puces de la page des jeux. */
    postes: string[];
    /** Les postes sur une ligne, pour les cartes. */
    roles: string;
    description: string;
}

function identite(mot: string, couleur: string, fond: string, postes: string[], description: string): IdentiteJeu {
    return { mot, couleur, fond, postes, roles: postes.join(' · '), description };
}

const IDENTITES: Record<string, IdentiteJeu> = {
    'League of Legends': identite(
        'LoL', '#C8AA6E', '#0B1B3A',
        ['Haut', 'Jungle', 'Milieu', 'Tireur', 'Soutien'],
        'Cinq voies, une base à défendre. Le MOBA de référence : coordination, timing et sang-froid.',
    ),
    'Overwatch 2': identite(
        'OW2', '#F99E1A', '#1D2A4F',
        ['Tank', 'Dégâts', 'Dégâts', 'Soutien', 'Soutien'],
        'Du cinq contre cinq nerveux où chaque héros compte : un tank, deux dégâts, deux soutiens.',
    ),
    Valorant: identite(
        'VAL', '#FF4655', '#2A0C16',
        ['Duelliste', 'Initiateur', 'Contrôleur', 'Sentinelle'],
        'Tir tactique et capacités : chaque round se gagne au placement avant de se gagner à la visée.',
    ),
    'Counter-Strike 2': identite(
        'CS2', '#4DA3FF', '#0E2038',
        ['Entry', 'Support', 'Lurker', 'AWPer', 'IGL'],
        "Le classique du tir tactique : économie, utilitaires, et une communication sans faille.",
    ),
    'Dota 2': identite(
        'DOTA', '#E2573C', '#2A0E0C',
        ['Position 1', 'Position 2', 'Position 3', 'Position 4', 'Position 5'],
        'Le MOBA des détails : cinq positions, des centaines de décisions à la minute.',
    ),
};

export function identiteJeu(nomJeu: string): IdentiteJeu {
    return IDENTITES[nomJeu] ?? identite(nomJeu.slice(0, 4), '#8B5CF6', '#1F0A3D', [], 'Des équipes, un arbre, une finale.');
}
