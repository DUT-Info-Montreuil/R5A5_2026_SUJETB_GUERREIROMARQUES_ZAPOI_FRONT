import type { ReactNode } from 'react';

import { EnteteSection } from '../accueil/EnteteSection';

interface Props {
    surtitre: string;
    titre: string;
    entete?: ReactNode;
    children: ReactNode;
}

/** Une section de la page d'un tournoi : titre, puis contenu. */
export function SectionTournoi({ surtitre, titre, entete, children }: Props) {
    return (
        <section className="container-xxl px-4 px-lg-5 section-tournoi d-flex flex-column gap-4">
            <EnteteSection surtitre={surtitre} titre={titre}>{entete}</EnteteSection>
            {children}
        </section>
    );
}
