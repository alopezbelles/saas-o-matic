# Validación 004

Estado: T01–T03 completadas técnicamente; base, dinero e impuestos implementados. Presupuesto completo y cierre pendientes (T04/T05).

## Matriz de implementación futura

| RF  | Pruebas previstas                                                 | Resultado de código |
| --- | ----------------------------------------------------------------- | ------------------- |
| RF1 | UT-BILL-01 y marginales UT-PROP-01                                | PASA en T02         |
| RF2 | UT-TAX-01/UT-MONEY-01 pasan; composición pendiente                | PARCIAL en T03      |
| RF3 | Users, política, país y dinero probados; tres consumos pendientes | PARCIAL en T03      |
| RF4 | UT-PROP-01 (tramos); UT-QUOTE-004 pendiente                       | PARCIAL en T02      |

Detalle de oráculos, límites, tasas sintéticas, cero usuarios y errores en [plan](plan.md). UT-FIX-004 comprueba fixtures, no requisitos productivos.
No endpoints, SQLite, UI ni FX exigidos en 004. Conservar compatibilidad estructural con 002 sin escribir bases existentes.
No afirmar que el backend calcula ni que existe configuración HTTP al cerrar esta preparación.

## Revisión documental

15 de noviembre de 2026. Alcance: spec, decisiones, plan, tareas, contratos, documentación contextual y registros de planificación.
La revisión distingue decisiones funcionales acordadas, precisiones técnicas de consolidación e implementación futura.
Comandos y resultados documentales se enlazan desde [revisión de preparación](../../ai-workspace/reviews/004-billing-planning.md); no sustituyen tests del motor.
Los dos tests documentales pasan. El formato global todavía falla en 46 archivos ajenos a esta revisión; no se ha aplicado una corrección masiva. Resolver o delimitar esta incidencia antes de afirmar que los gates de implementación pasan.

## Registro durante implementación

### T01 — 15 de noviembre de 2026

Lint y typecheck pasan. test:unit pasa: 5 tests de coherencia de fixtures shared y 3 de API; test:docs pasa con 2 tests. Ningún RF monetario se marca implementado por estos resultados.
format:check global falla en 43 archivos ajenos a T01; diagnóstico comprobado CRLF/LF, sin corrección masiva. Tres archivos de los 46 originales se formatearon al modificarlos dentro de T01. Ver [evidencia y comandos](../../ai-workspace/testing/004-billing-t01.md), [salida](../../ai-workspace/testing/004-billing-t01.txt) y [revisión](../../ai-workspace/reviews/004-billing-t01.md).

### T02 — 15 de noviembre de 2026

calculateTieredBase, TierBreakdown/TieredBase y BillingError exportados desde shared. Cero usuarios, fronteras, desglose compatible con 002, rango completo, errores y aislamiento de resultados probados.
Lint/typecheck y 13 tests unitarios pasan. format:check global falla en 42 archivos ajenos: index.ts de shared se formateó al modificar sus exports, reduciendo el número anterior en uno.
[Evidencia y límites](../../ai-workspace/testing/004-billing-t02.md) y [revisión](../../ai-workspace/reviews/004-billing-t02.md). RF1 conforme técnicamente; no aceptación humana registrada.

### T03 — 15 de noviembre de 2026

Implementados helpers monetarios, calculateTax, TaxPolicy, validación/resolución fiscal y demo-standard-v1 congelada en API. tiers.ts reutiliza toSafeCents. Sin quote ni endpoint.
Test:docs pasa (2 tests); formato acotado y git diff --check pasan tras actualizar los registros.
Lint/typecheck y 21 unitarios pasan (16 shared, 5 API). Half-up, límites seguros, overflow, cero frente a ausencia, políticas inválidas y configuración real probados. Formato global falla en 41 archivos ajenos; apps/api/package.json se normalizó al conectar su test.
[Evidencia](../../ai-workspace/testing/004-billing-t03.md), [salida](../../ai-workspace/testing/004-billing-t03.txt) y [revisión](../../ai-workspace/reviews/004-billing-t03.md). RF2 parcial hasta composición/suma en T04; RF3 pendiente de consumos completos.

Por tarea: fecha, versión identificable, comandos exactos, códigos de salida, pruebas, incidencias y limitaciones. Enlazar ai-workspace sin duplicar salidas.
En T05 ejecutar controles completos y presentar casos ES 15/51 usuarios con bases 14000/42500, impuestos 2940/8925 y totales 16940/51425.
No rellenar evidencias anticipadamente. Aceptación humana de la entrega: no registrada.
