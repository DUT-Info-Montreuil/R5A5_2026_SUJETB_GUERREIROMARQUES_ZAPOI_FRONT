/**
 * Réglage commun à tous les tests (vite.config.ts, `test.setupFiles`).
 *
 * Ajoute les vérifications sur le DOM (`toBeInTheDocument`…) et démonte les
 * composants après chaque test : sans `globals`, Testing Library ne le fait pas seul.
 */

import '@testing-library/jest-dom/vitest';

import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
});
