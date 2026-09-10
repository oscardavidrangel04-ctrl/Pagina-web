# Calculadoras México V5.9.1 — Auditor SEO corregido

Fecha: 10 de septiembre de 2026

## Objetivo

Revisar el ZIP `SEO_V4`, conservar sus aportaciones útiles de enlazado interno y retirar los cambios que podían perjudicar la arquitectura SEO.

## Correcciones realizadas

- Se restauró el sitemap válido de V5.9.0 con 105 URLs canónicas.
- Se excluyeron las 26 URLs técnicas `fallback` que el auditor había añadido al sitemap.
- Se retiraron 58 bloques automáticos inseguros, repetitivos o poco relacionados.
- No existen enlaces nuevos hacia archivos `fallback`.
- Se descartó el reformateo masivo de 133 HTML generado por el auditor.
- Se conservaron intactos `robots.txt`, `vercel.json`, canonicals, schemas y URLs existentes.
- No se modificaron JavaScript, fórmulas, formularios ni recursos visuales.

## Mejoras conservadas

Se conservaron 15 bloques de “Contenido relacionado” con 60 enlaces nuevos, todos contextuales y no duplicados previamente en su página. Los bloques refuerzan principalmente:

- ISR y nómina.
- Salario bruto, neto, diario y por hora.
- Finiquito.
- Horas extra y pago quincenal.

Los bloques utilizan la clase visual existente `content-box` para integrarse con el diseño actual.

## Archivos HTML modificados

1. `articulos/asimilados-a-salarios-isr.html`
2. `articulos/como-calcular-isr-sueldo.html`
3. `articulos/con-que-salario-se-calcula-finiquito.html`
4. `articulos/descuentos-nomina-isr-imss.html`
5. `articulos/ejemplo-calculo-finiquito.html`
6. `articulos/isr-semanal-quincenal-mensual.html`
7. `articulos/leer-recibo-nomina.html`
8. `articulos/salario-bruto-neto.html`
9. `calculadoras/horas-extra.html`
10. `calculadoras/isr.html`
11. `calculadoras/pago-quincenal.html`
12. `calculadoras/salario-bruto.html`
13. `calculadoras/salario-diario.html`
14. `calculadoras/salario-hora.html`
15. `calculadoras/salario-neto.html`

## Archivos nuevos

No se añadieron nuevas páginas indexables. Solo se añadió esta documentación de entrega.

## Riesgos pendientes

- La indexación y el efecto en posiciones solo pueden comprobarse después del despliegue y rastreo por buscadores.
- No se incorporaron otras sugerencias automáticas del auditor porque eran genéricas, enlazaban fallbacks o no aportaban relación temática suficiente.
