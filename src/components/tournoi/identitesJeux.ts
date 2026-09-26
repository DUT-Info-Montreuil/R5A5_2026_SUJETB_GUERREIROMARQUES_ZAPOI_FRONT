/**
 * Identité visuelle de chaque jeu : le mot affiché sur son visuel, ses deux
 * couleurs, et ses rôles. Tant que les jeux n'ont pas de vraie image, ces
 * visuels sont générés en CSS (VisuelJeu) à partir de ces valeurs.
 *
 * Ce sont des choix de présentation, pas des données métier : un jeu absent de
 * la liste reçoit une identité par défaut.
 */

export interface IdentiteJeu {
    mot: string;
    couleur: string;
    fond: string;
    roles: string;
}

const IDENTITES: Record<string, IdentiteJeu> = {
    'League of Legends': { mot: 'LoL', couleur: '#8B5CF6', fond: '#2A1463', roles: 'Haut · Jungle · Milieu · Tireur · Soutien' },
    'Overwatch 2': { mot: 'OW2', couleur: '#A78BFA', fond: '#312E81', roles: 'Tank · 2 Dégâts · 2 Soutiens' },
    Valorant: { mot: 'VAL', couleur: '#C026D3', fond: '#3B0A45', roles: 'Duelliste · Initiateur · Contrôleur · Sentinelle' },
    'Counter-Strike 2': { mot: 'CS2', couleur: '#6366F1', fond: '#1E1B4B', roles: 'Entry · Support · Lurker · AWPer · IGL' },
    'Dota 2': { mot: 'DOTA', couleur: '#7C3AED', fond: '#1F0A3D', roles: 'Positions 1 à 5' },
};

export function identiteJeu(nomJeu: string): IdentiteJeu {
    return IDENTITES[nomJeu] ?? { mot: nomJeu.slice(0, 4), couleur: '#8B5CF6', fond: '#1F0A3D', roles: 'Équipes de cinq' };
}
