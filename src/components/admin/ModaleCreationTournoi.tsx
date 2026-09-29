/**
 * Création d'un tournoi (B-01) : nom, jeu, nombre d'équipes. Le formulaire ne
 * navigue pas : il prévient la page par onCree.
 */

import { useState } from 'react';
import type { FormEvent } from 'react';
import { Alert, Form, Modal, Spinner } from 'react-bootstrap';

import { creerTournoi } from '../../api/tournois';
import { useAction } from '../../hooks/useAction';
import { useJeux } from '../../hooks/useJeux';
import type { CreationTournoi, Tournoi } from '../../types/api';
import { ChampTexte } from '../ui/ChampTexte';

type NombreEquipes = NonNullable<CreationTournoi['nombreEquipes']>;
const NOMBRES_EQUIPES: NombreEquipes[] = [2, 4, 8, 16];
const NOMBRE_EQUIPES_PAR_DEFAUT: NombreEquipes = 8;

interface Props {
    visible: boolean;
    onFermer: () => void;
    onCree: (tournoi: Tournoi) => void;
}

export function ModaleCreationTournoi({ visible, onFermer, onCree }: Props) {
    const { jeux, chargement, erreur: erreurJeux } = useJeux();
    const { executer, envoi, erreur } = useAction();
    const [nom, setNom] = useState('');
    const [idJeu, setIdJeu] = useState('');
    const [nombreEquipes, setNombreEquipes] = useState<NombreEquipes>(NOMBRE_EQUIPES_PAR_DEFAUT);

    async function soumettre(evenement: FormEvent<HTMLFormElement>) {
        evenement.preventDefault();
        const cree = await executer(() => creerTournoi({ nomTournoi: nom.trim(), idJeu: Number(idJeu), nombreEquipes }));
        if (cree) {
            setNom('');
            onCree(cree);
        }
    }

    return (
        <Modal show={visible} onHide={onFermer} centered>
            <Form onSubmit={soumettre}>
                <Modal.Header closeButton>
                    <Modal.Title className="titre-condense">Nouveau tournoi</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {(erreur || erreurJeux) && <Alert variant="danger">{erreur ?? erreurJeux}</Alert>}

                    <ChampTexte id="creation-nom" etiquette="Nom du tournoi" valeur={nom} onChange={setNom} desactive={envoi} autoFocus />

                    <Form.Group className="mb-3" controlId="creation-jeu">
                        <Form.Label className="libelle">Jeu</Form.Label>
                        <Form.Select value={idJeu} onChange={(e) => setIdJeu(e.target.value)} required disabled={envoi || chargement}>
                            <option value="" disabled>{chargement ? 'Chargement…' : 'Choisir un jeu'}</option>
                            {jeux.map((jeu) => (
                                <option key={jeu.idJeu} value={jeu.idJeu}>
                                    {jeu.nomJeu} — {jeu.joueursParEquipe} joueurs
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>

                    <Form.Group controlId="creation-nombre">
                        <Form.Label className="libelle">Nombre d'équipes</Form.Label>
                        <Form.Select
                            value={nombreEquipes}
                            onChange={(e) => setNombreEquipes(Number(e.target.value) as NombreEquipes)}
                            disabled={envoi}
                        >
                            {NOMBRES_EQUIPES.map((n) => (
                                <option key={n} value={n}>{n} équipes — {n - 1} {n > 2 ? 'rencontres' : 'rencontre'}</option>
                            ))}
                        </Form.Select>
                        <Form.Text>Élimination directe : l'arbre est tiré au sort à la clôture des inscriptions.</Form.Text>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <button type="button" className="bouton-texte" onClick={onFermer} disabled={envoi}>Annuler</button>
                    <button type="submit" className="btn-principal btn-principal-compact" disabled={envoi || !nom.trim() || !idJeu}>
                        {envoi ? <Spinner size="sm" aria-label="Création en cours" /> : 'Créer le tournoi'}
                    </button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
}
