# Home rediseñada con Taste Skill

La actualización transforma exclusivamente `/` a partir del commit `35a16fd5f78d3d2ab7634fcbce275ec181cb07fc`. El resto del sitio conserva su implementación y diseño anteriores. Rama: `codex/home-taste-2026-11-06`. [Pull Request #6](https://github.com/oscardavidrangel04-ctrl/Cloud-codex/pull/6). El PR es acumulativo e incluye el trabajo V2 del PR #5; el alcance exclusivo de la home descrito aquí se compara con el commit indicado, no con main. No se fusionó main ni se desplegó a producción; la rama tiene `deploymentEnabled: false` en Vercel.

## Diseño implementado

- Identidad azul recuperada del historial: `#0b57d0`, `#1a73e8`, marino `#071a35` y fondo `#f5f8fc`. El archivo original `assets/img/logo.svg` permanece intacto, incluidos sus detalles verdes originales. Se retira la paleta verde/violeta de la interfaz de la home.
- Header marino, logo original y navegación accesible, con menú móvil y buscador por teclado.
- Hero con una superficie de búsqueda real: coincidencias del catálogo, cuatro accesos por consulta, contador y alternativa GET sin JavaScript. En móvil, la búsqueda precede a las categorías.
- Composición asimétrica para herramientas populares, con ISR destacado; rutas por situación presentadas como un directorio y guías con jerarquía editorial propia.
- Instrument Sans variable alojada localmente, iconos consistentes, espaciado, modo oscuro, estados de foco y microinteracciones reducidas a acciones del visitante. El texto secundario sobre las superficies claras alcanza un contraste calculado de 7,30:1 a 8,36:1.
- Favoritos, recientes e historial conservados en una región personal; FAQs, metodología, fuentes y todos los recursos previos siguen disponibles.

Taste Skill oficial 2.5.0 se instaló, se leyó y se comprobó con `skills list --agent codex`. Procedencia, hash y comandos en [SKILL-INSTALLATION.md](SKILL-INSTALLATION.md). El [plan y sus adaptaciones](PLAN.md) documenta qué principios se aplicaron y qué requisitos del usuario prevalecieron sobre las reglas de una landing nueva. No se añadieron efectos WebGL, testimonios ni cifras inventadas.

## Protección de SEO, funcionalidad y monetización

- Title, descripción, canonical, robots, Open Graph, Twitter y JSON-LD originales conservados. Solo cambian `theme-color` y dos metadatos descriptivos de Taste.
- Se conservan los 84 destinos originales de la home compilada y los 35 párrafos informativos extensos comparados literalmente. Un H1 y las seis preguntas frecuentes permanecen.
- Los 407 HTML restantes del build (incluido el archivo de verificación), 75 recursos públicos previos y 65 assets fuente existentes coinciden byte a byte con la base.
- Las fórmulas, scripts de calculadoras, sitemap, robots y reglas de rutas no cambian. Salario diario y pago quincenal se ejecutaron y compararon con la base; también se revisó una guía como control de aislamiento.
- Una instancia de cada integración en la home: nativo Adsterra `409e3950cb7b10082bb628969be6611a`, banner `94dbe87812d642e0600cc58986b093c2`, AliExpress y Sol Crédito. Se conservan scripts, identificadores, banners, enlaces `?i=4`, identificación comercial y atributos `sponsored nofollow noopener`.
- El recuento estático confirma las cuatro integraciones en las 407 páginas para visitantes. El token de verificación de Google queda intacto. [Resultado](monetization-preserved.json).

## Rendimiento

La home deja de cargar sus dos hojas legacy y el piloto V2. La hoja nueva se limita al ámbito `.cm-home-taste`; las hojas anteriores no se editaron y continúan disponibles para las demás páginas. Esto también elimina el conflicto de una regla legacy que ocultaba `.hero`.

| CSS solicitado por la home | Antes | Después |
|---|---:|---:|
| Bytes sin comprimir, incluida monetización | 184.120 | 40.785 |
| Estimación gzip de esos archivos | 34.631 | 8.588 |

La reducción de CSS es aproximadamente 78%. Se incorpora una fuente local variable de aproximadamente 30 KB y un script pequeño para la búsqueda y el teclado. La reducción de CSS no equivale por sí sola a una mejora garantizada de LCP o INP. No hay nuevas llamadas publicitarias ni dependencias de frontend. La transferencia total del laboratorio pasó de 75,8 a 84,2 KiB en escritorio por la fuente y el buscador. El CLS observado fue 0,000 en ambas versiones. Los resultados completos y límites de las mediciones están en [taste-checks/README.md](taste-checks/README.md); no equivalen a Core Web Vitals de campo.

## Validación

Comandos reproducibles:

```bash
node scripts/build-public.cjs
node --check assets/js/home-taste.js
HOME_TASTE_BASELINE_DIR=/ruta/a/la/base node scripts/test-home-taste.cjs
python scripts/check-phase6-release.py
```

El test de home requiere Playwright, Chromium y axe-core. `CHROMIUM_PATH`, `AXE_PATH` y `HOME_TASTE_QA_DIR` permiten indicar sus rutas. La base es el commit mencionado al inicio, compilado con su propio build.

- Build de 486 archivos; la skill, exportaciones y reportes no se publican.
- Auditoría técnica: 379 URLs indexables, sin enlaces rotos, páginas huérfanas, duplicación de title/descripción ni inconsistencias de sitemap/canonical detectadas. [Resultado](seo-release.json).
- Navegador: 320, 390, 768, 820, 1024 y 1440 px, en claro y oscuro; búsqueda progresiva, búsqueda sin JS, modal, menú, teclado, tema persistente, favoritos e historial. Se comprobó también la cabecera a 320 px con un aviso de instalación simulado y el hover de 2 px con su alternativa sin movimiento.
- Resultado final: **12 combinaciones de viewport/tema aprobadas, 24 capturas generadas y ocho análisis axe sin infracciones detectadas**. Sin errores JavaScript propios, recursos locales faltantes ni bloqueos CSP de recursos requeridos. Se comprobó también menú móvil abierto → Ctrl+K → Tab/Shift+Tab → Escape, dando prioridad al foco del buscador. [Evidencia](validation.json).
- Los banners de Admitad se sustituyen por imágenes explícitamente rotuladas como simuladas durante la prueba; los scripts Adsterra se interceptan con respuestas vacías. Se comprueban URLs, dimensiones, inicialización y CSP, no entrega real de anuncios.
- La red del entorno restringe las redes publicitarias externas. Quedan pendientes sus creatividades reales, redirecciones de afiliación, mediciones de campo de LCP/INP/CLS y resultados de ingresos o posicionamiento.

Las comprobaciones oficiales de Taste, sus observaciones y las adaptaciones justificadas se documentan en [taste-checks/README.md](taste-checks/README.md). No se presenta como un PASS global de sus reglas de landing.

## Revisar el resultado

Las capturas finales se guardan en `capturas/`; se versionan ocho de las 24 generadas:

- [Escritorio](capturas/home-1440-light-viewport.png) · [página completa](capturas/home-1440-light-full.png).
- [Móvil](capturas/home-390-light-viewport.png) · [página completa](capturas/home-390-light-full.png).
- [Oscuro, escritorio](capturas/home-1440-dark-viewport.png) · [oscuro, móvil](capturas/home-390-dark-viewport.png).
- [Tablet 768 px](capturas/home-768-light-viewport.png) · [1024 px](capturas/home-1024-light-viewport.png).

Para probar en la computadora, cambiar a esta rama, ejecutar el build y servir la carpeta `site-public` con un servidor HTTP estático. Abrir `/` a 390 y 1440 px. Para el sitio completo, utilizar un servidor que respete las rewrites de `vercel.json`.

El contenido de `site-public` es el resultado publicable. El kit completo de Taste es una dependencia de desarrollo de aproximadamente 36 MB y no forma parte de esa carpeta. No hace falta cargar la skill al alojamiento para que funcione el diseño.

## Archivos de esta intervención

| Archivo | Cambio |
|---|---|
| `index.html` | Composición y recursos exclusivos de la home; SEO y enlaces conservados |
| `assets/css/home-taste.css` | Sistema visual y responsive aislado |
| `assets/js/home-taste.js` | Búsqueda progresiva y navegación con teclado |
| `assets/fonts/home-taste/instrument-sans-latin.woff2` | Fuente local, con licencia OFL documentada |
| `scripts/test-home-taste.cjs` | Pruebas funcionales, invariantes, responsive y accesibilidad |
| `vercel.json` | Deshabilita despliegues de esta rama, conservando rutas y cabeceras |
| `AGENTS.md`, `skills-lock.json`, `.agents/skills/design-taste-frontend/`, `.taste-skill/` | Instalación oficial, descubrimiento en Codex y registro de decisiones Taste |
| `docs/home-taste/` | Plan, licencias, evidencias, capturas e informe |

La publicación en producción permanece pendiente; no se ha realizado un despliegue.
