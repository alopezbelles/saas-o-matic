# Arquitectura

## Web 007 — T01

BrowserRouter en App y rutas declarativas en app/AppRoutes separan shell y destinos. AppLayout comparte cabecera, breadcrumbs y contenido; las páginas base informan de su disponibilidad hasta T02–T04. Tokens/global y CSS Modules concentran estilos sin dependencias UI. Shared queda enlazado mediante workspace para contratos posteriores.

Vitest/RTL ejecutan pruebas src/**/_.test.tsx en jsdom; node:test conserva test/_.test.mjs con FX y smoke. Scripts separados se componen en el test de web. Playwright está instalado y Chromium se guarda en caché del proyecto para smoke visual del shell; los E2E de alta reales corresponden a T05.

## Conversión 006

shared/src/currency contiene conversión pura y reutiliza utilidades monetarias, sin red/reloj/SQL. web/src/features/currency separa contrato/validación externa de HTTP/caché. createExchangeClient inyecta fetch/reloj; exchangeClient comparte instancia por pestaña sin petición al importar. EUR devuelve null identidad; USD/GBP comparten petición y caché inmutable hasta expiresAt. Timeout 5 s cubre fetch/cuerpo; sin reintentos ni datos caducados. Sin proxy, persistencia FX, UI o librerías nuevas. El test web compila shared para pruebas de composición, sin dependencia runtime nueva en la web.

## Simulaciones 005 — T02

T04 añade histórico con existencia/total/página en transacción de lectura SQL y mapper de snapshots, sin motor. Configuración GET sin DB en billing/routes proyecta getter puro getPricingConfiguration desde shared, política del servidor y límites existentes; solo copias y no-store. Un servicio de simulaciones comparte proveedor lazy/política con ambos routers; config no depende del proveedor. Sin cambios de schema ni duplicación de reglas.

T03 añade controlador/ruta POST y montaje en createApp, preservando proveedor lazy. http/json-body.ts centraliza protocolo 32kb/application-json de clientes/simulaciones. Handler traduce BillingError a HTTP y mantiene fallos técnicos solo en logs sanitizados; no cambia motor, SQL ni snapshots. Política de tests inyectable solo en composición de app.

simulationService recibe proveedor de conexión y política interna explícita; calcula mediante shared sin SQL. createCalculatedSimulation en repositorio obtiene cliente bajo transacción inmediata, invoca callback síncrono con su país y reutiliza insertSimulation (savepoint anidado) para snapshots/inserción. toSimulationDto valida y proyecta datos guardados antes del commit; no recalcula históricos. Sin nueva tabla/migración ni rutas HTTP.

Monorepo pnpm 10.33.4: apps/web, apps/api y packages/shared; Node 22, TypeScript estricto y ESM.
React/Vite para web y Express/tsx para API. ESLint, Prettier y node:test para calidad.

## Persistencia 002

- apps/api/src/db/schema.ts: definición Drizzle, índices y CHECK.
- apps/api/drizzle: SQL versionado e historial de generación; tablas STRICT y triggers.
- db/connection.ts y paths.ts: apertura explícita, propietario, rutas y aislamiento.
- db/migrate.ts: runner transaccional con hashes de SQL; no confía solo en la fecha de una migración.
- db/persistence.ts: escritura/lectura mínima, snapshots autoritativos y transacciones; no calcula precios/impuestos.
- db/validation.ts: validaciones estructurales y aritmética exacta de integridad.
- db/seed.ts, backup.ts y cli.ts: operaciones explícitas con guardas.
- packages/shared: planes y límites sin importar Drizzle.

Se usa drizzle-orm 0.45.4 y better-sqlite3 12.11.1; drizzle-kit 0.31.11 genera SQL. Un finalizador idempotente añade STRICT/triggers a SQL nuevo porque el generador no expresa esas garantías.
El script de generación no abre bases y no reescribe SQL ya finalizado. Revisar cualquier SQL nuevo antes de aplicarlo.
Más detalle en [modelo](data-model.md), [decisiones](decisions.md) y [spec 002](../specs/002-persistence/spec.md).

## Arranque

createApp está separado de listen. pnpm dev arranca web en 127.0.0.1:5173 y API en 127.0.0.1:3000.
El arranque y /health no requieren DB ni .env. Las rutas de clientes usan proveedor lazy; sin DB inicializada responden 503. No se migra al arrancar.
Los comandos DB compilan shared/API antes de ejecutar el CLI; las rutas relativas se resuelven contra raíz del repo.

## Evolución

003 añade endpoints de clientes, validación pura, contratos shared y conexión lazy. No hay endpoint de simulaciones, motor monetario, políticas fiscales ni FX.
El futuro dominio permanecerá puro, separado de HTTP/SQL/React; los contratos no expondrán tipos ORM.
Router, Zod y librerías UI no están instalados por anticipación.
No se han configurado servicios externos ni despliegue.

## Diseño acordado 004 — implementación parcial

Motor puro previsto en packages/shared/src/billing/; configuración fiscal explícita en API, sin HTTP/SQL/React en el dominio. Sin paquetes ni dependencias nuevas. Reutiliza límites de 002 y expone desglose/versiones para futura integración en 005. FX e integración de preview no pertenecen a 004.
Contratos, errores y pruebas en [plan 004](../specs/004-billing/plan.md); razones en [ADR-005](../ai-workspace/decisions/ADR-005-billing-engine.md). T03 implementa la política demo como configuración versionada congelada en API.

T02 implementa tipos básicos, BillingError y calculateTieredBase en shared/src/billing, exportados desde shared. T03 añade money/tax y TaxPolicy, centralizando guardas y conversión segura con BigInt. Composición pendiente de T04; sin HTTP ni persistencia.

T04 implementa calculateQuote y BillingInput/BillingQuote; validation.ts centraliza consumos para tramos y composición. Valida entrada antes de política y cálculo, suma con BigInt y devuelve datos JSON seguros con versiones. Sin integración HTTP/DB ni FX; T05 pendiente de cierre.
