# V5.6.11 — CSS load hotfix

Corrección del sitio desplegado sin estilos.

- Se restauró la hoja estable `/assets/css/styles.css` en todas las páginas HTML.
- Se usa una ruta absoluta desde raíz para evitar problemas de resolución en páginas anidadas.
- Se actualizó el cache-busting a `v=5.6.11`.
- Se actualizó el Service Worker al cache `calculadoras-mx-v5.6.11` y su recurso CSS principal.
- Se conservan las mejoras de enlazado interno de V5.6.10.
- No se modificaron fórmulas ni lógica de las calculadoras.
