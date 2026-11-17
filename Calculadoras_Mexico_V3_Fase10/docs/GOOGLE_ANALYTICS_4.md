# Google Analytics 4 en Calculadoras México

Vercel ejecuta `node scripts/build-public.cjs` para generar `site-public`. El build instala la etiqueta oficial `gtag.js` con el ID `G-KV44465NKW` dentro de `<head>` en las 407 páginas que se muestran en el navegador, incluidos los fallbacks que sirven las reescrituras de Vercel. El recurso literal de verificación de Search Console conserva su formato. El código configura una vez la etiqueta y usa el `page_view` automático. Las opciones publicitarias de GA4 quedan desactivadas.

Las URL que recibe la etiqueta conservan el dominio, la ruta y parámetros de campaña UTM. Se omiten los demás parámetros y los fragmentos, que pueden contener datos de un escenario de cálculo. Para referencias externas se conserva el origen. La URL del navegador, los formularios y los enlaces compartidos mantienen su comportamiento. La política de privacidad incluye la finalidad de la medición, las cookies y opciones de inhabilitación.

## Configuración en GA4 y verificación en producción

1. En **Administrador → Flujos de datos → Web**, abre el flujo `G-KV44465NKW`. En los ajustes avanzados de **Medición mejorada → Vistas de página**, desactiva las vistas basadas en cambios del historial del navegador. El sitio abre un documento por navegación y algunas calculadoras usan `replaceState` para actualizar el escenario. Mantén activa la vista al cargar la página y revisa los otros eventos de medición mejorada que quieras recopilar. Mantén fuera de GA4 los datos personales que pudieran escribirse en búsquedas o formularios.
2. Revisa los requisitos de consentimiento analítico en las regiones donde operas. La integración usa medición estándar y deniega los fines publicitarios de GA4. La autorización de visitantes cuando corresponda requiere un mecanismo de consentimiento que recoja su elección. La configuración del flujo y el consentimiento regional no se han verificado desde este entorno.
3. Publica el ZIP descomprimido con la configuración existente de Vercel. Abre la home y una calculadora con Google Tag Assistant. Comprueba la solicitud a `gtag/js` con el ID indicado, el `page_view` al abrir cada documento, la ausencia de un `page_view` adicional al actualizar el escenario y la carga en DebugView o Tiempo real. El sitio público necesita servir este build para que la prueba confirme la instalación.
4. En **Adquisición de tráfico** usa **Fuente/medio de la sesión**. Los orígenes de Google, Bing y referencias externas se pueden atribuir cuando el navegador proporciona la referencia. Para Pinterest etiqueta tus enlaces, por ejemplo con `?utm_source=pinterest&utm_medium=social&utm_campaign=calculadoras`. Usa nombres de campaña sin datos personales. Las visitas sin datos de origen pueden aparecer como tráfico directo.

## Pruebas reproducibles

```sh
node scripts/build-public.cjs
node scripts/test-google-analytics.cjs
node scripts/test-seo-integral.cjs
node scripts/test-seo-google-bing.cjs
python3 scripts/audit-seo-integral.py /tmp/calculadoras-ga4-audit.json
```

La prueba comprueba la cabecera de cada HTML generado, detecta etiquetas en conflicto, valida la política de Vercel y sus 25 destinos de reescritura, y ejecuta la configuración con seis escenarios de campaña o referencia. Compara cada salida con la transformación anterior de anuncios para verificar el resto del HTML. La prueba de Chromium quedó bloqueada en el entorno de trabajo. La carga real de la etiqueta y la recepción en GA4 siguen pendientes tras desplegar.

- [Instalación oficial de Google tag](https://developers.google.com/tag-platform/gtagjs)
- [Medición mejorada y vistas por cambios de historial](https://support.google.com/analytics/answer/9216061)
- [Prevención del envío de datos personales](https://support.google.com/analytics/answer/6366371)
- [Configuración del consentimiento](https://developers.google.com/tag-platform/security/guides/consent)
