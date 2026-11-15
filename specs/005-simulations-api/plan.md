# Plan 005 — Integración API e histórico

Estado: T01–T03 completadas técnicamente; POST disponible, T04/T05 pendientes. [Contrato](spec.md) y [decisiones](clarifications.md).

## Reutilización y arquitectura

### Instrucción previa para T01

Preparada por el agente antes del código, tras autorización de Alex para T01. Base 675ac5e. Implementar contratos públicos y parsers estrictos, reutilizar UUID/consumos y extraer paginación de 003 sin cambiar su semántica. Separar InputError en módulo independiente, conservando reexport compatible, para que los helpers no dependan de clientes ni generen ciclos.
Probar cuerpos/tipos/extras/límites/UUID/query, regresiones de clientes y entradas inmutables. Actualizar contexto y gate a 005; endpoints y persistencia siguen pendientes. Verificar lint, typecheck, format:check, test:unit y test:docs. Sin dependencias, DB, commits ni ai-workspace; registrar resultados reales en validation.md.

No recrear tablas, límites, motor ni política. Reutilizar db/persistence.ts (getCustomer, insertSimulation), esquema/índice histórico, proveedor lazy, InputError/HttpError y calculateQuote de shared.
El listado existente listSimulations devuelve todo; añadir consulta paginada en repositorio de feature sin cambiar la semántica de ese helper usado por tests previos.
DTO públicos sin ORM. SQL solo en repositorios; rutas/controladores transportan y validan; servicio orquesta dominio. Sin nueva infraestructura genérica ni dependencias.

## Archivos previstos

Rutas futuras como texto; no enlaces a archivos que aún no existen.

| Ruta                                                                        | Responsabilidad                                                          |
| --------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| packages/shared/src/simulations.ts                                          | Parse de alta/query y DTO de simulación, snapshot/configuración sin ORM. |
| packages/shared/src/index.ts                                                | Exports de contratos.                                                    |
| apps/api/src/features/simulations/{service,repository,controller,routes}.ts | Orquestación, transacciones/SQL, mapping y transporte.                   |
| apps/api/src/features/billing/routes.ts                                     | GET /billing-config desde fuentes reales; no repositorio/DB.             |
| packages/shared/src/billing/tiers.ts e index.ts                             | Lectura pública de tarifas/versiones mediante copia, sin duplicación.    |
| apps/api/src/app.ts                                                         | Montar rutas antes del 404, conservando health/clientes.                 |
| apps/api/src/http/errors.ts                                                 | Traducción sanitizada de errores de 005.                                 |
| apps/api/test/simulations-contract.test.mjs                                 | Parse/contratos unitarios.                                               |
| apps/api/test/simulations-service.test.mjs                                  | Servicio/repositorio con SQLite temporal.                                |
| apps/api/test/simulations.test.mjs                                          | Alta/historial HTTP con DB temporal.                                     |
| apps/api/test/billing-config.test.mjs                                       | Configuración HTTP sin DB.                                               |
| apps/api/package.json                                                       | Conectar explícitamente los archivos nuevos a suites existentes.         |
| test/docs.test.mjs                                                          | Contexto activo 005 al comenzar implementación.                          |

Extraer utilidades de paginación existentes únicamente si evita duplicación real, sin alterar contrato de clientes. No introducir packages/contracts ni runner TS.
T01 implementa input-error.ts (reexport compatible desde customers.ts), query.ts (validación de claves/paginación compartida) y simulations.ts. Reutiliza parseCustomerId y assertConsumption de 004; no duplica UUID, límites ni reglas de parse de paginación.

## Guardado coherente

1. Controlador parsea body estricto, cuatro campos; errores sintácticos/protocolo como 003 antes de abrir DB.
2. Servicio solicita operación transaccional del repositorio. Repositorio abre transacción inmediata corta con la conexión lazy.
3. Dentro, obtiene cliente o error tipado CUSTOMER_NOT_FOUND. Invoca callback síncrono de cálculo del servicio, que usa calculateQuote con consumos, país del cliente y política explícita.
4. Repositorio mapea rateBps→taxRateBps, reutiliza insertSimulation y sus snapshots/allowlist. Su transacción interior es un savepoint bajo la exterior; validar comportamiento con el driver actual. No duplicar insert/snapshots.
5. Mapea la fila guardada a SimulationDto; commit antes de devolver 201. Excepción en lectura/cálculo/inserción/mapping revierte operación completa.

