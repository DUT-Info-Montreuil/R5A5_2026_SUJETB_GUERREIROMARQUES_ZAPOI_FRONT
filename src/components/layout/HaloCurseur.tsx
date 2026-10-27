/**
 * Deux effets qui suivent la souris, sur écran à pointeur précis seulement
 * (jamais au toucher) et jamais si l'utilisateur demande moins de mouvement :
 *  - un halo violet très doux qui traîne derrière le curseur ;
 *  - la lueur des cartes marquées `data-lumiere` : leur CSS lit --mx / --my.
 * Un seul écouteur pour toute la page ; le halo bouge par transform, via
 * requestAnimationFrame, donc sans recalcul de mise en page.
 */

import { useEffect, useRef } from 'react';

const SUIVI = 0.14; // part de la distance rattrapée à chaque image : plus c'est petit, plus le halo traîne

export function HaloCurseur() {
    const halo = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const precis = window.matchMedia('(pointer: fine)').matches;
        const reduit = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (!precis || reduit) return;

        const cible = { x: window.innerWidth / 2, y: window.innerHeight / 3 };
        const position = { ...cible };
        let image = 0;

        const avancer = () => {
            position.x += (cible.x - position.x) * SUIVI;
            position.y += (cible.y - position.y) * SUIVI;
            if (halo.current) halo.current.style.transform = `translate3d(${position.x}px, ${position.y}px, 0)`;
            image = requestAnimationFrame(avancer);
        };
        image = requestAnimationFrame(avancer);

        const surMouvement = (e: PointerEvent) => {
            cible.x = e.clientX;
            cible.y = e.clientY;
            if (halo.current) halo.current.dataset.actif = 'oui';
            const carte = (e.target as HTMLElement | null)?.closest<HTMLElement>('[data-lumiere]');
            if (carte) {
                const zone = carte.getBoundingClientRect();
                carte.style.setProperty('--mx', `${e.clientX - zone.left}px`);
                carte.style.setProperty('--my', `${e.clientY - zone.top}px`);
            }
        };
        document.addEventListener('pointermove', surMouvement, { passive: true });

        return () => {
            cancelAnimationFrame(image);
            document.removeEventListener('pointermove', surMouvement);
        };
    }, []);

    return <div ref={halo} className="halo-curseur" aria-hidden="true" />;
}
