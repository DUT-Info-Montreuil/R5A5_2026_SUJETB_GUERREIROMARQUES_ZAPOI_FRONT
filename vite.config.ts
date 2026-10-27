/// <reference types="vitest/config" />
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  server: {
    // Port fixe : il doit correspondre à CORS_ORIGINS dans le .env du back.
    port: 5173,
    strictPort: true,
  },
  test: {
    // Navigateur simulé : les tests rendent de vrais composants React.
    environment: 'jsdom',
    include: ['src/__tests__/**/*.test.{ts,tsx}'],
    setupFiles: ['src/__tests__/setup.ts'],
  },
  css: {
    preprocessorOptions: {
      scss: {
        // Bootstrap 5.3 utilise encore une syntaxe Sass en cours d'abandon :
        // ces avertissements sont inoffensifs et noieraient la console.
        quietDeps: true,
        silenceDeprecations: ['import', 'global-builtin', 'color-functions', 'if-function'],
      },
    },
  },
});
