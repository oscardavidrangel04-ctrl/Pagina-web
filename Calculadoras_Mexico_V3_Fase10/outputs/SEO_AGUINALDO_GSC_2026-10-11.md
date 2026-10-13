# Aguinaldo: revisión SEO basada en Search Console

## Punto de partida

Fuente: `C:/Users/Casa/Downloads/https___calculadora-isr-mexico.vercel.app_-Performance-on-Search-2026-10-11.xlsx`.
Filtro: búsqueda Web, URL exacta `/calculadoras/aguinaldo.html`, del 28 de julio al 11 de octubre de 2026.

La pestaña Páginas registra 2 clics, 750 impresiones, CTR mostrado de 0.27% y posición media de 55.66. El gráfico diario suma los mismos clics e impresiones. Estos son datos anteriores a publicar los cambios, no resultados obtenidos por esta intervención.

Consultas contiene 163 filas: 0 clics y 425 impresiones. Países y Dispositivos también suman 425 impresiones y 0 clics. No se puede explicar completamente esta diferencia desde el archivo. No atribuir los 2 clics a consultas concretas, no mezclar denominadores y no tratar el desglose como una lista completa de las 750 impresiones.

| Consulta literal | Impresiones | Posición media | Acción |
| --- | ---: | ---: | --- |
| calculadora de aguinaldo | 30 | 71.97 | Mantenerla como intención principal, con herramienta al inicio |
| calcular aguinaldo | 30 | 93.67 | Fórmula legible, ejemplos y resultado verificable |
| cuanto me toca de aguinaldo | 11 | 82.91 | Respuesta directa y ejemplos por sueldo |
| calculadora de aguinaldo proporcional | 8 | 24.62 | Cálculo por fechas más claro y validado |
| calcular aguinaldo proporcional | 6 | 19.17 | Prioridad relativa, sin confundir pocas impresiones con tendencia estable |
| cuanto me toca de aguinaldo por 6 meses | 8 | 55.25 | Tabla de meses con supuestos explícitos |
| cuanto me toca de aguinaldo por 8 meses | 6 | 79.50 | Ejemplo de 240 días y acceso al formulario |
| calculo isr aguinaldo | 6 | 45.33 | Pasos para usar el estimador y fuentes del método |

Agrupación excluyente de las consultas visibles (primero años antiguos, después IMSS, ISR/neto, meses, proporcional, días/antigüedad y general): 71, 16, 24, 41, 38, 27 y 208 impresiones respectivamente. No son volúmenes de búsqueda de mercado. Los resultados con una sola impresión no justifican declarar una keyword posicionada de forma estable.

## Cambios realizados en esta revisión

- H1 breve y enfocado en calculadora de aguinaldo 2026 en México. Se conserva el título trabajado anteriormente, evitando otro cambio sin necesidad.
- Formulario más compacto: menos texto introductorio, sin controles de modo duplicados, antigüedad opcional e historial plegables.
- Tabla numérica de 1 a 11 meses aproximados y año completo, con supuesto de sueldo mensual de $15,000 y 15 días de prestación. Los meses se marcan como aproximaciones, no fechas exactas.
- Botones accesibles dentro de las tablas, en lugar de convertir filas completas en botones. Los ejemplos restauran sueldo fijo mensual, días y prestación; antes podían conservar salario variable o 30 días de un cálculo previo.
- Se rechazan periodos completamente fuera de 2026 y fechas invertidas antes de recortar al año. Los periodos que sí se solapan se recortan de manera inclusiva.
- Aclaración del promedio de salario variable para trabajo a destajo frente a vendedores y comisionistas. Enlaces a PROFEDET y a la guía específica.
- Se distingue aguinaldo laboral de aguinaldo de pensiones IMSS, con enlace a la guía correspondiente.
- Explicación visible para acceder al ISR y neto. Enlaces a INEGI y al artículo 174 del Reglamento de la LISR. Se explicita que el estimador usa UMA desde febrero de 2026, no cubre enero u otros años y no compara los dos métodos de retención.
- Corrección de selección de tramo fiscal para importes intermedios con más de dos decimales: ya no quedan fuera de todos los tramos por los huecos entre límites expresados en centavos. No se cambiaron las tarifas.
- Eliminadas del HTML dos ilustraciones redundantes; sus archivos se conservan. Evita solicitar 2,103,362 bytes (aprox. 2.10 MB) de PNG al recorrer esta página. La fórmula permanece en texto seleccionable. Esto no equivale a una mejora medida de Core Web Vitals.
- Eliminada una tabla genérica repetitiva. Conservadas las guías especializadas y el contenido útil, sin rellenar con búsquedas de 2021–2025.
- Relación explícita entre WebPage y WebApplication en datos estructurados. Se mantienen canonical, robots indexables, FAQ concordantes y sitemap.

