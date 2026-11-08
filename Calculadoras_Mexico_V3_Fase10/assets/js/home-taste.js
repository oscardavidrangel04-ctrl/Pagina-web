/* Progressive home finder: the GET form and static links work without this script.
   No financial input, analytics, third-party request or calculator formula here. */
(() => {
  'use strict';
  const form = document.querySelector('[data-taste-finder]');
  if (!form) return;
  // The mobile menu covers the page. Keep keyboard focus in its visible controls.
  const menu = document.querySelector('.main-nav');
  const menuToggle = document.querySelector('[data-menu-toggle]');
  menuToggle?.addEventListener('click', () => {
    // Shared listeners toggle the menu later in this same click dispatch.
    requestAnimationFrame(() => { if (menu?.classList.contains('open')) menu.querySelector('a')?.focus(); });
  });
  document.addEventListener('keydown', event => {
    if (event.key !== 'Tab' || !menu?.classList.contains('open') || document.body.classList.contains('cm-search-open')) return;
    const controls = [menuToggle, ...menu.querySelectorAll('a[href]')];
    const index = controls.indexOf(document.activeElement);
    const next = index < 0 ? (event.shiftKey ? controls.length - 1 : 0)
      : (index + (event.shiftKey ? -1 : 1) + controls.length) % controls.length;
    event.preventDefault();
    controls[next].focus();
  });
  const input = form.querySelector('input');
  const results = document.getElementById('taste-results');
  const count = document.querySelector('[data-taste-count]');
  const all = document.querySelector('[data-taste-all]');
  const catalog = globalThis.CM_CATALOG;
  if (!Array.isArray(catalog) || !catalog.length) return;
  const normalize = value => String(value).normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
  const initial = ['salario-diario', 'pago-quincenal', 'aguinaldo', 'finiquito'];
  let timer;
  function render() {
    const query = normalize(input.value.trim());
    const found = query ? catalog.filter(item => {
      // Match the full catalog's data-search contract so its GET result agrees.
      const text = normalize(`${item.title} ${item.description} ${item.category}`);
      return text.includes(query);
    }) : initial.map(slug => catalog.find(item => item.slug === slug)).filter(Boolean);
    const fragment = document.createDocumentFragment();
    for (const item of found.slice(0, 4)) {
      const link = document.createElement('a');
      link.className = 'taste-result';
      link.href = `/calculadoras/${item.slug}.html`;
      const mark = document.createElement('span');
      mark.className = 'taste-result-mark';
      mark.setAttribute('aria-hidden', 'true');
      mark.textContent = '→';
      const text = document.createElement('span');
      const title = document.createElement('strong');
      title.textContent = item.title;
      const description = document.createElement('small');
      description.textContent = item.description;
      text.append(title, description);
      const category = document.createElement('span');
      category.className = 'taste-result-category';
      category.textContent = item.category;
      link.append(mark, text, category);
      fragment.append(link);
    }
    if (!found.length) {
      const empty = document.createElement('p');
      empty.className = 'taste-empty';
      empty.textContent = 'No encontramos esa calculadora. Prueba con “salario”, “IVA”, “ahorro” o consulta el catálogo completo.';
      fragment.append(empty);
    }
    results.replaceChildren(fragment);
    count.textContent = query ? `${found.length} ${found.length === 1 ? 'resultado' : 'resultados'}` : '';
    all.href = query ? `/calculadoras.html?q=${encodeURIComponent(input.value.trim())}` : '/calculadoras.html';
  }
  input.addEventListener('input', () => { clearTimeout(timer); timer = setTimeout(render, 100); });
  input.addEventListener('keydown', event => {
    if (event.key === 'ArrowDown') {
      clearTimeout(timer); render();
      const first = results.querySelector('a');
      if (first) { event.preventDefault(); first.focus(); }
    }
  });
  // Keep Enter's native GET submission: visitors can inspect all matches.
})();
