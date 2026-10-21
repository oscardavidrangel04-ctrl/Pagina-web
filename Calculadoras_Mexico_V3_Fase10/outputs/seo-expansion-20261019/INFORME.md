# Mejoras SEO y ampliación del sitio
Aplicadas el 20 de octubre de 2026. Estado: cambios locales terminados y verificados; no publicados.

## Resultado
Se trabajaron 8 páginas existentes, 4 páginas de navegación y 2 nuevas. No se cambiaron las rutas, los canonical ni los H1 de las páginas existentes. Se conservaron los motores generales de cálculo. En pago quincenal y salario diario se mantuvieron también los títulos para evitar un cambio brusco en las páginas con mejor rendimiento.

### Páginas existentes
| Página | Mejora aplicada |
| --- | --- |
| Calculadora de pago quincenal | Descripción más concreta sobre sueldo mensual, desglose y diferencia con catorcena; enlace contextual al conversor de plazos. |
| Calculadora de salario diario | Descripción centrada en cuánto ganas al día y divisores 30/15/7. Sin cambios en título, H1 o cálculo. |
| Calculadora de salario diario integrado | Título y descripción más claros; tres ejemplos de prestaciones seleccionables; validación de campos y foco de error; enlaces a tabla y salario diario. |
| Factor de integración SDI | Tabla original por antigüedad, fórmulas y cifras calculadas; comparación de prestaciones; mejor título y descripción. |
| Calculadora de aguinaldo | Nuevo enlace contextual a la guía de personas trabajadoras del hogar. Se mantienen las mejoras anteriores y el cálculo. |
| Aguinaldo por antigüedad | Título específico, respuesta inicial y comparación de prestaciones; conserva estimador y contenido completo. |
| Aguinaldo por 3 meses | Título y descripción con ejemplo; resultado de $1,849.32 bajo supuestos explícitos en la respuesta inicial. |
| Cuándo pagan el finiquito | Título y descripción orientados a pago por renuncia y retraso; contenido completo y fuentes. |

Las tres últimas guías tienen archivos alternativos que Vercel sirve mediante reescrituras. Se sincronizaron con los principales para que las mejoras no se queden en un archivo que el visitante no recibe. Detalle en `ctr-articulos.md`.

### Dos páginas nuevas, con intenciones distintas
- `calculadoras/quincenas-a-meses.html`: conversor funcional de duración, tabla y preguntas sobre 24/48/144/275 quincenas. Convención explícita: 2 quincenas por mes, 24 por año; no confundir con catorcenas ni con una fecha exacta. No compite por calcular el importe del salario.
- `articulos/aguinaldo-trabajadoras-hogar.html`: guía original con ejemplo, datos por empleador y límites para jornadas discontinuas. No presenta una fórmula automática dudosa para pago por visita; explica qué validar antes de usar la calculadora general. Fuentes oficiales LFT, PROFEDET e IMSS.

Ambas están enlazadas desde páginas existentes y los hubs de nómina/prestaciones. Se actualizaron el directorio de calculadoras y artículos, el catálogo y los datos que usa el buscador. Se incorporaron las nuevas URLs en ambos sitemaps y se modificó lastmod solo en las URLs editadas.

## Datos utilizados y límites
Se leyeron los 5 Excel de GSC del 19 de octubre y los 7 ZIP de Semrush de esa fecha. Los cinco Excel tienen el mismo contenido: **un único informe**, no cinco periodos acumulables. Contiene 1,000 consultas y 166 filas de páginas para 28 de julio–19 de octubre de 2026, tipo Web. Las hojas de consultas y páginas no constituyen un cruce consulta–URL.

Se conservaron los registros completos, rutas de origen y huellas de los archivos en `datos-fuente.json`. El archivo mantiene todas las oportunidades para siguientes fases, no solo las utilizadas hoy.

| Export Semrush | Alcance real | Filas |
| --- | --- | ---: |
| 16-55-52 | URL de aguinaldo de Facturama | 965 |
| 16-58-00 | Dominio propio completo | 812 |
| 16-59-34 | URL de aguinaldo del Gobierno de Nuevo León | 823 |
| 17-02-35 | URL de pago quincenal de BBVA | 100 |
| 17-03-37 | URL de SDI de Integriapps | 287 |
| 17-05-26 | URL de promedio salarial del IMSS | 100 |
| 17-09-27 | Subdominio www.cronista.com | 1,499 |

El último export **no corresponde exclusivamente a la página de propinas**: su parámetro es searchType=subdomain. Se conserva completo, pero se excluyeron de esta implementación temas ajenos como astrología, entretenimiento, noticias y consultas de otros países. El volumen y KD de Semrush son estimaciones de esa exportación, no impresiones ni clics reales del sitio.

