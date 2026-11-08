# Optimización integral V2 — Calculadoras México

Implementación y revisión del 6–7 de noviembre de 2026. Repositorio **Cloud-codex**, rama `codex/optimizacion-integral-v2-2026-11-06`, base de esta iteración `c57dbf2`. No se modificó `main` ni se publicó en Vercel. La rama incorpora el trabajo SEO/afiliados anterior; un PR hacia `main` será acumulativo, no solamente el último commit.

## Resultado y alcance real

| Área | Resultado |
|---|---|
| HTML publicados por la compilación | 408 archivos: 407 páginas para visitantes y 1 token de verificación de Google |
| Cuatro integraciones comerciales | 407/407 páginas para visitantes |
| URLs indexables auditadas | 379 |
| Nuevas mejoras editoriales SEO | 10 URLs, 13 HTML incluyendo fallbacks |
| Keywords SEMrush reforzadas explícitamente | 15 pares / 15 keywords, más oportunidad GSC de página para SPEI devuelto |
| Muestra SEMrush reclasificada | 1,043 pares, 914 keywords, 119 URLs observadas |
| Rediseño | Exactamente 5 páginas |
| Fuentes utilizadas | Las 14 exportaciones originales; datos Google y Bing separados |

El proyecto es un sitio estático HTML/CSS/JavaScript. `node scripts/build-public.cjs` prepara `site-public/`; no utiliza un framework ni necesita un bundler de frontend. La publicidad se incorpora al HTML durante esa compilación, de modo que no necesita JavaScript propio para insertar tarjetas ni ocultar contenido editorial a buscadores.

**La integración de código está comprobada; la entrega real de anuncios y el cumplimiento de densidad requieren una vista previa con las redes reales.** El entorno no permitió cargar los recursos de bauval.org/Admitad. No se afirma que banners reales, ingresos, rankings ni Core Web Vitals de producción hayan mejorado. [Políticas, límites y medición](politicas-y-medicion.md).

## Publicidad anterior y nueva

| Integración | Base de esta iteración | Salida compilada V2 |
|---|---:|---:|
| Adsterra nativo `409e3950cb7b10082bb628969be6611a` | 3 documentos | 407, una instancia por documento |
| Adsterra iframe 300×250 `94dbe87812d642e0600cc58986b093c2` | 0 documentos | 407, una instancia por documento |
| Afiliados modernos (ambos programas) | 11 tarjetas entre páginas seleccionadas | 407 AliExpress y 407 Sol Crédito |
| AliExpress anterior con otro enlace de seguimiento | 10 bloques | Sus 10 destinos se conservan dentro de la tarjeta AliExpress correspondiente |
| AdSense | 368 scripts | 368, conservados |

Inventario por archivo, incluidos fallbacks, 404, offline, páginas legales y la excepción del token: [inventario-publicidad.csv](inventario-publicidad.csv). Todas las páginas para visitantes de ese archivo incorporan ambos afiliados y ambos formatos Adsterra. El archivo `google80edc2d8c5006b4e.html` conserva exactamente sus 54 bytes; no es una página editorial ni se debe convertir en una página con anuncios.

La configuración compartida está en `scripts/monetization-v2.cjs`, que reutiliza enlaces y textos de `scripts/affiliate-cards.cjs`. Se reemplazan las instancias comerciales anteriores por una instancia coherente por programa, sin duplicar claves ni perder destinos de afiliación. La transformación es idempotente. No se modifica código de cálculo ni se sustituye AdSense.

Distribución:

- Calculadoras: unidad nativa después del bloque completo de formulario/resultados; afiliados en una separación posterior de contenido cuando existe; banner 300×250 tras el contenido principal y antes del pie.
- Artículos largos: unidad nativa en un corte entre párrafos/listas completos; afiliados en un límite posterior de sección; banner al finalizar el contenido principal.
- Inicio: unidad nativa tras calculadoras populares, afiliados más adelante y banner antes del pie.
- Páginas cortas: se conservan las cuatro integraciones solicitadas, con revisión de densidad pendiente antes de publicar. No se rellenan las páginas con texto artificial.

El banner iframe carga de forma diferida, dentro de un documento `srcdoc` que mantiene la clave, tamaño, formato y script oficial y evita colisiones de `atOptions` en la ventana principal. La unidad nativa conserva el script asíncrono proporcionado. Se reserva altura para ambos formatos. El banner fijo se ubica fuera del contenedor estrecho del artículo para que quepa a 320px.

