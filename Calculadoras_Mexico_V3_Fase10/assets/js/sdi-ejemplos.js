/* Ejemplos y validación de entrada exclusivos de la calculadora de SDI. */
document.addEventListener('DOMContentLoaded', () => {
  if (document.body.dataset.calc !== 'salario-diario-integrado') return;
  const fields = ['salarioDiario', 'diasAguinaldo', 'diasVacaciones', 'prima'];
  const button = document.querySelector('#calculadora .calc-button');
  const result = document.getElementById('resultado');
  const note = document.getElementById('sdi-example-note');
  const examples = {
    basico: {values: [500, 15, 12, 25], text: 'Ejemplo: $500 diarios, 15 días de aguinaldo, 12 de vacaciones y prima de 25%.'},
    segundo: {values: [500, 15, 14, 25], text: 'Comparación: mismo salario y aguinaldo, con 14 días de vacaciones y prima de 25%.'},
    superior: {values: [500, 30, 20, 50], text: 'Prestaciones superiores supuestas: $500 diarios, 30 días de aguinaldo, 20 de vacaciones y prima de 50%.'}
  };
  button.addEventListener('click', event => {
    const invalid = fields.find((id, index) => {
      const input = document.getElementById(id);
      const value = Number(input.value);
      return input.value.trim() === '' || !Number.isFinite(value) || (index === 0 ? value <= 0 : value < 0);
    });
    fields.forEach(id => document.getElementById(id).removeAttribute('aria-invalid'));
    if (!invalid) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    delete result.dataset.ready;
    result.textContent = 'Revisa los datos: completa los cuatro campos. El salario diario debe ser mayor que cero y las prestaciones no pueden ser negativas.';
    document.getElementById(invalid).setAttribute('aria-invalid', 'true');
    document.getElementById(invalid).focus();
  }, true);
  document.querySelectorAll('[data-sdi-example]').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const example = examples[trigger.dataset.sdiExample];
      if (!example) return;
      fields.forEach((id, index) => {
        const input = document.getElementById(id);
        input.value = example.values[index];
        input.dispatchEvent(new Event('input', {bubbles: true}));
        input.dispatchEvent(new Event('change', {bubbles: true}));
      });
      note.textContent = example.text + ' Sustituye estos datos por los de tu contrato para calcular tu caso.';
      button.click();
    });
  });
  document.querySelector('#calculadora [data-form-reset]')?.addEventListener('click', () => {
    note.textContent = '';
    fields.forEach(id => document.getElementById(id).removeAttribute('aria-invalid'));
  });
});
