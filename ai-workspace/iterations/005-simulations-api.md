# 005 — Preparación y T01

15 de noviembre de 2026. Registro retrospectivo creado después de T01 por autorización posterior de Alex; no hilo literal ni registro contemporáneo de la ejecución.

## Contexto y planificación

Infraestructura, persistencia, clientes y motor monetario ya existían. La plantilla de 005 debía conectar cálculo autoritativo e histórico mediante API; no rehacer schema ni tarifas.
El análisis detectó paquetes/tests inexistentes, referencias sin fuente y decisiones D01/D04/D05 tratadas como pendientes pese a estar resueltas.
Se adaptaron los cinco documentos después de confirmar configuración completa, DTO/snapshots/paginación y errores/reintentos. [Spec](../../specs/005-simulations-api/spec.md), [decisiones](../../specs/005-simulations-api/clarifications.md) y [prompts reformulados](../prompts/005-simulations-api.md).
El commit 675ac5e es la base documental observada al iniciar T01. T01 y este registro permanecen sin commit al redactarlo; el agente no creó commits.

## T01 — Implementación realizada

Autorización expresa para contratos, parsers, pruebas y contexto. Antes del código se escribió la instrucción técnica en el plan; ai-workspace permaneció excluido hasta la solicitud posterior de registro.

Cambios:

- Tipos CreateSimulation, SimulationDto, CustomerSnapshotDto, SimulationQuery, SimulationPage y BillingConfigDto sin ORM.
- parseCreateSimulation estricto, solo cuatro campos, límites existentes y UUID normalizado. Ausencia de campo y UUID presente inválido tienen códigos distintos.
- parseSimulationQuery con claves exclusivas limit/offset, valores y límites compatibles con clientes.
- InputError extraído con reexport compatible; query.ts comparte paginación y evita duplicación/ciclos. UUID y validación de consumos reutilizados.
- Siete tests nuevos, runner API ampliado, memoria/gate activos en 005 y documentación que distingue tipos disponibles de rutas pendientes.

## Decisiones técnicas y alternativas

Copiar paginación o validadores de consumos habría duplicado reglas. Se eligió extracción limitada y reutilización de los helpers existentes, preservando semántica 003 y motor 004.
Mover InputError a un módulo independiente evita hacer depender la paginación del módulo de clientes. El reexport conserva imports e instanceof existentes.
No se crea un ADR nuevo: T01 aplica la arquitectura ya acordada, sin nuevo stack ni cambio de responsabilidad. Decisiones de producto enlazadas a clarifications, sin duplicar el contrato.

## Verificación y límites

