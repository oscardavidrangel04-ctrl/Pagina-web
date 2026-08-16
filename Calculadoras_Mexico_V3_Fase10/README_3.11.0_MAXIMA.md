# Calculadoras México 3.11.0 — mejora máxima

Versión preparada el 1 de agosto de 2026. El ZIP de entrega coloca `index.html`,
`assets`, `calculadoras` y los demás archivos directamente en la raíz; no crea
otra carpeta envolvente.

## Mejoras principales

- Se corrigió el error `CM_CATALOG is not defined` que dejaba el buscador sin resultados.
- `catalog.js`, `common.js`, `calculators.js` y `simulators.js` se cargan separados y con versión `3.11.0`.
- El buscador recupera el catálogo desde el HTML si el archivo principal no llega a cargar.
- El inicio tiene un buscador visible con resultados instantáneos.
- El catálogo muestra 50 tarjetas incluso sin JavaScript y permite filtrar por texto o categoría.
- Se mejoraron ancho, tipografía, botones, resultados, tablas, navegación y espaciado en celular.
- Se eliminaron rótulos internos como “Portal V3 — Fase…”.
- Las 50 calculadoras incluyen contenido visible sobre el método y la interpretación del cálculo.
- Se agregaron referencias oficiales en páginas clave de ISR, prestaciones laborales y CETES.
- Sitemap válido con namespace, 66 URLs y fecha `2026-08-01`.
- Metadatos, canónicos, Open Graph, Twitter Cards, JSON-LD, FAQ y enlaces relacionados revisados.
- Caché y service worker cambiaron a `3.11.0` para reemplazar archivos antiguos.
- Cabeceras de seguridad, caché actualizable para CSS/JS y caché larga para imágenes.

## Pruebas superadas

- 50 de 50 calculadoras generan resultados con sus valores de prueba.
- Búsqueda de `aguinaldo`, `préstamo`, `salario` e `IVA`.
- Catálogo estático de 50 tarjetas y filtros por categoría.
- Buscador del inicio, buscador global y cálculo de ISR en un navegador simulado.
- 68 páginas con viewport adaptable, navegación móvil y controles táctiles.
- 68 páginas con títulos y canónicos únicos, metadata y JSON-LD válidos.
- 66 URLs del sitemap, namespace XML, enlaces y scripts locales válidos.
- Simuladores de salario, préstamo y ahorro.
- Política de caché, aplicación instalable y página sin conexión.

## Cómo publicarla sin repetir el problema de la carpeta

1. Descomprime el ZIP.
2. En la raíz del repositorio de GitHub deben verse directamente:
   - `index.html`
   - `calculadoras.html`
   - `sitemap.xml`
   - `assets/`
   - `calculadoras/`
   - `articulos/`
3. No subas una carpeta llamada `Calculadoras_Mexico_V3_3.11_MAXIMA` dentro del repositorio.
4. En Vercel abre **Settings → Build and Deployment → Root Directory**.
5. Deja **Root Directory vacío** y guarda. No escribas `Calculadora_ISR` ni el nombre del ZIP.
6. Espera el despliegue de la rama `main`.
7. Abre la web con `?actualizacion=3110` o usa `Ctrl + F5` una vez para evitar caché visual antigua.

## Comprobación después del despliegue

- `/` debe mostrar el buscador “¿Qué necesitas calcular?”.
- Buscar `aguinaldo` debe mostrar Aguinaldo y Aguinaldo proporcional.
- `/calculadoras.html` debe mostrar “50 calculadoras disponibles”.
- `/assets/js/catalog.js?v=3.11.0` debe comenzar con `globalThis.CM_CATALOG`.
- `/sitemap.xml` debe comenzar con el namespace `http://www.sitemaps.org/schemas/sitemap/0.9`.

Después del despliegue, vuelve a enviar solamente `sitemap.xml` en Search Console. La
indexación y las impresiones no son inmediatas; esta versión deja la base técnica lista,
pero Google sigue decidiendo cuándo rastrear y posicionar cada URL.
