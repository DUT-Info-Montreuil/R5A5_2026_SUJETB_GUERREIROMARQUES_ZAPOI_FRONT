/** Un jeu du catalogue : logo, présentation, postes, et ses tournois (chacun mène à sa page). */

import { Link } from 'react-router-dom';

import { usePostes } from '../../hooks/usePostes';
import type { Jeu, TournoiResume } from '../../types/api';
import { VisuelJeu } from '../tournoi/VisuelJeu';
import { dotationAffichee } from '../tournoi/dotations';
import { identiteJeu } from '../tournoi/identitesJeux';
import { LIBELLES_STATUT, POINT_STATUT } from '../tournoi/presentation';
import { LogoJeu } from './LogoJeu';

interface Props {
    jeu: Jeu;
    tournois: TournoiResume[];
}

export function CarteJeu({ jeu, tournois }: Props) {
    const { description } = identiteJeu(jeu.nomJeu);
    const { postes, chargement: postesEnCours } = usePostes(jeu.idJeu);
    const ouverts = tournois.filter((t) => t.statutTournoi === 'INSCRIPTIONS_OUVERTES').length;

    return (
        <article className="jeu">
            <div className="jeu-visuel">
                <VisuelJeu nomJeu={jeu.nomJeu} />
                <LogoJeu nomJeu={jeu.nomJeu} taille={88} titre className="jeu-logo" />
            </div>
            <div className="jeu-corps d-flex flex-column gap-3">
                <div className="d-flex flex-column gap-2">
                    <span className="surtitre">{jeu.joueursParEquipe} {jeu.joueursParEquipe > 1 ? 'joueurs' : 'joueur'} par équipe</span>
                    <h2 className="jeu-nom titre-condense m-0">{jeu.nomJeu}</h2>
                    <p className="text-body-secondary m-0">{description}</p>
                </div>

                {postesEnCours ? (
                    <span className="squelette squelette-puces" aria-hidden="true" />
                ) : postes.length > 0 && (
                    <ul className="puces" aria-label={jeu.joueursParEquipe > 1 ? `Postes de ${jeu.nomJeu}` : `Format de ${jeu.nomJeu}`}>
                        {postes.map((poste) => <li key={poste.idRole} className="puce">{poste.libelleRole}</li>)}
                    </ul>
                )}

                <div className="jeu-tournois">
                    <span className="libelle small text-body-secondary">
                        {tournois.length === 0
                            ? 'Aucun tournoi pour ce jeu pour le moment'
                            : `${tournois.length} ${tournois.length > 1 ? 'tournois' : 'tournoi'}${ouverts > 0 ? ` · ${ouverts} ouvert${ouverts > 1 ? 's' : ''}` : ''}`}
                    </span>
                    {tournois.length > 0 && (
                        <ul className="jeu-liste">
                            {tournois.map((t) => (
                                <li key={t.idTournoi}>
                                    <Link to={`/tournois/${t.idTournoi}`} className="jeu-tournoi">
                                        <span className={POINT_STATUT[t.statutTournoi]} />
                                        <span className="jeu-tournoi-nom">{t.nomTournoi}</span>
                                        <span className="small text-body-secondary d-none d-sm-inline">{LIBELLES_STATUT[t.statutTournoi]}</span>
                                        <span className="jeu-tournoi-dotation">{dotationAffichee(t)}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </article>
    );
}
