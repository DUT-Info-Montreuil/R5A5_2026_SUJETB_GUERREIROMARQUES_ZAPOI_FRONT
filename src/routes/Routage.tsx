/** Déclaration des routes. Une page par route, rangée dans pages/. */

import { lazy, Suspense, type ReactNode } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import { MiseEnPage } from '../components/layout/MiseEnPage';
import { AccueilPage } from '../pages/AccueilPage';
import { ConnexionPage } from '../pages/ConnexionPage';
import { DiagnosticPage } from '../pages/DiagnosticPage';
import { EquipePage } from '../pages/EquipePage';
import { InscriptionPage } from '../pages/InscriptionPage';
import { IntrouvablePage } from '../pages/IntrouvablePage';
import { JeuxPage } from '../pages/JeuxPage';
import { MesEquipesPage } from '../pages/MesEquipesPage';
import { TournoiPage } from '../pages/TournoiPage';
import { TournoisPage } from '../pages/TournoisPage';
import { RouteProtegee } from './RouteProtegee';

// Les pages d'administration ne servent qu'aux administrateurs : elles sont
// chargées à la demande (code splitting), pas dans le paquet initial des visiteurs.
const AdminTournoisPage = lazy(() =>
    import('../pages/admin/AdminTournoisPage').then((m) => ({ default: m.AdminTournoisPage })),
);
const AdminTournoiPage = lazy(() =>
    import('../pages/admin/AdminTournoiPage').then((m) => ({ default: m.AdminTournoiPage })),
);

function Chargement({ children }: { children: ReactNode }) {
    return (
        <Suspense fallback={<p role="status" className="text-center my-5">Chargement…</p>}>
            {children}
        </Suspense>
    );
}

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
                <Route path="tournois" element={<TournoisPage />} />
                <Route path="tournois/:idTournoi" element={<TournoiPage />} />
                <Route path="jeux" element={<JeuxPage />} />
                <Route path="equipes/:idEquipe" element={<EquipePage />} />
                <Route element={<RouteProtegee exigeAdministrateur={false} />}>
                    <Route path="mes-equipes" element={<MesEquipesPage />} />
                </Route>
                <Route path="admin" element={<RouteProtegee />}>
                    <Route index element={<Navigate to="tournois" replace />} />
                    <Route path="tournois" element={<Chargement><AdminTournoisPage /></Chargement>} />
                    <Route path="tournois/:idTournoi" element={<Chargement><AdminTournoiPage /></Chargement>} />
                </Route>
                <Route path="*" element={<IntrouvablePage />} />
            </Route>
        </Routes>
    );
}
