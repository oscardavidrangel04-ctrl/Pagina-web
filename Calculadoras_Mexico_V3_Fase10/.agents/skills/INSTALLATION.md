# frontend-design

Instalada para Cloud-codex el 6 de noviembre de 2026 usando el helper oficial de `skill-installer` de OpenAI.

- Fuente solicitada: https://github.com/anthropics/skills/tree/main/skills/frontend-design
- Ubicación del proyecto: `.agents/skills/frontend-design/`.
- Registro para futuras tareas de Codex: `AGENTS.md` en la raíz.
- Instalador: https://github.com/openai/skills/tree/49f948faa9258a0c61caceaf225e179651397431/skills/.system/skill-installer

Comando usado, con `--dest` para instalar en el ámbito del proyecto:

```sh
python /ruta/skill-installer/scripts/install-skill-from-github.py \
  --url https://github.com/anthropics/skills/tree/main/skills/frontend-design \
  --dest /workspace/Cloud-codex/.agents/skills \
  --method git
```

Se incluyeron los archivos originales completos, sin modificar el contenido de la skill ni su licencia. Se compararon sus hashes Git con los devueltos por la API de GitHub para los archivos de origen:

| Archivo | Hash de blob Git, local y origen coincidentes |
|---|---|
| `SKILL.md` | `a5333457c414d20d625f307df945842c0952ecc3` |
| `LICENSE.txt` | `f433b1a53f5b830a205fd2df78e2b34974656c7b` |

El frontmatter contiene `name: frontend-design`, descripción y referencia a la licencia. La ruta es legible desde el repositorio y está enlazada en las instrucciones del proyecto. Esta instalación no modifica el catálogo global de skills de la sesión ya iniciada: la referencia del proyecto estará disponible a partir del siguiente turno; también puede leerse directamente desde su ruta.

La skill y `AGENTS.md` son herramientas de desarrollo, excluidas del directorio `site-public` por la lista de archivos permitidos del build. No requieren desplegar Vercel ni añaden recursos al sitio público.
