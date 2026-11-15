# Estado del proyecto

- Spec activa: [004-billing](specs/004-billing/spec.md), preparación documental consolidada; implementación por tareas todavía no iniciada. Esperar indicación para T01.
- Decisiones 004: motor puro en shared, política demo ES/FR/DE/GB, céntimos/BigInt/half-up, límites de 002 y contratos con desglose/versiones. Sin HTTP, DB, UI ni FX en 004.
- [Plan 004](specs/004-billing/plan.md), [tareas](specs/004-billing/tasks.md), [registro de preparación](ai-workspace/iterations/004-billing.md). Prompts de preparación reformulados retrospectivamente por autorización posterior; no conversación literal.
- Revisión documental 004: 2 tests de docs pasan; Prettier global falla en 46 archivos ajenos a la revisión. No corregidos ni gates funcionales ejecutados. Ver [revisión](ai-workspace/reviews/004-billing-planning.md).
- 001 infraestructura y 002 persistencia se conservan; [validación 002](specs/002-persistence/validation.md) es histórica.
- 003 añade alta de cinco campos, validación fiscal, búsqueda paginada, detalle, errores sanitizados y proveedor DB lazy.
- Nueva migración 0001_optional_contact permite contact_name nulo conservando datos existentes; no se ejecuta sobre DB del usuario.
- Sin endpoint de simulaciones, motor monetario ni frontend de clientes implementados. Política demo 004 acordada, todavía no implementada.
- T01–T06 completadas técnicamente; 32 pruebas pasan (incluye regresiones anteriores). Sin aceptación humana final.
- Pruebas y tareas actuales en [validación 003](specs/003-customers-api/validation.md); no atribuir resultados antes de ejecutarlos.
- [Instrucción previa de trabajo](ai-workspace/prompts/003-customers-api.md) y [registro durante desarrollo](ai-workspace/iterations/003-customers-api.md). No se registran los mensajes de análisis/adaptación excluidos expresamente por Alex.
- No commits/pushes ni aceptación humana final realizados por el agente.