Lint, typecheck, formato global, 37 unitarios y 2 documentales correctos durante T01. [Resumen de evidencia](../testing/005-simulations-api-t01.md); fuente principal en [validación canónica](../../specs/005-simulations-api/validation.md#t01--contratos-y-parsers).
No hubo fallo funcional observado ni cambio de enfoque que requiriese una corrección de negocio. Los errores deliberados de los casos negativos son pruebas de validación, no incidentes de producción.
No servicio, SQL, endpoint, DB real, migración, dependencia nueva, commit ni aceptación humana final. T02–T05 siguen pendientes.

## T02 — Ejecución y registro durante el trabajo

15 de noviembre de 2026, base 64a1aba. Alex autoriza T02; la instrucción se añadió antes del código a prompts/005-simulations-api.md. Este bloque es contemporáneo al trabajo T02, a diferencia de la preparación/T01 retrospectivas.
Se implementó simulationService con política inyectable y cálculo de 004; createCalculatedSimulation controla lectura/cálculo/guardado/mapping en transacción inmediata. insertSimulation conserva inserción/snapshots y usa savepoint bajo transacción exterior. No SQL ni acceso DB en dominio puro.
toSimulationDto transforma columnas a contrato y valida consistencia del dato guardado, sin recalcular. Tests cubren rollback AFTER INSERT, rollback exterior, bloqueo de segundo escritor, reapertura y cambios futuros de cliente/política.
Nueve pruebas focalizadas pasan y se incorporan a integración: regresión de 37 unitarios y 34 integración correcta, junto con lint/typecheck. [Evidencia](../testing/005-simulations-api-t02.md) y [revisión](../reviews/005-simulations-api-t02.md).
Sin error funcional observado durante ejecución; tests negativos son deliberados. Sin endpoints, DB real, dependencias, migraciones ni commits. Esperar indicación para T03.

## T03 — Alta HTTP y traducción de errores

15 de noviembre de 2026, base d9b887a. Alex autoriza T03 y la instrucción se registra antes del código. Se añade controlador/ruta POST y montaje en createApp, con política interna opcional de composición.
Se extrae jsonBody para compartir protocolo con clientes sin duplicación. errorHandler traduce BillingError, separando código público sanitizado y código técnico en log de fallos internos. Sin cambios de motor o transacción.
Siete tests focalizados pasan; regresión de 37 unitarios y 41 integración correcta, además de lint/typecheck. Se verifican DB lazy, rechazo antes de conexión, 201 tras commit y rollback ante fallo real de inserción. [Evidencia](../testing/005-simulations-api-t03.md) y [revisión](../reviews/005-simulations-api-t03.md).
Sin fallo funcional observado; errores de fixtures deliberados. Sin historial/configuración HTTP, datos reales, migraciones, dependencias ni commits. Esperar indicación para T04.

## T04 — Histórico paginado y configuración

15 de noviembre de 2026, base 7d968a2. Alex autoriza T04; instrucción registrada antes del código. Se implementa página histórica SQL con mapper existente y transacción de lectura. Se publica configuración desde reglas/versiones reales de shared y política/límites del servidor, sin DB y no-store.
getPricingConfiguration devuelve copias; dominio sigue puro y sin DTO HTTP. Rutas preservan POST/clientes. Se actualizan las expectativas 404 antiguas de T03 para lecturas que ahora existen.
Primer focalizado: 14/15, fallo de fixture que simulaba Error genérico pero esperaba DB no disponible (503). Se corrigió a HttpError(503) sin tocar handler. Repetición 15/15; regresión 37 unitarios/49 integración correcta, junto con lint/typecheck. [Evidencia](../testing/005-simulations-api-t04.md) y [revisión](../reviews/005-simulations-api-t04.md).
Sin schema/migraciones, dependencias, DB real, UI/FX ni commits. T05 pendiente de indicación y aceptación humana no registrada.

## T05 — Verificación global y cierre técnico

15 de noviembre de 2026, base 95e9243. Alex autoriza T05; instrucción registrada antes de ejecutar controles. Lint/typecheck/formato/build y test se ejecutan secuencialmente; todos correctos, con 90 pruebas y ninguna omitida.
Revisión RF1..4 conforme: motor autoritativo, transacciones/snapshots coherentes, histórico sin recálculo y configuración sin DB. Auditoría frente a 675ac5e confirma schema/migraciones/lockfile/dependencias/frontend sin cambios; .cache/002-tests queda vacío tras la suite.
No fallo funcional nuevo detectado; incidencia de fixture de T04 queda como antecedente resuelto, no se reescribe su evidencia. La revisión encontró referencias obsoletas de README/spec que aún negaban endpoints o marcaban T05 pendiente; se corrigieron en documentación canónica, sin alterar evidencias históricas. [Verificación global](../testing/005-simulations-api-t05.md), [salida](../testing/005-simulations-api-t05.txt) y [revisión](../reviews/005-simulations-api-t05.md).
T01–T05 completas técnicamente. Casos ES 15/51 y política/endpoints presentados para revisión; no aprobación humana anticipada ni inicio de 006. Sin código funcional nuevo, DB real, commits ni pushes en T05.

## Autorización del registro inicial

Alex levantó después de T01 la exclusión de ai-workspace para registrar el trabajo realizado y continuar la trazabilidad. La instrucción previa en plan conserva la restricción histórica que realmente aplicaba.
Este bloque documental se verifica con formato y enlaces; no se atribuye una nueva ejecución funcional a los registros recién creados.
