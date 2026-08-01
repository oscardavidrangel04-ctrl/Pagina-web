# Calculadoras México V3 — Fase 10

Versión estable de lanzamiento profesional del portal.

## Incluye

- 50 calculadoras funcionales.
- 24 herramientas nuevas de finanzas, nómina, negocios y uso general.
- Tendencias calculadas con popularidad y actividad local.
- Recomendaciones personalizadas según favoritas y visitas recientes.
- Cuatro herramientas relacionadas en cada página de cálculo.
- Relación automática por categoría, palabras clave y popularidad.
- Títulos, descripciones y canonicales únicos auditados automáticamente.
- BreadcrumbList y WebApplication en las páginas de calculadoras.
- FAQ visible y FAQPage con tres respuestas por calculadora.
- BlogPosting en los artículos y WebSite/Organization en el inicio.
- Open Graph, Twitter Cards y `hreflang="es-MX"` consistentes.
- Script `tools/seo-audit.mjs` para detectar regresiones antes de publicar.
- Barra inferior móvil con Inicio, Calculadoras, Buscar y Artículos.
- Áreas táctiles de al menos 44 px en los controles principales.
- Formularios con texto de 16 px para evitar el zoom accidental.
- Botones de cálculo accesibles mientras se recorre el formulario.
- Buscador móvil a pantalla completa.
- Tarjetas compactas y resultados adaptados a pantallas estrechas.
- Compatibilidad con las zonas seguras de teléfonos modernos.
- Auditor automático `tools/mobile-audit.mjs`.
- Sitemap XML con namespace obligatorio validado automáticamente.
- Encabezado `Content-Type: application/xml` configurado para Vercel.
- JavaScript diferido para evitar bloquear el renderizado.
- Caché anual para recursos estáticos y revalidación para HTML.
- Renderizado diferido de secciones fuera de pantalla.
- Prioridad alta para el logotipo visible inicialmente.
- Modo de datos reducidos con menos efectos visuales.
- Encabezado Permissions-Policy para reducir capacidades innecesarias.
- Auditor automático `tools/performance-audit.mjs`.
- Comparador de dos salarios netos estimados.
- Comparador de dos préstamos con mensualidad, intereses y pago total.
- Comparador de dos planes de ahorro con aportaciones y rendimientos.
- Gráficas automáticas y diferencias destacadas.
- Página `simuladores.html` integrada al inicio y navegación.
- Prueba matemática `tools/simulator-test.mjs`.
- Aplicación web instalable mediante `manifest.webmanifest`.
- Service worker versionado con actualización automática.
- Navegación sin conexión para páginas visitadas.
- Página `offline.html` de recuperación.
- Botón de instalación cuando el navegador lo permite.
- Políticas de actualización específicas para Vercel.
- Guía final `PUBLICAR_FASE_10.md`.
- Auditor de lanzamiento `tools/release-audit.mjs`.
- Favoritos guardados en el navegador.
- Calculadoras vistas recientemente.
- Historial local de hasta 12 cálculos.
- Acciones para copiar, compartir e imprimir resultados.
- Gráficas de barras automáticas en los cálculos donde aportan claridad.
- Comparación entre dos escenarios:
  1. realiza el primer cálculo;
  2. pulsa `Guardar escenario`;
  3. cambia los datos y vuelve a calcular.
- Diferencia entre el escenario guardado y el resultado actual.
- Exportación de resultados en formato CSV compatible con Excel.
- Guardado automático de los valores escritos en cada calculadora.
- Recuperación automática al regresar a la página.
- Enlaces compartibles que incluyen los datos del escenario.
- Cálculo automático cuando se abre un escenario compartido.
- Botón `Limpiar` para recuperar los valores originales.
- Validación visual de campos incorrectos.
- Buscador global con navegación por teclado.
- Catálogo filtrable.
- Modo oscuro.
- Diseño adaptable para computadora y celular.
- Sitemap con 65 URL.
- Datos estructurados para las calculadoras.
- Integración del script de Vercel Web Analytics para HTML estático.
- Generador reutilizable en `tools/build.mjs`.
- Verificador de enlaces y estructura en `tools/verify.mjs`.

## Calculadoras nuevas

- Regla de tres, edad exacta y diferencia entre fechas.
- Propina, reparto de cuenta y precio antes del descuento.
- Margen de ganancia, precio de venta, punto de equilibrio, ROI y costo por unidad.
- Inflación, meta de ahorro, tiempo para ahorrar, tasa efectiva y rendimiento anualizado.
- Crédito automotriz, hipoteca y CETES.
- Pago quincenal, salario por hora y bono.
- Conversión de longitud y costo de combustible.

Las herramientas financieras muestran estimaciones informativas. Los resultados reales pueden cambiar por comisiones, impuestos, seguros, tasas y condiciones de cada institución.

## Cómo probar en VS Code

1. Abre esta carpeta en VS Code.
2. Inicia Live Server desde `index.html`.
3. Abre una calculadora, realiza un cálculo y prueba:
   - guardar como favorita;
   - copiar el resultado;
   - compartir;
   - imprimir;
   - exportar el CSV;
   - guardar un escenario y compararlo con otro;
   - copiar el enlace del escenario y abrirlo en otra pestaña;
   - recargar la página para comprobar el autoguardado;
   - limpiar el formulario.
4. Regresa al inicio para ver favoritos, recientes e historial.

## Cómo publicar sin provocar un 404

Sube **el contenido de esta carpeta** a la raíz del repositorio:

- `index.html`
- `calculadoras.html`
- carpetas `assets`, `calculadoras`, `articulos`
- el resto de archivos

No subas una carpeta contenedora adicional por encima de `index.html`, a menos que configures esa carpeta como `Root Directory` en Vercel.

## Verificación realizada

Se revisaron:

- sintaxis de los archivos JavaScript;
- 66 páginas HTML;
- 50 páginas de calculadoras;
- enlaces y recursos locales;
- identificadores HTML duplicados;
- JSON-LD;
- 65 URL del sitemap.

Versión corregida: `3.10.1`
