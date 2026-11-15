# Tareas 005

Estado: T01 completada técnicamente; T02–T05 pendientes. Contratos y parsers disponibles, sin endpoints nuevos.
Cada tarea requiere indicación de Alex. Proponer commit separado al cerrar el bloque; no ejecutar commits/pushes. Tras T01 Alex autoriza registrar preparación/ejecución en ai-workspace; conservar la procedencia retrospectiva del registro inicial.

## T01 — Contratos de alta, histórico y configuración

- [x] Completada técnicamente. RF1..4 solo en su parte de contratos; endpoints pendientes.
- Archivos previstos: packages/shared/src/simulations.ts, index.ts, apps/api/test/simulations-contract.test.mjs, apps/api/package.json; contexto/gate/documentación pertinente al iniciar implementación.
- Definir CreateSimulation, SimulationDto, CustomerSnapshotDto, SimulationQuery, SimulationPage y BillingConfigDto con el contrato exacto de spec.md; sin tipos ORM.
- Parse estricto de cuatro campos; UUID, números/límites de shared y query limit/offset. Rechazar extras, coerción, parámetros repetidos y q.
- Reutilizar convenciones de 003; extraer helpers compartidos solo si evita duplicar validación real.
- Conectar tests unitarios a script explícito API; preservar los anteriores.
- Actualizar MEMORY.md y test/docs.test.mjs para spec activa 005; mantener referencias históricas. docs/api-contracts.md distinguirá contratos preparados de rutas aún no implementadas.
- Verificación: UT-SIM-CONTRACT-005 y controles por tarea del plan. Tests reales de parsers, sin placeholders.
- Cierre: contrato y parse probados; no afirmar endpoint implementado.
- Commit propuesto: feat(simulations): define simulation API contracts and validation.
- Evidencia: [validación T01](validation.md#t01--contratos-y-parsers). Lint/typecheck/format:check pasan; 37 unitarios (25 shared y 12 API) y 2 documentales pasan. Sin DB. [Registro de IA](../../ai-workspace/iterations/005-simulations-api.md) añadido por autorización posterior.

## T02 — Servicio y guardado transaccional coherente

- [ ] Pendiente. RF1, RF2, RF4. Depende de T01.
- Archivos previstos: apps/api/src/features/simulations/service.ts, repository.ts, apps/api/test/simulations-service.test.mjs y apps/api/package.json.
- Implementar repositorio transaccional que lee cliente, invoca cálculo síncrono del servicio y reutiliza insertSimulation con snapshots. País/plan del cliente y cálculo deben quedar alineados bajo misma transacción inmediata.
- No duplicar SQL/allowlist de insertSimulation; verificar savepoints de transacción anidada y rollback de la operación completa.
- Motor calculateQuote y política explícita del servidor, nunca importes enviados. Mapear rateBps a taxRateBps y fila guardada a DTO sin exponer ORM/JSON string.
- Añadir punto interno de inyección de política para tests de versiones, sin configuración seleccionable por HTTP.
- Verificación: IT-SIM-01, IT-SIM-02 y parte de IT-SNAPSHOT-005 sobre SQLite temporal. Probar falla tras trabajo transaccional, cliente ausente, reapertura y preservación de filas anteriores.
- Conectar test de servicio/SQLite a test:integration API. Controles por tarea.
- Cierre: servicio/repositorio probados, sin HTTP nuevo ni DB real.
- Commit propuesto: feat(simulations): persist authoritative quotes transactionally.

## T03 — Alta HTTP y traducción de errores

- [ ] Pendiente. RF1, RF2. Depende de T02.
- Archivos previstos: simulations/routes.ts, controller.ts, apps/api/src/app.ts, http/errors.ts, apps/api/test/simulations.test.mjs y apps/api/package.json.
- Montar POST /simulations con JSON y límites/protocolo equivalentes a 003; validar antes de conexión.
- 201 tras commit con SimulationDto. Sin Location hacia recurso inexistente; sin nuevo endpoint de detalle.
- Mapear 400/404/413/415/422/503/500 según spec; conservar requestId, logs y mensajes sanitizados. No mapear fallo de configuración a 422.
- Verificación: IT-SIM-01, IT-INVALID-005 e IT-LIFECYCLE-005. Probar país sin regla incluso con cero, importes inyectados, DB ausente/busy y fallo inesperado; ninguna escritura parcial.
- Conectar integración HTTP al script existente y actualizar contrato API implementado. Controles por tarea.
- Cierre: alta HTTP comprobable sin regresión de clientes/health.
- Commit propuesto: feat(simulations): expose creation endpoint and sanitized errors.

## T04 — Histórico paginado y configuración pública

- [ ] Pendiente. RF3, RF4. Depende de T03.
- Archivos previstos: simulations/repository.ts, service.ts, controller.ts, routes.ts; billing/routes.ts; app.ts; shared/src/billing/tiers.ts e index.ts; tests HTTP/histórico/configuración y scripts.
- Histórico con SQL paginado/total y transacción de lectura coherente; cliente ausente 404 y existente sin registros vacío. Orden createdAt DESC, id DESC.
- Mapear datos guardados/snapshots, sin recalcular ni cambiar el helper listSimulations original.
- Publicar GET /billing-config completo, sin DB y no-store. Añadir lectura pública de precios/versiones a shared mediante copias; reutilizar tasas y límites reales, sin duplicar reglas.
- Verificación: IT-HIST-01, IT-SNAPSHOT-005 e IT-CONFIG-005. Cambiar fixtures de cliente/política y comprobar pasado inmutable, nuevos cálculos vigentes y coincidencia configuración/motor.
- Actualizar scripts y docs/api-contracts.md; controles por tarea.
- Cierre: lectura paginada histórica y config probadas, sin preview/UI/FX.
- Commit propuesto: feat(simulations): expose history and current billing configuration.

## T05 — Revisión global y conservación histórica

- [ ] Pendiente. RF1..4. Depende de T04.
- Archivos pertinentes: tests existentes de simulaciones/configuración, validation.md, memoria y documentación de contratos/testing/trazabilidad.
- Revisar cobertura, coherencia transaccional y snapshots, errores, ausencia de precios confiados a cliente, duplicados deliberados y riesgo de resultado incierto tras timeout.
- Ejecutar secuencialmente pnpm lint, typecheck, format:check, build y test; conservar resultados reales. test:gates sin otros controles de código simultáneos.
- Confirmar que no se alteraron datos reales, migraciones previas ni contratos anteriores; no crear endpoints auxiliares para tests.
- Presentar resultados a Alex; separar cierre técnico de aceptación humana.
- Cierre: RF con pruebas y evidencias, todos los controles pertinentes correctos y límites documentados.
- Commit propuesto: docs(simulations): record API and history validation.

La preparación actual no marca ninguna tarea completa. [Matriz y estado](validation.md); registro de IA solo después de autorización de Alex.
