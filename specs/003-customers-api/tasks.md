# Tareas 003

T01–T06 completadas técnicamente; evidencia real en validation.md. Sin aceptación humana final.
[Contrato](spec.md), [decisiones](clarifications.md), [matriz](validation.md).

- [x] **003-T01 — Consolidar clasificación fiscal y oráculos**
  - RF2. Leer fuentes de DNI/NIE y contrastar entidades/K/L/M.
  - Entregables al implementar: tabla de control en clarifications.md o BR04 enlazada, fixtures en apps/api/test/tax-id-fixtures.mjs.
  - Para cada familia/prefijo: formato, algoritmo, tipo de control, fuente, positivos y negativos independientes.
  - No cerrar por regex o por autoconsistencia con la implementación; no usar IDs demo como fiscales válidos.
  - UT-FISC-01. Si una rama carece de evidencia, identificarla y detener su código fiscal.

- [x] **003-T02 — Contratos y validación pura**
  - RF1/RF2/RF3/RF4/RF5. Fiscal depende de T01.
  - Nuevos: packages/shared/src/customers.ts, features/customers/domain/tax-id.ts y tests unitarios.
  - Reutilizar catálogo existente; cinco campos, trim, email, países de formato técnico, UUID/query y shape de DTO/error según spec.
  - UT-CONTRACT-01 y UT-FISC-01. Los datos inválidos no llegan a DB.
  - Añadir test:unit solo con estos casos reales, sin dependencias extra.

- [x] **003-T03 — Caso de uso y repositorio de clientes**
  - RF1/RF3/RF4. Depende de T02.
  - Nuevos: features/customers/service.ts y repository.ts.
  - Reutilizar insertCustomer/getCustomer; conservar customers; migración compatible de contact_name opcional para corregir el campo extra.
  - Añadir búsqueda/count transaccional, escape LIKE y orden fijo.
  - IT-CUS-01/IT-CUS-03/IT-DUP-01. Datos existentes se leen sin revalidación fiscal.

- [x] **003-T04 — HTTP, errores y conexión inyectable**
  - Todos los RF. Depende de T03.
  - Nuevos: routes.ts/controller.ts de customers, http/errors.ts, db/provider.ts.
  - Modificar app.ts/index.ts para dependencias lazy y cierre propio; no migrar ni crear archivos al arrancar.
  - POST/GET/lista/detalle, envelope, requestId, parser/límite y 503 según contrato.
  - IT-HTTP-01/IT-CUS-01/IT-LIFECYCLE-01. Mantener health y no instalar listeners globales en createApp.

- [x] **003-T05 — Integración, concurrencia y privacidad**
  - Todos los RF. Depende de T04.
  - Nuevo: apps/api/test/customers.test.mjs; reutilizar infraestructura de tests SQLite de 002 y ampliar helpers solo si es necesario.
  - Comprobar códigos, cuerpos, Location, validación sin filas, búsqueda literal/paginación, claves fiscales y carrera 201/409.
  - Bloqueos, DB ausente, redacción de errores/logs, lectura seed y cierre de conexiones.
  - Ejecutar suites de 001/002 y nuevas sin duplicarlas. Solo archivos temporales con contexto test.

- [x] **003-T06 — Documentación y cierre verificable**
  - Todos los RF. Depende de T05.
  - Sincronizar docs generales, README, MEMORY, manifests/scripts y evidencias cuando se implemente.
  - Ejecutar instalación congelada, lint, tipos, formato, build, test:unit/test:integration y suite raíz.
  - Registrar resultados y límites reales en validation.md; mantener aceptación humana separada.
  - No registrar los mensajes previos de análisis/adaptación excluidos por Alex; documentar la ejecución actual según harness.

No commits/pushes, despliegues ni operaciones sobre bases existentes del usuario. No se añaden dependencias.
