import { fileURLToPath } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';

const root = fileURLToPath(new URL('../', import.meta.url));
const local = path.resolve(root, '../output/backups');
const server = '/Volumes/SALASERVER/SITO INTERNET';
const stamp = new Date().toISOString().replace(/[:.]/g, '-');
const filename = `retro-di-testa-${stamp}.zip`;
fs.mkdirSync(local, { recursive: true });
const archive = path.join(local, filename);
const temporary = path.join(local, `.incompleto-${filename}`);
try {
  execFileSync('/usr/bin/zip', ['-q', '-r', temporary, '.', '-x',
    'node_modules/*', 'dist/*', '.astro/*', '.DS_Store', '*/.DS_Store'], { cwd: root });
  execFileSync('/usr/bin/unzip', ['-tq', temporary], { stdio: 'pipe' });
  fs.renameSync(temporary, archive);
  const digest = crypto.createHash('sha256').update(fs.readFileSync(archive)).digest('hex');
  const checksum = `${digest}  ${filename}\n`;
  fs.writeFileSync(`${archive}.sha256`, checksum);
  console.log(`Copia locale verificata: ${archive}`);
  if (!process.argv.includes('--local-only')) {
    if (!fs.existsSync('/Volumes/SALASERVER')) throw new Error('SALASERVER non è collegato. Collega la condivisione dal Finder e riprova.');
    fs.mkdirSync(server, { recursive: true });
    const destination = path.join(server, filename);
    const pending = path.join(server, `.incompleto-${filename}`);
    fs.copyFileSync(archive, pending);
    const remoteDigest = crypto.createHash('sha256').update(fs.readFileSync(pending)).digest('hex');
    if (remoteDigest !== digest) throw new Error('La verifica della copia sul server non è riuscita.');
    fs.renameSync(pending, destination);
    fs.writeFileSync(`${destination}.sha256`, checksum);
    console.log(`Copia sul server verificata: ${destination}`);
  }
} catch (error) {
  console.error(`Backup non completato: ${error.message}`);
  console.error('Le copie precedenti non vengono eliminate. Se la copia locale è stata creata, rimane disponibile.');
  process.exitCode = 1;
} finally {
  if (fs.existsSync(temporary)) fs.unlinkSync(temporary);
}
