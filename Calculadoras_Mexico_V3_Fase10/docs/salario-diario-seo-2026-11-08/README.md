# Optimización de salario diario — 8 de noviembre de 2026

Implementada sobre `3a7a4f8`, la versión que reúne SEO/GEO, monetización y la home Taste. Rama `codex/seo-salario-diario-2026-11-08`. Única URL de contenido modificada: `/calculadoras/salario-diario.html`. No se despliega ni se modifica main. El ZIP de esta rama incluirá también el trabajo anterior; el PR se dirige a la rama de origen para mostrar solamente esta intervención.

## Diagnóstico y decisiones

Se analizaron las 132 consultas GSC y las 11 keywords SEMrush del paquete. [Datos y periodos](DATOS.md) · [matriz de 134 filas](matriz-oportunidades.csv) · [línea base](linea-base.json). Veinte consultas reciben prioridad P1; las variantes se agrupan por intención, sin crear páginas ni FAQs por cada cantidad.

GSC histórico, 5 ago–7 nov de 2026: 151 clics, 26.380 impresiones, CTR 0,5724%, posición media 4,94 a nivel página. Consultas, países y dispositivos solo suman 2 clics/618 impresiones. La causa de esa discrepancia no es comprobable en el archivo. El informe conserva ambos niveles y no extrapola. SEMrush no muestra keywords en top 20 en este export y sus fechas no permiten comparar directamente con la ventana GSC.

**Keyword principal:** calculadora de salario diario. Secundarias: cómo calcular el salario diario, cuánto gano por día, salario semanal a diario, sueldo mensual a diario, salario diario a mensual y salario semanal a mensual. El enfoque se mantiene en sueldo ordinario, sin incorporar un cálculo fiscal o SDI.

| Consulta GSC | Impresiones | Posición histórica | Mejora implementada | Finalidad esperada, pendiente de medir |
|---|---:|---:|---|---|
| si gano 2500 a la semana cuanto gano al mes | 49 | 9,67 | Tabla con tres referencias y cálculo interactivo | Responder la conversión con supuestos explícitos |
| si gano 2000 a la semana cuanto gano al mes | 38 | 6,16 | Tabla ampliada y equivalentes calculados | Claridad de respuesta y relevancia |
| si gano 3000 a la semana cuanto gano al mes | 35 | 8,00 | Ejemplo comparable, 30 días/365 días/52 semanas | Cobertura de la intención compartida |
| si gano 2300 a la semana cuanto gano al mes | 27 | 6,19 | Nueva fila, operación y enlace al escenario | Facilitar el uso de la herramienta |
| por cuanto se multiplica el salario diario para sacar el mensual | 27 | 6,81 | Entrada diaria y resultado de 30 días | Resolver la conversión inversa |
| como saber cuanto gano por dia | 20 | 7,55 | Respuesta inicial conservada y resultados explicados | Preservar intención diaria y utilidad |
| como calcular el salario diario si me pagan por semana | 18 | 21,06 | Subtítulo específico, divisor y desglose | Mejor correspondencia con la búsqueda |

Los [cuatro competidores investigados y las fuentes oficiales](competencia-fuentes.md) aportan referencias funcionales; no se certifican posiciones top 3 de Google. Se verificaron los artículos 84/89 LFT y 27/29 LSS, con sus contextos de indemnización y cotización. No se copiaron textos ni cifras fiscales de competidores.

## Implementación

- Se mantienen el title **«Calculadora de salario diario: sueldo mensual o semanal»** y el H1 **«Calculadora de salario diario: ¿cuánto gano al día?»**. La muestra no justifica reemplazar un título reciente antes de medirlo.
- Metadescripción anterior: «Calcula cuánto ganas al día: sueldo mensual ÷ 30, quincenal ÷ 15 o semanal ÷ 7. Ejemplos de $2,500 por semana y diferencias con salario integrado.»
- Metadescripción nueva: «Calcula tu salario diario desde sueldo mensual, quincenal o semanal. Compara equivalencias de 30 días y promedios anuales, con ejemplos en pesos mexicanos.» Se sincronizan descripción social y JSON-LD.
- El formulario admite mensual, quincenal, semanal y **diario**, conserva IDs, persistencia, escenarios compartidos y acciones del resultado. Enter envía el formulario. Se validan vacíos, negativos, cero, importes no finitos, periodo inválido, centavos y límite explícito de entrada.
- Se preservan divisores 30/15/7 y se añade divisor 1 para entrada diaria. El salario diario sigue siendo el resultado principal. Se añaden equivalencias de 7, 15 y 30 días, y un desplegable de tres métodos mensuales, con operaciones y advertencias concretas.
- El cálculo no redondea resultados intermedios. Ejemplo: $2,300 ÷ 7 × 30 = $9,857.14; redondear primero $328.57 produciría otra cifra. 52 semanas representan 364 días, por eso difieren del modelo de 365 días.
- Tabla existente ampliada de cuatro a cinco importes y de tres a cinco columnas; se conserva la fila $3,500. Nuevo caso $2,300 y enlace a su escenario. Se explica el cobro real de cuatro o cinco depósitos, separado del promedio mensual.
- Dos FAQs nuevas (ocho en total), visibles y coherentes con su schema. No se promete un resultado enriquecido. WebApplication describe las funcionalidades reales. Fecha de revisión editorial actualizada al día del cambio; no se inventa una nueva actualización fiscal.
- Se conserva el piloto visual y se recuperan tokens azules solamente en esta página; tipografía, distribución y logo original permanecen. Se retira el filtro cromático del logo. Los nuevos controles usan el sistema existente y el modo oscuro.
- La página carga un módulo pequeño propio en lugar del motor de todas las calculadoras. El archivo compartido permanece intacto y sigue atendiendo las demás páginas. No se agrega ninguna dependencia ni servicio externo.

