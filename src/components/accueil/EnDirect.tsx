/**
 * « En direct » : pour chaque tournoi en cours, les matchs à jouer et les derniers
 * résultats. Chaque carte suit son tournoi en temps réel (useTournoi) : un score
 * saisi par l'administrateur apparaît ici sans recharger la page.
 */

import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';

import { useTournoi } from '../../hooks/useTournoi';
import type { Rencontre, TournoiResume } from '../../types/api';
import { LogoJeu } from '../jeux/LogoJeu';
import { identiteJeu } from '../tournoi/identitesJeux';
import { nomDuMatch } from '../tournoi/presentation';
import { IconeFleche } from '../ui/IconeFleche';
import { Revele } from '../vitrine/Revele';
import { EnteteSection } from './EnteteSection';

const MATCHS_PAR_CARTE = 3;

/** Les matchs prêts à jouer d'abord, puis les derniers terminés (les plus proches de la finale en tête). */
function matchsAMontrer(arbre: Rencontre[]): Rencontre[] {
    const avecDeuxEquipes = arbre.filter((r) => r.equipeA && r.equipeB);
    const aJouer = avecDeuxEquipes.filter((r) => r.statutRencontre === 'JOUABLE');
    const termines = avecDeuxEquipes
        .filter((r) => r.statutRencontre === 'TERMINE')
        .sort((a, b) => b.tour - a.tour || b.position - a.position);
    return [...aJouer, ...termines].slice(0, MATCHS_PAR_CARTE);
}

function LigneMatch({ rencontre, nombreDeTours }: { rencontre: Rencontre; nombreDeTours: number }) {
    const termine = rencontre.statutRencontre === 'TERMINE';
    const classe = (id?: number) => (termine && rencontre.idVainqueur === id ? 'direct-equipe direct-equipe-gagnante' : 'direct-equipe');
    return (
        <li className="direct-match">
            <span className="libelle small text-body-secondary">{nomDuMatch(rencontre.tour, nombreDeTours)}</span>
            <span className="direct-duel">
                <span className={classe(rencontre.equipeA?.idEquipe)}>{rencontre.equipeA?.nomEquipe}</span>
                <span className="direct-score">
                    {termine && rencontre.scoreA !== undefined && rencontre.scoreB !== undefined
                        ? `${rencontre.scoreA} – ${rencontre.scoreB}`
                        : termine ? 'Terminé' : 'à jouer'}
                </span>
                <span className={classe(rencontre.equipeB?.idEquipe)}>{rencontre.equipeB?.nomEquipe}</span>
            </span>
        </li>
    );
}

function CarteDirect({ tournoi }: { tournoi: TournoiResume }) {
    const { arbre, chargement } = useTournoi(tournoi.idTournoi);
    const { couleur } = identiteJeu(tournoi.jeu.nomJeu);
    const matchs = matchsAMontrer(arbre);
    const nombreDeTours = arbre.reduce((max, r) => Math.max(max, r.tour), 0);

    return (
        <article className="direct-carte" style={{ '--jeu-couleur': couleur } as CSSProperties}>
            <header className="d-flex align-items-center gap-3">
                <LogoJeu nomJeu={tournoi.jeu.nomJeu} taille={40} titre />
                <div className="d-flex flex-column min-w-0">
                    <h3 className="direct-titre m-0 text-truncate">{tournoi.nomTournoi}</h3>
                    <span className="small text-body-secondary">{tournoi.jeu.nomJeu}</span>
                </div>
                <span className="etiquette ms-auto flex-shrink-0"><span className="point" /> En direct</span>
            </header>
            {chargement && <span className="squelette squelette-ligne" aria-hidden="true" />}
            {!chargement && matchs.length === 0 && <p className="text-body-secondary small m-0">Les premiers matchs arrivent.</p>}
            <ul className="direct-matchs">
                {matchs.map((r) => <LigneMatch key={r.idRencontre} rencontre={r} nombreDeTours={nombreDeTours} />)}
            </ul>
            <Link to={`/tournois/${tournoi.idTournoi}`} className="lien-souligne d-inline-flex align-items-center gap-2 mt-auto">
                Suivre l'arbre <IconeFleche />
            </Link>
        </article>
    );
}

export function EnDirect({ tournois }: { tournois: TournoiResume[] }) {
    if (tournois.length === 0) return null;
    return (
        <section className="container-xxl px-4 px-lg-5 section-vitrine d-flex flex-column gap-4">
            <Revele><EnteteSection surtitre="Sur le terrain" titre="En direct" /></Revele>
            <ul className="direct">
                {tournois.map((tournoi, i) => (
                    <li key={tournoi.idTournoi}>
                        <Revele delai={i * 90} className="h-100"><CarteDirect tournoi={tournoi} /></Revele>
                    </li>
                ))}
            </ul>
        </section>
    );
}
