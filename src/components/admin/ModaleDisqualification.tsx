/**
 * Disqualification d'une équipe (B-15) : son adversaire est qualifié et son
 * espace d'échange se ferme. Irréversible, donc une modale avec le motif.
 */

import { useState } from 'react';
import type { FormEvent } from 'react';
import { Alert, Form, Modal, Spinner } from 'react-bootstrap';

import { useDisqualification } from '../../hooks/useDisqualification';
import type { EquipeDuTournoi } from '../../types/api';

interface Props {
    equipe: EquipeDuTournoi;
    onFermer: () => void;
    onDisqualifiee: () => void;
}

export function ModaleDisqualification({ equipe, onFermer, onDisqualifiee }: Props) {
    const { disqualifier, envoi, erreur } = useDisqualification();
    const [motif, setMotif] = useState('');

    async function soumettre(evenement: FormEvent<HTMLFormElement>) {
        evenement.preventDefault();
        if (await disqualifier(equipe.idEquipe, motif)) onDisqualifiee();
    }

    return (
        <Modal show onHide={onFermer} centered>
            <Form onSubmit={soumettre}>
                <Modal.Header closeButton>
                    <Modal.Title className="titre-condense">Disqualifier {equipe.nomEquipe}</Modal.Title>
                </Modal.Header>
                <Modal.Body className="d-flex flex-column gap-3">
                    {erreur && <Alert variant="danger" className="m-0">{erreur}</Alert>}
                    <p className="m-0 text-body-secondary">
                        Son adversaire est qualifié par forfait et l'espace d'échange de l'équipe se ferme pour ses membres.
                        Cette décision est définitive.
                    </p>
                    <Form.Group controlId="disqualification-motif">
                        <Form.Label className="libelle">Motif (facultatif)</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            maxLength={500}
                            value={motif}
                            onChange={(e) => setMotif(e.target.value)}
                            disabled={envoi}
                            autoFocus
                        />
                        <Form.Text>Le motif est visible de tous sur la page de l'équipe.</Form.Text>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <button type="button" className="bouton-texte" onClick={onFermer} disabled={envoi}>Annuler</button>
                    <button type="submit" className="btn-principal btn-principal-compact" disabled={envoi}>
                        {envoi ? <Spinner size="sm" aria-label="Disqualification en cours" /> : 'Disqualifier'}
                    </button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
}
