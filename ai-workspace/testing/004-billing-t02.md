# 004-T02 — Verificación

15 de noviembre de 2026. Windows/PowerShell, instalación existente Node 22.19.0 y pnpm 10.33.4. Rama specs/004-billing, base 84818bf; cambios T02 sin commit.

## Comandos y resultados

Desde raíz con PATH de proceso para herramientas locales:

```powershell
$env:Path = "C:\Program Files\nodejs;$PWD\.tools\node_modules\.bin;$env:Path"
pnpm.cmd lint
pnpm.cmd typecheck
pnpm.cmd test:unit
pnpm.cmd format:check
```

| Control             | Código | Resultado real                                                                                                 |
| ------------------- | ------ | -------------------------------------------------------------------------------------------------------------- |
| lint                | 0      | Sin warnings ni errores.                                                                                       |
| typecheck           | 0      | shared, API, web y configuración Drizzle.                                                                      |
| test:unit           | 0      | 10 shared (5 fixtures + 5 productivos), 3 API. Sin omitidos.                                                   |
| format:check global | 1      | 42 archivos ajenos con incidencia preexistente de formato; index.ts se normalizó dentro del cambio de exports. |

## Cobertura productiva

- UT-BILL-01: oráculos 0/10/11/15/50/51/1000; bases, cantidades, versión y desglose explícito de 51 usuarios. 15→14000 y 51→42500 céntimos.
- Invariantes y JSON para los 1001 consumos válidos: suma de cantidades/subtotales, tramos con datos exactos y cantidades positivas.
- UT-PROP-01: los 1000 incrementos marginales son 1000/800/500 céntimos según tramo; monotonía estricta.
- UT-INPUT-004 parcial: usuarios inválidos (incluidos bigint, Symbol y wrapper numérico), máximo+1, tipos incorrectos, fracciones y no finitos; BillingError con code/field estables y sin eco de datos.
- Determinismo y aislamiento: modificar una salida no altera otra ni las reglas internas.

El overflow no es alcanzable con los límites/tarifas de users vigentes; hay guarda productiva antes de convertir a Number. Las pruebas sintéticas de dinero pertenecen a T03. No afirmar cobertura de esa rama por T02.

## Cierre documental y límites

Tras actualizar registros: pnpm.cmd test:docs devuelve código 0 (2 tests pasan); formato acotado a todos los archivos modificados/nuevos de T02 devuelve código 0; git diff --check devuelve código 0 (con avisos de normalización futura LF→CRLF). Comandos del cierre:

```powershell
$taskFiles = @((git diff --name-only), (git ls-files --others --exclude-standard)) | ForEach-Object { $_ } | Where-Object { $_ -match "\.(md|mjs|ts|json)$" }
.\node_modules\.bin\prettier.cmd --check $taskFiles
pnpm.cmd test:docs
git diff --check
```

No se ejecutaron pnpm build completo, pnpm test completo ni suites integración/web/gates, reservados a T05. test:unit compila shared/API. Sin DB ni HTTP, nuevas dependencias o commits.
[Validación](../../specs/004-billing/validation.md), [revisión](../reviews/004-billing-t02.md).
