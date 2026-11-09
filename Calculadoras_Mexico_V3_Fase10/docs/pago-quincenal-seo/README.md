# Pago quincenal: optimización SEO y funcional

Implementación finalizada el **9 de noviembre de 2026**, sobre el commit `3cc4e59a21192bdcdaf3f68974e914c942701a02`. Rama: `codex/seo-pago-quincenal-2026-11-08`, creada al iniciar el trabajo. Única URL de contenido modificada: **`/calculadoras/pago-quincenal.html`**. La rama hereda las mejoras de salario diario, la home Taste y el trabajo anterior de SEO y monetización. No se ha publicado en Vercel ni modificado `main`.

## 1. Datos analizados y diagnóstico

Se analizaron todas las **143 consultas GSC** y los **18 registros SEMrush** del ZIP, correspondientes a 16 keywords normalizadas distintas. La [matriz de oportunidades](matriz-oportunidades.csv) contiene 149 filas: las 143 consultas originales y seis keywords SEMrush sin coincidencia. Conserva posición, impresiones, clics, CTR, volumen, KD, intención, prioridad y URL objetivo cuando existen esos datos. Una ausencia no se convierte en cero.

Documentación reproducible: [análisis de datos y periodos](DATOS.md), [línea base y hashes de archivos](linea-base.json), [consultas GSC](gsc-consultas-original.csv), [18 registros SEMrush](semrush-original.csv).

GSC abarca **5 de agosto–7 de noviembre de 2026**, 95 días, búsqueda Web y URL exacta. Página y gráfico registran **115 clics, 18.566 impresiones, CTR 0,6194% y posición media 5,05**. Sin embargo, consultas, países y dispositivos suman solo **2 clics y 1.347 impresiones**. El archivo no permite explicar esa discrepancia; no se atribuye únicamente a consultas anónimas ni se extrapola el detalle al total.

SEMrush aporta estimaciones de volumen/KD, no métricas de Google. Sus fechas literales incluyen día/mes sin año; no permiten reconstruir una serie temporal ni asegurar posiciones actuales. «como calcular mi isr quincenal» figura en posiciones **7 y 15** con la misma URL y fecha literal: son dos observaciones ambiguas, no una caída o subida demostrada. Se conserva esa oportunidad como prioridad de protección. No hay datos de Bing en este paquete.

Diagnóstico funcional previo: el contenido explicaba mensual ÷ 2 y diario × 15, pero el formulario solo recibía sueldo mensual. La calculadora no retenía ISR ni IMSS. La mejora principal resuelve esa diferencia entre contenido y funcionalidad sin convertir la página en otra calculadora fiscal.

## 2. Keyword principal y oportunidades implementadas

**Principal: calculadora de pago quincenal.** Secundarias: cálculo de sueldo quincenal, sueldo mensual a quincenal, salario diario a quincenal, cuánto es la quincena de un sueldo, nómina quincenal y diferencia entre quincena y catorcena. ISR quincenal y quincenas por año reciben respuestas complementarias acotadas.

Todas las acciones de esta tabla corresponden a `/calculadoras/pago-quincenal.html`. Las posiciones son históricas, no resultados posteriores a la implementación.

| Fuente / keyword o grupo | Posición inicial | Impresiones GSC | Volumen / KD SEMrush | Mejora implementada | Finalidad pendiente de medir |
| --- | ---: | ---: | --- | --- | --- |
| SEMrush: como calcular mi isr quincenal | 7 y 15, duplicado ambiguo | — | 30 / 17 | Respuesta con fórmula de tarifa, límites y enlaces a ISR y tablas de 15 días | Proteger relevancia sin duplicar la herramienta fiscal |
| GSC: cuanto es la quincena de un sueldo | 5,85 | 108 | — | Resultado prioritario, operación explícita y ejemplo mensual | Facilitar comprensión y uso |
| GSC: cuanto es a la quincena | 4,54 | 24 | — | Periodo visible y diferencia entre bruto y depósito neto | Reducir ambigüedad de la respuesta |
| GSC: cuanto es una quincena | 8,51 | 37 | — | Aclaración de referencia salarial y calendario | Responder la intención sin repetir variantes |
| GSC: cuánto es una quincena | 9,35 | 31 | — | Mismo bloque anterior | Cubrir la misma intención con una sola explicación |
| GSC: seis variantes del ejercicio de $275 | Por consulta, en matriz | 663 en conjunto | — | Ejemplo conservado y enlace que carga $275 diarios en el formulario | Convertir una respuesta informativa en comprobación útil |
| GSC: pagos quincenales según ingreso | 17,00 | 5 | — | Entrada mensual o diaria y desglose | Mejor correspondencia con intención de cálculo |
| SEMrush: calculo de pago quincenal | 43 | — | 30 / 17 | Conversión ampliada y fórmula visible | Reforzar la función principal |
| SEMrush: como se hace una nomina quincenal | 45 | — | 30 / 14 | Cuatro pasos y ejemplo de percepciones menos deducciones conocidas | Explicar alcance sin prometer una nómina fiscal completa |
| SEMrush: calculo de sueldo quincenal | 72 | — | 30 / 25 | Formulario, validación y explicación de bruto | Ampliar relevancia de una misma intención |
| SEMrush: nomina catorcena | 69 | — | 110 / 13 | Comparación desplegable de 14 y 15 días | Aclarar periodicidades distintas |
| SEMrush: cuantas quincenas tiene un año | 73 | — | 22.200 / 38 | Respuesta breve sobre 24 pagos y ciclos de 14 días | Resolver contexto sin transformar la calculadora en un artículo de calendario |

