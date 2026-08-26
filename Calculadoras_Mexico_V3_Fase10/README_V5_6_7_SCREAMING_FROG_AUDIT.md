# V5.6.7 — Auditoría Screaming Frog

Cambios aplicados sobre V5.6.6:

- Corregidas las referencias internas que devolvían 404 para `common.min.js`, `catalog.min.js` y `simulators.min.js`, usando los archivos JS existentes que ya respondían correctamente.
- Mejoradas meta descriptions cortas de recibo de nómina, finiquito vs liquidación y aguinaldo proporcional. La de salario bruto/neto ya estaba mejorada en este ZIP.
- Ajustados H1 genéricos en artículos, guías y simuladores sin cambiar la interfaz ni la lógica.
- Sustituidos H2 genéricos solo en calculadoras prioritarias: IVA, finiquito, vacaciones, horas extra y costo de combustible. ISR ya tenía un H2 específico.
- Ampliados de forma conservadora los artículos cortos de horas extra, recibo de nómina, finiquito vs liquidación y aguinaldo proporcional.
- Reforzado el enlazado interno hacia páginas con pocos inlinks: tiempo para ahorrar, tasa efectiva, inflación, rendimiento anualizado, interés simple, porcentajes y precio antes del descuento.
- No se tocaron fórmulas, IDs de formulario, eventos de cálculo, CSS ni estructura funcional de las calculadoras.
