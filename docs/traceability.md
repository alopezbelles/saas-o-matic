# Trazabilidad

## Entrega 010 — T01

RF1/RF2/RF3 parciales: README técnico con necesidades/decisiones/SDD/IA, cuatro capturas reales y comando db:demo:setup para DB nueva. IT-DEMO-010 añade tres casos de persistencia/importes/snapshots, CLI y protección de destinos/rutas. 276 pruebas globales correctas; lint/typecheck/formato/build pasan. [Comandos, incidencias, capturas y límites](../specs/010-delivery/validation.md#t01--readme-técnico-y-demo-reproducible). T02–T05 y aceptación humana pendientes; ai-workspace excluido. No se acredita todavía instalación limpia.

## Calidad 009 — Cierre T05

RF1–RF6 conformes técnicamente dentro del alcance acordado. 273 pruebas globales y 36 E2E Chromium correctas, sin fallos esperados. Lint, TypeScript, formato, compilación y documentos pasan. 009-QA-01 resuelto; base de desarrollo sin cambios y recursos temporales cerrados/limpiados. FX real conserva la evidencia puntual de T02; el cierre usa fixtures. [Matriz final, comandos, resultados y límites](../specs/009-quality/validation.md#t05--verificación-final-y-cierre-técnico). Aceptación humana final pendiente. README definitivo, auditoría de entrega, checkout limpio y publicación corresponden a 010. Los registros siguientes conservan su alcance histórico.

## Calidad 009 — T04

009-QA-01 resuelto técnicamente mediante ajuste local de texto largo en el simulador y su confirmación. Cuatro regresiones con el mismo cliente largo pasan sin fallos esperados; las 14 pruebas visuales existentes también pasan. RF2 conforme dentro del alcance Chromium documentado. [Corrección, resultados y límites](../specs/009-quality/validation.md#t04--corrección-y-regresiones). T05 y aceptación humana final pendientes. Los apartados anteriores de ejecución se conservan como historial.

## Calidad 009 — T03

RF2 revisado mediante QA-A11Y-009 y VISUAL-007/008, con teclado/foco, asociaciones, contraste, cuatro anchos, estados y ampliación. Veredicto CAMBIOS NECESARIOS por 009-QA-01, desbordamiento del simulador con companyName válido de 200 caracteres. Cuatro regresiones esperadas documentan el fallo. [Reproducción y medidas](../specs/009-quality/validation.md#t03--accesibilidad-y-responsive). T03 se cierra como revisión y T04 debe resolver el defecto antes de declarar conforme RF2.

## Calidad 009 — T02

RF3 comprobado en escenarios de recuperación/transacciones, RF5 conforme en revisión básica de seguridad y RF6 comprobado mediante proveedor real desde Chromium. RF1/RF4 siguen pendientes de cierre global. 270 pruebas funcionales y 32 E2E correctas. [QA-FLOW-009, QA-RESILIENCE-009, QA-SECURITY-009 y QA-FX-LIVE-009](../specs/009-quality/validation.md#t02--flujos-resiliencia-seguridad-y-fx-real). La validación detalla límites, fuentes, una primera consulta bloqueada por el sandbox y la repetición correcta. Aceptación humana final pendiente.

## Calidad 009 — T01

RF1/RF4 parciales, inventario de scripts/suites, entorno aislado y matriz del enunciado → implementación → pruebas → resultado. Descubrimiento de 31 Playwright en 8 archivos y un flujo representativo correcto con API/Vite/SQLite temporal. La matriz distingue ejecución actual, cobertura histórica de 008, comprobaciones pendientes y entregables de 010. [QA-ENV-009 y QA-MATRIX-009](../specs/009-quality/validation.md#t01--inventario-entorno-y-matriz). T02–T05 y aceptación humana final pendientes. Registro ai-workspace excluido.

## Simulador 008 — Cierre T05

RF1–RF5 conformes técnicamente en el alcance comprobado mediante suites de consumos/configuración, guardado/discrepancia, FX e historial y el flujo E2E alta→ficha→simulación→resultado→historial. 273 pruebas globales y 31 Playwright correctas, ocho nuevas de T05. VISUAL-008 añade cuatro anchos/estados, teclado/foco, contraste y layout ampliado/reflujo. [Resultados y límites](../specs/008-simulator-ui/validation.md#t05--flujo-comercial-revisión-visual-y-cierre-global). Aceptación humana final pendiente. Entradas siguientes conservan el contexto de cierres parciales.

## Simulador 008 — T04

RF3 completa integración con historial consultado de nuevo, actualización explícita, retorno paginado y comprobación de resultado incierto en otra pestaña. RF4 conserva EUR y RF5 mantiene el aviso de discrepancia en ficha, actualización y recarga. WEB-HISTORY-008 incluye validación de estado y tres E2E con API/SQLite temporales, conservando el borrador y evitando reenvíos automáticos. [Validación T04](../specs/008-simulator-ui/validation.md#t04--integración-con-historial-y-recuperación). Revisión global y aceptación humana final pendientes.

## Simulador 008 — T03

RF3 conforme para POST exacto, envío único, resultado, errores/retención e incertidumbre sin reintentos automáticos; integración contextual completa del historial pendiente de T04. RF5 conforme en comparación y proyección del DTO autoritativo incluso con versiones nuevas. RF4 incorpora conversión del total confirmado y guardado EUR ante fallo FX. WEB-SAVE-008/WEB-POLICY-008, pruebas de saved-result y cuatro E2E reales con SQLite aislado. [Validación T03](../specs/008-simulator-ui/validation.md#t03--guardado-autoritativo-y-discrepancias). Sin registros ai-workspace ni aceptación humana final.

## Simulador 008 — T02

RF1/RF2 conformes para preview local: límites y motor compartido con oráculos, sin cargos por plan/storage/API. RF4 parcial: selector y total convertido, fechas/atribución, error/caducidad/reintento/carreras; resultado confirmado pendiente de T03. RF3/RF5 no implementados. WEB-SIM-01/02, WEB-FX-008 y tres E2E específicas verifican funcionalidades y geometría responsive. [Validación T02](../specs/008-simulator-ui/validation.md#t02--preview-desglose-y-conversión). Sin ai-workspace por indicación de Alex ni aceptación humana final.

## Simulador 008 — T01

RF1/RF2 parciales: inputs/configuración/navegación verificados, sin preview monetario ni POST. WEB-SIM-01/02, WEB-CONFIG-008 y dos E2E reales comprueban fronteras, contrato/compatibilidad, estado/retorno y país no soportado. RF3–RF5 siguen pendientes de tareas posteriores. [Validación T01](../specs/008-simulator-ui/validation.md#t01--pantalla-clienteconfiguración-e-inputs). Registro ai-workspace excluido por Alex; conformidad técnica distinta de aceptación humana.

## Clientes UI 007 — Cierre T05

| RF  | Evidencia final                                                                                                           |
| --- | ------------------------------------------------------------------------------------------------------------------------- |
| RF1 | E2E listado/búsqueda/paginación/atrás/adelante/retorno y suites WEB-SEARCH/API                                            |
| RF2 | E2E fiscal incorrecto→corrección→201 persistido→ficha/recarga/duplicado y WEB-FORM                                        |
| RF3 | E2E historial guardado 20/1, 503 independiente/reintento/recarga, vacíos/404 y WEB-DETAIL                                 |
| RF4 | E2E estado URL/retorno y regresiones de carreras/abortos conservadas                                                      |
| RF5 | VISUAL-007: tres pantallas/cuatro anchos, layout 200 %, teclado/foco/contraste y regresión de foco elegido durante espera |

Conformidad técnica RF1–RF5 dentro del alcance comprobado; 209 pruebas globales + 11 E2E ejecutadas por separado. [Validación final](../specs/007-customers-ui/validation.md#t05--e2e-real-revisión-visual-y-cierre-global), [revisión](../ai-workspace/reviews/007-customers-ui-t05.md). Límites de Chromium/zoom/contraste explícitos; aceptación humana final pendiente. Entradas siguientes conservan estados de sus fases históricas.

## Clientes UI 007 — T04

RF2 completa navegación alta→ficha real; RF3/RF4 conformes en pruebas incrementales de lectura/estados/carreras. RF5 añade tarjetas e historial responsive; revisión global T05 pendiente. WEB-DETAIL-API-01/WEB-DETAIL-01/WEB-STATE-01 y navegador real verifican ID inválido/404, historial vacío/fuera de rango, reintentos independientes, URL/retorno, aborto/respuestas antiguas e importes EUR históricos sin recálculo. [Validación](../specs/007-customers-ui/validation.md#t04--ficha-e-historial-persistido), [pruebas](../ai-workspace/testing/007-customers-ui-t04.md), [revisión](../ai-workspace/reviews/007-customers-ui-t04.md).

## Clientes UI 007 — T03

RF2 conforme para el alta y su destino de éxito; ficha completa pendiente de T04. RF5 amplía estados, formularios y foco. WEB-API-02, WEB-FORM-01 y pruebas de navegación verifican configuración, cinco campos, 201, 422/409/503, red/timeout/201 ilegible, conservación de valores y envío único. Smoke Chromium comprueba persistencia real, validación fiscal y duplicado sobre SQLite temporal. [Validación](../specs/007-customers-ui/validation.md#t03--alta-integrada-y-recuperación-segura), [pruebas](../ai-workspace/testing/007-customers-ui-t03.md).

## Clientes UI 007 — T02

RF1 y parte de RF4 de listado probados con adaptador GET, búsqueda/paginación URL, latest-wins y retorno contextual. RF5 parcial con tabla/card responsive y navegación. RF2/RF3 y carreras de ficha/historial siguen pendientes de T03/T04. [Validación](../specs/007-customers-ui/validation.md#t02--adaptador-api-listado-y-búsqueda), [pruebas](../ai-workspace/testing/007-customers-ui-t02.md) y [revisión](../ai-workspace/reviews/007-customers-ui-t02.md).

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
