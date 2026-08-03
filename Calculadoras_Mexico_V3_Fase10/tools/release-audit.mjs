import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..');
const errors=[];
for(const file of ['index.html','calculadoras.html','simuladores.html','offline.html','sitemap.xml','robots.txt','manifest.webmanifest','sw.js','vercel.json'])if(!fs.existsSync(path.join(root,file)))errors.push(`Falta ${file}`);
try{const manifest=JSON.parse(fs.readFileSync(path.join(root,'manifest.webmanifest'),'utf8'));for(const key of ['name','short_name','start_url','display','icons'])if(!manifest[key])errors.push(`Manifest sin ${key}`)}catch{errors.push('Manifest JSON inválido')}
const sw=fs.readFileSync(path.join(root,'sw.js'),'utf8');
for(const token of ['calculadoras-mx-v4.0.0','/offline.html','/assets/js/catalog.js?v=4.0.0','skipWaiting','clients.claim'])if(!sw.includes(token))errors.push(`Service worker sin ${token}`);
const common=fs.readFileSync(path.join(root,'assets/js/common.js'),'utf8');
if(!common.includes("serviceWorker.register('/sw.js')"))errors.push('Registro del service worker ausente');
for(const token of ['CM_CATALOG_BUNDLE_START','CM_CALCULATORS_BUNDLE_START','CM_SIMULATORS_BUNDLE_START'])if(common.includes(token))errors.push(`common.js conserva un paquete obsoleto: ${token}`);
for(const file of ['catalog.js','calculators.js','simulators.js'])if(!fs.existsSync(path.join(root,'assets/js',file)))errors.push(`Falta assets/js/${file}`);
for(const file of ['index.html','calculadoras.html','simuladores.html',path.join('calculadoras','isr.html')]){
  const html=fs.readFileSync(path.join(root,file),'utf8');
  if(!html.includes('assets/js/catalog.js?v=4.0.0'))errors.push(`${file} no carga el catálogo versionado`);
  if(!html.includes('assets/js/common.js?v=4.0.0'))errors.push(`${file} no carga el script común versionado`);
}
const offline=fs.readFileSync(path.join(root,'offline.html'),'utf8');
if(!offline.includes('noindex,nofollow'))errors.push('offline.html debe usar noindex');
const index=fs.readFileSync(path.join(root,'index.html'),'utf8');
if(!index.includes('rel="manifest"'))errors.push('Manifest no enlazado desde el inicio');
const config=fs.readFileSync(path.join(root,'vercel.json'),'utf8');
if(!config.includes('max-age=0, must-revalidate'))errors.push('Service worker sin política de actualización');
if(config.includes('"source": "/assets/(.*)"'))errors.push('Los recursos actualizables no deben compartir caché immutable');
for(const token of ['/assets/js/(.*)','/assets/css/(.*)','/assets/img/(.*)'])if(!config.includes(token))errors.push(`Política de caché ausente: ${token}`);
if(errors.length){console.error(`Release audit failed (${errors.length}):\n- ${errors.join('\n- ')}`);process.exit(1)}
console.log('Release audit passed: installable app, offline fallback, update policy and production files ready.');
