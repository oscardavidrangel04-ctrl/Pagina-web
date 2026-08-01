import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..');
const errors=[];
for(const file of ['index.html','calculadoras.html','simuladores.html','offline.html','sitemap.xml','robots.txt','manifest.webmanifest','sw.js','vercel.json'])if(!fs.existsSync(path.join(root,file)))errors.push(`Falta ${file}`);
try{const manifest=JSON.parse(fs.readFileSync(path.join(root,'manifest.webmanifest'),'utf8'));for(const key of ['name','short_name','start_url','display','icons'])if(!manifest[key])errors.push(`Manifest sin ${key}`)}catch{errors.push('Manifest JSON inválido')}
const sw=fs.readFileSync(path.join(root,'sw.js'),'utf8');
for(const token of ['calculadoras-mx-v3.10.0','/offline.html','skipWaiting','clients.claim'])if(!sw.includes(token))errors.push(`Service worker sin ${token}`);
const common=fs.readFileSync(path.join(root,'assets/js/common.js'),'utf8');
if(!common.includes("serviceWorker.register('/sw.js')"))errors.push('Registro del service worker ausente');
const offline=fs.readFileSync(path.join(root,'offline.html'),'utf8');
if(!offline.includes('noindex,nofollow'))errors.push('offline.html debe usar noindex');
const index=fs.readFileSync(path.join(root,'index.html'),'utf8');
if(!index.includes('rel="manifest"'))errors.push('Manifest no enlazado desde el inicio');
const config=fs.readFileSync(path.join(root,'vercel.json'),'utf8');
if(!config.includes('max-age=0, must-revalidate'))errors.push('Service worker sin política de actualización');
if(errors.length){console.error(`Release audit failed (${errors.length}):\n- ${errors.join('\n- ')}`);process.exit(1)}
console.log('Release audit passed: installable app, offline fallback, update policy and production files ready.');
