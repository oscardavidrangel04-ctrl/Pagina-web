const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const runtimeModules = path.join(os.homedir(), '.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules');
const { chromium } = require(require.resolve('playwright', { paths: [__dirname, runtimeModules] }));
const root = path.resolve(__dirname, '..');
const pagePath = '/calculadoras/subsidio-empleo.html';

async function comprobar() {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.route('**/*', route => {
      const url = new URL(route.request().url());
      if (url.origin !== 'http://local.test') return route.abort();
      if (url.pathname === pagePath || url.pathname === '/styles-v5628.css') {
        const type = url.pathname.endsWith('.css') ? 'text/css' : 'text/html; charset=utf-8';
        return route.fulfill({ contentType: type, body: fs.readFileSync(path.join(root, url.pathname)) });
      }
      return route.fulfill({ status: 404 });
    });

    await page.goto('http://local.test' + pagePath);
    const ingreso = page.getByLabel('Ingreso gravado del mes');
    const isr = page.getByLabel('ISR mensual antes del subsidio');
    const periodo = page.getByLabel('Periodo de la nómina');
    const calcular = page.getByRole('button', { name: 'Calcular subsidio' });
    const resultado = page.getByRole('status');
    assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'), 'https://calculadora-isr-mexico.vercel.app' + pagePath);

    const casos = [
      ['enero', '11492.66', '650', '$536.21', '$536.21', '$113.79'],
      ['febrero-diciembre', '11492.66', '535.65', '$535.65', '$535.65', '$0.00'],
      ['febrero-diciembre', '10500', '650', '$535.65', '$535.65', '$114.35'],
      ['febrero-diciembre', '10500', '300', '$535.65', '$300.00', '$0.00'],
      ['enero', '10500', '0.01', '$536.21', '$0.01', '$0.00'],
      ['febrero-diciembre', '10500', '0', '$535.65', '$0.00', '$0.00']
    ];
    for (const [mes, base, impuesto, cuota, aplicado, restante] of casos) {
      await periodo.selectOption(mes);
      await ingreso.fill(base);
      await isr.fill(impuesto);
      await isr.press('Enter');
      const texto = await resultado.innerText();
      assert.ok(texto.includes('cuota máxima del periodo es ' + cuota), texto);
      assert.ok(texto.includes('Subsidio aplicable: ' + aplicado), texto);
      assert.ok(texto.includes('ISR después del subsidio: ' + restante), texto);
    }

    await isr.fill('');
    assert.equal(await resultado.innerText(), '');
    await calcular.click();
    const referencia = await resultado.innerText();
    assert.ok(referencia.includes('$535.65') && referencia.includes('Ingresa el ISR'));
    assert.ok(!referencia.includes('Subsidio aplicable:'));

    await ingreso.fill('11492.67');
    await calcular.click();
    assert.match(await resultado.innerText(), /supera el límite de \$11,492\.66.*\$0\.00/);
    await ingreso.fill('0');
    await calcular.click();
    assert.match(await resultado.innerText(), /Sin ingreso gravado.*\$0\.00/);

    for (const invalido of ['', '-1', '0.001']) {
      await ingreso.fill(invalido);
      await calcular.click();
      assert.equal(await ingreso.evaluate(input => input.validity.valid), false);
      assert.equal(await resultado.innerText(), '');
    }
    await ingreso.fill('10500');
    await isr.fill('-1');
    await calcular.click();
    assert.equal(await isr.evaluate(input => input.validity.valid), false);
    assert.equal(await resultado.innerText(), '');
    assert.deepEqual(errors, []);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    console.log('OK: subsidio 2026, parámetros por mes, tope inclusivo, impuesto, validación, teclado y vista móvil.');
  } finally {
    await browser.close();
  }
}

comprobar().catch(error => { console.error(error); process.exitCode = 1; });
