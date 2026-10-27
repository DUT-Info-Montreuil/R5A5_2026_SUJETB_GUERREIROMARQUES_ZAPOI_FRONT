/** Les demandes d'adhésion en attente, pour le capitaine : accepter ou refuser (B-06). */

import type { DemandeAdhesion } from '../../types/api';
import { dateLongue } from '../tournoi/presentation';

interface Props {
    demandes: DemandeAdhesion[];
    /** Faux quand l'équipe est complète : l'API refuserait l'acceptation. */
    placeLibre: boolean;
    envoi: boolean;
    onTraiter: (idDemande: number, statut: 'ACCEPTEE' | 'REFUSEE') => void;
}

export function PanneauDemandes({ demandes, placeLibre, envoi, onTraiter }: Props) {
    if (demandes.length === 0) {
        return <p className="text-body-secondary m-0">Aucune demande en attente.</p>;
    }

    return (
        <>
            {!placeLibre && (
                <p className="text-body-secondary m-0">
                    L'équipe est complète : vous pouvez refuser les demandes, pas les accepter.
                </p>
            )}
            <ul className="calendrier" aria-label="Demandes en attente">
                {demandes.map((demande) => (
                    <li key={demande.idDemande} className="ligne-admin d-flex flex-wrap align-items-center justify-content-between gap-3">
                        <div className="d-flex flex-column gap-1">
                            <span className="ligne-nom">{demande.pseudo}</span>
                            <span className="small text-body-secondary">Demande du {dateLongue(demande.creeLe)}</span>
                        </div>
                        <div className="d-flex align-items-center gap-3">
                            <button
                                type="button"
                                className="btn-principal btn-principal-compact"
                                onClick={() => onTraiter(demande.idDemande, 'ACCEPTEE')}
                                disabled={envoi || !placeLibre}
                            >
                                Accepter
                            </button>
                            <button
                                type="button"
                                className="bouton-texte"
                                onClick={() => onTraiter(demande.idDemande, 'REFUSEE')}
                                disabled={envoi}
                            >
                                Refuser
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </>
    );
}
