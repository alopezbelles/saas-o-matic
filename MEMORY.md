# Estado del proyecto

- Spec activa: [003-customers-api](specs/003-customers-api/spec.md), autorizada para implementar por Alex.
- 001 infraestructura y 002 persistencia se conservan; [validación 002](specs/002-persistence/validation.md) es histórica.
- 003 añade alta de cinco campos, validación fiscal, búsqueda paginada, detalle, errores sanitizados y proveedor DB lazy.
- Nueva migración 0001_optional_contact permite contact_name nulo conservando datos existentes; no se ejecuta sobre DB del usuario.
- Sin endpoint de simulaciones, motor monetario, frontend de clientes ni políticas tributarias.
- T01–T06 completadas técnicamente; 32 pruebas pasan (incluye regresiones anteriores). Sin aceptación humana final.
- Pruebas y tareas actuales en [validación 003](specs/003-customers-api/validation.md); no atribuir resultados antes de ejecutarlos.
- [Instrucción previa de trabajo](ai-workspace/prompts/003-customers-api.md) y [registro durante desarrollo](ai-workspace/iterations/003-customers-api.md). No se registran los mensajes de análisis/adaptación excluidos expresamente por Alex.
- No commits/pushes ni aceptación humana final realizados por el agente.
