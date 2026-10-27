/**
 * Création d'une équipe (B-05) : un nom et le poste du créateur, qui devient
 * capitaine. Le formulaire ne navigue pas : il prévient la page par onCree.
 */

import { useState } from 'react';
import type { FormEvent } from 'react';
import { Alert, Form, Modal, Spinner } from 'react-bootstrap';

import { useCreationEquipe } from '../../hooks/useCreationEquipe';
import { usePostes } from '../../hooks/usePostes';
import type { Equipe, Tournoi } from '../../types/api';
import { ChampTexte } from '../ui/ChampTexte';

interface Props {
    visible: boolean;
    tournoi: Tournoi;
    onFermer: () => void;
    onCree: (equipe: Equipe) => void;
}

export function ModaleCreationEquipe({ visible, tournoi, onFermer, onCree }: Props) {
    const { postes, chargement, erreur: erreurPostes } = usePostes(tournoi.jeu.idJeu);
    const { creer, envoi, erreur, effacerErreur } = useCreationEquipe();
    const [nom, setNom] = useState('');
    const [idRole, setIdRole] = useState('');

    async function soumettre(evenement: FormEvent<HTMLFormElement>) {
        evenement.preventDefault();
        const equipe = await creer(tournoi.idTournoi, { nomEquipe: nom.trim(), idRole: Number(idRole) });
        if (equipe) onCree(equipe);
    }

    return (
        <Modal show={visible} onHide={onFermer} onExited={effacerErreur} centered>
            <Form onSubmit={soumettre}>
                <Modal.Header closeButton>
                    <Modal.Title className="titre-condense">Créer mon équipe</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {(erreur || erreurPostes) && <Alert variant="danger">{erreur ?? erreurPostes}</Alert>}

                    <ChampTexte id="equipe-nom" etiquette="Nom de l'équipe" valeur={nom} onChange={setNom} desactive={envoi} autoFocus />

                    <Form.Group controlId="equipe-poste">
                        <Form.Label className="libelle">Votre poste</Form.Label>
                        <Form.Select value={idRole} onChange={(e) => setIdRole(e.target.value)} required disabled={envoi || chargement}>
                            <option value="" disabled>{chargement ? 'Chargement…' : 'Choisir un poste'}</option>
                            {postes.map((poste) => (
                                <option key={poste.idRole} value={poste.idRole}>{poste.libelleRole}</option>
                            ))}
                        </Form.Select>
                        <Form.Text>
                            Vous serez capitaine de l'équipe ({tournoi.jeu.joueursParEquipe} joueurs, {tournoi.jeu.nomJeu}).
                            Vous recruterez les autres joueurs depuis leurs demandes.
                        </Form.Text>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <button type="button" className="bouton-texte" onClick={onFermer} disabled={envoi}>Annuler</button>
                    <button type="submit" className="btn-principal btn-principal-compact" disabled={envoi || !nom.trim() || !idRole}>
                        {envoi ? <Spinner size="sm" aria-label="Création en cours" /> : "Créer l'équipe"}
                    </button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
}
