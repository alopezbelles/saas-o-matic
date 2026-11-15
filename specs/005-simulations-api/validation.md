# Validación 005

Estado: preparación documental adaptada; implementación NO INICIADA. Ningún RF implementado ni prueba funcional ejecutada de 005.

## Matriz prevista

| RF      | Tareas             | Casos previstos                                | Resultado funcional real |
| ------- | ------------------ | ---------------------------------------------- | ------------------------ |
| 005-RF1 | T01, T02, T03, T05 | UT-SIM-CONTRACT-005, IT-SIM-01, IT-SIM-02      | NO EJECUTADO             |
| 005-RF2 | T01, T02, T03, T05 | UT-SIM-CONTRACT-005, IT-INVALID-005, IT-SIM-02 | NO EJECUTADO             |
| 005-RF3 | T01, T04, T05      | IT-HIST-01, IT-SNAPSHOT-005                    | NO EJECUTADO             |
| 005-RF4 | T01, T02, T04, T05 | IT-SNAPSHOT-005, IT-CONFIG-005                 | NO EJECUTADO             |

Criterios concretos en [plan](plan.md), contratos en [spec](spec.md). Las pruebas anteriores de 002/003/004 no acreditan endpoints de simulaciones ya implementados.

## Casos indispensables al implementar

- Alta ES 15/51 usuarios: bases 14000/42500, impuestos 2940/8925 y totales 16940/51425 céntimos. Todos los consumos, versiones y snapshots guardados.
- Cero, máximos/máximo+1 y tipos incorrectos; campos extra de importe, tasa, país, plan, fecha, id y versiones rechazados.
- UUID/query/JSON/protocolo, cliente ausente, país sin tarifa, DB no disponible/busy, configuración inválida y error interno sanitizado.
- Transacción de cliente/cálculo/snapshots coherente, rollback real y reapertura. Dos POST deliberados generan dos registros; no prometer idempotencia.
- Histórico paginado con total, empate de fecha, offset fuera de página, cliente sin registros y cliente ausente.
- Cambiar cliente/política fixture sin alterar históricos; GET devuelve snapshots guardados y no llama al motor.
- GET /billing-config completo, sin DB, no-store y coincidente con fuentes reales del cálculo.
- Regresiones de health, clientes, persistencia y motor. Sin DB de desarrollo ni demo real.

No usar tasas sintéticas extremas como políticas de producto ni ampliar CHECK 0..10000 por esas pruebas.

## Revisión documental de preparación

Alcance autorizado: adaptar exclusivamente los cinco archivos de esta carpeta. Tres decisiones confirmadas por Alex: configuración completa, DTO/snapshots e historial paginado, errores/reintentos. [Detalle](clarifications.md).
Sin implementación, dependencias, commits ni registros en ai-workspace. Contexto global/gate siguen en 004 hasta iniciar T01.
Controles reales de esta adaptación: .\node_modules\.bin\prettier.cmd --check specs/005-simulations-api devuelve 0 (cinco documentos conformes); pnpm.cmd test:docs devuelve 0 (2 tests documentales pasan). Se formatearon previamente solo estos cinco documentos con Prettier.
El gate de contexto aún comprueba 004 porque T01 no ha comenzado; su PASS no acredita activación ni implementación de 005. No se ejecutaron lint/typecheck/build/tests funcionales por esta modificación exclusivamente documental. No confundir estos controles con la matriz funcional.

## Registro futuro

Por tarea: fecha, versión identificable, comandos exactos, códigos/salidas, casos, fallos, límites y revisión técnica. Evidencia real, sin marcar PASS por inspección o planificación.
Actualizar solo registros permitidos por Alex; ai-workspace excluido expresamente de esta preparación. La aceptación humana de la entrega requiere confirmación posterior y se distingue del cierre técnico.
