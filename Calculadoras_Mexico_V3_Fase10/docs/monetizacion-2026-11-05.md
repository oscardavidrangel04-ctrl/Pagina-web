# Monetización contextual — Calculadoras México

## Alcance y procedencia

Implementación sobre `Cloud-codex`, partiendo de `main` en `8e3ba9b96e141a5f05329414fa70ef9a2f12ac29`, en la rama `codex/monetizacion-contextual-2026-11-05`. No se fusiona ni se publica. `vercel.json` desactiva los despliegues automáticos **solo para esta rama** antes de subir el commit. La regla sigue la [configuración oficial de Git de Vercel](https://vercel.com/docs/project-configuration/git-configuration). Las demás ramas conservan su configuración.

Se analizaron los 14 adjuntos, con el inventario, periodos, filtros y limitaciones en [fuentes](monetizacion-fuentes-2026-11-05.md) y [baseline de datos](monetizacion-baseline-2026-11-05.json). No se ejecutaron instrucciones contenidas en los adjuntos ni se publicaron las exportaciones originales.

Search Console general informa 351 clics y 65,059 impresiones en Gráfico (3 agosto–4 noviembre); Páginas informa 352 y 66,428. No se mezclaron dimensiones ni se sumaron los dos XLSX filtrados al general. Salario diario y pago quincenal aportan 133 y 109 clics respectivamente en Páginas. Ambos archivos permanecen idénticos a `main`. Semrush contiene estimaciones y muestras de competidores; no prueba ingresos o conversiones. El ZIP Keyword Magic de salario diario solo tiene cabeceras, sin filas exportadas.

## Inventario anterior y conservación

- 408 HTML versionados; 368 contienen el cargador asíncrono de **Google AdSense**, ID `ca-pub-1606770348282610`, uno por archivo que lo incluye.
- No se encontraron códigos identificables de **Adsterra**: ningún `atOptions`, `invoke.js`, dominio típico de la red, iframe publicitario ni bloque nativo identificado. No se inventaron IDs, unidades ni reemplazos. La prueba compara todos los scripts originales, tanto externos como inline, y exige preservarlos exactamente, independientemente de su proveedor.
- La cantidad efectiva de Auto ads de AdSense depende de la cuenta/red y no se deduce del cargador. No se modificó su configuración ni se promete una cantidad en tiempo de ejecución. Tampoco se dispone de acceso al panel Adsterra: si sirve anuncios desde una integración externa ajena al repositorio, hace falta su inventario para optimizar ubicaciones sin perder unidades.
- Había 11 bloques de texto de AliExpress (sin banner oficial). Se reemplazó el del inicio por una tarjeta en un espacio contextual. Se conservaron los otros diez bloques existentes sin cambios, incluyendo sus enlaces anteriores: no se expandieron en páginas laborales/fiscales ni se retiró monetización existente.
- Los diez bloques heredados están en `calculadoras/aguinaldo.html`, `calculadoras/salario-neto.html`, `calculadoras/salario-hora.html`, `calculadoras/salario-diario.html`, `calculadoras/pago-quincenal.html`, `calculadoras/bono.html`, `articulos/aguinaldo-3-meses.html`, `fallback-aguinaldo-3-meses.html`, `articulos/isr-semanal-quincenal-mensual.html` y `articulos/isr-prima-vacacional.html`. El fallback es una representación de ruta, no necesariamente una segunda impresión.

Resultado: 11 tarjetas nuevas/contextuales y diez bloques heredados conservados; máximo una tarjeta nueva por página. No se eliminó ningún script publicitario. **Ubicaciones de Adsterra optimizadas: ninguna, porque no hay inventario identificable en este código.**

## URLs con las tarjetas nuevas

Las rutas se resuelven bajo `https://calculadora-isr-mexico.vercel.app`.

| Programa | URL | Ubicación |
|---|---|---|
| AliExpress | `/` | Después de Calculadoras populares; navegación y herramientas primero |
| AliExpress | `/calculadoras/descuento.html` | Después de la explicación principal del cálculo |
| AliExpress | `/calculadoras/precio-sin-descuento.html` | Después de la explicación principal |
| AliExpress | `/calculadoras/costo-unidad.html` | Después de la explicación principal |
| AliExpress | `/calculadoras/iva.html` | Después del método y ejemplo de precio/IVA |
| AliExpress | `/calculadoras/iva-incluido.html` | Después del método y ejemplo de precio/IVA |
| Sol Crédito | `/calculadoras/prestamo.html` | Después del método, límites y ejemplo; fuera del formulario y resultados |
| Sol Crédito | `/articulos/costo-total-prestamo-como-calcular.html` | Después del artículo, antes de recursos relacionados |
| Sol Crédito | `/articulos/tabla-amortizacion-prestamo-como-leerla.html` | Después del artículo |
| Sol Crédito | `/articulos/tasa-fija-vs-tasa-variable-prestamo.html` | Después del artículo |
| Sol Crédito | `/articulos/credito-revolvente-vs-prestamo-personal.html` | Después del artículo |

Se excluyeron hipoteca y crédito automotriz: compartir la temática crédito no acredita que el programa ofrezca esos productos. También se excluyeron páginas fiscales generales y laborales de las nuevas ubicaciones. No se ampliaron anuncios de préstamos a páginas de dificultad de pago.

## Programas, permisos y políticas

El propietario confirmó expresamente en esta conversación que Admitad aprobó el sitio para Sol Crédito MX y autorizó textos propios y botones adicionales. Esa es la evidencia de autorización específica; no se ha accedido al contrato ni al panel privado. La [ficha oficial de Sol Crédito](https://www.admitad.com/es-mx/store/offers/sol-credito-mx/) lo describe como intermediario/buscador, no como entidad financiera. El texto conserva esa distinción, pide revisar condiciones y no promete aprobación, tasa, monto ni plazo.

Se usan exclusivamente las URLs entregadas por el propietario, sin añadir subIDs, UTM ni modificar `?i=4`. Banner y botón de cada tarjeta apuntan al mismo enlace. Las condiciones de [AliExpress WW](https://www.admitad.com/store/offers/aliexpress-ww/) y las condiciones privadas de la cuenta siguen aplicando. No se reutilizan descuentos de campañas temporales ni se afirman precios o exclusividad. El banner se carga desde Admitad, sin editar ni alojar una copia de su creatividad.

La presencia de AdSense exige revisar cualquier otro formato contra sus [políticas de ubicación](https://support.google.com/adsense/answer/1346295?hl=es) y [políticas del programa](https://support.google.com/adsense/answer/48182?hl=es). Las redes adicionales no están prohibidas en bloque; los popunders, redirecciones no solicitadas, clics incentivados y confusión con controles sí plantean conflictos. No se introdujeron esos formatos. No se puede certificar la compatibilidad de anuncios de Adsterra no observables en el repositorio.

## Componentes, diseño y rendimiento

- `scripts/affiliate-cards.cjs`: catálogo de programas, URLs oficiales, ubicaciones y plantilla compartida. `scripts/render-affiliates.cjs` genera HTML estático y se puede ejecutar repetidamente sin duplicar bloques ni cambiar el resultado.
- `assets/css/affiliate-cards.css`: estilos acotados a las tarjetas, tema claro/oscuro, una columna en móvil, bordes y separación. El CTA usa contorno y etiqueta Publicidad; se distingue del botón principal de cálculo.
- Imágenes con `width=300`, `height=250`, proporción 6:5, `loading=lazy`, `decoding=async` y prioridad baja. Las tarjetas están después del contenido principal, fuera del primer viewport en los tamaños probados. No hay carga diferida aplicada a recursos principales del sitio.
- El espacio del banner se conserva cuando falla la imagen; el texto y el CTA siguen funcionando. No hay inserción tardía por JS, carrusel, animaciones, observadores globales de cambios del DOM ni nuevos SDK publicitarios.
- Se detectó CLS sintético al descubrir una tarjeta móvil: el CSS global reservaba 620 px para la guía precedente con `content-visibility:auto`. Una regla limitada a `.content-box:has(+ .affiliate-card)` permite medir la altura real de esa guía. No se cambia la regla global ni las páginas protegidas. La repetición dio CLS observado 0 en los 66 casos controlados.
- Nuevos recursos propios: aproximadamente 3.3 KB de CSS y 2.7 KB de JS sin comprimir, solo en las 11 páginas seleccionadas. Cada una añade una imagen externa diferida; el peso de la creatividad real no pudo medirse. No se añade framework ni fuente externa.
- Enlaces `rel="sponsored nofollow noopener"`, aviso de pestaña nueva, foco visible, alt de imagen y declaración de afiliación. No se alteran H1, títulos, descripciones, canonicals, JSON-LD, sitemaps, fórmulas ni scripts originales.

## Medición y privacidad

`assets/js/affiliate-events.js` implementa un adaptador local, **no una conexión ya configurada a un proveedor de analítica**. Emite eventos DOM `cm:affiliate` únicamente si `window.CM_AFFILIATE_ANALYTICS_CONSENT === true`, y respeta DNT y Global Privacy Control. No almacena cookies/IDs ni envía peticiones. No lee formularios, parámetros de URL, datos financieros, correos ni URL de referencia.

Un gestor de consentimiento debe establecer esa variable y emitir `cm:analytics-consent-change` al conceder o retirar el permiso. Un adaptador de analítica propio puede escuchar `cm:affiliate` y enviar solamente `detail` al proveedor ya autorizado. No se supone consentimiento ni se reproduce una cola de eventos anteriores. Sin ese adaptador, **no se acumulan estadísticas ni hay panel de resultados**; su conexión queda pendiente porque no se proporcionó una configuración de consentimiento/analítica para eventos personalizados.

| Evento/dato | Definición y fuente |
|---|---|
| `affiliate_card_view` | Una exposición por tarjeta/documento: al menos 50% del área del banner visible durante un segundo, pestaña visible y permiso activo. Cuenta exposición del componente incluso con imagen bloqueada; no es impresión facturada por Admitad/Adsterra. |
| `affiliate_click` | Clic real en banner/botón o botón central; conserva la navegación normal. No confirma venta ni aprobación de crédito. |
| `affiliate_viewed_card_clicked` | Una tarjeta clicada por documento, solo tras su exposición cualificada. Permite un CTR de tarjetas con numerador y denominador comparables. |
| CTR de tarjetas | `affiliate_viewed_card_clicked / affiliate_card_view × 100`, por programa, ruta, ubicación y versión, en la población con permiso. No confundir con CTR de búsquedas. |
| Conversiones/comisiones | Admitad: conversiones aprobadas, rechazadas, pendientes y comisión confirmada; no inferirlas de clics. |
| Impresiones/ingresos Adsterra | Panel de Adsterra, cuando se identifique el inventario real; no derivarlos del número de scripts. |
| eCPM | Ingresos de la red / impresiones de esa red × 1000, mismo periodo y moneda. |
| RPM por página | Ingresos atribuibles / páginas vistas × 1000; requiere denominador y atribución fiables. Search Console no aporta páginas vistas del sitio. |

Payload permitido: nombre del evento, `program`, `placement`, `variant=contextual-v1`, `path` sin query y `link_type` cuando corresponde. Los clics anteriores a la exposición se registran como clics si hay permiso, pero no se incluyen en el CTR de exposiciones cualificadas.

Comparación propuesta: conservar esta baseline y el día de futura publicación; comparar ventanas de 28 días, segmentando URL/dispositivo/programa y revisando estacionalidad de aguinaldo y campañas de compras. Primero validar carga de creatividad, consentimiento y recepción de eventos; después comparar títulos/ubicaciones de forma secuencial con volumen suficiente. No se afirma haber ejecutado un A/B test ni aumentado ingresos. No hay datos de ingresos, conversiones ni CWV de campo en los adjuntos.

## Validación reproducible y límites

- `node scripts/build-public.cjs`: 480 archivos públicos; documentación, datos y pruebas quedan fuera del directorio publicado.
- `node scripts/test-monetization.cjs`: 408 HTML comparados con la base, 368 scripts AdSense y todos los demás scripts originales conservados; páginas protegidas y JS de cálculo idénticos; atributos y parámetros oficiales correctos; sin duplicación de tarjetas.
- Generador ejecutado dos veces: resultado idéntico. `git diff --check` y comprobación de sintaxis JS correctos.
- `PYTHONDONTWRITEBYTECODE=1 python scripts/check-phase6-release.py`: PASS, 379 URLs indexables, sin enlaces internos rotos ni inconsistencias de sitemap detectadas.
- `check-phase4-topics.py`: FAIL por `/calculadoras/quincenas-a-meses.html` ausente del directorio de temas. Se repitió sobre la copia intacta de `main` y produjo el mismo fallo. No se cambió arquitectura editorial para resolver un problema ajeno a esta tarea.
- Servidor HTTP local sobre `site-public`: inicio, préstamo, CSS y JS nuevos devolvieron 200. Se cerró después de la prueba.
- Navegador: Chromium disponible en `/usr/bin/chromium`, no el binario descargado por Playwright. Pruebas a 320, 390 y 1440 px en claro/oscuro, 11 páginas: 66 combinaciones sin desbordamiento ni errores JS. Comparación de filas numéricas de ocho calculadoras contra `main`, incluyendo salario diario y pago quincenal; no se comparan sellos de tiempo variables.
- El navegador bloquea anuncios y analítica externos y usa una imagen SVG **simulada y rotulada como prueba**. Valida dimensiones, CLS de integración, tarjetas, bloqueo de imagen, consentimiento y retiro/GPC sin generar clics de afiliado reales. Estas pruebas no certifican rendimiento de anuncios reales, LCP/INP de campo ni la creatividad oficial.
- Los GET de ambos banners oficiales y HEAD de ambos enlaces de afiliado devolvieron `Tunnel connection failed: 403 Forbidden` en el proxy. Es una restricción de salida del entorno, no prueba de que los enlaces estén rotos. Se conservan las URLs exactas; la cadena de redirecciones, imagen real y atribución Admitad quedan pendientes de validación desde una red permitida.
- Algunos scripts históricos requieren Playwright en una ruta de Windows y Edge (`C:/Users/Casa/...`, canal `msedge`). Se añadió una prueba portable para esta integración sin alterar las pruebas históricas ni atribuirles resultados no obtenidos.

Ejemplo de prueba de navegador (Playwright y Chromium disponibles; directorios de evidencias fuera del sitio):

```sh
MONETIZATION_BASELINE_DIR=/ruta/a/copia-de-main \
MONETIZATION_QA_DIR=/ruta/a/evidencias \
CHROMIUM_PATH=/usr/bin/chromium \
node scripts/test-monetization-browser.cjs
```

Para incluir axe-core en las 66 combinaciones, añadir `AXE_PATH=/ruta/a/axe.min.js`. El resultado JSON identifica si se ejecutó. El alcance de axe se limita a las nuevas tarjetas; no certifica la accesibilidad completa del sitio.

## Pendientes antes de una futura publicación

1. Comprobar carga real de los dos banners y destinos en una red autorizada; verificar que el material vigente siga siendo el aprobado en Admitad.
2. Conectar el adaptador de eventos al proveedor y al consentimiento existentes si se desean estadísticas propias. Validar recepción sin datos financieros ni parámetros privados.
3. Identificar los códigos/ubicaciones de Adsterra si están fuera de esta versión del repositorio; entonces evaluar sus anuncios reales, sin retirar unidades por defecto.
4. Revisar datos de campo LCP, INP y CLS con anuncios reales y paneles de ingresos. No hay base para prometer incremento de ingresos.
5. Revisar el PR. Esta rama no despliega; un merge o publicación requiere una decisión posterior del propietario.

## Archivos modificados y evidencias

- `articulos/costo-total-prestamo-como-calcular.html`
- `articulos/credito-revolvente-vs-prestamo-personal.html`
- `articulos/tabla-amortizacion-prestamo-como-leerla.html`
- `articulos/tasa-fija-vs-tasa-variable-prestamo.html`
- `assets/css/affiliate-cards.css`
- `assets/js/affiliate-events.js`
- `calculadoras/costo-unidad.html`
- `calculadoras/descuento.html`
- `calculadoras/iva-incluido.html`
- `calculadoras/iva.html`
- `calculadoras/precio-sin-descuento.html`
- `calculadoras/prestamo.html`
- `docs/monetizacion-2026-11-05.md`
- `docs/monetizacion-baseline-2026-11-05.json`
- `docs/monetizacion-fuentes-2026-11-05.md`
- `docs/monetizacion-pruebas-2026-11-05.json`
- `index.html`
- `scripts/affiliate-cards.cjs`
- `scripts/render-affiliates.cjs`
- `scripts/test-monetization-browser.cjs`
- `scripts/test-monetization.cjs`
- `vercel.json`

Resultados detallados: [JSON de pruebas](monetizacion-pruebas-2026-11-05.json). Axe-core se ejecutó en las 66 combinaciones sobre las tarjetas, sin infracciones detectadas de WCAG 2 A/AA y 2.1 AA. No se acredita conformidad completa por una prueba automatizada.
