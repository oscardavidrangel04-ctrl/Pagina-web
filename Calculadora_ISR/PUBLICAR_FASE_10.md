# Publicar la Fase 10

1. Descomprime el ZIP.
2. Sube **el contenido** a la raíz del repositorio. `index.html`, `sitemap.xml`, `sw.js`, `manifest.webmanifest` y `vercel.json` deben quedar al primer nivel.
3. Espera a que Vercel marque el despliegue como `Ready`.
4. Abre el sitio en una ventana privada y revisa Inicio, Calculadoras, Simuladores y una calculadora.
5. Abre `/sitemap.xml` y confirma el namespace `http://www.sitemaps.org/schemas/sitemap/0.9`.
6. Envía `sitemap.xml` en Search Console. No es necesario solicitar manualmente las 66 URL.
7. Revisa Analytics y Search Console después de que acumulen datos.

Si aparece una versión anterior, recarga sin caché una vez. El service worker de la Fase 10 elimina automáticamente cachés de versiones anteriores.
