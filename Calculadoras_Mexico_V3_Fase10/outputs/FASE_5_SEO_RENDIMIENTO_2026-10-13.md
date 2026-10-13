# Fase 5: carga e interacción móvil

Finalizada el 13 de octubre de 2026. Cambios locales, pendientes de publicación.

## Alcance y resultado

Continuación de las fases editoriales y de arquitectura: optimización de recursos compartidos y del buscador. El archivo compartido está referenciado por 203 URLs indexables efectivas, considerando las reescrituras de Vercel. No significa que las 203 descargasen antes el catálogo adicional: las que ya tenían el catálogo completo continúan reutilizándolo.

- El buscador que antes recuperaba `calculadoras.html` ahora solicita un catálogo JSON bajo demanda: 10.962 bytes frente a 70.269 bytes del HTML, aproximadamente 84 % menos en ese recurso sin comprimir. No es una reducción del 84 % en el peso total o tiempo de carga de la web.
- Las solicitudes simultáneas comparten una misma descarga. Las búsquedas siguientes reutilizan los datos en memoria; tras un fallo, se puede reintentar. Se conserva el recurso a las tarjetas disponibles en la página.
- Las respuestas de búsquedas antiguas ya no sustituyen los resultados de una consulta más reciente cuando llegan tarde.
- El registro del modo sin conexión espera a la carga de la página y a un turno libre del navegador, con un límite para esa espera. No se eliminó el modo sin conexión ni se cambió su estrategia de almacenamiento.
- Se retiró el observador de aparición progresiva de tarjetas: los estilos existentes ya anulaban esa animación. El contenido sigue visible sin ese trabajo de observación.
- El formateador monetario se reutiliza en vez de crearse en cada importe; no cambia fórmulas ni redondeos.
- La inicialización de las mejoras de interfaz también funciona si el script se incorpora cuando el documento ya es interactivo.

## Validación

- Catálogo JSON idéntico a las 55 entradas del catálogo original. La prueba comprueba su sincronización para detectar futuras divergencias.
- Seis páginas representativas a 390 y 1440 px: un H1, contenido visible y sin desbordamiento horizontal; no se solicita el JSON al entrar.
- Pruebas del buscador: una petición para tres cargas simultáneas; reutilización posterior; apertura, búsqueda y cierre; consulta anterior que termina tarde; recuperación después de un error 503.
- Sin errores JavaScript en esas pruebas locales.
- Regresiones de salario neto, salario por hora y aguinaldo aprobadas: cálculo, móvil y comprobaciones SEO existentes.
- Auditoría estática: 377 URLs indexables, sin problemas detectados, enlaces locales rotos, títulos o descripciones duplicados ni páginas huérfanas.

Pruebas: `scripts/check-phase5-performance.cjs`, `scripts/audit-seo-technical.py` y las tres pruebas `test-*-focus.cjs` de las calculadoras citadas.

## Conservación y límites

No se cambiaron anuncios, fórmulas, títulos, descripciones, canonicals ni URLs. No se actualizaron masivamente las fechas del sitemap por estos ajustes compartidos. No se modificaron las imágenes: las ilustraciones revisadas ya tenían dimensiones y carga diferida.

Las pruebas de navegador usan archivos locales y bloquean conexiones externas. No prueban el comportamiento de anuncios, analítica, la instalación real del service worker en producción ni los Core Web Vitals de usuarios reales. No se midió una mejora de LCP, INP, CLS, posiciones o CTR. Tampoco se desplegó en Vercel.

Al publicar, incluir `assets/data/calculators.json` junto con los scripts modificados. Si cambia el catálogo original, actualizar el JSON y ejecutar la prueba de sincronización. Comprobar con una visita nueva el modo sin conexión y revisar PageSpeed Insights/Search Console con anuncios activos antes de atribuir mejoras de rendimiento a esta fase.

## Referencias

- Registro del service worker después de la carga inicial: https://web.dev/articles/service-workers-registration
- Experiencia de página y sus límites como señal de posicionamiento: https://developers.google.com/search/docs/appearance/page-experience

Estas mejoras no garantizan primeros puestos; el rendimiento real y los resultados de búsqueda requieren seguimiento después del despliegue.
