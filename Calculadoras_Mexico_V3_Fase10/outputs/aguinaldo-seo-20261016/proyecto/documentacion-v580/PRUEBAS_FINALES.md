# Validación final — V5.8.0

- 129 archivos HTML examinados; 101 URLs canónicas en sitemap, antes 91.
- Diez guías presentes una sola vez en sitemap, con canonical coincidente y sin noindex.
- 8,227 referencias locales a recursos, enlaces y fragmentos comprobadas: cero destinos faltantes.
- Cero páginas canónicas huérfanas; diez guías nuevas a dos clics desde home.
- 190 bloques JSON-LD parseables; cero IDs HTML duplicados.
- robots.txt y vercel.json idénticos a V5.7.0. Dominio sin www; URLs anteriores conservadas.
- Metadatos principales, contenido previo y scripts funcionales originales comparados con la base.
- JavaScript: comprobación sintáctica con node --check sin errores.
- 50 casos de cálculo comparados con V5.7.0: resultados iguales. No es una auditoría fiscal exhaustiva de todos los casos límite.
- 50 casos de manejadores de exportación CSV, copia, compartir por fallback e impresión: pasan en entorno simulado. Los JSON adjuntos conservan los resultados por calculadora.
- Navegador: PTU muestra 6,000.00 (3,000 por días + 3,000 por salario) y gráfica; SDI muestra factor 1.049315 y 524.66 con salario diario 500 y prestaciones por defecto.
- Navegación de guía a calculadora y apertura del menú móvil verificadas.
- Tres vistas móviles: PTU, factor SDI y catálogo de artículos, ancho útil de 375 px; scrollWidth 375. Encabezados corregidos con ancho 345 px dentro del contenedor, sin recorte observado. Revisión visual de artículo en escritorio.
- El empaquetado compara todos los archivos del ZIP con la carpeta final y verifica CRC. No se incluyen el servidor ni la página auxiliar de pruebas.

Exclusiones justificadas del rastreo estático: /_vercel/ es un recurso de plataforma; #categoria=... lo resuelve el JavaScript del catálogo. No se trataron como fragmentos HTML estáticos.

Consultar CHANGELOG_V5_8_0.md para limitaciones de portapapeles, terceros, indexación y alcance fiscal.
