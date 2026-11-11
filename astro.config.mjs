import { defineConfig } from 'astro/config';
import { config } from './src/config.ts';

export default defineConfig({
  site: config.siteUrl,
  output: 'static',
  trailingSlash: 'always',
  build: { format: 'directory' },
});
