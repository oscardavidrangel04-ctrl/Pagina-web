import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const files = [];
for (const directory of [root,path.join(root,'calculadoras'),path.join(root,'articulos')]) {
  for (const name of fs.readdirSync(directory).filter(name=>name.endsWith('.html'))) files.push(path.join(directory,name));
}

const errors = [];
const titles = new Map();
const canonicals = new Map();
for (const file of files) {
  const html = fs.readFileSync(file,'utf8');
  const rel = path.relative(root,file);
  if (rel === '404.html') continue;
  const title = html.match(/<title>(.*?)<\/title>/)?.[1];
  const description = html.match(/<meta name="description" content="([^"]+)"/)?.[1];
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
  const h1 = (html.match(/<h1[ >]/g)||[]).length;
  if (!title || title.length < 20 || title.length > 75) errors.push(`${rel}: title ausente o fuera de 20-75 caracteres`);
  if (!description || description.length < 50 || description.length > 180) errors.push(`${rel}: descripción ausente o fuera de 50-180 caracteres`);
  if (!canonical) errors.push(`${rel}: canonical ausente`);
  if (h1 !== 1) errors.push(`${rel}: debe tener exactamente un H1`);
  if (!html.includes('hreflang="es-MX"')) errors.push(`${rel}: hreflang es-MX ausente`);
  if (!html.includes('property="og:title"') || !html.includes('name="twitter:title"')) errors.push(`${rel}: metadatos sociales incompletos`);
  if (title) titles.set(title,[...(titles.get(title)||[]),rel]);
  if (canonical) canonicals.set(canonical,[...(canonicals.get(canonical)||[]),rel]);
  for (const match of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try { JSON.parse(match[1]); } catch { errors.push(`${rel}: JSON-LD inválido`); }
  }
}
for (const [title, pages] of titles) if (pages.length > 1) errors.push(`Título duplicado: ${title} (${pages.join(', ')})`);
for (const [url, pages] of canonicals) if (pages.length > 1) errors.push(`Canonical duplicado: ${url} (${pages.join(', ')})`);

const calculators = fs.readdirSync(path.join(root,'calculadoras')).filter(name=>name.endsWith('.html'));
for (const name of calculators) {
  const html = fs.readFileSync(path.join(root,'calculadoras',name),'utf8');
  if (!html.includes('"@type":"BreadcrumbList"')) errors.push(`calculadoras/${name}: BreadcrumbList ausente`);
  if (!html.includes('"@type":"FAQPage"') || !html.includes('<section class="content-box faq-section">')) errors.push(`calculadoras/${name}: FAQ visible o estructurada ausente`);
}

if (errors.length) {
  console.error(`SEO audit failed (${errors.length}):\n- ${errors.join('\n- ')}`);
  process.exit(1);
}
console.log(`SEO audit passed: ${files.length} pages, unique titles/canonicals, valid metadata and JSON-LD.`);
