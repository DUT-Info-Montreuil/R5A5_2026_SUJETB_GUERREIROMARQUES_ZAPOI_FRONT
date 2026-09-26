import { NavLink } from 'react-router-dom';

import { Marque } from '../ui/Marque';
import { ZoneCompte } from './ZoneCompte';

/** En-tête commun. Les rubriques « Mes équipes » et « Administration »
 *  s'ajouteront ici avec leurs pages. */
export function EnTete() {
    return (
        <header className="entete">
            <div className="container-xxl h-100 d-flex align-items-center gap-3 gap-md-5 px-4 px-lg-5">
                <Marque />
                <nav aria-label="Navigation principale" className="d-flex gap-4 flex-grow-1">
                    <NavLink to="/" end className="entete-lien">
                        Tournois
                    </NavLink>
                </nav>
                <ZoneCompte />
            </div>
        </header>
    );
}
