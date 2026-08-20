# Calculadoras México V5.5.2 — Semrush JS min paths

Hotfix posterior a V5.5.1.

- Mantiene `assets/css/styles.css` para evitar la regresión visual observada en V5.5.0.
- Cambia las referencias de JavaScript locales a sus archivos `.min.js`.
- Actualiza el cache-busting a `v=5.5.2`.
- No cambia fórmulas ni contenido de las calculadoras.

Objetivo: evitar que Semrush siga reportando `assets/js/common.js` y otros JS locales como no minificados, sin volver a romper la carga del CSS.
