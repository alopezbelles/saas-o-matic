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

## Autorización del registro

Alex levanta ahora la exclusión de ai-workspace para registrar el trabajo realizado y continuar la trazabilidad. La instrucción previa en plan conserva la restricción histórica que realmente aplicaba.
Este bloque documental se verifica con formato y enlaces; no se atribuye una nueva ejecución funcional a los registros recién creados.
