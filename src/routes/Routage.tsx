/** Déclaration des routes. Une page par route, rangée dans pages/. */

import { Route, Routes } from 'react-router-dom';

import { MiseEnPage } from '../components/layout/MiseEnPage';
import { AccueilPage } from '../pages/AccueilPage';
import { ConnexionPage } from '../pages/ConnexionPage';
import { DiagnosticPage } from '../pages/DiagnosticPage';
import { InscriptionPage } from '../pages/InscriptionPage';
import { IntrouvablePage } from '../pages/IntrouvablePage';

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
                <Route path="*" element={<IntrouvablePage />} />
            </Route>
        </Routes>
    );
}
