# Calculadoras México V5.1 — Home, clusters y SEO semántico

V5.1 conserva las 50 calculadoras y profundiza la arquitectura del portal alrededor de las diez herramientas Premium.

## Home convertida en hub

- H1, title y description centrados en calculadoras fiscales, laborales y financieras para México.
- Acceso destacado a las diez calculadoras Premium.
- Seis rutas temáticas: nómina, prestaciones, impuestos, finanzas, créditos y negocios.
- Bloque de metodología, revisión y fuentes según el tipo de cálculo.
- Preguntas frecuentes visibles y FAQ Schema.
- Enlaces directos hacia las calculadoras prioritarias y los grupos del catálogo.

## Catálogo y clusters

- El catálogo funciona como hub temático sin crear páginas duplicadas.
- Los enlaces `calculadoras.html?categoria=...` activan automáticamente el filtro correspondiente.
- Los filtros actualizan la URL sin recargar la página.
- Las 50 tarjetas siguen presentes en el HTML para usuarios y buscadores.

## Diez páginas Premium

- Una tabla de casos concretos en cada calculadora prioritaria.
- 39 escenarios numéricos adicionales con supuestos visibles.
- Casos orientados a búsquedas específicas de salario, tiempo trabajado, antigüedad, IVA y horas extra.
- Notas que explican qué incluye y qué no incluye cada referencia.

## Seguridad técnica

- Recursos versionados como `5.1.0` para evitar caché antigua.
- No se modificaron las URLs existentes.
- No se añadieron páginas duplicadas de categorías.
- `sitemap.xml` permanece exactamente igual al de V5.

Ejecuta `node tools/v5-1-semantic-test.mjs` junto con las auditorías existentes antes de publicar.
