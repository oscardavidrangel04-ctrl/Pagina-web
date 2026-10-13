# Fase 6: cierre, control de calidad y seguimiento SEO

Fecha: 13 de octubre de 2026. Estado: trabajo local finalizado; publicación y medición en producción pendientes.

## Qué se ha hecho en esta fase

Se añadió una revisión ampliada reproducible y un comando que reúne las pruebas de las fases anteriores. No se cambiaron de nuevo los snippets ni el contenido que acababan de optimizarse: la revisión final no detectó un defecto que justificara esos cambios.

La comprobación ampliada verifica las páginas realmente servidas, incluidas las reescrituras de Vercel: un H1, título no vacío, canonical, descripción, idioma español, configuración móvil, JSON-LD legible, permisos de robots.txt, anclas entre páginas, recursos locales y destinos de reescritura. También verifica cobertura de sitemap, enlaces y duplicados de metadatos mediante la auditoría anterior. Es una validación técnica local, no una certificación de elegibilidad para resultados enriquecidos ni una auditoría legal de cada contenido.

Para repetir todas las comprobaciones desde esta carpeta:

```powershell
node scripts/check-seo-release.cjs
```

El comando devuelve error si falla cualquiera de los nueve bloques. Requiere Python, Playwright y Edge; usa las dependencias instaladas en este equipo. No publica archivos ni accede a cuentas. Las pruebas de navegador bloquean conexiones externas y pueden actualizar las capturas de comprobación en `outputs`.

## Resultado final

- 406 archivos de página en el inventario; 377 URLs canónicas indexables según la configuración local. No son 377 URLs confirmadas como indexadas por Google.
- Sin incidencias detectadas por la revisión ampliada.
- Sin enlaces locales rotos, páginas huérfanas, destinos inaccesibles desde inicio, ni títulos o descripciones duplicados.
- 357 guías y calculadoras mantienen cobertura en los 12 directorios temáticos.
- Nueve bloques de pruebas aprobados: auditoría completa, clasificación temática, lotes editoriales 2 y 3, navegación temática sin JavaScript, carga/buscador, salario neto, salario por hora y aguinaldo.
- Las pruebas visuales y funcionales se aplican a las muestras definidas en cada prueba, no a las 377 páginas completas en un navegador. La revisión estática sí incluye las 377 URLs.

## Resumen de las seis fases

1. **Base técnica:** indexabilidad local, sitemaps, enlaces, anclas y marcado.
2. **Primer lote editorial:** diez páginas con visibilidad entre posiciones medias 2 y 10.
3. **Segundo lote editorial:** diez páginas entre posiciones medias mayores de 10 y hasta 30.
4. **Arquitectura:** doce temas, rutas por objetivo, reclasificación y navegación móvil.
5. **Carga e interacción:** catálogo ligero, menos peticiones repetidas y trabajo inicial innecesario.
6. **Cierre:** revisión integrada y protocolo de publicación y medición.

Los informes detallados están en esta misma carpeta. El proyecto no debe considerarse «SEO agotado»: el siguiente ciclo se decide con datos posteriores a la publicación.

## Publicación: lista de comprobación

- [ ] Conservar una copia de la versión desplegada anterior para poder volver atrás.
- [ ] Publicar desde la raíz completa del proyecto mediante el flujo habitual de Vercel. No subir únicamente `calculadoras` o `articulos`: hay cambios en archivos `fallback-*.html`, recursos compartidos, temas y configuración.
- [ ] Incluir `assets/data/calculators.json`, incorporado en la fase 5.
- [ ] Registrar fecha, hora y enlace/identificador del despliegue. No usar la fecha de edición local como fecha de publicación.
- [ ] Comprobar respuestas HTTP y canonical en inicio, salario neto, salario por hora, aguinaldo, pago quincenal, aguinaldo por antigüedad y los temas nómina/prestaciones.
- [ ] Comprobar al menos una guía con reescritura: `/articulos/cuando-pagan-finiquito.html`. Debe conservar la URL pública y servir el contenido actualizado.
- [ ] Probar cálculo, menú, búsqueda y vista móvil con anuncios y servicios externos activos; comprobar también la primera visita y el modo sin conexión después de cargar la web.
- [ ] Comprobar que los dos sitemaps declarados en robots.txt responden correctamente y no tienen errores en Search Console.
- [ ] Revisar con Inspección de URLs una muestra de las páginas prioritarias, su canonical seleccionado y la prueba de URL publicada. Solicitar indexación cuando proceda, sin repetir solicitudes como estrategia de posicionamiento.
- [ ] Revisar PageSpeed Insights y el informe de Core Web Vitals; no extrapolar los resultados locales al comportamiento de usuarios reales.

