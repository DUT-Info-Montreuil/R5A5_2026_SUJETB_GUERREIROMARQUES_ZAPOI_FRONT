/** Les questions qu'un visiteur se pose avant de s'inscrire. Les réponses décrivent le fonctionnement réel de la plateforme. */

import { Accordion } from 'react-bootstrap';

import { EnteteSection } from '../accueil/EnteteSection';
import { Revele } from './Revele';

const QUESTIONS: { question: string; reponse: string }[] = [
    {
        question: 'Comment participer à un tournoi ?',
        reponse: "Crée un compte, puis choisis un tournoi dont les inscriptions sont ouvertes. Tu peux créer ton équipe (tu en deviens capitaine) ou demander à rejoindre une équipe existante : son capitaine accepte ou refuse ta demande.",
    },
    {
        question: "Combien de joueurs par équipe ?",
        reponse: "Cela dépend du jeu : de un joueur (échecs, EA FC, Pokémon) à six (Overwatch 2), cinq pour la plupart des jeux de stratégie. Chaque joueur a un poste (un rôle) attribué par le capitaine. Une équipe incomplète au lancement du tournoi est déclarée forfait.",
    },
    {
        question: 'Puis-je jouer dans plusieurs tournois ?',
        reponse: "Oui : un joueur ne peut être que dans une seule équipe par tournoi, mais il peut jouer plusieurs tournois, avec des équipes différentes.",
    },
    {
        question: 'Qui saisit les résultats ?',
        reponse: "Les administrateurs de l'association. Dès qu'un résultat est validé, le vainqueur avance dans l'arbre et tout le monde le voit en direct, sans recharger la page.",
    },
    {
        question: "Que se passe-t-il si je suis éliminé ou exclu d'une équipe ?",
        reponse: "L'espace d'échange de l'équipe se ferme tout de suite pour les membres concernés. Tu gardes la possibilité de suivre le tournoi comme n'importe quel visiteur.",
    },
    {
        question: "Faut-il un compte pour regarder ?",
        reponse: "Non : les tournois, les arbres et les équipes sont publics. Le compte sert à participer.",
    },
];

export function QuestionsFrequentes() {
    return (
        <section className="container-xxl px-4 px-lg-5 section-vitrine">
            <div className="row g-5">
                <Revele className="col-12 col-lg-4">
                    <EnteteSection surtitre="Questions" titre="On te répond" />
                    <p className="text-body-secondary mt-4 mb-0">Une autre question ? Écris-nous : l'adresse est en bas de page.</p>
                </Revele>
                <Revele delai={100} className="col-12 col-lg-8">
                    <Accordion flush className="faq" defaultActiveKey="0">
                        {QUESTIONS.map((q, i) => (
                            <Accordion.Item key={q.question} eventKey={String(i)}>
                                <Accordion.Header>{q.question}</Accordion.Header>
                                <Accordion.Body className="text-body-secondary">{q.reponse}</Accordion.Body>
                            </Accordion.Item>
                        ))}
                    </Accordion>
                </Revele>
            </div>
        </section>
    );
}