## Enlaces internos e intención

Se revisaron las versiones realmente servidas según `vercel.json`: algunas guías utilizan archivos fallback diferentes de los artículos fuente. La calculadora general ya recibe enlaces desde las guías de fórmula, salario, ISR, meses y la calculadora proporcional. No hace falta añadir otro bloque repetido de enlaces a esas mismas páginas.

Se mantienen intenciones distintas: herramienta general, herramienta proporcional y guías explicativas. Esta exportación de una sola URL no permite demostrar canibalización entre páginas; no se aplicaron redirecciones, noindex ni cambios de canonical entre ellas.

## Validación y límites

Verificación final completada el 12 de octubre de 2026: la batería de pruebas pasó, incluida la comprobación de desbordamiento a 320 px en modo oscuro. Revisadas las capturas móviles. Los cambios siguen siendo locales y están pendientes de publicación.

Pruebas locales: un H1, canonical propio, datos estructurados parseables, FAQ sincronizadas, anclas válidas y destinos internos existentes; cálculo anual, 180 días, 240 días, equivalencias mensual/quincenal/semanal/diaria, ejemplos por teclado, fechas fuera de rango y cálculo de julio a diciembre. Ejemplo fiscal de $7,500 brutos con ingreso ordinario mensual de $15,000 comprobado: $713.34 de ISR estimado y $6,786.66 netos, bajo los supuestos de esta herramienta.

Los recursos publicitarios externos están bloqueados en las pruebas locales. Se conserva la publicidad y la medición existentes: no se validó su comportamiento real, su impacto comercial ni el rendimiento de terceros. No se dispone de datos CrUX/Core Web Vitals de campo ni inspección autenticada de URL en Search Console. La lectura HTTP directa desde el entorno falló por resolución del host; las referencias web no prueban el despliegue de los cambios locales.

## Publicación y medición

1. Publicar el proyecto completo en Vercel y comprobar la página, el CSS y el JavaScript versionados. No se ha desplegado desde esta revisión.
2. Inspeccionar la URL en Search Console: estado de indexación, canonical seleccionado por Google, último rastreo y prueba de URL publicada. Solicitar indexación una vez si corresponde.
3. Anotar la fecha de despliegue. Comparar ventanas equivalentes de 28 días, usando siempre los mismos filtros; no cambiar títulos repetidamente durante la medición.
4. Seguir clics, impresiones, CTR y posición por consultas generales, proporcionales e ISR. Revisar México y dispositivos con denominadores coherentes.
5. Considerar la estacionalidad de aguinaldo: un aumento al acercarse diciembre no demuestra por sí solo el efecto del SEO.
6. Si no mejora, obtener consulta × página para todo el sitio e informe de experiencia de página. No prometer primera posición ni un aumento determinado de tráfico.

## Referencias consultadas

- [Google: contenido útil y centrado en las personas](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)
- [Google: experiencia de página](https://developers.google.com/search/docs/appearance/page-experience)
- [PROFEDET: preguntas sobre aguinaldo y salario variable](https://profedet.gob.mx/prensa/preguntas_aguinaldo.html)
- [SAT: artículo 174, procedimiento opcional](https://wwwmatnp.sat.gob.mx/articulo/46306/articulo-174)
- [INEGI: UMA](https://www.inegi.org.mx/temas/uma/)
- [Comparación funcional: calcular.com.mx](https://www.calcular.com.mx/aguinaldo). Usada como referencia de experiencia y cobertura, no como autoridad fiscal ni como prueba de posición en Google México.
