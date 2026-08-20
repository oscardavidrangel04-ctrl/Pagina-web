# Calculadoras México V5.4.9 — correcciones Semrush

## Cambios aplicados

- Se eliminaron las entidades `SoftwareApplication` / `WebApplication` que Semrush marcaba por exigir `aggregateRating` o `review`.
- Las páginas de calculadoras ahora usan `WebPage` en JSON-LD, conservando `BreadcrumbList` y `FAQPage` cuando ya existían.
- No se inventaron reseñas, valoraciones ni estrellas.
- La calculadora de propina conserva su `WebPage` existente y se eliminó la entidad `SoftwareApplication` redundante.
- Los filtros de categoría dejaron de crear URLs `?categoria=`. Ahora usan fragmentos `#categoria=`, que mantienen la experiencia de filtrado sin generar URLs parametrizadas rastreables con conflictos de hreflang.
- `common.js` fue actualizado para leer y escribir la categoría desde el fragmento.
- El generador semántico también fue actualizado para no reintroducir enlaces con `?categoria=`.

## Objetivo

Corregir los dos grupos detectados en la auditoría Semrush: 51 entidades de datos estructurados no válidas y conflictos hreflang en URLs de filtros por categoría, sin añadir reseñas falsas ni páginas duplicadas.
