import { Link } from 'react-router-dom';

export function IntrouvablePage() {
  return (
    <div className="text-center py-5">
      <h1 className="display-5 text-uppercase">Page introuvable</h1>
      <Link to="/">Retour à l'accueil</Link>
    </div>
  );
}
