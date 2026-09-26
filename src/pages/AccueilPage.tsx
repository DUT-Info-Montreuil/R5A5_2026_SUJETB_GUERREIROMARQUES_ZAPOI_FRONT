/**
 * Page principale : le tournoi à la une, puis le calendrier.
 *
 * Le filtre vit dans l'URL (?statut=…&recherche=…) : une vue filtrée se
 * partage par un lien, et le bouton « Retour » du navigateur la retrouve.
 */

import { useSearchParams } from 'react-router-dom';

import { CalendrierTournois } from '../components/tournoi/CalendrierTournois.tsx';
import { HeroTournoi } from '../components/tournoi/HeroTournoi';
import { tournoiALaUne } from '../components/tournoi/presentation';
import { useAuth } from '../context/useAuth';
import { useTournois } from '../hooks/useTournois';
import type { FiltreTournois, StatutTournoi } from '../types/api';

// Constante hors du composant : même objet à chaque rendu.
const SANS_FILTRE: FiltreTournois = {};

function lireFiltre(parametres: URLSearchParams): FiltreTournois {
  return {
    recherche: parametres.get('recherche') ?? undefined,
    statut: (parametres.get('statut') as StatutTournoi | null) ?? undefined,
  };
}

function versParametres(filtre: FiltreTournois): Record<string, string> {
  const parametres: Record<string, string> = {};
  if (filtre.recherche) parametres.recherche = filtre.recherche;
  if (filtre.statut) parametres.statut = filtre.statut;
  return parametres;
}

export function AccueilPage() {
  const { utilisateur } = useAuth();
  const [parametres, setParametres] = useSearchParams();
  const filtre = lireFiltre(parametres);

  // Deux listes : le calendrier suit le filtre, la une reste la même.
  const calendrier = useTournois(filtre);
  const aLaUne = tournoiALaUne(useTournois(SANS_FILTRE).tournois);

  return (
      <>
        {aLaUne && <HeroTournoi tournoi={aLaUne} estConnecte={utilisateur !== null} />}
        <CalendrierTournois
            tournois={calendrier.tournois}
            chargement={calendrier.chargement}
            erreur={calendrier.erreur}
            onRecharger={calendrier.recharger}
            filtre={filtre}
            onFiltreChange={(nouveau) => setParametres(versParametres(nouveau))}
        />
      </>
  );
}
