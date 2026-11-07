# Alcance publicitario, políticas y medición

Revisión del 6 de noviembre de 2026. Esta entrega está en una rama de trabajo, sin publicar en Vercel.

## Lo confirmado y lo pendiente

El usuario confirmó en esta conversación que el sitio y los materiales personalizados de Sol Crédito MX están autorizados. Se conservan los identificadores, banners y enlaces oficiales aportados. Esa confirmación no equivale a haber consultado un contrato privado de Admitad: no hubo acceso al panel del programa. No se inventan tasas, descuentos, límites, aprobaciones, disponibilidad ni urgencia.

Google permite combinar AdSense con otras redes y enlaces de afiliados, sujeto a sus políticas. Su política de inventario impide más publicidad o material promocional pagado que contenido del editor. Espacios en blanco, cabeceras, pies y enlaces a otros contenidos no cuentan como contenido editorial a estos efectos:

- [Uso de otras redes con AdSense](https://support.google.com/adsense/answer/9728?hl=en).
- [Más anuncios que contenido del editor](https://support.google.com/publisherpolicies/answer/11169917?hl=en).
- [Verificación de propiedad de Google](https://support.google.com/webmasters/answer/9008080?hl=en): el archivo del token queda intacto.

**No se certifica el cumplimiento global ni se propone publicar sin revisión de densidad.** Las cuatro integraciones solicitadas se prepararon en las 407 páginas para visitantes. Existen páginas cortas con código AdSense donde esa exigencia puede competir con el límite de inventario. `revision-densidad.csv` identifica 184 documentos con menos de 400 palabras principales aproximadas y AdSense: es una cola de revisión, no un dictamen basado en un límite de palabras de Google. No se añaden párrafos de relleno ni se ocultan anuncios para aparentar cumplimiento. No se desactiva silenciosamente ninguna red. Si la vista previa con creatividades reales confirma exceso, habrá que ajustar la exigencia de cuatro formatos o su distribución antes de publicar.

Los anuncios nativos pueden ocupar alturas distintas a los 250px reservados. El código del sitio no incorpora popunders, redirecciones automáticas ni intersticiales. No se pudo inspeccionar la respuesta real de los scripts de bauval.org: hay que comprobar la configuración y las creatividades activas de ambas unidades en Adsterra, incluyendo la ausencia de formatos intrusivos. El iframe del banner aísla `atOptions`; no representa una garantía de aislamiento de seguridad de un script del proveedor.

Los controles de consentimiento de las redes según ubicación del visitante y la configuración de cuentas siguen requiriendo revisión. El adaptador opcional de eventos de afiliados no sustituye un gestor de consentimiento publicitario. No se inventó una identidad legal ni un correo de contacto: la falta de un responsable y canal público efectivo ya indicada en Contacto continúa pendiente.

## Verificación externa

Los dos scripts `bauval.org/21/...` y `bauval.org/22/...` y las dos imágenes `ad.admitad.com/b/.../` no fueron accesibles desde la herramienta web de esta sesión. Eso **no demuestra que estén caídos**. Se validaron las URLs exactas, `?i=4`, atributos, dimensiones, una sola instancia y solicitudes iniciadas desde Chromium con respuestas simuladas. No se realizaron compras, solicitudes de crédito ni clics reales para generar métricas.

Antes de publicar: abrir la vista previa sin bloqueador en móvil y escritorio, revisar Network/Console, comprobar el destino de cada enlace, disponibilidad de banners, dimensiones reales y densidad. Confirmar que el banner responde dentro del iframe `srcdoc` del mismo origen con las condiciones del programa. Si necesita otro mecanismo de carga, conservar clave/formato y corregirlo con el código oficial del proveedor.

## Qué mide cada dato

| Dato | Fuente / definición | Estado |
|---|---|---|
| Vista de tarjeta afiliada | Evento `affiliate_card_view`: al menos 50% del área del banner visible durante 1 segundo con consentimiento | Adaptador local disponible; no se envía a una plataforma automáticamente |
| Clic saliente | `affiliate_click`, programa, ubicación, variante y ruta sin parámetros | No es una conversión |
| Tarjeta vista y pulsada | `affiliate_viewed_card_clicked`, como máximo una por tarjeta y carga | Permite CTR de tarjeta sin contar múltiples clics como múltiples visitantes |
| CTR de tarjeta | Tarjetas vistas y pulsadas / vistas de tarjeta, mismo programa, variante y periodo | Muestra limitada a usuarios con consentimiento |
| Impresiones publicitarias | Panel de Adsterra o Admitad, según definición de la red | No inferirlas a partir de una vista de tarjeta |
| Conversiones, comisiones e ingresos afiliados | Panel de Admitad; distinguir pendientes, aprobados y cancelados | Sin acceso ni cifras inventadas |
| Ingresos y eCPM Adsterra | Panel de Adsterra; eCPM = ingresos / impresiones × 1,000, bases comparables | Pendiente de datos reales |
| RPM del sitio | Ingresos / páginas vistas × 1,000, mismo periodo, moneda y cobertura | No mezclar vistas de tarjetas con páginas vistas |

El adaptador reutiliza `assets/js/affiliate-events.js`, cargado una sola vez. Solo emite eventos `cm:affiliate` cuando `CM_AFFILIATE_ANALYTICS_CONSENT === true`; respeta DNT/GPC, retiro del consentimiento y no guarda cookies, formularios ni parámetros de la URL. Para recolectar resultados debe conectarse a una analítica propia aprobada y al gestor de consentimiento existente. Sin ese adaptador receptor no hay datos de clics almacenados centralmente.

## Plan posterior a la publicación autorizada

La fecha cero será la publicación efectiva, no el commit ni esta revisión.

- **Día 7:** confirmar indexación, versiones correctas, entrega publicitaria, errores, móvil y datos de consentimiento. Revisar GSC por URL y consulta, comparando semanas equivalentes sin atribuir cualquier movimiento al cambio.
- **Día 28:** comparar CTR dentro de posiciones similares; separar marca/no marca, dispositivo y país; comparar URLs intervenidas con otras similares. Revisar cambios en impresiones, clics, distribución Top 3/10/20 y potencial solapamiento. Analizar Bing aparte. Contrastar vistas/clics de tarjeta con conversiones y comisiones aprobadas de Admitad.
- **Día 60:** decidir si el piloto visual se amplía únicamente tras autorización; revisar rentabilidad, densidad, abandono, precisión y métricas de campo LCP/CLS/INP, antes de nuevos experimentos.

No se deducen mejoras de rankings, ingresos o CTR a partir del resultado de las pruebas locales.
