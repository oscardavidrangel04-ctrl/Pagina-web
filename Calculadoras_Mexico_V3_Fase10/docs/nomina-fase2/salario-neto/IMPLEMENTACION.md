# Salario neto: implementación y segunda revisión

URL: `/calculadoras/salario-neto.html`. Base: `dfe634e`. Revisión editorial: 9 de noviembre de 2026. Se integran las dos solicitudes de salario neto sobre su estado real; la página ya tenía ejemplos, comparación del depósito y abundante contenido. No se presentan esas funciones anteriores como nuevas.

## Diagnóstico y prioridad

**Keyword principal: calculadora de sueldo neto en México**, con «calcular sueldo bruto a neto» como variante prioritaria de protección. La intención se conserva para proteger la observación histórica SEMrush #2. La exportación no certifica ese ranking actual ni una SERP localizada. Secundarias: cómo calcular ingreso neto, salario bruto a neto, calcular sueldo neto a partir del bruto, sueldo neto mensual/quincenal/semanal y deducciones de nómina.

Se analizaron las 300 consultas GSC y los 86 registros SEMrush. El agregado GSC tiene 6 clics y 2.087 impresiones, mientras consultas, países y dispositivos suman 2/947. SEMrush atribuye 312 visitas estimadas a la keyword #2 y otra visita a otra fila: no confundir 312 de esa keyword con el total de 313 de las filas. Los periodos, filtros, límites y prioridades se documentan en [DATOS.md](DATOS.md), [línea base](linea-base.json) y [matriz completa](matriz-oportunidades.csv).

| Keyword | Fuente / posición histórica | Impresiones GSC | Intención y problema abordado | Acción aplicada | Métrica posterior |
| --- | --- | ---: | --- | --- | --- |
| calcular sueldo bruto a neto | SEMrush 2; GSC 22,61 | 23 | Convertir con deducciones conocidas; evitar alterar la intención de una consulta valiosa | Title/H1 preservados, desglose y entrada total excluyentes | Clics, CTR y posición por consulta con igual filtro |
| como calcular un sueldo bruto a neto | GSC 4,53 | 15 | Respuesta de cálculo y claridad de descuentos | Operación completa visible y resultados separados | CTR junto con posición e impresiones |
| calcular sueldo neto a partir del bruto | GSC 13,78 | 23 | Obtener un resultado comprensible desde el recibo | Enter, validación de centavos y ejemplos existentes con el mismo motor | Visibilidad top10 y uso de la herramienta |
| salario bruto a neto | GSC 16,41 | 27 | Transformación con información incompleta | Modo total para quien conoce la suma, sin atribuirle un desglose ficticio | Impresiones, clics y consultas nuevas pertinentes |
| cómo calcular ingreso neto | SEMrush 11 | Consultar matriz | Revisar percepciones y deducciones del periodo | Respuesta específica, otros pagos conocidos y conciliación | Posición y clics relevantes |
| calcular sueldo neto a bruto | GSC 9,8 | 10 | Conversión inversa con otra intención | Conservado enlace a salario bruto; no duplicar otro motor en esta URL | Revisar consulta × página antes de alegar canibalización |

## Cambios implementados

1. **Deducciones separadas o totales.** El nuevo selector permite introducir ISR, IMSS y otras por separado, o solo el total. Los campos inactivos se ocultan y deshabilitan; nunca se suman ambos modos. El total empieza vacío para exigir que el visitante lo conozca. No se infiere el ISR desde una suma de descuentos.
2. **Conciliación del recibo.** Se añade un campo de otros pagos conocidos, por defecto cero, para importes efectivamente entregados que no estén en las percepciones. Se advierte contra subsidios virtuales y conceptos duplicados. La fórmula queda visible: percepciones + otros pagos − deducciones. No se calcula un subsidio ni se asume su elegibilidad.
3. **Desglose del resultado.** En modo separado se muestran ISR, cuotas y otras deducciones, además del total y el neto. En modo total no se inventan sus componentes. Se conserva la comparación con depósito mayor, menor o coincidente, los ejemplos y las acciones compartidas de guardar/copia/exportación.
4. **Precisión y errores.** El motor trabaja en centavos enteros. Rechaza cantidades no finitas, negativas, superiores a un billón de MXN, más de dos decimales, periodos desconocidos y deducciones superiores a percepciones más otros pagos. Un neto de cero es válido. Se valida el formulario con Enter y se marca el campo inválido. Modificar datos invalida el resultado anterior.
5. **Compatibilidad.** Los enlaces antiguos con los campos originales siguen cargando deducciones separadas y otros pagos cero, aunque hubiera otra opción guardada en el navegador. Persistencia, reinicio, escenarios y ejemplos se comprueban en la suite integrada.
6. **Menos JavaScript.** Se amplía el módulo específico `salario-neto-receipt.js` y esta página deja de solicitar `calculators.js`. El motor compartido permanece intacto para las demás calculadoras. No se añade ninguna dependencia.
7. **SEO y contenido.** Introducción y metadescripción describen las dos formas de captura. Se mejora una sección existente sobre ingreso neto, base gravada/SBC y límites fiscales; se añaden accesos internos a deducciones e ISR/IMSS. Se actualizan respuestas existentes sin inflar la cantidad de FAQs. WebPage enlaza su WebApplication y el schema describe funciones reales.

