/**
 * Bouton d'une action irréversible : un premier clic annonce ce qui va se
 * passer, le second confirme. Même langage que la transition d'un tournoi
 * (classe `confirmation`).
 */

import { useState } from 'react';

interface Props {
    libelle: string;
    /** Ce que la confirmation annonce (« Marie sera exclue de l'équipe. »). */
    avertissement: string;
    onConfirme: () => void;
    desactive?: boolean;
}

export function BoutonConfirme({ libelle, avertissement, onConfirme, desactive = false }: Props) {
    const [enAttente, setEnAttente] = useState(false);

    if (!enAttente) {
        return (
            <button type="button" className="bouton-texte small" onClick={() => setEnAttente(true)} disabled={desactive}>
                {libelle}
            </button>
        );
    }

    return (
        <div className="confirmation d-flex flex-wrap align-items-center gap-2">
            <span className="small">{avertissement} Confirmer ?</span>
            <button
                type="button"
                className="btn-principal btn-principal-compact"
                onClick={() => { setEnAttente(false); onConfirme(); }}
                disabled={desactive}
            >
                Confirmer
            </button>
            <button type="button" className="bouton-texte small" onClick={() => setEnAttente(false)}>Annuler</button>
        </div>
    );
}
