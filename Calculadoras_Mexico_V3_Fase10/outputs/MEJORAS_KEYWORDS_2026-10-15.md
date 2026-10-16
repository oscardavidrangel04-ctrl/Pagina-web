# Refinamiento de cinco URLs con datos de Keyword Magic

Fuente: magic-varias-keywords-2026-10-15T17-11-20-336Z.zip. Base MX, dispositivo desktop, filtro KD 0–40. Se leyeron los cinco CSV principales: 2.371 filas, 1.919 términos únicos tras quitar espacios y caracteres invisibles. Las cifras de volumen y KD son estimaciones del proveedor, no clics de Search Console. Los términos repetidos entre lotes no se sumaron como demanda adicional.

## Cambios locales

| URL | Cambio | Intención cubierta |
|---|---|---|
| /calculadoras/pago-quincenal.html | Descripción, explicación de fechas y equivalencias de quincenas, pasos de revisión de nómina y enlaces al ISR y neto | cuándo es quincena, quincenas a meses, cálculo de nómina quincenal |
| /calculadoras/salario-diario.html | Descripción, conversión inversa y ejemplo de diario bruto frente a neto | calcular salario mensual con salario diario, cómo saber cuánto gano por día |
| /calculadoras/salario-neto.html | Descripción, casos de 14.000/18.000/25.000, ejemplo desglosado y enlace al cálculo inverso existente | brutos a netos, ingreso neto, salario después de impuestos |
| /calculadoras/bono.html | Descripción, ejemplo de productividad y cumplimiento parcial sujeto al plan | cálculo de bono de productividad |
| /articulos/isr-semanal-quincenal-mensual.html | Sección con localización de tarifas oficiales y procedimiento semanal/quincenal, aclaración sobre cinco pagos semanales | tabla ISR semanal, cómo calcular mi ISR quincenal, mes con cinco semanas |

Las cuatro descripciones se sincronizaron con metadatos sociales y descripciones de página/aplicación presentes en JSON-LD. Se conservaron títulos, H1, URL, canonical, formularios y motores de cálculo. Los ejemplos con deducciones son explícitamente hipotéticos. No se agregaron nuevas páginas: hay destinos existentes para las intenciones complementarias, incluido neto a bruto en salario-bruto.html. No se insertaron errores ortográficos, búsquedas históricas ni términos financieros ajenos a bonos laborales.

## Evidencia y límites

Las posiciones orgánicas pegadas son observaciones de fechas distintas. No equivalen a posición actual ni prueban CTR. Las cifras de tráfico de Semrush son estimaciones y no se han tratado como visitas medidas. El Excel de GSC tiene consultas y páginas agregadas por separado; falta el cruce para atribuir cada consulta a cada URL. La conexión GSC Wizard no está disponible en las herramientas de esta sesión.

Fuente fiscal comprobada: https://www.sat.gob.mx/minisitio/NormatividadRMFyRGCE/documentos2026/rmf/anexos/Anexo-8-RMF-2026_DOF-28122025.pdf (apartado B, II, IV y V). No se cambiaron tarifas ni fórmulas.

## Verificación y seguimiento

Verificación completada: scripts/check-phase6-release.py pasó en las 377 URLs indexables, sin incidencias. scripts/check-keyword-refinement.cjs pasó las diez vistas (cinco páginas en 390 y 1440 px), sin desbordamiento horizontal ni errores de JavaScript, y comprobó los resultados predeterminados de las cuatro calculadoras. Se actualizó a 2026-10-15 el lastmod de bono en sitemap.xml; las otras cuatro URLs ya tenían esa fecha. La ejecución del navegador requirió salir del entorno restringido tras fallar su arranque dentro de él.

Cambios locales pendientes de publicación. Tras publicar, registrar la fecha y comparar periodos equivalentes en GSC por página, consulta, país y dispositivo; evitar atribuir cambios de CTR a los textos si cambió la posición o la mezcla de búsquedas. No se garantiza conservar posiciones ni aumentar clics. No se creó una automatización de seguimiento.