## Enlaces y canibalización

La misma URL cubre conversión de sueldo por periodos. Pago quincenal conserva intención de 15 días; salario neto revisa deducciones; salario por hora interpreta jornadas; SDI integra prestaciones y SBC corresponde a reglas de seguridad social. Se conservan los destinos anteriores y se refuerzan enlaces contextuales a pago quincenal y a la guía de salario bruto/neto. El ejemplo $2,300 utiliza parámetros de escenario, con el canonical original sin parámetros; no se crea una URL indexable nueva ni se agrega al sitemap.

No se editó otra página para perseguir ISR semanal, términos genéricos ni variantes numéricas. La matriz marca esas consultas como relacionadas o sin objetivo editorial.

## Comparativo técnico

| Elemento | Antes | Después |
|---|---:|---:|
| Periodos de entrada | 3 | 4 |
| Referencias mensuales calculadas | 0 | 3, con supuestos |
| FAQs visibles y marcadas | 6 | 8 |
| HTML compilado (bytes) | 37283 | 42612 |
| JavaScript local solicitado (bytes) | 93924 | 67550 |
| CSS local solicitado (bytes) | 184120 | 185690 |
| HTML + JS + CSS, gzip estimado | 71813 | 67839 |

[Datos de tamaño](comparativo-tecnico.json). Son tamaños de archivos locales, no transferencia total con anuncios ni Core Web Vitals de campo. La tabla ancha tiene scroll en su región con nombre accesible; no se ocultan columnas ni contenido a los buscadores.

## Pruebas y límites

La auditoría técnica [seo-release.json](seo-release.json) revisa 379 URLs indexables: PASS, sin incidencias de enlaces, sitemap, canonical o datos estructurados detectadas. El build produce 488 archivos públicos; las exportaciones y reportes quedan fuera.

**Resultado final: PASS.** Diez casos aritméticos válidos y 17 rechazos; ocho combinaciones de 320/390/768/1440 px en claro y oscuro, incluidas comparaciones mensuales desplegadas, sin desbordamiento horizontal. Cuatro análisis axe del contenido principal sin infracciones detectadas. Sin errores JavaScript propios ni recursos locales ausentes. Se verificaron Enter, persistencia, parámetros de escenarios, guardado, reinicio y lectura de explicaciones sin JavaScript. Los otros 407 HTML y 78 recursos públicos previos coinciden con la base.

Capturas: [móvil](salario-diario-390.png) · [escritorio](salario-diario-1440.png).

La [suite funcional](../../scripts/test-salario-diario-seo.cjs) verifica cálculos, casos inválidos, DOM, metadatos, FAQ, publicidad y preservación del resto del sitio. Sus resultados finales, capturas y mediciones locales se registran en [validation.json](validation.json). Los anuncios externos se simulan explícitamente en pruebas; no se afirma entrega real, conversiones ni ingresos. La red del entorno limita proveedores publicitarios.

Reproducir: `node scripts/build-public.cjs`, `node scripts/test-salario-diario-seo.cjs` y `PYTHONPATH=/ruta/a/dependencias python scripts/check-phase6-release.py`. El test de navegador requiere Playwright, Chromium y axe-core; acepta `CHROMIUM_PATH`, `AXE_PATH` y `SALARY_QA_DIR`.

La medición local de navegador usó una sola carga por versión, sin limitación de velocidad y con terceros simulados: baseline.test: LCP 184 ms, CLS 0; current.test: LCP 148 ms, CLS 0. La muestra no demuestra una mejora de rendimiento ni representa INP o Core Web Vitals de usuarios reales.

## Archivos modificados

- `calculadoras/salario-diario.html`: contenido, metadescripción, formulario, fuentes y schema.
- `assets/js/salario-diario.js`: cálculo aislado, validación y explicación de resultados.
- `assets/css/salario-diario.css`: tokens azules y estilos aislados de controles/resultado.
- `scripts/test-salario-diario-seo.cjs`: validación reproducible.
- `vercel.json`: desactiva el despliegue automático de esta rama; rutas y cabeceras conservadas.
- `docs/salario-diario-seo-2026-11-08/`: matriz, fuentes, análisis, pruebas y reporte.

## Seguimiento

Registrar la fecha real de publicación. A los **7 días**, comprobar rastreo, canonical y ausencia de regresiones. A los **28 días**, comparar ventanas equivalentes y grupos de consultas con los mismos filtros; revisar CTR, impresiones, clics y posición sin mezclar el agregado con el subconjunto de consultas. A los **60 días**, evaluar persistencia, estacionalidad y términos que sí ganaron visibilidad antes de hacer nuevos cambios de title. Resolver primero la discrepancia de dimensiones de futuras exportaciones. Las métricas históricas no demuestran mejoras causadas por este cambio.
