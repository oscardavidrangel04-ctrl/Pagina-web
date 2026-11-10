# Nómina: salario neto y segunda fase de diario/quincenal

Implementación del 9 de noviembre de 2026, sobre `dfe634e`, en la rama `codex/seo-nomina-fase2-2026-11-09`. Tres URLs optimizadas. La rama y su ZIP completo heredan home Taste, monetización y las mejoras SEO anteriores. No se ha desplegado en Vercel ni modificado `main`; la configuración desactiva el despliegue automático de esta rama.

## Informes por URL

| URL | Keyword principal | Trabajo de esta entrega | Informe y matriz |
| --- | --- | --- | --- |
| `/calculadoras/salario-neto.html` | Calculadora de sueldo neto en México; proteger «calcular sueldo bruto a neto» | Deducciones separadas o totales, conciliación de otros pagos, desglose, centavos exactos, metadescripción y explicación fiscal | [Informe](salario-neto/IMPLEMENTACION.md), [datos](salario-neto/DATOS.md), [matriz](salario-neto/matriz-oportunidades.csv) |
| `/calculadoras/salario-diario.html` | Calculadora de salario diario | Cinco escenarios desde la tabla; cuatro/cinco cobros semanales separados de los promedios mensuales | [Informe](salario-diario/IMPLEMENTACION.md), [matriz](salario-diario/matriz-oportunidades.csv) |
| `/calculadoras/pago-quincenal.html` | Calculadora de pago quincenal | Cuatro escenarios desde la tabla; comparación de sumas de 24 pagos de 15 días frente a 26/27 de 14 días; acceso a ISR | [Informe](pago-quincenal/IMPLEMENTACION.md), [matriz](pago-quincenal/matriz-oportunidades.csv) |

Se han revisado **575 consultas GSC y 115 registros SEMrush** entre las tres URLs. Las matrices contienen **587 filas** (304 neto, 134 diario y 149 quincenal), conservando métricas originales, grupos de posición, relevancia, prioridades, acciones y medición pendiente. No son 587 keywords únicas ni 587 cambios de contenido. Las dos matrices previas se amplían con decisiones de fase dos; no se atribuyen observaciones nuevas a los mismos archivos históricos.

## Diagnóstico y decisiones basadas en datos

Los tres exports GSC abarcan 5 agosto–7 noviembre de 2026. Los agregados históricos de página son: neto 6 clics/2.087 impresiones, diario 151/26.380 y quincenal 115/18.566. Sus dimensiones detalladas contienen solo subconjuntos: 2/947, 2/618 y 2/1.347 respectivamente. La causa no es demostrable; no se mezclan estos niveles ni se atribuyen al cambio resultados anteriores.

Neto conserva el enfoque bruto a neto y su título/H1 para proteger la observación SEMrush #2. La posición media GSC de esa misma frase es 22,61; fechas y dimensiones distintas impiden describir una pérdida de posición. Las 312 visitas SEMrush son una estimación de esa keyword, mientras la suma de filas del archivo es 313. En diario/quincenal, los datos no justifican volver a cambiar títulos o añadir las mismas respuestas que ya se implementaron.

La nueva utilidad se concentra en acciones verificables: consultar ejemplos mediante el formulario, distinguir cobros de promedios, evitar duplicar descuentos y comprobar un recibo con centavos exactos. Las consultas informativas siguen complementando a la calculadora. No se crean páginas por cada importe ni se añaden keywords de marcas, años ajenos o prestaciones con otra intención.

## SEO, GEO y exactitud

Se conservan los tres titles, H1, URLs, canonicals, robots y destinos anteriores. Neto actualiza metadescripción social/HTML/schema para reflejar su alcance. Las tablas reciben encabezados de fila y enlaces descriptivos; WebPage referencia la aplicación correspondiente. Las FAQs siguen representando contenido visible; no se añaden respuestas repetidas por variaciones mínimas de consulta.

La información principal, fórmulas, ejemplos y fuentes continúa en HTML. El cálculo de salario neto mantiene importes manuales: no aplica un porcentaje universal ni inventa subsidio, cuota IMSS o salario gravable. Se verifica la distinción entre percepciones, otros pagos y deducciones mediante el estándar SAT; se explica la diferencia del SBC. [Fuentes oficiales, Google y competencia de neto](salario-neto/FUENTES.md), [competencia de diario/quincenal](COMPETENCIA-PERIODOS.md).

No se prueba canibalización con exports filtrados a una sola URL. Se preservan las intenciones de conversión diaria, pago quincenal bruto, conciliación del neto, explicación de tarifas ISR y guía conceptual bruto/neto. No se realizan fusiones, redirecciones ni cambios de canonical.

## Validación y problemas corregidos

- Build de **490 archivos públicos**. Los datos y reportes quedan fuera de la carpeta publicada.
- Suite integrada: **27 casos aritméticos y 37 entradas rechazadas**, además de escenarios antiguos/nuevos, Enter, persistencia, ejemplos, guardado, reinicio y resultados invalidados tras editar.
- **24 combinaciones de pantalla/tema**: tres páginas × cuatro anchuras (320, 390, 768 y 1.440 px) × claro/oscuro. Se revisan también las comparaciones desplegadas, incluidas las sumas nuevas.
- **12 comprobaciones axe** del contenido principal: tres páginas × dos anchuras × dos temas. La suite exige ausencia de infracciones detectadas en ese alcance.
- Conservación exacta de **405 HTML ajenos y 78 recursos públicos anteriores**; sin nuevos archivos públicos. Las cuatro integraciones comerciales siguen presentes una vez por página: ambos Adsterra, AliExpress y Sol Crédito, con sus identificadores y parámetros.
- Auditoría técnica global: **379 URLs indexables**, sin incidencias detectadas de enlaces internos, sitemap, accesibilidad por enlaces o canonicals. [Resultado](seo-release.json).
- Sintaxis JavaScript y revisión del diff sin incidencias. [Suite reproducible](../../scripts/test-nomina-fase2.cjs), [resultados detallados](validation.json).