Los afiliados tienen imagen oficial con dimensiones 300×250, texto informativo, CTA descriptiva, etiqueta de publicidad, aviso de comisión y `rel="sponsored nofollow noopener"`. Sus imágenes inferiores se cargan de forma diferida. El diseño comercial tiene colores accesibles propios en ambos temas; no se confunde con el botón de calcular.

## SEO: evidencia, decisiones y cambios

[Fuentes y periodos](fuentes.md), [matriz completa de keywords](matriz-keywords.csv), [inventario de 379 URLs](inventario-379-urls.csv), [selección priorizada](keywords-priorizadas.csv), [metadatos antes/después](metadatos.md) y [cambios detallados](cambios-seo.json).

Se protegen los snippets Top 3 y las mejoras recientes de salario diario y pago quincenal. Se preservan las 379 URLs, canonicals, reglas robots, destinos de reescritura y estructura útil. La auditoría inicial ya no tenía enlaces rotos, huérfanos ni incoherencias de sitemap: se verificó ese estado, sin atribuir correcciones inexistentes a V2. Un enlace nuevo incorrecto detectado durante el trabajo se corrigió antes de la entrega. No se generan páginas nuevas para variantes de la misma consulta.

| URL | Keyword / evidencia | Posición inicial | Mejora implementada | Impacto que se busca, pendiente de medir |
|---|---|---:|---|---|
| `/calculadoras/salario-neto.html` | calcular sueldo bruto a neto; como calcular ingreso neto | 2; 11 | Protege snippet; explica por qué un mismo neto no permite deducir un bruto único; ejemplos y enlace ISR | Defender intención y aclarar límites del cálculo |
| `/articulos/aguinaldo-por-meses.html` | 8, 4 y 5 meses trabajando | 3; 33; 39 | Mantiene snippet Top 3; ejemplos de 120/150/240 días y límites de aproximar meses | Ampliar long-tail sin mezclar prestaciones ni duplicar URL |
| `/articulos/isr-semanal-quincenal-mensual.html` | tabla ISR semanal; calculadora ISR semanal | 22; 22 | Ejemplo numérico de $3,000 con fila oficial de siete días; separación del subsidio y otras deducciones | Facilitar una respuesta de cálculo verificable |
| `/articulos/isr-prima-vacacional.html` | a la prima vacacional se le quitan impuestos | 45 | Nuevo title/descripción; desglosa bruto, exento, gravado e impuesto sin confundirlos | Alinear snippet y respuesta con la pregunta real |
| `/calculadoras/interes-compuesto.html` | calculadora interes compuesto | 20 | Snippet con aportaciones mensuales; caso tasa cero y explicación de aportación/rendimiento | Aclarar funcionalidades y mejorar relevancia |
| `/articulos/que-es-el-aguinaldo.html` | cuanto dan de aguinaldo | 17 | Descripción específica; sueldo mensual → diario → prestación, bruto/neto y recibo | Contestar la cuantía con supuestos visibles |
| `/articulos/para-que-sirve-constancia-situacion-fiscal.html` | carta de situacion fiscal para que sirve | 16 | Title/descripción, checklist, diferencia frente a opinión de cumplimiento y privacidad | Resolver intención sin confundir documentos fiscales |
| `/articulos/cuanto-se-deja-propina-mexico.html` | propina sugerida; cuanto se debe de dejar de propina | 12; 20 | Voluntariedad, autorización del cargo, reparto y ejemplo sin doble conteo | Mejor respuesta sobre decisión y cálculo |
| `/articulos/spei-liquidado-pero-no-recibido.html` | que significa liquidado en banxico | 26 | Estado vs CEP vs abono, pasos por banco, ejemplo y FAQ con Banxico | Mayor precisión y utilidad en una transferencia pendiente |
| `/articulos/spei-devuelto-que-hacer.html` | GSC: 354 impresiones, 0 clics | 9.3 media de URL, no keyword | Title/descripción, estados de devolución, comprobación de reintegro y FAQ | Mejorar cobertura de una URL visible con CTR bajo |

Las posiciones son del export histórico, no del día del commit. El número de términos trabajados no representa nuevas posiciones obtenidas. Volumen y KD se conservan como estimaciones en las matrices. No se atribuyen las métricas agregadas de página a una consulta individual.

