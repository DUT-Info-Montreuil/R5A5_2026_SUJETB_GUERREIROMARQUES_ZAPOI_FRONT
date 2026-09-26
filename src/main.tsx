import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

// Police Archivo servie par le projet lui-même (npm), avec ses deux axes :
// graisse et largeur, pour les titres condensés. Aucun appel à Google Fonts.
import '@fontsource-variable/archivo/wdth.css';
import './styles/main.scss';

import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <App />
    </StrictMode>,
);
