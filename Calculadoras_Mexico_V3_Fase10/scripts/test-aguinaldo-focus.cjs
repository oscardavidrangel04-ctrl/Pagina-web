const fs = require('fs');
const path = require('path');
const { chromium } = require('C:/Users/Casa/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');

(async () => {
  const root = path.resolve(__dirname, '..');
  const browser = await chromium.launch({ headless: true, channel: 'msedge' });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const pageErrors = [];

  page.on('pageerror', (error) => pageErrors.push(error.message));
  await page.route('**/*', async (route) => {
    const url = new URL(route.request().url());
    if (url.hostname !== 'local.test') return route.abort();
    const target = path.resolve(root, `.${decodeURIComponent(url.pathname)}`);
    if (!target.startsWith(`${root}${path.sep}`) || !fs.existsSync(target)) {
      return route.fulfill({ status: 404, body: '' });
    }
    const type = target.endsWith('.css') ? 'text/css'
      : target.endsWith('.js') ? 'application/javascript'
      : target.endsWith('.svg') ? 'image/svg+xml'
      : target.endsWith('.png') ? 'image/png'
      : target.endsWith('.html') ? 'text/html'
      : 'application/octet-stream';
    return route.fulfill({ contentType: type, body: fs.readFileSync(target) });
  });

  await page.goto('http://local.test/calculadoras/aguinaldo.html', { waitUntil: 'domcontentloaded' });
  await page.locator('#calculadora').waitFor();

  const title = await page.title();
  if (title.length < 45 || title.length > 65) throw new Error(`Title length: ${title.length}`);
  if (await page.locator('h1').count() !== 1) throw new Error('Debe existir un solo H1');
  if (await page.locator('h2').count() > 16) throw new Error('Demasiados H2');
  if (await page.locator('.faq-item').count() !== 10) throw new Error('FAQ visible no coincide');

  const dataCheck = await page.evaluate(() => {
    const schemas = [...document.querySelectorAll('script[type="application/ld+json"]')].map((node) => JSON.parse(node.textContent));
    const faq = schemas.find((schema) => schema['@type'] === 'FAQPage');
    const graph = schemas.find((schema) => Array.isArray(schema['@graph']))?.['@graph'] || [];
    const brokenAnchors = [...document.querySelectorAll('a[href^="#"]')]
      .map((link) => link.getAttribute('href').slice(1))
      .filter((id) => id && !document.getElementById(id));
    return {
      faqCount: faq?.mainEntity?.length || 0,
      hasWebApplication: graph.some((node) => node['@type'] === 'WebApplication'),
      brokenAnchors,
    };
  });
  if (dataCheck.faqCount !== 10) throw new Error('FAQ schema no coincide');
  if (!dataCheck.hasWebApplication) throw new Error('Falta WebApplication');
  if (dataCheck.brokenAnchors.length) throw new Error(`Anclas rotas: ${dataCheck.brokenAnchors.join(', ')}`);

  await page.locator('.calc-button').click();
  await page.locator('#resultado').waitFor();
  const result = await page.locator('#resultado').innerText();
  if (!result.includes('7,500')) throw new Error(`Resultado inesperado: ${result}`);

  await page.screenshot({ path: path.join(root, 'outputs/aguinaldo-focus-desktop.png'), fullPage: false });
  await page.locator('.faq-section').screenshot({ path: path.join(root, 'outputs/aguinaldo-focus-faq-desktop.png') });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.evaluate(() => window.scrollTo(0, 0));
  if (await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)) {
    throw new Error('Hay desbordamiento horizontal en móvil');
  }
  await page.screenshot({ path: path.join(root, 'outputs/aguinaldo-focus-mobile.png'), fullPage: false });
  await page.locator('.faq-section').screenshot({ path: path.join(root, 'outputs/aguinaldo-focus-faq-mobile.png') });

  if (pageErrors.length) throw new Error(pageErrors.join('\n'));
  console.log(JSON.stringify({ title, ...dataCheck, result: result.replace(/\s+/g, ' ').trim() }));
  await browser.close();
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
