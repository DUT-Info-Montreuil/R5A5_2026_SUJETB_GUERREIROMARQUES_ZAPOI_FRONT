/**
 * Carte d'un tournoi : un visuel aux couleurs du jeu avec son logo et sa
 * dotation, puis le nom, la date, la jauge des équipes et un appel à l'action.
 * Toute la carte est cliquable (lien étendu sur le titre) ; la lueur suit la
 * souris (data-lumiere).
 */

import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';

import type { TournoiResume } from '../../types/api';
import { LogoJeu } from '../jeux/LogoJeu';
import { IconeFleche } from '../ui/IconeFleche';
import { VisuelJeu } from './VisuelJeu';
import { dotationAffichee } from './dotations';
import { identiteJeu } from './identitesJeux';
import { LIBELLES_STATUT, POINT_STATUT, dateLongue, placesRestantes } from './presentation';

function appelALAction(tournoi: TournoiResume): string {
    switch (tournoi.statutTournoi) {
        case 'INSCRIPTIONS_OUVERTES': return 'Rejoindre le tournoi';
        case 'EN_COURS': return "Suivre l'arbre";
        case 'INSCRIPTIONS_CLOSES': return "Voir l'arbre";
        case 'TERMINE': return 'Revoir la finale';
    }
}

function messageDeRemplissage(tournoi: TournoiResume): string {
    if (tournoi.statutTournoi !== 'INSCRIPTIONS_OUVERTES') return `${tournoi.nombreEquipesInscrites} équipes`;
    const places = placesRestantes(tournoi);
    return places === 0 ? 'Complet' : `${places} ${places > 1 ? 'places' : 'place'} restante${places > 1 ? 's' : ''}`;
}

export function CarteTournoi({ tournoi }: { tournoi: TournoiResume }) {
    const { couleur } = identiteJeu(tournoi.jeu.nomJeu);
    const termine = tournoi.statutTournoi === 'TERMINE';

    return (
        <article className={`carte-tournoi ${termine ? 'carte-tournoi-termine' : ''}`} style={{ '--jeu-couleur': couleur } as CSSProperties} data-lumiere>
            <div className="carte-tournoi-visuel">
                <VisuelJeu nomJeu={tournoi.jeu.nomJeu} />
                <span className="carte-tournoi-statut">
                    <span className={POINT_STATUT[tournoi.statutTournoi]} /> {LIBELLES_STATUT[tournoi.statutTournoi]}
                </span>
                <span className="carte-tournoi-dotation">
                    <span className="libelle">Dotation</span>
                    <strong>{dotationAffichee(tournoi)}</strong>
                </span>
                <LogoJeu nomJeu={tournoi.jeu.nomJeu} taille={64} className="carte-tournoi-logo" />
            </div>
            <div className="carte-tournoi-corps">
                <span className="carte-tournoi-jeu libelle">{tournoi.jeu.nomJeu}</span>
                <h3 className="carte-tournoi-titre m-0">
                    <Link to={`/tournois/${tournoi.idTournoi}`} className="lien-etendu">{tournoi.nomTournoi}</Link>
                </h3>
                <span className="small text-body-secondary">{dateLongue(tournoi.creeLe)} · Élimination directe</span>

                <div className="carte-tournoi-jauge" role="img" aria-label={`${tournoi.nombreEquipesInscrites} équipes inscrites sur ${tournoi.nombreEquipes}`}>
                    {Array.from({ length: tournoi.nombreEquipes }, (_, i) => (
                        <span key={i} className={i < tournoi.nombreEquipesInscrites ? 'segment segment-plein' : 'segment'} style={{ '--i': i } as CSSProperties} />
                    ))}
                </div>

                <div className="carte-tournoi-pied">
                    <span className="small fw-semibold">{messageDeRemplissage(tournoi)}</span>
                    <span className="carte-tournoi-appel">{appelALAction(tournoi)} <IconeFleche /></span>
                </div>
            </div>
        </article>
    );
}
