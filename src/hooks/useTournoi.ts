/**
 * Tout ce qu'affiche la page d'un tournoi : le tournoi, ses équipes, son arbre,
 * tenus à jour en temps réel.
 *
 * Même principe que useTournois : le chargement se déduit du fait que les
 * données affichées ne correspondent pas encore à la dernière demande. Pendant
 * un rechargement, les anciennes données restent à l'écran.
 */

import { useCallback, useEffect, useState } from 'react';

import { ErreurHttp } from '../api/client';
import { arbreDuTournoi, detailTournoi, equipesDuTournoi } from '../api/tournois';
import type { EquipeDuTournoi, Rencontre, Tournoi } from '../types/api';
import { useSuiviTournoi } from './useSuiviTournoi';

interface Donnees {
    cle: string;
    tournoi: Tournoi | null;
    equipes: EquipeDuTournoi[];
    arbre: Rencontre[];
    erreur: string | null;
    introuvable: boolean;
}

/** Quelle requête a échoué : « tournoi introuvable » ne se dit que si c'est le tournoi lui-même qui manque. */
type Etape = 'le tournoi' | 'les équipes' | "l'arbre";

class EchecChargement extends Error {
    etape: Etape;
    origine: unknown;

    constructor(etape: Etape, origine: unknown) {
        super(`Échec du chargement de ${etape}`);
        this.etape = etape;
        this.origine = origine;
    }
}

function decrireEchec(e: unknown): { introuvable: boolean; erreur: string } {
    if (!(e instanceof EchecChargement)) return { introuvable: false, erreur: 'Impossible de charger le tournoi.' };
    const http = e.origine instanceof ErreurHttp ? e.origine : null;
    if (e.etape === 'le tournoi' && http?.statut === 404) return { introuvable: true, erreur: 'Tournoi introuvable.' };
    // Une autre requête a échoué (équipes, arbre) : le tournoi existe, on le dit au lieu de mentir.
    const detail = http ? `${http.message}${http.statut ? ` (HTTP ${http.statut})` : ''}` : 'erreur inattendue';
    return { introuvable: false, erreur: `Impossible de charger ${e.etape} : ${detail}` };
}

export function useTournoi(idTournoi: number) {
    const [tentative, setTentative] = useState(0);
    const [donnees, setDonnees] = useState<Donnees | null>(null);
    const cle = `${idTournoi}-${tentative}`;

    useEffect(() => {
        let actuelle = true;
        // allSettled : on attend les trois réponses, puis on juge dans un ordre fixe (le tournoi d'abord).
        // Avec Promise.all, la première requête à échouer décidait du message, au hasard de la vitesse du réseau.
        Promise.allSettled([detailTournoi(idTournoi), equipesDuTournoi(idTournoi), arbreDuTournoi(idTournoi)]).then(([tournoi, equipes, arbre]) => {
            if (!actuelle) return;
            if (tournoi.status === 'rejected') return signaler(new EchecChargement('le tournoi', tournoi.reason));
            if (equipes.status === 'rejected') return signaler(new EchecChargement('les équipes', equipes.reason));
            if (arbre.status === 'rejected') return signaler(new EchecChargement("l'arbre", arbre.reason));
            setDonnees({ cle, tournoi: tournoi.value, equipes: equipes.value, arbre: arbre.value, erreur: null, introuvable: false });
        });

        function signaler(echec: EchecChargement) {
            const { introuvable, erreur } = decrireEchec(echec);
            setDonnees({ cle, tournoi: null, equipes: [], arbre: [], erreur, introuvable });
        }
        return () => {
            actuelle = false;
        };
    }, [cle, idTournoi]);

    const recharger = useCallback(() => setTentative((n) => n + 1), []);

    useSuiviTournoi(idTournoi, {
        // Une transition a pu générer l'arbre ou déclarer des forfaits : on relit tout.
        surTournoi: recharger,
        surRencontre: (rencontre) => {
            setDonnees((d) => d && {
                ...d,
                arbre: d.arbre.map((r) => (r.idRencontre === rencontre.idRencontre ? rencontre : r)),
            });
            // Le perdant vient d'être éliminé : seul le statut des équipes a changé.
            equipesDuTournoi(idTournoi)
                .then((equipes) => setDonnees((d) => d && { ...d, equipes }))
                .catch(() => undefined);
        },
    });

    return {
        tournoi: donnees?.tournoi ?? null,
        equipes: donnees?.equipes ?? [],
        arbre: donnees?.arbre ?? [],
        erreur: donnees?.cle === cle ? donnees.erreur : null,
        introuvable: donnees?.cle === cle && donnees.introuvable,
        chargement: donnees?.cle !== cle,
        recharger,
    };
}
