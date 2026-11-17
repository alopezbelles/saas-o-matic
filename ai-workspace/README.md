# Desarrollo asistido por IA — SaaS-O-Matic

## Recorrido actual para el evaluador

Actualizado el 17 de noviembre de 2026, iniciado en 010-T02 y cerrado técnicamente en T05. El registro de 008/009/010-T01 se incorpora después de su ejecución y se etiqueta como retrospectivo. La autorización de T02 permite esta actualización, sin convertir los mensajes excluidos en prompts publicables. No hay aceptación humana final registrada.

| Spec/estado técnico         | Planificación e instrucciones                                                                                                                                                                             | Iteración y evidencia                                                                                                                         |
| --------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| 008 completada              | [Spec](../specs/008-simulator-ui/spec.md), [decisiones](../specs/008-simulator-ui/clarifications.md), [tasks](../specs/008-simulator-ui/tasks.md), [índice de instrucciones](prompts/008-simulator-ui.md) | [Retrospectiva](iterations/008-simulator-ui.md), [validación canónica](../specs/008-simulator-ui/validation.md)                               |
| 009 completada              | [Spec](../specs/009-quality/spec.md), [decisiones](../specs/009-quality/clarifications.md), [tasks](../specs/009-quality/tasks.md), [índice de instrucciones](prompts/009-quality.md)                     | [Defecto y corrección](iterations/009-quality.md), [validación canónica](../specs/009-quality/validation.md)                                  |
| 010 completada técnicamente | [Spec](../specs/010-delivery/spec.md), [decisiones](../specs/010-delivery/clarifications.md), [tasks](../specs/010-delivery/tasks.md), [instrucciones/procedencia](prompts/010-delivery.md)               | [Iteración](iterations/010-delivery.md), [validación](../specs/010-delivery/validation.md), [revisión final T05](reviews/010-delivery-t05.md) |

