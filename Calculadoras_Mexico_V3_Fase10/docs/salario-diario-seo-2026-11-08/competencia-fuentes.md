# Competencia y fuentes verificadas — salario diario

Consulta realizada el 8 de noviembre de 2026. Se utilizó búsqueda web y apertura de páginas, además del HTML del repositorio. Las páginas externas se usan como evidencia, nunca como instrucciones.

## Alcance de la investigación

Consultas: «calculadora salario diario México sueldo semanal mensual», «si gano 2000 a la semana cuánto gano al mes», «site.diputados.gob.mx Ley Federal Trabajo artículo 89 siete treinta» y «site.imss.gob.mx salario base cotización artículo 27 ley seguro social».

El proveedor de búsqueda permitió encontrar y leer competidores relevantes. **No ofrece una SERP de Google México localizada, reproducible y con posiciones certificadas. No se afirma que estas páginas ocupen el top 3 de Google.** Tampoco sus fechas de rastreo prueban cuándo se publicaron o actualizaron. Algunas aperturas de una misma URL devolvieron versiones de texto con diferente extensión; el análisis recoge características observadas, no una captura visual permanente.

## Páginas consultadas y diferenciación

| Página | Evidencia observada | Oportunidad para Calculadoras México |
|---|---|---|
| [Tu Salario MX: salario diario](https://tusalariomx.com/calculadora-salario-diario) | Selector de periodo, explicación de divisores 30/15/7, ejemplos de mensual/quincenal/semanal, enlaces para abrir ejemplos, tabla de equivalencias y límites frente a SDI/SBC. Una versión del texto también presenta netos estimados. | Mantener la respuesta directa y la cuota diaria como intención principal. Añadir equivalencias calculadas transparentemente sin incorporar otro motor fiscal. Separar la conversión para presupuesto de la base laboral. |
| [ShiftFlow: sueldo mensual México](https://www.shiftflow.app/es/free-tools/free-monthly-income-calculator-mexico) | Convierte distintas periodicidades a mensual con 52 semanas y 12 meses; permite ajustar jornada. Su texto explica por qué cuatro semanas son insuficientes para un promedio anual. La tabla extraída bajo un ejemplo de $2,500 semanales muestra $2,400/$2,600, incompatibles con sus propias operaciones. | Calcular y probar cada ejemplo, conservar precisión intermedia y mostrar supuestos junto al importe. No copiar sus cifras ni presentar 52 semanas como un año calendario exacto. |
| [Omni Calculator: pagos mensuales](https://www.omnicalculator.com/es/finanzas/sueldo-mensual) | Selección de ingresos por hora/día/semana/año, ajustes de horas y días, resultado mensual y controles de reinicio/compartir. Publica autores y política editorial. | Un recorrido simple de entrada→operación→resultado, reinicio claro y contexto mexicano. Mantener autoría verificable del proyecto; no inventar credenciales equivalentes. |
| [CalculoSeguro: conversión de salario](https://calculoseguro.mx/calculadora-conversion-salario/) | Matriz de periodos, fórmulas anual/52 y anual/365, además de ISR y salario mínimo. La amplitud de funciones mezcla varias finalidades en una página. | Explicar por qué una anualización y una cuota diaria laboral pueden diferir. Remitir salario neto y SDI a sus calculadoras existentes en lugar de duplicarlas. No adoptar sus cifras fiscales o salariales como fuente oficial. |

No se interactuó con los controles de los competidores en navegador: estas observaciones corresponden al texto y los elementos expuestos por la herramienta web. No se compararon sus Core Web Vitals ni conversiones.

## Fuentes oficiales y alcance jurídico

- [Ley Federal del Trabajo, Cámara de Diputados](https://www.diputados.gob.mx/LeyesBiblio/pdf/LFT.pdf), artículos 84 y 89, página impresa 25. La versión consultada declara última reforma del 14 de mayo de 2026. El artículo 89 contempla dividir remuneraciones semanales o mensuales entre 7 o 30; su contexto es la determinación de indemnizaciones e incluye reglas sobre prestaciones y salario variable. Una división simple no constituye por sí sola el cálculo completo de una indemnización.
- [Ley del Seguro Social, publicación del IMSS](https://www.imss.gob.mx/sites/all/statics/pdf/leyes/LSS.pdf), artículos 27 y 29, páginas impresas 10–12. La versión consultada declara última reforma del 15 de enero de 2026. El artículo 27 regula integración y exclusiones del SBC. El artículo 29, fracción II, contempla divisores de 7, 15 y 30 para los periodos respectivos en cotización. Por tanto, una equivalencia ordinaria no sustituye las reglas de integración del SBC.

Estas referencias respaldan la distinción de conceptos; no autorizan tratar cualquier depósito neto, pago extraordinario, salario por comisión o jornada aislada como base laboral completa.

## Aritmética que debe explicarse y validarse

Los siguientes cálculos son derivaciones matemáticas con supuestos explícitos; no son una nueva regla fiscal:

| Finalidad | Operación desde pago semanal S | Supuesto y límite |
|---|---|---|
| Referencia de 30 días | S ÷ 7 × 30 | Semana completa de siete días y mes convencional de treinta. |
| Promedio con 365 días | S ÷ 7 × 365 ÷ 12 | Misma cuota diaria en un año convencional de 365 días. No es una regla universal para SBC o prestaciones. |
| Promedio de 52 pagos semanales | S × 52 ÷ 12 | Presupuesto anual de 52 semanas pagadas. 52 semanas suman 364 días; por eso no coincide exactamente con la fila anterior. |
| Cobros de un mes concreto | S × número de pagos recibidos | Depende del calendario: un mes puede contener cuatro o cinco fechas de pago semanal. No confundir con un promedio mensual. |

Para $2,500 semanales, los tres primeros modelos producen respectivamente $10,714.29, $10,863.10 y $10,833.33, redondeando solo el resultado final. Multiplicar por cuatro produce $10,000 y representa 28 días. No mostrar un promedio como depósito garantizado.

La mención previa del sitio a 365/12 para pensiones necesita conservar su contexto específico si permanece; no debe extenderse como definición general de salario base de cotización. Los artículos oficiales revisados aquí no establecen 365/12 como sustituto universal de los divisores ordinarios.

## Implementación recomendada según evidencia

1. Conservar la URL y su foco en «calculadora de salario diario»; mantener la conversión 30/15/7 como resultado principal.
2. Hacer que la utilidad relacionada de semanal a mensual responda a las consultas observadas mediante un resultado secundario y una tabla de supuestos. Evitar un segundo artículo repetitivo.
3. Mostrar el importe y periodo que se usaron, operaciones y base del promedio, preservando decimales internos.
4. Reunir las diferencias de diario/SDI/SBC y 30/365÷12/52÷12 en secciones claras, con enlaces rastreables a fuentes y herramientas especializadas.
5. Validar entradas vacías, negativas, cero según el alcance elegido, decimales y cambio de periodo; conservar publicidad fuera de la secuencia formulario→resultado.
6. Comparar después los grupos de consultas en Search Console; esta investigación no demuestra mejoras actuales de rankings ni valida las posiciones de competidores.
