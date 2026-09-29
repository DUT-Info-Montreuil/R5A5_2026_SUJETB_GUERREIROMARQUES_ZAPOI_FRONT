/** Déclaration des routes. Une page par route, rangée dans pages/. */

import { Navigate, Route, Routes } from 'react-router-dom';

import { MiseEnPage } from '../components/layout/MiseEnPage';
import { AccueilPage } from '../pages/AccueilPage';
import { ConnexionPage } from '../pages/ConnexionPage';
import { DiagnosticPage } from '../pages/DiagnosticPage';
import { InscriptionPage } from '../pages/InscriptionPage';
import { IntrouvablePage } from '../pages/IntrouvablePage';
import { TournoiPage } from '../pages/TournoiPage';
import { AdminTournoiPage } from '../pages/admin/AdminTournoiPage';
import { AdminTournoisPage } from '../pages/admin/AdminTournoisPage';
import { RouteProtegee } from './RouteProtegee';

export function Routage() {
    return (
        <Routes>
            {/* Plein écran, sans en-tête. */}
            <Route path="/connexion" element={<ConnexionPage />} />
            <Route path="/inscription" element={<InscriptionPage />} />

            {/* Dans le cadre commun : MiseEnPage les affiche à la place de son <Outlet />. */}
            <Route element={<MiseEnPage />}>
                <Route index element={<AccueilPage />} />
                <Route path="diagnostic" element={<DiagnosticPage />} />
                <Route path="tournois/:idTournoi" element={<TournoiPage />} />
                <Route path="admin" element={<RouteProtegee />}>
                    <Route index element={<Navigate to="tournois" replace />} />
                    <Route path="tournois" element={<AdminTournoisPage />} />
                    <Route path="tournois/:idTournoi" element={<AdminTournoiPage />} />
                </Route>
                <Route path="*" element={<IntrouvablePage />} />
            </Route>
        </Routes>
    );
}
