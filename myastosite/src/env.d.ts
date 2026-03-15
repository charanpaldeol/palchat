/// <reference types="astro/client" />

declare namespace App {
  interface Locals {
    user?: { id: number; username: string };
  }
}

interface ImportMetaEnv {
  readonly API_URL?: string;
  readonly ALLOWED_ORIGINS?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
