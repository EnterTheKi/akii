// @ts-check
import { defineConfig } from 'astro/config';

// KIAZAKI, built in the herbarium shell. Local dev: http://localhost:4321/
export default defineConfig({
  trailingSlash: 'always',
  devToolbar: { enabled: false },
});
