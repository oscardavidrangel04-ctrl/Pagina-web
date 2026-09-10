# Calculadoras México — CHANGELOG V5.8.0 FINAL

Base: Calculadoras_Mexico_V5_7_0_FINAL.zip. Fecha de entrega: 9 de septiembre de 2026.
Dominio conservado: https://calculadora-isr-mexico.vercel.app/

## SEO y arquitectura

- PTU: cuatro guías sobre reparto, obligados y fechas; elegibilidad y renuncia; límite de tres meses frente al promedio de tres años; exención y retención de ISR. Ejemplos y advertencias explícitas sobre los límites de la calculadora.
- SDI: dos guías que separan salario diario, SDI y SBC; fórmula del factor con prestaciones básicas y superiores. Conexiones con salario, prestaciones y salida laboral.
- Salario: guía de conversiones mensual, quincenal, diario, por hora y anual; refuerzo de recibo de nómina con desglose práctico. La página de bruto frente a neto conserva su intención, título y contenido previo.
- ISR: guías sobre periodos de retención y asimilados a salarios. La calculadora de ISR recibe enlaces contextuales. Ejemplo mensual contrastado con Anexo 8 de la RMF 2026.
- Liquidación: guía de despido e indemnización con condiciones legales; conexiones con finiquito, liquidación y renuncia sin presentar 20 días por año como derecho automático en todo despido.
- Home y hub de artículos: acceso a cinco grupos temáticos. Mini-bloques contextuales en las calculadoras y artículos pertinentes; no se sustituyó la navegación previa.
- Las nuevas páginas reutilizan el diseño, componentes y scripts existentes. No se agregaron dependencias.
- Aguinaldo, propina, vacaciones y finiquito no se reconstruyeron. Se conservaron las páginas y sus textos; solo se añadieron conexiones donde correspondía.

## SEO técnico y conservación

- Sitemap: de 91 a 101 URLs canónicas, sin retirar las anteriores; diez altas y lastmod de las páginas modificadas, incluido simuladores.
- Canonicals, titles, H1 y robots de las páginas originales conservados. robots.txt y vercel.json idénticos a la base.
- Nuevas guías con descripción, encabezados, breadcrumb, datos estructurados y FAQ visibles. Fechas de publicación reales; sin atribuir revisiones a personas inventadas.
- llms.txt actualizado y versión de caché del service worker elevada a V5.8.0.
- Se conservaron todas las URLs, enlaces y bloques de texto SEO anteriores comprobados. Las copias de respaldo de rutas reescritas se actualizaron de forma consistente.
- Todos los scripts funcionales y publicitarios presentes en páginas originales se conservaron. Los archivos JS de cálculos son idénticos byte por byte.

## Errores reales corregidos durante la validación anterior

- PTU: el campo días totales tenía min=0.01 junto a step=1, lo que rechazaba valores enteros como 5000 por validación nativa. Se cambió únicamente el mínimo a 1. Fórmula intacta.
- Simuladores: se agregó el id prestamos al encabezado existente para resolver un enlace con fragmento sin destino.
- Encabezados: una regla heredada imponía width:100vw pese al contenedor con márgenes. Se añadió una única regla de contención en interface-v570.css para evitar recortes móviles, manteniendo la identidad visual.
- En la fase final de entrega no se realizaron nuevos cambios al código ya validado.

## Fuentes del contenido nuevo

Se consultaron las versiones oficiales de LFT, LSS y LISR de la Cámara de Diputados; el Anexo 8 RMF 2026 del SAT; PROFEDET y la referencia UMA de INEGI. Los enlaces específicos están en cada guía. Los importes hipotéticos se identifican como ejemplos. No se inventaron tasas, certificaciones ni testimonios.

## Límites y pendientes

