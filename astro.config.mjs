import { defineConfig } from 'astro/config';
import { siteUrl } from './src/config.ts';

export default defineConfig({
  site: siteUrl,
  output: 'static',
  trailingSlash: 'always',
  build: { format: 'directory' },
});
