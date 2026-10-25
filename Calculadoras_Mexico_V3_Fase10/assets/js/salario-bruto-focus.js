/* Page-only controls. The shared calculator still performs net + deductions. */
document.addEventListener('DOMContentLoaded', () => {
  if (document.body.dataset.calc !== 'salario-bruto') return;
  const box = document.getElementById('calculadora');
  const net = document.getElementById('neto');
  const deductions = document.getElementById('deducciones');
  const period = document.getElementById('sbPeriodo');
  const note = document.getElementById('sbPeriodResult');
  const exampleState = document.getElementById('sbExampleState');
  const button = box.querySelector('.calc-button');
  const result = document.getElementById('resultado');
  const periods = ['mensual', 'quincenal', 'semanal'];
  const invalidateResult = () => {
    note.hidden = true;
    delete result.dataset.ready;
    result.textContent = 'Completa los datos y presiona Calcular para actualizar el resultado.';
  };

  button.addEventListener('click', event => {
    const invalid = [net, deductions].find(field =>
      field.value.trim() === '' || !Number.isFinite(Number(field.value)) ||
      Number(field.value) < 0 || (field === net && Number(field.value) === 0));
    if (invalid) {
      event.stopImmediatePropagation();
      result.textContent = 'Introduce un neto mayor que cero y deducciones no negativas. Usa 0 si no hay descuentos.';
      delete result.dataset.ready;
      invalid.setAttribute('aria-invalid', 'true');
      note.hidden = true;
      invalid.focus();
      return;
    }
    [net, deductions].forEach(field => field.removeAttribute('aria-invalid'));
    note.textContent = `Importes del periodo ${period.value}. El bruto se reconstruye con las deducciones capturadas; no se han calculado retenciones fiscales.`;
    note.hidden = false;
  }, true);

  document.addEventListener('click', event => {
    const example = event.target.closest('[data-sb-example]');
    if (!example) return;
    const [periodValue, netValue, deductionsValue] = example.dataset.sbExample.split(',');
    if (!periods.includes(periodValue) || !Number.isFinite(Number(netValue)) ||
        Number(netValue) <= 0 || !Number.isFinite(Number(deductionsValue)) || Number(deductionsValue) < 0) return;
    period.value = periodValue;
    net.value = netValue;
    deductions.value = deductionsValue;
    [net, deductions].forEach(field => field.dispatchEvent(new Event('input', {bubbles:true})));
    period.dispatchEvent(new Event('change', {bubbles:true}));
    exampleState.textContent = 'Ejemplo cargado con deducciones hipotéticas. Edita las cantidades para comprobar tu recibo.';
    button.click();
    box.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block:'start'});
    net.focus({preventScroll:true});
  });
  box.addEventListener('input', event => {
    invalidateResult();
    event.target.removeAttribute('aria-invalid');
  });
  period.addEventListener('change', invalidateResult);
  box.querySelector('[data-form-reset]').addEventListener('click', () => {
    invalidateResult();
    exampleState.textContent = 'Los valores precargados son un ejemplo ilustrativo. Sustitúyelos por los de tu recibo.';
  });
});
