# Integración de la unidad proporcionada por el propietario — 6 de noviembre de 2026

Se añadió el código entregado en la conversación: `https://bauval.org/21/409e3950cb7b10082bb628969be6611a`, con `async="async"`, `data-cfasync="false"` y el contenedor `container-409e3950cb7b10082bb628969be6611a`. Se retiraron únicamente los escapes de formato del mensaje, sin cambiar URL ni identificador. El proveedor se identifica como Adsterra conforme a la indicación del propietario; no se accedió a su panel para verificar el formato contratado.

## Ubicaciones

| URL | Ubicación |
|---|---|
| `/` | Después de calculadoras populares, antes de las siguientes secciones de navegación |
| `/calculadoras/prestamo.html` | Al final del contenido principal, después de la calculadora, sus explicaciones y recursos |
| `/articulos/costo-total-prestamo-como-calcular.html` | Al final del contenido principal, separado de la tarjeta de Sol Crédito |

Una unidad por documento. No se aplicó un despliegue global a todas las calculadoras ni se modificaron salario diario o pago quincenal. Se conservan AdSense y las 11 tarjetas de afiliados. Sol Crédito continúa en cinco páginas contextuales; no se añade al inicio ni a páginas laborales. Los informes SEO/monetización anteriores describen sus respectivas revisiones: la ausencia de código Adsterra allí era anterior a recibir esta unidad.

El bloque está rotulado como publicidad y utiliza una hoja CSS pequeña compartida, con colores del tema, espacio mínimo de 250 px para el contenedor y desplazamiento interno para creatividades anchas. El tamaño real de las creatividades lo controla el proveedor: esta reserva no garantiza CLS cero si cambia la altura. El script oficial se carga de forma asíncrona; no se añadió JavaScript propio de redirecciones, ventanas emergentes o medición de impresiones. El comportamiento remoto del código no pudo inspeccionarse y debe verificarse en el panel y en el despliegue antes de afirmar su formato o compatibilidad completa con otras redes.

Se actualizó el aviso de privacidad con el nuevo recurso externo y un enlace a la [política de Adsterra](https://adsterra.com/privacy-policy/). Informar del proveedor no sustituye los controles de consentimiento que correspondan a la configuración y los visitantes del sitio.

## Validación

- `node scripts/test-monetization.cjs`: PASS. Conserva los scripts originales de 408 HTML, 368 inclusiones AdSense, código de cálculo y 11 tarjetas; comprueba la adición exacta de esta unidad solo en las tres rutas previstas.
- `node scripts/test-adsterra.cjs`: PASS. Nueve layouts (tres páginas a 320/390/1440 px), una unidad por página, sin desbordamiento global, espacio reservado y Sol Crédito/enlaces intactos. Detecta la solicitud del script oficial en las nueve cargas.
- `python scripts/check-phase6-release.py`: PASS, 379 rutas indexables sin problemas detectados de enlaces, canonicals, metadatos o sitemap.
- `node scripts/build-public.cjs`: PASS, 481 archivos públicos, incluidos los nuevos estilos; documentación y pruebas excluidas.
- `git diff --check`: PASS.

El test de navegador requiere Playwright y Chromium; admite `CHROMIUM_PATH` y `ADSTERRA_QA_PATH` para guardar la evidencia. Todos los terceros se bloquean deliberadamente durante esa prueba. Por tanto, comprobar la solicitud del script no equivale a verificar descarga real, creatividad mostrada, impresión válida o ingresos. La consulta del servidor `bauval.org` no fue accesible mediante la herramienta web; la política de red del entorno tampoco permite ese host desde la terminal. No se evitó esa restricción ni se utilizaron clics de afiliado reales.

Los resultados locales están en [validacion.json](validacion.json) y [tecnica.json](tecnica.json). Después de descargar esta revisión y publicarla manualmente, comprobar el dominio correcto, el bloque en las tres rutas, la entrega de creatividades y las estadísticas del panel. Si hay bloqueo de anuncios o falta de inventario, la presencia del código no garantiza que un visitante vea una creatividad. No se afirmó una entrega real ni se modificó `main` o Vercel desde esta sesión.

## Archivos

Tres HTML de ubicaciones; `privacidad.html` y su `lastmod` en `sitemap.xml`; `assets/css/adsterra-unit.css`; `scripts/adsterra-unit.cjs`; `scripts/test-adsterra.cjs`; ajustes de las pruebas existentes de monetización y preservación SEO para permitir exclusivamente la unidad autorizada; esta carpeta de evidencia. No cambian fórmulas, URLs, identificadores existentes ni scripts de producción propios.
