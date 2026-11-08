'use strict';

/**
 * Home-only regression suite. Build the current checkout before running:
 *   node scripts/build-public.cjs && node scripts/test-home-taste.cjs
 * Optional: HOME_TASTE_BASELINE_DIR, HOME_TASTE_QA_DIR, CHROMIUM_PATH, AXE_PATH.
 * Third-party advertising is simulated: this does not validate delivery or revenue.
 */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {execFileSync} = require('node:child_process');

const ROOT = path.resolve(__dirname, '..');
const BASELINE = process.env.HOME_TASTE_BASELINE_DIR || '/workspace/work/home-taste/baseline';
const OUT = process.env.HOME_TASTE_QA_DIR || '/workspace/work/home-taste/qa';
const PUBLIC = path.join(ROOT, 'site-public');
const BASE_PUBLIC = path.join(BASELINE, 'site-public');
const AXE = process.env.AXE_PATH || '/workspace/work/monetization-tools/node_modules/axe-core/axe.min.js';
const WIDTHS = [1440, 390, 320, 768, 820, 1024];
const NATIVE = '409e3950cb7b10082bb628969be6611a';
const BANNER = '94dbe87812d642e0600cc58986b093c2';
const AFFILIATES = {
  aliexpress: {id: 'qpw0xm1c34934a2368b316525dc3e8', host: 'rzekl.com'},
  solcredito: {id: '9k0cwagbas934a2368b3bd6fe4c78f', host: 'dkfrh.com'},
};
const report = {
  status: 'RUNNING', baseline: BASELINE, startedAt: new Date().toISOString(),
  conditions: [
    'Local compiled output with Vercel rewrites and response headers, including CSP.',
    'Adsterra scripts are empty simulated responses; official Admitad images are replaced by labeled test SVGs.',
    'No real ad impressions, affiliate navigation, conversion, production deployment or field Core Web Vitals are verified.',
  ],
  static: {}, layouts: [], accessibility: [], interactions: [], screenshots: [],
  scriptErrors: [], cspViolations: [], remoteRequests: [], missingLocalResources: [], performance: [],
};
fs.mkdirSync(OUT, {recursive: true});
const save = () => fs.writeFileSync(path.join(OUT, 'validation.json'), JSON.stringify(report, null, 2) + '\n');
const read = file => fs.readFileSync(file, 'utf8');
const files = (dir, rel = '') => fs.readdirSync(path.join(dir, rel), {withFileTypes: true})
  .flatMap(entry => entry.isDirectory() ? files(dir, path.join(rel, entry.name)) : [path.join(rel, entry.name)]);
