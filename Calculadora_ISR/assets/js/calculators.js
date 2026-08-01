document.addEventListener('DOMContentLoaded', () => {
  const type = document.body.dataset.calc;
  const button = document.querySelector('.calc-button');
  const fail = message => showRows([{label: 'Revisa los datos', value: message}]);
  const dateValue = id => {
    const value = document.getElementById(id)?.value;
    if (!value) return null;
    const [year, month, day] = value.split('-').map(Number);
    return new Date(Date.UTC(year, month - 1, day));
  };
  const payment = (principal, annualRate, periods) => {
    const rate = annualRate / 100 / 12;
    return rate === 0 ? principal / periods : principal * rate * Math.pow(1 + rate, periods) / (Math.pow(1 + rate, periods) - 1);
  };

  button?.addEventListener('click', () => {
    if (type === 'isr') {
      const income = val('salario');
      const period = document.getElementById('periodo').value;
      if (income <= 0) return fail('El ingreso debe ser mayor que cero');
      const tables = {mensual: tablaISRMensual, quincenal: tablaISRQuincenal, semanal: tablaISRSemanal};
      const row = tables[period].find(item => income >= item.limiteInferior && income <= item.limiteSuperior);
      if (!row) return fail('No se encontró un rango para ese importe');
      const excess = income - row.limiteInferior;
      const tax = row.cuotaFija + excess * row.porcentaje / 100;
      return showRows([
        {label: 'Ingreso bruto', value: money(income)},
        {label: 'Cuota fija', value: money(row.cuotaFija)},
        {label: 'Excedente', value: money(excess)},
        {label: 'Tasa marginal', value: `${row.porcentaje.toFixed(2)}%`},
        {label: 'ISR estimado', value: money(tax)},
        {label: 'Neto estimado', value: money(income - tax), total: true}
      ], 'No considera subsidio al empleo ni otras deducciones.');
    }
    if (type === 'aguinaldo') {
      const salary = val('salario'), days = val('diasAguinaldo'), worked = val('diasTrabajados');
      if (salary <= 0 || days <= 0 || worked <= 0) return fail('Ingresa valores mayores que cero');
      const daily = salary / 30, full = daily * days, proportional = full * Math.min(worked, 365) / 365;
      return showRows([{label: 'Salario diario', value: money(daily)}, {label: 'Aguinaldo completo', value: money(full)}, {label: 'Aguinaldo proporcional', value: money(proportional), total: true}], 'Estimación bruta.');
    }
    if (type === 'vacaciones') {
      const salary = val('salario'), years = Math.floor(val('anios')), premium = val('prima') / 100;
      if (salary <= 0 || years < 1) return fail('El salario y la antigüedad deben ser válidos');
      const days = years <= 5 ? 10 + years * 2 : 20 + Math.floor((years - 5) / 5) * 2;
      const daily = salary / 30, base = daily * days, bonus = base * premium;
      return showRows([{label: 'Días de vacaciones', value: days}, {label: 'Pago del periodo', value: money(base)}, {label: 'Prima vacacional', value: money(bonus)}, {label: 'Referencia total', value: money(base + bonus), total: true}]);
    }
    if (type === 'iva') {
      const amount = val('cantidad'), rate = val('tasa') / 100, operation = document.getElementById('operacion').value;
      if (amount <= 0) return fail('La cantidad debe ser mayor que cero');
      let subtotal, tax, total;
      if (operation === 'agregar') { subtotal = amount; tax = amount * rate; total = subtotal + tax; }
      else if (operation === 'quitar') { total = amount; subtotal = total / (1 + rate); tax = total - subtotal; }
      else { subtotal = amount; tax = amount * rate; total = tax; }
      return showRows([{label: 'Subtotal', value: money(subtotal)}, {label: 'IVA', value: money(tax)}, {label: operation === 'calcular' ? 'Impuesto' : 'Total', value: money(total), total: true}]);
    }
    if (type === 'finiquito') {
      const salary = val('salario'), pending = val('diasPendientes'), yearDays = val('diasAnio'), vacation = val('vacacionesPendientes'), bonusDays = val('diasAguinaldo'), premium = val('prima') / 100;
      if (salary <= 0 || yearDays < 0) return fail('Ingresa valores válidos');
      const daily = salary / 30, wages = daily * pending, bonus = daily * bonusDays * yearDays / 365, vacationPay = daily * vacation, vacationBonus = vacationPay * premium;
      return showRows([{label: 'Días pendientes', value: money(wages)}, {label: 'Aguinaldo proporcional', value: money(bonus)}, {label: 'Vacaciones pendientes', value: money(vacationPay)}, {label: 'Prima vacacional', value: money(vacationBonus)}, {label: 'Finiquito estimado', value: money(wages + bonus + vacationPay + vacationBonus), total: true}], 'No incluye indemnizaciones, prima de antigüedad ni retenciones.');
    }
    if (type === 'horas-extra') {
      const salary = val('salario'), hours = val('horas'), shift = val('jornada');
      if (salary <= 0 || hours < 0 || shift <= 0) return fail('Ingresa valores válidos');
      const hourly = salary / 30 / shift, doubleHours = Math.min(hours, 9), tripleHours = Math.max(hours - 9, 0), doublePay = hourly * 2 * doubleHours, triplePay = hourly * 3 * tripleHours;
      return showRows([{label: 'Hora ordinaria', value: money(hourly)}, {label: 'Horas dobles', value: doubleHours}, {label: 'Pago doble', value: money(doublePay)}, {label: 'Horas triples', value: tripleHours}, {label: 'Pago triple', value: money(triplePay)}, {label: 'Total extraordinario', value: money(doublePay + triplePay), total: true}], 'Referencia general; revisa las condiciones reales de tu jornada.');
    }
    if (type === 'salario-diario') {
      const salary = val('salario'), period = document.getElementById('periodo').value;
      if (salary <= 0) return fail('El ingreso debe ser mayor que cero');
      const divisor = {mensual: 30, quincenal: 15, semanal: 7}[period];
      return showRows([{label: 'Ingreso del periodo', value: money(salary)}, {label: 'Divisor', value: `${divisor} días`}, {label: 'Salario diario', value: money(salary / divisor), total: true}]);
    }
    if (type === 'descuento') {
      const price = val('precio'), percentage = val('porcentaje');
      if (price <= 0 || percentage < 0) return fail('Ingresa valores válidos');
      const saving = price * percentage / 100;
      return showRows([{label: 'Precio original', value: money(price)}, {label: 'Ahorro', value: money(saving)}, {label: 'Precio final', value: money(price - saving), total: true}]);
    }
    if (type === 'salario-neto') {
      const gross = val('salario'), tax = val('isrManual'), social = val('imss'), other = val('otras');
      if (gross <= 0) return fail('El salario debe ser mayor que cero');
      const deductions = tax + social + other;
      return showRows([{label: 'Salario bruto', value: money(gross)}, {label: 'Deducciones', value: money(deductions)}, {label: 'Salario neto estimado', value: money(gross - deductions), total: true}]);
    }
    if (type === 'salario-bruto') {
      const net = val('neto'), deductions = val('deducciones');
      if (net <= 0) return fail('El salario debe ser mayor que cero');
      return showRows([{label: 'Salario neto', value: money(net)}, {label: 'Deducciones', value: money(deductions)}, {label: 'Salario bruto estimado', value: money(net + deductions), total: true}]);
    }
    if (type === 'salario-diario-integrado') {
      const daily = val('salarioDiario'), bonusDays = val('diasAguinaldo'), vacationDays = val('diasVacaciones'), premium = val('prima') / 100;
      if (daily <= 0) return fail('Ingresa un salario diario válido');
      const factor = (365 + bonusDays + vacationDays * premium) / 365;
      return showRows([{label: 'Factor de integración', value: factor.toFixed(6)}, {label: 'Salario diario', value: money(daily)}, {label: 'SDI estimado', value: money(daily * factor), total: true}], 'No incluye prestaciones adicionales ni topes aplicables.');
    }
    if (type === 'prima-dominical') {
      const daily = val('salarioDiario'), sundays = val('domingos'), percentage = val('porcentaje') / 100;
      if (daily <= 0 || sundays < 0) return fail('Ingresa valores válidos');
      return showRows([{label: 'Prima por domingo', value: money(daily * percentage)}, {label: 'Domingos', value: sundays}, {label: 'Prima total', value: money(daily * percentage * sundays), total: true}]);
    }
    if (type === 'prima-vacacional') {
      const daily = val('salarioDiario'), days = val('dias'), percentage = val('prima') / 100;
      if (daily <= 0 || days < 0) return fail('Ingresa valores válidos');
      const base = daily * days;
      return showRows([{label: 'Pago base de vacaciones', value: money(base)}, {label: 'Porcentaje de prima', value: `${(percentage * 100).toFixed(2)}%`}, {label: 'Prima vacacional', value: money(base * percentage), total: true}]);
    }
    if (type === 'aguinaldo-proporcional') {
      const daily = val('salarioDiario'), bonusDays = val('diasAguinaldo'), worked = val('diasTrabajados');
      if (daily <= 0 || bonusDays <= 0 || worked < 0) return fail('Ingresa valores válidos');
      const annual = daily * bonusDays, proportional = annual * Math.min(worked, 365) / 365;
      return showRows([{label: 'Aguinaldo anual', value: money(annual)}, {label: 'Proporción del año', value: `${(Math.min(worked, 365) / 365 * 100).toFixed(2)}%`}, {label: 'Aguinaldo proporcional', value: money(proportional), total: true}]);
    }
    if (type === 'vacaciones-proporcionales') {
      const daily = val('salarioDiario'), annualDays = val('diasAnuales'), worked = val('diasTrabajados'), premium = val('prima') / 100;
      if (daily <= 0 || annualDays < 0 || worked < 0) return fail('Ingresa valores válidos');
      const days = annualDays * Math.min(worked, 365) / 365, base = daily * days, bonus = base * premium;
      return showRows([{label: 'Días proporcionales', value: days.toFixed(2)}, {label: 'Pago de vacaciones', value: money(base)}, {label: 'Prima vacacional', value: money(bonus)}, {label: 'Total estimado', value: money(base + bonus), total: true}]);
    }
    if (type === 'liquidacion') {
      const daily = val('salarioDiario'), years = val('anios'), pending = val('diasPendientes'), include = document.getElementById('incluir20').value === 'si';
      if (daily <= 0 || years < 0) return fail('Ingresa valores válidos');
      const threeMonths = daily * 90, twentyDays = include ? daily * 20 * years : 0, pendingPay = daily * pending;
      return showRows([{label: 'Tres meses de salario', value: money(threeMonths)}, {label: '20 días por año', value: money(twentyDays)}, {label: 'Sueldo pendiente', value: money(pendingPay)}, {label: 'Referencia total', value: money(threeMonths + twentyDays + pendingPay), total: true}], 'Es una simulación informativa y no determina derechos.');
    }
    if (type === 'ptu') {
      const pool = val('bolsa'), personDays = val('diasPersona'), totalDays = val('diasTotal'), personSalary = val('salarioPersona'), totalSalary = val('salarioTotal');
      if (pool <= 0 || totalDays <= 0 || totalSalary <= 0) return fail('Los totales deben ser mayores que cero');
      const byDays = pool / 2 * personDays / totalDays, bySalary = pool / 2 * personSalary / totalSalary;
      return showRows([{label: 'Parte por días', value: money(byDays)}, {label: 'Parte por salario', value: money(bySalary)}, {label: 'PTU estimada', value: money(byDays + bySalary), total: true}], 'Simulación sin topes ni reglas de elegibilidad.');
    }
    if (type === 'retencion-iva') {
      const subtotal = val('subtotal'), rate = val('tasaIva') / 100, retentionRate = val('retencion') / 100;
      if (subtotal <= 0) return fail('El subtotal debe ser mayor que cero');
      const tax = subtotal * rate, retention = tax * retentionRate;
      return showRows([{label: 'Subtotal', value: money(subtotal)}, {label: 'IVA causado', value: money(tax)}, {label: 'IVA retenido', value: money(retention)}, {label: 'Total después de retención', value: money(subtotal + tax - retention), total: true}]);
    }
    if (type === 'iva-incluido') {
      const total = val('total'), rate = val('tasa') / 100;
      if (total <= 0 || rate < 0) return fail('Ingresa valores válidos');
      const subtotal = total / (1 + rate);
      return showRows([{label: 'Precio con IVA', value: money(total)}, {label: 'Subtotal', value: money(subtotal)}, {label: 'IVA incluido', value: money(total - subtotal), total: true}]);
    }
    if (type === 'porcentaje') {
      const operation = document.getElementById('operacion').value, x = val('x'), y = val('y');
      if ((operation !== 'de' && y === 0) || (operation === 'cambio' && x === 0)) return fail('No se puede dividir entre cero');
      let label, result;
      if (operation === 'de') { label = `${x}% de ${y}`; result = x / 100 * y; }
      else if (operation === 'representa') { label = `${x} representa`; result = x / y * 100; }
      else { label = 'Cambio porcentual'; result = (y - x) / x * 100; }
      return showRows([{label, value: operation === 'de' ? result.toFixed(2) : `${result.toFixed(2)}%`, total: true}]);
    }
    if (type === 'aumento-salarial') {
      const salary = val('salario'), percentage = val('porcentaje') / 100;
      if (salary <= 0) return fail('El salario debe ser mayor que cero');
      const increase = salary * percentage;
      return showRows([{label: 'Salario actual', value: money(salary)}, {label: 'Aumento', value: money(increase)}, {label: 'Nuevo salario', value: money(salary + increase), total: true}]);
    }
    if (type === 'comision') {
      const sales = val('ventas'), percentage = val('porcentaje') / 100, base = val('base');
      if (sales < 0) return fail('Las ventas no pueden ser negativas');
      const commission = sales * percentage;
      return showRows([{label: 'Ventas', value: money(sales)}, {label: 'Comisión', value: money(commission)}, {label: 'Pago base', value: money(base)}, {label: 'Ingreso total', value: money(commission + base), total: true}]);
    }
    if (type === 'interes-simple') {
      const principal = val('capital'), rate = val('tasa') / 100, months = val('meses');
      if (principal <= 0 || months < 0) return fail('Ingresa valores válidos');
      const interest = principal * rate * months / 12;
      return showRows([{label: 'Capital', value: money(principal)}, {label: 'Interés generado', value: money(interest)}, {label: 'Monto final', value: money(principal + interest), total: true}]);
    }
    if (type === 'interes-compuesto') {
      const principal = val('capital'), rate = val('tasa') / 100, years = val('anios'), frequency = Number(document.getElementById('frecuencia').value);
      if (principal <= 0 || years < 0) return fail('Ingresa valores válidos');
      const total = principal * Math.pow(1 + rate / frequency, frequency * years);
      return showRows([{label: 'Capital inicial', value: money(principal)}, {label: 'Intereses estimados', value: money(total - principal)}, {label: 'Monto final', value: money(total), total: true}]);
    }
    if (type === 'prestamo') {
      const principal = val('monto'), annual = val('tasa') / 100, months = val('meses');
      if (principal <= 0 || months <= 0) return fail('Ingresa valores válidos');
      const rate = annual / 12;
      const payment = rate === 0 ? principal / months : principal * rate * Math.pow(1 + rate, months) / (Math.pow(1 + rate, months) - 1);
      const total = payment * months;
      return showRows([{label: 'Capital', value: money(principal)}, {label: 'Mensualidad estimada', value: money(payment)}, {label: 'Intereses totales', value: money(total - principal)}, {label: 'Pago total', value: money(total), total: true}]);
    }
    if (type === 'ahorro-mensual') {
      const initial = val('inicial'), contribution = val('aportacion'), annual = val('tasa') / 100, months = val('meses');
      if (initial < 0 || contribution < 0 || months < 0) return fail('Ingresa valores válidos');
      const rate = annual / 12, initialFuture = initial * Math.pow(1 + rate, months), contributionFuture = rate === 0 ? contribution * months : contribution * (Math.pow(1 + rate, months) - 1) / rate, total = initialFuture + contributionFuture, invested = initial + contribution * months;
      return showRows([{label: 'Aportado por ti', value: money(invested)}, {label: 'Rendimiento estimado', value: money(total - invested)}, {label: 'Ahorro acumulado', value: money(total), total: true}]);
    }
    if (type === 'regla-tres') {
      const a = val('a'), b = val('b'), c = val('c');
      if (a === 0) return fail('El valor A no puede ser cero');
      return showRows([{label: 'Proporción', value: `${b} × ${c} ÷ ${a}`}, {label: 'Valor desconocido', value: (b * c / a).toLocaleString('es-MX', {maximumFractionDigits: 6}), total: true}]);
    }
    if (type === 'edad') {
      const start = dateValue('fechaNacimiento'), end = dateValue('fechaFinal');
      if (!start || !end || end < start) return fail('La fecha final debe ser posterior a la inicial');
      let years = end.getUTCFullYear() - start.getUTCFullYear();
      let months = end.getUTCMonth() - start.getUTCMonth();
      let days = end.getUTCDate() - start.getUTCDate();
      if (days < 0) {
        months--;
        days += new Date(Date.UTC(end.getUTCFullYear(), end.getUTCMonth(), 0)).getUTCDate();
      }
      if (months < 0) { years--; months += 12; }
      const totalDays = Math.floor((end - start) / 86400000);
      return showRows([{label: 'Años', value: years}, {label: 'Meses adicionales', value: months}, {label: 'Días adicionales', value: days}, {label: 'Días transcurridos', value: totalDays.toLocaleString('es-MX'), total: true}]);
    }
    if (type === 'diferencia-fechas') {
      const start = dateValue('fechaInicio'), end = dateValue('fechaFin');
      if (!start || !end || end < start) return fail('La fecha final debe ser posterior a la inicial');
      const days = Math.floor((end - start) / 86400000), weeks = days / 7;
      return showRows([{label: 'Semanas completas', value: Math.floor(weeks)}, {label: 'Días adicionales', value: days % 7}, {label: 'Diferencia total', value: `${days.toLocaleString('es-MX')} días`, total: true}]);
    }
    if (type === 'propina') {
      const bill = val('cuenta'), percentage = val('propinaPct') / 100, people = val('personas');
      if (bill <= 0 || people < 1) return fail('La cuenta y las personas deben ser válidas');
      const tip = bill * percentage, total = bill + tip;
      return showRows([{label: 'Cuenta', value: money(bill)}, {label: 'Propina', value: money(tip)}, {label: 'Total', value: money(total)}, {label: 'Por persona', value: money(total / people), total: true}]);
    }
    if (type === 'margen-ganancia') {
      const cost = val('costo'), sale = val('venta');
      if (cost < 0 || sale <= 0) return fail('Ingresa costo y venta válidos');
      const profit = sale - cost, margin = profit / sale * 100, markup = cost === 0 ? 0 : profit / cost * 100;
      return showRows([{label: 'Utilidad', value: money(profit)}, {label: 'Aumento sobre costo', value: `${markup.toFixed(2)}%`}, {label: 'Margen sobre venta', value: `${margin.toFixed(2)}%`, total: true}]);
    }
    if (type === 'precio-venta') {
      const cost = val('costo'), percentage = val('aumento') / 100;
      if (cost < 0 || percentage < 0) return fail('Ingresa valores válidos');
      const profit = cost * percentage;
      return showRows([{label: 'Costo', value: money(cost)}, {label: 'Utilidad agregada', value: money(profit)}, {label: 'Precio de venta', value: money(cost + profit), total: true}]);
    }
    if (type === 'punto-equilibrio') {
      const fixed = val('costosFijos'), price = val('precioUnidad'), variable = val('costoVariable');
      const contribution = price - variable;
      if (fixed < 0 || contribution <= 0) return fail('El precio debe ser mayor al costo variable');
      const units = Math.ceil(fixed / contribution);
      return showRows([{label: 'Margen por unidad', value: money(contribution)}, {label: 'Ventas de equilibrio', value: money(units * price)}, {label: 'Unidades necesarias', value: units.toLocaleString('es-MX'), total: true}]);
    }
    if (type === 'roi') {
      const investment = val('inversion'), final = val('valorFinal');
      if (investment <= 0) return fail('La inversión debe ser mayor que cero');
      const gain = final - investment, roi = gain / investment * 100;
      return showRows([{label: 'Inversión', value: money(investment)}, {label: 'Ganancia o pérdida', value: money(gain)}, {label: 'ROI', value: `${roi.toFixed(2)}%`, total: true}]);
    }
    if (type === 'inflacion') {
      const amount = val('cantidad'), rate = val('inflacionPct') / 100, years = val('anios');
      if (amount <= 0 || rate < 0 || years < 0) return fail('Ingresa valores válidos');
      const factor = Math.pow(1 + rate, years), futureCost = amount * factor, purchasing = amount / factor;
      return showRows([{label: 'Cantidad actual', value: money(amount)}, {label: 'Costo futuro equivalente', value: money(futureCost)}, {label: 'Poder adquisitivo estimado', value: money(purchasing), total: true}], 'Simulación basada en una tasa constante.');
    }
    if (type === 'ahorro-meta') {
      const target = val('meta'), current = val('actual'), months = val('meses');
      if (target <= 0 || current < 0 || months <= 0) return fail('Ingresa valores válidos');
      const missing = Math.max(0, target - current);
      return showRows([{label: 'Meta', value: money(target)}, {label: 'Faltante', value: money(missing)}, {label: 'Ahorro mensual necesario', value: money(missing / months), total: true}], 'No incluye rendimientos ni inflación.');
    }
    if (type === 'tiempo-ahorro') {
      const target = val('meta'), current = val('actual'), contribution = val('aportacion');
      if (target <= 0 || current < 0 || contribution <= 0) return fail('Ingresa valores válidos');
      const months = Math.max(0, Math.ceil((target - current) / contribution));
      return showRows([{label: 'Faltante actual', value: money(Math.max(0, target - current))}, {label: 'Aportación mensual', value: money(contribution)}, {label: 'Tiempo estimado', value: `${months} meses`, total: true}], 'No incluye rendimientos ni inflación.');
    }
    if (type === 'credito-automotriz') {
      const price = val('precioAuto'), downRate = val('enganchePct') / 100, annual = val('tasa'), months = val('meses');
      if (price <= 0 || downRate < 0 || downRate >= 1 || months <= 0) return fail('Revisa precio, enganche y plazo');
      const down = price * downRate, principal = price - down, monthly = payment(principal, annual, months), total = monthly * months;
      return showRows([{label: 'Enganche', value: money(down)}, {label: 'Monto financiado', value: money(principal)}, {label: 'Intereses estimados', value: money(total - principal)}, {label: 'Mensualidad', value: money(monthly), total: true}], 'No incluye seguros, comisiones ni gastos adicionales.');
    }
    if (type === 'hipoteca') {
      const price = val('precioCasa'), downRate = val('enganchePct') / 100, annual = val('tasa'), years = val('anios'), months = years * 12;
      if (price <= 0 || downRate < 0 || downRate >= 1 || years <= 0) return fail('Revisa precio, enganche y plazo');
      const down = price * downRate, principal = price - down, monthly = payment(principal, annual, months), total = monthly * months;
      return showRows([{label: 'Enganche', value: money(down)}, {label: 'Monto financiado', value: money(principal)}, {label: 'Intereses estimados', value: money(total - principal)}, {label: 'Mensualidad', value: money(monthly), total: true}], 'No incluye seguros, comisiones, avalúo ni gastos notariales.');
    }
    if (type === 'pago-quincenal') {
      const salary = val('salario');
      if (salary <= 0) return fail('El salario debe ser mayor que cero');
      return showRows([{label: 'Salario mensual', value: money(salary)}, {label: 'Salario diario', value: money(salary / 30)}, {label: 'Pago quincenal', value: money(salary / 2), total: true}], 'Importes brutos antes de deducciones.');
    }
    if (type === 'salario-hora') {
      const salary = val('salario'), days = val('diasMes'), hours = val('horasDia');
      if (salary <= 0 || days <= 0 || hours <= 0) return fail('Ingresa valores mayores que cero');
      const monthlyHours = days * hours;
      return showRows([{label: 'Horas mensuales', value: monthlyHours.toFixed(2)}, {label: 'Salario diario', value: money(salary / days)}, {label: 'Salario por hora', value: money(salary / monthlyHours), total: true}]);
    }
    if (type === 'bono') {
      const salary = val('salario'), rate = val('bonoPct') / 100;
      if (salary < 0 || rate < 0) return fail('Ingresa valores válidos');
      const bonus = salary * rate;
      return showRows([{label: 'Salario base', value: money(salary)}, {label: 'Bono bruto', value: money(bonus)}, {label: 'Total bruto', value: money(salary + bonus), total: true}]);
    }
    if (type === 'reparto-cuenta') {
      const total = val('total'), people = val('personas');
      if (total < 0 || people < 1) return fail('Ingresa un total y personas válidos');
      return showRows([{label: 'Total', value: money(total)}, {label: 'Personas', value: people}, {label: 'Monto por persona', value: money(total / people), total: true}]);
    }
    if (type === 'precio-sin-descuento') {
      const final = val('precioFinal'), rate = val('descuentoPct') / 100;
      if (final <= 0 || rate < 0 || rate >= 1) return fail('El descuento debe estar entre 0% y menos de 100%');
      const original = final / (1 - rate);
      return showRows([{label: 'Precio pagado', value: money(final)}, {label: 'Descuento recibido', value: money(original - final)}, {label: 'Precio original', value: money(original), total: true}]);
    }
    if (type === 'tasa-efectiva') {
      const nominal = val('tasaNominal') / 100, frequency = val('frecuencia');
      if (nominal < 0 || frequency < 1) return fail('Ingresa una tasa y frecuencia válidas');
      const effective = Math.pow(1 + nominal / frequency, frequency) - 1;
      return showRows([{label: 'Tasa nominal', value: `${(nominal * 100).toFixed(2)}%`}, {label: 'Capitalizaciones por año', value: frequency}, {label: 'Tasa efectiva anual', value: `${(effective * 100).toFixed(4)}%`, total: true}]);
    }
    if (type === 'rendimiento-anualizado') {
      const initial = val('capitalInicial'), final = val('capitalFinal'), days = val('dias');
      if (initial <= 0 || final < 0 || days <= 0) return fail('Ingresa valores válidos');
      const periodReturn = final / initial - 1, annualized = Math.pow(final / initial, 365 / days) - 1;
      return showRows([{label: 'Rendimiento del periodo', value: `${(periodReturn * 100).toFixed(2)}%`}, {label: 'Duración', value: `${days} días`}, {label: 'Rendimiento anualizado', value: `${(annualized * 100).toFixed(2)}%`, total: true}], 'Anualización matemática; no garantiza rendimientos futuros.');
    }
    if (type === 'cetes') {
      const price = val('precio'), nominal = val('valorNominal'), titles = val('titulos'), days = val('dias');
      if (price <= 0 || nominal <= 0 || titles < 1 || days <= 0) return fail('Ingresa valores válidos');
      const investment = price * titles, gain = (nominal - price) * titles, annualYield = (nominal - price) / price * 360 / days * 100;
      return showRows([{label: 'Inversión estimada', value: money(investment)}, {label: 'Valor al vencimiento', value: money(nominal * titles)}, {label: 'Ganancia bruta', value: money(gain)}, {label: 'Rendimiento anual simple', value: `${annualYield.toFixed(2)}%`, total: true}], 'No incluye impuestos, comisiones ni reinversión.');
    }
    if (type === 'costo-unidad') {
      const fixed = val('costosFijos'), variable = val('costosVariables'), units = val('unidades');
      if (fixed < 0 || variable < 0 || units < 1) return fail('Ingresa costos y unidades válidos');
      const total = fixed + variable;
      return showRows([{label: 'Costo total', value: money(total)}, {label: 'Unidades', value: units.toLocaleString('es-MX')}, {label: 'Costo por unidad', value: money(total / units), total: true}]);
    }
    if (type === 'conversion-longitud') {
      const amount = val('cantidad'), from = document.getElementById('origen').value, to = document.getElementById('destino').value;
      const meters = {m: 1, km: 1000, ft: 0.3048, mi: 1609.344};
      const labels = {m: 'metros', km: 'kilómetros', ft: 'pies', mi: 'millas'};
      const result = amount * meters[from] / meters[to];
      return showRows([{label: 'Cantidad original', value: `${amount.toLocaleString('es-MX')} ${labels[from]}`}, {label: 'Resultado', value: `${result.toLocaleString('es-MX', {maximumFractionDigits: 6})} ${labels[to]}`, total: true}]);
    }
    if (type === 'costo-combustible') {
      const distance = val('distancia'), efficiency = val('rendimiento'), price = val('precioLitro');
      if (distance < 0 || efficiency <= 0 || price < 0) return fail('Ingresa valores válidos');
      const liters = distance / efficiency;
      return showRows([{label: 'Distancia', value: `${distance.toLocaleString('es-MX')} km`}, {label: 'Combustible estimado', value: `${liters.toFixed(2)} litros`}, {label: 'Costo del recorrido', value: money(liters * price), total: true}]);
    }
  });
});
