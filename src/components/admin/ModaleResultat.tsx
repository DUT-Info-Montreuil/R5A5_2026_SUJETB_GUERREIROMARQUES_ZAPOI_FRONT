/**
 * Saisie du résultat d'une rencontre (B-13 à B-15) : le vainqueur, le type de
 * résultat, et le score s'il s'agit d'un match joué.
 *
 * Seuls les choix permis par le contrat sont proposés : une équipe seule ne peut
 * être qu'en qualification d'office, deux équipes jamais. L'API revérifie tout.
 */

import { useState } from 'react';
import type { FormEvent } from 'react';
import { Alert, Form, Modal, Spinner } from 'react-bootstrap';

import { useSaisieResultat } from '../../hooks/useSaisieResultat';
import type { EquipeDeRencontre, Rencontre, TypeResultat } from '../../types/api';
import { LIBELLES_RESULTAT } from '../tournoi/presentation';

interface Props {
    rencontre: Rencontre;
    onFermer: () => void;
    onEnregistre: (rencontre: Rencontre) => void;
}

function lireScore(saisie: string): number | undefined {
    return saisie.trim() === '' ? undefined : Number(saisie);
}

export function ModaleResultat({ rencontre, onFermer, onEnregistre }: Props) {
    const { enregistrer, envoi, erreur } = useSaisieResultat();
    const equipes = [rencontre.equipeA, rencontre.equipeB].filter((e): e is EquipeDeRencontre => e !== undefined);
    const seule = equipes.length === 1;

    const [idVainqueur, setIdVainqueur] = useState<number>(equipes[0].idEquipe);
    const [typeResultat, setTypeResultat] = useState<TypeResultat>(seule ? 'QUALIFICATION_DIRECTE' : 'NORMAL');
    const [scoreA, setScoreA] = useState('');
    const [scoreB, setScoreB] = useState('');

    const typesPermis: TypeResultat[] = seule ? ['QUALIFICATION_DIRECTE'] : ['NORMAL', 'FORFAIT'];
    const avecScore = typeResultat === 'NORMAL';
    const scoreIncomplet = avecScore && (scoreA.trim() === '') !== (scoreB.trim() === '');

    async function soumettre(evenement: FormEvent<HTMLFormElement>) {
        evenement.preventDefault();
        const enregistree = await enregistrer(rencontre.idRencontre, {
            idVainqueur,
            typeResultat,
            scoreA: avecScore ? lireScore(scoreA) : undefined,
            scoreB: avecScore ? lireScore(scoreB) : undefined,
        });
        if (enregistree) onEnregistre(enregistree);
    }

    return (
        <Modal show onHide={onFermer} centered>
            <Form onSubmit={soumettre}>
                <Modal.Header closeButton>
                    <Modal.Title className="titre-condense">Résultat de la rencontre</Modal.Title>
                </Modal.Header>
                <Modal.Body className="d-flex flex-column gap-3">
                    {erreur && <Alert variant="danger" className="m-0">{erreur}</Alert>}

                    <fieldset>
                        <legend className="libelle fs-6">Vainqueur</legend>
                        {equipes.map((equipe) => (
                            <Form.Check
                                key={equipe.idEquipe}
                                type="radio"
                                id={`vainqueur-${equipe.idEquipe}`}
                                name="vainqueur"
                                label={equipe.nomEquipe}
                                checked={idVainqueur === equipe.idEquipe}
                                onChange={() => setIdVainqueur(equipe.idEquipe)}
                                disabled={envoi}
                            />
                        ))}
                    </fieldset>

                    <Form.Group controlId="resultat-type">
                        <Form.Label className="libelle">Type de résultat</Form.Label>
                        <Form.Select value={typeResultat} onChange={(e) => setTypeResultat(e.target.value as TypeResultat)} disabled={envoi || seule}>
                            {typesPermis.map((type) => <option key={type} value={type}>{LIBELLES_RESULTAT[type]}</option>)}
                        </Form.Select>
                        {seule && <Form.Text>Pas d'adversaire : l'équipe est qualifiée d'office.</Form.Text>}
                        {typeResultat === 'FORFAIT' && <Form.Text>L'autre équipe est déclarée forfait.</Form.Text>}
                    </Form.Group>

                    {avecScore && (
                        <div className="row g-3">
                            <Form.Group className="col-6" controlId="resultat-score-a">
                                <Form.Label className="libelle text-truncate d-block">{rencontre.equipeA?.nomEquipe}</Form.Label>
                                <Form.Control type="number" min={0} max={999} value={scoreA} onChange={(e) => setScoreA(e.target.value)} disabled={envoi} />
                            </Form.Group>
                            <Form.Group className="col-6" controlId="resultat-score-b">
                                <Form.Label className="libelle text-truncate d-block">{rencontre.equipeB?.nomEquipe}</Form.Label>
                                <Form.Control type="number" min={0} max={999} value={scoreB} onChange={(e) => setScoreB(e.target.value)} disabled={envoi} />
                            </Form.Group>
                            <Form.Text className="mt-1">Score facultatif ; s'il est saisi, les deux cases sont requises.</Form.Text>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <button type="button" className="bouton-texte" onClick={onFermer} disabled={envoi}>Annuler</button>
                    <button type="submit" className="btn-principal btn-principal-compact" disabled={envoi || scoreIncomplet}>
                        {envoi ? <Spinner size="sm" aria-label="Enregistrement en cours" /> : 'Valider le résultat'}
                    </button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
}
