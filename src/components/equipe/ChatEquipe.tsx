/**
 * L'espace d'échange d'une équipe (B-16 à B-18) : les messages, tenus à jour
 * en direct, et le champ de saisie.
 *
 * Tout le texte est affiché comme du TEXTE (React échappe) : un message qui
 * contient du HTML s'affiche tel quel, il n'est jamais interprété.
 */

import { useEffect, useRef, useState } from 'react';
import type { FormEvent, KeyboardEvent } from 'react';
import { Alert, Form, Spinner } from 'react-bootstrap';

import { useChatEquipe } from '../../hooks/useChatEquipe';
import type { FinDAcces } from '../../hooks/useChatEquipe';
import { horodatage } from './presentation';

const LONGUEUR_MAX = 2000;

interface Props {
    idEquipe: number;
    /** Identifiant de l'utilisateur connecté : ses messages sont mis en avant. */
    moiId: number;
    /** Faux pour l'administrateur : il consulte l'espace, il n'y écrit pas. */
    peutEcrire: boolean;
    /** La page est prévenue quand l'accès est retiré : elle affiche l'avis et relit l'équipe. */
    surFinDAcces: (fin: FinDAcces) => void;
}

export function ChatEquipe({ idEquipe, moiId, peutEcrire, surFinDAcces }: Props) {
    const chat = useChatEquipe(idEquipe, { actif: true, surFinDAcces });
    const [saisie, setSaisie] = useState('');
    const fil = useRef<HTMLDivElement>(null);

    // Toujours sur le dernier message : à l'ouverture, et à chaque arrivée.
    useEffect(() => {
        if (fil.current) fil.current.scrollTop = fil.current.scrollHeight;
    }, [chat.messages.length]);

    // L'accès est retiré : la page affiche l'avis à la place du chat.
    if (chat.finDAcces !== null) return null;

    const vide = saisie.trim() === '';

    async function envoyer(evenement?: FormEvent<HTMLFormElement>) {
        evenement?.preventDefault();
        if (vide || chat.envoi) return;
        if (await chat.envoyer(saisie.trim())) setSaisie('');
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
                    <span className={chat.connecte ? 'point' : 'point point-vide'} />
                    {chat.connecte ? 'En direct' : 'Reconnexion…'}
                </span>
                {!peutEcrire && <span className="libelle small text-body-secondary">Lecture seule</span>}
            </div>

            <div className="chat-fil" ref={fil} role="log" aria-live="polite" aria-label="Messages de l'équipe">
                {chat.chargement && <div className="py-4 text-center"><Spinner size="sm" aria-label="Chargement des messages" /></div>}
                {!chat.chargement && chat.messages.length === 0 && (
                    <p className="text-body-secondary m-0 py-4 text-center">Aucun message pour l'instant.</p>
                )}
                {chat.messages.map((message) => (
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

            {chat.erreurChargement && <Alert variant="warning" className="m-0 py-2 small">{chat.erreurChargement}</Alert>}

            {peutEcrire && (
                <Form onSubmit={envoyer} className="chat-saisie">
                    {chat.erreurEnvoi && <Alert variant="danger" className="py-2 small">{chat.erreurEnvoi}</Alert>}
                    <div className="d-flex gap-3 align-items-stretch">
                        <Form.Control
                            as="textarea"
                            rows={2}
                            aria-label="Votre message"
                            placeholder="Écrire à l'équipe…"
                            value={saisie}
                            maxLength={LONGUEUR_MAX}
                            onChange={(e) => { setSaisie(e.target.value); chat.effacerErreurEnvoi(); }}
                            onKeyDown={surTouche}
                            disabled={chat.envoi}
                        />
                        <button type="submit" className="btn-principal btn-principal-compact align-self-end" disabled={vide || chat.envoi}>
                            {chat.envoi ? <Spinner size="sm" aria-label="Envoi en cours" /> : 'Envoyer'}
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
