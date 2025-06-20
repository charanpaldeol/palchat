// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from "@astrojs/react";
import vercel from "@astrojs/vercel/serverless";

// https://astro.build/config
export default defineConfig({
  site: 'https://www.palchat.org',
  output: 'server',
  integrations: [tailwind(), react()],
  adapter: vercel({
    includeFiles: ['./src/pages/api/**']
  }),
});
