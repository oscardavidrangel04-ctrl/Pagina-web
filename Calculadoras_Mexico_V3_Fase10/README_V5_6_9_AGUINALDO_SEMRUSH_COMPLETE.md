# V5.6.9 — Aguinaldo: flujo completo Semrush

Fecha: 29 de agosto de 2026

URL trabajada:
- https://calculadora-isr-mexico.vercel.app/calculadoras/aguinaldo.html

Flujo completado:
1. Organic Research
2. Keyword Magic Tool
3. Keyword Gap
4. On Page SEO Checker
5. SEO Writing Assistant

Cambios aplicados en `calculadoras/aguinaldo.html`:
- Se reforzó de forma natural la intención `cuánto me toca de aguinaldo`.
- Se añadió de forma natural `cálculo de aguinaldo` y `cómo calcular mi aguinaldo`.
- Se incorporó la frase objetivo `salario mensual bruto` dentro de la explicación de conversión a salario diario.
- Se añadió una fórmula clara: `salario diario × días de aguinaldo`.
- Se incorporó `Impuesto sobre la Renta (ISR)` en el bloque fiscal sin convertir la página en una guía fiscal independiente.
- Se simplificaron frases largas señaladas por SEO Writing Assistant.
- Se mejoró la FAQ de IMSS, proporcional y mínimo de 30 días para lectura más directa.
- Se mantuvo la separación de intención con la URL específica de aguinaldo proporcional y la guía de ISR.
- No se añadió `EmploymentAgency` ni ratings/reseñas inventadas.
- No se añadieron años antiguos 2020–2025 solo por volumen de búsqueda.
- Se actualizó `dateModified` y la fecha de revisión a 2026-08-29.

Validaciones:
- JSON-LD parsea correctamente.
- 0 referencias locales rotas desde la página de aguinaldo.
- 0 referencias al host inválido `www.calculadora-isr-mexico.vercel.app` en la página.
- 0 de los tokens concatenados señalados por SWA (`prestacionescalcula`, `rápida¿cuánto`, etc.).
- `calculator-regression-test.mjs`: PASS (50 calculadoras).
- `search-regression-test.mjs`: PASS.

Nota: `tools/seo-audit.mjs` reporta fallos globales heredados al analizar la versión minificada de múltiples páginas; no son introducidos por este cambio. Las comprobaciones específicas de la URL modificada se hicieron por separado.
