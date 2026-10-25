import { defineConfig } from 'astro/config';
export default defineConfig({ site: 'https://retroditesta.com', output: 'static', trailingSlash: 'always', devToolbar: { enabled: false }, vite: { server: { watch: { usePolling: true, interval: 500 } } } });
