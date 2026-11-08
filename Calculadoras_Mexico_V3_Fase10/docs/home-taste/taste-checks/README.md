# Comprobaciones oficiales de Taste Skill

Los scripts oficiales se ejecutaron sin editar el kit. Se utilizó Chromium mediante un wrapper externo al kit que transmite el proxy administrado del entorno, conserva su validación TLS y permite el servidor HTTP local de cada herramienta. El servidor estático de estas herramientas no aplica las rewrites ni cabeceras de Vercel; la suite funcional separada sí las reproduce.

## Layout

Comando ejecutado sobre el build final, después de los ajustes de contraste, tablet y cabecera, con el stress test de H1 habilitado:

```bash
CHROME_PATH=/ruta/al/chromium-del-entorno node .agents/skills/design-taste-frontend/assets/layout/check.mjs \
  --url site-public/index.html --root site-public \
  --profile /ruta/temporal/chrome-layout \
  --sizes 1440x900,1024x768,820x1180,768x1024,390x844 --json
```

Resultado: **exit 1**, 277 observaciones. No se presenta como un PASS del sistema de plantillas Taste. [JSON completo](layout-final.json).

| Regla | Observaciones | Evaluación en este proyecto |
|---|---:|---|
| `edge-left` | 144 | El checker exige posiciones de su retícula de 12 columnas. La home utiliza columnas propias; sus contenedores externos están alineados y se verificaron sin desbordamiento ni superposiciones. |
| `screen-short` | 42 | Directorios, fuentes, FAQs y recursos mantienen la altura que requiere su contenido. No se añade espacio vacío para alcanzar una pantalla completa. |
| `neighbour` | 35 | Es normal que la siguiente sección empiece en la misma pantalla; se priorizó navegación continua y conservación de contenido. |
| `screen-height` | 26 | No se fuerza cada sección a uno o dos múltiplos exactos del viewport, especialmente en móviles. |
| `hero-fold` | 12 | La navegación se llama `.site-header`; el detector calcula `nav: 0`. Además, la altura del buscador y el contenido preservado es flexible. El formulario es visible y operable, sin recortar contenido. |
| `hero-maxchars` | 12 | El mismo criterio de altura fija aplicado a un H1 sustituido por la herramienta. El H1 real se conserva por SEO y se probó en los seis anchos de la suite funcional. |
| `sparse` | 4 | Corresponden a `.taste-trust`, cuya densidad de contenido es de 42–46%. Se conserva el espaciado de la banda de fuentes; no se amplía ni duplica texto para cumplir una densidad de plantilla. |
| `neighbour-ground` | 1 | Una sección contigua puede tener otro fondo; es parte del ritmo visual deliberado. |
| `spill` | 1 | La etiqueta publicitaria móvil usa un margen de 8 px frente a 16 px del contenido editorial. Permite alojar el iframe oficial de 300 px en pantallas de 320 px. No sale del viewport ni genera scroll horizontal del documento. |

Las adaptaciones se decidieron en [PLAN.md](../PLAN.md) antes de construir. Las restricciones explícitas de conservar contenido, funcionalidad, publicidad y evitar vacíos innecesarios prevalecen sobre las alturas rígidas y convenciones de una landing nueva.

## Consistency

Se ejecutó el checker completo, sin `--quick` ni exclusiones, a 1440, 1024, 820, 768 y 390 px, con ritmo en 1440/820/768/390. También barrió 1280/1152/896 px, probó movimiento reducido (14 pantallas), contenido sin IntersectionObserver (14 pantallas) y carga móvil lenta (28 posiciones).

```bash
CHROME_PATH=/ruta/al/chromium-del-entorno node .agents/skills/design-taste-frontend/scripts/consistency.mjs \
  site-public/index.html --root site-public --widths 1440,1024,820,768,390 \
  --rhythm-widths 1440,820,768,390 --profile /ruta/temporal/chrome-consistency \
  --page software --category calculadoras --primary 'Buscar calculadora' --out /ruta/temporal/review --json
```

La revisión anterior al último pulido produjo **336 FAIL y 105 WARN**, exit 1. Se conserva íntegra en [consistency-review.json](consistency-review.json). No es un certificado de aprobación del diseño ni una comprobación posterior a las correcciones.

Cambios derivados de esa revisión:

- `text-contrast`: el texto secundario superaba AA, pero no el criterio 7:1 de Taste. Se oscureció a `#3d4f67`: 7,30:1 sobre `#eaf0fa`, 7,85:1 sobre `#f5f8fc` y 8,36:1 sobre blanco. El modo oscuro conserva su color claro.
- `row-gap`: la última herramienta dejaba media fila vacía en tablets. Ahora ocupa la fila completa, igual que en escritorio; en móviles estrechos es una fila normal de una columna.
- `motion-layer`: se retiró el marcador `data-motion` que anunciaba la hoja oficial sin cargarla. Las microinteracciones propias siguen limitadas a la home y se verifican con puntero y movimiento reducido en la suite funcional. No se añade una dependencia global para satisfacer el nombre de archivo esperado.

