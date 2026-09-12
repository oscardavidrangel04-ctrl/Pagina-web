# Calculadoras México V5.10.0 — Clúster PTU

Fecha: 11 de septiembre de 2026

## Objetivo

Ampliar el clúster de reparto de utilidades con intenciones útiles detectadas en Semrush, sin crear páginas redundantes y sin alterar fórmulas, URLs existentes, diseño, analítica, publicidad ni scripts funcionales.

## Archivos nuevos

- `articulos/cuando-se-pagan-utilidades.html`: fechas de pago 2026 para empresas y personas físicas, exempleados y pasos de revisión.
- `articulos/como-calcular-ptu.html`: fórmula por días y salarios, datos necesarios, ejemplo y errores comunes.

## Archivos modificados

- `articulos.html`: incorpora las dos nuevas guías al hub PTU.
- `articulos/que-es-ptu.html`: se enfoca en definición, significado, derecho y empleadores obligados; deriva fechas y fórmula a sus páginas específicas.
- `articulos/derecho-ptu-si-renuncio.html`: añade enlaces contextuales a fechas y cálculo.
- `articulos/limite-ptu-tres-meses.html`: añade enlaces contextuales a fechas y cálculo.
- `articulos/ptu-exenta-isr.html`: añade enlaces contextuales a fechas y cálculo.
- `calculadoras/ptu.html`: incorpora las dos guías en el bloque específico del clúster. No se modificaron controles, fórmulas ni scripts.
- `sitemap.xml`: añade las dos URLs con `lastmod` 2026-09-11.

## Arquitectura e intención

- Hub transaccional: `calculadoras/ptu.html`.
- Definición y elegibilidad general: `articulos/que-es-ptu.html`.
- Fecha y plazo: `articulos/cuando-se-pagan-utilidades.html`.
- Fórmula y ejemplo: `articulos/como-calcular-ptu.html`.
- Renuncia, exempleados y tiempo trabajado: `articulos/derecho-ptu-si-renuncio.html`.
- Tope individual: `articulos/limite-ptu-tres-meses.html`.
- Parte exenta, gravada y recibo: `articulos/ptu-exenta-isr.html`.

No se crearon páginas separadas para “exempleados”, “cuánto tiempo debo trabajar” ni “empresas obligadas”, porque esas intenciones ya están cubiertas con profundidad en URLs existentes.

## SEO on-page y técnico

- Dos titles, descriptions, H1 y canonicals únicos.
- BreadcrumbList, WebPage, BlogPosting y FAQPage válidos en ambas guías nuevas.
- Enlaces a fuentes oficiales mexicanas: LFT y PROFEDET.
- Dominio canónico sin `www`.
- Sitemap sin URLs nuevas duplicadas.
- Profundidad de las guías nuevas: dos clics desde la home mediante `articulos.html`.

## Riesgos y pendientes

- El proyecto conserva páginas fallback históricas que comparten canonical con su página primaria. Es un comportamiento heredado e intencional; no se modificó en esta versión.
- Los resultados orgánicos dependen del rastreo, indexación, competencia y autoridad externa; la publicación no garantiza posiciones.
- Tras desplegar, conviene ejecutar Screaming Frog y comprobar respuesta 200, indexabilidad, canonical, H1, title, schema y profundidad real.

