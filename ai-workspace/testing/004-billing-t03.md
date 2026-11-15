# 004-T03 — Verificación

15 de noviembre de 2026. Windows/PowerShell; herramientas existentes Node 22.19.0 y pnpm 10.33.4. Rama specs/004-billing; base eb24f0a, cambios de T03 sin commit.

## Comandos y resultados reales

Desde raíz, con PATH de proceso para encontrar herramientas locales:

```powershell
$env:Path = "C:\Program Files\nodejs;$PWD\.tools\node_modules\.bin;$env:Path"
pnpm.cmd lint
pnpm.cmd typecheck
pnpm.cmd test:unit
pnpm.cmd format:check
```

| Control             | Código | Resultado                                       |
| ------------------- | ------ | ----------------------------------------------- |
| lint                | 0      | Sin errores ni warnings.                        |
| typecheck           | 0      | shared, API, web y configuración Drizzle.       |
| test:unit           | 0      | 16 shared + 5 API = 21 tests, sin omitidos.     |
| format:check global | 1      | 41 archivos ajenos con incidencia preexistente. |

[Salida real conservada](004-billing-t03.txt). Los 21 incluyen 5 fixtures, 11 productivos shared y 5 API (3 clientes/fiscal, 2 configuración fiscal).

## Cobertura

Half-up con base 1 y tasas sintéticas 4999/5000/5001 → 0/1/1 céntimos; división impar, cero e impuesto 1,5→2.
MAX_SAFE_INTEGER con tasa 10000 conserva exactamente el máximo pese al producto intermedio mayor al rango seguro. Tasa 1 retorna 900719925474; tasa 10001 produce overflow. Conversión segura prueba máximo, máximo+1 y negativos.
Tipos inválidos, fracciones, no finitos, bigint/Symbol/wrappers y tasas inválidas se rechazan con BillingError/códigos estables, sin eco de entrada.
Políticas inválidas (incluida tasa de otro país), versión hasta 64 caracteres, mapas sin prototipo, países ausentes y tasas heredadas; cero explícito no es ausencia.
Configuración API compilada: cuatro países/versiones/tasas acordados y congelación efectiva. Impuestos ES de 15/51 usuarios: 2940/8925 céntimos.
tiers.ts reutiliza toSafeCents; sus pruebas anteriores siguen pasando. No calculateQuote, suma de total ni nuevas reglas fiscales.

## Incidencias y límites

El formato global baja de 42 a 41 avisos porque apps/api/package.json se modificó/formateó para conectar la nueva prueba. No se reformatea el resto.
Tras actualizar registros, pnpm.cmd test:docs pasa con código 0 y 2 tests; formato acotado a todos los archivos modificados/nuevos de T03 pasa con código 0; git diff --check devuelve código 0, con avisos de normalización futura LF→CRLF. Comandos del cierre:

```powershell
$taskFiles = @((git diff --name-only), (git ls-files --others --exclude-standard)) | ForEach-Object { $_ } | Where-Object { $_ -match "\.(md|mjs|ts|json)$" }
.\node_modules\.bin\prettier.cmd --check $taskFiles
pnpm.cmd test:docs
git diff --check
```

No pnpm build completo ni pnpm test completo, integración/web/gates (previstos para T05). test:unit sí compila shared/API; sin DB/HTTP, instalación ni commits.
[Validación](../../specs/004-billing/validation.md) y [revisión](../reviews/004-billing-t03.md).