La matriz asigna una prioridad P0 de protección, 19 filas P1 y el resto a consolidación, contexto, protección cauta de muestras pequeñas o exclusión por intención. No se suman volúmenes solapados para pronosticar tráfico.

## 3. Cambios exactos de contenido y SEO

- **Title conservado:** «Calculadora de pago quincenal: ¿cuánto es mi quincena?». **H1 conservado:** «Calculadora de pago quincenal: de sueldo mensual a quincena». Se mantiene la intención y se evita sustituir arbitrariamente elementos recientes sin evidencia de una alternativa mejor.
- **Metadescripción anterior:** «Calcula tu quincena: sueldo mensual ÷ 2 o salario diario × 15. Ejemplos de $10,000 y $15,000 al mes; diferencia entre quincena, catorcena y neto.»
- **Metadescripción nueva:** «Calcula tu pago quincenal desde el sueldo mensual o diario. Consulta el desglose, el ejemplo de $275 diarios y las diferencias con catorcena, ISR y neto.» Se sincronizan descripción social y datos estructurados.
- Introducción y explicación del formulario actualizadas para sus dos entradas reales. Se conservan ejemplos y destinos de enlaces anteriores.
- Ejercicio existente de $275: se puede abrir su escenario con `?salario=275&periodo=diario#calculadora`. El canonical sigue apuntando a la URL limpia; el escenario no añade una entrada al sitemap.
- Explicación de quincena/catorcena: dos pagos mensuales normalmente son 24 fechas anuales; cada 14 días puede generar 26 o 27 según el calendario. La segunda parte de un mes no siempre tiene 15 días naturales. No se calcula automáticamente una nómina incompleta.
- Respuesta «¿Cómo calcular mi ISR quincenal?» con fórmula **cuota fija + (ingreso gravado − límite inferior) × tasa marginal**, seguida de la necesidad de revisar subsidio y ajustes aplicables. El sueldo bruto no se trata automáticamente como base gravable.
- Respuesta «¿Cómo se hace una nómina quincenal?» con cuatro pasos y ejemplo de conciliación: $9.000 de sueldo + $500 adicionales − $1.200 de deducciones ya conocidas = $8.300. Los $1.200 son un supuesto del ejemplo, no un impuesto calculado.
- FAQs de siete a ocho, visibles en HTML y coherentes con `FAQPage`. `WebApplication` describe funciones reales. `WebPage`, `BreadcrumbList`, canonical y robots se conservan. La fecha de revisión editorial refleja este cambio, no una nueva vigencia fiscal.
- No se crean páginas por cantidades ni nuevas URLs indexables. Las respuestas principales permanecen legibles sin JavaScript. No se promete un resultado enriquecido ni una cita en sistemas de IA.

## 4. Mejoras de la calculadora y precisión

La entrada **Mensual** conserva exactamente `mensual / 2` para pago quincenal y `mensual / 30` para referencia diaria. La nueva entrada **Diario** usa `diario × 15` para quincena y `diario × 30` para equivalente mensual. No se redondean resultados intermedios.

El resultado principal sigue siendo el pago quincenal. Conserva copia, exportación, historial, escenarios compartidos y reinicio mediante los componentes existentes. Se añade un desplegable con referencias de 14 y 15 días, con el supuesto de usar la misma cuota diaria. Esa comparación no calcula el depósito contractual ni una oferta salarial anual.

El formulario admite Enter, informa errores y valida importe obligatorio, positivo, hasta un billón de MXN y con hasta dos decimales. El módulo rechaza valores no finitos y periodos desconocidos. Cuando cambia la entrada, se invalida el resultado anterior para evitar mostrarlo como vigente. Los enlaces antiguos con solo `salario` siguen interpretándose como sueldo mensual aunque el navegador haya guardado antes la opción diaria.

