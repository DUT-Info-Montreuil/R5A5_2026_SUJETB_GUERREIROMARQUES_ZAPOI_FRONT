/** Formulaire d'inscription. Les règles affichées sont celles de l'API. */

import { useState } from 'react';
import type { FormEvent } from 'react';
import { Alert, Form, Spinner } from 'react-bootstrap';

import { useInscription } from '../../hooks/useInscription';
import { ChampMotDePasse } from '../ui/ChampMotDePasse';
import { ChampTexte } from '../ui/ChampTexte';
import { IconeFleche } from '../ui/IconeFleche';

// Même valeur que MOT_DE_PASSE_LONGUEUR_MIN côté back (dtos/auth_dto.py).
const MOT_DE_PASSE_LONGUEUR_MIN = 12;

interface Props {
    onSucces: () => void;
}

export function FormulaireInscription({ onSucces }: Props) {
    const { inscription, envoi, erreur } = useInscription();
    const [pseudo, setPseudo] = useState('');
    const [email, setEmail] = useState('');
    const [motDePasse, setMotDePasse] = useState('');

    async function soumettre(evenement: FormEvent<HTMLFormElement>) {
        evenement.preventDefault();
        if (await inscription({ pseudo: pseudo.trim(), email: email.trim(), motDePasse })) onSucces();
    }

    return (
        <Form onSubmit={soumettre}>
            {erreur && <Alert variant="danger">{erreur}</Alert>}

            <ChampTexte id="inscription-pseudo" etiquette="Pseudo" valeur={pseudo} onChange={setPseudo} autoComplete="username" aide="3 à 50 caractères : lettres, chiffres, point, tiret, tiret bas." desactive={envoi} autoFocus />
            <ChampTexte id="inscription-email" etiquette="Adresse e-mail" type="email" valeur={email} onChange={setEmail} autoComplete="email" desactive={envoi} />
            <ChampMotDePasse
                id="inscription-mot-de-passe"
                etiquette="Mot de passe"
                valeur={motDePasse}
                onChange={setMotDePasse}
                autoComplete="new-password"
                longueurMin={MOT_DE_PASSE_LONGUEUR_MIN}
                aide={`${MOT_DE_PASSE_LONGUEUR_MIN} caractères minimum. Une phrase de quelques mots fait très bien l'affaire.`}
                desactive={envoi}
            />

            <button type="submit" className="btn-principal w-100 mt-3" disabled={envoi}>
                {envoi ? <Spinner size="sm" aria-label="Création du compte" /> : <>Créer mon compte <IconeFleche /></>}
            </button>
        </Form>
    );
}
