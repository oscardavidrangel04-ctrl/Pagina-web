# Calculadoras México V5.6.27

Correcciones aplicadas a partir del rastreo de Screaming Frog del 2 de septiembre de 2026.

- Se incluyen físicamente los 19 artículos que el despliegue anterior devolvía como 404.
- CSS único de release: `/styles-v5627.css?v=5.6.27`.
- Service Worker actualizado a `calculadoras-mx-v5.6.27`.
- Enlaces de CONDUSEF que devolvían 500/conexión rechazada sustituidos por páginas oficiales estables en `gob.mx/condusef`.
- Redirección permanente de `/articulos/articulos.html` a `/articulos.html`.
- Titles y meta descriptions cortos/largos detectados por Screaming Frog ajustados en el hub y artículos antiguos prioritarios.
- Sitemap revisado y fechas de artículos actualizadas.

Los recursos externos de publicidad `bleatbehind.com` se conservan porque forman parte de la integración publicitaria; si el proveedor no resuelve DNS, ese fallo depende del proveedor y no de un archivo local faltante.
