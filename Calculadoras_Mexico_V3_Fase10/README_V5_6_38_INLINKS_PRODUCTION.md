# V5.6.38 — Internal linking basado en Screaming Frog de producción

Cambios principales:
- Normaliza todos los enlaces internos a Home desde `/index.html` hacia `/` (canonical real).
- Refuerza el cluster de Aguinaldo, especialmente `/articulos/dias-de-aguinaldo.html`, que en producción tenía solo 2 Unique Inlinks.
- Refuerza clusters de finanzas, porcentajes/precios, trabajo/nómina, finiquito y vacaciones con enlaces desde fuentes distintas y temáticamente relacionadas.
- Mantiene URLs, canonicals, cálculos y diseño; los nuevos bloques son enlaces HTML crawlables.
- Actualiza el cache del service worker a v5.6.38 cuando existe.
