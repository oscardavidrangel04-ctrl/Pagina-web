# Taste Skill: instalación verificada

Comprobación realizada durante el rediseño de la home del 6 de noviembre de 2026 (fecha de México).

## Origen y versión

- Repositorio oficial: <https://github.com/Leonxlnx/taste-skill>.
- Nombre que utiliza Codex: `design-taste-frontend`.
- Versión declarada por el paquete: **tasteskill 2.5.0**.
- Revisión instalada: `9b4bf937a1f69348126959c15d2f99a73e65699b`.
- Carpeta original: `skills/taste-skill`.
- Instalación del proyecto: `.agents/skills/design-taste-frontend/`.
- Instrucciones: [SKILL.md](../../.agents/skills/design-taste-frontend/SKILL.md).
- Registro generado por el instalador: [skills-lock.json](../../skills-lock.json).

Se utilizó el procedimiento `npx skills add` publicado en el README oficial. La selección de agente y el modo de copia instalan el paquete dentro del proyecto:

```sh
npx --yes skills add https://github.com/Leonxlnx/taste-skill --skill design-taste-frontend --agent codex --copy --yes
```

En este entorno se indicó `npm_config_cache=/workspace/work/npm-cache` porque la caché predeterminada no tenía permiso de escritura. Esa variable únicamente cambia la caché de npm, no el destino de la skill.

## Integridad y disponibilidad

Se comparó el SHA-256 de **cada uno de los 1.617 archivos** instalados con los archivos de la revisión oficial indicada arriba: **coincidencia exacta, sin archivos ausentes, adicionales ni modificados**.

SHA-256 del archivo principal `SKILL.md`:

```text
f2fe0fb10f4c7d742866d1869a2ce4b16d14e9819612bf0245738705d806062f
```

Los 1.617 archivos suman **36.119.617 bytes**. Se conserva el paquete completo, incluidos sus recursos y validadores, para que una descarga del repositorio incluya una instalación utilizable. Se agrega por separado la [licencia MIT original](TASTE-SKILL-LICENSE.txt), que está en la raíz del repositorio oficial y no forma parte de la carpeta que copia el instalador.

El agente puede leer la skill directamente desde `.agents/skills/design-taste-frontend/SKILL.md`; esa ruta de proyecto es la que creó el instalador para Codex. En esta tarea se leyeron sus instrucciones para aplicarlas. La instalación por carpeta no equivale a instalar el plugin de Codex: el README exige iniciar otra sesión para cargar ese plugin, pero aquí se utilizó el mecanismo de skills del proyecto, no el plugin.

También se ejecutó `npx --offline --yes skills list --agent codex`, usando la caché ya disponible. Finalizó con código 0 y enumeró `design-taste-frontend`, su ruta `./.agents/skills/design-taste-frontend`, agente `Codex` y origen `Leonxlnx/taste-skill`. Esta comprobación confirma que el instalador reconoce la instalación para este proyecto.

## Requisitos y herramientas comprobados

- Node.js disponible: `v24.22.1` (el paquete requiere Node 22 o posterior).
- Chromium disponible: `155.0.8059.79`, ruta `/usr/bin/chromium`.
- Las herramientas oficiales `scripts/start.mjs`, `assets/layout/deal.mjs`, `scripts/consistency.mjs`, `assets/layout/check.mjs`, `scripts/shoot.mjs` y `scripts/perf.mjs` están presentes.
- No se necesitan claves API para sus validadores locales.

La presencia de los ejecutables no constituye por sí misma una prueba visual. Los resultados de su ejecución sobre la home se documentan por separado, con sus limitaciones.

## Recursos de desarrollo, no recursos de producción

La skill completa vive en `.agents/`, fuera del árbol público generado por `scripts/build-public.cjs`. El build utiliza una lista de archivos públicos y no publica `.agents/`, sus fotos, ejemplos ni validadores. El tamaño de desarrollo de la skill no se transfiere al navegador del visitante.

Se conserva la copia oficial sin modificar para evitar alterar los validadores o convertir una comprobación fallida en un resultado aparente. La implementación del sitio y sus pruebas se mantienen en archivos del proyecto distintos del paquete.

## Reproducir exactamente esta revisión

El comando remoto normal sigue el estado vigente del repositorio. Para restaurar la misma revisión en otro entorno, primero se fija el origen y después se utiliza el mismo instalador oficial con la ruta local:

```sh
git clone https://github.com/Leonxlnx/taste-skill /tmp/calculadoras-taste-source
git -C /tmp/calculadoras-taste-source checkout --detach 9b4bf937a1f69348126959c15d2f99a73e65699b
npx --yes skills add /tmp/calculadoras-taste-source --skill design-taste-frontend --agent codex --copy --yes
```

La restauración debe ejecutarse desde la raíz del proyecto. No hace falta repetirla cuando la copia completa ya está presente en el repositorio.
