# Calculadoras México V5.5.0 — Semrush Audit Fixes

Base: V5.4.9 SEMRUSH_SCHEMA_HREFLANG.

## Aplicado

- Añadido `/llms.txt` para eliminar el 404/aviso de Semrush.
- Conservadas las correcciones V5.4.9: sin `SoftwareApplication`/`WebApplication` inválidos y sin reseñas inventadas; filtros de categoría con fragmentos para evitar conflictos hreflang.
- Generadas versiones minificadas de los CSS/JS propios y actualizadas las referencias HTML para cargarlas. Las fuentes legibles originales se conservan para desarrollo.
- Actualizado el precache del service worker a los recursos minificados.
- Corregidos los casos detectables en esta base donde `<title>` y `<h1>` eran idénticos.
- Sustituidos enlaces genéricos a `www.condusef.gob.mx` por la ficha oficial de CONDUSEF en `gob.mx` para evitar el HTTP 500 reportado en el rastreo anterior.
- Verificado que no existan referencias a `www.calculadora-isr-mexico.vercel.app`; el host canónico sigue siendo `calculadora-isr-mexico.vercel.app`.

## Después de desplegar

Reejecutar Site Audit en Semrush. Los códigos HTTP de sitios externos pueden variar o bloquear bots aunque funcionen para usuarios; si Semrush sigue marcando un enlace oficial externo, debe revisarse el destino concreto antes de eliminar una fuente útil.