### Decisiones apoyadas en los exports
- BBVA: consultas de 48 quincenas (volumen estimado 880 y variante 390) y 144 quincenas (880). Se creó una herramienta específica de plazos y se conservó el contenido útil en pago quincenal.
- Facturama: consultas de aguinaldo para empleadas domésticas/trabajadoras del hogar (variantes con volúmenes estimados de 30–40). Se creó una sola guía por caso, no una página casi idéntica por cada variante.
- Integriapps y consultas GSC de SDI/factor: se reforzó la tabla, metodología y comparación dentro de las URLs que ya existen.
- GSC: se priorizaron descripciones claras y respuestas iniciales en páginas con impresiones y pocos clics. El análisis de hojas evitó sumar exportaciones duplicadas o adjudicar consultas a una URL sin evidencia.

## Referencia inicial para medir resultados
Datos del export recibido, **anteriores a esta edición**, no una promesa ni evidencia de mejora posterior:

| Página | Clics | Impresiones | CTR del export | Posición media |
| --- | ---: | ---: | ---: | ---: |
| Pago quincenal | 69 | 8,693 | 0.79% | 4.79 |
| Salario diario | 35 | 4,995 | 0.70% | 5.23 |
| Aguinaldo | 2 | 814 | 0.25% | 55.41 |
| SDI | 2 | 202 | 0.99% | 21.60 |
| Aguinaldo por antigüedad | 2 | 545 | 0.37% | 12.76 |
| Aguinaldo por 3 meses | 3 | 400 | 0.75% | 7.33 |
| Cuándo pagan finiquito | 1 | 335 | 0.30% | 12.30 |

El CTR global puede cambiar por la mezcla de consultas y posiciones. Para evaluar esta edición, comparar periodos equivalentes después de publicar y segmentar por URL, consulta, dispositivo y país. No atribuir automáticamente al cambio un aumento estacional del interés por aguinaldo.

## Verificación
- Revisión local de **379 URLs indexables**: PASS. Sin enlaces internos rotos, canonical/metadatos inválidos detectados, páginas huérfanas, anclas rotas ni faltantes en sitemap.
- Pruebas Edge en 390 y 1440 px para las dos páginas nuevas, SDI y factor: sin desbordamiento horizontal; un H1 y navegación interna correcta. Capturas en esta carpeta.
- Conversión: 24→12 meses/1 año; 48→24/2; 144→72/6; 275→137.5/11.458333; fracciones y cero. Rechaza vacío, negativo y fuera de rango; restablecer funciona.
- SDI: ejemplos $524.66, $525.34 y $554.79; campos vacíos/negativos rechazados sin robar el foco.
- Buscador de artículos que carga catálogo desde JSON encuentra el nuevo conversor; también aparece en el directorio.
- Contenido y tabla del conversor accesibles sin JavaScript. FAQs visibles y JSON-LD coherentes.
- Tres guías con versiones Vercel: seis vistas comprobadas; estimador de antigüedad y FAQs verificados. Ver `ctr-pruebas.json`.
- Resultados detallados en `pruebas-expansion.json` y `revision-tecnica.json`.

## Entrega y publicación
Los archivos del sitio están directamente en:
`C:\Users\Casa\Downloads\Calculadoras_Mexico_V5_12_0_INTERNAL_AUTHORITY_FINAL(1)`

Los respaldos de archivos anteriores están en `antes/`. No se borró contenido del usuario ni se modificó el scraper. No se hizo commit, push ni despliegue.

La carpeta de evidencias no es contenido del sitio. Se añadió una exclusión específica en `.vercelignore` para no servir estos exports, respaldos y capturas en Vercel. Conserva los datos localmente; evita subirlos a un repositorio público. Esta exclusión de Vercel no hace privado un repositorio de GitHub.

Al copiar el sitio al repositorio, revisa el diff y publica los archivos web nuevos junto con CSS, JS, datos de catálogo, sitemaps y los tres fallbacks actualizados. No borres `.git` ni la configuración propia del repositorio destino. La fecha de medición debe comenzar con la publicación real, no con la edición local.

## Fuentes
- [LFT vigente: artículos 76, 80, 87 y trabajo del hogar](https://www.diputados.gob.mx/LeyesBiblio/pdf/LFT.pdf).
- [PROFEDET: aguinaldo y salario aplicable](https://www.gob.mx/profedet/es/articulos/la-profedet-es-tu-aliada-en-el-pago-del-aguinaldo-conoce-todo-sobre-este-tema-y-haz-valer-tu-derecho).
- [IMSS: personas trabajadoras del hogar](https://www.imss.gob.mx/personas-trabajadoras-hogar/preguntas).
- [Google: títulos en los resultados](https://developers.google.com/search/docs/appearance/title-link) y [descripciones](https://developers.google.com/search/docs/appearance/snippet). Los textos propuestos no obligan a Google a mostrarlos literalmente.
- [Vercel: exclusión de archivos del despliegue](https://vercel.com/docs/deployments/vercel-ignore).

No se garantiza el primer puesto ni un incremento específico de clics. La implementación mejora claridad, cobertura y utilidad; su efecto se debe comprobar con GSC después de publicar y de que Google vuelva a procesar las páginas.
