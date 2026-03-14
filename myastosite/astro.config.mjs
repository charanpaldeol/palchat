// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from "@astrojs/react";
import vercel from "@astrojs/vercel";
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://astro.build/config
export default defineConfig({
  site: 'https://www.reclaim.org',
  output: 'server',
  // Allow form POSTs from same-origin when Origin/Referer don't match (e.g. Vercel proxy, preview URLs).
  // Our API routes still enforce same-origin via Origin/Referer checks.
  security: { checkOrigin: false },
  integrations: [tailwind(), react()],
  adapter: vercel({}),
  vite: {
    resolve: { alias: { '@': path.join(__dirname, 'src') } },
  },
});
