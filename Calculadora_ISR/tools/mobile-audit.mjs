import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname,'..');
const htmlFiles = [];
for (const directory of [root,path.join(root,'calculadoras'),path.join(root,'articulos')]) {
  for (const name of fs.readdirSync(directory).filter(name=>name.endsWith('.html'))) htmlFiles.push(path.join(directory,name));
}
const errors = [];
for (const file of htmlFiles) {
  const html = fs.readFileSync(file,'utf8');
  const rel = path.relative(root,file);
  if (!html.includes('name="viewport"') || !html.includes('width=device-width')) errors.push(`${rel}: viewport adaptable ausente`);
  if (!html.includes('class="mobile-dock"')) errors.push(`${rel}: navegación móvil ausente`);
  if (html.includes('<table') && !html.includes('table-wrap')) errors.push(`${rel}: tabla sin contenedor adaptable`);
}
const css = fs.readFileSync(path.join(root,'assets/css/styles.css'),'utf8');
for (const token of ['env(safe-area-inset-bottom)','font-size:16px','min-height:44px','100dvh','@media(hover:none)']) {
  if (!css.includes(token)) errors.push(`CSS: falta ${token}`);
}
if (errors.length) {
  console.error(`Mobile audit failed (${errors.length}):\n- ${errors.join('\n- ')}`);
  process.exit(1);
}
console.log(`Mobile audit passed: ${htmlFiles.length} pages with responsive viewport, mobile navigation and touch safeguards.`);
