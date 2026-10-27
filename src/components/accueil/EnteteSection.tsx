import type { ReactNode } from 'react';

interface Props {
    surtitre: string;
    titre: string;
    children?: ReactNode;
}

/** Surtitre violet, grand titre condensé, et à droite un contenu libre. */
export function EnteteSection({ surtitre, titre, children }: Props) {
    return (
        <div className="d-flex flex-wrap align-items-end justify-content-between gap-4">
            <div className="d-flex flex-column gap-2">
                <span className="surtitre">{surtitre}</span>
                <h2 className="titre-section titre-condense m-0">{titre}</h2>
            </div>
            {children}
        </div>
    );
}
