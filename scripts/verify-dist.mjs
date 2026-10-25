import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import assert from 'node:assert/strict';

const walk = dir => readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(join(dir,e.name)):[join(dir,e.name)]);
const htmlFiles = walk('dist').filter(f=>f.endsWith('.html'));

assert(!existsSync('dist/redazione'),'L’editor locale non deve essere pubblicato');
assert(existsSync('dist/staff/index.html'),'L’area staff deve essere disponibile tramite accesso nascosto');
const staff=readFileSync('dist/staff/index.html','utf8');
assert(staff.includes('noindex,nofollow'),'L’area staff deve restare esclusa dai motori di ricerca');

let links=0;
for(const file of htmlFiles){
  const html=readFileSync(file,'utf8');
  if(file !== 'dist/404.html' && file !== 'dist/staff/index.html'){
    assert(!html.includes('noindex'),`Pagina pubblica marcata noindex: ${file}`);
    assert(html.includes('<link rel="canonical" href="https://retroditesta.com/'),`Canonical mancante: ${file}`);
  }
  assert(!html.includes('page-leaving'),`Transizione bloccante ancora presente: ${file}`);
  assert(!html.includes('class="page-wipe"'),`Pannello di transizione ancora presente: ${file}`);
  for(const [,raw] of html.matchAll(/(?:href|src)="([^"]+)"/g)){
    if(!raw.startsWith('/')||raw.startsWith('//')||raw.startsWith('/api/'))continue;
    const pathname=raw.split(/[?#]/)[0];
    if(!pathname)continue;
    const target=join('dist',pathname.endsWith('/')?pathname+'index.html':pathname);
    if(pathname==='/404/' || pathname==='/staff/')continue;
    assert(existsSync(target),`Collegamento mancante: ${raw} in ${file}`);links++;
  }
}
const sitemap=readFileSync('dist/sitemap.xml','utf8');
assert(!sitemap.includes('/staff/'),'La sitemap non deve contenere l’area staff');
assert(!sitemap.includes('/articoli/aurora-mtm-cassa-centrale-stampata-3d/'),'La sitemap non deve contenere l’indirizzo reindirizzato di Aurora');
for(const required of ['/guide/','/guide/come-usare-iphone/','/progetti/aurora-mtm-cassa-centrale-stampata-3d/']){
  assert(sitemap.includes(`https://retroditesta.com${required}`),`URL mancante dalla sitemap: ${required}`);
}
console.log(`${htmlFiles.length} pagine pubbliche, ${links} riferimenti locali validi. Canonical, noindex e sitemap verificati.`);
