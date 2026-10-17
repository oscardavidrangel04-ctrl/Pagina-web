# Calculadoras México V5.9.0 — expansión basada en Search Console y Semrush

Base: V5.8.0 SEO Clusters Final. Fecha: 10 de septiembre de 2026.

## Nuevas URLs

- `articulos/como-calcular-isr-sueldo.html`: procedimiento, fórmula, ejemplo mensual 2026, tasa marginal frente a porcentaje efectivo y errores comunes.
- `articulos/descuentos-nomina-isr-imss.html`: separación entre ISR, cuota obrera del IMSS, otros descuentos y sueldo neto.
- `articulos/ejemplo-calculo-finiquito.html`: ejemplo transparente con salario pendiente, aguinaldo proporcional, vacaciones y prima vacacional.
- `articulos/finiquito-por-antiguedad.html`: efecto de los años trabajados, vacaciones y reglas de prima de antigüedad, sin confundir renuncia con liquidación.

## Refuerzos aplicados

- Propina: ejemplos directos para calcular 10% y enlaces específicos al clúster. Se conservaron URL, title, H1, fórmula y contenido previo.
- ISR y vacaciones: la intención “cálculo de ISR en/por vacaciones” se consolidó en `isr-prima-vacacional.html`, con enlaces desde vacaciones, prima vacacional y la calculadora correspondiente.
- ISR: enlaces desde la calculadora, la guía principal y la guía por periodos hacia el nuevo procedimiento de sueldo.
- Nómina y salario: enlaces desde salario neto, salario bruto/neto y recibo de nómina hacia la nueva guía de descuentos.
- Finiquito: calculadora y artículos existentes enlazan a los dos nuevos recursos prácticos.
- Hub de artículos: bloque editorial para descubrir las cuatro nuevas guías. Todas quedan a dos clics desde la home.
- Se acortó únicamente el title de `como-se-cuentan-dias-vacaciones.html` para resolver el aviso de Semrush. Su URL, H1, intención y contenido se conservaron.
- `sitemap.xml` pasa de 101 a 105 URLs y `llms.txt` incluye las cuatro altas.
- El identificador de caché del service worker se actualizó a V5.9.0; su comportamiento no cambió.

## Conservación y seguridad

- Los archivos JavaScript de cálculo son idénticos a V5.8.0.
- No se modificaron inputs, selects, botones, formularios ni fórmulas.
- `robots.txt` y `vercel.json` permanecen idénticos.
- No se eliminó ninguna URL ni bloque de contenido SEO previo.
- Se conservaron publicidad, analítica y scripts funcionales existentes.
- Las rutas físicas de respaldo definidas por Vercel fueron actualizadas junto con sus páginas canónicas.

## Fuentes y límites

El contenido se fundamenta en la Ley Federal del Trabajo vigente, Ley del ISR y Anexo 8 de la RMF 2026. Cada guía enlaza sus fuentes y marca los ejemplos hipotéticos.

La calculadora de asimilados a salarios no se incorporó: requiere una especificación funcional y fiscal separada para no reutilizar de manera insegura la lógica ordinaria de salarios. Queda como candidata para una versión posterior.

Las posiciones de Google no están garantizadas. Después de desplegar, conviene ampliar el límite de Semrush Site Audit a 150 páginas y volver a rastrear el dominio.
