/** Une rencontre de l'arbre : les deux côtés, le vainqueur mis en avant, et une place pour des actions. */

import type { ReactNode } from 'react';

import type { EquipeDeRencontre, Rencontre } from '../../types/api';
import { LIBELLES_RESULTAT } from './presentation';

interface Props {
    rencontre: Rencontre;
    /** Faux tant que le tournoi n'est pas lancé : une rencontre prête n'est pas encore « à jouer ». */
    lance: boolean;
    /** Côtés qui ne recevront jamais d'équipe. */
    sansAdversaireA: boolean;
    sansAdversaireB: boolean;
    actions?: ReactNode;
}

interface PropsCote {
    equipe?: EquipeDeRencontre;
    score?: number;
    sansAdversaire: boolean;
    rencontre: Rencontre;
}

function Cote({ equipe, score, sansAdversaire, rencontre }: PropsCote) {
    if (!equipe) {
        return <div className="rencontre-cote rencontre-cote-vide">{sansAdversaire ? "Pas d'adversaire" : 'À déterminer'}</div>;
    }
    const gagnant = rencontre.idVainqueur === equipe.idEquipe;
    const perdant = rencontre.idVainqueur !== undefined && !gagnant;
    const classe = gagnant ? 'rencontre-cote-gagnant' : perdant ? 'rencontre-cote-perdant' : '';

    return (
        <div className={`rencontre-cote ${classe}`}>
            <span className="text-truncate">{equipe.nomEquipe}</span>
            {perdant && rencontre.typeResultat === 'FORFAIT' && <span className="libelle small ms-auto">Forfait</span>}
            {score !== undefined && <span className="rencontre-score">{score}</span>}
        </div>
    );
}

function etat(rencontre: Rencontre, lance: boolean): string {
    if (rencontre.typeResultat) return LIBELLES_RESULTAT[rencontre.typeResultat];
    if (rencontre.statutRencontre === 'JOUABLE') return lance ? 'À jouer' : 'Prête';
    return 'En attente';
}

export function CarteRencontre({ rencontre, lance, sansAdversaireA, sansAdversaireB, actions }: Props) {
    const aJouer = lance && rencontre.statutRencontre === 'JOUABLE';

    return (
        <article className={aJouer ? 'rencontre rencontre-jouable' : 'rencontre'}>
            <Cote equipe={rencontre.equipeA} score={rencontre.scoreA} sansAdversaire={sansAdversaireA} rencontre={rencontre} />
            <Cote equipe={rencontre.equipeB} score={rencontre.scoreB} sansAdversaire={sansAdversaireB} rencontre={rencontre} />
            <div className="rencontre-pied">
                <span className="libelle small text-body-secondary">{etat(rencontre, lance)}</span>
                {actions}
            </div>
        </article>
    );
}
