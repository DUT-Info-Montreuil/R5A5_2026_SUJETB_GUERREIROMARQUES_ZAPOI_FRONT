/** Déclaration des routes. Une page par route, rangée dans pages/. */

import { Route, Routes } from 'react-router-dom';

import { MiseEnPage } from '../components/layout/MiseEnPage';
import { AccueilPage } from '../pages/AccueilPage';
import { IntrouvablePage } from '../pages/IntrouvablePage';

export function Routage() {
  return (
    <Routes>
      <Route element={<MiseEnPage />}>
        <Route index element={<AccueilPage />} />
        <Route path="*" element={<IntrouvablePage />} />
      </Route>
    </Routes>
  );
}
