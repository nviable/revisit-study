/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SHOW_TEST_STUDIES?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
