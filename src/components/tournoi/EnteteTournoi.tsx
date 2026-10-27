/** Haut de la page d'un tournoi : visuel du jeu, nom, état, étapes, et les actions de la page. */

import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

import type { Tournoi } from '../../types/api';
import { LogoJeu } from '../jeux/LogoJeu';
import { LignesDeTitre } from './LignesDeTitre';
import { VisuelJeu } from './VisuelJeu';
import { dotationAffichee } from './dotations';
import { LIBELLES_STATUT, POINT_STATUT, dateLongue, descriptionTournoi } from './presentation';
import { formatDuJeu, motParticipants } from './vocabulaire';

interface Props {
    tournoi: Tournoi;
    surtitre?: string;
    /** Lien de retour au-dessus du titre. Par défaut : la liste publique des tournois. */
    retour?: { vers: string; libelle: string };
    children?: ReactNode;
}

export function EnteteTournoi({ tournoi, surtitre, retour = { vers: '/tournois', libelle: 'Tous les tournois' }, children }: Props) {
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
                <Link to={retour.vers} className="lien-retour">← {retour.libelle}</Link>
                <span className="d-flex align-items-center gap-3">
                    <LogoJeu nomJeu={tournoi.jeu.nomJeu} taille={48} />
                    <span className="surtitre">{surtitre ?? tournoi.jeu.nomJeu}</span>
                </span>
                <h1 className="entete-tournoi-titre titre-condense m-0" aria-label={tournoi.nomTournoi}>
                    <LignesDeTitre nom={tournoi.nomTournoi} />
                </h1>
                <div className="d-flex flex-wrap align-items-center gap-3">
                    <span className={tournoi.statutTournoi === 'EN_COURS' ? 'etiquette etiquette-pleine' : 'etiquette'}>
                        <span className={tournoi.statutTournoi === 'EN_COURS' ? 'point point-blanc point-direct' : POINT_STATUT[tournoi.statutTournoi]} />
                        {LIBELLES_STATUT[tournoi.statutTournoi]}
                    </span>
                    <span className="une-dotation">
                        <span className="libelle small text-body-secondary">Dotation</span>
                        <strong>{dotationAffichee(tournoi)}</strong>
                    </span>
                    <span className="une-meta">
                        {tournoi.nombreEquipesInscrites}/{tournoi.nombreEquipes} {motParticipants(tournoi.jeu.joueursParEquipe)} · {formatDuJeu(tournoi.jeu.joueursParEquipe)} · Élimination directe
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
