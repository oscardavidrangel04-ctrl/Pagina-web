/* Receipt comparison: uses entered amounts, never estimates taxes. */
document.addEventListener('DOMContentLoaded', () => {
  if (document.body.dataset.calc !== 'salario-neto') return;
  const box = document.getElementById('calculadora');
  const output = document.getElementById('snReceiptCheck');
  const fields = ['salario', 'isrManual', 'imss', 'otras'].map(id => document.getElementById(id));
  const deposit = document.getElementById('snDeposito');
  const period = document.getElementById('snPeriodo');
  const format = value => new Intl.NumberFormat('es-MX', {style:'currency',currency:'MXN'}).format(value);
  const display = message => { output.hidden = false; output.textContent = message; };
  box.querySelector('.calc-button').addEventListener('click', event => {
    const values = fields.map(field => Number(field.value));
    const invalid = fields.find((field, i) => field.value.trim() === '' || !Number.isFinite(values[i]) || values[i] < 0 || (i === 0 && values[i] === 0));
    if (invalid || (deposit.value !== '' && (!Number.isFinite(Number(deposit.value)) || Number(deposit.value) < 0))) {
      event.stopImmediatePropagation();
      document.getElementById('resultado').textContent = 'Revisa los datos antes de calcular.';
      display('Introduce un bruto mayor a cero y deducciones no negativas. Puedes usar 0 cuando no exista un descuento.');
      (invalid || deposit).focus();
      return;
    }
    const [gross, tax, social, other] = values;
    const net = gross - tax - social - other;
    if (net < 0) {
      event.stopImmediatePropagation();
      document.getElementById('resultado').textContent = 'Las deducciones superan al sueldo bruto.';
      display('Revisa importes duplicados y confirma que todos correspondan al mismo periodo.');
      return;
    }
    let message = `Recibo ${period.value}: ISR ${format(tax)} + cuotas ${format(social)} + otros descuentos ${format(other)}. Conservas ${(net / gross * 100).toFixed(2)}% del bruto.`;
    if (deposit.value !== '') {
      const difference = Math.round((Number(deposit.value) - net) * 100) / 100;
      message += difference === 0 ? ' El depósito coincide con el neto calculado.' : ` El depósito es ${format(Math.abs(difference))} ${difference > 0 ? 'mayor' : 'menor'} que el neto calculado. Revisa el desglose de tu recibo.`;
    }
    display(message);
  }, true);
  box.addEventListener('input', () => { output.hidden = true; });
  period.addEventListener('change', () => { output.hidden = true; });
  box.querySelector('[data-form-reset]').addEventListener('click', () => { output.hidden = true; deposit.value = ''; });
});
