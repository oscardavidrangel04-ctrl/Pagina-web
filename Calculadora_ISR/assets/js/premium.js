
(() => {
  'use strict';

  const STORAGE = {
    favorites: 'cm-favorites-v1',
    history: 'cm-history-v1'
  };

  const readJSON = (key, fallback = []) => {
    try {
      const value = JSON.parse(localStorage.getItem(key));
      return Array.isArray(value) ? value : fallback;
    } catch {
      return fallback;
    }
  };

  const writeJSON = (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  };

  const cleanText = value => String(value || '').replace(/\s+/g, ' ').trim();

  const moneyValue = value => {
    const raw = cleanText(value)
      .replace(/[^\d,.\-]/g, '')
      .replace(/,/g, '');
    const number = Number(raw);
    return Number.isFinite(number) ? number : null;
  };

  const toast = message => {
    let node = document.querySelector('.premium-toast');
    if (!node) {
      node = document.createElement('div');
      node.className = 'premium-toast';
      node.setAttribute('role', 'status');
      node.setAttribute('aria-live', 'polite');
      document.body.appendChild(node);
    }
    node.textContent = message;
    node.classList.add('show');
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => node.classList.remove('show'), 2400);
  };

  const currentCalculator = () => {
    const title = cleanText(document.querySelector('h1')?.textContent) || document.title;
    return {
      id: document.body.dataset.calc || location.pathname.split('/').pop().replace('.html', ''),
      title,
      url: location.pathname
    };
  };

  const favoriteButton = () => {
    const head = document.querySelector('.page-head');
    if (!head || document.querySelector('[data-favorite-calculator]')) return;

    const calc = currentCalculator();
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'favorite-button';
    button.dataset.favoriteCalculator = calc.id;

    const update = () => {
      const favorites = readJSON(STORAGE.favorites);
      const active = favorites.some(item => item.id === calc.id);
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
      button.innerHTML = active ? '<span>★</span> Guardada' : '<span>☆</span> Guardar favorita';
    };

    button.addEventListener('click', () => {
      const favorites = readJSON(STORAGE.favorites);
      const index = favorites.findIndex(item => item.id === calc.id);
      if (index >= 0) {
        favorites.splice(index, 1);
        toast('Calculadora eliminada de favoritas');
      } else {
        favorites.unshift(calc);
        toast('Calculadora guardada en favoritas');
      }
      writeJSON(STORAGE.favorites, favorites.slice(0, 20));
      update();
      window.dispatchEvent(new CustomEvent('cm:favorites'));
    });

    head.appendChild(button);
    update();
  };

  const extractRows = result => [...result.querySelectorAll('.result-row')].map(row => ({
    label: cleanText(row.querySelector('strong')?.textContent),
    value: cleanText(row.querySelector('span')?.textContent),
    total: row.classList.contains('total')
  })).filter(row => row.label && row.value);

  const chartRows = rows => rows
    .map(row => ({...row, number: moneyValue(row.value)}))
    .filter(row => row.number !== null && row.number >= 0)
    .slice(0, 6);

  const renderChart = (container, rows) => {
    const data = chartRows(rows);
    if (data.length < 2) {
      container.hidden = true;
      return;
    }
    const max = Math.max(...data.map(item => item.number), 1);
    container.hidden = false;
    container.innerHTML = `
      <div class="premium-chart-head">
        <strong>Comparación visual</strong>
        <span>Importes del resultado</span>
      </div>
      <div class="premium-bars">
        ${data.map(item => {
          const width = Math.max(5, (item.number / max) * 100);
          return `<div class="premium-bar-row">
            <div class="premium-bar-label"><span>${item.label}</span><b>${item.value}</b></div>
            <div class="premium-bar-track"><i style="width:${width.toFixed(2)}%"></i></div>
          </div>`;
        }).join('')}
      </div>`;
  };

  const saveResult = rows => {
    if (!rows.length) return toast('Primero realiza un cálculo');
    const calc = currentCalculator();
    const history = readJSON(STORAGE.history);
    history.unshift({
      id: `${Date.now()}-${calc.id}`,
      calculatorId: calc.id,
      title: calc.title,
      url: calc.url,
      date: new Date().toISOString(),
      rows
    });
    writeJSON(STORAGE.history, history.slice(0, 30));
    toast('Resultado guardado en este navegador');
    renderHistory();
  };

  const copyResult = async rows => {
    if (!rows.length) return toast('Primero realiza un cálculo');
    const calc = currentCalculator();
    const text = [
      calc.title,
      ...rows.map(row => `${row.label}: ${row.value}`),
      'Resultado informativo de Calculadoras México.'
    ].join('\n');
    try {
      await navigator.clipboard.writeText(text);
      toast('Resultado copiado');
    } catch {
      const area = document.createElement('textarea');
      area.value = text;
      document.body.appendChild(area);
      area.select();
      document.execCommand('copy');
      area.remove();
      toast('Resultado copiado');
    }
  };

  const printResult = rows => {
    if (!rows.length) return toast('Primero realiza un cálculo');
    document.body.classList.add('printing-result');
    const printDate = new Intl.DateTimeFormat('es-MX', {
      dateStyle: 'long',
      timeStyle: 'short'
    }).format(new Date());
    document.body.dataset.printDate = printDate;
    const pageHead = document.querySelector('.page-head');
    if (pageHead) pageHead.dataset.printDate = printDate;
    setTimeout(() => window.print(), 80);
  };

  const installResultTools = result => {
    if (result.dataset.premiumReady === 'true') return;
    result.dataset.premiumReady = 'true';

    const shell = document.createElement('div');
    shell.className = 'premium-result-shell';
    result.parentNode.insertBefore(shell, result);
    shell.appendChild(result);

    const chart = document.createElement('section');
    chart.className = 'premium-chart';
    chart.hidden = true;
    shell.appendChild(chart);

    const toolbar = document.createElement('div');
    toolbar.className = 'result-toolbar';
    toolbar.setAttribute('aria-label', 'Acciones del resultado');
    toolbar.innerHTML = `
      <button type="button" data-result-action="save" title="Guardar en este navegador"><span>♡</span> Guardar</button>
      <button type="button" data-result-action="copy" title="Copiar resultado"><span>⧉</span> Copiar</button>
      <button type="button" data-result-action="print" title="Imprimir o guardar como PDF"><span>⇩</span> PDF</button>`;
    shell.appendChild(toolbar);

    const refresh = () => {
      const rows = extractRows(result);
      shell.classList.toggle('has-data', rows.length > 0);
      renderChart(chart, rows);
    };

    toolbar.addEventListener('click', event => {
      const button = event.target.closest('[data-result-action]');
      if (!button) return;
      const rows = extractRows(result);
      const action = button.dataset.resultAction;
      if (action === 'save') saveResult(rows);
      if (action === 'copy') copyResult(rows);
      if (action === 'print') printResult(rows);
    });

    new MutationObserver(refresh).observe(result, {childList: true, subtree: true, characterData: true});
    refresh();
  };

  const historyPanel = () => {
    if (document.querySelector('.history-panel')) return;
    const panel = document.createElement('aside');
    panel.className = 'history-panel';
    panel.setAttribute('aria-hidden', 'true');
    panel.innerHTML = `
      <div class="history-panel-head">
        <div><small>Guardados localmente</small><h2>Mis resultados</h2></div>
        <button type="button" class="history-close" aria-label="Cerrar historial">×</button>
      </div>
      <div class="history-list"></div>
      <div class="history-panel-foot">
        <button type="button" class="history-clear">Borrar historial</button>
      </div>`;
    document.body.appendChild(panel);

    panel.querySelector('.history-close').addEventListener('click', () => toggleHistory(false));
    panel.querySelector('.history-clear').addEventListener('click', () => {
      writeJSON(STORAGE.history, []);
      renderHistory();
      toast('Historial eliminado');
    });

    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') toggleHistory(false);
    });
  };

  const toggleHistory = open => {
    const panel = document.querySelector('.history-panel');
    if (!panel) return;
    panel.classList.toggle('open', open);
    panel.setAttribute('aria-hidden', String(!open));
    document.body.classList.toggle('history-open', open);
    if (open) renderHistory();
  };

  const renderHistory = () => {
    const list = document.querySelector('.history-list');
    if (!list) return;
    const history = readJSON(STORAGE.history);
    if (!history.length) {
      list.innerHTML = '<div class="history-empty"><span>🗂️</span><strong>Aún no guardas resultados</strong><p>Haz un cálculo y presiona “Guardar”.</p></div>';
      return;
    }
    list.innerHTML = history.map(item => `
      <article class="history-item">
        <div class="history-item-top">
          <div><small>${new Intl.DateTimeFormat('es-MX', {dateStyle:'medium', timeStyle:'short'}).format(new Date(item.date))}</small>
          <h3>${item.title}</h3></div>
          <button type="button" data-delete-history="${item.id}" aria-label="Eliminar resultado">×</button>
        </div>
        <div class="history-values">
          ${item.rows.slice(0, 4).map(row => `<div><span>${row.label}</span><b>${row.value}</b></div>`).join('')}
        </div>
        <a href="${item.url}">Abrir calculadora →</a>
      </article>`).join('');

    list.querySelectorAll('[data-delete-history]').forEach(button => {
      button.addEventListener('click', () => {
        const next = readJSON(STORAGE.history).filter(item => item.id !== button.dataset.deleteHistory);
        writeJSON(STORAGE.history, next);
        renderHistory();
      });
    });
  };

  const historyButton = () => {
    const actions = document.querySelector('.header-actions');
    if (!actions || document.querySelector('[data-history-open]')) return;
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'icon-button';
    button.dataset.historyOpen = '';
    button.setAttribute('aria-label', 'Abrir resultados guardados');
    button.title = 'Resultados guardados';
    button.textContent = '◷';
    button.addEventListener('click', () => toggleHistory(true));
    const menu = actions.querySelector('[data-menu-toggle]');
    actions.insertBefore(button, menu || null);
  };

  const favoritesDashboard = () => {
    const target = document.querySelector('[data-favorites-dashboard]');
    if (!target) return;
    const favorites = readJSON(STORAGE.favorites);
    if (!favorites.length) {
      target.innerHTML = '<div class="favorites-empty"><span>☆</span><div><strong>Todavía no tienes favoritas</strong><p>Abre una calculadora y presiona “Guardar favorita”.</p></div></div>';
      return;
    }
    target.innerHTML = favorites.map(item => `
      <a class="favorite-card" href="${item.url}">
        <span>★</span><div><strong>${item.title}</strong><small>Abrir calculadora</small></div><b>→</b>
      </a>`).join('');
  };

  const afterPrint = () => document.body.classList.remove('printing-result');

  document.addEventListener('DOMContentLoaded', () => {
    historyPanel();
    historyButton();
    favoriteButton();
    document.querySelectorAll('.result').forEach(installResultTools);
    favoritesDashboard();
    window.addEventListener('afterprint', afterPrint);
    window.addEventListener('cm:favorites', favoritesDashboard);
  });
})();
