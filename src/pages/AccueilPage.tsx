/**
 * Page principale : la une, les chiffres, les jeux, le calendrier, les étapes
 * et l'appel à s'inscrire. Tout ce qui s'affiche vient de l'API.
 *
 * Le filtre du calendrier vit dans l'URL (?statut=…&recherche=…) : une vue
 * filtrée se partage par un lien, et « Retour » la retrouve.
 */

import { useSearchParams } from 'react-router-dom';

import { BandeauAppel } from '../components/accueil/BandeauAppel';
import { ChiffresSaison } from '../components/accueil/ChiffresSaison';
import { CommentCaMarche } from '../components/accueil/CommentCaMarche';
import { SectionJeux } from '../components/accueil/SectionJeux';
import { CalendrierTournois } from '../components/tournoi/CalendrierTournois';
import { CarrouselUne } from '../components/tournoi/CarrouselUne';
import { tournoisALaUne } from '../components/tournoi/presentation';
import { useAuth } from '../context/useAuth';
import { useTournois } from '../hooks/useTournois';
import type { FiltreTournois, StatutTournoi } from '../types/api';
import { chiffresDeLaSaison, jeuxPresents } from '../components/accueil/statistiques';

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
  const estConnecte = utilisateur !== null;
  const [parametres, setParametres] = useSearchParams();
  const filtre = lireFiltre(parametres);

  // Deux listes : le calendrier suit le filtre, le reste de la page non.
  const calendrier = useTournois(filtre);
  const tous = useTournois(SANS_FILTRE);
  const quiRecrute = tous.tournois.find((t) => t.statutTournoi === 'INSCRIPTIONS_OUVERTES');

  return (
      <>
        <CarrouselUne tournois={tournoisALaUne(tous.tournois)} estConnecte={estConnecte} />
        {!tous.chargement && tous.tournois.length > 0 && <ChiffresSaison chiffres={chiffresDeLaSaison(tous.tournois)} />}
        {tous.tournois.length > 0 && <SectionJeux jeux={jeuxPresents(tous.tournois)} />}
        <CalendrierTournois
            tournois={calendrier.tournois}
            chargement={calendrier.chargement}
            erreur={calendrier.erreur}
            onRecharger={calendrier.recharger}
            filtre={filtre}
            onFiltreChange={(nouveau) => setParametres(versParametres(nouveau))}
        />
        <CommentCaMarche />
        {quiRecrute && <BandeauAppel tournoi={quiRecrute} estConnecte={estConnecte} />}
      </>
  );
}
