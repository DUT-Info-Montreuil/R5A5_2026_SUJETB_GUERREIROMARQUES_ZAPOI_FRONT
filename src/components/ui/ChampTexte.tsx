/**
 * Champ de formulaire contrôlé : la valeur vient du parent, chaque frappe
 * remonte par onChange. L'étiquette est liée au champ (controlId), ce qui le
 * rend utilisable au clavier et au lecteur d'écran.
 */

import { Form } from 'react-bootstrap';

interface Props {
    id: string;
    etiquette: string;
    type?: 'text' | 'email';
    valeur: string;
    onChange: (valeur: string) => void;
    autoComplete?: string;
    aide?: string;
    desactive?: boolean;
    autoFocus?: boolean;
}

export function ChampTexte({ id, etiquette, type = 'text', valeur, onChange, autoComplete, aide, desactive = false, autoFocus = false }: Props) {
    return (
        <Form.Group className="mb-3" controlId={id}>
            <Form.Label className="libelle">{etiquette}</Form.Label>
            <Form.Control
                type={type}
                value={valeur}
                onChange={(e) => onChange(e.target.value)}
                required
                autoComplete={autoComplete}
                disabled={desactive}
                autoFocus={autoFocus}
                aria-describedby={aide ? `${id}-aide` : undefined}
            />
            {aide && <Form.Text id={`${id}-aide`}>{aide}</Form.Text>}
        </Form.Group>
    );
}
