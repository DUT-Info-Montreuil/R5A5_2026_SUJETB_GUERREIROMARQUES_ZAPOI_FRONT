/**
 * Mise en page des écrans de connexion et d'inscription : accroche animée à
 * gauche (masquée sur petit écran), formulaire à droite.
 */

import type { ReactNode } from 'react';

import { Marque } from '../ui/Marque';

interface Props {
    surtitre: string;
    titre: string;
    children: ReactNode;
}

export function EcranAuthentification({ surtitre, titre, children }: Props) {
    return (
        <div className="ecran-auth d-flex">
            <aside className="accroche d-none d-lg-flex flex-column justify-content-between">
                <Marque />
                <div className="d-flex flex-column gap-4">
                    <p className="libelle apparition d-flex align-items-center gap-2 m-0">
                        <span className="point point-direct" /> Saison 2026 · Association étudiante
                    </p>
                    <p className="accroche-titre titre-condense m-0" aria-hidden="true">
                        <span className="ligne-revelee"><span>Entrez</span></span>
                        <span className="ligne-revelee"><span>dans l'arène</span></span>
                    </p>
                    <p className="apparition text-body-secondary fs-5 m-0">
                        Inscrivez votre équipe, suivez l'arbre en direct, échangez avec vos coéquipiers.
                    </p>
                </div>
            </aside>

            <main className="flex-grow-1 d-flex align-items-center justify-content-center p-4">
                <div className="panneau-formulaire">
                    <div className="d-lg-none mb-5">
                        <Marque />
                    </div>
                    <p className="libelle text-primary mb-2">{surtitre}</p>
                    <h1 className="formulaire-titre titre-condense mb-4">{titre}</h1>
                    {children}
                </div>
            </main>
        </div>
    );
}
