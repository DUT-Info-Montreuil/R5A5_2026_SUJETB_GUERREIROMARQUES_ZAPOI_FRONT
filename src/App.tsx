import { BrowserRouter } from 'react-router-dom';

import { FournisseurAuth } from './context/FournisseurAuth';
import { Routage } from './routes/Routage';

/** Racine : le fournisseur d'authentification enveloppe toutes les pages. */
export default function App() {
    return (
        <BrowserRouter>
            <FournisseurAuth>
                <Routage />
            </FournisseurAuth>
        </BrowserRouter>
    );
}
