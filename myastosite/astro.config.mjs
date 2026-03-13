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
  integrations: [tailwind(), react()],
  adapter: vercel({}),
  vite: {
    resolve: { alias: { '@': path.join(__dirname, 'src') } },
  },
});
