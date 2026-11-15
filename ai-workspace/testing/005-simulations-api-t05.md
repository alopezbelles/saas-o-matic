# 005-T05 — Verificación global

15 de noviembre de 2026. Windows/PowerShell; Node 22.19.0 y pnpm 10.33.4 existentes. Base 95e9243, rama specs/005-simulations-api, documentación de cierre sin commit.

## Ejecución real

Desde raíz, secuencialmente. No hubo test:gates concurrente con otros controles de código.

```powershell
$env:Path = "C:\Program Files\nodejs;$PWD\.tools\node_modules\.bin;$env:Path"
pnpm.cmd lint
pnpm.cmd typecheck
pnpm.cmd format:check
pnpm.cmd build
pnpm.cmd test
```

| Control      | Código | Resultado                                 |
| ------------ | ------ | ----------------------------------------- |
| lint         | 0      | Sin errores ni warnings.                  |
| typecheck    | 0      | Shared, API, web y configuración Drizzle. |
| format:check | 0      | Formato global conforme.                  |
| build        | 0      | Shared, API y web compilados.             |
| test         | 0      | 90 pruebas correctas, ninguna omitida.    |

Desglose: 25 shared (5 fixtures y 20 productivos), 12 unitarios API, 49 integración, 1 smoke web, 1 gates y 2 docs. No sumar pruebas históricas/focalizadas de tareas anteriores a esos 90.
[Salida real](005-simulations-api-t05.txt). Los errores intencionales internos de test:gates y los triggers de rollback son pruebas negativas, no fallos de la suite. El incidente de fixture de T04 queda en su registro histórico; no reaparece en esta ejecución.

## Revisión de alcance y conservación

RF1: POST valida antes de DB, obtiene país/plan del cliente, calcula con motor 004 y confirma 201 después del commit. Rechaza overrides; duplicados deliberados conservan semántica acordada.
RF2: errores de entrada/protocolo/referencia/política/DB sanitizados, requestId consistente y logs sin PII. Fallo real AFTER INSERT revierte y conserva commits previos; savepoints y bloqueo de segundo escritor probados.
RF3: historial SQL paginado con total/orden/desempate y lectura coherente. Snapshot/importe guardado, sin motor ni sustitución por cliente actual. Vacío/404/offset fuera de rango y DB busy comprobados.
RF4: cambios de cliente/política solo afectan nuevas simulaciones; GET histórico funciona incluso con política actual inválida. GET /billing-config proyecta reglas/versiones/tasas/límites reales, sin DB, no-store y con copias.
Revisión de código por inspección complementa esas pruebas; no se presenta como test automatizado nuevo.

## Auditoría reproducible

```powershell
git diff --exit-code 675ac5e -- apps/api/drizzle apps/api/src/db/schema.ts apps/api/src/db/persistence.ts pnpm-lock.yaml apps/web
```

Código 0: migraciones, esquema, helper persistencia 002, lockfile y frontend sin cambios desde la definición de 005.
Comparación JSON de dependencies/devDependencies/packageManager/engines de los cuatro package.json frente a 675ac5e: idénticos; solo scripts API ampliados donde corresponde. No instalación nueva ni cambios de stack.
Tras terminar la suite, .cache/002-tests tiene cero entradas. Los tests usan contextos temporales explícitos, no bases reales del usuario; no hubo inicialización de DB de desarrollo ni datos demo nuevos.

## Casos presentados a Alex

| Usuarios ES | Base EUR | Impuesto 21% EUR | Total EUR |
| ----------- | -------- | ---------------- | --------- |
| 15          | 140,00   | 29,40            | 169,40    |
| 51          | 425,00   | 89,25            | 514,25    |

Comprobados mediante HTTP y fila persistida en tests temporales. Moneda histórica EUR, precios users-tiered-v1, política demo-standard-v1 (ES 21%, FR 20%, DE 19%, GB 20%). Sin fiscalidad real completa ni FX.
Rutas entregadas: POST /simulations, GET /customers/:id/simulations?limit=&offset= y GET /billing-config.

## Cierre y límites

CUMPLE TÉCNICAMENTE T05/005. Aceptación humana final no registrada. Sin commits/pushes ni inicio de 006.
No E2E de navegador ni accesibilidad: no UI nueva en esta spec. Timeout después de commit sigue siendo resultado incierto para consumidor; no se promete idempotencia ni reintento POST automático.
Después de actualizar documentación: pnpm.cmd format:check devuelve 0, pnpm.cmd test:docs devuelve 0 (2 pruebas correctas) y git diff --check devuelve 0. No se repite la suite funcional por cambios solo documentales; los 90 tests corresponden a la ejecución global conservada arriba.
[Validación](../../specs/005-simulations-api/validation.md), [revisión final](../reviews/005-simulations-api-t05.md).
