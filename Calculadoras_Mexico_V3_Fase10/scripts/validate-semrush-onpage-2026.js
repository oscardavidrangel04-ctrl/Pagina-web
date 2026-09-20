const fs = require('fs');
const path = require('path');

const files = [];
for (const dir of ['.', 'articulos', 'calculadoras']) {
  for (const name of fs.readdirSync(dir)) {
    if (name.endsWith('.html')) files.push(path.join(dir, name));
  }
}

const targets = files.filter(file => fs.readFileSync(file, 'utf8').includes('SEMRUSH_ONPAGE_2026_START'));
const errors = [];
for (const file of targets) {
  const html = fs.readFileSync(file, 'utf8');
  const required = [
    ['title', /<title>[\s\S]*?<\/title>/g],
    ['H1', /<h1\b[\s\S]*?<\/h1>/g],
    ['canonical', /<link[^>]+rel="canonical"[^>]*>/g],
    ['bloque Semrush', /SEMRUSH_ONPAGE_2026_START/g]
  ];
  for (const [label, regex] of required) {
    const count = (html.match(regex) || []).length;
    if (count !== 1) errors.push(`${file}: ${label}=${count}`);
  }
  for (const match of html.matchAll(/href="(\/[^"#?]+\.html)/g)) {
    const local = match[1].slice(1).split('/').join(path.sep);
    if (!fs.existsSync(local)) errors.push(`${file}: enlace roto ${match[1]}`);
  }
}

const config = JSON.parse(fs.readFileSync('vercel.json', 'utf8'));
const redirect = config.redirects.find(item => item.source === '/articulos/que-es-el-finiquito.html');
if (!redirect || redirect.destination !== '/articulos/que-incluye-finiquito.html' || !redirect.permanent) {
  errors.push('Falta la redirección permanente de que-es-el-finiquito.html');
}

console.log(`Páginas mejoradas: ${targets.length}`);
console.log(`Errores: ${errors.length}`);
if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
