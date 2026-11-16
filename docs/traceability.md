# Trazabilidad

## Clientes UI 007 — T01

RF5 parcial mediante shell, tokens y navegación, probado en WEB-SHELL-01 y smoke Chromium. RF1–RF4 y flujos finales siguen pendientes de T02–T05. [Validación](../specs/007-customers-ui/validation.md), [registro](../ai-workspace/iterations/007-customers-ui.md) y [revisión T01](../ai-workspace/reviews/007-customers-ui-t01.md).

## Conversión 006 — cierre técnico

| RF      | Tareas      | Evidencia ejecutada                                                   |
| ------- | ----------- | --------------------------------------------------------------------- |
| 006-RF1 | T01/T02/T05 | Ocho pruebas monetarias y composición cliente/conversión              |
| 006-RF2 | T03/T04/T05 | Contrato normalizado, fuente/fechas y petición concurrente compartida |
| 006-RF3 | T03/T04/T05 | Tasas inválidas/caducadas, HTTP/red/timeout y recuperación EUR        |
| 006-RF4 | T04/T05     | Caché hasta caducidad y varios importes sin refetch                   |

122 pruebas globales correctas. CORS inconcluso por fallo del navegador, interfaz y aceptación humana pendientes. [Validación canónica](../specs/006-currency/validation.md#t05--revisión-y-regresión-global). No confundir fixtures con integración real del proveedor.

## Simulaciones 005 — contratos T01

T05 confirma cierre técnico RF1..4; todos los controles globales correctos y 90 pruebas pasan. [Evidencia final](../ai-workspace/testing/005-simulations-api-t05.md). Aceptación humana no registrada; los párrafos posteriores conservan fases históricas.

T04 completa RF3/RF4 mediante histórico y configuración HTTP; RF1..4 implementados/probados en verificaciones incrementales. IT-HIST-01, IT-SNAPSHOT-005 e IT-CONFIG-005 pasan. [Evidencia T04](../ai-workspace/testing/005-simulations-api-t04.md). Cierre global T05 pendiente; estados anteriores siguientes son históricos.

T03: RF1/RF2 conformes por HTTP, probados IT-SIM-01/02, IT-INVALID-005 e IT-LIFECYCLE-005. RF3 pendiente y RF4 parcial hasta lecturas/configuración de T04. [Evidencia T03](../ai-workspace/testing/005-simulations-api-t03.md). Los estados previos siguientes son históricos.

T02 añade servicio/guardado: IT-SIM-01/02 e IT-SNAPSHOT-005 pasan sobre SQLite temporal. RF1/RF2/RF4 parciales hasta rutas/historial/configuración HTTP. [Verificación T02](../ai-workspace/testing/005-simulations-api-t02.md). Los estados de contratos siguientes describen T01, no el cierre completo actual.

| RF          | Pieza disponible                      | Evidencia                                                     |
| ----------- | ------------------------------------- | ------------------------------------------------------------- |
| 005-RF1/RF2 | Parse de alta, UUID y consumos.       | UT-SIM-CONTRACT-005 ejecutado; servicio/HTTP pendientes.      |
| 005-RF3     | DTO y parse de paginación.            | UT-SIM-CONTRACT-005 ejecutado; consultas HTTP/SQL pendientes. |
| 005-RF4     | BillingConfigDto y versiones tipadas. | Tipos compilados; proyección HTTP pendiente.                  |

[Tareas](../specs/005-simulations-api/tasks.md), [validación](../specs/005-simulations-api/validation.md). T01 no acredita RF completos ni endpoints implementados.

| Requisito  | Tareas             | Casos                                      |
| ---------- | ------------------ | ------------------------------------------ |
| 001-RF1..4 | T01..T05 de 001    | ENV/API/WEB/GATE/DOC de 001                |
| 002-RF1    | T01, T02, T05, T06 | IT-DB-01, IT-MIG-01, IT-RECOVERY-01        |
| 002-RF2    | T01, T02, T03, T06 | IT-CONSTRAINT-01, IT-SAFETY-01             |
| 002-RF3    | T03, T05, T06      | IT-SNAPSHOT-01, IT-BACKUP-01               |
| 002-RF4    | T04, T06           | IT-SEED-01                                 |
| 002-RF5    | T02, T04, T05, T06 | IT-SAFETY-01, IT-RECOVERY-01, IT-BACKUP-01 |

Especificaciones y resultados: [001](../specs/001-foundation/spec.md), [validación 001](../specs/001-foundation/validation.md),
[002](../specs/002-persistence/spec.md), [validación 002](../specs/002-persistence/validation.md).

## Clientes 003

| RF      | Tareas   | Casos                                      |
| ------- | -------- | ------------------------------------------ |
| 003-RF1 | T02..T06 | UT-CONTRACT-01, IT-CUS-01, IT-MIG-003      |
| 003-RF2 | T01..T06 | UT-FISC-01, IT-INVALID-01                  |
| 003-RF3 | T02..T06 | IT-CUS-03                                  |
| 003-RF4 | T02..T06 | IT-DUP-01                                  |
| 003-RF5 | T02..T06 | IT-HTTP-01, IT-LIFECYCLE-01, IT-PRIVACY-01 |

[Spec](../specs/003-customers-api/spec.md), [validación](../specs/003-customers-api/validation.md).

## Motor 004 — implementación incremental

Estado final tras corregir formato: RF1..4 conformes, T01–T05 completadas técnicamente; lint/typecheck/format:check/build/test correctos y 59 tests pasan. [Evidencia final](../ai-workspace/testing/004-billing-format-fix.md). Aceptación humana no registrada; estados parciales siguientes son históricos.

Verificación global T05 ejecutada: RF1..4 conformes y 59 tests pasan; 4004 desgloses compatibles con validador de 002. Cierre global pendiente de formato ajeno (41 archivos CRLF/LF). [Evidencia T05](../ai-workspace/testing/004-billing-t05.md).

| RF      | Tareas        | Casos previstos                                    |
| ------- | ------------- | -------------------------------------------------- |
| 004-RF1 | T02, T04, T05 | UT-BILL-01, UT-QUOTE-004, UT-PROP-01               |
| 004-RF2 | T03, T04, T05 | UT-TAX-01, UT-MONEY-01, UT-QUOTE-004               |
| 004-RF3 | T02..T05      | UT-INPUT-004, UT-TAX-01, UT-MONEY-01, UT-QUOTE-004 |
| 004-RF4 | T02, T04, T05 | UT-PROP-01, UT-QUOTE-004                           |

T01 prepara fixtures/runner; no acredita RF. [Spec](../specs/004-billing/spec.md), [plan](../specs/004-billing/plan.md), [validación pendiente](../specs/004-billing/validation.md).
T02 implementa RF1 y partes de RF3/RF4 relativas a tramos: UT-BILL-01, marginales/determinismo UT-PROP-01 y usuarios inválidos UT-INPUT-004 pasan. Impuestos y quote pendientes. [Evidencia](../ai-workspace/testing/004-billing-t02.md).
T03 añade UT-MONEY-01/UT-TAX-01 ejecutados: dinero, impuestos y política real API. RF2/RF3 parciales hasta composición/validación completa T04; el párrafo T02 describe su cierre histórico. [Evidencia T03](../ai-workspace/testing/004-billing-t03.md).
T04 completa RF1..4 en el motor puro mediante UT-INPUT-004, UT-QUOTE-004 y UT-PROP-01. Presupuesto, límites completos, errores, invariantes y no mutación probados. Regresión global/cierre T05 pendientes; los estados parciales anteriores son históricos. [Evidencia T04](../ai-workspace/testing/004-billing-t04.md).
