/** Cadre commun des pages : en-tête, contenu, pied de page. */

import { Outlet } from 'react-router-dom';

import { EnTete } from './EnTete';
import { PiedDePage } from './PiedDePage';

export function MiseEnPage() {
    return (
        <div className="d-flex flex-column min-vh-100">
            <EnTete />
            <main className="flex-grow-1">
                <Outlet />
            </main>
            <PiedDePage />
        </div>
    );
}
