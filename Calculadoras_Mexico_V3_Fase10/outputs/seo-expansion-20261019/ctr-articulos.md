# Artículos: mejora CTR y versiones servidas por Vercel

Aplicado el 20 de octubre de 2026. Se modificaron tres URLs y sus tres archivos alternativos `fallback-*.html`. Respaldo previo en `antes/`, conservando rutas.

## Criterio

Las páginas principales tienen más contenido útil, mejor diseño y, en antigüedad, un estimador interactivo. Los archivos alternativos tenían títulos/descripciones más específicos pero no esas mejoras. Se conservaron los H1, rutas, IDs y motores de las páginas principales; se incorporaron los textos útiles y se sincronizaron ambas versiones. No se tocaron otras reescrituras de Vercel.

| URL | Cambio |
| --- | --- |
| `/articulos/aguinaldo-por-antiguedad.html` | Título específico por 1, 2 o más años; descripción que responde que no aumenta automáticamente. Introducción práctica, eliminación de una frase que hablaba de búsquedas en lugar del cálculo. Se conserva el comparativo útil del fallback: mismo salario de $550 diarios y misma antigüedad dan $8,250 con 15 días de prestación o $11,000 con 20. El estimador y ocho FAQs siguen disponibles. |
| `/articulos/aguinaldo-3-meses.html` | Título y descripción con fórmula y ejemplo. Respuesta inicial de $1,849.32 con $15,000 mensuales, 15 días de prestación y 90 días computables. Se conservan explicación de 90 frente a 92 días, fuentes, ejemplos y diseño. Breadcrumb acortado. |
| `/articulos/cuando-pagan-finiquito.html` | Título centrado en cuándo pagan por renuncia. Descripción con respuesta directa y acciones ante retraso. Conserva contenido completo: petición de desglose, comprobantes, diferencia entre pago y reclamación, plazos del despido, FAQs y fuentes. |

Se alinearon meta title, Open Graph y Twitter. Fecha de revisión actualizada donde corresponde, sin modificar publicación original. El sitemap y los enlaces desde hubs los integra el agente principal.

## Verificación

Se ejecutó `verify-ctr-articles.cjs` con las reescrituras reales de `vercel.json` en navegador Edge: seis vistas (390 y 1440 px) aprobadas. Un H1, canonical correcto, anclas válidas, JSON-LD legible, ausencia de errores JavaScript y sin desbordamiento horizontal.

El estimador de antigüedad conserva resultados: $15,000 mensuales × 15 días de prestación da $7,500 anual; para 182 días da $3,739.73. Se comprobó apertura de FAQ en finiquito. Copias principales y alternativas idénticas tras la edición. Capturas revisadas visualmente para las guías de antigüedad y tres meses. Solo se acortó el breadcrumb de tres meses después de la prueba; no afecta al cálculo.

Datos GSC recibidos: antigüedad 2 clics/545 impresiones; 3 meses 3/400; finiquito 1/335. Son datos de la ventana del export, no rendimiento posterior al cambio. No existe aún una medición de efecto CTR de esta edición.

Fuentes oficiales revisadas:
- https://www.profedet.gob.mx/micrositio/index.php/renuncia-voluntaria
- https://profedet.gob.mx/prensa/preguntas_aguinaldo.html
- https://www.diputados.gob.mx/LeyesBiblio/pdf/LFT.pdf (texto vigente, última reforma indicada 14-05-2026)

Las fuentes existentes respaldan el derecho proporcional, el mínimo general de aguinaldo y el momento de pago por renuncia. No se introdujeron porcentajes fiscales ni reglas nuevas sobre otros regímenes.
