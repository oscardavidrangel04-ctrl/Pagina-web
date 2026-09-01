# V5.6.20 — Indexación / Discovery Boost

Base: V5.6.19.

Cambios:
- Refuerzo de enlaces HTML estáticos desde home y /calculadoras.html hacia 15 URLs prioritarias.
- Enlazado contextual en clusters de aguinaldo, ISR, IVA, finiquito, vacaciones, PTU y finanzas.
- Dos artículos de aguinaldo añadidos como tarjetas visibles en /articulos.html.
- Auditoría automática de las 48 URLs reportadas por GSC como “Descubierta: actualmente sin indexar”: archivo existente, canonical autocanónico e index/follow.
- Sitemap conserva las URLs y actualiza lastmod solo en documentos realmente modificados.
- Service Worker actualizado a caché v5.6.20.

Objetivo: mejorar descubrimiento/rastreo interno. No garantiza indexación; Google decide finalmente qué URLs rastrea e indexa.
