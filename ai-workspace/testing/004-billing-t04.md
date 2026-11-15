# 004-T04 — Verificación

15 de noviembre de 2026. Windows/PowerShell, herramientas existentes Node 22.19.0 y pnpm 10.33.4. Rama specs/004-billing, base b3f3061, cambios T04 sin commit.

## Comandos y resultados reales

Desde raíz con PATH de proceso:

```powershell
$env:Path = "C:\Program Files\nodejs;$PWD\.tools\node_modules\.bin;$env:Path"
pnpm.cmd lint
pnpm.cmd typecheck
pnpm.cmd test:unit
pnpm.cmd format:check
```

| Control             | Código | Resultado                                                       |
| ------------------- | ------ | --------------------------------------------------------------- |
| lint                | 0      | Sin errores ni warnings; repetido tras añadir caso de redondeo. |
| typecheck           | 0      | shared, API, web y configuración Drizzle.                       |
| test:unit final     | 0      | 25 shared + 5 API = 30 tests, ninguno omitido.                  |
| format:check global | 1      | 41 archivos ajenos con incidencia preexistente.                 |

Primera ejecución: 29 unitarios pasan. Se añadió un caso de redondeo global frente a redondeo por tramo; la ejecución final pasa 30. No se ocultaron fallos ni se atribuye al motor el PASS de los 5 fixtures.

## Cobertura nueva

- Contrato exacto, cuatro países, cero usuarios, EUR, versiones y oráculos de 15/51 usuarios.
- Tres consumos: mínimo/máximo/máximo+1, negativos, fracciones, NaN/Infinity, tipos, campos ausentes y objetos inválidos. Primacía de error de entrada frente a política/país.
- Storage/API válidos no cambian precio. Campos adicionales de importe, versión, tasa o plan no cambian el resultado ni salen propagados.
- Política inválida o país no soportado rechazan también cero usuarios; tasa cero solo explícita.
- Overflow del impuesto y, por separado, suma total insegura con base/impuesto seguros; políticas sintéticas identificadas.
- Tasa sintética de 7 bps para 51 usuarios: base 42500, impuesto 30 y total 42530 céntimos; redondeo por tramo daría 29 de impuesto y queda descartado.
- 4004 combinaciones (0..1000 × ES/FR/DE/GB): suma de cantidades/subtotales, total, monotonía y JSON.
- Entradas/política congeladas, determinismo, versiones reales y aislamiento entre salidas mutadas.

## Límites y cierre

No DB, HTTP, FX ni dependencias nuevas. No pnpm build completo, pnpm test completo ni integración/web/gates: corresponden a T05. test:unit sí compila shared/API.
Tras actualizar registros: pnpm.cmd test:docs pasa con código 0 y 2 tests; formato acotado de todos los archivos modificados/nuevos pasa con código 0; git diff --check devuelve código 0 (con avisos de normalización futura LF→CRLF). Comandos del cierre:

```powershell
$taskFiles = @((git diff --name-only), (git ls-files --others --exclude-standard)) | ForEach-Object { $_ } | Where-Object { $_ -match "\.(md|mjs|ts|json)$" }
.\node_modules\.bin\prettier.cmd --check $taskFiles
pnpm.cmd test:docs
git diff --check
```

[Validación](../../specs/004-billing/validation.md) y [revisión](../reviews/004-billing-t04.md). Sin aceptación humana final ni commits del agente.