- No se desplegó el sitio ni se accedió a Search Console: la indexación real, resultados enriquecidos y posiciones no se pueden garantizar mediante una validación local.
- La revisión de JSON-LD comprueba sintaxis y coherencia local; no equivale a una aprobación de Google Rich Results ni elimina posibles advertencias heredadas de elegibilidad.
- No se reauditaron exhaustivamente todos los destinos externos anteriores. Se conservan; su disponibilidad depende de terceros.
- La calculadora PTU mantiene su alcance original: no valida elegibilidad, no aplica el límite legal y no calcula ISR. Las nuevas guías lo explican. SDI sigue siendo una referencia con prestaciones capturadas, no un determinador completo de SBC.
- Las pruebas de copiar/compartir por fallback/CSV/imprimir usan un entorno simulado de los manejadores. No confirman diálogos de impresión, descargas ni Web Share nativo en todos los dispositivos. El portapapeles de la vista previa no permitió confirmar la lectura real del texto copiado.
- La vista previa omite la ejecución de anuncios y analítica externos para pruebas locales; los archivos de producción sí conservan los scripts originales. No se comprobó entrega de anuncios ni recepción de eventos.
- Se identificó Vercel Analytics y publicidad existente. No se encontró un identificador GA4 ni una referencia Hostinger reconocible en la base examinada. No se añadieron identificadores inventados ni se eliminaron integraciones existentes.
- Las fechas de revisión antiguas del contenido conservado permanecen como estaban; la fecha de modificación técnica no se presenta como una nueva auditoría fiscal integral.

## Guías creadas

| Clúster | Guía | Archivo |
|---|---|---|
| PTU | Qué es PTU: reparto de utilidades, fechas y cálculo | articulos/que-es-ptu.html |
| PTU | PTU si renuncio: quién tiene derecho y tiempo trabajado | articulos/derecho-ptu-si-renuncio.html |
| PTU | Límite de PTU: tres meses o promedio de tres años | articulos/limite-ptu-tres-meses.html |
| PTU | PTU exenta de ISR: parte gravada y recibo de utilidades | articulos/ptu-exenta-isr.html |
| SDI | Qué es el SDI y cómo se distingue del salario diario | articulos/que-es-salario-diario-integrado.html |
| SDI | Factor de integración del SDI: fórmula y ejemplos | articulos/factor-integracion-sdi.html |
| Salario | Salario mensual a quincenal, diario y por hora: ejemplos | articulos/convertir-salario-mensual-diario-hora.html |
| ISR | ISR semanal, quincenal y mensual: qué tarifa usar | articulos/isr-semanal-quincenal-mensual.html |
| ISR | Asimilados a salarios: qué son y cómo revisar el ISR | articulos/asimilados-a-salarios-isr.html |
| Liquidación | Indemnización por despido: qué revisar en la liquidación | articulos/despido-indemnizacion-liquidacion.html |

## Archivos de producción modificados

- `articulos.html`
- `articulos/aguinaldo-isr-2026.html`
- `articulos/como-calcular-prima-vacacional.html`
- `articulos/con-que-salario-se-calcula-finiquito.html`
- `articulos/finiquito-renuncia-voluntaria.html`
- `articulos/finiquito-vs-liquidacion.html`
- `articulos/leer-recibo-nomina.html`
- `articulos/que-es-el-isr.html`
- `articulos/salario-bruto-neto.html`
- `assets/css/interface-v570.css`
- `calculadoras.html`
- `calculadoras/aumento-salarial.html`
- `calculadoras/finiquito.html`
- `calculadoras/isr.html`
- `calculadoras/liquidacion.html`
- `calculadoras/pago-quincenal.html`
- `calculadoras/ptu.html`
- `calculadoras/salario-bruto.html`
- `calculadoras/salario-diario-integrado.html`
- `calculadoras/salario-diario.html`
- `calculadoras/salario-hora.html`
- `calculadoras/salario-neto.html`
- `fallback-aguinaldo-isr-2026.html`
- `fallback-como-calcular-prima-vacacional.html`
- `fallback-con-que-salario-se-calcula-finiquito.html`
- `fallback-finiquito-renuncia-voluntaria.html`
- `index.html`
- `llms.txt`
- `simuladores.html`
- `sitemap.xml`
- `sw.js`

## Archivos de producción nuevos

- `articulos/asimilados-a-salarios-isr.html`
- `articulos/convertir-salario-mensual-diario-hora.html`
- `articulos/derecho-ptu-si-renuncio.html`
- `articulos/despido-indemnizacion-liquidacion.html`
- `articulos/factor-integracion-sdi.html`
- `articulos/isr-semanal-quincenal-mensual.html`
- `articulos/limite-ptu-tres-meses.html`
- `articulos/ptu-exenta-isr.html`
- `articulos/que-es-ptu.html`
- `articulos/que-es-salario-diario-integrado.html`

Los inventarios completos y resultados están en esta carpeta. ENLACES_INTERNOS_ANADIDOS.json incluye origen, destino y anchor; mx-links-added.json registra las 94 ocurrencias agregadas en páginas físicas preexistentes (incluidas copias de respaldo).
