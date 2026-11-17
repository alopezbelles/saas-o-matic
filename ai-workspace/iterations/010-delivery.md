# 010 — Iteraciones de entrega

## T01 — Retrospectiva posterior

Registro creado el 17 de noviembre de 2026 en T02, después de T01. Fuente: [validación T01](../../specs/010-delivery/validation.md#t01--readme-técnico-y-demo-reproducible). El README se reorganizó con arquitectura/decisiones, necesidades, SDD/IA e inicio rápido. Se implementó demo:setup con destino nuevo explícito y servicios existentes, conservando el seed histórico. Se generaron cuatro capturas reales con API/SQLite temporal.

Incidencias conservadas: la primera prueba de helper rechazó una resolución de ruta sin contexto de test; se corrigió la comparación con la ruta absoluta predeterminada. El primer formateo incluyó .env.example, sin parser Prettier; se retiró de esa invocación y se normalizó LF. Tres pruebas nuevas y 276 globales pasaron; los importes esperados fueron independientes del motor. T01 no fue un ensayo de instalación limpia.

## T02 — Registro durante ejecución

Alex solicita ejecutar la tarea cuyo alcance es actualizar ai-workspace; se autoriza dicho registro sin reescribir el alcance histórico. [Autorización](../../docs/approvals.md) e [instrucción previa](../../specs/010-delivery/plan.md#t02--auditoría-enlazada-y-procedencia).

Objetivo: recorrido actual comprensible y trazable. Se añaden índices de instrucciones, síntesis de iteración 008/009/010, inventario de evidencias y revisión documental; se enlazan capturas ya conservadas. Las decisiones permanecen en aclaraciones/docs canónicos; no se crea un ADR sin decisión nueva. No se copian mensajes de análisis/adaptación excluidos ni se inventan sesiones de Product.

Verificación propia de T02: enlaces y formato documental, sin repetir suites de producto o consulta FX. Resultados actuales en [validación T02](../../specs/010-delivery/validation.md#t02--índice-y-evidencia-del-desarrollo-asistido). T03–T05 y aceptación humana pendientes; sin instalación limpia, publicación o modificación de datos.