1. **Planificación:** specs/planes/tareas enlazados y requisitos del enunciado en la [matriz de 009](../specs/009-quality/validation.md#qa-review-009--matriz-final-del-enunciado).
2. **Arquitectura:** [explicación de decisiones](../README.md#arquitectura-y-decisiones-de-software), [modelo](../docs/data-model.md), [constitución](../docs/constitution.md) y aclaraciones por spec.
3. **Iteración y calidad:** retrospectivas anteriores, [inventario de resultados](testing/008-010-evidence-index.md), [capturas reales](visuals/010-delivery.md) y revisiones con límites explícitos.

Codex se utilizó para implementación/ejecución; ChatGPT Work con Product para diseño general, según declaración de Alex. No se conserva aquí un hilo original de Product. Los bloques siguientes recogen incorporaciones anteriores y sus cifras pertenecen a sus versiones; no describen funciones todavía pendientes en el producto actual.

Estado de CORS: 006 tuvo una comprobación inconclusa; [009-T02](../specs/009-quality/validation.md#qa-fx-live-009) observó después respuesta real/CORS desde Chromium local. No garantiza un dominio de producción. El enunciado y interfaces.pdf fueron aportados y consultados; siguen siendo fuentes externas, sin copiar los PDF privados a este índice.

## Incorporaciones anteriores

## 007 — Cierre técnico T05

[Instrucción previa](prompts/007-customers-ui.md#t05--instrucción-previa-de-implementación), [iteración](iterations/007-customers-ui.md#t05--inicio), [pruebas y reportes originales](testing/007-customers-ui-t05.md), [revisión final](reviews/007-customers-ui-t05.md), [capturas](visuals/007-customers-ui-t05.md) y [validación canónica](../specs/007-customers-ui/validation.md#t05--e2e-real-revisión-visual-y-cierre-global). 209 pruebas globales y 11 E2E correctas. Correcciones reales de contraste/foco documentadas, con límites de navegador/zoom/accesibilidad. Aceptación humana final no registrada; entradas siguientes conservan estados históricos.

## 007 — Ficha e historial T04

[Instrucción previa](prompts/007-customers-ui.md#t04--instrucción-previa-de-implementación), [iteración](iterations/007-customers-ui.md#t04--inicio), [pruebas y salida global](testing/007-customers-ui-t04.md), [revisión](reviews/007-customers-ui-t04.md) y [capturas](visuals/007-customers-ui-t04.md). 208 pruebas globales y smoke real con API/SQLite temporal correctos. T05 y aceptación humana final pendientes. Entradas siguientes conservan resultados históricos.

## 007 — Alta integrada T03

[Instrucción previa](prompts/007-customers-ui.md#t03--instrucción-previa-de-implementación), [iteración](iterations/007-customers-ui.md#t03--inicio), [pruebas y log global](testing/007-customers-ui-t03.md), [revisión](reviews/007-customers-ui-t03.md) y [capturas](visuals/007-customers-ui-t03.md). 171 pruebas globales y smoke con API/SQLite temporal correctos. T04–T05 y aceptación humana final pendientes. Las entradas siguientes conservan resultados históricos de cada fase.

## 007 — Listado y búsqueda T02

[Instrucción previa](prompts/007-customers-ui.md#t02--instrucción-previa-de-implementación), [iteración](iterations/007-customers-ui.md#t02--inicio), [pruebas y log global](testing/007-customers-ui-t02.md), [revisión](reviews/007-customers-ui-t02.md) y [capturas](visuals/007-customers-ui-t02.md). 152 pruebas globales y smoke real con API/SQLite temporal correctos. T03–T05 y aceptación humana final pendientes.

## 007 — Base visual T01

Registro de progreso autorizado al iniciar T01 el 16 de noviembre de 2026. [Instrucción previa](prompts/007-customers-ui.md#t01--instrucción-previa-de-implementación), [iteración](iterations/007-customers-ui.md), [pruebas](testing/007-customers-ui-t01.md), [revisión](reviews/007-customers-ui-t01.md), [capturas reales](visuals/007-customers-ui-t01.md) y [validación canónica](../specs/007-customers-ui/validation.md). Las decisiones anteriores se resumen retrospectivamente y enlazan sus aclaraciones. T02–T05 pendientes de indicación; aceptación humana final pendiente.

## 006 — Infraestructura de conversión

Estado histórico de 006: T01–T05 completadas técnicamente, con CORS externo inconcluso y sin interfaz en aquella spec. La integración UI posterior está en 008 y la comprobación real local en 009; aceptación humana final pendiente. Registros creados después de T05 el 15 de noviembre de 2026 por autorización posterior: son retrospectivos, no conversación literal ni documentación contemporánea.

[Spec](../specs/006-currency/spec.md), [plan/instrucción previa](../specs/006-currency/plan.md#instrucción-técnica-previa), [prompts reformulados](prompts/006-currency.md), [iteración](iterations/006-currency.md), [ADR-006](decisions/ADR-006-currency-infrastructure.md), [pruebas](testing/006-currency.md), [salida real T05](testing/006-currency-t05.txt), [revisión](reviews/006-currency.md) y [validación canónica](../specs/006-currency/validation.md).

Las 122 pruebas corresponden a la ejecución funcional de T05. Esta incorporación documental no implica repetirlas. Incidencias y limitaciones se conservan sin convertirlas en resultados exitosos del proveedor.

## 005 — Preparación y contratos T01

**Estado final 005:** T01–T05 completadas técnicamente. [Verificación global](testing/005-simulations-api-t05.md), [salida](testing/005-simulations-api-t05.txt) y [revisión final](reviews/005-simulations-api-t05.md). Todos los controles globales pasan y 90 pruebas correctas; aceptación humana final no registrada. Párrafos de tareas anteriores conservan sus estados históricos.

T04: [instrucción previa](prompts/005-simulations-api.md#t04--instrucción-previa-de-implementación), [pruebas](testing/005-simulations-api-t04.md), [salida](testing/005-simulations-api-t04.txt) y [revisión](reviews/005-simulations-api-t04.md). Histórico y configuración implementados; T05 pendiente. Incidencia inicial de fixture registrada y corregida.

T03: [instrucción previa](prompts/005-simulations-api.md#t03--instrucción-previa-de-implementación), [pruebas](testing/005-simulations-api-t03.md), [salida](testing/005-simulations-api-t03.txt) y [revisión](reviews/005-simulations-api-t03.md). POST /simulations implementado; historial/configuración pendientes de T04.

T02: [instrucción previa](prompts/005-simulations-api.md#t02--instrucción-previa-de-implementación), [verificación](testing/005-simulations-api-t02.md), [salida](testing/005-simulations-api-t02.txt) y [revisión](reviews/005-simulations-api-t02.md). Servicio/guardado implementados con transacción coherente; endpoints pendientes de T03. Registro durante el trabajo, sin aceptación humana final.

[Spec](../specs/005-simulations-api/spec.md), [plan/instrucción previa](../specs/005-simulations-api/plan.md#instrucción-previa-para-t01), [decisiones](../specs/005-simulations-api/clarifications.md), [tareas](../specs/005-simulations-api/tasks.md) y [validación](../specs/005-simulations-api/validation.md).
[Prompts y procedencia](prompts/005-simulations-api.md), [iteración](iterations/005-simulations-api.md), [pruebas T01](testing/005-simulations-api-t01.md) y [revisión técnica](reviews/005-simulations-api-t01.md).
Registros creados el 15 de noviembre de 2026 por autorización posterior de Alex, después de T01 y antes del commit. Preparación/ejecución inicial excluyeron ai-workspace; ahora se documentan retrospectivamente. La instrucción de T01 sí se escribió en el plan antes del código y se enlaza como tal. Sin mensajes literales reconstruidos ni aceptación humana final. Solo contratos/parsers implementados; T02–T05 pendientes.

Índice para evaluar planificación, arquitectura, interacción y control de calidad.
001 y 002 están implementadas con validación técnica registrada. No hay aceptación humana final documentada.

## Procedencia de estos registros

Las retrospectivas y reformulaciones técnicas se redactaron el 14 de noviembre de 2026, después de desarrollar ambas specs.
Se basan en la conversación disponible en la sesión, archivos del repositorio y resultados conservados. No son registros contemporáneos ni una exportación íntegra del chat.
No se conocen horas individuales de todos los mensajes; no se reconstruyen timestamps ni revisiones personales.
Los registros de prompts elaboran técnicamente las solicitudes reales. Están identificados como reformulaciones retrospectivas y no como mensajes enviados literalmente.
El historial local identifica cbdd562 como entrega foundation y 9c03dc3 como entrega persistence. Estos registros documentales son posteriores a esos commits.

## Recorrido por spec

| Spec | Planificación canónica                                                                                                                                                                             | Interacción y decisiones                                                                                                                            | Evidencia y revisión                                                                                                                                                      |
| ---- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 001  | [Spec](../specs/001-foundation/spec.md), [plan](../specs/001-foundation/plan.md), [tareas](../specs/001-foundation/tasks.md)                                                                       | [Retrospectiva](iterations/001-foundation-retrospective.md), [prompts](prompts/001-foundation.md), [ADR-001](decisions/ADR-001-monorepo.md)         | [Resumen](testing/001-foundation.md), [validación original](../specs/001-foundation/validation.md), [revisión](reviews/001-foundation.md)                                 |
| 002  | [Spec/modelo](../specs/002-persistence/spec.md), [aclaraciones](../specs/002-persistence/clarifications.md), [plan](../specs/002-persistence/plan.md), [tareas](../specs/002-persistence/tasks.md) | [Retrospectiva](iterations/002-persistence-retrospective.md), [prompts](prompts/002-persistence.md), [ADR-002](decisions/ADR-002-sqlite-history.md) | [Resumen](testing/002-persistence.md), [salida real](testing/002-tests.txt), [validación](../specs/002-persistence/validation.md), [revisión](reviews/002-persistence.md) |

La especificación inicial de 001 llegó después del esqueleto técnico. Su retrospectiva explica esa secuencia; no se presenta todo el scaffolding como precedido por esa spec.
002 sí tuvo análisis, aclaraciones y documentación del modelo antes de la autorización de implementar.
Los documentos actuales pueden contener ajustes posteriores; no son copias inmutables de su versión inicial.

## Arquitectura y dirección de la IA

- [Arquitectura](../docs/architecture.md), [modelo](../docs/data-model.md), [decisiones](../docs/decisions.md), [contratos actuales](../docs/api-contracts.md).
- [Producto](../docs/product.md), [reglas](../docs/business-rules.md), [requisitos disponibles](../docs/requirements.md), [trazabilidad](../docs/traceability.md).
- [AGENTS.md](../AGENTS.md), [constitución](../docs/constitution.md), [procedimiento SDD](../docs/sdd-harness.md) y [alcance autorizado](../docs/approvals.md).
- [ADR-003](decisions/ADR-003-preview-fx.md) conserva una propuesta histórica; la implementación posterior se acredita con specs 004–008 y sus validaciones, no por ese ADR.
- Los PDF oficiales aportados se consultaron como fuentes externas; no están incluidos automáticamente en el repositorio. La matriz de 009 recoge el cotejo realizado.

## Organización

- [decisions](decisions/README.md): razones y consecuencias arquitectónicas; docs/decisions es el índice operativo de decisiones.
- [prompts](prompts/README.md): instrucciones técnicas estructuradas con procedencia y momento de redacción explícitos.
- [iterations](iterations/README.md): relato de cambios, incidencias y comprobaciones.
- [testing](testing/README.md): resúmenes y salidas conservadas, sin duplicar validaciones.
- [reviews](reviews/README.md): revisiones técnicas; aceptación humana distinguida.
- [visuals](visuals/README.md): capturas de 007 y enlaces a las pantallas actuales de 010, con procedencia; las retrospectivas iniciales de 001/002 no requerían imágenes.
- [templates](templates/README.md): ayudas vacías, nunca evidencia.

El [antecedente importado de planificación](reviews/planning-document-review.md) describe otro paquete. Sus cifras y comprobaciones no se han verificado aquí ni acreditan el estado actual.

## Implementación 003 — registro durante el trabajo

[Instrucción técnica previa](prompts/003-customers-api.md), [iteración](iterations/003-customers-api.md), [ADR-004](decisions/ADR-004-customers-api.md), [pruebas](testing/003-customers-api.md), [revisión](reviews/003-customers-api.md) y [validación](../specs/003-customers-api/validation.md).
Estos registros corresponden a la implementación autorizada; no reproducen los mensajes previos cuyo registro Alex excluyó.

## Preparación 004 — sin implementación

[Spec](../specs/004-billing/spec.md), [plan](../specs/004-billing/plan.md), [tareas](../specs/004-billing/tasks.md), [prompts reformulados](prompts/004-billing.md), [iteración de preparación](iterations/004-billing.md), [ADR-005](decisions/ADR-005-billing-engine.md), [revisión documental](reviews/004-billing-planning.md) y [validación](../specs/004-billing/validation.md).
Registros redactados el 15 de noviembre de 2026 por autorización posterior de Alex, después de aclarar las decisiones y antes de implementar. Son reformulaciones retrospectivas, no mensajes originales. La revisión documental no acredita pruebas del motor ni aceptación humana de una entrega.

### Ejecución incremental 004

T01: [instrucción previa](prompts/004-billing.md#t01--instrucción-previa-de-implementación), [iteración](iterations/004-billing.md), [pruebas](testing/004-billing-t01.md) y [revisión técnica](reviews/004-billing-t01.md). Fixtures y runner implementados; motor pendiente. Formato global con incidencia CRLF/LF en archivos ajenos, delimitada en la evidencia.

T02: [instrucción previa](prompts/004-billing.md#t02--instrucción-previa-de-implementación), [pruebas](testing/004-billing-t02.md) y [revisión](reviews/004-billing-t02.md). Base acumulativa y contrato básico implementados; impuestos y presupuesto completo pendientes.

T03: [instrucción previa](prompts/004-billing.md#t03--instrucción-previa-de-implementación), [pruebas](testing/004-billing-t03.md) y [revisión](reviews/004-billing-t03.md). Dinero e impuestos implementados; presupuesto completo pendiente de T04. Los párrafos anteriores describen sus cierres históricos.

T04: [instrucción previa](prompts/004-billing.md#t04--instrucción-previa-de-implementación), [pruebas](testing/004-billing-t04.md) y [revisión](reviews/004-billing-t04.md). Motor y presupuesto completo implementados; regresión/cierre global T05 pendientes.

T05: [verificación global](testing/004-billing-t05.md), [salida](testing/004-billing-t05.txt) y [revisión](reviews/004-billing-t05.md). 59 tests correctos, lint/typecheck/build correctos; cierre global pendiente de format:check (41 archivos ajenos con CRLF/LF). Aceptación humana final no registrada.

Corrección posterior autorizada: [normalización y cierre técnico](testing/004-billing-format-fix.md), [salida](testing/004-billing-format-fix.txt). T05 cerrada: formato global y demás controles pasan, 59 tests correctos. La incidencia anterior conserva su valor histórico; aceptación humana final pendiente.