const sameBytes = (a, b, description) => assert.ok(fs.existsSync(b) && fs.readFileSync(a).equals(fs.readFileSync(b)), description);
const attributes = tag => Object.fromEntries([...tag.matchAll(/([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g)]
  .map(match => [match[1].toLowerCase(), match[2] ?? match[3]]));
const tags = (html, name) => (html.match(new RegExp('<' + name + '\\b[^>]*>', 'gi')) || []).map(attributes);
const schemas = html => [...html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)].map(match => JSON.parse(match[1]));
const title = html => html.match(/<title>([\s\S]*?)<\/title>/i)?.[1];
const metas = html => Object.fromEntries(tags(html, 'meta').map(meta => [meta.name || meta.property || 'charset', meta.content || meta.charset]));
const destinations = html => [...new Set(tags(html, 'a').filter(tag => tag.href).map(tag => new URL(tag.href.replaceAll('&amp;', '&'), 'https://current.test/').href))].sort();

function staticChecks() {
  assert.ok(fs.existsSync(path.join(BASELINE, 'index.html')), 'Baseline checkout is missing: ' + BASELINE);
  if (!fs.existsSync(path.join(BASE_PUBLIC, 'index.html'))) {
    execFileSync(process.execPath, ['scripts/build-public.cjs'], {cwd: BASELINE, stdio: 'inherit'});
  }
  assert.ok(fs.existsSync(path.join(PUBLIC, 'index.html')), 'Run node scripts/build-public.cjs before the home suite.');
  const oldFiles = files(BASE_PUBLIC), newFiles = files(PUBLIC);
  const oldHTML = oldFiles.filter(file => file.endsWith('.html'));
  assert.deepEqual(newFiles.filter(file => file.endsWith('.html')).sort(), oldHTML.sort(), 'Public URL inventory changed');
  let sourceHTML = 0, compiledHTML = 0, priorResources = 0;
  for (const file of oldHTML.filter(file => file !== 'index.html')) {
    sameBytes(path.join(BASE_PUBLIC, file), path.join(PUBLIC, file), 'Non-home compiled HTML changed: ' + file);
    compiledHTML++;
    if (fs.existsSync(path.join(BASELINE, file))) {
      sameBytes(path.join(BASELINE, file), path.join(ROOT, file), 'Non-home source HTML changed: ' + file);
      sourceHTML++;
    }
  }
  for (const file of oldFiles.filter(file => !file.endsWith('.html'))) {
    sameBytes(path.join(BASE_PUBLIC, file), path.join(PUBLIC, file), 'Existing public resource changed: ' + file);
    priorResources++;
  }
  for (const file of files(path.join(BASELINE, 'assets'))) {
    sameBytes(path.join(BASELINE, 'assets', file), path.join(ROOT, 'assets', file), 'Existing source asset changed: ' + file);
  }
  const before = read(path.join(BASE_PUBLIC, 'index.html'));
  const after = read(path.join(PUBLIC, 'index.html'));
  const originalMeta = metas(before), currentMeta = metas(after);
  for (const [key, value] of Object.entries(originalMeta)) {
    if (key === 'theme-color') continue;
    assert.equal(currentMeta[key], value, 'Home metadata changed: ' + key);
  }
  assert.ok(/^#(?:0b57d0|1a73e8|2563eb|071a35|0e2a52)$/i.test(currentMeta['theme-color'] || ''), 'Use a recovered original blue theme-color');
  assert.equal(title(after), title(before), 'Home title changed');
  assert.deepEqual(schemas(after), schemas(before), 'Home JSON-LD changed');
  const canonical = html => tags(html, 'link').filter(link => link.rel === 'canonical');
  assert.deepEqual(canonical(after), canonical(before), 'Home canonical changed');
  assert.equal((after.match(/<h1\b/gi) || []).length, 1, 'Home needs one H1');
  const missingDestinations = destinations(before).filter(href => !destinations(after).includes(href));
  assert.deepEqual(missingDestinations, [], 'Previous home link destinations removed');
  const oldScripts = tags(before, 'script').filter(tag => tag.src).map(tag => tag.src);
  const newScripts = tags(after, 'script').filter(tag => tag.src).map(tag => tag.src);
  for (const src of oldScripts) assert.ok(newScripts.includes(src), 'Previous home script missing: ' + src);
  for (const script of newScripts) assert.equal(newScripts.filter(src => src === script).length, 1, 'Duplicate script: ' + script);
  for (const file of oldHTML) {
    const html = read(path.join(PUBLIC, file));
    assert.equal(html.includes('/assets/css/home-taste.css'), file === 'index.html', 'Home stylesheet leaked: ' + file);
    assert.equal(/class=["'][^"']*\bcm-home-taste\b/.test(html), file === 'index.html', 'Home scope leaked: ' + file);
  }
  assert.ok(!after.includes('/assets/css/pilot-v2.css'), 'Home must stop loading the previous pilot stylesheet');
  assert.ok(!after.includes('cm-pilot-v2'), 'Home must stop opting into the previous pilot design');
  assert.ok(read(path.join(ROOT, 'assets/css/home-taste.css')).includes('body.cm-home-taste'), 'New stylesheet must use the home body scope');
  assert.ok(after.includes('/assets/img/logo.svg'), 'Original logo must be preserved on home');
  const cfg = JSON.parse(read(path.join(ROOT, 'vercel.json')));
  const oldCfg = JSON.parse(read(path.join(BASELINE, 'vercel.json')));
  for (const key of ['headers', 'rewrites', 'redirects']) assert.deepEqual(cfg[key], oldCfg[key], 'Vercel ' + key + ' changed');
  const rewrites = Object.fromEntries((cfg.rewrites || []).map(item => [item.source, item.destination]));
  const redirects = new Set((cfg.redirects || []).map(item => item.source));
  for (const href of destinations(after)) {
    const url = new URL(href);
    if (url.hostname !== 'current.test' || redirects.has(url.pathname)) continue;
    const destination = rewrites[url.pathname] || url.pathname;
    assert.ok(fs.existsSync(path.join(PUBLIC, destination === '/' ? 'index.html' : destination)), 'Home internal link does not resolve: ' + href);
  }
  const expectedUnits = {
    nativeContainer: 'id="container-' + NATIVE + '"',
    nativeScript: 'src="https://bauval.org/21/' + NATIVE + '"',
    bannerScript: 'https://bauval.org/22/' + BANNER,
    aliExpress: 'data-affiliate="aliexpress"', solCredito: 'data-affiliate="solcredito"',
  };
  for (const [unit, token] of Object.entries(expectedUnits)) assert.equal(after.split(token).length - 1, 1, 'Exactly one ' + unit);
  report.static = {
    publicHTML: oldHTML.length, sourceNonHomeUnchanged: sourceHTML, compiledNonHomeUnchanged: compiledHTML,
    existingPublicResourcesUnchanged: priorResources, existingSourceAssetsUnchanged: files(path.join(BASELINE, 'assets')).length,
    previousHomeDestinationsPreserved: destinations(before).length,
    metadata: 'Existing metadata/title/canonical/JSON-LD preserved; original blue theme-color restored.',
    addedMetadata: Object.keys(currentMeta).filter(key => !(key in originalMeta)),
    allOriginalScriptsPreserved: oldScripts, homeStyleIsolation: true, exactCommercialUnits: expectedUnits,
  };
  save();
  console.log('Static home invariants PASS:', compiledHTML, 'non-home HTML files unchanged.');
  return cfg;
}

function routeHandler(cfg) {
  const rewrites = Object.fromEntries((cfg.rewrites || []).map(item => [item.source, item.destination]));
  const commonHeaders = Object.fromEntries((cfg.headers.find(item => item.source === '/(.*)')?.headers || []).map(item => [item.key, item.value]));
  const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="300" height="250"><rect width="300" height="250" fill="#e8eef8"/><text x="150" y="116" text-anchor="middle" fill="#17345b" font-family="sans-serif" font-size="15">Banner simulado</text><text x="150" y="141" text-anchor="middle" fill="#17345b" font-family="sans-serif" font-size="12">Prueba local · 300 × 250</text></svg>';
  const mime = {'.html': 'text/html', '.css': 'text/css', '.js': 'application/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.woff2': 'font/woff2', '.webmanifest': 'application/manifest+json', '.xml': 'application/xml', '.txt': 'text/plain'};
  return async route => {
    const url = new URL(route.request().url());
    if (!['current.test', 'baseline.test'].includes(url.hostname)) {
      report.remoteRequests.push({url: url.href, type: route.request().resourceType(), simulated: ['ad.admitad.com', 'bauval.org'].includes(url.hostname)});
      if (url.hostname === 'ad.admitad.com') return route.fulfill({contentType: 'image/svg+xml', body: svg});
      if (url.hostname === 'bauval.org') return route.fulfill({contentType: 'application/javascript', body: '/* Ad delivery intentionally excluded from local test. */'});
      return route.abort('blockedbyclient');
    }
    if (url.pathname.startsWith('/_vercel/')) return route.fulfill({contentType: 'application/javascript', body: ''});
    const directory = url.hostname === 'baseline.test' ? BASE_PUBLIC : PUBLIC;
    const resolved = rewrites[url.pathname] || url.pathname;
    const file = path.join(directory, resolved === '/' ? 'index.html' : decodeURIComponent(resolved));
    if (!file.startsWith(directory + path.sep) || !fs.existsSync(file) || !fs.statSync(file).isFile()) {
      report.missingLocalResources.push(url.href);
      return route.fulfill({status: 404, body: 'Not found'});
    }
    const headers = {...commonHeaders};
    for (const entry of cfg.headers || []) if (entry.source === url.pathname) {
      for (const header of entry.headers) headers[header.key] = header.value;
    }
    return route.fulfill({body: fs.readFileSync(file), contentType: mime[path.extname(file)] || 'application/octet-stream', headers});
  };
}

async function preparePage(context) {
  const page = await context.newPage();
  page.setDefaultTimeout(10000);
  page.on('pageerror', error => report.scriptErrors.push({url: page.url(), error: error.message}));
  await page.addInitScript(() => {
    window.qaCLS = 0; window.qaLCP = 0; window.qaCSP = [];
    document.addEventListener('securitypolicyviolation', event => window.qaCSP.push({directive: event.violatedDirective, blockedURI: event.blockedURI}));
    try {
      new PerformanceObserver(list => list.getEntries().forEach(entry => {if (!entry.hadRecentInput) window.qaCLS += entry.value;})).observe({type: 'layout-shift', buffered: true});
      new PerformanceObserver(list => list.getEntries().forEach(entry => {window.qaLCP = entry.startTime;})).observe({type: 'largest-contentful-paint', buffered: true});
    } catch { /* Older Chromium may not expose performance entries. */ }
  });
  return page;
}

async function settle(page) {
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(120);
}

async function overflow(page, label) {
  const result = await page.evaluate(() => ({
    viewport: innerWidth, width: document.documentElement.scrollWidth,
    offenders: [...document.querySelectorAll('body *')].filter(element => {
      const box = element.getBoundingClientRect(), style = getComputedStyle(element);
      return box.width && style.visibility !== 'hidden' && (box.right > innerWidth + 1 || box.left < -1) && !element.closest('.search-dialog:not(.open), .main-nav:not(.open)');
    }).slice(0, 12).map(element => ({tag: element.tagName, id: element.id, class: element.className?.baseVal ?? element.className})),
  }));
  assert.ok(result.width <= result.viewport + 1, label + ' horizontal overflow: ' + JSON.stringify(result));
  return result;
}

async function composition(page, label) {
  const collisions = await page.evaluate(() => {
    const pairs = [];
    const check = (items, group) => {
      const visible = items.filter(element => {const r = element.getBoundingClientRect(), s = getComputedStyle(element); return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && s.display !== 'none';});
      for (let i = 0; i < visible.length; i++) for (let j = i + 1; j < visible.length; j++) {
        const a = visible[i].getBoundingClientRect(), b = visible[j].getBoundingClientRect();
        const x = Math.min(a.right, b.right) - Math.max(a.left, b.left), y = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
        if (x > 2 && y > 2) pairs.push({group, a: visible[i].className, b: visible[j].className, overlap: [x, y]});
      }
    };
    check([...document.querySelectorAll('.header-inner > *')], 'header');
    check([...document.querySelectorAll('main > section, main > aside')], 'main-sections');
    return pairs;
  });
  assert.deepEqual(collisions, [], label + ' structural overlap');
  const covered = await page.evaluate(() => [...document.querySelectorAll('a[href], button, input')].filter(element => {
    if (element.closest('.search-dialog:not(.open), .main-nav:not(.open)')) return false;
    const r = element.getBoundingClientRect(), style = getComputedStyle(element);
    if (!r.width || !r.height || style.visibility === 'hidden' || r.top < 0 || r.bottom > innerHeight || r.left < 0 || r.right > innerWidth) return false;
    const hit = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
    return hit && !element.contains(hit) && !hit.contains(element);
  }).map(element => ({tag: element.tagName, text: (element.textContent || element.getAttribute('aria-label') || '').trim().slice(0, 60)})));
  assert.deepEqual(covered, [], label + ' visible controls covered at their center');
}

async function advertisements(page) {
  assert.equal(await page.locator('.cm-commercial').count(), 3, 'Three commercial groups');
  assert.equal(await page.locator('#container-' + NATIVE).count(), 1, 'One native ad container');
  assert.equal(await page.locator('script[src="https://bauval.org/21/' + NATIVE + '"]').count(), 1, 'One native ad script');
  assert.equal(await page.locator('.cm-commercial--banner iframe').count(), 1, 'One banner iframe');
  const frame = page.frames().find(item => item.url() === 'about:srcdoc');
  assert.ok(frame, '300 × 250 banner frame exists');
  assert.deepEqual(await frame.evaluate(() => window.atOptions), {key: BANNER, format: 'iframe', height: 250, width: 300, params: {}}, 'Exact isolated atOptions under CSP');
  assert.equal(await page.evaluate(() => typeof window.atOptions), 'undefined', 'Banner configuration must not leak globally');
  for (const [name, data] of Object.entries(AFFILIATES)) {
    const card = page.locator('[data-affiliate="' + name + '"]');
    assert.equal(await card.count(), 1, name + ' has one card');
    const links = await card.locator('a[href]').evaluateAll(elements => elements.map(element => ({href: element.href, rel: element.rel, target: element.target})));
    assert.ok(links.length >= 2, name + ' banner and CTA retained');
    for (const link of links) {
      assert.equal(link.href, 'https://' + data.host + '/g/' + data.id + '/?i=4', name + ' exact tracking URL');
      for (const rel of ['sponsored', 'nofollow', 'noopener']) assert.ok(link.rel.split(/\s+/).includes(rel), name + ' disclosure rel ' + rel);
      assert.equal(link.target, '_blank');
    }
    const img = card.locator('img');
    assert.equal(await img.getAttribute('src'), 'https://ad.admitad.com/b/' + data.id + '/', name + ' official image source');
    assert.equal(await img.getAttribute('width'), '300');
    assert.equal(await img.getAttribute('height'), '250');
    assert.ok(await img.getAttribute('alt'), name + ' accessible image');
    assert.match(await card.innerText(), /Publicidad/);
    assert.match(await card.innerText(), /afiliado/i);
  }
}

async function accessibility(page, width, theme, scope) {
  if (!fs.existsSync(AXE)) throw Error('axe-core missing; set AXE_PATH to its axe.min.js');
  if (!await page.evaluate(() => Boolean(window.axe))) await page.addScriptTag({path: AXE});
  const violations = await page.evaluate(async scopeName => {
    const context = scopeName === 'main' ? document.querySelector('main') : document;
    const result = await axe.run(context, {runOnly: {type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa']}});
    return result.violations.map(item => ({id: item.id, impact: item.impact, description: item.description, nodes: item.nodes.map(node => ({target: node.target, summary: node.failureSummary}))}));
  }, scope);
  // Some legacy content-visibility sections are not painted until scrolled into view.
  // Recheck contrast on those actual nodes, never ignore a confirmed violation.
  for (const violation of violations.filter(item => item.id === 'color-contrast')) {
    const confirmed = [];
    for (const node of violation.nodes) {
      if (node.target.length !== 1 || typeof node.target[0] !== 'string') {confirmed.push(node); continue;}
      const element = page.locator(node.target[0]).first();
      await element.scrollIntoViewIfNeeded();
      await page.waitForTimeout(60);
      if (await element.evaluate(async target => (await axe.run(target, {runOnly: ['color-contrast']})).violations.length)) confirmed.push(node);
    }
    violation.nodes = confirmed;
  }
  report.accessibility.push({width, theme, scope, violations: violations.filter(item => item.nodes.length)});
  save();
}

async function homeContent(page) {
  const summary = await page.evaluate(({before, after}) => {
    const parse = text => new DOMParser().parseFromString(text, 'text/html');
    const normalize = text => text.replace(/\s+/g, ' ').trim();
    const previous = parse(before), current = parse(after);
    const copy = [...previous.querySelectorAll('main p')]
      .filter(element => !element.closest('.cm-commercial, .cm-home, .affiliate-card, .adsterra-unit'))
      .map(element => normalize(element.textContent)).filter(text => text.length >= 70);
    const currentText = normalize(current.querySelector('main').textContent);
    return {previousInformativeParagraphs: copy.length, verbatimPreserved: copy.filter(text => currentText.includes(text)).length, changedParagraphs: copy.filter(text => !currentText.includes(text))};
  }, {before: read(path.join(BASE_PUBLIC, 'index.html')), after: read(path.join(PUBLIC, 'index.html'))});
  report.content = summary;
  // Rewording headings/intro is part of the authorized redesign; retain the detailed useful explanations.
  assert.deepEqual(summary.changedParagraphs, [], 'Existing informative home paragraphs removed or changed');
}

async function interactionChecks(browser, context, page, handler) {
  await page.emulateMedia({reducedMotion: 'no-preference'});
  await page.setViewportSize({width: 1440, height: 900});
  await page.goto('https://current.test/');
  await settle(page);
  const feature = page.locator('.taste-feature').first();
  await feature.scrollIntoViewIfNeeded();
  await page.mouse.move(0, 0);
  const resting = await feature.boundingBox();
  await feature.hover();
  await page.waitForTimeout(220);
  const hovered = await feature.boundingBox();
  assert.ok(Math.abs(resting.y - hovered.y - 2) < 0.5, 'Featured tool responds to pointer hover');
  await page.emulateMedia({reducedMotion: 'reduce'});
  assert.equal(await feature.evaluate(element => getComputedStyle(element).transform), 'none', 'Reduced motion disables hover movement');
  report.interactions.push('Featured card lifts 2px on desktop hover; reduced-motion removes that movement.');
  await page.setViewportSize({width: 390, height: 900});
  await page.goto('https://current.test/');
  await settle(page);
  const toggle = page.locator('[data-menu-toggle]');
  assert.equal(await toggle.getAttribute('aria-controls'), 'main-navigation');
  await toggle.click();
  assert.equal(await toggle.getAttribute('aria-expanded'), 'true');
  assert.ok(await page.locator('.main-nav').evaluate(element => element.classList.contains('open')));
  await page.waitForFunction(() => document.querySelector('.main-nav a') === document.activeElement);
  await page.locator('.main-nav a').last().focus();
  await page.keyboard.press('Tab');
  assert.ok(await toggle.evaluate(element => document.activeElement === element), 'Mobile menu retains keyboard focus');
  await page.keyboard.press('Tab');
  assert.ok(await page.locator('.main-nav a').first().evaluate(element => document.activeElement === element), 'Menu toggle cycles to first link');
  await page.keyboard.press('Shift+Tab');
  assert.ok(await toggle.evaluate(element => document.activeElement === element), 'Menu supports reverse keyboard order');
  await overflow(page, 'Open mobile menu');
  await page.keyboard.press('Control+k');
  await page.waitForFunction(() => document.activeElement?.classList.contains('global-search'));
  const nestedDialog = page.locator('.search-dialog');
  const nestedControls = nestedDialog.locator('input,button,a[href]').filter({visible: true});
  await nestedControls.last().focus();
  await page.keyboard.press('Tab');
  assert.ok(await nestedControls.first().evaluate(element => document.activeElement === element), 'Search focus trap takes precedence over open mobile menu');
  await page.keyboard.press('Shift+Tab');
  assert.ok(await nestedControls.last().evaluate(element => document.activeElement === element), 'Search reverse focus trap takes precedence over menu');
  await page.keyboard.press('Escape');
  assert.equal(await nestedDialog.getAttribute('aria-hidden'), 'true');
  assert.equal(await toggle.getAttribute('aria-expanded'), 'false');
  assert.ok(await toggle.evaluate(element => document.activeElement === element));
  await toggle.click();
  await page.setViewportSize({width: 1440, height: 900});
  await page.waitForTimeout(100);
  assert.equal(await toggle.getAttribute('aria-expanded'), 'false');
  report.interactions.push('Mobile menu opens, closes with Escape, restores focus and closes at desktop breakpoint.');

  const opener = page.locator('[data-search-open]').first();
  await opener.focus();
  await page.keyboard.press('Control+k');
  const dialog = page.locator('.search-dialog');
  await page.waitForFunction(() => document.activeElement?.classList.contains('global-search'));
  assert.equal(await dialog.getAttribute('aria-hidden'), 'false');
  await page.locator('.global-search').fill('aguinaldo');
  await page.waitForFunction(() => [...document.querySelectorAll('.search-results a')].some(element => element.href.includes('/calculadoras/aguinaldo')));
  await page.keyboard.press('ArrowDown');
  assert.equal(await page.locator('.search-results a.active').count(), 1, 'Search keyboard selection');
  const first = dialog.locator('input,button,a[href]').filter({visible: true}).first();
  const last = dialog.locator('input,button,a[href]').filter({visible: true}).last();
  await last.focus(); await page.keyboard.press('Tab');
  assert.ok(await first.evaluate(element => document.activeElement === element), 'Modal focus wraps at end');
  await page.keyboard.press('Escape');
  assert.equal(await dialog.getAttribute('aria-hidden'), 'true');
  assert.ok(await opener.evaluate(element => document.activeElement === element), 'Modal restores opening focus');
  report.interactions.push('Ctrl+K search, real catalog matching, arrow selection, focus trap and Escape/focus restoration.');

  await page.setViewportSize({width: 390, height: 900});
  await page.evaluate(() => {document.documentElement.dataset.theme = 'light'; localStorage.setItem('cm-theme', 'light');});
  await page.locator('[data-theme-toggle]').click();
  assert.equal(await page.evaluate(() => document.documentElement.dataset.theme), 'dark');
  assert.equal(await page.evaluate(() => localStorage.getItem('cm-theme')), 'dark');
  await page.reload();
  assert.equal(await page.evaluate(() => document.documentElement.dataset.theme), 'dark');
  report.interactions.push('Theme toggle switches and persists through reload.');

  const finder = page.locator('[data-taste-finder]');
  await finder.locator('input[name="q"]').fill('salario diario');
  await page.waitForFunction(() => /\d/.test(document.querySelector('[data-taste-count]').textContent) && [...document.querySelectorAll('#taste-results a')].some(element => element.href.includes('salario-diario.html')));
  assert.ok(await page.locator('#taste-results a').count() <= 4, 'Finder displays at most four matching shortcuts');
  assert.match(await page.locator('[data-taste-count]').innerText(), /\d/);
  await finder.locator('input[name="q"]').press('ArrowDown');
  assert.ok(await page.locator('#taste-results a').first().evaluate(element => element === document.activeElement), 'Finder ArrowDown focuses first match');
  await finder.locator('input[name="q"]').fill('zxqv-inexistente');
  await page.waitForFunction(() => document.querySelectorAll('#taste-results a').length === 0);
  assert.match(await page.locator('#taste-results').innerText(), /no|prueba|coinciden/i);
  report.interactions.push('Progressive home finder matches the real catalog, limits shortcuts to four, handles ArrowDown and empty results.');

  const noJS = await browser.newContext({javaScriptEnabled: false, serviceWorkers: 'block', viewport: {width: 390, height: 900}});
  await noJS.route('**/*', handler);
  const plain = await noJS.newPage();
  await plain.goto('https://current.test/');
  const form = plain.locator('form[action="/calculadoras.html"]').filter({has: plain.locator('input[name="q"]')}).first();
  assert.equal((await form.getAttribute('method')).toLowerCase(), 'get');
  await form.locator('input[name="q"]').fill('salario diario');
  await Promise.all([plain.waitForURL(url => url.pathname === '/calculadoras.html' && url.searchParams.get('q') === 'salario diario'), form.locator('button[type="submit"]').click()]);
  report.interactions.push('Without JavaScript the home search submits GET /calculadoras.html?q=salario+diario.');
  await noJS.close();

  await page.evaluate(() => {
    localStorage.setItem('cm-favorites-v1', JSON.stringify(['aguinaldo']));
    localStorage.setItem('cm-recent-v1', JSON.stringify(['salario-diario']));
    localStorage.setItem('cm-history-v1', JSON.stringify([{title: 'Cálculo de prueba local', path: 'salario-diario.html', url: '/calculadoras/salario-diario.html', summary: '$400.00', text: 'Dato sintético de validación', at: Date.now()}]));
  });
  await page.reload();
  assert.equal(await page.locator('[data-favorites-list] [data-favorite="aguinaldo"]').getAttribute('aria-pressed'), 'true');
  assert.ok(await page.locator('[data-recent-list] a[href$="salario-diario.html"]').count());
  assert.ok((await page.locator('[data-history-list]').innerText()).includes('Cálculo de prueba local'));
  await page.locator('[data-favorites-list] [data-favorite="aguinaldo"]').click();
  assert.deepEqual(await page.evaluate(() => JSON.parse(localStorage.getItem('cm-favorites-v1'))), []);
  await page.locator('[data-history-clear]').click();
  assert.deepEqual(await page.evaluate(() => JSON.parse(localStorage.getItem('cm-history-v1'))), []);
  assert.ok((await page.locator('[data-history-list]').innerText()).includes('Sin cálculos guardados'));
  report.interactions.push('Synthetic local favorites/recent/history render correctly; remove favorite and clear history persist.');
  await page.setViewportSize({width: 320, height: 900});
  await page.goto('https://current.test/');
  await page.evaluate(() => {
    const event = new Event('beforeinstallprompt', {cancelable: true});
    event.prompt = async () => {};
    event.userChoice = Promise.resolve({outcome: 'dismissed'});
    window.dispatchEvent(event);
  });
  assert.equal(await page.locator('[data-install-app]').count(), 1);
  await overflow(page, 'Optional installation control at 320px');
  await composition(page, 'Optional installation control at 320px');
  await page.locator('[data-install-app]').click();
  await page.waitForFunction(() => !document.querySelector('[data-install-app]'));
  report.interactions.push('Synthetic installation prompt preserves its header control without overflow at 320px; no real app installation attempted.');
  save();
}

async function browserChecks(cfg) {
  const {chromium} = require('playwright');
  const browser = await chromium.launch({executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', args: ['--no-sandbox']});
  const handler = routeHandler(cfg);
  try {
    const context = await browser.newContext({serviceWorkers: 'block', reducedMotion: 'reduce', colorScheme: 'light'});
    await context.route('**/*', handler);
    const page = await preparePage(context);
    await homeContent(page);
    for (const width of WIDTHS) for (const theme of ['light', 'dark']) {
      const label = width + 'px ' + theme;
      await page.setViewportSize({width, height: 900});
      await page.goto('https://current.test/');
      await page.evaluate(value => {document.documentElement.dataset.theme = value; localStorage.setItem('cm-theme', value);}, theme);
      await settle(page);
      assert.ok(await page.locator('h1').isVisible(), label + ' main heading must render');
      assert.ok(await page.locator('[data-taste-finder]').isVisible(), label + ' product finder must render');
      await overflow(page, label);
      await composition(page, label);
      await advertisements(page);
      for (const ad of await page.locator('.cm-commercial').all()) {
        await ad.scrollIntoViewIfNeeded();
        await settle(page);
        await overflow(page, label + ' commercial section');
      }
      const csp = await page.evaluate(() => window.qaCSP);
      report.cspViolations.push(...csp.map(item => ({width, theme, ...item})));
      assert.deepEqual(csp.filter(item => item.blockedURI.startsWith('https://current.test/') || item.blockedURI.includes('bauval.org')), [], label + ' required resource blocked by CSP');
      await page.evaluate(() => scrollTo(0, 0));
      await settle(page);
      for (const fullPage of [false, true]) {
        const filename = 'home-' + width + '-' + theme + (fullPage ? '-full' : '-viewport') + '.png';
        await page.screenshot({path: path.join(OUT, filename), fullPage});
        report.screenshots.push(filename);
      }
      await overflow(page, label + ' after full-page render');
      report.layouts.push({width, theme, overflow: false, structuralOverlap: false, commercialUnits: 4, simulated: true, clsSum: await page.evaluate(() => window.qaCLS)});
      if ([390, 1440].includes(width)) {
        await accessibility(page, width, theme, 'main');
        await accessibility(page, width, theme, 'document');
      }
      save();
      console.log('Home layout PASS:', label);
    }
    await interactionChecks(browser, context, page, handler);
    // Control pages keep the same rendered output as well as byte-identical assets/HTML.
    // Reset local test data and theme so both origins have identical starting state.
    await page.addInitScript(() => {localStorage.clear(); localStorage.setItem('cm-theme', 'light');});
    report.nonHomeControls = [];
    for (const file of ['calculadoras/salario-diario.html', 'calculadoras/pago-quincenal.html', 'articulos/como-calcular-aguinaldo.html']) {
      const results = [];
      for (const host of ['baseline.test', 'current.test']) {
        await page.goto('https://' + host + '/' + file);
        await settle(page);
        if (await page.locator('.calc-button').count()) await page.locator('.calc-button').first().click();
        results.push(await page.evaluate(() => ({title: document.title, h1: document.querySelector('h1').textContent, result: document.querySelector('.result')?.innerText || null, homeStyles: [...document.styleSheets].some(sheet => sheet.href?.includes('home-taste')), background: getComputedStyle(document.body).backgroundColor})));
      }
      assert.deepEqual(results[1], results[0], 'Non-home runtime unchanged: ' + file);
      assert.equal(results[1].homeStyles, false);
      report.nonHomeControls.push({file, unchanged: true, result: results[1].result});
    }
    // Small deterministic local comparison; neither network/ads nor real-user INP are represented.
    await page.setViewportSize({width: 390, height: 900});
    for (const host of ['baseline.test', 'current.test']) {
      const runs = [];
      for (let i = 0; i < 3; i++) {
        await page.goto('https://' + host + '/');
        await settle(page);
        runs.push(await page.evaluate(() => ({lcpMs: window.qaLCP, clsSum: window.qaCLS, domNodes: document.querySelectorAll('*').length, domContentLoadedMs: performance.getEntriesByType('navigation')[0].domContentLoadedEventEnd})));
      }
      report.performance.push({host, width: 390, runs, note: 'Local Chromium, synthetic third parties, no throttling. This is not field CWV or a guaranteed performance comparison.'});
    }
    assert.ok(report.remoteRequests.some(item => item.url === 'https://bauval.org/21/' + NATIVE), 'Native ad script request made under CSP');
    assert.ok(report.remoteRequests.some(item => item.url === 'https://bauval.org/22/' + BANNER), 'Banner script request made under CSP');
    assert.deepEqual(report.scriptErrors, [], 'JavaScript runtime errors');
    assert.deepEqual([...new Set(report.missingLocalResources)], [], 'Missing local resources');
    const violations = report.accessibility.flatMap(item => item.violations.map(violation => ({width: item.width, theme: item.theme, scope: item.scope, ...violation})));
    report.status = violations.length ? 'ACCESSIBILITY_REVIEW' : 'PASS';
    report.accessibilityFindings = violations;
    report.finishedAt = new Date().toISOString();
    save();
    console.log(JSON.stringify({status: report.status, layouts: report.layouts.length, screenshots: report.screenshots.length, accessibilityChecks: report.accessibility.length, accessibilityFindings: violations.length, output: OUT}));
    if (violations.length) process.exitCode = 1;
  } finally {
    await browser.close();
  }
}

(async () => {
  const cfg = staticChecks();
  if (process.env.HOME_TASTE_STATIC_ONLY === '1') {report.status = 'PASS_STATIC'; save();}
  else await browserChecks(cfg);
})().catch(error => {
  report.status = 'FAIL'; report.error = error.message; report.stack = error.stack;
  save(); console.error(error.stack); process.exitCode = 1;
});
