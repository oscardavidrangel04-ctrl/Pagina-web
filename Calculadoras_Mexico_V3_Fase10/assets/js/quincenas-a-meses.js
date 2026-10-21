(() => {
  'use strict';
  const form = document.getElementById('duration-form');
  if (!form) return;
  const input = document.getElementById('quincenas');
  const error = document.getElementById('duration-error');
  const result = document.getElementById('duration-result');
  const number = new Intl.NumberFormat('es-MX', { maximumFractionDigits: 6 });
  function calculate() {
    const value = input.valueAsNumber;
    if (input.value.trim() === '' || !Number.isFinite(value) || value < 0 || value > 1000000000) {
      error.textContent = 'Introduce un número de quincenas entre 0 y 1,000,000,000.';
      input.setAttribute('aria-invalid', 'true');
      result.replaceChildren();
      input.focus();
      return;
    }
    error.textContent = '';
    input.removeAttribute('aria-invalid');
    const q = number.format(value), m = number.format(value / 2), y = number.format(value / 24);
    const monthLabel = value / 2 === 1 ? 'mes' : 'meses';
    const yearLabel = value / 24 === 1 ? 'año' : 'años';
    const heading = document.createElement('h3');
    heading.textContent = `Equivalencia de ${q} quincenas`;
    const total = document.createElement('p');
    total.className = 'duration-total';
    const months = document.createElement('strong');
    months.textContent = `${m} ${monthLabel}`;
    total.append(months, ` · ${y} ${yearLabel}`);
    const explanation = document.createElement('p');
    explanation.textContent = `${q} ÷ 2 = ${m} ${monthLabel}. ${q} ÷ 24 = ${y} ${yearLabel}. Valores mostrados con hasta seis decimales.`;
    result.replaceChildren(heading, total, explanation);
  }
  form.addEventListener('submit', event => { event.preventDefault(); calculate(); });
  form.addEventListener('reset', () => {
    // Wait until the browser restores the HTML default.
    setTimeout(calculate, 0);
  });
  input.addEventListener('input', () => {
    input.removeAttribute('aria-invalid');
    error.textContent = '';
    result.textContent = 'Pulsa Convertir plazo para actualizar el resultado.';
  });
  form.querySelectorAll('[data-quincenas]').forEach(button => {
    button.addEventListener('click', () => {
      input.value = button.dataset.quincenas;
      calculate();
    });
  });
})();
