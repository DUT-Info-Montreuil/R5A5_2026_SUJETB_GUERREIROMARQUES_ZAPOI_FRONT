/**
 * Un membre de l'équipe : pseudo, poste, et — selon qui regarde — les actions
 * permises. Le capitaine attribue les postes, passe la main, exclut ; un membre
 * ne peut que quitter. Ces boutons ne sont pas une sécurité : l'API refuse tout
 * appel d'un autre que le capitaine (403).
 */

import { Form } from 'react-bootstrap';

import type { Membre, RoleJeu } from '../../types/api';
import { IconePoste } from '../jeux/IconePoste';
import { BoutonConfirme } from '../ui/BoutonConfirme';

interface Props {
    membre: Membre;
    /** Les membres de l'équipe : sert à griser les postes déjà tenus. */
    membres: Membre[];
    postes: RoleJeu[];
    estMoi: boolean;
    /** L'appelant est capitaine et la composition peut encore changer. */
    peutGerer: boolean;
    /** L'appelant est ce membre, non capitaine, et la composition peut encore changer. */
    peutQuitter: boolean;
    envoi: boolean;
    surPoste: (idUtilisateur: number, idRole: number) => void;
    surPasserLaMain: (idUtilisateur: number) => void;
    surRetirer: (idUtilisateur: number) => void;
}

export function CarteMembre({
    membre, membres, postes, estMoi, peutGerer, peutQuitter, envoi, surPoste, surPasserLaMain, surRetirer,
}: Props) {
    const tenus = new Set(
        membres.filter((m) => m.idUtilisateur !== membre.idUtilisateur && m.role).map((m) => m.role!.idRole),
    );

    return (
        <div className={`carte-equipe h-100 ${membre.estCapitaine ? 'carte-membre-capitaine' : ''}`}>
            <span className="carte-equipe-nom text-truncate">
                {membre.pseudo}{estMoi && <span className="text-body-secondary fw-normal"> (vous)</span>}
            </span>
            {membre.estCapitaine && <span className="libelle small">Capitaine</span>}

            <span className="poste-membre">
                {membre.role && <IconePoste libelle={membre.role.libelleRole} taille={18} />}
                <span className="small text-body-secondary">{membre.role?.libelleRole ?? 'Poste à attribuer'}</span>
            </span>

            {peutGerer && (
                <Form.Select
                    size="sm"
                    aria-label={`Poste de ${membre.pseudo}`}
                    value={membre.role?.idRole ?? ''}
                    onChange={(e) => surPoste(membre.idUtilisateur, Number(e.target.value))}
                    disabled={envoi}
                >
                    <option value="" disabled>Poste à attribuer</option>
                    {postes.map((poste) => (
                        <option key={poste.idRole} value={poste.idRole} disabled={tenus.has(poste.idRole)}>
                            {poste.libelleRole}{tenus.has(poste.idRole) ? ' (pris)' : ''}
                        </option>
                    ))}
                </Form.Select>
            )}

            {peutGerer && !membre.estCapitaine && (
                <div className="d-flex flex-column align-items-start gap-2 mt-auto">
                    <BoutonConfirme
                        libelle="Passer la main"
                        avertissement={`${membre.pseudo} devient capitaine, vous ne l'êtes plus.`}
                        onConfirme={() => surPasserLaMain(membre.idUtilisateur)}
                        desactive={envoi}
                    />
                    <BoutonConfirme
                        libelle="Exclure"
                        avertissement={`${membre.pseudo} quitte l'équipe et perd l'accès à son espace d'échange.`}
                        onConfirme={() => surRetirer(membre.idUtilisateur)}
                        desactive={envoi}
                    />
                </div>
            )}
            {peutQuitter && (
                <div className="mt-auto">
                    <BoutonConfirme
                        libelle="Quitter l'équipe"
                        avertissement="Vous perdez l'accès à l'espace d'échange."
                        onConfirme={() => surRetirer(membre.idUtilisateur)}
                        desactive={envoi}
                    />
                </div>
            )}
        </div>
    );
}
