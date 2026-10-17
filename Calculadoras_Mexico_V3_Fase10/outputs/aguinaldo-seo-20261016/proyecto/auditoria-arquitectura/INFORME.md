# Auditoría e implementación de arquitectura SEO
Fecha: 9 de octubre de 2026. Alcance: proyecto local; cambios no publicados.

## Resultado antes y después
| Métrica local | Antes | Después |
|---|---:|---:|
| Documentos HTML físicos del sitio | 393 | 405 |
| URLs potencialmente indexables | 365 | 377 |
| URLs sin enlaces entrantes desde páginas indexables | 35 | 0 |
| URLs con una sola página de origen | 62 | 0 |
| URLs sin camino HTML desde Home | 45 | 0 |
| Profundidad máxima de las alcanzables | 7 | 2 |
| Enlaces internos rotos | 0 | 0 |
| Enlaces a redirecciones configuradas | 0 | 0 |
| URLs de sitemap ausentes en el proyecto | 0 | 0 |
| URLs de sitemap no indexables según HTML/configuración | 0 | 0 |

Profundidad antes: 1 URL a cero clics, 52 a uno, 141 a dos, 6 a tres, 52 a cuatro, 54 a cinco, 13 a seis, 1 a siete y 45 sin ruta.
Después: Home, 64 URLs a un clic y 312 a dos. Las 12 nuevas son HUBs, no artículos creados para rellenar.

## Arquitectura antes
La cifra de unas 200 URLs no corresponde al inventario de esta copia: se localizaron 365 URLs con canonical propio y sin noindex, excluyendo aliases y páginas auxiliares. La cifra de unas 38 indexadas procede del contexto del usuario y no fue confirmada en Search Console durante esta tarea.

Había navegación útil hacia calculadoras principales, clústeres laborales y artículos generales. Sin embargo, parte del contenido reciente de ahorro, presupuesto, inversiones y crédito no tenía una ruta HTML completa desde Home. El sitemap cubría las URLs, pero no sustituía esos caminos: 35 carecían de inlinks y otras formaban grupos desconectados. Había profundidad de hasta siete clics.

Hay 25 rewrites exactos en Vercel: ciertas URLs de artículos sirven archivos fallback. Auditar únicamente el archivo situado en articulos/ habría dado resultados distintos de la implementación servida. Se utilizó el destino efectivo y se mantuvieron los dos archivos consistentes para los bloques nuevos.

No se encontraron exportaciones actuales de Screaming Frog en el proyecto ni una exportación claramente identificable en la carpeta de descargas. Los ZIP antiguos con nombres de versiones no se trataron como un crawl actual. El baseline es el código real, no una métrica inventada de Screaming Frog.

## Arquitectura después
Ruta principal: Home → HUB temática → herramienta o guía.
Cada página específica tiene una ruta de vuelta al tema. Las HUBs también enlazan temas próximos, no todas con todas.

| HUB | Páginas existentes agrupadas |
|---|---:|
| /temas/nomina.html | 25 |
| /temas/prestaciones.html | 76 |
| /temas/impuestos.html | 34 |
| /temas/ahorro.html | 38 |
| /temas/presupuesto.html | 33 |
| /temas/inversion.html | 25 |
| /temas/credito.html | 58 |
| /temas/transferencias.html | 10 |
| /temas/seguros.html | 14 |
| /temas/retiro.html | 16 |
| /temas/negocios.html | 5 |
| /temas/herramientas.html | 23 |

Las HUBs agrupan 357 páginas específicas. Las ocho URLs restantes son Home, catálogos e institucionales.
Cada HUB explica la intención, organiza subtemas y diferencia herramientas de guías. Prestaciones se divide en aguinaldo, vacaciones, PTU y distintos aspectos de terminación; crédito separa vivienda, préstamos, historial, pagos y elección de tarjetas. Se aprovecha el diseño existente, con una hoja aislada para que la navegación de las HUBs siga visible en móvil.

Home enlaza las doce HUBs mediante tarjetas descriptivas. Los catálogos de artículos, calculadoras y simuladores también ofrecen rutas a los temas. Los bloques y HUBs se generan como HTML estático: no dependen de ejecutar JavaScript para encontrar los enlaces.

## Enlazado interno y autoridad
Los enlaces entrantes se cuentan por páginas de origen distintas, no por repetir un enlace veinte veces. Se excluyen aliases no canónicos como fuentes de autoridad para no inflar el conteo.

