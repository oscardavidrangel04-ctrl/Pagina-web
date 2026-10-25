/* Page-specific checks and examples. The shared calculation engine is unchanged. */
document.addEventListener('DOMContentLoaded', () => {
  const type = document.body.dataset.calc;
  const fields = type === 'ptu'
    ? ['bolsa', 'diasPersona', 'diasTotal', 'salarioPersona', 'salarioTotal']
    : type === 'horas-extra' ? ['salario', 'horas', 'jornada'] : [];
  const button = document.querySelector('.calc-button');
  const result = document.getElementById('resultado');
  if (!fields.length || !button || !result) return;
  const input = id => document.getElementById(id);
  const clear = message => {
    delete result.dataset.ready;
    result.textContent = message;
  };
  const fail = (id, message, event) => {
    event.preventDefault();
    event.stopImmediatePropagation();
    clear(message);
    input(id).setAttribute('aria-invalid', 'true');
    input(id).focus();
  };
  button.addEventListener('click', event => {
    for (const id of fields) {
      const field = input(id);
      field.removeAttribute('aria-invalid');
      if (field.value.trim() === '' || !Number.isFinite(field.valueAsNumber)) {
        return fail(id, 'Completa todos los campos con números válidos. Si corresponde cero, escribe 0.', event);
      }
      if (field.valueAsNumber < 0 || field.valueAsNumber > 1e12) {
        return fail(id, 'Revisa el importe o cantidad: no debe ser negativo ni superar 1 billón.', event);
      }
    }
    if (type === 'ptu') {
      for (const id of ['bolsa', 'diasTotal', 'salarioTotal']) {
        if (input(id).valueAsNumber <= 0) return fail(id, 'La bolsa y los totales del reparto deben ser mayores que cero.', event);
      }
      for (const id of ['diasPersona', 'diasTotal']) {
        if (!Number.isInteger(input(id).valueAsNumber)) return fail(id, 'Captura los días computables como un número entero.', event);
      }
      if (input('diasPersona').valueAsNumber > input('diasTotal').valueAsNumber) {
        return fail('diasPersona', 'Tus días no pueden superar el total del grupo que te incluye. Revisa el ejercicio y los datos.', event);
      }
      if (input('salarioPersona').valueAsNumber > input('salarioTotal').valueAsNumber) {
        return fail('salarioPersona', 'Tu salario computable no puede superar el total del grupo que te incluye.', event);
      }
    } else {
      if (input('salario').valueAsNumber <= 0) return fail('salario', 'El salario mensual debe ser mayor que cero.', event);
      if (input('jornada').valueAsNumber <= 0 || input('jornada').valueAsNumber > 24) {
        return fail('jornada', 'Revisa la duración de tu jornada diaria. Debe ser mayor que cero y no superar 24 horas; esto no valida su legalidad.', event);
      }
      if (input('horas').valueAsNumber > 168) return fail('horas', 'Captura horas de una sola semana, no de un mes. Revisa el total ingresado.', event);
    }
  }, true);
  for (const id of fields) {
    input(id).addEventListener('input', () => {
      input(id).removeAttribute('aria-invalid');
      clear('Datos modificados. Pulsa Calcular para obtener un nuevo desglose.');
    });
  }
  document.querySelectorAll('[data-labor-example]').forEach(example => {
    example.addEventListener('click', () => {
      const values = example.dataset.laborExample === 'ptu-base'
        ? {bolsa: 100000, diasPersona: 300, diasTotal: 5000, salarioPersona: 180000, salarioTotal: 3000000}
        : {salario: 15000, horas: 12, jornada: 8};
      for (const [id, value] of Object.entries(values)) {
        const field = input(id);
        if (!field) return;
        field.value = String(value);
        field.dispatchEvent(new Event('input', {bubbles: true}));
        field.dispatchEvent(new Event('change', {bubbles: true}));
      }
      button.click();
      result.scrollIntoView({block: 'center', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'});
    });
  });
});