Observaciones conservadas con justificación:

| Grupo | Interpretación y límite |
|---|---|
| `assets`, `empty-visual` | Cinco recursos de publicidad/afiliación bloqueados por el proxy administrado y el endpoint de Vercel Insights ausente en el servidor estático. Se conservan los códigos reales; no se presenta su entrega como comprobada. |
| Alturas, ritmo, `hero-fill`, `fold-cut`, `one-section`, `one-heading` | Exigen secciones de una pantalla, sin el siguiente título en el pliegue. Aquí se conserva un directorio largo con alturas naturales. Un título que continúa al hacer scroll no implica texto recortado por CSS. |
| `no-visual`, `text-only`, `card-visual` | FAQs, fuentes y recursos útiles no reciben fotografías decorativas ni dashboards ficticios para satisfacer una plantilla de marketing. El buscador principal sí funciona con el catálogo real. |
| `heading-scale`, `copy-headings`, `copy-actions` | Encabezados de secciones, rótulos de navegación y nombres de herramientas tienen escalas distintas. El detector no reconoce nombres en español como «Horas extra». Se conserva la taxonomía y los accesos directos del catálogo. |
| `button-styles`, `cta` | Se distinguen acciones primarias, enlaces de consulta, publicidad y controles de estado. El cierre principal está en el footer y no se duplica al final del bloque SEO anterior. |
| `container-edges`, `off-grid`, `row-lines`, `split-pair` | Retícula propia y padding interior deliberado; publicidad móvil con margen de 8 px para alojar su iframe de 300 px. Los controles y el documento se verifican sin desbordamiento. |
| `section-gaps`, `hole`, `section-air` | Espacio reservado de anuncios y composición asimétrica. Se mantiene la reserva de altura y se corrigió el hueco no intencional de la cuadrícula tablet. |

El checker sí marcó PASS en ausencia de desbordamiento del viewport, solapamiento de texto, texto cortado por cajas, enlaces, formularios, carga de fuente, movimiento reducido y contenido oculto. El barrido intermedio no encontró incidencias. El resultado global continúa siendo FAIL por las observaciones detalladas; no se modificaron los validadores.

## Rendimiento local

`perf.mjs` se ejecutó con sus tres cargas por ancho (1440/390) sobre la base y sobre el build final, usando el mismo wrapper. [Base](baseline-perf.json) · [final](final-perf.json) · [log final](final-perf.log).

| Medición local, mediana | Base 1440 | Final 1440 | Base 390 | Final 390 |
|---|---:|---:|---:|---:|
| LCP, CPU local | 168 ms | 136 ms | 160 ms | 124 ms |
| CLS de la sesión local | 0,000 | 0,000 | 0,000 | 0,000 |
| Tiempo bloqueado | 0 ms | 0 ms | 16 ms | 0 ms |
| Transferencia registrada | 75,8 KiB | 84,2 KiB | 75,3 KiB | 83,7 KiB |

La fuente variable local añade 29,6 KiB; pese a reducir el CSS, la transferencia total observada aumenta aproximadamente 8,4 KiB. Es el coste de la tipografía propia y del buscador. Las muestras LCP tienen dispersión y se solapan (1440: base 152–376 ms, final 124–316 ms); no prueban una mejora estadística ni anticipan el comportamiento con anuncios reales. No se midió INP de campo.

Ambas versiones terminaron **exit 1 por las mismas seis solicitudes no disponibles**: redes publicitarias bloqueadas y Vercel Insights ausente en el servidor local. Hay una advertencia del detector de imagen no lazy referida al logo; el logo visible de la cabecera se mantiene con carga inmediata. No se ocultan ni eliminan solicitudes para conseguir un PASS.

## Capturas oficiales

`shoot.mjs` finalizó con código 0 en 1440×900 y 390×844, con captura completa por segmentos. [Registro, dimensiones y hashes](shoot-final.json) · [log escritorio](shoot-final-1440.log) · [log móvil](shoot-final-390.log). Se usaron perfiles propios y no se modificó el kit. Estas capturas locales conservan la limitación de carga de anuncios del proxy.

Las ocho imágenes incluidas en `../capturas/` proceden de la suite funcional sobre el mismo build final, con cabeceras y rewrites de Vercel y banners simulados rotulados. Incluyen escritorio, móvil, tablet y modo oscuro.

## Validación independiente

[La suite del proyecto](../validation.json) comprueba el resultado con las rutas y CSP reales: 12 combinaciones de ancho/tema, ocho análisis axe sin infracciones detectadas, cuatro integraciones comerciales, búsqueda y navegación por teclado, estado local, comparación de calculadoras y recursos previos. Sus imágenes publicitarias son simuladas y están identificadas como tales.

Los valores de rendimiento son de laboratorio local, sin representar carga real de publicidad ni mediciones de usuarios. No se certifican rankings, conversiones, ingresos ni Core Web Vitals de campo.
