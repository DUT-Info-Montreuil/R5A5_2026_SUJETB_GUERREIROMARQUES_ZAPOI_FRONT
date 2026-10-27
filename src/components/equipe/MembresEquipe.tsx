/** Les membres d'une équipe, puis les places encore libres. */

import type { Membre, RoleJeu } from '../../types/api';
import { CarteMembre } from './CarteMembre';

interface Props {
    membres: Membre[];
    joueursParEquipe: number;
    postes: RoleJeu[];
    /** Identifiant de l'utilisateur connecté, s'il y en a un. */
    moiId?: number;
    estCapitaine: boolean;
    /** Vrai tant que les inscriptions sont ouvertes (B-11). */
    modifiable: boolean;
    envoi: boolean;
    surPoste: (idUtilisateur: number, idRole: number) => void;
    surPasserLaMain: (idUtilisateur: number) => void;
    surRetirer: (idUtilisateur: number) => void;
}

export function MembresEquipe({ membres, joueursParEquipe, modifiable, estCapitaine, moiId, ...reste }: Props) {
    const placesLibres = Math.max(0, joueursParEquipe - membres.length);

    return (
        <ul className="row g-3 m-0 p-0 list-unstyled">
            {membres.map((membre) => {
                const estMoi = membre.idUtilisateur === moiId;
                return (
                    <li key={membre.idUtilisateur} className="col-12 col-sm-6 col-lg-4 ps-0">
                        <CarteMembre
                            membre={membre}
                            membres={membres}
                            estMoi={estMoi}
                            peutGerer={estCapitaine && modifiable}
                            peutQuitter={estMoi && !membre.estCapitaine && modifiable}
                            {...reste}
                        />
                    </li>
                );
            })}
            {Array.from({ length: placesLibres }, (_, i) => (
                <li key={`libre-${i}`} className="col-12 col-sm-6 col-lg-4 ps-0">
                    <div className="carte-equipe carte-equipe-libre h-100">Place libre</div>
                </li>
            ))}
        </ul>
    );
}
