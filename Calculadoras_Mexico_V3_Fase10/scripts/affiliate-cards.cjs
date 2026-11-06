'use strict';
// Static, reusable HTML: no browser-time insertion, redirects or ad SDK.
const programs = {
  aliexpress: {
    name: 'AliExpress',
    href: 'https://rzekl.com/g/qpw0xm1c34934a2368b316525dc3e8/?i=4',
    image: 'https://ad.admitad.com/b/qpw0xm1c34934a2368b316525dc3e8/',
    title: 'Descubre ofertas en AliExpress',
    description: 'Explora productos de tecnología, hogar y accesorios disponibles en AliExpress. Revisa el precio final, el envío y las condiciones antes de comprar.',
    button: 'Ver ofertas en AliExpress',
    note: 'Los precios y la disponibilidad se consultan en AliExpress.'
  },
  solcredito: {
    name: 'Sol Crédito MX',
    href: 'https://dkfrh.com/g/9k0cwagbas934a2368b3bd6fe4c78f/?i=4',
    image: 'https://ad.admitad.com/b/9k0cwagbas934a2368b3bd6fe4c78f/',
    title: '¿Buscas opciones de crédito?',
    description: 'Conoce Sol Crédito, un buscador de ofertas de préstamos. Revisa las condiciones de cada entidad antes de solicitar un crédito.',
    button: 'Conocer Sol Crédito',
    note: 'Sol Crédito es un intermediario, no una entidad financiera. Compara el CAT, el costo total y tu capacidad de pago. Consultar opciones no garantiza aprobación.'
  }
};
const placements = [
  ['index.html', 'aliexpress', 'home-popular'],
  ['calculadoras/descuento.html', 'aliexpress', 'after-guide'],
  ['calculadoras/precio-sin-descuento.html', 'aliexpress', 'after-guide'],
  ['calculadoras/costo-unidad.html', 'aliexpress', 'after-guide'],
  ['calculadoras/iva.html', 'aliexpress', 'after-guide'],
  ['calculadoras/iva-incluido.html', 'aliexpress', 'after-guide'],
  ['calculadoras/prestamo.html', 'solcredito', 'after-guide'],
  ['articulos/costo-total-prestamo-como-calcular.html', 'solcredito', 'after-article'],
  ['articulos/tabla-amortizacion-prestamo-como-leerla.html', 'solcredito', 'after-article'],
  ['articulos/tasa-fija-vs-tasa-variable-prestamo.html', 'solcredito', 'after-article'],
  ['articulos/credito-revolvente-vs-prestamo-personal.html', 'solcredito', 'after-article']
];
function render(program, placement) {
  const p = programs[program];
  if (!p || !['home-popular', 'after-guide', 'after-article'].includes(placement)) throw Error('Unknown affiliate placement');
  return `<!-- affiliate-card:start -->
<aside class="affiliate-card" data-affiliate="${program}" data-placement="${placement}" data-variant="contextual-v1" aria-labelledby="affiliate-title-${program}">
  <div class="affiliate-card__inner">
    <a class="affiliate-card__banner" data-affiliate-link="banner" href="${p.href}" target="_blank" rel="sponsored nofollow noopener" aria-label="Publicidad de ${p.name}: visitar sitio externo en una pestaña nueva" aria-describedby="affiliate-disclosure-${program}">
      <img src="${p.image}" width="300" height="250" loading="lazy" decoding="async" fetchpriority="low" alt="Publicidad de ${p.name}">
    </a>
    <div class="affiliate-card__content">
      <p class="affiliate-card__label">Publicidad · ${p.name}</p>
      <h2 id="affiliate-title-${program}">${p.title}</h2>
      <p>${p.description}</p>
      <a class="affiliate-card__cta" data-affiliate-link="button" href="${p.href}" target="_blank" rel="sponsored nofollow noopener" aria-describedby="affiliate-disclosure-${program}">${p.button} <svg aria-hidden="true" focusable="false" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6 3h7v7M13 3 3 13"/></svg><span class="affiliate-card__sr-only"> (abre una pestaña nueva)</span></a>
      <p class="affiliate-card__note">${p.note}</p>
      <p class="affiliate-card__disclosure" id="affiliate-disclosure-${program}">Enlace de afiliado. Podemos recibir una comisión si realizas una acción válida, sin costo adicional por usar este enlace.</p>
    </div>
  </div>
</aside>
<!-- affiliate-card:end -->`;
}
module.exports = {programs, placements, render};
