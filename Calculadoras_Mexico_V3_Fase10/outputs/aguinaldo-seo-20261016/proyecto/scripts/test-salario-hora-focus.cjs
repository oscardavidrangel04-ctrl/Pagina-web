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

  await page.goto('http://local.test/calculadoras/salario-hora.html');
  if (await page.locator('h1').count() !== 1) throw Error('Debe existir un H1');
  if (await page.locator('h2').count() > 11) throw Error('Demasiados H2');
  const title = await page.title();
  if (title.length < 45 || title.length > 65 || !title.toLowerCase().includes('salario por hora')) throw Error('Title SEO fuera de rango');
  const description = await page.locator('meta[name="description"]').getAttribute('content');
  if (!description || description.length < 120 || description.length > 160) throw Error('Meta description fuera de rango');

  const schemas = await page.evaluate(() => Array.from(document.querySelectorAll('script[type="application/ld+json"]')).map(node => JSON.parse(node.textContent)));
  const schemaText = JSON.stringify(schemas);
  if (!schemaText.includes('WebApplication')) throw Error('Falta WebApplication');
  const faqSchema = schemas.find(item => item['@type'] === 'FAQPage');
  const visibleFaqs = await page.locator('.faq-section .faq-item').count();
  if (!faqSchema || faqSchema.mainEntity.length !== 10 || visibleFaqs !== 10) throw Error('FAQ visible y schema no coinciden');

  await page.locator('#salario').fill('15000');
  await page.locator('#horasSemana').fill('48');
  await page.locator('.calc-button').click();
  let result = await page.locator('#resultado').innerText();
  if (!result.includes('$72.12') || !result.includes('$15,000.00') || !result.includes('$180,000.00')) throw Error('Conversión mensual incorrecta');

  await page.locator('#periodoSalarioHora').selectOption('hora');
  await page.locator('#salario').fill('100');
  await page.locator('#horasSemana').fill('40');
  await page.locator('.calc-button').click();
  result = await page.locator('#resultado').innerText();
  if (!result.includes('$17,333.33') || !result.includes('$208,000.00')) throw Error('Conversión inversa incorrecta');

  const brokenAnchors = await page.evaluate(() => Array.from(document.querySelectorAll('a[href^="#"]')).map(a => a.getAttribute('href').slice(1)).filter(id => id && !document.getElementById(id)));
  if (brokenAnchors.length) throw Error('Anclas rotas: ' + brokenAnchors.join(','));
  await page.locator('#periodoSalarioHora').selectOption('mensual');
  await page.locator('#salario').fill('15000');
  await page.locator('#horasSemana').fill('48');
  await page.locator('.calc-button').click();
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: path.join(output, 'salario-hora-desktop.png'), fullPage: false });

  await page.setViewportSize({ width: 390, height: 844 });
  await page.evaluate(() => window.scrollTo(0, 0));
  if (await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)) throw Error('Desbordamiento móvil');
  await page.screenshot({ path: path.join(output, 'salario-hora-mobile.png'), fullPage: false });
  await page.locator('#calculadora').scrollIntoViewIfNeeded();
  await page.screenshot({ path: path.join(output, 'salario-hora-calculator-mobile.png'), fullPage: false });
  await page.locator('#resultado').screenshot({ path: path.join(output, 'salario-hora-result-mobile.png') });
  await page.evaluate(() => { document.documentElement.dataset.theme = 'dark'; });
  if (await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)) throw Error('Desbordamiento en modo oscuro');
  if (errors.length) throw Error(errors.join('\n'));
  console.log('Cálculos, SEO, schema, FAQ y vista móvil: OK');
  await browser.close();
})().catch(error => { console.error(error); process.exit(1); });
