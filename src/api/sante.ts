/** Diagnostic de l'API — GET /health. Modèle à recopier pour chaque ressource. */

import { api } from './client';
import type { EtatSante } from '../types/api';

export function etatSante(): Promise<EtatSante> {
  return api.get<EtatSante>('/health');
}
