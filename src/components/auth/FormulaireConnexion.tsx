/**
 * Formulaire de connexion : il gère ses champs et délègue l'appel au hook.
 * Il ne navigue pas : il prévient la page par onSucces.
 */

import { useState } from 'react';
import type { FormEvent } from 'react';
import { Alert, Form, Spinner } from 'react-bootstrap';

import { useConnexion } from '../../hooks/useConnexion';
import { ChampMotDePasse } from '../ui/ChampMotDePasse';
import { ChampTexte } from '../ui/ChampTexte';
import { IconeFleche } from '../ui/IconeFleche';

interface Props {
    onSucces: () => void;
}

export function FormulaireConnexion({ onSucces }: Props) {
    const { connexion, envoi, erreur } = useConnexion();
    const [email, setEmail] = useState('');
    const [motDePasse, setMotDePasse] = useState('');

    async function soumettre(evenement: FormEvent<HTMLFormElement>) {
        evenement.preventDefault();
        if (await connexion({ email: email.trim(), motDePasse })) onSucces();
    }

    return (
        <Form onSubmit={soumettre}>
            {erreur && <Alert variant="danger">{erreur}</Alert>}

            <ChampTexte id="connexion-email" etiquette="Adresse e-mail" type="email" valeur={email} onChange={setEmail} autoComplete="email" desactive={envoi} autoFocus />
            <ChampMotDePasse id="connexion-mot-de-passe" etiquette="Mot de passe" valeur={motDePasse} onChange={setMotDePasse} autoComplete="current-password" desactive={envoi} />

            <button type="submit" className="btn-principal w-100 mt-3" disabled={envoi}>
                {envoi ? <Spinner size="sm" aria-label="Connexion en cours" /> : <>Se connecter <IconeFleche /></>}
            </button>
        </Form>
    );
}
