/** Cadre commun des pages : en-tête, contenu, pied de page. */

import { Outlet } from 'react-router-dom';

import { EnTete } from './EnTete';

export function MiseEnPage() {
    return (
        <div className="d-flex flex-column min-vh-100">
            <EnTete />
            <main className="flex-grow-1">
                <Outlet />
            </main>
            <footer className="border-top py-4 small text-body-secondary">
                <div className="container-xxl px-4 px-lg-5">Agôn Cup — R5A5, IUT de Montreuil</div>
            </footer>
        </div>
    );
}
