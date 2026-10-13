# Fase inicial: SEO técnico

Revisión del proyecto local, 12 de octubre de 2026. Los cambios requieren publicación para entrar en producción.

## Alcance y resultados

- 377 URLs editoriales/canónicas examinadas, considerando las reescrituras de Vercel y sus archivos efectivos.
- 406 archivos HTML en las carpetas públicas principales; incluyen alternativas, páginas de servicio y verificación.
- Sin enlaces internos a archivos inexistentes ni enlaces internos a redirecciones en el rastreo estático.
- Sin títulos ni descripciones duplicados entre las 377 URLs examinadas.
- Canonical único y consistente con la URL de cada página examinada.
- Sin recursos locales faltantes en las referencias de scripts, imágenes y hojas de estilo examinadas.
- JSON-LD analizado; la revisión de preguntas detectó una discrepancia textual corregida.
- Robots, sitemap principal y pago quincenal respondieron HTTP 200 en una muestra pública. No equivale a rastrear todas las URLs de producción.

## Cambios aplicados

1. Reparado el destino #casos-propina en la calculadora de propina.
2. Alineado el encabezado visible de días de aguinaldo con la pregunta declarada en FAQPage, en el archivo servido por la reescritura.
3. Eliminadas dos entradas duplicadas del sitemap secundario. Las URLs de qué es el finiquito y carta de finiquito siguen en el sitemap principal. Total único conservado: 377.
4. Añadido X-Robots-Tag: noindex a /outputs/, /auditoria-arquitectura/, /scripts/ y al archivo de verificación de Google. No se cambia el contenido del archivo de verificación ni se impide su acceso.
5. Auditoría reproducible de canonicals, descripciones, anclas, recursos y títulos; el inventario reconoce el noindex HTTP exacto del archivo de verificación.

## Límites y siguientes comprobaciones

- Los filtros #categoria= son estado de la aplicación manejado por common.js, no anclas HTML rotas.
- El informe de rendimiento de Search Console no acredita indexación de todas las URLs ni demuestra canibalización por sí solo. Para confirmarlo hacen falta informes de indexación y consultas filtradas por página.
- No se midieron Core Web Vitals ni velocidad real en móvil. Esas mediciones y la comprobación de las nuevas cabeceras HTTP deben realizarse tras publicar.
- No se desplegó el proyecto ni se solicitó indexación.
- Esta entrega corresponde a la base técnica inicial; los lotes editoriales por rendimiento siguen pendientes.

Referencia técnica: https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls
