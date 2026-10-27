/**
 * RouteProtegee : un visiteur est renvoyé vers la connexion, un joueur ne voit
 * pas l'administration. Ce n'est pas une sécurité (l'API refuse elle-même),
 * mais une erreur ici afficherait des écrans voués à l'échec.
 */

import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { describe, expect, it } from 'vitest';

import { AuthContext } from '../context/AuthContext';
import type { ValeurAuth } from '../context/AuthContext';
import { RouteProtegee } from '../routes/RouteProtegee';
import type { Utilisateur } from '../types/api';

const joueur: Utilisateur = { idUtilisateur: 2, pseudo: 'bob', email: 'bob@iut.fr', estAdministrateur: false };
const administrateur: Utilisateur = { ...joueur, idUtilisateur: 1, pseudo: 'alice', estAdministrateur: true };

/** Affiche la page d'où l'on vient, transmise par la redirection. */
function PageConnexion() {
    const { state } = useLocation() as { state: { depuis?: string } | null };
    return <p>Page de connexion (depuis {state?.depuis})</p>;
}

function afficher(auth: Partial<ValeurAuth>, exigeAdministrateur?: boolean) {
    const valeur: ValeurAuth = {
        utilisateur: null,
        chargement: false,
        ouvrirSession: () => {},
        deconnexion: async () => {},
        ...auth,
    };
    return render(
        <AuthContext.Provider value={valeur}>
            <MemoryRouter initialEntries={['/protegee']}>
                <Routes>
                    <Route path="/connexion" element={<PageConnexion />} />
                    <Route path="/protegee" element={<RouteProtegee exigeAdministrateur={exigeAdministrateur} />}>
                        <Route index element={<p>Contenu protégé</p>} />
                    </Route>
                </Routes>
            </MemoryRouter>
        </AuthContext.Provider>,
    );
}

describe('RouteProtegee', () => {
    it("n'affiche rien tant que la session n'est pas vérifiée", () => {
        const { container } = afficher({ chargement: true });

        expect(container).toBeEmptyDOMElement();
    });

    it('renvoie un visiteur vers la connexion, en retenant la page demandée', () => {
        afficher({ utilisateur: null });

        expect(screen.getByText('Page de connexion (depuis /protegee)')).toBeInTheDocument();
        expect(screen.queryByText('Contenu protégé')).not.toBeInTheDocument();
    });

    it("refuse l'administration à un joueur", () => {
        afficher({ utilisateur: joueur });

        expect(screen.getByRole('heading', { name: 'Accès réservé' })).toBeInTheDocument();
        expect(screen.queryByText('Contenu protégé')).not.toBeInTheDocument();
    });

    it("ouvre l'administration à un administrateur", () => {
        afficher({ utilisateur: administrateur });

        expect(screen.getByText('Contenu protégé')).toBeInTheDocument();
    });

    it('ouvre une page « connecté seulement » à un joueur', () => {
        afficher({ utilisateur: joueur }, false);

        expect(screen.getByText('Contenu protégé')).toBeInTheDocument();
    });
});
