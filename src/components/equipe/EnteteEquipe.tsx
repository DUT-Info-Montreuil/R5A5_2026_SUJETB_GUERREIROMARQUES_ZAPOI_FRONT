/** Haut de la page d'une équipe : visuel du jeu, nom, état, effectif, et les actions de la page. */

import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

import type { Equipe, Tournoi } from '../../types/api';
import { LogoJeu } from '../jeux/LogoJeu';
import { VisuelJeu } from '../tournoi/VisuelJeu';
import { LIBELLES_STATUT_EQUIPE } from '../tournoi/presentation';
import { estSolo } from '../tournoi/vocabulaire';

interface Props {
    equipe: Equipe;
    tournoi: Tournoi;
    children?: ReactNode;
}

export function EnteteEquipe({ equipe, tournoi, children }: Props) {
    const vivante = equipe.statutEquipe === 'EN_LICE' || equipe.statutEquipe === 'VAINQUEUR';

    return (
        <section className="entete-tournoi entete-equipe">
            <VisuelJeu nomJeu={tournoi.jeu.nomJeu} className="entete-tournoi-visuel" />
            <div className="une-voile" />
            <div className="entete-tournoi-contenu container-xxl px-4 px-lg-5 d-flex flex-column gap-3">
                <Link to={`/tournois/${tournoi.idTournoi}`} className="lien-retour">← {tournoi.nomTournoi}</Link>
                <span className="d-flex align-items-center gap-3">
                    <LogoJeu nomJeu={tournoi.jeu.nomJeu} taille={48} />
                    <span className="surtitre">{tournoi.jeu.nomJeu}</span>
                </span>
                <h1 className="entete-tournoi-titre titre-condense m-0">{equipe.nomEquipe}</h1>
                <div className="d-flex flex-wrap align-items-center gap-3">
                    <span className="etiquette">
                        <span className={vivante ? 'point' : 'point point-vide'} />
                        {LIBELLES_STATUT_EQUIPE[equipe.statutEquipe]}
                    </span>
                    <span className="une-meta">
                        {estSolo(tournoi.jeu.joueursParEquipe) ? 'Solo' : `${equipe.membres.length}/${tournoi.jeu.joueursParEquipe} joueurs`}
                    </span>
                </div>
                {equipe.motifSortie && <p className="une-texte m-0">Motif : {equipe.motifSortie}</p>}
                {children && <div className="d-flex flex-wrap align-items-center gap-3 pt-2">{children}</div>}
            </div>
        </section>
    );
}
