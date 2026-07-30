
(() => {
  'use strict';

  const qs = (selector, root = document) => root.querySelector(selector);
  const qsa = (selector, root = document) => [...root.querySelectorAll(selector)];

  const setReducedMotion = () => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.documentElement.dataset.reducedMotion = reduced ? 'true' : 'false';
  };

  const enhanceMenu = () => {
    const toggle = qs('[data-menu-toggle]');
    const nav = qs('.main-nav');
    if (!toggle || !nav) return;

    toggle.setAttribute('aria-controls', nav.id || 'navegacion-principal');
    if (!nav.id) nav.id = 'navegacion-principal';

    const sync = () => {
      const expanded = nav.classList.contains('open') || nav.classList.contains('active');
      toggle.setAttribute('aria-expanded', String(expanded));
    };

    sync();
    toggle.addEventListener('click', () => requestAnimationFrame(sync));

    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') {
        nav.classList.remove('open', 'active');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.focus();
      }
    });
  };

  const enhanceThemeButton = () => {
    const button = qs('[data-theme-toggle]');
    if (!button) return;

    const sync = () => {
      const dark = document.documentElement.dataset.theme === 'dark';
      button.setAttribute('aria-pressed', String(dark));
      button.setAttribute('aria-label', dark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro');
      button.title = dark ? 'Modo claro' : 'Modo oscuro';
    };

    sync();
    button.addEventListener('click', () => requestAnimationFrame(sync));
  };

  const improveTables = () => {
    qsa('table').forEach(table => {
      if (table.parentElement?.classList.contains('table-scroll')) return;
      const wrapper = document.createElement('div');
      wrapper.className = 'table-scroll';
      wrapper.setAttribute('role', 'region');
      wrapper.setAttribute('aria-label', 'Tabla desplazable');
      wrapper.tabIndex = 0;
      table.parentNode.insertBefore(wrapper, table);
      wrapper.appendChild(table);
    });
  };

  const improveForms = () => {
    qsa('form').forEach(form => {
      form.setAttribute('novalidate', '');
      form.addEventListener('submit', event => {
        const invalid = qsa(':invalid', form)[0];
        if (!invalid) return;
        event.preventDefault();
        invalid.focus();
        invalid.setAttribute('aria-invalid', 'true');

        let message = form.querySelector('.form-error-summary');
        if (!message) {
          message = document.createElement('div');
          message.className = 'form-error-summary';
          message.setAttribute('role', 'alert');
          form.prepend(message);
        }
        message.textContent = 'Revisa los campos marcados antes de continuar.';
      });
    });

    qsa('input, select, textarea').forEach(field => {
      field.addEventListener('input', () => field.removeAttribute('aria-invalid'));
      field.addEventListener('change', () => field.removeAttribute('aria-invalid'));
    });
  };

  const improveSearchDialog = () => {
    const dialog = qs('.search-dialog');
    if (!dialog) return;

    dialog.setAttribute('role', 'dialog');
    dialog.setAttribute('aria-modal', 'true');
    dialog.setAttribute('aria-label', 'Buscar en Calculadoras México');

    const input = qs('input', dialog);
    const close = qs('[data-search-close]', dialog);

    const observer = new MutationObserver(() => {
      const open = !dialog.hidden && getComputedStyle(dialog).display !== 'none';
      dialog.setAttribute('aria-hidden', String(!open));
      if (open) requestAnimationFrame(() => input?.focus());
    });

    observer.observe(dialog, {attributes: true, attributeFilter: ['class', 'style', 'hidden']});

    dialog.addEventListener('keydown', event => {
      if (event.key === 'Escape') close?.click();
    });
  };

  const markExternalLinks = () => {
    qsa('a[target="_blank"]').forEach(link => {
      if (link.querySelector('.sr-only')) return;
      const note = document.createElement('span');
      note.className = 'sr-only';
      note.textContent = ' (abre en una pestaña nueva)';
      link.appendChild(note);
    });
  };

  const lazyEnhancements = () => {
    if (!('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, {rootMargin: '120px 0px', threshold: 0.01});

    qsa('.card, .trust-item, .category-tile, .content-box').forEach(element => {
      element.classList.add('reveal-ready');
      observer.observe(element);
    });
  };

  document.addEventListener('DOMContentLoaded', () => {
    setReducedMotion();
    enhanceMenu();
    enhanceThemeButton();
    improveTables();
    improveForms();
    improveSearchDialog();
    markExternalLinks();
    lazyEnhancements();
  });

  window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener?.('change', setReducedMotion);
})();
