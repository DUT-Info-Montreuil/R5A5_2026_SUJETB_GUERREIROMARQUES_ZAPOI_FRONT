/**
 * Page /diagnostic : vérifie que front, API, base et temps réel se parlent.
 * Utile quand « plus rien ne marche » : elle dit quel maillon manque.
 */

import { Alert, Badge, Card, ListGroup, Spinner } from 'react-bootstrap';

import { useEtatChaine } from '../hooks/useEtatChaine';

function Etat({ ok }: { ok: boolean }) {
    return <Badge bg={ok ? 'success' : 'danger'}>{ok ? 'opérationnel' : 'injoignable'}</Badge>;
}

export function DiagnosticPage() {
    const { sante, erreur, chargement, tempsReel, verifier } = useEtatChaine();
    const base = sante?.baseDeDonnees;

    return (
        <Card className="mx-auto my-5" style={{ maxWidth: '34rem' }}>
            <Card.Body className="p-4">
                <Card.Title as="h1" className="h4 text-uppercase">État de la chaîne</Card.Title>
                <Card.Text className="text-body-secondary">Front, API, base de données et temps réel.</Card.Text>

                {erreur && <Alert variant="danger">{erreur}</Alert>}

                <ListGroup variant="flush" className="mb-3">
                    <ListGroup.Item className="d-flex justify-content-between">
                        API <Etat ok={sante !== null} />
                    </ListGroup.Item>
                    <ListGroup.Item className="d-flex justify-content-between">
                        Base de données <Etat ok={base?.joignable ?? false} />
                    </ListGroup.Item>
                    <ListGroup.Item className="d-flex justify-content-between">
                        Schéma
                        <span>{base?.schemaComplet ? `${base.tables} tables` : '—'}</span>
                    </ListGroup.Item>
                    <ListGroup.Item className="d-flex justify-content-between">
                        Temps réel <Etat ok={tempsReel} />
                    </ListGroup.Item>
                </ListGroup>

                <button type="button" className="btn-principal w-100" onClick={verifier} disabled={chargement}>
                    {chargement ? <Spinner size="sm" /> : 'Revérifier'}
                </button>
            </Card.Body>
        </Card>
    );
}
