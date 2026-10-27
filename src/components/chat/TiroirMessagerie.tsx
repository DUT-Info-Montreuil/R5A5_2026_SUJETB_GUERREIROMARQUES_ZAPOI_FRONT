/**
 * La messagerie : un bouton « Messages » en bas à gauche de l'écran, avec un
 * badge quand des messages n'ont pas été lus, et un tiroir qui s'ouvre à droite,
 * sur toute la hauteur. Le chat de chaque équipe en lice y est accessible, d'où
 * que l'on soit sur le site.
 *
 * Le tiroir ne bloque pas la page (on peut lire l'arbre pendant que l'on discute).
 * Échap le ferme ; le focus y entre à l'ouverture et revient au bouton à la fermeture.
 */

import { useEffect, useRef } from 'react';

import type { useMessagerie } from '../../hooks/useMessagerie';
import type { MonEquipe } from '../../types/api';
import { PanneauChat } from './PanneauChat';

interface Props {
    equipes: MonEquipe[];
    moiId: number;
    messagerie: ReturnType<typeof useMessagerie>;
    ouvert: boolean;
    selection: number | null;
    onSelection: (idEquipe: number) => void;
    onOuvrir: () => void;
    onFermer: () => void;
}

function IconeMessage() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
    );
}

export function TiroirMessagerie({ equipes, moiId, messagerie, ouvert, selection, onSelection, onOuvrir, onFermer }: Props) {
    const bouton = useRef<HTMLButtonElement>(null);
    const tiroir = useRef<HTMLElement>(null);
    const dejaOuvert = useRef(false);

    // L'équipe affichée : celle choisie ; sinon la première qui a des messages non lus ; sinon celle où l'on a parlé le plus récemment.
    const dernierMessage = (idEquipe: number) => messagerie.etat(idEquipe).messages.at(-1)?.idMessage ?? 0;
    const choisie = equipes.find((e) => e.idEquipe === selection)
        ?? equipes.find((e) => messagerie.nonLus(e.idEquipe) > 0)
        ?? [...equipes].sort((a, b) => dernierMessage(b.idEquipe) - dernierMessage(a.idEquipe))[0];
    const etat = choisie ? messagerie.etat(choisie.idEquipe) : null;
    const nombreMessages = etat?.messages.length ?? 0;

    // Tout ce qui est affiché dans le tiroir ouvert est lu.
    const { marquerLu } = messagerie;
    const idChoisie = choisie?.idEquipe;
    useEffect(() => {
        if (ouvert && idChoisie !== undefined) marquerLu(idChoisie);
        // marquerLu change quand les messages changent : il se réapplique à chaque arrivée.
    }, [ouvert, idChoisie, nombreMessages, marquerLu]);

    // Échap ferme ; le focus entre dans le tiroir à l'ouverture et revient au bouton ensuite.
    useEffect(() => {
        if (ouvert) {
            dejaOuvert.current = true;
            tiroir.current?.focus();
            const surTouche = (e: KeyboardEvent) => {
                if (e.key === 'Escape') onFermer();
            };
            document.addEventListener('keydown', surTouche);
            return () => document.removeEventListener('keydown', surTouche);
        }
        if (dejaOuvert.current) bouton.current?.focus();
    }, [ouvert, onFermer]);

    if (!choisie || !etat) return null;
    const total = messagerie.totalNonLus;

    return (
        <>
            <button
                ref={bouton}
                type="button"
                className={total > 0 ? 'messagerie-bouton messagerie-bouton-nouveau' : 'messagerie-bouton'}
                onClick={ouvert ? onFermer : onOuvrir}
                aria-expanded={ouvert}
                aria-controls="messagerie-tiroir"
            >
                <IconeMessage />
                <span>Messages</span>
                {total > 0 && (
                    <span className="messagerie-badge" aria-label={`${total} message${total > 1 ? 's' : ''} non lu${total > 1 ? 's' : ''}`}>
                        {total > 9 ? '9+' : total}
                    </span>
                )}
            </button>

            <aside
                id="messagerie-tiroir"
                ref={tiroir}
                className={ouvert ? 'messagerie-tiroir messagerie-tiroir-ouvert' : 'messagerie-tiroir'}
                aria-label="Messagerie des équipes"
                aria-hidden={!ouvert}
                inert={!ouvert}
                tabIndex={-1}
            >
                <header className="messagerie-entete">
                    <div className="d-flex flex-column gap-1 min-w-0">
                        <span className="surtitre">Messagerie</span>
                        {equipes.length > 1 ? (
                            <select
                                className="messagerie-choix form-select form-select-sm"
                                aria-label="Choisir une équipe"
                                value={choisie.idEquipe}
                                onChange={(e) => onSelection(Number(e.target.value))}
                            >
                                {equipes.map((e) => {
                                    const n = messagerie.nonLus(e.idEquipe);
                                    return <option key={e.idEquipe} value={e.idEquipe}>{e.nomEquipe} · {e.nomTournoi}{n > 0 ? ` (${n})` : ''}</option>;
                                })}
                            </select>
                        ) : (
                            <h2 className="messagerie-titre titre-condense m-0 text-truncate">{choisie.nomEquipe}</h2>
                        )}
                        {equipes.length === 1 && <span className="small text-body-secondary text-truncate">{choisie.nomTournoi}</span>}
                    </div>
                    <button type="button" className="bouton-carre" onClick={onFermer} aria-label="Fermer la messagerie">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12" /></svg>
                    </button>
                </header>
                <div className="messagerie-corps">
                    <PanneauChat
                        key={choisie.idEquipe}
                        messages={etat.messages}
                        chargement={etat.chargement}
                        erreurChargement={etat.erreur}
                        connecte={messagerie.connecte}
                        moiId={moiId}
                        peutEcrire
                        envoi={messagerie.envoi}
                        erreurEnvoi={messagerie.erreurEnvoi}
                        onEnvoyer={(contenu) => messagerie.envoyer(choisie.idEquipe, contenu)}
                        onEffacerErreur={messagerie.effacerErreurEnvoi}
                    />
                </div>
            </aside>
        </>
    );
}
