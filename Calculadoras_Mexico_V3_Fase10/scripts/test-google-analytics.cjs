'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const {installGoogleAnalytics} = require('./google-analytics.cjs');
const {transform: addMonetization} = require('./monetization-v2.cjs');

const root = path.join(__dirname, '..');
const output = path.join(root, 'site-public');
const measurementId = 'G-KV44465NKW';
const managedBlock = /<!-- google-analytics-4:start -->[\s\S]*?<!-- google-analytics-4:end -->\n/g;
const loader = '<script async src="https://www.googletagmanager.com/gtag/js?id=' + measurementId + '"></script>';
const coverage = {};
let verificationFiles = 0;
let bootstrap;

for (const file of fs.readdirSync(output, {recursive: true})) {
  const target = path.join(output, file);
  if (!fs.statSync(target).isFile()) continue;
  if (!file.endsWith('.html')) {
    assert.deepEqual(fs.readFileSync(target), fs.readFileSync(path.join(root, file)), file);
    continue;
  }
  const page = fs.readFileSync(target, 'utf8');
  const source = fs.readFileSync(path.join(root, file), 'utf8');
  if (source.trim().startsWith('google-site-verification:')) {
    assert.equal(page, source, file);
    verificationFiles++;
    continue;
  }
  const head = page.match(/<head\b[^>]*>[\s\S]*?<\/head\s*>/i)?.[0];
  const block = head?.match(managedBlock)?.[0];
  assert.ok(block, file);
  assert.equal(page.split(loader).length - 1, 1, file);
  assert.equal(page.match(managedBlock).length, 1, file);
  assert.equal(page.replace(managedBlock, ''), addMonetization(source, file).html, file);
  assert.equal(installGoogleAnalytics(page, file), page, file);
  const script = block.match(/<script>([\s\S]*?)<\/script>/)[1];
  bootstrap ??= script;
  assert.equal(script, bootstrap, file);
  const category = file.includes(path.sep) ? file.split(path.sep)[0] : 'raíz';
  coverage[category] = (coverage[category] || 0) + 1;
}

assert.ok(coverage.raíz && coverage.calculadoras && coverage.articulos && coverage.temas);
assert.ok(verificationFiles);
assert.throws(() => installGoogleAnalytics('<head><script src="https://www.googletagmanager.com/gtm.js?id=GTM-ABC"></script></head>', 'existing.html'), /Conflicting/);
assert.throws(() => installGoogleAnalytics('<head><script>gtag("config", "G-ABC")</script></head>', 'existing.html'), /Conflicting/);

const origin = 'https://calculadora-isr-mexico.vercel.app';
const scenario = origin + '/calculadoras/bono.html';
const visits = [
  [scenario + '?salario=18000&fecha=2026-01-01#calculadora', '', scenario, ''],
  [scenario + '?salario=18000&utm_source=pinterest&utm_medium=social&utm_campaign=bono', 'https://www.pinterest.com/pin/123/', scenario + '?utm_source=pinterest&utm_medium=social&utm_campaign=bono', 'https://www.pinterest.com/'],
  [scenario, 'https://www.google.com/search?q=bono', scenario, 'https://www.google.com/'],
  [scenario, 'https://www.bing.com/search?q=bono', scenario, 'https://www.bing.com/'],
  [scenario + '?email=ejemplo%40example.com&utm_content=ejemplo%40example.com', origin + '/calculadoras/salario-neto.html?salario=21000#resultado', scenario, origin + '/calculadoras/salario-neto.html'],
  [scenario, 'https://example.com/referencia?correo=ejemplo%40example.com', scenario, 'https://example.com/']
];
for (const [href, referrer, expectedLocation, expectedReferrer] of visits) {
  const context = {URL, location: {href}, document: {referrer}};
  context.window = context;
  vm.runInNewContext(bootstrap, context);
  const commands = Array.from(context.dataLayer, args => [...args]);
  assert.deepEqual(commands.map(args => args[0]), ['js', 'consent', 'config']);
  const [, id, config] = commands[2];
  assert.equal(id, measurementId);
  assert.equal(config.page_location, expectedLocation);
  assert.equal(config.page_referrer, expectedReferrer);
  assert.equal(config.allow_google_signals, false);
  assert.equal(config.allow_ad_personalization_signals, false);
  assert.equal(config.send_page_view, undefined);
  assert.equal(commands[1][2].ad_storage, 'denied');
  assert.equal(commands[1][2].ad_user_data, 'denied');
  assert.equal(commands[1][2].ad_personalization, 'denied');
}

const vercel = JSON.parse(fs.readFileSync(path.join(root, 'vercel.json'), 'utf8'));
assert.equal(vercel.buildCommand, 'node scripts/build-public.cjs');
assert.equal(vercel.outputDirectory, 'site-public');
for (const rule of vercel.rewrites || []) {
  const file = rule.destination.slice(1);
  assert.ok(fs.readFileSync(path.join(output, file), 'utf8').includes(loader), rule.source);
}
const policy = vercel.headers.find(rule => rule.source === '/(.*)').headers.find(header => header.key === 'Content-Security-Policy').value;
const directives = Object.fromEntries(policy.split(';').map(part => {
  const [name, ...values] = part.trim().split(/\s+/);
  return [name, values];
}));
assert.ok((directives['script-src-elem'] || directives['script-src']).includes("'unsafe-inline'"));
for (const directive of ['script-src-elem', 'connect-src', 'img-src']) {
  assert.ok((directives[directive] || directives['script-src']).includes('https:'), directive);
}
console.log(JSON.stringify({coverage, taggedPages: Object.values(coverage).reduce((sum, count) => sum + count, 0), verificationFiles, attributionScenarios: visits.length, rewrites: vercel.rewrites.length}));
