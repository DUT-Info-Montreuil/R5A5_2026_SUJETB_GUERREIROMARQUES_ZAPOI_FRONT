/**
 * L'espace d'échange d'une équipe lu par un administrateur (B-18) : lecture
 * seule, sur la page de l'équipe. Les membres, eux, passent par la messagerie
 * latérale (voir components/chat/TiroirMessagerie).
 */

import { useChatEquipe } from '../../hooks/useChatEquipe';
import type { FinDAcces } from '../../hooks/useChatEquipe';
import { PanneauChat } from '../chat/PanneauChat';

interface Props {
    idEquipe: number;
    /** Identifiant de l'utilisateur connecté. */
    moiId: number;
    /** La page est prévenue quand l'accès est retiré : elle affiche l'avis et relit l'équipe. */
    surFinDAcces: (fin: FinDAcces) => void;
}

export function ChatEquipe({ idEquipe, moiId, surFinDAcces }: Props) {
    const chat = useChatEquipe(idEquipe, { actif: true, surFinDAcces });

    // L'accès est retiré : la page affiche l'avis à la place du chat.
    if (chat.finDAcces !== null) return null;

    return (
        <PanneauChat
            messages={chat.messages}
            chargement={chat.chargement}
            erreurChargement={chat.erreurChargement}
            connecte={chat.connecte}
            moiId={moiId}
            peutEcrire={false}
            envoi={chat.envoi}
            erreurEnvoi={chat.erreurEnvoi}
            onEnvoyer={chat.envoyer}
            onEffacerErreur={chat.effacerErreurEnvoi}
        />
    );
}
