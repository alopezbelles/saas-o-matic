# Aclaraciones 005

Preparación documental únicamente; no autorización de implementación ni registro en ai-workspace.

## Decisiones heredadas, ya resueltas

| ID      | Decisión                                                                                         | Procedencia                                                |
| ------- | ------------------------------------------------------------------------------------------------ | ---------------------------------------------------------- |
| D01/D10 | demo-standard-v1: ES 21%, FR 20%, DE 19%, GB 20%; céntimos/BigInt y half-up sobre base completa. | [004](../004-billing/clarifications.md).                   |
| D04     | users 0..1000, storageGb 0..10000, apiCalls 0..10000000, enteros; solo users genera coste.       | [Decisiones](../../docs/decisions.md) y shared existentes. |
| D05     | Guardar EUR sin FX, histórico inmutable.                                                         | [002](../002-persistence/clarifications.md).               |
| 004-C03 | 005 integra API y guardado; 006 conversión visual.                                               | Alcance acordado en 004.                                   |

No reabrir las antiguas propuestas de millones de usuarios ni proveedor fiscal completo.

## Decisiones confirmadas por Alex durante esta adaptación

| ID      | Decisión                                                                                                                                                                                                             | Estado      |
| ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| 005-C01 | Incluir GET /billing-config completo: EUR, versiones, tramos, tasas por país y límites; sin DB.                                                                                                                      | Confirmada. |
| 005-C02 | DTO de alta/histórico con consumos, importes, tasa, versiones, desglose y snapshots de nombre/fiscal/país/plan. Historial limit/offset como clientes; 404 cliente ausente y lista vacía si no tiene registros.       | Confirmada. |
| 005-C03 | Errores coherentes con 003: 400 JSON/ID/query, 422 consumos/extras/país no soportado, 404 cliente ausente, 503 DB y 500 fallos internos/configuración. Sin reintento automático ni deduplicar guardados deliberados. | Confirmada. |

Confirmaciones recibidas antes de consolidar estos archivos. No son aceptación de código ni de una entrega implementada.

## Precisiones técnicas de adaptación

Nombres exactos y ejemplos de contratos en [spec](spec.md); firmas/capas y pruebas en [plan](plan.md). Estas precisiones son diseño técnico del agente dentro del contrato confirmado, no nuevas respuestas literales atribuidas a Alex.
Contratos en shared, tests node:test existentes, conexión lazy y errores sanitizados; sin dependencias o esquema nuevos.
DTO taxRateBps conserva nombre de persistencia; adapter convierte rateBps del motor y breakdownJson en array público.
POST no anuncia un recurso de detalle inexistente; configuración no-store y reglas/versiones obtenidas de una única fuente.
Una transacción coherente incluye cliente, cálculo y snapshots. insertSimulation ya es transaccional; reutilizar mediante savepoint si hay transacción exterior, no duplicar SQL ni snapshots.
Tasas demo compatibles con CHECK 0..10000 de persistencia; políticas sintéticas extremas solo para tests del motor, sin ampliar DB.

## Decisiones pendientes y autorización

No quedan decisiones de producto abiertas para preparar estas tareas. Si al implementar surge una necesidad real de migración, dependencia, servicio o cambio de contrato, proponerla antes de ejecutar.
Esta autorización solo adapta los cinco documentos. Esperar indicación para implementar T01 y después cada tarea. Sin ai-workspace hasta que Alex lo solicite; no commits/pushes.
