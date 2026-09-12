# Calculadoras México V5.12.0 — Refuerzo interno posterior a Screaming Frog

Fecha: 12 de septiembre de 2026

## Objetivo

Aplicar las oportunidades confirmadas por el rastreo de producción de V5.11.0 sin modificar fórmulas, URLs, diseño, navegación principal, analítica, publicidad ni scripts funcionales.

## Archivos nuevos

- `CHANGELOG_V5_12_0.md`
- `PRUEBAS_V5_12_0.json`

No se crearon nuevas URLs indexables.

## Archivos modificados

- `articulos/con-que-salario-se-calcula-finiquito.html`
- `articulos/descuentos-nomina-isr-imss.html`
- `articulos/finiquito-por-antiguedad.html`
- `articulos/isr-prima-vacacional.html`
- `articulos/leer-recibo-nomina.html`
- `articulos/propina-obligatoria-mexico.html`
- `articulos/que-incluye-finiquito.html`
- `articulos/salario-bruto-neto.html`
- `calculadoras/finiquito.html`
- `calculadoras/propina.html`
- `calculadoras/reparto-cuenta.html`
- `calculadoras/salario-diario.html`
- `sitemap.xml`

## Enlazado interno añadido

- Cuatro fuentes nuevas hacia `como-calcular-salario-diario-integrado.html`.
- Cuatro fuentes nuevas hacia `que-es-salario-base-cotizacion.html`.
- Dos fuentes nuevas hacia `que-es-propina.html`.
- Tres fuentes nuevas hacia `ejemplo-calculo-finiquito.html`.
- Tres fuentes nuevas hacia `finiquito-por-antiguedad.html`.

Los anchors son descriptivos y aparecen dentro de bloques específicos del contexto de cada página.

## Mejoras de snippets

- Se acortó el title de `finiquito-por-antiguedad.html` de 82 a 58 caracteres, conservando la intención principal.
- Se redujo la meta description de `isr-prima-vacacional.html` de 164 a 146 caracteres.
- Se redujo la meta description de `propina-obligatoria-mexico.html` de 162 a 128 caracteres.
- Se conservaron H1, URL, canonical e intención de búsqueda.

## Validación

- 137 archivos HTML parseables.
- 109 URLs en sitemap, sin duplicados.
- Cero enlaces internos rotos en la comprobación estática.
- Cero JSON-LD inválidos.
- Canonicals sin `www` incorrecto.
- `robots.txt` conserva el sitemap y acceso al rastreo.
- Los 20 archivos JavaScript son idénticos a V5.11.0.
- Formularios, controles y scripts de las cuatro calculadoras modificadas son idénticos a V5.11.0.

## Riesgos conservados

- Las páginas fallback históricas continúan compartiendo canonical con sus páginas primarias. Es una condición heredada e intencional.
- PageSpeed, accesibilidad y resultados enriquecidos requieren comprobaciones externas configuradas; los CSV aportados no contenían resultados de esas APIs.