Se actualizan 6 títulos y 8 descripciones en estas diez URLs; el contenido se cambia en las diez. Hay 6 relaciones nuevas únicas origen/destino internas, además de enlaces contextuales a destinos ya presentes. Las distinciones bruto/neto, liquidado/devuelto, quincena/catorcena y aguinaldo/prestaciones conservan sus URLs e intenciones. No se demuestra ausencia de canibalización con un análisis estático: se mantienen separados los alcances y se documentan solapamientos de la muestra.

GEO: explicaciones y ejemplos disponibles en HTML, respuestas directas, límites de los resultados, fuentes oficiales y fechas reales de revisión. Se conserva el marcado válido y se sincronizan metadatos/FAQ editados con el contenido visible; no se añade una autoría ficticia ni se promete aparición en AI Overviews. Los `lastmod` se actualizan solo para contenido revisado, incluida privacidad.

## Cinco páginas del piloto visual

Se aplicó la skill instalada [frontend-design](../../.agents/skills/frontend-design/SKILL.md), con plan, crítica y revisión visual registrados en [design.md](design.md).

| URL exacta del sitio | Motivo y cambio | Capturas de la rama |
|---|---|---|
| `https://calculadora-isr-mexico.vercel.app/` | Descubrimiento: jerarquía del buscador, directorio y herramientas | [Móvil](previews/inicio-390.png), [escritorio](previews/inicio-1440.png) |
| `https://calculadora-isr-mexico.vercel.app/calculadoras/salario-diario.html` | Tráfico histórico: lectura, campos y desglose de resultado | [Móvil](previews/salario-diario-390.png), [escritorio](previews/salario-diario-1440.png) |
| `https://calculadora-isr-mexico.vercel.app/calculadoras/pago-quincenal.html` | Tráfico histórico: acción principal y resultado claramente separados | [Móvil](previews/pago-quincenal-390.png), [escritorio](previews/pago-quincenal-1440.png) |
| `https://calculadora-isr-mexico.vercel.app/calculadoras/aguinaldo.html` | Formulario complejo: controles legibles, modos y orientación | [Móvil](previews/aguinaldo-390.png), [escritorio](previews/aguinaldo-1440.png) |
| `https://calculadora-isr-mexico.vercel.app/calculadoras/finiquito.html` | Varios conceptos: dos columnas en escritorio, una en móvil y desglose | [Móvil](previews/finiquito-390.png), [escritorio](previews/finiquito-1440.png) |

Esas son las URLs de destino, **no una afirmación de que la producción ya cambió**. El CSS `pilot-v2.css` se carga solo en cinco HTML y todos sus selectores de diseño están bajo `cm-pilot-v2`. Paleta petróleo/verde, tipografías locales, cifras tabulares, foco visible y modo oscuro. No hay fuentes remotas ni animaciones decorativas nuevas. Los cambios comerciales y la corrección técnica de alturas se aplican globalmente; no extienden el diseño editorial del piloto.

Para revisar sin publicar: descargar esta rama completa, ejecutar `node scripts/build-public.cjs` y servir `site-public/` por HTTP (`python -m http.server 8000 --directory site-public`). Abrir las cinco rutas anteriores sustituyendo el dominio por `http://localhost:8000`. Esas cinco rutas no requieren reescrituras. Para todas las demás URLs, la vista previa debe respetar `vercel.json`. No basta abrir los HTML fuente con doble clic: las cuatro integraciones se generan en la compilación. No se debe borrar el repositorio ni subir documentación/exportaciones como archivos públicos.

## Validación y rendimiento

