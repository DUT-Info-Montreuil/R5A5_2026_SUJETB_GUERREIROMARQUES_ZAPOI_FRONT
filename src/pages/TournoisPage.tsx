/**
 * Page /tournois — tous les tournois, filtrables par état et par nom.
 *
 * Le filtre vit dans l'URL (?statut=…&recherche=…) : une vue filtrée se
 * partage par un lien, et « Retour » la retrouve.
 */

import { useLocation, useSearchParams } from 'react-router-dom';

import { EnteteSection } from '../components/accueil/EnteteSection';
import { CalendrierTournois } from '../components/tournoi/CalendrierTournois';
import type { VueTournois } from '../components/tournoi/CalendrierTournois';
import { useTitrePage } from '../hooks/useTitrePage';
import { useTournois } from '../hooks/useTournois';
import type { FiltreTournois, StatutTournoi } from '../types/api';

function lireFiltre(parametres: URLSearchParams): FiltreTournois {
    return {
        recherche: parametres.get('recherche') ?? undefined,
        statut: (parametres.get('statut') as StatutTournoi | null) ?? undefined,
    };
}

/** Le filtre et l'affichage (cartes par défaut, liste en option) vivent dans l'URL : un lien partage la même vue. */
function versParametres(filtre: FiltreTournois, vue: VueTournois): Record<string, string> {
    const parametres: Record<string, string> = {};
    if (filtre.recherche) parametres.recherche = filtre.recherche;
    if (filtre.statut) parametres.statut = filtre.statut;
    if (vue === 'liste') parametres.vue = 'liste';
    return parametres;
}

export function TournoisPage() {
    useTitrePage('Tournois');
    const [parametres, setParametres] = useSearchParams();
    const filtre = lireFiltre(parametres);
    const vue: VueTournois = parametres.get('vue') === 'liste' ? 'liste' : 'cartes';
    // La loupe de l'en-tête arrive ici avec { rechercher: true } : le curseur va dans la recherche.
    const rechercher = (useLocation().state as { rechercher?: boolean } | null)?.rechercher === true;
    const { tournois, chargement, erreur, recharger } = useTournois(filtre);

    return (
        <section className="container-xxl px-4 px-lg-5 section-tournoi d-flex flex-column gap-4 pb-5">
            <EnteteSection surtitre="Calendrier" titre="Tous les tournois">
                <p className="texte-section m-0">Cherche un tournoi qui recrute, suis ceux qui se jouent, ou relis les finales passées.</p>
            </EnteteSection>
            <CalendrierTournois
                tournois={tournois}
                chargement={chargement}
                erreur={erreur}
                onRecharger={recharger}
                filtre={filtre}
                onFiltreChange={(nouveau) => setParametres(versParametres(nouveau, vue))}
                focusRecherche={rechercher}
                vue={vue}
                onVueChange={(nouvelle) => setParametres(versParametres(filtre, nouvelle))}
            />
        </section>
    );
}
