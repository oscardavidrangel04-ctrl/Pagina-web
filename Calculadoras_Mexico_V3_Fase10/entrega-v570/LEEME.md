# Calculadoras México — V5.7.0

Proyecto completo preparado a partir de `Calculadoras_Mexico_V5_6_42_PROPINA_CLUSTER(1)(1)(1).zip`.

## Despliegue

Descomprime el ZIP y utiliza su contenido como raíz del mismo proyecto estático en Vercel. `index.html`, `vercel.json`, `robots.txt` y `sitemap.xml` están en la raíz. No requiere instalar paquetes ni ejecutar un build. Se conserva el dominio y la configuración de rutas del proyecto original. Esta entrega no se ha desplegado.

La carpeta `entrega-v570` contiene documentación y evidencias; no es necesaria para servir las calculadoras. La versión del service worker y las URLs de los recursos modificados se actualizaron para renovar la caché.

## Qué cambió y por qué

Se revisaron 119 archivos HTML, incluidas las páginas de respaldo utilizadas por la configuración de rutas. Hay 50 calculadoras. La prioridad fue hacer visible la tarea principal, reducir la superposición de diseños y conservar los cálculos y el contenido enlazado.

- **Home:** una sola cabecera principal, búsqueda que transporta la consulta al catálogo, accesos por tema y herramientas principales. Se retiraron la cabecera y el buscador antiguos que estaban ocultos, y un bloque redundante de cifras. Todos los destinos de enlaces existentes se conservan.
- **Catálogo:** filtros, búsqueda y resultados antes de los bloques informativos. El texto introductorio extenso se reubicó sin eliminarlo. Se añadió un estado sin coincidencias y se corrigieron los enlaces de categoría que cambiaban el fragmento sin volver a filtrar.
- **Calculadoras:** herramienta inmediatamente después de su encabezado, títulos de formulario, ayudas asociadas a sus campos, botones consistentes y acceso directo a calculadora y guía. Los paneles laterales genéricos explican ahora cómo utilizar el cálculo.
- **Resultados:** importe principal destacado, desglose secundario, números alineados, acciones conservadas y aviso cuando cambian los datos de un resultado anterior. La explicación de aguinaldo acepta las etiquetas del cálculo avanzado y ya no deja los importes en blanco.
- **Identidad:** morado sobrio, tipografía del sistema, fondos neutros y estilos compartidos para navegación, formularios, tarjetas, artículos, tablas, FAQs y pie. La marca usa el símbolo de calculadora existente, adaptado al color principal, con texto legible en ambos temas.
- **Rendimiento:** ninguna dependencia nueva en producción, eliminación de seis hojas antiguas sin referencias y sustitución del tema acumulativo anterior. Se conserva el CSS base que contiene estructuras especializadas para evitar romper sus funciones. Los elementos informativos no dependen de animaciones de aparición para resultar visibles.

## Móvil

Diseño de una columna para formularios y artículos; espacios y encabezados más compactos; inputs de 16 px como mínimo; botones táctiles; teclado numérico en campos enteros; menú desplegable; tablas con desplazamiento propio; resultados que admiten importes largos. La barra inferior fija duplicada se desactiva para liberar espacio. El encabezado conserva búsqueda, tema y menú. Los anuncios mantienen su integración y su contenedor limita el desbordamiento.

## Accesibilidad y UX

Foco visible, recorrido de teclado en el buscador y devolución del foco al cerrar, Escape para cerrar menú y buscador, cálculo con Enter en campos de entrada, estado actual de navegación, etiquetas asociadas, mensajes de validación junto al campo y en español, estados seleccionados de propina accesibles y sincronizados. Se respetan los campos ocultos de los modos avanzados y la preferencia de reducir movimiento. Las tablas desplazables se pueden enfocar con teclado. Se corrigió el salto al contenido de la página 404.

## Componentes nuevos y archivos principales

- `assets/css/interface-v570.css`: sistema visual compartido y adaptación responsive.
- `assets/js/interface-v570.js`: mejoras progresivas de formularios, resultados, menú, catálogo y accesibilidad.
- `assets/img/logo-mark.svg`: símbolo de marca derivado del original.
- `assets/js/common.js` y `common.min.js`: búsqueda, navegación por categorías, almacenamiento tolerante a fallos, interpretación de aguinaldo y errores de copiar/compartir.
- `sw.js`: caché y recursos de la nueva versión.
- Los 119 HTML incorporan la interfaz compartida. Los cambios estructurales más amplios están en home, catálogo y las 50 calculadoras.

`ARCHIVOS.json` enumera los archivos modificados, añadidos y retirados respecto del ZIP original.

## Comprobaciones

- 50 casos de cálculo base ejecutados y comparados con el original: misma salida. Es una prueba de regresión, no una auditoría fiscal.
- Fórmulas y tablas sin cambios: `calculators.js`, `tablas.js`, `aguinaldo-premium.js`, `propina-pro.js` y `simulators.js` son idénticos byte por byte al original.
- Inputs, límites, pasos y opciones de las 50 calculadoras conservados.
- Pruebas interactivas de IVA, rechazo de importe negativo, cálculo con Enter, aguinaldo completo y proporcional, y propina con porcentajes rápidos. Ejemplos observados: IVA de 1,000 al 16% → 1,160; aguinaldo de salario mensual 15,000 y 15 días → 7,500; 180 días → 3,698.63; cuenta de 800 al 15% entre dos personas → 460 por persona.
- Búsqueda desde home, filtrado sin coincidencias, menú móvil, foco del buscador, tema oscuro y contenido copiado comprobados en navegador.
- Generación CSV, copia, alternativa de compartir por portapapeles e invocación de impresión verificadas en pruebas aisladas de los manejadores con 50 casos.
- 119 HTML: sin diferencias en title, description, canonical, robots y contenido JSON-LD; sin JSON inválido, IDs duplicados, recursos locales ausentes, rutas internas rotas o anclas locales rotas. `sitemap.xml`, `robots.txt` y `vercel.json` permanecen idénticos.
- 146 vistas responsive sin desbordamiento horizontal: 119 páginas a 320 px y 9 páginas representativas en cada ancho de 390, 768 y 1280 px. Las últimas 14 vistas se completaron al reanudar la sesión. La evidencia de tamaños responsive se incluye en `responsive-checks.json`. Se mide el desbordamiento de página; no equivale a una auditoría manual exhaustiva de cada componente.

## Alcance y pendientes

1. No se modificaron tasas, fórmulas, reglas fiscales ni fechas de revisión editorial. Las referencias existentes siguen disponibles; no se verificó su vigencia legal mediante investigación externa.
2. Los anuncios, analítica y sus cuentas permanecen como estaban. La revisión automatizada de páginas aisló los scripts de terceros para medir la interfaz propia; no certifica sus creatividades, entrega ni rendimiento en producción.
3. El navegador mostró la confirmación del manejador CSV, pero su herramienta de captura no notificó la descarga. La generación del contenido y la invocación de descarga sí pasaron la prueba aislada. No se certifica aquí la descarga final en cada navegador, el diálogo nativo de compartir, la impresora o el PDF final.
4. El service worker se revisó en código; no se ensayó la actualización de una instalación previa del sitio en producción. Su versión y recursos se actualizaron.
5. Se conservó el contenido editorial extenso y los estilos especializados de base para proteger funcionalidad y SEO. Una reescritura de artículos o sustitución integral de ese CSS requeriría otra revisión de contenido y regresión.
6. Las comprobaciones de regresión no abarcan todas las combinaciones posibles, dispositivos o navegadores y no constituyen certificación WCAG ni garantía de posiciones en Google.
