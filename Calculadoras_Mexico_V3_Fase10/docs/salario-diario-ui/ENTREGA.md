# Salario diario — rediseño UI/UX

17 de noviembre de 2026. Implementado sobre el proyecto con SEO previo y GA4. Listo para desplegar en Vercel; no se publicó ni se hizo push.

## Cambios

- Cabecera compacta, azul y tipografía Instrument Sans local de la HOME. Logo original sin alteración.
- Formulario y resultado en dos columnas en escritorio; una columna en móvil. Campos grandes, teclado decimal, cálculo por Enter y divisor visible que responde al periodo.
- Dos ejemplos opcionales con cálculo real. Se mantienen recuperación de datos, favoritos y limpieza del formulario.
- Resultado diario destacado, equivalencias de 7/15/30 días, importe de origen, divisor y fórmula. Los modelos 365/12 y 52/12 siguen separados en un desplegable, con sus advertencias y cuatro/cinco pagos para el periodo semanal.
- Copiar, compartir y editar visibles. Enlace, guardar escenario, CSV e impresión permanecen accesibles en un desplegable. Aviso visible de los importes incluidos al compartir.
- Seis herramientas relacionadas después de la superficie de cálculo. El resto de enlaces anteriores permanece para proteger navegación y SEO.
- Contenido informativo preservado con espacios, secciones, ejemplo destacado, tablas desplazables localmente y FAQ nativas. La explicación extensa del encabezado se trasladó íntegra a la ayuda visible debajo de la herramienta.
- Modo oscuro, foco visible, estados inválidos y desactivación de animaciones cuando se solicita movimiento reducido. Sin frameworks ni dependencias nuevas de producción.

Taste Skill oficial 2.5.0 disponible y aplicada con prioridad a los requisitos del usuario. Se conserva el sistema de la HOME en vez de sortear otra paleta o tipografía. Se omiten las reglas de landing de pantalla completa, escenas y efectos para permitir cálculo inmediato y contenido SEO completo.

## Archivos de producción modificados

1. `calculadoras/salario-diario.html`
2. `assets/css/salario-diario.css`
3. `assets/js/salario-diario.js`

También se agregan documentación, capturas, fixture de preservación y dos scripts de prueba. No se modifica la HOME ni las otras calculadoras. Los cambios GA4 que ya estaban presentes se incluyen en el paquete.

## Validación

- Build de Vercel correcto, 499 archivos publicables. 496 idénticos byte por byte respecto al build anterior a este rediseño.
- 101 comprobaciones de preservación aprobadas. Title, metadescripción, H1, todos los metadatos, canonical, schema, encabezados anteriores, párrafos, listas, tablas y destinos de enlaces conservados.
- Función matemática y divisores idénticos al original. 28 escenarios, 10 rechazos y regresión de precisión aprobados. $2,300 semanales producen $9,857.14 por 30 días, sin redondear el diario antes de multiplicar.
- GA4 aprobado en las 407 páginas instrumentadas, sin nueva etiqueta ni eventos personalizados. No se verificó recepción en la propiedad de Analytics.
- Suite Google/Bing existente aprobada, 379 comprobaciones.
- Pruebas manuales en Chrome de la vista previa: $15,000 mensual → $500 diario; $2,500 semanal → $357.14 diario y comparaciones $10,714.29 / $10,863.10 / $10,833.33; $9,000 quincenal mediante Enter → $600 diario; $500 diario → $15,000 por 30 días. Rechazo de cero, resultado obsoleto al editar, reinicio del divisor, copia del resultado y del enlace y acceso a guardar escenario verificados.
- Escritorio de 1348 px de contenido y ventanas de prueba incrustadas de 320/390/768 px revisadas. Anchos internos 305/375/753 por las barras del navegador; ninguno presenta desbordamiento horizontal del documento. No son pruebas en teléfonos físicos.
- Contraste del menú corregido tras inspección real. Revisión visual del modo oscuro y capturas antes/después incluidas. Consola inspeccionada sin errores propios de la página; aparecieron errores de la extensión del navegador de pruebas.
- Integraciones y destinos publicitarios preservados. Adsterra mostró anuncios en la vista previa, fuera del formulario y resultado. No se hicieron clics en anuncios ni se validaron ingresos, conversiones o atribución del proveedor. La vista previa estática no equivale a una verificación de cabeceras CSP de Vercel.
- `git diff --check` sin errores.

La prueba histórica `test-seo-integral.cjs` exige que el archivo completo de salario diario siga siendo idéntico al anterior. Por ello falla su hash tras este rediseño autorizado; no se alteró esa prueba ni su evidencia histórica para aparentar aprobación. Las nuevas pruebas verifican los elementos SEO y contenido por separado. Los verificadores Chromium locales de Taste no arrancaron en el entorno; se utilizó el navegador de la vista previa para la revisión funcional y visual.

## Límites y seguimiento

No se han medido mejoras de retención, tráfico, posiciones ni Core Web Vitals de campo. No se declara certificación WCAG ni aprobación de Lighthouse. Se reutiliza una fuente local de 30 KB, se deja de cargar el CSS del piloto (14.5 KB) en esta página y se añade CSS/JS específico; no se afirma una mejora de velocidad sin medición comparable.

Después del despliegue revisar una sesión real en móvil, Tag Assistant/DebugView y rendimiento con anuncios. Comprobar CSV, impresión y el diálogo nativo de compartir en los navegadores objetivo; sus manejadores originales permanecen sin cambios. Medir retención con datos posteriores antes de atribuir mejoras al rediseño.

## Despliegue y pruebas

Subir la carpeta del proyecto a Vercel manteniendo `vercel.json`. Build `node scripts/build-public.cjs`, directorio de salida `site-public`. El paquete incluye fuentes completas y las skills de desarrollo. No es necesario copiar únicamente el HTML.

Pruebas reproducibles desde la carpeta del proyecto

```sh
node scripts/build-public.cjs
node scripts/test-salario-diario-ui-math.cjs
python3 scripts/test-salario-diario-ui.py
node scripts/test-google-analytics.cjs
node scripts/test-seo-google-bing.cjs
```

El test Python requiere lxml. Su fixture está incluido y no requiere Git. La comparación opcional byte a byte de todo el build usa `SALARY_UI_BASELINE` si se conserva una carpeta anterior; el resultado observado durante esta entrega se encuentra en `validation.json`.
