# Publicar la versión corregida 3.10.1

1. Descomprime el ZIP.
2. Sube **el contenido** a la raíz del repositorio. `index.html`, `sitemap.xml`, `sw.js`, `manifest.webmanifest` y `vercel.json` deben quedar al primer nivel.
3. Espera a que Vercel marque el despliegue como `Ready`.
4. Abre el sitio en una ventana privada y revisa Inicio, Calculadoras, Simuladores y una calculadora.
5. Comprueba que `/assets/js/common.js?v=3.10.1` muestre código y no una página `404`.
6. Abre `/sitemap.xml` y confirma el namespace `http://www.sitemaps.org/schemas/sitemap/0.9`.
7. Si el sitemap ya estaba enviado, conserva la misma entrada. No es necesario solicitar manualmente las 66 URL.
8. Revisa Analytics y Search Console después de que acumulen datos.

Es indispensable subir todas las carpetas y archivos del ZIP. Si aparece una versión anterior, recarga sin caché una vez. El service worker 3.10.1 elimina las cachés internas anteriores y los recursos principales llevan un identificador nuevo.