## Elementos protegidos y metadatos

Title preservado: **Calculadora de sueldo neto en México: de bruto a neto**. H1 preservado: **Calculadora de sueldo neto 2026: de bruto a neto en México**. Canonical, robots, URL y destinos de enlaces anteriores se conservan. El registro histórico #2 justifica prudencia con la intención; no demuestra que el título sea causal de esa posición.

Metadescripción anterior: «Calcula cuánto recibes de sueldo neto y compara tu depósito. Captura bruto, ISR, IMSS y otros descuentos del recibo. Gratis, con ejemplos y sin registro.»

Nueva: «Calcula tu sueldo bruto a neto en México con las deducciones de tu recibo, separadas o en total. Revisa ISR, IMSS, otros pagos y diferencias con tu depósito.» Se sincroniza con Open Graph, Twitter y JSON-LD. Google puede generar otro fragmento.

Se mantiene la identidad visual, logo original, composición y estilos existentes. El CSS adicional queda limitado a esta calculadora para ocultar campos inactivos, evitar desbordamientos y conservar espacio de interacción. No se rediseña el frontend ni se añaden anuncios.

## Exactitud fiscal y decisiones de alcance

El motor anterior ya usaba deducciones manuales. No se añade un porcentaje arbitrario de ISR o IMSS ni un cálculo inverso fiscal sin bases suficientes. Para neto a bruto se conserva la herramienta existente con deducciones conocidas. El salario bruto no equivale automáticamente a la base gravable de ISR ni al SBC.

La base documental utilizada y los límites de verificación fiscal se detallan en [FUENTES.md](FUENTES.md). Ninguna cifra de UMA, tasa de IMSS o subsidio se incorpora al nuevo motor: no necesita esos parámetros para comprobar cantidades ya consignadas en el recibo. La calculadora ISR separada sigue siendo una referencia de tarifa sin subsidio/IMSS; no se presenta como cálculo de nómina completo.

Las tablas de importes conservan sus descuentos hipotéticos expresamente identificados. No se fabrican ocho sueldos netos universales para ocho cantidades brutas. Un mismo bruto puede producir netos distintos según conceptos y deducciones.

## Canibalización y enlaces

Los exports de una sola URL no prueban alternancia competitiva entre URLs. Salario neto conserva el cálculo con descuentos; salario diario convierte periodos; pago quincenal convierte importe bruto; el artículo de bruto/neto define conceptos y la guía ISR explica tarifas. Se mantiene la navegación contextual y se refuerza el enlace a tarifas. No se crean redirecciones, fusiones ni cambios de canonical.

## Archivos y pruebas

Archivos de producto: `calculadoras/salario-neto.html`, `assets/js/salario-neto-receipt.js`, `assets/css/salario-neto-focus.css`. El cambio de `vercel.json` impide el despliegue automático de esta rama. Datos e informe se guardan en esta carpeta; la validación conjunta está en `../validation.json` y su resumen en el [informe general](../README.md).

Casos de referencia independientes: $20.000 − $2.500 − $500 = $17.000; el modo total con $3.000 también da $17.000; añadir $200 de otros pagos conocidos da $17.200; $0,30 − $0,10 − $0,20 = cero, sin residuo negativo de coma flotante. La suite valida también entradas inválidas, comparación de depósito y conservación del resto del sitio.

## Seguimiento y pendientes

Registrar la fecha real de publicación. A los 7 días comprobar URL, canonical e indexación; a los 28 días comparar ventanas iguales y misma búsqueda Web, URL, país y dispositivo; a los 60 días evaluar persistencia y estacionalidad. Separar consultas de cálculo, información e inversa. No extrapolar el subconjunto de consultas al total GSC. Resolver la discrepancia de dimensiones en la siguiente exportación.

Pendientes de validación externa: entrega de anuncios, redirecciones finales de afiliados y Core Web Vitals de campo. Un cálculo fiscal completo de ISR/subsidio/IMSS no se incorpora por defecto al reconciliador: requiere otro alcance, datos suficientes y pruebas propias. El crecimiento de rankings, impresiones, clics o CTR todavía debe medirse.
