Software: Calculadoras México, herramientas gratuitas laborales, fiscales y financieras para personas en México. Acción principal: buscar y abrir una calculadora real.
Taste 2.5.0: hero split; Instrument Sans (pairing instrument); paleta propia recuperada de Git #0b57d0, #1a73e8, #071a35, #f5f8fc; nav-split adaptada a la navegación existente; footer-columns; close-type; surface-pairs; botones solid; radios sharp. Logo original sin editar.

## Dirección y revisión previa

El producto es el catálogo de herramientas, no un tablero financiero ficticio. El hero presenta un buscador real, categorías y resultados utilizables. La composición combina una introducción contenida en azul marino con una superficie de trabajo clara. Las herramientas destacadas tienen una jerarquía asimétrica; las rutas editoriales se convierten en filas navegables, no otra parrilla de tarjetas iguales.

1. Hero: categoría, propósito, búsqueda real y navegación temática; app-frame funcional, texto primero en móvil.
2. Herramientas populares: acceso fiscal destacado y cinco accesos laborales/fiscales, contenido original íntegro; publicidad nativa después de este bloque.
3. Rutas por situación: lectura por filas, enlazado completo conservado.
4. Más herramientas y categorías: directorio compacto, favoritos funcionales, títulos y descripciones originales.
5. Guías y metodología: ritmo editorial en dos columnas y fuentes oficiales verificables.
6. Preguntas frecuentes, espacio personal e historial: se conservan funcionalidad y respuestas; controles claros y accesibles.
7. Recursos y temas: enlazado SEO original; cierre y footer con las políticas existentes.

## Adaptaciones a las restricciones del usuario

- No se reemplaza la aplicación por el starter ni se sobrescriben assets compartidos. Se trasladan composición, escala, tokens y microinteracciones a una hoja exclusiva de la home. Se retiran únicamente de index.html las hojas legacy styles-v5628.css e interface-v570.css: sus reglas globales !important ocultaban el hero y forzaban el header blanco; los archivos compartidos permanecen byte a byte intactos para las otras páginas.
- Las alturas siguen el contenido, no múltiplos rígidos del viewport: evita vacíos, cortes y desplazamiento innecesario en un directorio largo con anuncios reservados.
- Se conserva el H1 existente, todos los textos útiles, navegación entre páginas y FAQs desplegables. No se recortan para cumplir presupuestos de palabras de una landing nueva.
- No se incorporan shaders, WebGL, cifras inventadas ni animaciones automáticas. La respuesta visual procede de búsqueda, foco, hover y controles reales, con reduced-motion.
- Instrument Sans se aloja localmente con font-display: swap; no se utiliza la monoespaciada del pairing porque no hay código ni datos tabulares que la necesiten.
- La marca original contiene verde en su gráfica y palabra México; se conserva ese archivo sin modificarlo. La interfaz propia recupera azul y marino.
- Las comprobaciones oficiales de Taste se ejecutan además de las pruebas funcionales; se documentan sus reglas de landing que entren en conflicto con estas restricciones.

## Criterios de aceptación

Home claramente distinta; búsqueda con y sin JavaScript; ningún cambio visual en otras páginas; metadatos/schema/URLs y contenido útil preservados; cuatro integraciones comerciales; sin desbordamiento en 320–1440 px; teclado, tema oscuro, favoritos e historial; capturas reales y límites de pruebas externas documentados. Sin despliegue.
