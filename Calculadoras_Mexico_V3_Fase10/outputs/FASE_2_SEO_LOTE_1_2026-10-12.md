# Fase 2: primer lote de oportunidades con visibilidad

Fecha: 12 de octubre de 2026. Cambios locales pendientes de publicación.

Tras la fase técnica, se priorizaron las diez URLs con más impresiones y posición media entre 2 y 10 en el Excel de Search Console del 28 de julio al 12 de octubre. Esta posición es la media del periodo, no una posición fija actual ni una medición del efecto de estos cambios.

| Página | Clics | Impresiones | Posición media | Trabajo aplicado |
|---|---:|---:|---:|---|
| Pago quincenal | 50 | 5,192 | 4.80 | Comparación bruto/neto y enlaces a conversiones; título reciente conservado |
| Salario diario | 26 | 3,392 | 5.27 | Snippet, respuesta inicial, tabla de divisores y enlaces contextuales |
| Salario por hora | 4 | 625 | 6.61 | Diferenciación de conversión diaria, quincenal y por horas; título conservado |
| Bono | 15 | 364 | 4.16 | Descripción e introducción más precisas; cálculo inverso del porcentaje y comparación de frecuencia |
| Aguinaldo por 3 meses | 3 | 318 | 7.19 | Snippet con ejemplo y supuestos, respuesta inicial y diferencia entre 90 y 92 días |
| ISR de prima vacacional | 3 | 310 | 8.69 | Snippet, distinción entre gravado e impuesto y ejemplo hipotético enlazado al SAT |
| Propina obligatoria | 0 | 255 | 9.89 | Snippet directo, pasos ante cargo no autorizado y referencia de Profeco |
| Qué incluye finiquito | 0 | 236 | 8.35 | Snippet, desglose y revisión de pagos previos para evitar doble conteo |
| Convertir salario mensual, diario y hora | 0 | 234 | 8.50 | Snippet y selección de la calculadora adecuada según el objetivo |
| Aguinaldo si renuncio | 1 | 165 | 8.06 | Respuesta inicial, snippet y ejemplo proporcional enlazado al finiquito |

## Implementación

Se editaron los archivos efectivos de las reescrituras de Vercel para las guías que usan fallback. Se alinearon las descripciones sociales y los datos estructurados de página/artículo con las modificaciones, y las fechas de los sitemaps para las URLs editadas. No se cambió ninguna URL canónica ni fórmula de las calculadoras.

## Verificación

- Auditoría estática de 377 URLs: sin enlaces locales rotos, IDs duplicados detectados, recursos faltantes ni títulos/descripciones duplicados.
- Las diez URLs efectivas se comprobaron en Edge con anchura móvil de 390 px: un H1, título dentro del head, JSON-LD válido, canonical correcto y sin desbordamiento horizontal.
- Pago quincenal y salario diario: comprobado el cálculo con sueldo mensual de $15,000.
- Ejemplos editoriales calculados: $500 × 15 × 90/365 = $1,849.32; por 92 días = $1,890.41; por 180 días = $3,698.63.

## Seguimiento después de publicar

Registrar la fecha real de publicación y comparar periodos equivalentes por URL, consulta, país y dispositivo. Separar cambios de posición de cambios de CTR; considerar estacionalidad del aguinaldo y volumen de impresiones. Google puede generar un título o fragmento distinto. No se ha verificado indexación ni aumento de posiciones por estos cambios locales.

Fuente de métricas: https___calculadora-isr-mexico.vercel.app_-Performance-on-Search-2026-10-12(1).xlsx, hoja Páginas.

Referencias utilizadas en el contenido:
- https://www.gob.mx/profeco/prensa/la-propina-es-obligatoria-profeco-te-responde?idiom=es-MX
- https://wwwmatnp.sat.gob.mx/articulo/15199/articulo-93
- https://www.diputados.gob.mx/LeyesBiblio/pdf/LFT.pdf
