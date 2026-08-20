# Calculadoras México V5.5.3 — Semrush Global Cleanup

Cambios principales:

- Referencias globales de JavaScript propias apuntan a archivos `.min.js` con cache-buster `v=5.5.3`.
- Se conservaron las rutas CSS estables y se actualizó el cache-buster.
- Se eliminaron etiquetas `hreflang` al existir una sola versión lingüística/regional del sitio, evitando conflictos de autorreferencia.
- Se verificó que no quede marcado `SoftwareApplication` que exija reseñas o `aggregateRating` inexistentes.
- Se reemplazó el enlace genérico de CONDUSEF en gob.mx que Semrush reportaba con 403 por el sitio oficial de la Revista Proteja su Dinero de CONDUSEF.
- Se ampliaron Contacto, Privacidad y Términos con información útil, sin texto de relleno.
- Se eliminan referencias accidentales al host Vercel con `www`.
- Service Worker actualizado a V5.5.3.

Después de desplegar, reejecutar Site Audit para que Semrush rastree esta versión.
