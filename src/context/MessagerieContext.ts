import { createContext } from 'react';

/** Ce que les pages savent de la messagerie : combien de non lus, et comment l'ouvrir sur une équipe. */
export interface ValeurMessagerie {
    /** Ouvre le tiroir de messages, sur cette équipe si elle en a un. */
    ouvrir: (idEquipe?: number) => void;
    /** Les messages non lus d'une équipe. */
    nonLus: (idEquipe: number) => number;
    /** Vrai si cette équipe a un chat dans le tiroir (équipe en lice, jeu en équipe). */
    aUnChat: (idEquipe: number) => boolean;
}

export const MessagerieContext = createContext<ValeurMessagerie>({
    ouvrir: () => undefined,
    nonLus: () => 0,
    aUnChat: () => false,
});
