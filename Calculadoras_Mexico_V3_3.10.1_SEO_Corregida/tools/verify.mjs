import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const root = path.resolve(import.meta.dirname, '..');
const files = [];
const walk = directory => {
  for (const entry of fs.readdirSync(directory, {withFileTypes: true})) {
    if (entry.name === 'tools') continue;
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(target);
    else files.push(target);
  }
};
walk(root);

const htmlFiles = files.filter(file => file.endsWith('.html'));
const issues = [];
for (const file of htmlFiles) {
  const html = fs.readFileSync(file, 'utf8');
  const localLinks = [...html.matchAll(/(?:href|src)="([^"#?]+)"/g)].map(match => match[1])
    .filter(link => !/^(?:https?:|mailto:|tel:|data:|\/_vercel\/)/.test(link));
  for (const link of localLinks) {
    const resolved = path.resolve(path.dirname(file), link);
    if (!fs.existsSync(resolved)) issues.push(`${path.relative(root,file)} -> missing ${link}`);
  }
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map(match => match[1]);
  const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
  if (duplicates.length) issues.push(`${path.relative(root,file)} has duplicate IDs: ${[...new Set(duplicates)].join(', ')}`);

  for (const match of html.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/g)) {
    if (match[1].includes('src=')) continue;
    try {
      if (match[1].includes('application/ld+json')) JSON.parse(match[2]);
      else if (match[2].trim()) new vm.Script(match[2]);
    } catch (error) {
      issues.push(`${path.relative(root,file)} has invalid inline script: ${error.message}`);
    }
  }
}

const calculatorFiles = fs.readdirSync(path.join(root,'calculadoras')).filter(file => file.endsWith('.html'));
if (calculatorFiles.length !== 50) issues.push(`Expected 50 calculator pages, found ${calculatorFiles.length}`);
for (const file of calculatorFiles) {
  const html = fs.readFileSync(path.join(root,'calculadoras',file),'utf8');
  for (const required of ['data-calc=','class="calc-button"','data-form-reset','data-form-state','assets/js/common.js']) {
    if (!html.includes(required)) issues.push(`${file} is missing ${required}`);
  }
}

const sitemap = fs.readFileSync(path.join(root,'sitemap.xml'),'utf8');
if (!sitemap.startsWith('<?xml version="1.0" encoding="UTF-8"?>')) issues.push('Sitemap is missing the XML declaration');
if (!sitemap.includes('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">')) issues.push('Sitemap is missing the required sitemap namespace');
if (!sitemap.trimEnd().endsWith('</urlset>')) issues.push('Sitemap does not close urlset');
const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]);
if (sitemapUrls.length !== 66) issues.push(`Expected 66 sitemap URLs, found ${sitemapUrls.length}`);
const simulatorHtml=fs.readFileSync(path.join(root,'simuladores.html'),'utf8');
for(const required of ['compare-salary','compare-loan','compare-saving','assets/js/common.js']) if(!simulatorHtml.includes(required)) issues.push(`simuladores.html is missing ${required}`);

const catalogHtml=fs.readFileSync(path.join(root,'calculadoras.html'),'utf8');
const staticCards=[...catalogHtml.matchAll(/class="card calculator-card"/g)].length;
if(staticCards!==50)issues.push(`Expected 50 static catalog cards, found ${staticCards}`);
if(!catalogHtml.includes('data-catalog-count'))issues.push('Catalog result counter is missing');

if (issues.length) {
  console.error(issues.join('\n'));
  process.exit(1);
}
console.log(`Verification passed: ${htmlFiles.length} HTML pages, ${calculatorFiles.length} calculators, ${sitemapUrls.length} sitemap URLs, namespace, local links and scripts valid.`);
