/** Cadre commun des pages : lien d'évitement, en-tête, contenu, pied de page. */

import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import { EnTete } from './EnTete';
import { HaloCurseur } from './HaloCurseur';
import { PiedDePage } from './PiedDePage';

export function MiseEnPage() {
    const { pathname } = useLocation();

    // Une nouvelle page s'ouvre en haut, pas là où l'on avait défilé sur la précédente.
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return (
        <div className="d-flex flex-column min-vh-100">
            <HaloCurseur />
            <a href="#contenu" className="lien-evitement">Aller au contenu</a>
            <EnTete />
            <main id="contenu" className="flex-grow-1" tabIndex={-1}>
                <Outlet />
            </main>
            <PiedDePage />
        </div>
    );
}