- Build correcto: 483 archivos públicos. Los informes, scripts y exportaciones quedan fuera del directorio servido.
- Preservación: 408 HTML fuente comparados; scripts ejecutables, fórmulas, recursos existentes, campos, canonicals y robots conservados. 368 scripts AdSense y 10 destinos AliExpress anteriores preservados.
- 407 documentos recorridos en Chromium a 320px: cuatro integraciones presentes, sin desbordamiento horizontal del documento ni errores JavaScript propios.
- 50 combinaciones específicas de página/ancho/tema; entre ellas las 30 del piloto. Una unidad nativa, un iframe y dos tarjetas por página; configuración del iframe comprobada con CSP real y sin `atOptions` en el padre.
- 11 calculadoras comparadas contra la base; interés compuesto comprobado adicionalmente, incluidas aportaciones a tasa cero. Se verificaron casos numéricos de salario diario, quincena y neto. No equivale a probar exhaustivamente todos los casos fiscales o laborales.
- Auditoría técnica: 379 URLs indexables, cero enlaces internos rotos, cero huérfanas y cero discrepancias de sitemap. JSON-LD parseable y un H1 por documento público. Se comprobaron 34 preguntas/respuestas marcadas frente al HTML visible en las diez URLs; se corrigieron tres discrepancias heredadas en la guía Qué es el aguinaldo ([evidencia](validacion/faq-visible.json)).
- Axe en el contenido principal: las cinco páginas del piloto pasan los casos evaluados en claro/oscuro. Tres páginas ajenas al piloto mantienen problemas de contraste anteriores; no se declara accesibilidad total del sitio. Se corrigió el foco de la tabla de interés compuesto y el enlace de fuente de propina.
- Eventos: sin consentimiento no se emiten; funcionan vista/clic de tarjeta con consentimiento, y se detienen con retiro o GPC. No se envían importes ni parámetros de URL. No se validaron conversiones de Admitad.

[Resultados de navegador](validacion/browser.json), [preservación estática](validacion/estatico.json), [auditoría SEO](validacion/seo-tecnico.json), [contraste antes/después](validacion/contraste-base-y-revision.json), [mediciones locales](validacion/rendimiento.json).

Se detectaron saltos al desplazarse, causados por la reserva global anterior de 620px de `content-visibility`. Las páginas monetizadas usan ahora las alturas reales de las secciones. En los 50 recorridos evaluados la suma de cambios de layout sin entrada reciente quedó como máximo en 0.04135; no es una medición de campo del CLS. Las imágenes mantienen dimensiones y el banner usa carga diferida.

| Página | LCP local base, mediana ms | LCP local V2, mediana ms |
|---|---:|---:|
| Inicio | 112 | 100 |
| Salario diario | 72 | 164 |
| Pago quincenal | 72 | 100 |
| Aguinaldo | 88 | 120 |
| Finiquito | 80 | 96 |

Tres ejecuciones por versión, Chromium local, 390×900, sin limitar CPU/red, anuncios externos vacíos e imágenes simuladas. CLS inicial observado: 0 en ambos grupos. **No hay una mejora uniforme de LCP**: calcular alturas reales tiene un coste local y evita saltos al desplazar. Estas cifras rápidas y variables no predicen Vercel ni tráfico móvil real. No se midió INP de campo. Deben revisarse LCP/CLS/INP con las creatividades reales y usuarios después de una publicación autorizada.

El CSS comercial ocupa 3,038 bytes (1,145 gzip); el del piloto, 14,510 (3,221 gzip), cargado solo en cinco páginas. No se añade un SDK analítico. Se reutiliza el adaptador opcional de afiliados. La red sigue siendo responsable de sus propios recursos externos.

Comandos principales reproducibles:

```sh
node scripts/build-public.cjs
python scripts/check-phase6-release.py
MONETIZATION_BASE=c57dbf2 node scripts/test-monetization.cjs
V2_BASELINE_DIR=/ruta/checkout-c57dbf2 V2_QA_DIR=/ruta/resultados AXE_PATH=/ruta/axe.min.js node scripts/test-integral-v2.cjs
```

El último necesita Playwright, Chromium y una copia compilada de la base. Los hallazgos de contraste heredados generan estado `ACCESSIBILITY_REVIEW` en el JSON; no se presentan como un PASS general.

## Pendientes y control de versiones

Antes de publicar: comprobar entrega y comportamiento real de ambas unidades Adsterra, los dos banners y destinos de Admitad; revisar densidad con AdSense, consentimientos y canales de contacto. Hay 184 documentos breves con AdSense señalados para revisión en [revision-densidad.csv](revision-densidad.csv); no es un diagnóstico automático de incumplimiento.

El contraste heredado de las dos guías SPEI y la leyenda de interés compuesto queda documentado. No se extendió su rediseño visual fuera del piloto. La expansión del nuevo diseño necesita autorización. No hay datos posteriores a la implementación para atribuir mejoras de SEO o ingresos. El [plan de seguimiento a 7, 28 y 60 días](politicas-y-medicion.md) comienza cuando se publique, separando Google, Bing y cada red.

La rama tiene despliegues automáticos deshabilitados en `vercel.json`. Se conserva el trabajo mediante commit y PR hacia `main`; no se fusiona ni se despliega. [Listado de archivos](archivos-modificados.txt).
