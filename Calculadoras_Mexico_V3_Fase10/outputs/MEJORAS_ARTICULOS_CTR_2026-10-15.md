# Guías y artículos: revisión editorial orientada a CTR

## Alcance

13 guías relacionadas con los 15 temas del bloque. Trabajo adicional a las 12 calculadoras de la entrega anterior. Cambios locales, pendientes de publicación. No se modificaron el scraper, las fórmulas ni las URL públicas.

## Uso de los datos proporcionados

Se contrastaron las comparaciones por keyword de `bloque 1.zip`, `bloque 2.zip` y `bloque 3.zip` con el contenido que realmente sirve Vercel. Se utilizaron además las señales cualitativas de Keyword Magic y del documento de palabras clave analizadas en la entrega anterior, recogidas en `MEJORAS_CTR_2026-10-15.md`.

El material muestra preguntas sobre bruto/neto, deducciones, periodicidad, cálculo de aguinaldo, proporcionales, diferencias de finiquito/liquidación y vacaciones/prima. La selección responde a esas intenciones, no a una clasificación nueva por CTR de cada artículo: los datos disponibles no permiten atribuir una consulta global a una URL concreta con precisión.

Se mantienen las limitaciones detectadas: CSV vacíos por filtro KD=0, lotes duplicados y resultados del scraper con navegación, noticias o información de otros países. No se inventaron volúmenes ni se copiaron párrafos de competidores. Los ejemplos nuevos son ilustrativos y se identifican como supuestos, no como retenciones oficiales.

## Artículos intervenidos y diferencia de intención

| URL bajo /articulos/ | Pregunta que resuelve | Mejora original |
|---|---|---|
| salario-bruto-neto.html | ¿Cuál es la diferencia y cómo comparo ofertas? | Dos escenarios que explican por qué $20,000 brutos no pueden compararse directamente con $18,000 netos. |
| descuentos-nomina-isr-imss.html | ¿Qué descuentos aparecen y cómo los reviso? | Lista de comprobación para un concepto desconocido, documentación y periodos. |
| convertir-salario-mensual-diario-hora.html | ¿Qué fórmula uso para convertir periodos? | Diferencia explícita entre referencia diaria por jornada y equivalencia anual por horas semanales. |
| isr-semanal-quincenal-mensual.html | ¿Qué tabla corresponde al recibo? | Tres controles para comparar retenciones sin confundir base, periodo y alcance. |
| como-calcular-aguinaldo.html | ¿Cómo se aplica la fórmula? | Ejemplo completo de sueldo mensual a salario diario y prestación anual. |
| aguinaldo-proporcional.html | ¿Cómo se calcula la parte del año? | Comparación de 90 y 92 días y efecto de usar meses aproximados. |
| aguinaldo-por-antiguedad.html | ¿Aumenta con los años trabajados? | Comparación con igual antigüedad y distinta prestación contractual. |
| que-es-el-finiquito.html | ¿Qué significa y cuándo corresponde? | Diferenciar el pago final del documento que lo desglosa. |
| que-incluye-finiquito.html | ¿Qué partidas reviso? | Separación entre generado, ya pagado y saldo pendiente. |
| finiquito-vs-liquidacion.html | ¿En qué se diferencian? | Método para comparar propuestas por concepto, no solo por nombre. |
| finiquito-renuncia-voluntaria.html | ¿Qué revisar al renunciar? | Documentos, fecha efectiva, saldos y prestaciones contractuales. |
| vacaciones-mexico.html | ¿Cómo se relacionan días, salario y prima? | Revisar solicitud en días y recibo en dinero sin llamar extra a todo el total. |
| como-calcular-prima-vacacional.html | ¿Cómo aplico el 25%? | Ejemplo desde salario mensual, sin duplicar la prima ni aplicar el porcentaje a una base incorrecta. |

Cada artículo mantiene su función explicativa y enlaza a la calculadora pertinente. No se crearon nuevas URL para variantes de la misma consulta ni se cambiaron canonical o redirecciones. Esto aclara la intención editorial, pero no demuestra por sí solo que desaparezca cualquier solapamiento en Google.

## Cambios técnicos y editoriales

- Título, metadescripción, Open Graph y Twitter ajustados en los 13 artículos.
- Entradas reescritas como respuestas directas, evitando promesas fiscales o legales que una guía no puede garantizar.
- 13 secciones prácticas originales incorporadas al cuerpo del artículo, visibles sin JavaScript.
- Enlaces contextuales a la herramienta o guía del siguiente paso, sin sustituir los enlaces existentes.
- Datos de Article/BlogPosting/WebPage actualizados cuando existen; se preservaron fechas de publicación y se actualizó la fecha de modificación de las páginas intervenidas.
- Fechas visibles de revisión y lastmod de ambas versiones del sitemap actualizados solo para estas URL.
- No se añadieron autores ficticios, reseñas, estrellas ni preguntas estructuradas que no estén presentes en la página.

## Archivos que se publican

Ocho páginas se sirven directamente desde `articulos/`. Cinco usan archivos alternativos por las reglas actuales de Vercel:

- como-calcular-aguinaldo → `fallback-como-calcular-aguinaldo.html`
- aguinaldo-por-antiguedad → `fallback-aguinaldo-por-antiguedad.html`
- que-incluye-finiquito → `fallback-que-incluye-finiquito.html`
- finiquito-renuncia-voluntaria → `fallback-finiquito-renuncia-voluntaria.html`
- como-calcular-prima-vacacional → `fallback-como-calcular-prima-vacacional.html`

El registro exacto de URL, archivo servido, título anterior, título nuevo y descripción está en `CTR_ARTICULOS_2026-10-15.json`. Ese registro es la referencia para despliegue y seguimiento; las reglas de Vercel se conservaron.

## Validación y seguimiento

La revisión estática de las 377 URL indexables pasó sin incidencias, enlaces rotos ni pérdidas de cobertura del sitemap. La prueba específica `scripts/test-editorial-ctr.cjs` pasó en las 26 vistas: 13 rutas públicas con sus rewrites, a 390 y 1440 píxeles y sin JavaScript. Comprueba metadatos, H1, canonical, contenido original y desbordamiento. Durante la validación se completaron las etiquetas sociales ausentes de la guía de definición de finiquito. Se inspeccionó visualmente la nueva explicación de conversión salarial en móvil, sin recortes.

Tras publicar, registrar la fecha y comparar clics/impresiones/CTR por URL y consulta con periodos equivalentes, país y dispositivo. No atribuir a un título lo que puede explicarse por cambio de posición o estacionalidad. No hay resultados de CTR posteriores a esta entrega todavía.

## Referencias

- [Google: títulos de resultados](https://developers.google.com/search/docs/appearance/title-link).
- [Ley Federal del Trabajo, Cámara de Diputados](https://www.diputados.gob.mx/LeyesBiblio/pdf/LFT.pdf).
- [PROFEDET: renuncia voluntaria](https://www.profedet.gob.mx/micrositio/index.php/renuncia-voluntaria).
