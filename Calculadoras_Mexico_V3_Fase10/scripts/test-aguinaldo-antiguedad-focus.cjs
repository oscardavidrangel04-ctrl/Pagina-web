const fs = require('fs');
const path = require('path');
const { chromium } = require('C:/Users/Casa/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');

(async () => {
  const root = path.resolve(__dirname, '..');
  const output = path.join(root, 'outputs');
  fs.mkdirSync(output, { recursive: true });
  const browser = await chromium.launch({ headless: true, channel: 'msedge' });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.route('**/*', async route => {
    const url = new URL(route.request().url());
    if (url.hostname !== 'local.test') return route.abort();
    const target = path.resolve(root, '.' + decodeURIComponent(url.pathname));
    if (!target.startsWith(root + path.sep) || !fs.existsSync(target)) return route.fulfill({ status: 404, body: '' });
    const type = target.endsWith('.css') ? 'text/css' : target.endsWith('.js') ? 'application/javascript' : target.endsWith('.svg') ? 'image/svg+xml' : target.endsWith('.html') ? 'text/html' : 'application/octet-stream';
    return route.fulfill({ contentType: type, body: fs.readFileSync(target) });
  });

  await page.goto('http://local.test/articulos/aguinaldo-por-antiguedad.html');
  if (await page.locator('h1').count() !== 1) throw Error('Debe existir un H1');
  if (await page.locator('h2').count() > 11) throw Error('Demasiados H2');
  const title = await page.title();
  if (title.length < 45 || title.length > 65 || !title.toLowerCase().includes('cuánto me toca de aguinaldo')) throw Error('Title SEO fuera de rango');
  const description = await page.locator('meta[name="description"]').getAttribute('content');
  if (!description || description.length < 120 || description.length > 160) throw Error('Meta description fuera de rango');

  const schemas = await page.evaluate(() => Array.from(document.querySelectorAll('script[type="application/ld+json"]')).map(node => JSON.parse(node.textContent)));
  const faqSchema = schemas.find(item => item['@type'] === 'FAQPage');
  const visibleFaqs = await page.locator('.faq-section .faq-item').count();
  if (!faqSchema || faqSchema.mainEntity.length !== 8 || visibleFaqs !== 8) throw Error('FAQ visible y schema no coinciden');
  if (!JSON.stringify(schemas).includes('Article')) throw Error('Falta schema Article');

  await page.locator('#antiguedadSueldo').fill('15000');
  await page.locator('#antiguedadDiasAguinaldo').fill('15');
  await page.locator('#antiguedadDiasTrabajados').fill('365');
  await page.locator('#calcularAguinaldoAntiguedad').click();
  let result = await page.locator('#resultadoAguinaldoAntiguedad').innerText();
  if (!result.includes('$7,500.00') || !result.includes('$500.00')) throw Error('Cálculo anual incorrecto');
  await page.locator('#antiguedadDiasTrabajados').fill('182');
  await page.locator('#calcularAguinaldoAntiguedad').click();
  result = await page.locator('#resultadoAguinaldoAntiguedad').innerText();
  if (!result.includes('$3,739.73')) throw Error('Cálculo proporcional incorrecto');

  const brokenAnchors = await page.evaluate(() => Array.from(document.querySelectorAll('a[href^="#"]')).map(a => a.getAttribute('href').slice(1)).filter(id => id && !document.getElementById(id)));
  if (brokenAnchors.length) throw Error('Anclas rotas: ' + brokenAnchors.join(','));
  await page.locator('#antiguedadDiasTrabajados').fill('365');
  await page.locator('#calcularAguinaldoAntiguedad').click();
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: path.join(output, 'aguinaldo-antiguedad-desktop.png'), fullPage: false });

  await page.setViewportSize({ width: 390, height: 844 });
  await page.evaluate(() => window.scrollTo(0, 0));
  if (await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)) throw Error('Desbordamiento móvil');
  await page.screenshot({ path: path.join(output, 'aguinaldo-antiguedad-mobile.png'), fullPage: false });
  await page.locator('#calculadora-rapida').scrollIntoViewIfNeeded();
  await page.screenshot({ path: path.join(output, 'aguinaldo-antiguedad-calculator-mobile.png'), fullPage: false });
  await page.locator('#resultadoAguinaldoAntiguedad').screenshot({ path: path.join(output, 'aguinaldo-antiguedad-result-mobile.png') });
  await page.evaluate(() => { document.documentElement.dataset.theme = 'dark'; });
  if (await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)) throw Error('Desbordamiento oscuro');
  if (errors.length) throw Error(errors.join('\n'));
  console.log('Cálculo, SEO, schema, FAQ, escritorio y móvil: OK');
  await browser.close();
})().catch(error => { console.error(error); process.exit(1); });
