/**
 * Le contenu d'un chat d'équipe : indicateur « en direct », fil de messages et
 * champ de saisie. Il n'a aucune source de données : celui qui l'utilise (la
 * messagerie latérale, ou la lecture seule d'un administrateur) lui donne les
 * messages et l'action d'envoi.
 *
 * Tout le texte est affiché comme du TEXTE (React échappe) : un message qui
 * contient du HTML s'affiche tel quel, il n'est jamais interprété.
 */

import { useEffect, useRef, useState } from 'react';
import type { FormEvent, KeyboardEvent } from 'react';
import { Alert, Form, Spinner } from 'react-bootstrap';

import type { Message } from '../../types/api';
import { horodatage } from '../equipe/presentation';

const LONGUEUR_MAX = 2000;

interface Props {
    messages: Message[];
    chargement: boolean;
    erreurChargement: string | null;
    connecte: boolean;
    /** Identifiant de l'utilisateur connecté : ses messages sont mis en avant. */
    moiId: number;
    /** Faux pour l'administrateur : il consulte l'espace, il n'y écrit pas. */
    peutEcrire: boolean;
    envoi: boolean;
    erreurEnvoi: string | null;
    /** Vrai si le message est parti : le champ de saisie se vide alors. */
    onEnvoyer: (contenu: string) => Promise<boolean>;
    onEffacerErreur: () => void;
}

export function PanneauChat({
    messages, chargement, erreurChargement, connecte, moiId, peutEcrire, envoi, erreurEnvoi, onEnvoyer, onEffacerErreur,
}: Props) {
    const [saisie, setSaisie] = useState('');
    const fil = useRef<HTMLDivElement>(null);

    // Toujours sur le dernier message : à l'ouverture, et à chaque arrivée.
    useEffect(() => {
        if (fil.current) fil.current.scrollTop = fil.current.scrollHeight;
    }, [messages.length]);

    const vide = saisie.trim() === '';

    async function envoyer(evenement?: FormEvent<HTMLFormElement>) {
        evenement?.preventDefault();
        if (vide || envoi) return;
        if (await onEnvoyer(saisie.trim())) setSaisie('');
    }

    // Entrée envoie, Maj+Entrée va à la ligne.
    function surTouche(evenement: KeyboardEvent<HTMLTextAreaElement>) {
        if (evenement.key === 'Enter' && !evenement.shiftKey) {
            evenement.preventDefault();
            void envoyer();
        }
    }

    return (
        <div className="chat">
            <div className="chat-entete">
                <span className="d-flex align-items-center gap-2 small">
                    <span className={connecte ? 'point' : 'point point-vide'} />
                    {connecte ? 'En direct' : 'Reconnexion…'}
                </span>
                {!peutEcrire && <span className="libelle small text-body-secondary">Lecture seule</span>}
            </div>

            <div className="chat-fil" ref={fil} role="log" aria-live="polite" aria-label="Messages de l'équipe">
                {chargement && <div className="py-4 text-center"><Spinner size="sm" aria-label="Chargement des messages" /></div>}
                {!chargement && messages.length === 0 && (
                    <p className="text-body-secondary m-0 py-4 text-center">Aucun message pour l'instant. Écris le premier !</p>
                )}
                {messages.map((message) => (
                    <article
                        key={message.idMessage}
                        className={message.idAuteur === moiId ? 'chat-message chat-message-moi' : 'chat-message'}
                    >
                        <header className="d-flex align-items-baseline gap-2">
                            <span className="fw-bold text-truncate">{message.pseudo ?? 'Ancien joueur'}</span>
                            <time className="small text-body-secondary" dateTime={message.envoyeLe}>{horodatage(message.envoyeLe)}</time>
                        </header>
                        <p className="chat-texte m-0">{message.contenu}</p>
                    </article>
                ))}
            </div>

            {erreurChargement && <Alert variant="warning" className="m-0 py-2 small">{erreurChargement}</Alert>}

            {peutEcrire && (
                <Form onSubmit={envoyer} className="chat-saisie">
                    {erreurEnvoi && <Alert variant="danger" className="py-2 small">{erreurEnvoi}</Alert>}
                    <div className="d-flex gap-3 align-items-stretch">
                        <Form.Control
                            as="textarea"
                            rows={2}
                            aria-label="Votre message"
                            placeholder="Écrire à l'équipe…"
                            value={saisie}
                            maxLength={LONGUEUR_MAX}
                            onChange={(e) => { setSaisie(e.target.value); onEffacerErreur(); }}
                            onKeyDown={surTouche}
                            disabled={envoi}
                        />
                        <button type="submit" className="btn-principal btn-principal-compact align-self-end" disabled={vide || envoi}>
                            {envoi ? <Spinner size="sm" aria-label="Envoi en cours" /> : 'Envoyer'}
                        </button>
                    </div>
                    <span className="small text-body-secondary">
                        Entrée pour envoyer, Maj + Entrée pour aller à la ligne · {saisie.length}/{LONGUEUR_MAX}
                    </span>
                </Form>
            )}
        </div>
    );
}
