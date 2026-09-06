# V5.6.41 — Aguinaldo Unique Inlinks (rewrite-aware)

Diagnóstico: varias URLs de `/articulos/...` se sirven mediante `vercel.json` desde archivos `fallback-*.html`. Las versiones anteriores añadían enlaces a los HTML canónicos, pero en producción Vercel podía estar entregando el fallback, por lo que Screaming Frog no veía esos enlaces.

Esta versión añade los enlaces físicos tanto al archivo canónico como al fallback efectivo cuando existe rewrite. No elimina el mecanismo fallback/rewrite que solucionó los 404.

Se usan 20 páginas fuente laborales distintas y enlaces HTML estáticos.
