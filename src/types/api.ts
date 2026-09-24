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
