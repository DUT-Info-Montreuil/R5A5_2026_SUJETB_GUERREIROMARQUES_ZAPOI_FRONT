/**
 * Traduction TypeScript du contrat d'API (docs/CONTRAT_API.md).
 *
 * CE FICHIER EST LE CONTRAT. Quand le back change un champ, c'est le seul
 * fichier à modifier : TypeScript signale ensuite tous les écrans cassés.
 * Il se modifie en même temps que docs/CONTRAT_API.md, jamais séparément.
 *
 * Les types des ressources (tournoi, équipe, rencontre…) s'ajoutent ici au
 * fur et à mesure des fonctionnalités.
 */

/** Forme unique des erreurs renvoyées par l'API (contrat §1.1). */
export interface ErreurApi {
  erreur: string;
  detail?: unknown;
}

/** Réponse de GET /health. */
export interface EtatSante {
  statut: 'ok' | 'degrade';
  baseDeDonnees: {
    joignable: boolean;
    versionPostgres?: string;
    tables?: number;
    schemaComplet?: boolean;
  };
}

// --- Authentification (contrat §2) -------------------------------------------
// Le jeton n'apparaît nulle part ici : il voyage dans un cookie HttpOnly que le
// JavaScript ne peut pas lire.

export interface Utilisateur {
  idUtilisateur: number;
  pseudo: string;
  email: string;
  estAdministrateur: boolean;
}

export interface IdentifiantsConnexion {
  email: string;
  motDePasse: string;
}

export interface DemandeInscription {
  pseudo: string;
  email: string;
  motDePasse: string;
}

export interface ReponseAuthentification {
  utilisateur: Utilisateur;
}

// --- Tournois (contrat §3) ---------------------------------------------------

export type StatutTournoi = 'INSCRIPTIONS_OUVERTES' | 'INSCRIPTIONS_CLOSES' | 'EN_COURS' | 'TERMINE';

export interface Jeu {
  idJeu: number;
  nomJeu: string;
  joueursParEquipe: number;
}

export interface TournoiResume {
  idTournoi: number;
  nomTournoi: string;
  jeu: Jeu;
  statutTournoi: StatutTournoi;
  nombreEquipes: number;
  nombreEquipesInscrites: number;
  /** Date ISO 8601. */
  creeLe: string;
}

/** Paramètres de GET /api/tournois. */
export interface FiltreTournois {
  recherche?: string;
  statut?: StatutTournoi;
}

/** L'objet Tournoi complet : détail, réponses de POST/PATCH, événement tournoi:maj. */
export interface Tournoi extends TournoiResume {
  /** Dates ISO 8601, absentes tant que l'étape n'est pas atteinte. */
  inscriptionsClosesLe?: string;
  demarreLe?: string;
  termineLe?: string;
}

/** Corps de POST /api/tournois. */
export interface CreationTournoi {
  nomTournoi: string;
  idJeu: number;
  /** 8 par défaut côté API. */
  nombreEquipes?: 2 | 4 | 8 | 16;
}

/** Corps de PATCH /api/tournois/{id} : changer le statut déclenche une transition. */
export interface ModificationTournoi {
  nomTournoi?: string;
  statutTournoi?: StatutTournoi;
}

export type StatutEquipe = 'EN_LICE' | 'ELIMINEE' | 'DISQUALIFIEE' | 'VAINQUEUR';

/** Élément de GET /api/tournois/{id}/equipes. */
export interface EquipeDuTournoi {
  idEquipe: number;
  nomEquipe: string;
  statutEquipe: StatutEquipe;
  motifSortie?: string;
  nombreMembres: number;
}

// --- Compétition (contrat §5) ------------------------------------------------

export type StatutRencontre = 'EN_ATTENTE' | 'JOUABLE' | 'TERMINE';
export type TypeResultat = 'NORMAL' | 'FORFAIT' | 'QUALIFICATION_DIRECTE';
export type Emplacement = 'A' | 'B';

export interface EquipeDeRencontre {
  idEquipe: number;
  nomEquipe: string;
}

/** Un nœud de l'arbre. Un champ absent signifie « pas encore connu ». */
export interface Rencontre {
  idRencontre: number;
  tour: number;
  position: number;
  equipeA?: EquipeDeRencontre;
  equipeB?: EquipeDeRencontre;
  idVainqueur?: number;
  statutRencontre: StatutRencontre;
  typeResultat?: TypeResultat;
  scoreA?: number;
  scoreB?: number;
  /** Absent pour la finale. */
  idRencontreSuivante?: number;
  emplacementSuivant?: Emplacement;
}

/** Corps de PATCH /api/rencontres/{id}. Les scores vont par paire, avec NORMAL seulement. */
export interface ResultatRencontre {
  idVainqueur: number;
  typeResultat: TypeResultat;
  scoreA?: number;
  scoreB?: number;
}
