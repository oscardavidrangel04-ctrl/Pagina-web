# Piloto UI/UX V2: cinco páginas

## Plan previo a implementar

Se aplica la skill local `.agents/skills/frontend-design/SKILL.md`. El público necesita entender importes de nómina y prestaciones, introducir pocos datos y comparar el desglose con su recibo. El concepto visual es una **mesa de trabajo para revisar cuentas**: títulos alineados a la izquierda, campos legibles, resultado con estructura de recibo y navegación por objetivos.

Paleta: tinta petróleo `#173b40`, verde de acción `#0b6356`, papel `#ffffff`, fondo frío `#edf4f4`, línea `#c8d9d9`, foco ámbar `#a84912`. El modo oscuro usa superficies verde petróleo y texto claro, conservando contraste. Encabezados con `Trebuchet MS` (alternativa local humanista), cuerpo `Segoe UI`/sistema y cifras tabulares; sin descargas de tipografías.

Inicio: título y buscador a la izquierda, directorio organizado a la derecha. Calculadoras: encabezado compacto, mesa de entrada amplia y orientación lateral. El resultado se distingue como recibo, con valores alineados y total destacado por función, no por decoración. En móvil se conserva el orden DOM: datos → resultado → explicación → espacios comerciales. La publicidad recibe su integración compartida por separado, sin convertirse en un control del cálculo.

```text
Escritorio: [ marca | navegación ]
            [ título + búsqueda | directorio ]  (inicio)
            [ título + propósito             ]  (calculadoras)
            [ datos y resultado | orientación]
            [ explicación y fuentes          ]
Móvil:      [ marca | controles ]
            [ título / acceso al formulario ]
            [ datos                          ]
            [ resultado / desglose           ]
            [ orientación y lectura          ]
```

Crítica del plan: una retícula de tarjetas idénticas competiría con los formularios; se reserva la superficie elevada para la mesa de cálculo y se hace más sobria la lectura. Se descartan sombras grandes, degradados y animaciones de entrada. No se cambia a serif ni se inventa un tablero con cifras decorativas. Los bordes distinguen campos y resultados; los enlaces editoriales siguen subrayados y los botones describen acciones existentes.

## Alcance exacto

| URL | Motivo |
|---|---|
| `/` | Entrada al sitio y descubrimiento de herramientas |
| `/calculadoras/salario-diario.html` | Principal oportunidad histórica de tráfico/CTR |
| `/calculadoras/pago-quincenal.html` | Segunda calculadora prioritaria en Google |
| `/calculadoras/aguinaldo.html` | Formulario complejo, modos y resultados fiscales adicionales |
| `/calculadoras/finiquito.html` | Desglose de varios conceptos laborales y riesgo de confusión |

Implementación: una hoja nueva `assets/css/pilot-v2.css`, cargada únicamente por esos cinco HTML y con selectores limitados a `body.cm-pilot-v2`. Se preservan scripts de cálculo, atributos de campos, metadatos, texto SEO y destinos de enlaces. Los estilos globales originales permanecen intactos. No se extiende el piloto a versiones fallback ni a otras URLs.

## Validación

Validado en Chromium a 320, 390 y 1440 px, en modo claro y oscuro: 30 combinaciones del piloto sin desbordamiento horizontal. Axe no encontró infracciones WCAG A/AA en el contenido principal de las cinco páginas probadas a 390 px en ambos temas tras corregir contraste. Se inspeccionaron capturas reales de inicio, formulario laboral y finiquito.

Las 12 capturas de `previews/` muestran escritorio, móvil y dos vistas oscuras; recursos publicitarios simulados o bloqueados en las pruebas. No certifican anuncios reales ni constituyen una publicación. Pruebas funcionales y de preservación en `validacion/`.

La crítica visual detectó textos blancos sobre fondos claros y colores heredados inadecuados en el tema oscuro; se corrigieron dentro del piloto. Los enlaces de las tarjetas comerciales tienen contraste propio para no heredar el rojo de plantillas antiguas. La tabla de interés compuesto admite foco por teclado como corrección técnica, sin extender el rediseño. Permanecen problemas de contraste de estilos originales en tres páginas ajenas al piloto, documentados en el informe.
