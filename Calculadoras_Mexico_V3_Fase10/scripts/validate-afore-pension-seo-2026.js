const fs = require('fs');
const path = require('path');

const slugs = [
  'como-saber-en-que-afore-estoy', 'como-cambiar-de-afore', 'retiro-por-desempleo-afore',
  'aportaciones-voluntarias-afore', 'modalidad-40-imss', 'cuanto-cuesta-modalidad-40',
  'pension-imss-ley-97', 'diferencia-ley-73-ley-97', 'negativa-pension-imss',
  'conservacion-derechos-imss-ley-73', 'recibo-de-aguinaldo', 'faltas-afectan-aguinaldo'
];
const allHtml = [];
for (const dir of ['.', 'articulos', 'calculadoras']) {
  for (const name of fs.readdirSync(dir)) if (name.endsWith('.html')) allHtml.push(path.join(dir, name));
}
const sitemap = fs.readFileSync('sitemap-seo-2026.xml', 'utf8');
const errors = [];
const inlinks = {};
for (const slug of slugs) {
  const file = path.join('articulos', `${slug}.html`);
  const route = `/articulos/${slug}.html`;
  const absolute = `https://calculadora-isr-mexico.vercel.app${route}`;
  if (!fs.existsSync(file)) { errors.push(`Falta ${file}`); continue; }
  const html = fs.readFileSync(file, 'utf8');
  for (const [name, pattern] of [
    ['title', /<title>[^<]+<\/title>/g], ['description', /<meta name="description" content="[^"]+">/g],
    ['H1', /<h1>[^<]+<\/h1>/g], ['canonical', /<link rel="canonical" href="[^"]+">/g],
    ['schema', /<script type="application\/ld\+json">/g]
  ]) {
    if ((html.match(pattern) || []).length !== 1) errors.push(`${file}: ${name}`);
  }
  if (!html.includes(`<link rel="canonical" href="${absolute}">`)) errors.push(`${file}: canonical incorrecto`);
  if (!html.includes('"@type":"Article"')) errors.push(`${file}: falta Article schema`);
  const sitemapCount = sitemap.split(`<loc>${absolute}</loc>`).length - 1;
  if (sitemapCount !== 1) errors.push(`${file}: sitemap=${sitemapCount}`);
  inlinks[route] = allHtml.filter(other => other !== file && fs.readFileSync(other, 'utf8').includes(`href="${route}"`)).length;
  if (inlinks[route] < 2) errors.push(`${file}: sólo ${inlinks[route]} enlaces entrantes`);
  for (const match of html.matchAll(/href="(\/[^"#?]+\.html)/g)) {
    const local = match[1].slice(1).split('/').join(path.sep);
    if (!fs.existsSync(local)) errors.push(`${file}: enlace roto ${match[1]}`);
  }
}
console.log(JSON.stringify({checked: slugs.length, sitemapUrls: (sitemap.match(/<loc>/g) || []).length, inlinks, errors}, null, 2));
if (errors.length) process.exit(1);
