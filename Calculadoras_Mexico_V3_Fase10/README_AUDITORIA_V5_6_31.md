# Calculadoras México V5.6.31 — Ziro Full Site

## Qué se implementó
- Rediseño visual global inspirado en la plantilla Ziro aportada por el usuario.
- Home nuevo con hero, buscador visual, dashboard rápido y tarjetas populares estilo Ziro.
- Tema Ziro aplicado también a calculadoras, artículos, hubs, simuladores, páginas legales, 404, offline y fallbacks Vercel.
- Se conservaron URLs, contenido SEO, formularios, IDs, scripts de cálculo, canonicals, JSON-LD, sitemap y los 19 rewrites/fallbacks de artículos de la V5.6.30.
- CSS nuevo: `/ziro-theme-v5631.css?v=5.6.31`.
- Service Worker actualizado a `calculadoras-mx-v5.6.31-ziro`.

## Auditoría realizada
- 107 archivos HTML revisados y 107/107 cargan el nuevo tema.
- 50 calculadoras conservadas.
- 27 artículos conservados.
- 19 fallbacks Vercel conservados.
- 85 URLs del sitemap comprobadas en servidor local: 85/85 responden 200.
- 0 referencias internas a archivos inexistentes.
- 0 errores de JSON-LD.
- 0 canonicals faltantes en páginas de contenido.
- Solo `404.html` y `offline.html` mantienen `noindex`, como corresponde.
- Comparación de las 50 calculadoras antes/después: 0 diferencias en IDs de controles o scripts enlazados.
- 307 IDs funcionales y 846 controles de formulario/botones de calculadoras presentes tras el rediseño.
- `sw.js` validado sintácticamente con Node.
- Título y meta description del Home SEO se conservaron.
