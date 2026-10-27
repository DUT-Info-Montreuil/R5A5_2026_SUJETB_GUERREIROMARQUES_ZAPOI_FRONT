/** Calendrier : filtres, et la liste avec ses états (chargement, erreur, vide). */

import type { CSSProperties } from 'react';
import { Alert } from 'react-bootstrap';

import type { FiltreTournois, TournoiResume } from '../../types/api';
import { CarteTournoi } from './CarteTournoi';
import { FiltresTournois } from './FiltresTournois';
import { LigneTournoi } from './LigneTournoi';

export type VueTournois = 'cartes' | 'liste';

interface Props {
    tournois: TournoiResume[];
    chargement: boolean;
    erreur: string | null;
    onRecharger: () => void;
    filtre: FiltreTournois;
    onFiltreChange: (filtre: FiltreTournois) => void;
    focusRecherche?: boolean;
    vue: VueTournois;
    onVueChange: (vue: VueTournois) => void;
}

/** Des lignes grisées qui occupent la place de la liste pendant le chargement : la page ne saute pas. */
function LignesEnAttente() {
    return (
        <ul className="calendrier" aria-hidden="true">
            {[0, 1, 2, 3].map((i) => (
                <li key={i} className="ligne-attente"><span className="squelette" /></li>
            ))}
        </ul>
    );
}

export function CalendrierTournois({ tournois, chargement, erreur, onRecharger, filtre, onFiltreChange, focusRecherche, vue, onVueChange }: Props) {
    const filtreActif = Boolean(filtre.statut || filtre.recherche);

    return (
        <div className="d-flex flex-column gap-4">
            {/* key : la saisie repart de l'URL si elle change (bouton « Retour »). */}
            <FiltresTournois key={filtre.recherche ?? ''} filtre={filtre} onChange={onFiltreChange} focusRecherche={focusRecherche} />

            {erreur && (
                <Alert variant="danger" className="d-flex justify-content-between align-items-center">
                    {erreur}
                    <button type="button" className="bouton-texte" onClick={onRecharger}>Réessayer</button>
                </Alert>
            )}

            {chargement && tournois.length === 0 && !erreur && <LignesEnAttente />}

            {!chargement && !erreur && tournois.length === 0 && (
                <div className="py-5 text-center d-flex flex-column align-items-center gap-3">
                    <p className="text-body-secondary m-0">
                        {filtreActif ? 'Aucun tournoi ne correspond à cette recherche.' : "Aucun tournoi pour l'instant."}
                    </p>
                    {filtreActif && (
                        <button type="button" className="btn-contour" onClick={() => onFiltreChange({})}>Effacer les filtres</button>
                    )}
                </div>
            )}

            {tournois.length > 0 && (
                <>
                    <div className="d-flex align-items-center justify-content-between gap-3">
                        <p className="small text-body-secondary m-0" aria-live="polite">
                            {tournois.length} {tournois.length > 1 ? 'tournois' : 'tournoi'}
                        </p>
                        <div className="bascule-vue" role="group" aria-label="Affichage">
                            <button type="button" aria-pressed={vue === 'cartes'} onClick={() => onVueChange('cartes')} aria-label="Afficher en cartes" title="Cartes">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /></svg>
                            </button>
                            <button type="button" aria-pressed={vue === 'liste'} onClick={() => onVueChange('liste')} aria-label="Afficher en liste" title="Liste">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
                            </button>
                        </div>
                    </div>
                    {vue === 'cartes' ? (
                        <ul className="grille-tournois" aria-busy={chargement}>
                            {tournois.map((tournoi, i) => (
                                <li key={tournoi.idTournoi} className="entree" style={{ '--rang': Math.min(i, 8) } as CSSProperties}>
                                    <CarteTournoi tournoi={tournoi} />
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <ul className="calendrier" aria-busy={chargement}>
                            {tournois.map((tournoi) => (
                                <LigneTournoi key={tournoi.idTournoi} tournoi={tournoi} />
                            ))}
                        </ul>
                    )}
                </>
            )}
        </div>
    );
}
