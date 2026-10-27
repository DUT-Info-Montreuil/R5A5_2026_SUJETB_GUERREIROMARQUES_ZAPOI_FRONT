/**
 * Vrai si le système demande de réduire les animations. Les animations CSS
 * sont déjà coupées par _utilitaires.scss ; ce hook sert à celles pilotées en
 * JavaScript (carrousel, compteurs).
 */

import { useSyncExternalStore } from 'react';

const REQUETE = '(prefers-reduced-motion: reduce)';

function sAbonner(rappel: () => void): () => void {
    const media = window.matchMedia(REQUETE);
    media.addEventListener('change', rappel);
    return () => media.removeEventListener('change', rappel);
}

export function useMouvementReduit(): boolean {
    return useSyncExternalStore(sAbonner, () => window.matchMedia(REQUETE).matches);
}
