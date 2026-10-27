/**
 * Page /jeux — le catalogue : chaque jeu avec son logo, ses postes et ses
 * tournois. La liste des jeux vient de l'API (GET /api/jeux) : un jeu sans
 * tournoi apparaît quand même. Un catalogue de douze jeux se parcourt : on
 * le filtre par famille, par nom, ou on ne garde que les jeux qui recrutent.
 */

import { useMemo, useState } from 'react';
import { Alert } from 'react-bootstrap';

import { EnteteSection } from '../components/accueil/EnteteSection';
import { CarteJeu } from '../components/jeux/CarteJeu';
import { GENRES, identiteJeu, rangJeu } from '../components/tournoi/identitesJeux';
import type { Genre } from '../components/tournoi/identitesJeux';
import { useJeux } from '../hooks/useJeux';
import { useTitrePage } from '../hooks/useTitrePage';
import { useTournois } from '../hooks/useTournois';
import type { FiltreTournois } from '../types/api';

const SANS_FILTRE: FiltreTournois = {};

/** Sans accents ni majuscules : « echecs » trouve « Échecs ». */
function normaliser(texte: string): string {
    return texte.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

function CartesEnAttente() {
    return (
        <div className="jeux" aria-hidden="true">
            {[0, 1, 2].map((i) => <div key={i} className="jeu carte-attente"><span className="squelette" /></div>)}
        </div>
    );
}

export function JeuxPage() {
    useTitrePage('Jeux');
    const { jeux, chargement, erreur } = useJeux();
    const { tournois } = useTournois(SANS_FILTRE);
    const [recherche, setRecherche] = useState('');
    const [genre, setGenre] = useState<Genre | null>(null);
    const [recrutent, setRecrutent] = useState(false);

    const ouvertsDe = (idJeu: number) => tournois.filter((t) => t.jeu.idJeu === idJeu && t.statutTournoi === 'INSCRIPTIONS_OUVERTES').length;

    const genresPresents = useMemo(
        () => GENRES.filter((g) => jeux.some((j) => identiteJeu(j.nomJeu).genre === g)),
        [jeux],
    );

    const requete = normaliser(recherche.trim());
    const visibles = jeux
        .filter((j) => !genre || identiteJeu(j.nomJeu).genre === genre)
        .filter((j) => !requete || normaliser(j.nomJeu).includes(requete))
        .filter((j) => !recrutent || ouvertsDe(j.idJeu) > 0)
        // Les jeux qui recrutent d'abord : c'est ce qu'on vient chercher.
        .sort((a, b) => ouvertsDe(b.idJeu) - ouvertsDe(a.idJeu) || rangJeu(a.nomJeu) - rangJeu(b.nomJeu));

    const filtreActif = genre !== null || requete !== '' || recrutent;
    function toutEffacer() {
        setGenre(null);
        setRecherche('');
        setRecrutent(false);
    }

    return (
        <section className="container-xxl px-4 px-lg-5 section-tournoi d-flex flex-column gap-4 pb-5">
            <EnteteSection surtitre="Les jeux" titre="Choisis ton terrain">
                <p className="texte-section m-0">
                    Des jeux en équipes, ou en duel, avec des postes définis. Chaque tournoi garde les postes propres à
                    son jeu : un rôle par joueur.
                </p>
            </EnteteSection>

            {erreur && <Alert variant="danger">{erreur}</Alert>}

            {jeux.length > 0 && (
                <div className="barre-filtres d-flex flex-column gap-3">
                    <div className="d-flex flex-wrap align-items-center gap-4">
                        <div className="d-flex flex-wrap gap-4" role="group" aria-label="Filtrer par famille de jeux">
                            <button type="button" className="filtre" aria-pressed={genre === null} onClick={() => setGenre(null)}>
                                Tous <span className="filtre-compte">{jeux.length}</span>
                            </button>
                            {genresPresents.map((g) => (
                                <button key={g} type="button" className="filtre" aria-pressed={genre === g} onClick={() => setGenre(genre === g ? null : g)}>
                                    {g} <span className="filtre-compte">{jeux.filter((j) => identiteJeu(j.nomJeu).genre === g).length}</span>
                                </button>
                            ))}
                        </div>
                        <div role="search" className="recherche flex-grow-1">
                            <input
                                type="search"
                                className="form-control form-control-sm"
                                placeholder="Chercher un jeu"
                                aria-label="Chercher un jeu"
                                value={recherche}
                                onChange={(e) => setRecherche(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="d-flex flex-wrap align-items-center gap-4">
                        <label className="case-filtre">
                            <input type="checkbox" checked={recrutent} onChange={(e) => setRecrutent(e.target.checked)} />
                            <span>Seulement les jeux avec des inscriptions ouvertes</span>
                        </label>
                        <span className="small text-body-secondary ms-auto" role="status" aria-live="polite">
                            {visibles.length} {visibles.length > 1 ? 'jeux' : 'jeu'}
                            {filtreActif && <> · <button type="button" className="bouton-texte" onClick={toutEffacer}>Tout effacer</button></>}
                        </span>
                    </div>
                </div>
            )}

            {chargement && <CartesEnAttente />}

            {!chargement && jeux.length > 0 && visibles.length === 0 && (
                <div className="vide-joueur">
                    <h2 className="titre-condense m-0">Aucun jeu ne correspond</h2>
                    <p className="text-body-secondary m-0">Essaie un autre mot, ou retire un filtre.</p>
                    <button type="button" className="btn-contour" onClick={toutEffacer}>Tout effacer</button>
                </div>
            )}

            <div className="jeux">
                {visibles.map((jeu) => (
                    <CarteJeu key={jeu.idJeu} jeu={jeu} tournois={tournois.filter((t) => t.jeu.idJeu === jeu.idJeu)} />
                ))}
            </div>
        </section>
    );
}
