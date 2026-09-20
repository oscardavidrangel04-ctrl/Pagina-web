const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const BASE = 'https://calculadora-isr-mexico.vercel.app';
const dirs = ['articulos', 'calculadoras'];
const files = dirs.flatMap(d => fs.readdirSync(path.join(ROOT,d)).filter(x=>x.endsWith('.html')).map(x=>`${d}/${x}`));
const allHtml = new Map(files.map(f=>[f,fs.readFileSync(path.join(ROOT,f),'utf8')]));
const sitemapText = ['sitemap.xml','sitemap-seo-2026.xml'].map(f=>fs.readFileSync(path.join(ROOT,f),'utf8')).join('\n');
const sitemapUrls = [...sitemapText.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1]);
const errors=[];
const titles=new Map();
const canonicals=new Map();
for (const [file,html] of allHtml) {
  const title=(html.match(/<title>([^<]+)<\/title>/i)||[])[1];
  const desc=(html.match(/<meta[^>]+name="description"[^>]+content="([^"]+)"/i)||html.match(/<meta[^>]+content="([^"]+)"[^>]+name="description"/i)||[])[1];
  const canonical=(html.match(/<link[^>]+rel="canonical"[^>]+href="([^"]+)"/i)||html.match(/<link[^>]+href="([^"]+)"[^>]+rel="canonical"/i)||[])[1];
  const h1=(html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)||[])[1];
  if(!title) errors.push(`${file}: falta title`);
  if(!desc) errors.push(`${file}: falta description`);
  if(!canonical) errors.push(`${file}: falta canonical`);
  if(!h1) errors.push(`${file}: falta H1`);
  if((html.match(/<h1\b/gi)||[]).length!==1) errors.push(`${file}: H1 no único`);
  if(title){if(titles.has(title)) errors.push(`${file}: title duplicado con ${titles.get(title)}`); else titles.set(title,file);}
  if(canonical){if(canonicals.has(canonical)) errors.push(`${file}: canonical duplicado con ${canonicals.get(canonical)}`); else canonicals.set(canonical,file);}
  for(const m of html.matchAll(/<script[^>]+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)) {
    try { JSON.parse(m[1]); } catch(e) { errors.push(`${file}: schema JSON inválido`); }
  }
  for(const m of html.matchAll(/href="(\/(?:articulos|calculadoras)\/[^"#?]+\.html)"/g)) {
    const rel=m[1].slice(1);
    if(!fs.existsSync(path.join(ROOT,rel))) errors.push(`${file}: enlace roto ${m[1]}`);
  }
}
const newSlugs=['tabla-isr-2026','cuanto-quitan-isr-sueldo','isr-a-cargo-asalariado','salario-minimo-diario-mensual-2026','salario-minimo-frontera-norte-2026','horas-extra-dobles-triples','cuantas-horas-extra-semana','me-pueden-obligar-horas-extra','cuanto-finiquito-un-ano-renuncia','me-pueden-descontar-finiquito','trabajadores-sin-derecho-reparto-utilidades','es-obligatorio-reparto-utilidades','dias-vacaciones-por-antiguedad-2026','aguinaldo-30-dias-aprobado-vigencia','es-legal-pago-nomina-dos-partes'];
const allJoined=[...allHtml.values(),fs.readFileSync(path.join(ROOT,'articulos.html'),'utf8')].join('\n');
const inlinks={};
for(const slug of newSlugs){
  const url=`${BASE}/articulos/${slug}.html`;
  if(!sitemapUrls.includes(url)) errors.push(`${slug}: falta en sitemap`);
  const needle=`/articulos/${slug}.html`;
  inlinks[slug]=(allJoined.split(needle).length-1)-1;
  if(inlinks[slug]<2) errors.push(`${slug}: solo ${inlinks[slug]} enlaces internos externos a sí misma`);
}
const dupSitemap=sitemapUrls.filter((u,i,a)=>a.indexOf(u)!==i);
if(dupSitemap.length) errors.push(`URLs duplicadas en sitemap: ${dupSitemap.join(', ')}`);
console.log(JSON.stringify({htmlFiles:files.length,sitemapUrls:sitemapUrls.length,uniqueSitemapUrls:new Set(sitemapUrls).size,newPages:newSlugs.length,inlinks,errors},null,2));
if(errors.length) process.exit(1);
