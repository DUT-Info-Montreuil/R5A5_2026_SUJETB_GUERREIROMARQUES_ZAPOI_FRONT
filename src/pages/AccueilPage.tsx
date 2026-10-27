/**
 * Page d'accueil : une vitrine, pensée pour donner envie de s'inscrire. Elle
 * enchaîne le hero, les jeux, les chiffres, les tournois à la une, les atouts,
 * le mode d'emploi, l'histoire, les témoignages, les questions et l'appel final.
 * La liste complète des tournois est sur /tournois, les jeux sur /jeux.
 */

import { BandeauAppel } from '../components/accueil/BandeauAppel';
import { ChiffresSaison } from '../components/accueil/ChiffresSaison';
import { CommentCaMarche } from '../components/accueil/CommentCaMarche';
import { EnteteSection } from '../components/accueil/EnteteSection';
import { NotreHistoire } from '../components/accueil/NotreHistoire';
import { chiffresDeLaSaison, jeuxPresents } from '../components/accueil/statistiques';
import { CarteTournoi } from '../components/tournoi/CarteTournoi';
import { tournoisALaUne } from '../components/tournoi/presentation';
import { BandeauJeux } from '../components/vitrine/BandeauJeux';
import { CarrouselTournois } from '../components/vitrine/CarrouselTournois';
import { HeroVitrine } from '../components/vitrine/HeroVitrine';
import { PourquoiAgon } from '../components/vitrine/PourquoiAgon';
import { QuestionsFrequentes } from '../components/vitrine/QuestionsFrequentes';
import { Revele } from '../components/vitrine/Revele';
import { Temoignages } from '../components/vitrine/Temoignages';
import { IconeFleche } from '../components/ui/IconeFleche';
import { useAuth } from '../context/useAuth';
import { useJeux } from '../hooks/useJeux';
import { useTitrePage } from '../hooks/useTitrePage';
import { useTournois } from '../hooks/useTournois';
import type { FiltreTournois } from '../types/api';
import { Link } from 'react-router-dom';

// Constante hors du composant : même objet à chaque rendu.
const SANS_FILTRE: FiltreTournois = {};
const NOMBRE_A_LA_UNE = 4;
const NOMBRE_DE_CARTES = 3;

export function AccueilPage() {
    useTitrePage('Accueil');
    const { utilisateur } = useAuth();
    const estConnecte = utilisateur !== null;
    const { tournois, chargement } = useTournois(SANS_FILTRE);
    const { jeux } = useJeux();

    const nomsDesJeux = jeux.length > 0 ? jeux.map((j) => j.nomJeu) : jeuxPresents(tournois).map((p) => p.jeu.nomJeu);
    const alaUne = tournoisALaUne(tournois, NOMBRE_A_LA_UNE);
    const quiRecrute = tournois.filter((t) => t.statutTournoi === 'INSCRIPTIONS_OUVERTES');
    const chiffres = chiffresDeLaSaison(tournois);

    return (
        <>
            <HeroVitrine
                estConnecte={estConnecte}
                vedette={alaUne[0]}
                chiffres={chargement ? [] : chiffres.slice(0, 3)}
                jeux={nomsDesJeux}
            />
            <BandeauJeux jeux={nomsDesJeux} />
            {!chargement && tournois.length > 0 && <ChiffresSaison chiffres={chiffres} />}

            {alaUne.length > 0 && (
                <section className="container-xxl px-4 px-lg-5 section-vitrine d-flex flex-column gap-4">
                    <Revele><EnteteSection surtitre="À la une" titre="Les tournois du moment" /></Revele>
                    <Revele delai={100}><CarrouselTournois tournois={alaUne} estConnecte={estConnecte} /></Revele>
                </section>
            )}

            {quiRecrute.length > 0 && (
                <section className="container-xxl px-4 px-lg-5 section-vitrine d-flex flex-column gap-4">
                    <Revele>
                        <EnteteSection surtitre="Inscriptions ouvertes" titre="Il reste de la place">
                            <Link to="/tournois?statut=INSCRIPTIONS_OUVERTES" className="lien-souligne d-inline-flex align-items-center gap-2">
                                Tous les tournois ouverts <IconeFleche />
                            </Link>
                        </EnteteSection>
                    </Revele>
                    <ul className="grille-tournois">
                        {quiRecrute.slice(0, NOMBRE_DE_CARTES).map((tournoi, i) => (
                            <li key={tournoi.idTournoi}>
                                <Revele delai={i * 90} className="h-100"><CarteTournoi tournoi={tournoi} /></Revele>
                            </li>
                        ))}
                    </ul>
                </section>
            )}

            <PourquoiAgon />
            <CommentCaMarche />
            <NotreHistoire />
            <Temoignages />
            <QuestionsFrequentes />
            <BandeauAppel tournoi={quiRecrute[0]} estConnecte={estConnecte} jeux={nomsDesJeux} />
        </>
    );
}
