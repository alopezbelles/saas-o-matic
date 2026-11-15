# 004-T01 — Verificación

15 de noviembre de 2026. Windows/PowerShell, Node v22.19.0, pnpm 10.33.4. Rama specs/004-billing; base 06fd82b, cambios de T01 sin commit.

## Comandos y resultados reales

Ejecutados desde raíz. Preparación del entorno para encontrar las herramientas ya instaladas, sin instalación ni configuración persistente:

```powershell
$env:Path = "C:\Program Files\nodejs;$PWD\.tools\node_modules\.bin;$env:Path"
pnpm.cmd lint
pnpm.cmd typecheck
pnpm.cmd format:check
pnpm.cmd test:unit
pnpm.cmd test:docs
```

| Control             | Salida | Resultado                                                      |
| ------------------- | ------ | -------------------------------------------------------------- |
| lint                | 0      | Sin errores ni warnings.                                       |
| typecheck           | 0      | shared, web, API y configuración Drizzle.                      |
| test:unit           | 0      | 5 tests de integridad de fixtures y 3 tests de API existentes. |
| test:docs           | 0      | 2 tests; enlaces y contexto activo 004.                        |
| format:check global | 1      | 43 archivos ajenos a T01 con CRLF frente al LF esperado.       |

[Salida conservada](004-billing-t01.txt). Las 8 pruebas unitarias no son 8 pruebas productivas de facturación: solo 5 validan datos de prueba y 3 regresiones de clientes.

## Incidencia de formato

La preparación ya detectó 46 archivos. Tres de ellos (package.json raíz, docs/testing.md y test/docs.test.mjs) se modificaron y formatearon dentro de T01; quedan 43 fuera del alcance.
Se compararon sus contenidos con prettier.format usando configuración resuelta y filepath: en los 43, normalizar CRLF a LF iguala exactamente el resultado de Prettier; no se escribieron esos archivos. Diagnóstico: {files:43,eolOnly:43,other:[]}.
El formato global sigue fallando; no atribuir PASS global a esta entrega. Al cierre, formato acotado a todos los archivos modificados/nuevos de T01: código 0. git diff --check: código 0. test:docs repetido tras actualizar evidencias: código 0, 2 pruebas pasan.

Comando del control acotado (archivos de esta tarea, partiendo de árbol limpio):

```powershell
$taskFiles = @((git diff --name-only), (git ls-files --others --exclude-standard)) | ForEach-Object { $_ } | Where-Object { $_ -match "\.(md|mjs|json)$" }
.\node_modules\.bin\prettier.cmd --check $taskFiles
git diff --check
```

## Alcance y controles no ejecutados

No motor, configuración fiscal productiva, DB, HTTP ni FX. Los oráculos son valores escritos independientemente; el test solo verifica coherencia, casos presentes y límites contra shared.
No pnpm build completo ni pnpm test completo, integración/web/gates: reservados al cierre T05. test:unit sí compila shared/API y typecheck verifica los workspaces.
[Validación](../../specs/004-billing/validation.md) y [revisión T01](../reviews/004-billing-t01.md).
