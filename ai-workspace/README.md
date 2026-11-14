# Desarrollo asistido por IA — SaaS-O-Matic

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
- [ADR-003](decisions/ADR-003-preview-fx.md) es propuesta de funcionalidades futuras, no evidencia de implementación.
- Las fuentes oficiales completas de producto no están en este repositorio; no se certifica revisión de materiales ausentes.

## Organización

- [decisions](decisions/README.md): razones y consecuencias arquitectónicas; docs/decisions es el índice operativo de decisiones.
- [prompts](prompts/README.md): instrucciones técnicas estructuradas con procedencia y momento de redacción explícitos.
- [iterations](iterations/README.md): relato de cambios, incidencias y comprobaciones.
- [testing](testing/README.md): resúmenes y salidas conservadas, sin duplicar validaciones.
- [reviews](reviews/README.md): revisiones técnicas; aceptación humana distinguida.
- [visuals](visuals/README.md): sin capturas de aplicación registradas; no necesarias para esta retrospectiva.
- [templates](templates/README.md): ayudas vacías, nunca evidencia.

El [antecedente importado de planificación](reviews/planning-document-review.md) describe otro paquete. Sus cifras y comprobaciones no se han verificado aquí ni acreditan el estado actual.
