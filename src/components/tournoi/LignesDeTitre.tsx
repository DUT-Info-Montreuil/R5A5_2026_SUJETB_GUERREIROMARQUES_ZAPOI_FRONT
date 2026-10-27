/**
 * Le nom d'un tournoi sur plusieurs lignes : « Coupe Inter-IUT — Automne 2026 »
 * se lit sur deux lignes, sans le tiret. Un mot à trait d'union ne se coupe pas.
 * Le nom complet reste celui du titre pour les lecteurs d'écran.
 */

function mots(ligne: string) {
    return ligne.split(' ').map((mot, i) => (
        <span key={i} className={mot.includes('-') ? 'insecable' : undefined}>{i > 0 ? ' ' : ''}{mot}</span>
    ));
}

/** `animee` : chaque ligne monte à son tour (la une) ; sinon, simples lignes (en-têtes de page). */
export function LignesDeTitre({ nom, animee = false }: { nom: string; animee?: boolean }) {
    const lignes = nom.split(' — ');
    return (
        <>
            {lignes.map((ligne, i) => {
                // L'espace en tête des lignes suivantes garde un texte lisible (copier-coller, lecteurs d'écran) ;
                // l'affichage, lui, l'ignore (blocs).
                const contenu = <>{i > 0 && ' '}{mots(ligne)}</>;
                return animee ? (
                    <span key={ligne} className="ligne-revelee"><span>{contenu}</span></span>
                ) : (
                    <span key={ligne} className="d-block">{contenu}</span>
                );
            })}
        </>
    );
}
