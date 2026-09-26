/** Bandeau de chiffres qui montent à l'arrivée sur la page. */

import { useCompteurAnime } from '../../hooks/useCompteurAnime';

export interface Chiffre {
    valeur: number;
    libelle: string;
}

function CaseChiffre({ valeur, libelle }: Chiffre) {
    const affiche = useCompteurAnime(valeur);
    return (
        <div className="chiffre">
            <span className="chiffre-valeur titre-condense">{affiche}</span>
            <span className="text-body-secondary">{libelle}</span>
        </div>
    );
}

export function ChiffresSaison({ chiffres }: { chiffres: Chiffre[] }) {
    return (
        <section className="chiffres" aria-label="La saison en chiffres">
            {chiffres.map((chiffre) => (
                <CaseChiffre key={chiffre.libelle} {...chiffre} />
            ))}
        </section>
    );
}
