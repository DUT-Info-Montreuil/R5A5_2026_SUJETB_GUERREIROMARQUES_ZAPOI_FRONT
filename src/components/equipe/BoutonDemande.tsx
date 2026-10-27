/** « Demander à rejoindre » sur la carte d'une équipe (B-06) : envoi, puis prévient la page. */

import { Spinner } from 'react-bootstrap';

import { useDemandeAdhesion } from '../../hooks/useDemandeAdhesion';

interface Props {
    idEquipe: number;
    /** Appelé une fois la demande créée : la page relit « mes demandes ». */
    onDemandee: () => void;
}

export function BoutonDemande({ idEquipe, onDemandee }: Props) {
    const { demander, envoi, erreur } = useDemandeAdhesion();

    async function cliquer() {
        if (await demander(idEquipe)) onDemandee();
    }

    return (
        <div className="d-flex flex-column align-items-start gap-1">
            <button type="button" className="bouton-texte small" onClick={cliquer} disabled={envoi}>
                {envoi ? <Spinner size="sm" aria-label="Envoi de la demande" /> : 'Demander à rejoindre'}
            </button>
            {erreur && <span className="small text-danger" role="alert">{erreur}</span>}
        </div>
    );
}
