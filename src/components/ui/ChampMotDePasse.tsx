/**
 * Champ de mot de passe avec un bouton Afficher / Masquer. L'état « visible »
 * ne concerne que ce champ : il reste ici plutôt que dans le formulaire.
 */

import { useState } from 'react';
import { Button, Form, InputGroup } from 'react-bootstrap';

interface Props {
    id: string;
    etiquette: string;
    valeur: string;
    onChange: (valeur: string) => void;
    autoComplete: 'current-password' | 'new-password';
    longueurMin?: number;
    aide?: string;
    desactive?: boolean;
}

export function ChampMotDePasse({ id, etiquette, valeur, onChange, autoComplete, longueurMin, aide, desactive = false }: Props) {
    const [visible, setVisible] = useState(false);

    return (
        <Form.Group className="mb-3" controlId={id}>
            <Form.Label className="libelle">{etiquette}</Form.Label>
            <InputGroup>
                <Form.Control
                    type={visible ? 'text' : 'password'}
                    value={valeur}
                    onChange={(e) => onChange(e.target.value)}
                    required
                    minLength={longueurMin}
                    autoComplete={autoComplete}
                    disabled={desactive}
                    aria-describedby={aide ? `${id}-aide` : undefined}
                />
                <Button variant="outline-secondary" className="bouton-champ" onClick={() => setVisible((v) => !v)} aria-pressed={visible} disabled={desactive}>
                    {visible ? 'Masquer' : 'Afficher'}
                </Button>
            </InputGroup>
            {aide && <Form.Text id={`${id}-aide`}>{aide}</Form.Text>}
        </Form.Group>
    );
}
