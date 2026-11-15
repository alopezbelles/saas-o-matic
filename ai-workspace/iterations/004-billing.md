# 004 — Preparación de la especificación

15 de noviembre de 2026. Registro retrospectivo de las decisiones de preparación, creado por autorización posterior de Alex. No transcripción literal ni implementación.

## Contexto y objetivo

001, 002 y 003 ofrecen infraestructura, persistencia y clientes. El motor de importes no está implementado.
La plantilla 004 contenía referencias a paquetes inexistentes, límites antiguos y propuestas de integración ajenas al motor. Se pidió adaptar primero la documentación y decidir incrementalmente.

## Decisiones e iteraciones relevantes

1. Ubicar dominio en shared, preservando API como consumidor y sin nuevos paquetes.
2. Incluir ES/FR/DE/GB mediante política única; aceptar explícitamente alcance fiscal demo.
3. Fijar céntimos, BigInt y half-up sobre impuesto de base completa.
4. Reservar integración/guardado para 005 y FX para 006.
5. Reutilizar límites de 002; validar tres consumos sin tarifas secundarias.
6. Definir entrada explícita y salida con desglose y versiones para trazabilidad histórica.
7. Consolidar errores, identificador users-tiered-v1 y plan de pruebas progresivas. Son precisiones técnicas de revisión, no nuevos precios.

[Decisiones canónicas](../../specs/004-billing/clarifications.md) y [ADR](../decisions/ADR-005-billing-engine.md).

## Cambios de esta consolidación

Reescribir spec/plan/tasks para eliminar estados y referencias obsoletas; preservar estado de implementación pendiente. Actualizar memoria, autorizaciones, reglas y trazabilidad contextual.
Añadir [reformulaciones técnicas](../prompts/004-billing.md), esta iteración, ADR y revisión documental. No añadir capturas, resultados de motor ni registros vacíos.
Se detectó que un script supuesto scripts/test-unit.mjs no existe; la planificación final usa los scripts reales de package.json, sin crear ese archivo.
El comprobador documental aún identifica 003 mediante expresión fija; al implementar T01 se revisará ese gate para comprobar la spec activa 004 sin confundir referencia histórica con contexto vigente.

## Validación y límites

[Revisión documental](../reviews/004-billing-planning.md) y [validación canónica](../../specs/004-billing/validation.md).
No código, dependencias instaladas, DB ni commits. Ninguna prueba monetaria ejecutada.
Los 2 tests documentales pasan; el control global de formato informa 46 archivos ajenos a la revisión con avisos. Se documenta la incidencia sin reformatear código ni otras entregas.
Siguiente paso: T01 cuando Alex indique empezar; registrar desde entonces las instrucciones y verificaciones durante cada tarea.

## T01 — Implementación autorizada y registro durante el trabajo

15 de noviembre de 2026, después del commit documental 06fd82b. Alex autorizó T01. Se preparó una instrucción técnica antes de modificar código, añadida en prompts/004-billing.md; esta sección registra la ejecución y no modifica la procedencia retrospectiva de la preparación anterior.
Se añadieron fixtures y cinco pruebas de integridad, runner shared y encadenamiento test:unit raíz conservando API. Se corrigió el gate de contexto para exigir la spec activa 004 y su archivo. No se implementaron funciones de cálculo.
La shell no encontraba Node en PATH; se utilizó la instalación existente en C:\Program Files\nodejs y el pnpm local mediante PATH de proceso. Sin instalación ni cambios personales.
Lint/typecheck pasan; unitarios 5 shared + 3 API y 2 documentales pasan. Formato global falla en 43 archivos externos; comparación con Prettier confirma que son diferencias exclusivas CRLF/LF. No se corrigieron fuera de alcance.
[Evidencia](../testing/004-billing-t01.md) y [revisión técnica](../reviews/004-billing-t01.md). T01 cerrada en su alcance, RF del motor pendientes. Sin DB ni commits. Siguiente paso: T02 por indicación de Alex.
