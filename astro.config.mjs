// @ts-check
import { defineConfig } from 'astro/config';

// KIAZAKI, built in the herbarium shell.
// GitHub Pages serves this repo as a project site at /akii/, so `base` is set
// to that path: local dev is http://localhost:4321/akii/ and every asset URL is
// prefixed through src/lib/site.ts → url().
export default defineConfig({
  site: 'https://entertheki.github.io',
  base: '/akii',
  trailingSlash: 'always',
  devToolbar: { enabled: false },
});