No exponer DB en contratos HTTP ni poner SQL en servicio. Callback solo recibe datos de cliente necesarios, sin infraestructura; evitar una abstracción genérica para una única operación.
Inyección explícita de política permite tests de versiones sin modificar archivos de configuración ni introducir selección de política por petición. Por defecto, usar taxPolicy del servidor. Es un punto de composición interno, no endpoint administrativo.

## Histórico y configuración

Historial: leer existencia, total y página en una transacción de lectura; consultas parametrizadas y orden con desempate por id. Filas mapeadas desde snapshots, no joins que sustituyan datos históricos. Deserializar breakdownJson a DTO validado; datos incoherentes provocan error interno sanitizado, no resultado silenciosamente incompleto.
Config: proyectar configuración fiscal del servidor, CONSUMPTION_LIMITS y lectura de precios/versiones de shared. Copias nuevas, sin duplicar tarifas ni referencias mutables. Cache-Control no-store, sin llamada al proveedor DB. Debe funcionar aunque DB no exista.
Montar /customers/:id/simulations con convivencia explícita con el router de clientes existente. No depender de una ruta de detalle de simulación no definida.

## Validación y errores

T03 implementa controlador/ruta y middleware http/json-body.ts compartido con clientes, conservando sus reglas. createApp acepta billingPolicy como opción interna de composición; no se expone en body. Handler mantiene código técnico de BillingError interno en log y envelope público INTERNAL_ERROR cuando corresponde.

Reutilizar semántica UUID/query de 003; parser específico de historial rechaza q y extras. Defaults/límites fijados en spec.
Mapear BillingError de consumos a 422; TAX_COUNTRY_UNSUPPORTED a 422 con mensaje del país del cliente y field customerId. Política inválida/overflow con entrada validada → 500 INTERNAL_ERROR, registrando código técnico sin filtrar datos. Cliente ausente → 404; DB busy/unavailable → 503.
No convertir SQL/constraints genéricos en 422 ni reutilizar el 409 de duplicado fiscal para simulaciones.
Sin retries automáticos; cliente sin política no se convierte en impuesto cero.

## Verificación incremental

| Caso                | Criterio                                                                                                |
| ------------------- | ------------------------------------------------------------------------------------------------------- |
| UT-SIM-CONTRACT-005 | Cuatro campos exactos, UUID, números sin coerción, límites, extras y query estricta.                    |
| IT-SIM-01           | Recalcular/guardar ES 15 y 51; todos los consumos y snapshots correctos; 201 tras commit.               |
| IT-SIM-02           | Reapertura y rollback de operación real fallida; sin datos parciales ni alteración de filas anteriores. |
| IT-HIST-01          | Paginación/total, vacío, cliente ausente, empate de fecha y offset fuera de página.                     |
| IT-SNAPSHOT-005     | Cambiar cliente/política ficticios no cambia históricos; nuevas filas usan datos vigentes.              |
| IT-INVALID-005      | JSON/UUID/extras/rangos, país sin regla, DB ausente/busy y errores sanitizados.                         |
| IT-CONFIG-005       | Config real coincide con cálculo/versiones, sin DB, no-store y sin duplicación de tarifas.              |
| IT-LIFECYCLE-005    | Salud sin DB, apertura lazy y cierre/regresiones preservados.                                           |

ES 15: base 14000, impuesto 2940, total 16940. ES 51: 42500, 8925 y 51425 céntimos.
Para cambios de cliente/política, usar fixtures aislados e inyección interna; no añadir PATCH de clientes ni configuración administrativa para probar.
Probar repetición de POST: dos guardados deliberados crean dos filas; timeout no implica rollback garantizado si hubo commit.
Cada tarea añade pruebas reales para sus piezas, sin imports de módulos inexistentes ni tests omitidos. Conectar unitarios a test:unit API y tests SQLite/HTTP a test:integration API preservando todos los anteriores.
Controles por tarea: pnpm lint, pnpm typecheck, pnpm format:check, pruebas afectadas y pnpm test:docs. T05: pnpm build y pnpm test completos además. No ejecutar test:gates en paralelo con otros controles de código.

## Documentación y alcance

Al implementar T01 actualizar MEMORY.md y gate de spec activa a 005, docs/approvals y comandos/contexto pertinentes; esta preparación modifica solo los cinco documentos solicitados.
Actualizar docs/api-contracts.md al crear contratos/rutas, distinguiendo implementado de previsto; trazabilidad y validación con resultados reales. Alex autoriza después de T01 registrar preparación y ejecución en ai-workspace; se mantienen procedencia/momento reales y no se reescribe la instrucción previa histórica.
Sin migración prevista; si aparece necesidad, justificarla antes. Sin DB real, commits, frontend, FX o nuevas dependencias.
