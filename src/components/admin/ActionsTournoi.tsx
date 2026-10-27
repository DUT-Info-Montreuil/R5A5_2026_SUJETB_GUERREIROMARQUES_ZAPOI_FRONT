/**
 * Passage du tournoi à l'étape suivante (contrat §3). Chaque transition a des
 * effets irréversibles : un premier clic les annonce, le second confirme.
 */

import { useState } from 'react';
import { Alert, Spinner } from 'react-bootstrap';

import { useModificationTournoi } from '../../hooks/useModificationTournoi';
import type { StatutTournoi, Tournoi } from '../../types/api';

interface Transition {
    vers: StatutTournoi;
    libelle: string;
    effet: string;
}

const TRANSITIONS: Partial<Record<StatutTournoi, Transition>> = {
    INSCRIPTIONS_OUVERTES: {
        vers: 'INSCRIPTIONS_CLOSES',
        libelle: 'Clore les inscriptions',
        effet: "Les équipes sont figées et l'arbre est tiré au sort.",
    },
    INSCRIPTIONS_CLOSES: {
        vers: 'EN_COURS',
        libelle: 'Lancer le tournoi',
        effet: 'Les équipes incomplètes (joueurs ou postes manquants) sont déclarées forfait.',
    },
    EN_COURS: {
        vers: 'TERMINE',
        libelle: 'Terminer le tournoi',
        effet: 'Le vainqueur de la finale est déclaré vainqueur du tournoi.',
    },
};

interface Props {
    tournoi: Pick<Tournoi, 'idTournoi' | 'statutTournoi'>;
    onModifie: (tournoi: Tournoi) => void;
    /** Version resserrée, pour une ligne de liste. */
    compact?: boolean;
}

export function ActionsTournoi({ tournoi, onModifie, compact = false }: Props) {
    const { modifier, envoi, erreur, effacerErreur } = useModificationTournoi();
    const [aConfirmer, setAConfirmer] = useState(false);
    const transition = TRANSITIONS[tournoi.statutTournoi];
    if (!transition) return null;

    async function confirmer() {
        const modifie = await modifier(tournoi.idTournoi, { statutTournoi: transition!.vers });
        setAConfirmer(false);
        if (modifie) onModifie(modifie);
    }

    const classeBouton = compact ? 'btn-principal btn-principal-compact' : 'btn-principal';

    return (
        <div className="d-flex flex-column gap-2">
            {!aConfirmer ? (
                <button type="button" className={classeBouton} onClick={() => { effacerErreur(); setAConfirmer(true); }}>
                    {transition.libelle}
                </button>
            ) : (
                <div className="confirmation d-flex flex-wrap align-items-center gap-3">
                    <span className="small">{transition.effet} Confirmer ?</span>
                    <button type="button" className={classeBouton} onClick={confirmer} disabled={envoi}>
                        {envoi ? <Spinner size="sm" aria-label="Envoi en cours" /> : 'Confirmer'}
                    </button>
                    <button type="button" className="bouton-texte" onClick={() => setAConfirmer(false)} disabled={envoi}>
                        Annuler
                    </button>
                </div>
            )}
            {erreur && <Alert variant="danger" className="m-0 py-2 small">{erreur}</Alert>}
        </div>
    );
}
