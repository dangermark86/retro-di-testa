import { readFile, writeFile } from 'node:fs/promises';

const source = await readFile(new URL('../functions/api/[[path]].js', import.meta.url), 'utf8');
const api = source.replace(/export async function onRequest\(/, 'async function onRequest(');
const entry = `${api}\n\nexport default {\n  async fetch(request, env, ctx) {\n    const url = new URL(request.url);\n    if (url.pathname === '/api' || url.pathname.startsWith('/api/')) {\n      const path = url.pathname.replace(/^\\/api\\/?/, '').split('/').filter(Boolean);\n      return onRequest({ request, env, ctx, params: { path } });\n    }\n    return env.ASSETS.fetch(request);\n  }\n};\n`;
await writeFile(new URL('../dist/_worker.js', import.meta.url), entry);
