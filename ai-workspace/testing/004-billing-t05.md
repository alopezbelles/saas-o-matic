# 004-T05 — Verificación global

15 de noviembre de 2026. Windows/PowerShell, Node 22.19.0 y pnpm 10.33.4 existentes. Base 88ce6b1, rama specs/004-billing; documentación T05 sin commit.

## Comandos y resultados reales

Ejecutados secuencialmente desde raíz. El fallo de formato no impidió controles independientes posteriores; test:gates no coincidió con otros controles de código.

```powershell
$env:Path = "C:\Program Files\nodejs;$PWD\.tools\node_modules\.bin;$env:Path"
pnpm.cmd lint
pnpm.cmd typecheck
pnpm.cmd format:check
pnpm.cmd build
pnpm.cmd test
```

| Control      | Código | Resultado                                                |
| ------------ | ------ | -------------------------------------------------------- |
| lint         | 0      | Sin errores ni warnings.                                 |
| typecheck    | 0      | shared, API, web y configuración Drizzle.                |
| format:check | 1      | 41 archivos ajenos a 004 con CRLF frente al LF esperado. |
| build        | 0      | Shared, API y web compilados.                            |
| test         | 0      | 59 pruebas correctas, ninguna omitida.                   |

Desglose: 25 shared (5 fixtures y 20 productivos), 5 unitarios API, 25 integración, 1 smoke web, 1 gates y 2 docs. Los fallos deliberados internos de test:gates son su fixture negativo, no errores de la suite.
[Salida real](004-billing-t05.txt). Integraciones en contextos temporales de test; no se abrieron/migraron bases reales del usuario. Smoke web no equivale a E2E de navegador ni accesibilidad.

## Compatibilidad y arquitectura

Revisados imports del dominio: solo módulos de billing y límites shared, sin HTTP/SQL/React/red/entorno. Frente a 88ce6b1 no hay cambios T05 en apps/api/src, apps/api/drizzle, apps/web/src ni lockfile.
Se ejecutó motor compilado y validateBreakdown de 002 sobre 4004 pares consumo/país: todos aceptados, sin DB. Comprobación adicional a los 59 tests, no suite nueva.
Script real, desde raíz mediante here-string PowerShell y node --input-type=module:

```javascript
import assert from 'node:assert/strict';
import {
  calculateQuote,
  CONSUMPTION_LIMITS,
} from './packages/shared/dist/index.js';
import { taxPolicy } from './apps/api/dist/config/tax-policy.js';
import { validateBreakdown } from './apps/api/dist/db/validation.js';
let checked = 0;
for (const countryCode of Object.keys(taxPolicy.ratesByCountry)) {
  for (let users = 0; users <= CONSUMPTION_LIMITS.users; users++) {
    const quote = calculateQuote(
      { users, storageGb: 0, apiCalls: 0, countryCode },
      taxPolicy,
    );
    validateBreakdown(quote.breakdown, users, quote.baseCents);
    checked++;
  }
}
assert.equal(checked, 4004);
const examples = [15, 51].map((users) => ({
  users,
  ...calculateQuote(
    { users, storageGb: 0, apiCalls: 0, countryCode: 'ES' },
    taxPolicy,
  ),
}));
console.log(
  JSON.stringify(
    { compatibleBreakdowns: checked, policy: taxPolicy, examples },
    null,
    2,
  ),
);
```

## Casos para revisión de Alex

| Usuarios, ES | Base EUR | Impuesto 21% EUR | Total EUR |
| ------------ | -------- | ---------------- | --------- |
| 15           | 140,00   | 29,40            | 169,40    |
| 51           | 425,00   | 89,25            | 514,25    |

Precios users-tiered-v1, política demo-standard-v1: ES 21%, FR 20%, DE 19%, GB 20%. Simplificada sin exenciones/territorialidad; GB no convierte a GBP. Presentar resultados no acredita aceptación humana.

## Incidencia y estado

Comparación read-only con prettier.format, configuración resuelta y filepath: en los 41 archivos, normalizar CRLF a LF iguala exactamente el resultado esperado. Diagnóstico: {files:41,eolOnly:41,other:[]}.
No configuración Git ni reformateo de archivos ajenos. T05 y regresión ejecutadas; cierre global pendiente de format:check. No afirmar todos los gates verdes.
Tras actualizar evidencias, pnpm.cmd test:docs pasa de nuevo (2 tests, código 0); formato acotado a todos los archivos modificados/nuevos de T05 pasa (código 0) y git diff --check pasa (código 0, con avisos de normalización futura LF→CRLF). Comandos:

```powershell
$taskFiles = @((git diff --name-only), (git ls-files --others --exclude-standard)) | ForEach-Object { $_ } | Where-Object { $_ -match "\.(md|mjs|ts|json)$" }
.\node_modules\.bin\prettier.cmd --check $taskFiles
pnpm.cmd test:docs
git diff --check
```

[Validación](../../specs/004-billing/validation.md) y [revisión](../reviews/004-billing-t05.md).
