# Calculadoras México V5.2.0 — Aguinaldo Definitiva

Fecha: 16 de agosto de 2026.

Esta versión parte de V5.1.9 y concentra la mejora en `calculadoras/aguinaldo.html`, sin cambiar su URL ni canonical.

## Mejoras de Aguinaldo

- Conserva cálculo anual, proporcional, por fechas y por días capturados.
- Conserva salario mensual, quincenal, semanal y diario.
- Conserva escenarios rápidos y comparador contra la prestación capturada.
- Añade comparación rápida equivalente con 15, 20 y 30 días usando el mismo salario y proporción del año.
- Añade guardado local de hasta 8 escenarios de aguinaldo, con restauración y eliminación.
- Añade acciones de resultado: copiar, compartir, imprimir o guardar como PDF mediante el diálogo de impresión del navegador.
- Añade comparador entre la estimación bruta y un importe de aguinaldo pagado/informado por el usuario.
- Añade un bloque de metodología transparente con pasos, supuestos, fecha de revisión y fuentes oficiales.
- Añade estilos móviles específicos para las nuevas herramientas.
- Añade estilos de impresión para obtener un reporte limpio del resultado.
- Structured data `WebApplication` actualizado con las nuevas funciones.
- Meta description de Aguinaldo actualizada sin modificar title, H1, URL ni canonical.

## Privacidad

Los escenarios guardados se almacenan solo en `localStorage` del navegador del usuario y pueden borrarse desde la propia página.

## Validación

- JavaScript validado con `node --check`.
- URL/canonical de Aguinaldo preservados.
- Sitemap y robots preservados.
- Sin cambios a la lógica de las otras 49 calculadoras.
