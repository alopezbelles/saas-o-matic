# Validación 005

Estado: T01–T04 completadas técnicamente; todos los endpoints de 005 implementados y probados. T05 pendiente de cierre global; sin aceptación humana final.

## Matriz de cumplimiento incremental

T04: RF1..4 conformes en pruebas incrementales. IT-HIST-01/IT-SNAPSHOT-005/IT-CONFIG-005 pasan por HTTP; cierre global T05 pendiente. Párrafos T02/T03 siguientes describen sus estados históricos.

T03: RF1/RF2 conformes en alta HTTP (IT-SIM-01/02, IT-INVALID-005, IT-LIFECYCLE-005). RF3 no ejecutado y RF4 parcial: conservación en servicio probada, configuración/historial HTTP pendientes.

T02: IT-SIM-01/02 e IT-SNAPSHOT-005 ejecutados en servicio con SQLite temporal. RF1/RF2/RF4 parciales: aún no hay POST/historial/configuración HTTP. Resultados de RF completos siguientes conservan NO EJECUTADO hasta esas tareas.

| RF      | Tareas             | Casos previstos                                | Resultado funcional real |
| ------- | ------------------ | ---------------------------------------------- | ------------------------ |
| 005-RF1 | T01, T02, T03, T05 | UT-SIM-CONTRACT-005, IT-SIM-01, IT-SIM-02      | PASA EN T03              |
| 005-RF2 | T01, T02, T03, T05 | UT-SIM-CONTRACT-005, IT-INVALID-005, IT-SIM-02 | PASA EN T03              |
| 005-RF3 | T01, T04, T05      | IT-HIST-01, IT-SNAPSHOT-005                    | PASA EN T04              |
| 005-RF4 | T01, T02, T04, T05 | IT-SNAPSHOT-005, IT-CONFIG-005                 | PASA EN T04              |

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

## T04 — Histórico y configuración

15 de noviembre de 2026, base 7d968a2. Histórico paginado con total/orden/snapshots bajo transacción de lectura, sin motor. Configuración completa no-store desde reglas/versiones/tasas/límites reales y sin DB. Getter de precios devuelve copias del dominio, sin referencias mutables.
Lint/typecheck correctos; primer focalizado 14/15 por fixture genérico que esperaba 503. Se corrige solo fixture a HttpError(503), repetición 15/15 correcta. Regresiones finales: 37 unitarios y 49 integración, sin omitidos. Sin cambios de schema, DB real, dependencias ni commits.
Al cierre, formato global, test:docs (2 pruebas) y git diff --check pasan, todos con código 0.
[Comandos y límites](../../ai-workspace/testing/005-simulations-api-t04.md), [salida inicial/final](../../ai-workspace/testing/005-simulations-api-t04.txt) y [revisión](../../ai-workspace/reviews/005-simulations-api-t04.md). T05 pendiente; sin aceptación humana final.

## T03 — Alta HTTP y errores

15 de noviembre de 2026, base d9b887a. POST /simulations usa parser antes de DB, servicio T02 y respuesta 201 después del commit. Protocolo JSON compartido con clientes; BillingError traducido y mensajes/logs sanitizados.
Lint/typecheck correctos. Siete pruebas HTTP focalizadas pasan y se integran en suite: regresiones de 37 unitarios y 41 integración correctas. Incluyen 201/400/404/413/415/422/503/500, cero con país no soportado, DB ausente/busy y recuperación, fallo AFTER INSERT con rollback y no filtración de PII/SQL/stack.
Al cierre, formato global, test:docs (2 pruebas) y git diff --check pasan, todos con código 0.
[Comandos/límites](../../ai-workspace/testing/005-simulations-api-t03.md), [salida](../../ai-workspace/testing/005-simulations-api-t03.txt) y [revisión](../../ai-workspace/reviews/005-simulations-api-t03.md). Sin schema, dependencias, DB real ni commits. Endpoints GET reservados a T04.

## T02 — Servicio y guardado transaccional