Las carpetas de informes y scripts tienen protección de noindex mediante la configuración revisada. Noindex no proporciona confidencialidad: no añadir datos personales ni credenciales a archivos que se publiquen.

## Medición para saber si funciona

**Punto de partida:** el Excel anterior y las métricas citadas en fases 2 y 3 son históricos. No representan posiciones actuales. Antes de publicar, guardar una exportación nueva de Search Console, con los últimos 28 días completos disponibles, para disponer de una base comparable.

**Filtros:** búsqueda web, país México, separar móvil/escritorio y conservar los mismos filtros en cada comparación. Guardar clics, impresiones, CTR y posición media por URL. Para entender los snippets, filtrar una URL y exportar sus consultas: las consultas globales del sitio no se pueden atribuir automáticamente a esa página.

**Prioridades:** pago quincenal, salario diario, salario neto, salario por hora, aguinaldo, aguinaldo por antigüedad y cuándo pagan finiquito; después, el resto de los lotes y los doce temas.

**Calendario propuesto, no automatizado:**

- Tras publicar: comprobar funcionamiento, respuestas y configuración.
- Primera semana: revisar rastreo, indexación e incidencias; no concluir el efecto SEO con unos pocos días.
- A los 28 días completos posteriores a la publicación: comparar con los 28 anteriores, considerando cuándo Google volvió a rastrear las páginas. Es una ventana de análisis, no un plazo prometido para mejorar.
- A los 56 días: revisar tendencia y decidir el siguiente lote. Para aguinaldo, contrastar también con el mismo periodo del año anterior si existe información; su estacionalidad puede aumentar impresiones sin que el cambio SEO sea la causa.

| Lo que muestran los datos | Próxima acción |
|---|---|
| Más impresiones, posición semejante, CTR menor | Separar nuevas consultas y dispositivos; puede estar creciendo la cobertura en búsquedas donde antes no aparecía. No cambiar el título solo por el promedio. |
| Posición semejante y CTR bajo en las mismas consultas | Examinar título y fragmento que Google muestra, intención de búsqueda y elementos de la SERP. Probar un cambio específico por lote. |
| Impresiones estables y caída de posición | Revisar indexación/canonical, competencia, contenido y posibles cambios generales antes de atribuirlo al último ajuste. |
| Mejora de clics, CTR y posición con filtros comparables | Mantener lo que funciona y ampliar gradualmente el trabajo. |
| Muy pocas impresiones | Acumular más datos; no declarar éxito o fracaso por cero clics con una muestra pequeña. |

Calcular CTR de un conjunto como clics totales / impresiones totales, no como promedio simple del CTR de sus páginas. La posición media no equivale a una posición fija. No establecer un CTR objetivo universal: depende de consulta, posición, dispositivo y presentación de resultados.

## Pendientes y límites

No se publicó en Vercel, no se enviaron sitemaps o solicitudes a Search Console y no se creó una monitorización automática. No se pueden confirmar más clics, impresiones o posiciones por cambios que todavía son locales. Las seis fases cierran este lote de trabajo; no garantizan el primer puesto.

Referencias: [seguimiento con Search Console](https://developers.google.com/search/docs/monitor-debug/search-console-start) y [cómo genera Google los títulos de resultados](https://developers.google.com/search/docs/appearance/title-link).