Durante ejecuciones repetidas se observó intermitencia en la comprobación automatizada de `aria-invalid` al encadenar entradas inválidas de las conversiones. La ejecución final completa pasó; se conserva una espera de estado y diagnóstico en la suite para investigar una eventual recurrencia, sin atribuirla a una fórmula incorrecta.

La validación detectó y permitió corregir el reinicio de campos desde el modo total, el guardado antes de recargar y el rol accesible de las barras del gráfico. También se adaptó la interpretación y el paso a paso a otros pagos: una fórmula incompleta en esos componentes habría contradicho el neto correcto. Los simuladores rápidos advierten que conservan las deducciones; cambiar el bruto no recalcula impuestos.

Las pruebas de navegador simulan scripts Adsterra e imágenes Admitad y bloquean otros terceros. No certifican entrega real, redirecciones de afiliados, impresiones, conversiones ni ingresos. Tampoco certifican accesibilidad de todo el sitio: el alcance axe es el contenido principal de estas tres páginas.

Reproducir: `node scripts/build-public.cjs` y `node scripts/test-nomina-fase2.cjs`. Requiere Playwright, Chromium y axe-core; consultar las variables de entorno al inicio de la suite. `scripts/check-phase6-release.py` requiere las dependencias Python de análisis HTML. Los tests anteriores conservan sus expectativas de alcance de una sola URL; la suite nueva verifica conjuntamente esta intervención de tres URLs y reutiliza sus casos relevantes.

## Rendimiento y revisión visual

El módulo de neto reemplaza en esa URL la carga del motor general; conserva el motor compartido para el resto del sitio. Diario y quincenal añaden únicamente JavaScript pequeño para las comparaciones. No se añaden dependencias externas. [Tamaños y mediciones](comparativo-tecnico.json).

Las mediciones de LCP/CLS son muestras locales antes/después, sin limitación de CPU/red y con terceros simulados o bloqueados. Se publican como comprobación de laboratorio, sin atribuirles una mejora estadística o de Core Web Vitals de producción. INP de campo no se midió.

Capturas finales de los formularios/resultados. Se omite la navegación fija únicamente durante la captura del componente para evitar que tape el recorte; la interfaz del sitio conserva su navegación:

| Página | Móvil | Escritorio |
| --- | --- | --- |
| Neto | [390 px](salario-neto-390.png) | [1.440 px](salario-neto-1440.png) |
| Diario | [390 px](salario-diario-390.png) | [1.440 px](salario-diario-1440.png) |
| Quincenal | [390 px](pago-quincenal-390.png) | [1.440 px](pago-quincenal-1440.png) |

No hay rediseño global. Se conservan componentes y distribución; los ajustes de neto restauran los controles azules, mejoran legibilidad y se limitan a esa página. El logo original permanece.

## Archivos modificados

- HTML: `calculadoras/salario-neto.html`, `calculadoras/salario-diario.html`, `calculadoras/pago-quincenal.html`.
- Lógica: `assets/js/salario-neto-receipt.js`, `assets/js/salario-diario.js`, `assets/js/pago-quincenal.js`.
- Estilos: `assets/css/salario-neto-focus.css`.
- Verificación: `scripts/test-nomina-fase2.cjs`.
- Control de publicación: `vercel.json`, solo desactivación del despliegue de la rama nueva.
- Evidencia y entrega: `docs/nomina-fase2/`.

La tercera instrucción adjunta autoriza expresamente la segunda fase de diario/quincenal junto al trabajo de neto; no se trata de cambios accidentales fuera de alcance. No se editan otras páginas ni fórmulas fiscales compartidas.

## Pendientes y seguimiento

Quedan pendientes la publicación autorizada, entrega real de anuncios/afiliados, métricas de campo y comparación orgánica posterior. La lectura web de producción no demuestra que el nuevo código esté publicado. No se garantiza Top 3, CTR, ingresos ni citas de IA.

Registrar la fecha real de despliegue. A los **7 días**, comprobar URLs publicadas, canonical, rastreo, indexación y ausencia de errores. A los **28 días**, comparar ventanas iguales con los mismos filtros y separar grupos de consulta: bruto/neto, inversa, ISR, conversiones semanales y calendario. Revisar CTR junto con posición e impresiones, sin extrapolar las dimensiones incompletas.

A los **60 días**, evaluar persistencia, estacionalidad y nuevos términos relevantes. Contrastar consulta × página antes de diagnosticar canibalización. Proteger primero las búsquedas cercanas a top 3/top 10 y no volver a cambiar títulos sin evidencia posterior. Las mejoras implementadas amplían utilidad y claridad; el crecimiento de tráfico todavía debe medirse.

## Tamaños medidos de recursos locales

| Página | HTML antes/después | JS antes/después | CSS antes/después |
| --- | ---: | ---: | ---: |
| salario-neto | 40641 / 44950 | 97930 / 70902 | 175592 / 176630 |
| salario-diario | 42612 / 43672 | 67550 / 68663 | 185690 / 185690 |
| pago-quincenal | 45434 / 46217 | 67362 / 68716 | 185487 / 185487 |

Bytes de recursos locales referenciados directamente por HTML compilado, no transferencia completa de anuncios. Las condiciones y muestras locales de LCP/CLS constan en el JSON técnico.
