# Entrega SEO consolidada — 11 de noviembre de 2026

Informe vigente: `docs/seo-google-bing-2026-11-11/INFORME_GOOGLE_BING_SEMRUSH.md`.

Esta etapa integra las cinco exportaciones nuevas: 187 URLs Google, 98 Bing y 1,369 registros históricos SEMrush (1,104 keywords distintas). La unión contiene 228 URLs con impresiones. La matriz de 380 filas incluye 379 rutas canónicas indexables locales y una ruta histórica ausente. Los periodos de los CSV Bing por página/consulta no constan; las consultas agregadas no se atribuyen a URLs.

Se mejoran nueve destinos: cinco calculadoras (IVA, crédito automotriz, costo por unidad, precio de venta y regla de tres) y cuatro artículos. Son 11 HTML con sus fallbacks, cuatro módulos nuevos y una redirección permanente desde `/articulos/finiquito-por-meses-trabajados.html` hacia la guía general de finiquito. Los titles, H1 y canonicals se conservan. También las cinco URLs originalmente protegidas y las ocho de la etapa anterior.

Build: 499 archivos públicos, 408 HTML físicos, 379 rutas indexables locales. No significa 379 páginas indexadas en Google. No se modificaron CSS, imágenes, identidad visual ni monetización. Las integraciones Adsterra, Sol Crédito MX y AliExpress se comprueban estáticamente en las 407 páginas con cuerpo.

## Reproducir las comprobaciones

```bash
node scripts/build-public.cjs
node scripts/test-seo-google-bing.cjs
node scripts/test-seo-integral.cjs
node scripts/test-seo-semrush.cjs
node scripts/test-seo-gsc.cjs
python3 scripts/audit-seo-integral.py docs/seo-google-bing-2026-11-11/auditoria-despues.json
python3 scripts/check-seo-google-bing.py
python3 scripts/check-seo-gsc.py
python3 scripts/check-seo-semrush.py
python3 scripts/check-phase6-release.py
python3 scripts/check-phase4-topics.py
```

Python requiere `lxml`; el analizador de exportaciones usa `openpyxl`. Para regenerar matrices: `python3 scripts/analyze-google-bing-20261111.py docs/seo-google-bing-2026-11-11/fuentes-originales/`. Las fuentes se preservan con SHA256 y se excluyen del build público.

Las 379 comprobaciones nuevas y 107 de la etapa GSC anterior ejecutan funciones y manejadores con un adaptador mínimo, no un navegador. Chromium está bloqueado en el entorno de elaboración. La validación visual móvil/escritorio, anuncios reales, HTTP de la redirección y Core Web Vitals quedan pendientes. `scripts/test-seo-integral-browser.cjs` incluye las páginas nuevas para un entorno permitido; simula publicidad y no mide CWV de campo.

No se ha publicado ni subido esta versión. El build genera `site-public`, que no se incluye en el ZIP. `vercel.json` conserva las restricciones de despliegue y toda la configuración previa salvo la redirección indicada. Las pruebas de preservación permiten únicamente ese cambio concreto.

Las tres etapas anteriores permanecen en `docs/seo-integral-2026-11-09/`, `docs/seo-semrush-2026-11-10/` y `docs/seo-gsc-2026-11-10/`. Sus cifras describen sus respectivas etapas. No se atribuyen aumentos de tráfico a estos cambios aún no publicados; el seguimiento comienza a 14, 28 y 56 días desde la publicación real.
