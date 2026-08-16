import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const root = path.resolve(import.meta.dirname, '..');
const context = vm.createContext({});
vm.runInContext(fs.readFileSync(path.join(root, 'assets/js/catalog.js'), 'utf8'), context);
const catalog = vm.runInContext('globalThis.CM_CATALOG', context);
const normalize = value => String(value).normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
const search = term => catalog.filter(item => normalize(`${item.title} ${item.description} ${item.category} ${item.keywords}`).includes(normalize(term)));

if (!Array.isArray(catalog) || catalog.length !== 50) throw new Error(`El catálogo contiene ${catalog?.length || 0} entradas; se esperaban 50`);
for (const [term, slug] of [['aguinaldo', 'aguinaldo'], ['prestamo', 'prestamo'], ['salario', 'salario-neto'], ['iva', 'iva']]) {
  if (!search(term).some(item => item.slug === slug)) throw new Error(`La búsqueda “${term}” no encuentra ${slug}`);
}

const index = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const catalogScript = index.indexOf('assets/js/catalog.js?v=5.1.0');
const commonScript = index.indexOf('assets/js/common.js?v=5.1.0');
if (catalogScript < 0 || commonScript < 0 || catalogScript > commonScript) throw new Error('El inicio no carga catalog.js antes de common.js');
if (index.includes('popular.innerHTML=CM_CATALOG')) throw new Error('El inicio conserva el script que causaba CM_CATALOG is not defined');
if (!index.includes('data-home-finder') || !index.includes('data-home-finder-results')) throw new Error('Falta el buscador directo del inicio');

const catalogPage = fs.readFileSync(path.join(root, 'calculadoras.html'), 'utf8');
const cards = (catalogPage.match(/class="card calculator-card"/g) || []).length;
if (cards !== 50) throw new Error(`El catálogo HTML muestra ${cards} tarjetas sin JavaScript; se esperaban 50`);
if (!catalogPage.includes('data-catalog-category="Todas"')) throw new Error('Faltan los filtros de categorías');

const common = fs.readFileSync(path.join(root, 'assets/js/common.js'), 'utf8');
for (const token of ['ensureCatalog()', 'catalogFromCards', 'setupHomeFinder', 'setupCatalogFilters']) {
  if (!common.includes(token)) throw new Error(`Falta la recuperación del buscador: ${token}`);
}

console.log('Search regression passed: 50 static cards, direct finder, category filters and aguinaldo lookup work.');
