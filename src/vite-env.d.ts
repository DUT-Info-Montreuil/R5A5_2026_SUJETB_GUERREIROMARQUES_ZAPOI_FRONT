/// <reference types="vite/client" />

/** Variables d'environnement exposées au front (voir .env.example). */
interface ImportMetaEnv {
  readonly VITE_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
