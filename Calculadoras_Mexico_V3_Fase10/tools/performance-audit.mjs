import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname,'..');
const errors = [];
const assets = ['assets/css/styles.css','assets/js/common.js','assets/js/tablas.js'];
for (const asset of assets) {
  const size = fs.statSync(path.join(root,asset)).size;
  if (size > 80000) errors.push(`${asset}: ${size} bytes; supera el límite interno de 80 KB`);
}
const htmlFiles = [];
for (const directory of [root,path.join(root,'calculadoras'),path.join(root,'articulos')]) {
  for (const name of fs.readdirSync(directory).filter(name=>name.endsWith('.html'))) htmlFiles.push(path.join(directory,name));
}
for (const file of htmlFiles) {
  const html = fs.readFileSync(file,'utf8');
  const rel = path.relative(root,file);
  for (const script of html.matchAll(/<script src="([^"]+assets\/js\/[^"]+)"([^>]*)>/g)) {
    if (!script[2].includes('defer')) errors.push(`${rel}: script bloqueante ${script[1]}`);
  }
  if (html.includes('logo.svg') && !html.includes('fetchpriority="high"')) errors.push(`${rel}: prioridad del logo ausente`);
}
const config = fs.readFileSync(path.join(root,'vercel.json'),'utf8');
for (const token of ['max-age=31536000','stale-while-revalidate','/assets/js/(.*)','/assets/css/(.*)','/assets/img/(.*)','application/xml']) {
  if (!config.includes(token)) errors.push(`vercel.json: falta ${token}`);
}
if (!config.includes('s-maxage=3600, must-revalidate')) errors.push('vercel.json: JavaScript y CSS deben poder actualizarse');
const css = fs.readFileSync(path.join(root,'assets/css/styles.css'),'utf8');
if (!css.includes('content-visibility:auto')) errors.push('CSS: content-visibility ausente');
if (errors.length) {
  console.error(`Performance audit failed (${errors.length}):\n- ${errors.join('\n- ')}`);
  process.exit(1);
}
console.log(`Performance audit passed: ${htmlFiles.length} pages, deferred scripts, cache policies and lightweight assets.`);