| Comprobación independiente | Resultado |
| --- | --- |
| $15.000 mensuales ÷ 2 | $7.500 quincenales |
| $10.000 mensuales ÷ 2 | $5.000; no redondear primero su referencia diaria |
| $8.250 mensuales ÷ 30 | $275 diarios y $4.125 quincenales |
| $275 diarios × 15 / × 14 | $4.125 / $3.850 |
| $333,33 diarios × 15 | $4.999,95 |
| $0,01 mensual | Se conserva internamente 0,005 por quincena y se presentan centavos |

La página **no calcula ISR, IMSS ni neto automáticamente**. Se contrastaron los once rangos oficiales de la tarifa SAT de 15 días de 2026 con `assets/js/tablas.js` y el artículo existente: coinciden. Esa tabla y el motor fiscal permanecen intactos en sus páginas especializadas. [Fuentes, verificación fiscal y alcance legal](competencia-fuentes.md).

## 5. Competencia, enlaces y canibalización

Se investigó contenido comparable de Runa, Nuvvo/MiFiscal, ShiftFlow y Tu Salario MX. Se aprovecharon oportunidades de claridad de periodos, desglose y límites bruto/neto, sin copiar textos ni tomar cifras comerciales como autoridad fiscal. No se verificó un Top 3 localizado de Google ni se midieron sus interfaces móviles; la [investigación](competencia-fuentes.md) distingue estos límites.

El export de una sola URL no demuestra canibalización real. La distribución de intenciones se mantiene:

- Pago quincenal: importe de la quincena y conversión mensual/diaria.
- Salario diario: obtención de cuota diaria y conversiones entre periodos.
- Salario neto: bruto, deducciones y resultado neto.
- Calculadora ISR y guía ISR semanal/quincenal/mensual: cálculo fiscal y tarifas.
- Quincenas a meses: conversión de duración; presupuesto quincenal: planificación del ingreso.

Se preservan todos los destinos anteriores y se añaden enlaces contextuales a las herramientas y fuentes correctas. No se cambian canonicals, redirecciones ni otras páginas para tratar un conflicto no demostrado.

## 6. Frontend y monetización protegidos

Se conserva la composición profesional existente, tipografía, componentes, controles y logo original. Los ajustes de color azul, foco y comparación de resultados están aislados mediante el selector de esta página en un CSS de 1.367 bytes. No se cambia el diseño de otras URLs.

Se verificó una instancia de cada integración: Adsterra `409e3950cb7b10082bb628969be6611a`, Adsterra `94dbe87812d642e0600cc58986b093c2`, AliExpress `qpw0xm1c34934a2368b316525dc3e8` y Sol Crédito `9k0cwagbas934a2368b3bd6fe4c78f`. Se conservan parámetros, identificación comercial, scripts y código compartido. No se añaden anuncios, nuevos proveedores ni formatos intrusivos.

## 7. Comparación técnica antes/después

| Elemento | Antes | Después |
| --- | ---: | ---: |
| Periodos de entrada | 1 | 2 |
| Comparación calculada 14/15 días | No | Sí, desplegable |
| FAQs visibles y marcadas | 7 | 8 |
| HTML compilado, bytes | 40.669 | 45.434 |
| JavaScript local referenciado por HTML, bytes | 93.924 | 67.362 |
| CSS local referenciado por HTML, bytes | 184.120 | 185.487 |
| HTML + JS + CSS, gzip estimado por archivo | 72.878 | 68.581 |
| LCP local, una muestra sin limitación de red | 188 ms | 152 ms |
| CLS local, misma prueba | 0 | 0 |

El ahorro de JavaScript procede de cargar un módulo específico de esta calculadora en lugar del motor general. El motor compartido sigue intacto para otras páginas. El contenido añade HTML y un CSS pequeño, sin nuevas dependencias.

Los tamaños del [comparativo](comparativo-tecnico.json) excluyen recursos remotos, cabeceras y dependencias insertadas dinámicamente. Las mediciones de navegador son una muestra local por versión, con terceros simulados, sin limitación de CPU/red y sin significación estadística: **no demuestran una mejora de Core Web Vitals en producción**. INP de campo no se midió.

## 8. Pruebas realizadas

