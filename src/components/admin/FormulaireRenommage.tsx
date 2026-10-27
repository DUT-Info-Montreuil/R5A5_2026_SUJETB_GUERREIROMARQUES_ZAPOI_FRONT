/** Renommer un tournoi, en place : un bouton, puis un champ et deux actions. */

import { useState } from 'react';
import type { FormEvent } from 'react';
import { Alert, Form, Spinner } from 'react-bootstrap';

import { useModificationTournoi } from '../../hooks/useModificationTournoi';
import type { Tournoi } from '../../types/api';

interface Props {
    tournoi: Tournoi;
    onModifie: (tournoi: Tournoi) => void;
}

export function FormulaireRenommage({ tournoi, onModifie }: Props) {
    const { modifier, envoi, erreur } = useModificationTournoi();
    const [ouvert, setOuvert] = useState(false);
    const [nom, setNom] = useState(tournoi.nomTournoi);

    async function soumettre(evenement: FormEvent<HTMLFormElement>) {
        evenement.preventDefault();
        const modifie = await modifier(tournoi.idTournoi, { nomTournoi: nom.trim() });
        if (modifie) {
            setOuvert(false);
            onModifie(modifie);
        }
    }

    if (!ouvert) {
        return (
            <button type="button" className="bouton-texte" onClick={() => { setNom(tournoi.nomTournoi); setOuvert(true); }}>
                Renommer
            </button>
        );
    }

    return (
        <Form onSubmit={soumettre} className="d-flex flex-wrap align-items-center gap-2">
            <Form.Control
                aria-label="Nouveau nom du tournoi"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                maxLength={150}
                required
                disabled={envoi}
                autoFocus
                className="champ-renommage"
            />
            <button type="submit" className="btn-principal btn-principal-compact" disabled={envoi || !nom.trim()}>
                {envoi ? <Spinner size="sm" aria-label="Enregistrement en cours" /> : 'Enregistrer'}
            </button>
            <button type="button" className="bouton-texte" onClick={() => setOuvert(false)} disabled={envoi}>Annuler</button>
            {erreur && <Alert variant="danger" className="w-100 m-0 py-2 small">{erreur}</Alert>}
        </Form>
    );
}
