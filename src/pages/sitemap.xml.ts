import { getCollection } from 'astro:content';
export async function GET() {
  const articles = await getCollection('articoli', ({ data }) => !data.draft && data.section !== 'progetto');
  const paths = ['/', '/articoli/', '/guide/', '/guide/come-usare-iphone/', '/progetti/', '/progetti/aurora-mtm-cassa-centrale-stampata-3d/', '/progetti/legendary/', '/progetti/music-essence-tallava/', '/metodo/', '/chi-sono/', '/youtube/', ...articles.map(a => `/articoli/${a.id}/`)];
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${paths.map(p => `<url><loc>https://retroditesta.com${p}</loc></url>`).join('')}</urlset>`, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
