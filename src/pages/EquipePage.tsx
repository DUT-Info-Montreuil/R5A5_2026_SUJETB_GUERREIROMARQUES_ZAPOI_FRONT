/**
 * Page /equipes/:idEquipe — la composition d'une équipe est publique (B-02) ;
 * ses demandes d'adhésion et son espace d'échange ne le sont pas.
 */

import { useParams } from 'react-router-dom';

import { VueEquipe } from '../components/equipe/VueEquipe';
import { EtatChargement } from '../components/tournoi/EtatChargement';
import { useEquipe } from '../hooks/useEquipe';

export function EquipePage() {
    const idEquipe = Number(useParams().idEquipe);
    const { equipe, tournoi, erreur, introuvable, recharger } = useEquipe(idEquipe);

    if (!equipe || !tournoi) {
        return (
            <EtatChargement
                introuvable={introuvable}
                erreur={erreur}
                onRecharger={recharger}
                titreIntrouvable="Équipe introuvable"
                libelleChargement="Chargement de l'équipe"
            />
        );
    }

    return <VueEquipe key={equipe.idEquipe} equipe={equipe} tournoi={tournoi} onRecharger={recharger} />;
}
