import { BrowserRouter } from 'react-router-dom';

import { Routage } from './routes/Routage';

/**
 * Racine de l'application. Les fournisseurs d'état global (authentification…)
 * viendront envelopper le routage ici, depuis le dossier context/.
 */
export default function App() {
  return (
    <BrowserRouter>
      <Routage />
    </BrowserRouter>
  );
}
