/** Renommer son équipe, en place (capitaine) : un bouton, puis un champ et deux actions. */

import { useState } from 'react';
import type { FormEvent } from 'react';
import { Form } from 'react-bootstrap';

interface Props {
    nomActuel: string;
    envoi: boolean;
    /** Vrai si le renommage a réussi : le formulaire se referme. */
    onRenomme: (nom: string) => Promise<boolean>;
}

export function FormulaireRenommageEquipe({ nomActuel, envoi, onRenomme }: Props) {
    const [ouvert, setOuvert] = useState(false);
    const [nom, setNom] = useState(nomActuel);

    async function soumettre(evenement: FormEvent<HTMLFormElement>) {
        evenement.preventDefault();
        if (await onRenomme(nom.trim())) setOuvert(false);
    }

    if (!ouvert) {
        return (
            <button type="button" className="bouton-texte" onClick={() => { setNom(nomActuel); setOuvert(true); }}>
                Renommer l'équipe
            </button>
        );
    }

    return (
        <Form onSubmit={soumettre} className="d-flex flex-wrap align-items-center gap-2">
            <Form.Control
                aria-label="Nouveau nom de l'équipe"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                maxLength={100}
                required
                disabled={envoi}
                autoFocus
                className="champ-renommage"
            />
            <button type="submit" className="btn-principal btn-principal-compact" disabled={envoi || !nom.trim()}>Enregistrer</button>
            <button type="button" className="bouton-texte" onClick={() => setOuvert(false)} disabled={envoi}>Annuler</button>
        </Form>
    );
}
