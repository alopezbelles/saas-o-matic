# 004 — Corrección de saltos de línea y cierre T05

15 de noviembre de 2026. Base 9246956, rama specs/004-billing, corrección sin commit. Windows/PowerShell, Node 22.19.0 y pnpm 10.33.4 existentes. Autorización de Alex posterior al fallo de formato registrado en T05.

## Causa y solución

41 archivos del working tree usaban CRLF mientras Prettier esperaba LF. Para cada archivo se comprobó que reemplazar CRLF por LF equivalía exactamente a prettier.format con su configuración y filepath; se escribió únicamente esa normalización y se verificó el resultado.
Resultado real: normalized=41, onlyCrLfToLf=true, prettierEquivalent=true. Sin cambios de lógica ni contenido de migraciones.
Se añade .gitattributes con * text=auto eol=lf y endOfLine: lf explícito en .prettierrc.json. La detección automática preserva binarios; los archivos de texto mantienen LF en futuros checkouts. No cambia configuración personal ni .git.
Verificación git ls-files --eol de los 41: i/lf, w/lf y atributo eol=lf. El índice ya tenía LF; no fue necesario git add --renormalize ni modificarlo. Por eso las normalizaciones pueden no aparecer como cambios de contenido en git diff.

## Controles reales

Ejecutados secuencialmente desde raíz:

```powershell
$env:Path = "C:\Program Files\nodejs;$PWD\.tools\node_modules\.bin;$env:Path"
pnpm.cmd lint
pnpm.cmd typecheck
pnpm.cmd format:check
pnpm.cmd build
pnpm.cmd test
```

Todos devuelven código 0. Suite completa: 59 pruebas correctas (30 unitarios, 25 integración, 1 web, 1 gates, 2 docs), sin omitidos. test:gates sin otros controles de código simultáneos.
[Salida real](004-billing-format-fix.txt) incluye lista inicial de archivos, diagnóstico y verificaciones.
Integraciones solo en contextos temporales de tests; no bases reales del usuario. Sin nuevas dependencias, funcionalidades, endpoints, commits ni pushes.

## Revisión y estado

CUMPLE TÉCNICAMENTE: incidencia de formato resuelta y T05 cerrada técnicamente. RF1..4 ya estaban implementados y revisados; no cambia el alcance fiscal demo ni se implementa 005.
La validación previa de T05 conserva su fallo histórico; esta verificación posterior lo resuelve. Aceptación humana final no registrada.
Después de actualizar documentos: pnpm.cmd format:check pasa de nuevo (0), pnpm.cmd test:docs pasa (0, 2 tests) y git diff --check pasa (0).
Además, git diff --exit-code -- apps/api/src apps/api/drizzle apps/api/test packages/shared/src README.md AGENTS.md specs/003-customers-api devuelve 0: no hay cambios de contenido lógico en esos archivos previamente normalizados. El historial y los registros nuevos de 004 sí se actualizaron deliberadamente para reflejar el cierre.
[Validación canónica](../../specs/004-billing/validation.md) y [revisión T05](../reviews/004-billing-t05.md).
