# Calculadoras México 3.10.1 — corrección, móvil y SEO

Esta entrega corrige los problemas observados en producción y conserva las mismas URLs para no perder el avance de indexación.

## Problema encontrado

La publicación anterior no incluía `assets/js/catalog.js`, `assets/js/calculators.js` ni `assets/js/simulators.js`. Vercel respondía 404 para esos archivos. Por eso no aparecía el catálogo, la búsqueda quedaba vacía y varias calculadoras no funcionaban.

Además, JavaScript y CSS tenían una caché inmutable de un año. La versión 3.10.1 añade identificadores de versión a esos recursos y una política de actualización segura para impedir que el teléfono reutilice archivos rotos.

## Correcciones principales

- Catálogo completo de 50 calculadoras visible directamente en el HTML.
- Búsqueda por palabra, sin distinguir mayúsculas ni acentos.
- Buscador global, calculadoras y simuladores integrados en `assets/js/common.js`.
- Diseño móvil de una columna, texto con mayor contraste y controles táctiles legibles.
- Formularios, resultados, artículos y navegación sin desbordamiento horizontal.
- Botón “Ver las 50 calculadoras” con contraste correcto.
- Service worker y caché actualizados a `3.10.1`.

## Mejoras SEO

- 50 enlaces rastreables en el catálogo incluso sin JavaScript.
- 66 URLs en `sitemap.xml`, con namespace obligatorio y fechas de actualización.
- `robots.txt` enlaza el sitemap.
- Títulos, descripciones, canonical, hreflang, Open Graph y Twitter Cards revisados.
- `CollectionPage` e `ItemList` para el catálogo.
- `WebApplication`, breadcrumbs y FAQ estructuradas en las calculadoras.
- Contenido visible ampliado en las diez herramientas prioritarias.
- Enlaces internos a cuatro calculadoras relacionadas en cada herramienta.
- Referencias oficiales visibles del SAT y de la Ley Federal del Trabajo donde corresponde.
- Tarifa de ISR 2026 contrastada con el Anexo 8 oficial del SAT.

## Cómo publicar correctamente

1. Descomprime el ZIP.
2. Reemplaza el contenido del repositorio con **todo** lo que está dentro de la carpeta, conservando las carpetas `assets`, `calculadoras`, `articulos` y `tools`.
3. Espera a que Vercel marque el nuevo despliegue como `Ready`.
4. Comprueba estas direcciones:
   - `/calculadoras.html` debe mostrar 50 tarjetas sin escribir nada.
   - `/assets/js/common.js?v=3.10.1` debe mostrar código, nunca `404`.
   - `/sitemap.xml` debe comenzar con la declaración XML y el namespace.
   - `/calculadoras/isr.html` debe calcular y mostrar “ISR estimado” y “Neto estimado”.
5. En el teléfono cierra y abre la pestaña. Si conserva la versión anterior, recarga una vez sin caché.

No es necesario cambiar ni volver a enviar la dirección del sitemap: sigue siendo `/sitemap.xml`.

## Pruebas realizadas

- 68 páginas HTML verificadas.
- 50 calculadoras y 66 URLs del sitemap.
- Enlaces y archivos locales sin referencias rotas.
- Metadatos y JSON-LD válidos.
- Auditorías de SEO, móvil, rendimiento y publicación aprobadas.
- Prueba funcional de catálogo, filtro “aguinaldo”, búsqueda global y las 50 calculadoras aprobada.
