# V5.6.44 — Ajustes Screaming Frog + refuerzo de inlinks

Base: V5.6.43 Finiquito Cluster Fase 1.

Cambios realizados:
- Se corrigió el segundo H1 del home: ahora solo existe un H1 principal.
- Se acortaron 9 titles que excedían longitud/ancho recomendable en el crawl.
- Se acortaron 4 meta descriptions que estaban en el límite o excedían el ancho de píxeles.
- Se reforzaron inlinks contextuales hacia:
  - /articulos/cuando-tengo-derecho-finiquito.html
  - /articulos/que-es-el-finiquito.html
  - /articulos/carta-finiquito-laboral.html
  - /articulos/que-es-propina.html
- En páginas servidas por rewrites se editaron también los fallback HTML correspondientes.
- No se eliminaron las URLs oficiales gob.mx que Screaming reportó con 403: el 403 puede ser un bloqueo al crawler y no prueba que estén rotas para usuarios.
- No se tocaron canonicals, robots, sitemap ni schema porque el crawl reportó las páginas HTML indexables y sin errores de datos estructurados.

Validar después del deploy:
1. Crawl HTML de producción.
2. Confirmar 1 H1 en home.
3. Revisar Page Titles y Meta Description por píxeles.
4. Revisar Unique Inlinks de los cuatro targets reforzados.
5. Verificar que los enlaces oficiales sigan abriendo en navegador.
