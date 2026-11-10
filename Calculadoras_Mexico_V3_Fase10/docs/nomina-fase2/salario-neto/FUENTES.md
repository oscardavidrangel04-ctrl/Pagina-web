# Fuentes, competencia y límites de verificación

Consulta web realizada el 9 de noviembre de 2026. Las fuentes se abrieron y se revisaron por contenido. No se certifican posiciones actuales del Top 3 de Google México, ni se midieron rendimiento o formularios de terceros.

## Conciliación y precisión financiera

- [SAT, estándar del complemento Nómina 1.2](https://www.sat.gob.mx/cs/Satellite?blobcol=urldata&blobkey=id&blobtable=MungoBlobs&blobwhere=1461173081850&ssbinary=true). Distingue percepciones, deducciones y otros pagos. En las validaciones del total, páginas 47–50, expresa la suma de percepciones más otros pagos menos deducciones. El concepto Importe de OtroPago y el atributo SubsidioCausado se documentan por separado (página 28). Por eso el campo nuevo admite cantidades efectivamente pagadas, sin sumar un dato virtual o un subsidio ya aplicado contra ISR. El documento incluye referencias a versiones anteriores del comprobante: se utiliza para estos conceptos del complemento, no como certificación de emisión CFDI 4.0 ni guía completa de nómina 2026.
- [IMSS, Ley del Seguro Social](https://www.imss.gob.mx/sites/all/statics/pdf/leyes/LSS.pdf), documento consultado con reforma indicada 15 de enero de 2026. El artículo 27 regula integración y exclusiones del salario base de cotización; el 28 aborda sus límites. Esto sustenta distinguir SBC, sueldo bruto y cuota diaria. No se deduce una cuota obrera universal a partir de un sueldo bruto aislado.
- [SAT, Anexo 8 de la RMF 2026](https://www.sat.gob.mx/minisitio/NormatividadRMFyRGCE/documentos2026/rmf/anexos/Anexo-8-RMF-2026_DOF-28122025.pdf): la verificación de los once tramos de 15 días ya se documentó en la [fase anterior](../../pago-quincenal-seo/competencia-fuentes.md). Ese motor y sus tablas no cambian aquí. No se afirma haber revalidado en esta fase todos los periodos fiscales o una nómina completa.

No se incorporan tasas automáticas nuevas de ISR/IMSS, UMA ni subsidio. Su automatización requiere fecha, base gravable, conceptos exentos, SBC y reglas aplicables. El cálculo nuevo comprueba cantidades conocidas del recibo; no calcula elegibilidad ni cuantía de un subsidio. Los ejemplos de deducciones siguen expresamente identificados como hipotéticos.

## Competencia funcional

Se buscaron calculadoras de sueldo bruto a neto en México y se abrió el contenido de:

| Página | Observación de contenido | Decisión para esta implementación |
| --- | --- | --- |
| [Tesio, sueldo neto](https://www.tesio.com.mx/herramientas/calculadora-sueldo-neto/) | Ofrece bruto mensual a neto con tabla ISR; su propio texto identifica parámetros estimados y advierte dependencia del SBC y prestaciones. | No trasladar parámetros comerciales al código. Explicar límites y mantener deducciones conocidas, con desglose comprobable. |
| [Nuvvo/MiFiscal, sueldo neto](https://fiscal.nuvvo.org/calculadora-sueldo-neto) | Presenta sueldo mensual, zona y explicación de retenciones y cuotas. | Separar ISR, cuotas y otras deducciones en el resultado. No presentar un total capturado como si fuera un impuesto calculado. |

La comparación es de funciones y contenido expuestos en HTML, no una auditoría de exactitud de sus motores. No se copiaron textos, diseños ni importes netos comerciales. La ventaja útil de esta página es comprobar un recibo concreto, incluido un total sin desglose y su depósito, conservando ejemplos editables y periodos explícitos.

La URL pública de salario neto pudo leerse mediante el proveedor web. Esto confirma accesibilidad para esa lectura; el proveedor no entregó cabeceras HTTP reproducibles, por lo que no se reporta una prueba independiente de código HTTP 200 ni un despliegue de estos cambios.

## Google Search Central

- [Enlaces de título](https://developers.google.com/search/docs/appearance/title-link?hl=es): Google utiliza varias fuentes y genera el título del resultado automáticamente. Mantener title/H1 alineados con la intención es útil; no garantiza que Google muestre literalmente el título del HTML.
- [Metadescripciones y fragmentos](https://developers.google.com/search/docs/appearance/snippet?hl=es): el fragmento puede proceder del contenido o de la metadescripción. Se redactó una descripción específica de las funcionalidades implementadas, sin lista de keywords ni promesas de CTR.

No hay una garantía de resultados enriquecidos por FAQ/WebApplication ni de visibilidad en respuestas de IA. La información principal permanece accesible en HTML, con supuestos y referencias verificables.
