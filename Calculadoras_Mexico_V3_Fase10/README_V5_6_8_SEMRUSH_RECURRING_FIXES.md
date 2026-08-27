# V5.6.8 — Correcciones recurrentes Semrush

Aplicadas sobre V5.6.7.

- Todas las páginas HTML apuntan a archivos `.min.css` / `.min.js` cuando existe equivalente minificado.
- Service Worker actualizado para cachear recursos minificados y cache version `v5.6.8`.
- Se diferenciaron `<title>` y H1 en las 13 URLs reportadas por Semrush, sin cambiar la intención de búsqueda.
- Se reforzó el enlazado interno de las URLs con pocos enlaces entrantes, especialmente PTU, inflación, tasa efectiva, SDI, tiempo de ahorro y otras relacionadas.
- Los artículos `aguinaldo-isr-2026.html` y `aguinaldo-si-renuncio.html` reciben enlaces desde el hub de artículos y páginas temáticamente relacionadas.
- Verificado: no quedan referencias activas al host `www` inválido dentro del proyecto.

## Nota sobre el aviso SNI
El subdominio `www` añadido delante del dominio `*.vercel.app` no pertenece al proyecto y su TLS se resuelve antes de cualquier redirección de aplicación. Si Semrush prueba ese hostname por su cuenta, el aviso SNI puede persistir aunque el sitio no lo enlace. No se debe introducir una redirección falsa ni una referencia al host inválido.
