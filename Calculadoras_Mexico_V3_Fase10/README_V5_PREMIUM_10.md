# Calculadoras México V5 — Premium 10

Esta versión concentra la mejora en las diez calculadoras con mayor prioridad SEO: ISR, salario neto, finiquito, liquidación, aguinaldo, vacaciones, IVA, horas extra, salario bruto y prima vacacional.

## Mejoras incluidas

- Títulos y descripciones diferenciados según la intención de búsqueda.
- Metodología específica en cada una de las diez páginas.
- 30 ejemplos numéricos completos (tres por calculadora).
- 40 preguntas frecuentes nuevas, visibles y sincronizadas con FAQ Schema.
- Explicaciones personalizadas, desglose y simulaciones en los resultados.
- Salario bruto incorporado al sistema de resultados inteligentes.
- Siguiente acción recomendada después de cada cálculo.
- Enlaces internos contextuales entre herramientas y artículos relacionados.
- Diseño adaptable para ejemplos y recomendaciones en teléfono.
- Recursos versionados como `5.0.0` para evitar que Vercel o el navegador reutilicen archivos antiguos.

## Corrección funcional

Se corrigió la tabla de días de vacaciones por antigüedad: 12, 14, 16, 18 y 20 días durante los primeros cinco años; 22 días del sexto al décimo y aumentos posteriores por bloques de cinco años.

## Alcance y publicación

- Las otras 40 calculadoras conservan su estructura y funcionamiento anterior.
- `sitemap.xml` se mantuvo sin cambios para no interferir con el archivo ya enviado a Google Search Console.
- Para publicar, sube el contenido de esta carpeta al directorio configurado como raíz en Vercel.

## Verificación

Ejecuta `node tools/v5-premium-test.mjs` para revisar las funciones propias de esta entrega. El paquete también conserva las auditorías SEO, móvil, rendimiento, buscador, simuladores y regresión de calculadoras.