Se conservaron los enlaces y navegación anteriores. Se añadieron enlaces de vuelta al tema y relaciones laterales con coincidencia temática específica; no se impuso una cuota de enlaces por página. En una segunda revisión se reforzaron 16 páginas que aún tenían un solo origen mediante textos explicativos desde páginas pertinentes.

Ejemplos: CETES → ahorro recurrente, tasas e impuestos; inflación → inflación personal; indemnización → despido justificado e indemnización constitucional; cobro de finiquito → revisión de documentos antes de firmar; tarjetas bancarias → tarjetas departamentales y productos para estudiantes. Las conexiones aclaran por qué continuar, no simulan que todos esos supuestos tengan las mismas reglas.

Se mantuvieron anchors de interfaz como “Abrir calculadora” y “Leer guía” cuando pertenecen a tarjetas con título y descripción. No se sustituyeron indiscriminadamente. Los enlaces añadidos usan el nombre o intención de la página destino.

## Cambios técnicos y protecciones
- Sitemap principal: doce entradas nuevas con canonical propio. Las entradas previas se conservaron.
- Sitemap secundario, robots.txt y vercel.json: sin cambios.
- Robots permite el rastreo; no se detectaron entradas indexables bloqueadas por las reglas actuales.
- Una redirección preexistente /articulos/articulos.html → /articulos.html, sin enlaces internos detectados hacia ella. No se añadieron redirecciones.
- Se conservaron canonical, title y robots de todas las URLs anteriores: validación sin diferencias.
- Todas las URLs indexables tienen un H1 y los JSON-LD son parseables.
- No se modificaron fórmulas, controladores de calculadoras, FAQs, contenido editorial anterior, tracking ni publicidad.
- Los 25 destinos de rewrite existentes continúan siendo archivos disponibles.
- El service worker usa red primero para navegación; no se alteró ni se introdujo dependencia de su caché para estos enlaces.

## Inventarios y archivos exactos
Los inventarios JSON antes/después incluyen URL, archivo físico y servido, canonical, robots, inclusión en sitemap, estado HTTP esperado, profundidad, inlinks únicos, outlinks, anchors, orígenes y clase de ubicación de enlaces, clúster y subtema.

Las ubicaciones son una clasificación HTML aproximada: navegación, footer, HUB o contenido/relacionados. No una medición de posición visual. “Indexable” expresa elegibilidad local, no indexación efectiva ni selección de canonical por Google. El HTTP es esperado según archivos y reglas, no una prueba de producción.

El tipo de página y su HUB correspondiente están también en mapa-urls.json. La lista exacta de archivos está en archivos.json:
- 387 archivos existentes modificados: 357 páginas específicas, 25 fallbacks efectivos, Home y tres catálogos, y sitemap.xml.
- 12 HUBs nuevas.
- CSS aislado y tres scripts de auditoría, planificación y validación.
- Inventarios y reporte en esta carpeta.

Los scripts son de lectura/planificación: no escriben el sitio por sí mismos. El plan entrega parches revisables; la implementación se aplicó con parches. El inventario previo quedó guardado antes de modificar los documentos del sitio.

## Riesgos y pendientes
1. Publicar y probar las URLs y rewrites en Vercel. No se ha desplegado esta tarea ni comprobado HTTP de todas las rutas públicas.
2. Hacer un crawl de producción con Screaming Frog para comparar el grafo servido, status HTTP, canonicals y navegación móvil real. No se hizo una prueba visual integral.
3. Solicitar rastreo del sitemap actualizado y observar cobertura en Search Console. Eliminar huérfanas facilita descubrimiento, pero no garantiza indexación ni aprobación de AdSense.
4. Revisar con consultas de Search Console familias de intención próximas: finanzas-personales / finanzas-sanas / como-tener-buenas-finanzas; presupuesto-personal / como-hacer-presupuesto; cuenta-de-ahorro / cuenta-ahorro-tradicional; guías y calculadoras de aguinaldo proporcional. Son candidatos para contrastar intención, no duplicados demostrados. No se fusionaron ni cambiaron canonical sin evidencia.
5. Las HUBs de prestaciones y crédito son las más extensas; revisar uso real antes de subdividirlas más. Actualmente sus subtemas mantienen una organización explícita.
6. La auditoría de arquitectura no incrementa el contador del proceso On Page Fino: son cambios de navegación, no nuevas auditorías competitivas de contenido.

