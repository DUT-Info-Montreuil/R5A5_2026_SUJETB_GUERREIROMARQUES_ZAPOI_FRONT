import { Embleme } from '../ui/Marque';

export function PiedDePage() {
    return (
        <footer className="pied">
            <div className="container-xxl px-4 px-lg-5 row g-5 mx-auto">
                <div className="col-12 col-lg-5 d-flex flex-column gap-3">
          <span className="marque">
            <Embleme taille={30} />
            <span>Agôn <span className="marque-accent">Cup</span></span>
          </span>
                    <p className="text-body-secondary m-0">La plateforme de tournois de l'association étudiante, entre les IUT de la région.</p>
                </div>
                <nav className="col-6 col-lg-2 d-flex flex-column gap-2" aria-label="Plateforme">
                    <span className="fw-bold">Plateforme</span>
                    <a href="/#calendrier" className="pied-lien">Tournois</a>
                    <a href="/#jeux" className="pied-lien">Jeux</a>
                </nav>
                <div className="col-6 col-lg-5 d-flex align-items-end justify-content-lg-end small text-body-tertiary">
                    Projet R5A5 · IUT de Montreuil · 2026–2027
                </div>
            </div>
        </footer>
    );
}
