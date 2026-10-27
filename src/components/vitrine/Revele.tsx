/**
 * Fait apparaître son contenu (fondu + montée) quand il entre dans l'écran.
 * Sans effet si l'utilisateur demande moins de mouvement : le contenu est alors
 * visible tout de suite. `delai` (en ms) décale l'apparition de frères voisins.
 */

import { useEffect, useRef, useState } from 'react';
import type { CSSProperties, ElementType, ReactNode } from 'react';

import { useMouvementReduit } from '../../hooks/useMouvementReduit';

interface Props {
    children: ReactNode;
    delai?: number;
    className?: string;
    as?: ElementType;
}

export function Revele({ children, delai = 0, className = '', as: Balise = 'div' }: Props) {
    const reduit = useMouvementReduit();
    const ref = useRef<HTMLElement>(null);
    const [vu, setVu] = useState(false);

    useEffect(() => {
        const element = ref.current;
        if (!element || reduit) return;
        const observateur = new IntersectionObserver(
            ([entree]) => {
                if (entree?.isIntersecting) {
                    setVu(true);
                    observateur.disconnect();
                }
            },
            { threshold: 0.12, rootMargin: '0px 0px -6% 0px' },
        );
        observateur.observe(element);
        return () => observateur.disconnect();
    }, [reduit]);

    const visible = vu || reduit;
    return (
        <Balise
            ref={ref}
            className={`revele ${visible ? 'revele-visible' : ''} ${className}`}
            style={{ '--delai': `${delai}ms` } as CSSProperties}
        >
            {children}
        </Balise>
    );
}
