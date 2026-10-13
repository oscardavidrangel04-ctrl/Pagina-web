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

  await page.locator('[data-aguinaldo-days-preset="180"]').click();
  await page.locator('.calc-button').click();
  if (!(await page.locator('#resultado').innerText()).includes('3,698.63')) throw new Error('Proporcional de 180 días incorrecto');
  await page.locator('[data-aguinaldo-days-preset="365"]').click();
  await page.locator('#salario').fill('12000');
  await page.locator('.calc-button').click();
  if (!(await page.locator('#resultado').innerText()).includes('6,000')) throw new Error('Ejemplo de 12000 incorrecto');
  await page.locator('#salario').fill('15000');
  await page.locator('.calc-button').click();
  const faqMatches = await page.evaluate(() => {
    const schema = [...document.querySelectorAll('script[type="application/ld+json"]')].map(n => JSON.parse(n.textContent)).find(s => s['@type'] === 'FAQPage');
    return schema.mainEntity.every(q => [...document.querySelectorAll('.faq-item')].some(el => el.querySelector('summary').textContent.trim() === q.name && el.querySelector('p').textContent.trim() === q.acceptedAnswer.text));
  });
  if (!faqMatches) throw new Error('FAQ visible distinta de datos estructurados');

  // Each period represents the same daily salary of 500 pesos.
  for (const [period, salary] of [['quincenal','7500'],['semanal','3500'],['diario','500']]) {
    await page.locator('#periodoSalario').selectOption(period);
    await page.locator('#salario').fill(salary);
    await page.locator('.calc-button').click();
    if (!(await page.locator('#resultado').innerText()).includes('7,500.00')) throw new Error(`Conversión incorrecta: ${period}`);
  }
  // A table example must restore ALL its stated assumptions, including salary type.
  await page.locator('#tipoSalario').selectOption('variable');
  await page.locator('#ingresoVariable30').fill('30000');
  await page.locator('#diasAguinaldo').fill('30');
  await page.locator('button[data-aguinaldo-example-days="240"]').click();
  if (await page.locator('#tipoSalario').inputValue() !== 'fijo') throw new Error('Ejemplo no restaura salario fijo');
  if (await page.locator('#diasAguinaldo').inputValue() !== '15') throw new Error('Ejemplo no restaura prestación');
  await page.locator('.calc-button').click();
  if (!(await page.locator('#resultado').innerText()).includes('4,931.51')) throw new Error('Ejemplo de ocho meses incorrecto');
  await page.locator('button[data-aguinaldo-example-salary="12000"]').focus();
  await page.keyboard.press('Enter');
  await page.locator('.calc-button').click();
  if (!(await page.locator('#resultado').innerText()).includes('6,000.00')) throw new Error('Ejemplo de teclado incorrecto');
  await page.locator('#salario').fill('15000');
  await page.locator('#modoAguinaldo').selectOption('fechas');
  for (const [start,end] of [['2025-01-01','2025-12-31'],['2027-01-01','2027-12-31'],['2027-12-31','2027-01-01']]) {
    await page.locator('#fechaInicio').fill(start);
    await page.locator('#fechaFin').fill(end);
    await page.locator('.calc-button').click();
    if (!(await page.locator('#resultado').innerText()).match(/2026|anterior/)) throw new Error('Falta error de fechas');
    const scenario = await page.evaluate(() => window.CMAguinaldo.getScenario());
    if (!scenario.error) throw new Error('Periodo inválido aceptado');
  }
  await page.locator('#fechaInicio').fill('2026-07-01');
  await page.locator('#fechaFin').fill('2026-12-31');
  await page.locator('.calc-button').click();
  if (!(await page.locator('#resultado').innerText()).includes('3,780.82')) throw new Error('Conteo inclusivo por fechas incorrecto');
  await page.locator('#fechaInicio').fill('2025-12-01');
  await page.locator('.calc-button').click();
  if (!(await page.locator('#resultado').innerText()).includes('7,500.00')) throw new Error('Recorte al año incorrecto');
  await page.locator('#salarioOrdinarioMensual').fill('15000');
  await page.locator('[data-aguinaldo-tax-calc]').click();
  const tax = await page.locator('[data-aguinaldo-tax-result]').innerText();
  if (!tax.includes('3,519.30') || !tax.includes('713.34') || !tax.includes('6,786.66')) throw new Error(`Desglose fiscal inesperado: ${tax}`);

  const localCheck = await page.evaluate(() => {
    const ids = [...document.querySelectorAll('[id]')].map(el => el.id);
    return { duplicates:ids.filter((id,i)=>ids.indexOf(id)!==i), links:[...document.querySelectorAll('a[href]')].map(a=>new URL(a.href)).filter(u=>u.hostname==='local.test').map(u=>u.pathname), canonical:document.querySelector('link[rel="canonical"]').href };
  });
  if (localCheck.duplicates.length) throw new Error(`IDs duplicados: ${localCheck.duplicates}`);
  if (localCheck.canonical !== 'https://calculadora-isr-mexico.vercel.app/calculadoras/aguinaldo.html') throw new Error('Canonical incorrecto');
  for (const href of new Set(localCheck.links)) {
    const file = path.join(root, href === '/' ? 'index.html' : href);
    if (!fs.existsSync(file)) throw new Error(`Destino interno inexistente: ${href}`);
  }

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
  await page.setViewportSize({width:320,height:780});
  await page.evaluate(() => document.documentElement.dataset.theme='dark');
  if (await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)) throw new Error('Desbordamiento a 320px');
  await page.locator('#aguinaldo-por-meses').scrollIntoViewIfNeeded();
  await page.screenshot({path:path.join(root,'outputs/aguinaldo-gsc-table-mobile.png')});
  if (await page.locator('img[src*="aguinaldo-formula-guia"],img[src*="aguinaldo-proporcional-guia"]').count()) throw new Error('Ilustraciones redundantes aún presentes');
  console.log(JSON.stringify({ title, ...dataCheck, result: result.replace(/\s+/g, ' ').trim() }));
  await browser.close();
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