15 de noviembre de 2026, base 64a1aba. Instrucción previa en ai-workspace antes del código. Servicio calcula con país del cliente y política del servidor; repositorio asegura transacción inmediata, reutiliza insertSimulation/savepoints y devuelve DTO validado antes del commit. Sin rutas ni schema nuevos.
Lint/typecheck pasan; 9 pruebas focalizadas pasan y se añaden al runner de integración. Regresión: 37 unitarios y 34 integración pasan, sin omitidos. No duplicar el recuento de pruebas focalizadas ya incluidas en integración.
Tras actualizar documentos, formato global, test:docs (2 pruebas) y git diff --check pasan con código 0.
IT-SIM-01/02: ES 15/51, consumos/cero/máximos, cuatro países, snapshots, repetidos, reapertura y rollback real AFTER INSERT/exterior. IT-SNAPSHOT-005: bloqueo de cambio de cliente desde otra conexión y conservación histórica frente a cambios de cliente/política fixture. Mapper rechaza datos incoherentes sin recalcular.
[Comandos y límites](../../ai-workspace/testing/005-simulations-api-t02.md), [salida real](../../ai-workspace/testing/005-simulations-api-t02.txt) y [revisión](../../ai-workspace/reviews/005-simulations-api-t02.md). Sin DB real, dependencias, migraciones, commits ni aceptación humana final.

## T01 — Contratos y parsers

15 de noviembre de 2026. Base 675ac5e, cambios sin commit. Windows/PowerShell; herramientas existentes Node 22.19.0 y pnpm 10.33.4. T01 autorizada por Alex; instrucción técnica preparada antes del código en plan.md. Sin registro en ai-workspace por exclusión expresa.
Implementados CreateSimulation, SimulationDto, CustomerSnapshotDto, SimulationQuery, SimulationPage y BillingConfigDto, más parseCreateSimulation/parseSimulationQuery. DTO sin ORM; parsers sin DB ni HTTP.
InputError se extrajo conservando reexport y constructor compartido; query.ts centraliza claves/paginación para clientes e histórico. Reutilizados UUID de 003 y assertConsumption de 004. Campos ausentes → VALIDATION_ERROR; UUID presente inválido → INVALID_CUSTOMER_ID. No coerción, overrides ni mutación del body.

Comandos reales desde raíz con herramientas locales:

```powershell
$env:Path = "C:\Program Files\nodejs;$PWD\.tools\node_modules\.bin;$env:Path"
pnpm.cmd lint
pnpm.cmd typecheck
pnpm.cmd test:unit
pnpm.cmd format:check
pnpm.cmd test:docs
```

Todos devuelven código 0. Unitarios: 25 shared y 12 API (7 nuevos de contratos, 5 anteriores), total 37, sin omitidos. Documentales: 2 pasan y comprueban contexto activo 005/enlaces existentes.
Tras actualizar evidencias, format:check global y test:docs se repitieron con código 0; git diff --check también devuelve 0. Los resultados NO EJECUTADO de la matriz corresponden a RF de integración/HTTP completos, no a los parsers ya probados.
Casos nuevos: objeto/cuatro campos, ausencias, overrides monetarios/cliente, cada consumo 0/máximo/máximo+1, tipos/fracciones/no finitos/bigint/Symbol/wrappers, UUID y normalización, query con duplicados/extras/sintaxis inválida, defaults/extremos y regresión de paginación de clientes. Entrada congelada permanece intacta y resultado independiente.
Revisión técnica: CUMPLE TÉCNICAMENTE T01; ninguna ruta ni servicio/SQL de 005 implementados. No se ejecutaron build completo, integración/web/gates ni suite completa, previstos para T05; test:unit sí compila shared/API y typecheck verifica todo el workspace. Sin dependencias, migraciones, DB real, commits ni aceptación humana final.

### Registro posterior autorizado en ai-workspace

Después de T01, Alex autoriza documentar preparación, prompts, decisiones y verificaciones. Se añaden [prompts con procedencia](../../ai-workspace/prompts/005-simulations-api.md), [iteración](../../ai-workspace/iterations/005-simulations-api.md), [pruebas](../../ai-workspace/testing/005-simulations-api-t01.md) y [revisión](../../ai-workspace/reviews/005-simulations-api-t01.md).
Son retrospectivos, salvo la instrucción real conservada en el plan. No se reconstruye salida cruda ni se atribuye aceptación humana. La exclusión anterior corresponde a la fase inicial; este registro posterior está autorizado.
Verificación de este bloque documental: format:check global, test:docs (2 pruebas) y git diff --check pasan, todos con código 0. Sin nueva ejecución funcional ni cambios de código por el registro.

### Registro de siguientes tareas

Por tarea: fecha, versión identificable, comandos exactos, códigos/salidas, casos, fallos, límites y revisión técnica. Evidencia real, sin marcar PASS por inspección o planificación.
Mantener registros pertinentes siguiendo la autorización posterior de Alex y el harness; la exclusión inicial no impide el registro ahora autorizado. La aceptación humana de la entrega requiere confirmación posterior y se distingue del cierre técnico.
