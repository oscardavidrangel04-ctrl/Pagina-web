'use strict';
// Only this generated directory is served by Vercel. Source exports and
// recoverable backups remain outside it, including with Git-based deployments.
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const output = path.join(root, 'site-public');
const rootNames = new Set([
  'index.html', '404.html', 'offline.html', 'acerca-de.html', 'contacto.html',
  'privacidad.html', 'terminos.html', 'calculadoras.html', 'articulos.html',
  'simuladores.html', 'aguinaldo-3-meses-fallback.html', 'ads.txt', 'robots.txt',
  'llms.txt', 'manifest.webmanifest', 'sw.js', 'sitemap.xml', 'sitemap-seo-2026.xml'
]);
const publicDirs = new Map([
  ['articulos', new Set(['.html'])], ['calculadoras', new Set(['.html'])],
  ['temas', new Set(['.html'])], ['recursos', new Set(['.csv', '.pdf'])],
  ['assets', new Set(['.css', '.js', '.json', '.svg', '.png', '.jpg', '.jpeg', '.webp', '.ico', '.woff', '.woff2'])]
]);
const files = new Set();
function list(dir, callback) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, {withFileTypes:true})) {
    const absolute = path.join(dir, entry.name);
    if (entry.isSymbolicLink()) throw new Error('Symbolic links are not published: ' + absolute);
    if (entry.isDirectory()) list(absolute, callback);
    else if (entry.isFile()) callback(absolute);
  }
}
for (const entry of fs.readdirSync(root, {withFileTypes:true})) {
  if (!entry.isFile()) continue;
  const name = entry.name;
  if (rootNames.has(name) || /^fallback-[a-z0-9-]+\.html$/.test(name) || /^google[a-f0-9]+\.html$/.test(name) || /^styles-[a-z0-9]+\.css$/.test(name)) files.add(name);
}
for (const [dir, extensions] of publicDirs) list(path.join(root, dir), file => {
  if (extensions.has(path.extname(file).toLowerCase())) files.add(path.relative(root, file).split(path.sep).join('/'));
});
const config = JSON.parse(fs.readFileSync(path.join(root, 'vercel.json'), 'utf8'));
const rewrite = url => config.rewrites?.find(r => r.source === url)?.destination || url;
for (const name of ['sitemap.xml', 'sitemap-seo-2026.xml']) {
  const xml = fs.readFileSync(path.join(root, name), 'utf8');
  for (const match of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) {
    const pathname = rewrite(new URL(match[1]).pathname);
    if (!files.has(pathname === '/' ? 'index.html' : pathname.slice(1))) throw new Error('Missing public sitemap route: ' + pathname);
  }
}
for (const rule of config.rewrites || []) {
  if (rule.destination.startsWith('/') && !files.has(rule.destination.slice(1))) throw new Error('Missing rewrite destination: ' + rule.destination);
}
// Refuse symlink destinations and verify every deletion stays in this one
// generated folder. No source directory is ever removed.
if (path.dirname(output) !== root || path.basename(output) !== 'site-public') throw new Error('Invalid output directory');
if (fs.existsSync(output) && fs.lstatSync(output).isSymbolicLink()) throw new Error('Output must not be a symbolic link');
fs.mkdirSync(output, {recursive:true});
list(output, file => {
  const resolved = path.resolve(file);
  if (!resolved.startsWith(output + path.sep)) throw new Error('Unsafe generated path');
  const relative = path.relative(output, file).split(path.sep).join('/');
  if (!files.has(relative)) fs.unlinkSync(resolved);
});
for (const name of files) {
  const target = path.join(output, name);
  fs.mkdirSync(path.dirname(target), {recursive:true});
  fs.copyFileSync(path.join(root, name), target);
}
console.log('Public build ready: ' + files.size + ' files. Internal reports, exports and scripts excluded.');
