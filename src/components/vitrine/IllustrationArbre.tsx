/**
 * L'arbre d'un tournoi à huit équipes, dessiné en SVG : huit places, quatre
 * quarts, deux demies, une finale et le trophée. Le chemin du vainqueur se
 * trace en boucle. Illustration décorative (aria-hidden) : le vrai arbre, avec
 * les vraies équipes, est sur la page de chaque tournoi.
 */

// Coordonnées : colonne 0 = 8 places à gauche, puis quarts, demies, finale.
const X = [20, 150, 280, 410];
const LARGEUR_PLACE = 96;
const HAUTEUR_PLACE = 26;
const Y_PLACES = [30, 80, 140, 190, 250, 300, 360, 410].map((y) => y - 10);

function centre(y: number) {
    return y + HAUTEUR_PLACE / 2;
}

// Hauteur centrale de chaque rencontre aux tours suivants : milieu de ses deux sources.
const Y_QUARTS = [0, 1, 2, 3].map((i) => (centre(Y_PLACES[2 * i]!) + centre(Y_PLACES[2 * i + 1]!)) / 2);
const Y_DEMIES = [0, 1].map((i) => (Y_QUARTS[2 * i]! + Y_QUARTS[2 * i + 1]!) / 2);
const Y_FINALE = (Y_DEMIES[0]! + Y_DEMIES[1]!) / 2;

/** Coude : sort du côté droit d'une case, descend ou monte jusqu'à la case suivante. */
function coude(xDepart: number, yDepart: number, xArrivee: number, yArrivee: number) {
    const milieu = (xDepart + xArrivee) / 2;
    return `M${xDepart} ${yDepart}H${milieu}V${yArrivee}H${xArrivee}`;
}

export function IllustrationArbre() {
    const liaisons: { d: string; chemin: boolean }[] = [];
    // Premier tour → quarts.
    Y_PLACES.forEach((y, i) => liaisons.push({ d: coude(X[0]! + LARGEUR_PLACE, centre(y), X[1]!, Y_QUARTS[Math.floor(i / 2)]!), chemin: i < 2 }));
    // Quarts → demies.
    Y_QUARTS.forEach((y, i) => liaisons.push({ d: coude(X[1]! + LARGEUR_PLACE, y, X[2]!, Y_DEMIES[Math.floor(i / 2)]!), chemin: i < 2 }));
    // Demies → finale.
    Y_DEMIES.forEach((y, i) => liaisons.push({ d: coude(X[2]! + LARGEUR_PLACE, y, X[3]!, Y_FINALE), chemin: i === 0 }));

    return (
        <svg className="arbre-illustre" viewBox="0 0 540 440" role="presentation" aria-hidden="true">
            <defs>
                <linearGradient id="arbre-degrade" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0" stopColor="#8B5CF6" />
                    <stop offset="1" stopColor="#F472B6" />
                </linearGradient>
            </defs>

            {/* Les liaisons : traits discrets, puis le chemin du vainqueur par-dessus. */}
            <g className="arbre-liaisons">
                {liaisons.map((l, i) => <path key={i} d={l.d} />)}
            </g>
            <g className="arbre-chemin">
                {liaisons.filter((l) => l.chemin).map((l, i) => <path key={i} d={l.d} pathLength={1} style={{ animationDelay: `${i * 0.35}s` }} />)}
            </g>

            {/* Les cases : une barre pour le nom, une pastille pour le logo. */}
            {Y_PLACES.map((y, i) => (
                <g key={`p${i}`} className={i < 2 ? 'arbre-case arbre-case-gagnante' : 'arbre-case'} transform={`translate(${X[0]} ${y})`}>
                    <rect width={LARGEUR_PLACE} height={HAUTEUR_PLACE} />
                    <rect className="arbre-pastille" x="6" y="6" width="14" height="14" />
                    <rect className="arbre-nom" x="28" y="10" width={30 + ((i * 17) % 26)} height="5" />
                </g>
            ))}
            {Y_QUARTS.map((y, i) => (
                <g key={`q${i}`} className={i === 0 ? 'arbre-case arbre-case-gagnante' : 'arbre-case'} transform={`translate(${X[1]} ${y - HAUTEUR_PLACE / 2})`}>
                    <rect width={LARGEUR_PLACE} height={HAUTEUR_PLACE} />
                    <rect className="arbre-pastille" x="6" y="6" width="14" height="14" />
                    <rect className="arbre-nom" x="28" y="10" width={36 + ((i * 11) % 20)} height="5" />
                </g>
            ))}
            {Y_DEMIES.map((y, i) => (
                <g key={`d${i}`} className={i === 0 ? 'arbre-case arbre-case-gagnante' : 'arbre-case'} transform={`translate(${X[2]} ${y - HAUTEUR_PLACE / 2})`}>
                    <rect width={LARGEUR_PLACE} height={HAUTEUR_PLACE} />
                    <rect className="arbre-pastille" x="6" y="6" width="14" height="14" />
                    <rect className="arbre-nom" x="28" y="10" width="44" height="5" />
                </g>
            ))}

            {/* La finale et le trophée. */}
            <g transform={`translate(${X[3]} ${Y_FINALE - HAUTEUR_PLACE / 2})`} className="arbre-case arbre-case-gagnante">
                <rect width={LARGEUR_PLACE} height={HAUTEUR_PLACE} />
                <rect className="arbre-pastille" x="6" y="6" width="14" height="14" />
                <rect className="arbre-nom" x="28" y="10" width="50" height="5" />
            </g>
            {/* Le groupe extérieur place le trophée ; le groupe intérieur flotte (une animation CSS remplacerait un transform placé sur le même élément). */}
            <g transform={`translate(${X[3] + 24} ${Y_FINALE - 112})`}>
                <g className="arbre-trophee">
                    <path d="M0 0h48v28a24 24 0 0 1-48 0z" fill="url(#arbre-degrade)" />
                    <path d="M0 8H-12a12 12 0 0 0 12 20M48 8h12a12 12 0 0 1-12 20" fill="none" stroke="url(#arbre-degrade)" strokeWidth="5" />
                    <rect x="20" y="52" width="8" height="14" fill="url(#arbre-degrade)" />
                    <rect x="8" y="66" width="32" height="8" fill="url(#arbre-degrade)" />
                </g>
            </g>
        </svg>
    );
}
