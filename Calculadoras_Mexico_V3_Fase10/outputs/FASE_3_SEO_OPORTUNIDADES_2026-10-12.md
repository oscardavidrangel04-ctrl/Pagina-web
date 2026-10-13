# Fase 3: páginas con visibilidad fuera del top 10

12 de octubre de 2026. Cambios locales; publicación pendiente.

## Selección

Se trabajaron las diez URLs con más impresiones y posición media mayor que 10 y menor o igual que 30. Continúa el primer lote editorial de la fase 2, sin volver a modificar sus diez páginas. No se encontró un documento local que detallara las seis fases originales; este alcance se explicitó en la conversación antes de implementar.

Fuente: `https___calculadora-isr-mexico.vercel.app_-Performance-on-Search-2026-10-12(1).xlsx`, hoja Páginas. Las posiciones son medias del periodo exportado, no posiciones actuales. Las consultas del Excel son del sitio: no se atribuyeron automáticamente a una URL concreta.

| URL | Clics | Impresiones | Posición media |
|---|---:|---:|---:|
| /calculadoras/salario-neto.html | 4 | 1342 | 27.03 |
| /articulos/aguinaldo-por-antiguedad.html | 2 | 511 | 12.99 |
| /articulos/isr-semanal-quincenal-mensual.html | 8 | 326 | 16.70 |
| /articulos/cuando-pagan-finiquito.html | 1 | 305 | 12.27 |
| /articulos/con-que-salario-se-calcula-aguinaldo.html | 0 | 278 | 19.88 |
| /calculadoras/propina.html | 1 | 256 | 16.93 |
| /articulos/simulador-credito-automotriz.html | 1 | 236 | 26.82 |
| /articulos/cuanto-se-deja-propina-mexico.html | 0 | 208 | 10.10 |
| /articulos/finiquito-renuncia-voluntaria.html | 0 | 198 | 15.05 |
| /calculadoras/salario-diario-integrado.html | 2 | 192 | 20.98 |

## Cambios

- Sueldo neto: introducción y descripción fieles a la funcionalidad real (captura manual de deducciones), enlace al cálculo de ISR y distinción entre recibo real y oferta de empleo. Se conserva el título recientemente optimizado.
- Aguinaldo por antigüedad: título centrado en si aumenta por años; respuesta directa, ejemplo de cuatro años, diferencia frente a vacaciones y enlace a la LFT.
- ISR por periodo: título y descripción específicos; eliminados tres bloques reiterativos al final. Se conserva el ejemplo principal y se conecta con sueldo neto.
- Cuándo pagan finiquito: título enfocado en plazo por renuncia; separación explícita entre obligación de pago y plazo de reclamación, con PROFEDET.
- Salario para aguinaldo: título bruto/neto, ejemplo de conversión mensual, explicación de salario fijo vigente frente a variable. Eliminada la repetición literal de variantes de keywords.
- Calculadora de propina: título y descripción enfatizan porcentaje y pago por persona; introducción directa y eliminación de dos bloques redundantes.
- Crédito automotriz: acceso a la calculadora cerca del inicio, índice con anclas, título que distingue guía de herramienta, datos estructurados Article y corrección de totales de amortización con redondeo al final.
- Cuánto dejar de propina: respuesta con importes de ejemplo, snippet específico y sustitución de referencias vagas con un enlace oficial verificable.
- Finiquito por renuncia: ejemplo con operaciones y subtotal, claramente distinto del finiquito completo; descripción más concreta.
- SDI: título con factor de integración, ejemplo visible desde la introducción, aclaración de prima en decimal y eliminación de dos bloques genéricos/repetitivos.

En las guías de aguinaldo/finiquito intervenidas se redujeron menús masivos repetidos, conservando enlaces contextuales, navegación lateral y enlaces al tema. Se respetaron URLs, canonicals, fórmulas, anuncios y funcionalidades existentes. Se modificaron los archivos fallback efectivos donde Vercel los sirve. Los metadatos existentes de descripción social y de página se alinearon; solo se actualizaron las fechas de sitemap correspondientes al lote.

## Verificación

- Auditoría estática del conjunto: 377 URLs, sin problemas detectados por el auditor, títulos/descripciones duplicados, enlaces locales rotos ni páginas huérfanas.
- Diez rutas efectivas en Edge móvil de 390 px: un H1, título en head, JSON-LD analizable, canonical esperado y sin desbordamiento horizontal.
- Prueba de regresión de sueldo neto: escritorio/móvil, cálculo, schema, FAQ y ausencia de errores de ejecución aprobados.
- Comprobaciones de cálculo aprobadas: SDI de $524.66 con salario diario $500 y prestaciones 15/12/25%; propina $120, total $920 y $230 por persona para cuenta de $800, 15% y cuatro personas.
- Ejemplo de crédito verificado con fórmula de amortización: capital $240,000, tasa mensual 0.015; pagos acumulados $312,356.70 a 36 meses y $338,400.00 a 48 meses. Diferencia $26,043.30. Sin cargos adicionales.
- No se desplegó ni se comprobó indexación, elegibilidad de resultados enriquecidos o Core Web Vitals de producción. Las pruebas locales bloquean peticiones externas; no evalúan el efecto real de publicidad o servicios de terceros.

## Referencias consultadas

- Google Search Central: https://developers.google.com/search/docs/fundamentals/creating-helpful-content
- LFT, artículos 76 y 87: https://www.diputados.gob.mx/LeyesBiblio/pdf/LFT.pdf
- PROFEDET, salario de aguinaldo: https://www.gob.mx/profedet/articulos/la-profedet-es-tu-aliada-en-el-pago-del-aguinaldo-conoce-todo-sobre-este-tema-y-haz-valer-tu-derecho
- PROFEDET, renuncia: https://www.profedet.gob.mx/micrositio/index.php/renuncia-voluntaria
- Profeco, propina: https://www.gob.mx/profeco/prensa/la-propina-es-obligatoria-profeco-te-responde?idiom=es-MX

## Medición posterior

Registrar la fecha real de publicación. Comparar periodos equivalentes por página y consulta, separando país y dispositivo. Evaluar CTR junto con posición e impresiones; tener en cuenta estacionalidad del aguinaldo. El cambio de snippet mostrado depende de Google, y las mejoras locales no garantizan incremento de posiciones ni clics.
