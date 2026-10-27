/**
 * Filtres du calendrier : un statut à la fois, et une recherche sur le nom.
 * Composant contrôlé : le filtre vient de la page, qui le garde dans l'URL.
 * La recherche s'applique en tapant (après une courte pause), sans attendre « Entrée ».
 */

import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';

import type { FiltreTournois, StatutTournoi } from '../../types/api';
import { LIBELLES_STATUT } from './presentation';

const STATUTS: StatutTournoi[] = ['INSCRIPTIONS_OUVERTES', 'EN_COURS', 'INSCRIPTIONS_CLOSES', 'TERMINE'];

interface Props {
    filtre: FiltreTournois;
    onChange: (filtre: FiltreTournois) => void;
    /** Place le curseur dans la recherche à l'arrivée (clic sur la loupe de l'en-tête). */
    focusRecherche?: boolean;
}

export function FiltresTournois({ filtre, onChange, focusRecherche = false }: Props) {
    // Texte en cours de saisie : il devient un filtre après 250 ms sans frappe, ou tout de suite sur « Entrée ».
    const [saisie, setSaisie] = useState(filtre.recherche ?? '');
    // La dernière version du filtre et du rappel, sans relancer le minuteur à chaque rendu.
    const courant = useRef({ filtre, onChange });
    useEffect(() => {
        courant.current = { filtre, onChange };
    });

    useEffect(() => {
        const voulu = saisie.trim() || undefined;
        if (voulu === courant.current.filtre.recherche) return;
        const minuteur = window.setTimeout(() => courant.current.onChange({ ...courant.current.filtre, recherche: voulu }), 250);
        return () => window.clearTimeout(minuteur);
    }, [saisie]);

    function rechercher(evenement: FormEvent<HTMLFormElement>) {
        evenement.preventDefault();
        onChange({ ...filtre, recherche: saisie.trim() || undefined });
    }

    return (
        <div className="d-flex flex-wrap align-items-center gap-4">
            <div className="d-flex flex-wrap gap-4" role="group" aria-label="Filtrer par état">
                <button type="button" className="filtre" aria-pressed={!filtre.statut} onClick={() => onChange({ ...filtre, statut: undefined })}>
                    Tous
                </button>
                {STATUTS.map((statut) => (
                    <button key={statut} type="button" className="filtre" aria-pressed={filtre.statut === statut} onClick={() => onChange({ ...filtre, statut })}>
                        {LIBELLES_STATUT[statut]}
                    </button>
                ))}
            </div>
            <form role="search" onSubmit={rechercher} className="recherche flex-grow-1">
                <input type="search" autoFocus={focusRecherche} className="form-control form-control-sm" placeholder="Rechercher un tournoi" aria-label="Rechercher un tournoi" value={saisie} onChange={(e) => setSaisie(e.target.value)} />
            </form>
        </div>
    );
}