- `node scripts/build-public.cjs`: compilación correcta, **490 archivos públicos**. Datos privados de trabajo, CSV y reportes quedan fuera del build.
- `node scripts/test-pago-quincenal-seo.cjs`: **PASS**. Nueve casos aritméticos, dieciséis entradas rechazadas, formulario mensual/diario, Enter, errores, persistencia, enlaces de escenarios nuevos/antiguos, guardado y reinicio.
- Navegador Chromium: **320, 390, 768 y 1.440 px**, cada uno en modo claro y oscuro. Ocho combinaciones sin desbordamiento horizontal. Cuatro auditorías axe del contenido `main` (390/1.440 px y ambos temas), sin infracciones detectadas en ese alcance.
- Sin excepciones JavaScript de página ni recursos locales ausentes detectados por la suite. Explicaciones y enlaces principales comprobados sin JavaScript.
- Preservación exacta frente al commit base: **407 HTML públicos restantes y 80 recursos anteriores**, sin cambios. La única página de contenido modificada es pago quincenal.
- Canonical, robots, un H1, datos estructurados coherentes, destinos anteriores, enlaces y anclas internas comprobados. Una instancia de cada una de las cuatro integraciones comerciales.
- `scripts/check-phase6-release.py`: **379 URLs indexables**, PASS; cero enlaces rotos, páginas inaccesibles/huérfanas detectadas ni discrepancias de sitemap. [Salida completa](seo-release.json).
- Sintaxis JavaScript y `git diff --check`: correctos.

[Resultados detallados](validation.json) · [captura móvil del resultado](pago-quincenal-390.png) · [captura escritorio del resultado](pago-quincenal-1440.png).

Los scripts Adsterra se simularon con respuestas vacías y sus banners Admitad con imágenes rotuladas de prueba. Otros terceros se bloquearon en el navegador de QA. No se verificaron entrega real de publicidad, redirecciones finales de afiliados, impresiones, conversiones ni ingresos. Las restricciones de red del entorno impiden usar estas pruebas como validación comercial en vivo.

Reproducir después del build: `node scripts/test-pago-quincenal-seo.cjs`. Requiere Playwright, Chromium y axe-core; admite `CHROMIUM_PATH`, `AXE_PATH`, `QUINCENAL_QA_DIR` y `QUINCENAL_BASE_COMMIT`. La auditoría Python requiere las dependencias de análisis HTML del proyecto.

## 9. Archivos modificados

- `calculadoras/pago-quincenal.html`: formulario, metadescripción, explicaciones, FAQ, fuentes y datos estructurados.
- `assets/js/pago-quincenal.js`: conversión aislada, validación y presentación de resultados.
- `assets/css/pago-quincenal.css`: ajustes específicos sin extender el diseño a otras páginas.
- `scripts/test-pago-quincenal-seo.cjs`: verificaciones reproducibles de cálculo, HTML, navegador y preservación.
- `vercel.json`: añade la desactivación de despliegue automático para esta rama; conserva las rutas y cabeceras.
- `docs/pago-quincenal-seo/`: matriz, originales normalizados, fuentes, línea base, comparativo, pruebas, capturas e informe.

La excepción al alcance de una URL es `vercel.json`, necesaria para mantener separado el guardado en GitHub de la publicación. El PR se dirige a la rama anterior de salario diario para que muestre solo esta intervención. El ZIP de la nueva rama contiene el proyecto completo con sus mejoras heredadas; una nueva rama no incorpora automáticamente cambios futuros realizados en otras ramas.

## 10. Pendientes y seguimiento en Search Console

Pendientes: publicación autorizada, comprobación de anuncios/afiliados en la web real, métricas de campo y diagnóstico de la discrepancia del export GSC. Para afirmar canibalización se necesitará una exportación compatible de consulta × página × fecha. No se requiere crear nuevas páginas con la evidencia actual.

Registrar la **fecha real de despliegue**, distinta de esta fecha de implementación. A los **7 días**, comprobar URL publicada, canonical elegido por Google, rastreo, indexación, errores y utilización móvil. A los **28 días**, comparar ventanas iguales con filtro exacto de página y búsqueda Web; separar dispositivo y país solo con datos compatibles. Examinar clics, impresiones, CTR y posición conjuntamente.

Agrupar consultas por pago/sueldo quincenal, ejercicio de $275, ISR y calendario. Mantener separado el agregado de página del subconjunto de consultas. Proteger primero búsquedas cercanas al top 3/top 10 y verificar que ISR no pierde relevancia; no inferir cambios de una sola impresión ni confundir el rango SEMrush con posición media GSC.

A los **60 días**, revisar persistencia, estacionalidad y nuevas consultas pertinentes antes de volver a cambiar títulos. Evaluar si la entrada diaria mejora interacción y uso del cálculo con la analítica existente, sin confundir interacciones con tráfico o conversiones de afiliados. Este trabajo implementa mejoras justificadas; el crecimiento de posiciones, CTR y clics aún debe medirse.
