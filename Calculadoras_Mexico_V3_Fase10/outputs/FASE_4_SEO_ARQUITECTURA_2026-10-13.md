# Fase 4: organización temática y navegación interna

Finalizada el 13 de octubre de 2026. Cambios locales pendientes de publicación.

## Alcance

Tras los lotes editoriales de las fases 2 y 3, esta fase mejora la forma de encontrar herramientas y guías. No se encontró un documento que fijara el detalle original de las seis fases; se explicitó en la conversación este alcance antes de implementar.

Se conservaron las 377 URLs canónicas del inventario local. No se crearon páginas, redirecciones ni fusiones de contenido. No se modificaron fórmulas ni se diagnosticó canibalización a partir de semejanzas de títulos.

## Cambios aplicados

1. Las 12 páginas de `/temas/` incorporan 37 rutas por objetivo: cada tarjeta explica qué resolver y ofrece dos enlaces concretos. Los directorios completos permanecen disponibles debajo.
2. Índices de secciones con anclas, enlace para saltar al contenido y foco de teclado visible. Funcionan sin JavaScript.
3. `BreadcrumbList` coherente con la ruta visible y descripción en `CollectionPage` para los 12 temas. Es marcado semántico; no garantiza resultados enriquecidos.
4. Corrección de 13 asignaciones temáticas, tanto en los directorios como en el enlace al tema desde cada página afectada. Las excepciones quedan registradas en el clasificador para que una regeneración no repita los errores.
5. Corrección del menú móvil de los temas: heredaba una posición fija a pantalla completa, ocultando el contenido. Ahora permanece dentro del encabezado. También se sustituyó el logotipo con texto blanco por marca y nombre legibles en el fondo claro de estas páginas.
6. Los nombres de los enlaces de los directorios se regeneraron desde los encabezados efectivos actuales, respetando las reescrituras de Vercel. Sitemap actualizado únicamente para las 12 páginas temáticas que recibieron contenido nuevo.

## Reclasificaciones

| Página | Tema corregido |
|---|---|
| GAT nominal vs GAT real | Inversión y rendimientos |
| Es seguro invertir en CETES | Inversión y rendimientos |
| CLABE, número de tarjeta y cuenta | Transferencias y SPEI |
| Calculadora de aumento salarial | Salario y nómina |
| Factor de integración SDI | Salario y nómina |
| Cómo sacar constancia fiscal | Impuestos y trámites SAT |
| Para qué sirve constancia fiscal | Impuestos y trámites SAT |
| Declaración anual de asalariados | Impuestos y trámites SAT |
| Fecha de corte vs fecha de pago | Créditos, tarjetas y deudas |
| Pago mínimo vs pago para no generar intereses | Créditos, tarjetas y deudas |
| Pago antes de fecha de corte | Créditos, tarjetas y deudas |
| Pago después de fecha límite | Créditos, tarjetas y deudas |
| Saldo actual vs saldo al corte | Créditos, tarjetas y deudas |

## Verificación

- Auditoría estática: 377 URLs, sin problemas detectados, páginas huérfanas, enlaces locales rotos, enlaces a redirecciones ni títulos/descripciones duplicados.
- Las 357 URLs de artículos y calculadoras siguen incluidas en los directorios temáticos.
- Las 13 reclasificaciones tienen el tema correcto en ambos sentidos y una única asignación en el directorio completo.
- Edge, JavaScript desactivado: 12 temas × 2 tamaños (390 y 1440 px), 24 comprobaciones aprobadas. Un H1, canonical correcto, anclas existentes, encabezado no tapado por el menú, sin desbordamiento horizontal y enlaces de tarjetas con destinos locales existentes.
- Revisión visual de capturas de nómina y prestaciones. Las pruebas usan archivos locales y bloquean conexiones externas.

Pruebas reproducibles: `scripts/check-phase4-topics.py`, `scripts/check-phase4-seo.cjs` y `scripts/audit-seo-technical.py`.

## Límites y publicación

No se desplegó en Vercel ni se midieron cambios de posicionamiento. El rastreo local no demuestra indexación en Google. No se midieron Core Web Vitals de producción ni los efectos de servicios externos.

Tras publicar, comprobar las páginas temáticas en móvil y registrar la fecha de despliegue. Evaluar el rendimiento por URL en periodos comparables; los cambios de enlaces no garantizan posiciones o clics adicionales.

## Referencias técnicas

- Enlaces rastreables, textos descriptivos y contexto: https://developers.google.com/search/docs/crawling-indexing/links-crawlable
- Marcado de rutas de navegación: https://developers.google.com/search/docs/appearance/structured-data/breadcrumb
