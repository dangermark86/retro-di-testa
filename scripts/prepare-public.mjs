import { readFileSync, rmSync, writeFileSync } from 'node:fs';
// The local editor must never be included in an upload of the public site.
rmSync(new URL('../dist/redazione/', import.meta.url), { recursive: true, force: true });

// Cloudflare Pages Direct Upload does not compile the /functions directory.
// Bundle the API source as an advanced-mode Worker and forward every other
// request to Astro's static output.
const apiSource = readFileSync(new URL('../functions/api/[[path]].js', import.meta.url), 'utf8');
const workerEntry = `

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (url.pathname.startsWith('/api/')) {
      const path = url.pathname.slice(5).replace(/\\/+$/, '');
      return onRequest({ request, env, params: { path }, waitUntil: promise => ctx.waitUntil(promise) });
    }
    return env.ASSETS.fetch(request);
  }
};
`;
writeFileSync(new URL('../dist/_worker.js', import.meta.url), `${apiSource}${workerEntry}`);
