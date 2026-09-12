# Calculadoras México V5.11.0 — Clúster SDI y SBC

Fecha: 12 de septiembre de 2026

## Objetivo

Fortalecer la autoridad temática sobre salario diario integrado y salario base de cotización a partir de Keyword Magic Tool y Keyword Gap, sin modificar fórmulas, URLs existentes, diseño, analítica, publicidad ni scripts funcionales.

## Archivos nuevos

- `articulos/como-calcular-salario-diario-integrado.html`
- `articulos/que-es-salario-base-cotizacion.html`

## Archivos modificados

- `articulos.html`
- `articulos/que-es-salario-diario-integrado.html`
- `articulos/factor-integracion-sdi.html`
- `calculadoras/salario-diario-integrado.html`
- `sitemap.xml`

## Arquitectura del clúster

- Hub transaccional: calculadora de SDI 2026.
- Definición y uso en nómina: qué es el SDI.
- Cálculo: fórmula y ejemplo paso a paso.
- Prestaciones: factor de integración 2026.
- Seguridad social: qué es el SBC ante el IMSS.

Las consultas sobre conceptos integrantes, salario diario frente a SDI y diferencia entre SBC y SDI se incorporaron como secciones de páginas fuertes. No se crearon URLs independientes de bajo volumen.

## Mejoras aplicadas

- Dos nuevas páginas con title, meta description, H1 y canonical únicos.
- Schemas WebPage, BlogPosting, BreadcrumbList y FAQPage.
- Enlazado contextual entre las cinco piezas del clúster.
- Enlaces desde el hub de artículos y la calculadora principal.
- Factor de integración actualizado semánticamente para la intención 2026.
- Explicación de SBC fijo, variable y mixto sin añadir una calculadora no validada.
- Fuentes oficiales: Ley Federal del Trabajo, Ley del Seguro Social e IMSS.
- Sitemap actualizado con `lastmod` 2026-09-12.

## Decisiones conservadoras

- No se modificó la fórmula de la calculadora de SDI.
- No se creó una calculadora de SBC porque requiere reglas adicionales y el volumen transaccional detectado todavía es limitado.
- No se crearon páginas para años pasados ni consultas contaminadas de otros servicios.
- No se añadieron valores monetarios oficiales variables que pudieran caducar sin una fuente y fecha específica.

## Riesgos pendientes

- Las páginas fallback históricas comparten canonical con sus páginas primarias. Es una condición heredada e intencional que se conserva.
- El cálculo del SBC real puede requerir conceptos variables, topes y circunstancias que la calculadora simplificada de SDI no modela.
- Después del despliegue debe ejecutarse Screaming Frog sobre producción para confirmar respuestas HTTP, renderizado, indexabilidad y profundidad real.

