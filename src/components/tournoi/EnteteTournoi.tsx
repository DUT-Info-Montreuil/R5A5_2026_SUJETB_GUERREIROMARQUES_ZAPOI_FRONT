/** Haut de la page d'un tournoi : visuel du jeu, nom, état, étapes, et les actions de la page. */

import type { ReactNode } from 'react';

import type { Tournoi } from '../../types/api';
import { VisuelJeu } from './VisuelJeu';
import { LIBELLES_STATUT, POINT_STATUT, dateLongue, descriptionTournoi } from './presentation';

interface Props {
    tournoi: Tournoi;
    surtitre?: string;
    children?: ReactNode;
}

export function EnteteTournoi({ tournoi, surtitre, children }: Props) {
    const etapes = [
        { libelle: 'Créé le', date: tournoi.creeLe },
        { libelle: 'Inscriptions closes le', date: tournoi.inscriptionsClosesLe },
        { libelle: 'Lancé le', date: tournoi.demarreLe },
        { libelle: 'Terminé le', date: tournoi.termineLe },
    ].filter((etape): etape is { libelle: string; date: string } => etape.date !== undefined);

    return (
        <section className="entete-tournoi">
            <VisuelJeu nomJeu={tournoi.jeu.nomJeu} className="entete-tournoi-visuel" />
            <div className="une-voile" />
            <div className="entete-tournoi-contenu container-xxl px-4 px-lg-5 d-flex flex-column gap-3">
                <span className="surtitre">{surtitre ?? tournoi.jeu.nomJeu}</span>
                <h1 className="entete-tournoi-titre titre-condense m-0">{tournoi.nomTournoi}</h1>
                <div className="d-flex flex-wrap align-items-center gap-3">
                    <span className={tournoi.statutTournoi === 'EN_COURS' ? 'etiquette etiquette-pleine' : 'etiquette'}>
                        <span className={tournoi.statutTournoi === 'EN_COURS' ? 'point point-blanc' : POINT_STATUT[tournoi.statutTournoi]} />
                        {LIBELLES_STATUT[tournoi.statutTournoi]}
                    </span>
                    <span className="une-meta">
                        {tournoi.nombreEquipesInscrites}/{tournoi.nombreEquipes} équipes · {tournoi.jeu.joueursParEquipe} joueurs par équipe · Élimination directe
                    </span>
                </div>
                <p className="une-texte m-0">{descriptionTournoi(tournoi)}</p>
                <dl className="entete-tournoi-etapes m-0">
                    {etapes.map((etape) => (
                        <div key={etape.libelle}>
                            <dt className="libelle small text-body-secondary">{etape.libelle}</dt>
                            <dd className="m-0 fw-semibold">{dateLongue(etape.date)}</dd>
                        </div>
                    ))}
                </dl>
                {children && <div className="d-flex flex-wrap align-items-center gap-3 pt-2">{children}</div>}
            </div>
        </section>
    );
}
