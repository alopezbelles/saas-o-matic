# Estado del proyecto

- Spec activa: [004-billing](specs/004-billing/spec.md), T01–T04 completadas técnicamente; esperar indicación para T05. Motor y presupuesto completo implementados; cierre global pendiente.
- Decisiones 004: motor puro en shared, política demo ES/FR/DE/GB, céntimos/BigInt/half-up, límites de 002 y contratos con desglose/versiones. Sin HTTP, DB, UI ni FX en 004.
- [Plan 004](specs/004-billing/plan.md), [tareas](specs/004-billing/tasks.md), [registro de preparación](ai-workspace/iterations/004-billing.md). Prompts de preparación reformulados retrospectivamente por autorización posterior; no conversación literal.
- Revisión documental 004: 2 tests de docs pasan; Prettier global falla en 46 archivos ajenos a la revisión. No corregidos ni gates funcionales ejecutados. Ver [revisión](ai-workspace/reviews/004-billing-planning.md).
- Validación T01 posterior: lint/typecheck pasan; 5 tests fixtures + 3 API y 2 docs pasan. Prettier global sigue fallando en 43 archivos ajenos (CRLF/LF), sin corrección masiva. [Evidencia T01](ai-workspace/testing/004-billing-t01.md). Sin RF monetarios implementados ni aceptación humana final.
- 001 infraestructura y 002 persistencia se conservan; [validación 002](specs/002-persistence/validation.md) es histórica.
- 003 añade alta de cinco campos, validación fiscal, búsqueda paginada, detalle, errores sanitizados y proveedor DB lazy.
- Nueva migración 0001_optional_contact permite contact_name nulo conservando datos existentes; no se ejecuta sobre DB del usuario.
- Sin endpoint de simulaciones ni frontend de clientes. Motor completo en shared, política demo-standard-v1 en API; sin integración HTTP/DB/FX.
- T04: lint/typecheck, 30 unitarios (25 shared, 5 API), 2 documentales, formato acotado y diff pasan; RF1..4 implementados/probados en motor puro. Formato global falla en 41 archivos ajenos; cierre y regresión global T05 pendientes. [Evidencia T04](ai-workspace/testing/004-billing-t04.md).
- T03: lint/typecheck, 21 unitarios (16 shared, 5 API), 2 documentales, formato acotado y diff check pasan. Formato global falla en 41 archivos ajenos. [Evidencia T03](ai-workspace/testing/004-billing-t03.md). RF2/RF3/RF4 parciales hasta T04.
- T02: lint/typecheck, 13 unitarios, 2 documentales, formato acotado y diff check pasan; RF1 implementado, RF3/RF4 parciales (tramos). Formato global falla en 42 archivos ajenos. [Evidencia T02](ai-workspace/testing/004-billing-t02.md).
- 003: T01–T06 completadas técnicamente; 32 pruebas pasaron en su cierre (incluye regresiones anteriores). Sin aceptación humana final.
- Pruebas y tareas actuales en [validación 003](specs/003-customers-api/validation.md); no atribuir resultados antes de ejecutarlos.
- [Instrucción previa de trabajo](ai-workspace/prompts/003-customers-api.md) y [registro durante desarrollo](ai-workspace/iterations/003-customers-api.md). No se registran los mensajes de análisis/adaptación excluidos expresamente por Alex.
- No commits/pushes ni aceptación humana final realizados por el agente.
