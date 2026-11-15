# Arquitectura

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

## Diseño acordado 004 — todavía no implementado

Motor puro previsto en packages/shared/src/billing/; configuración fiscal explícita en API, sin HTTP/SQL/React en el dominio. Sin paquetes ni dependencias nuevas. Reutiliza límites de 002 y expone desglose/versiones para futura integración en 005. FX e integración de preview no pertenecen a 004.
Contratos, errores y pruebas en [plan 004](../specs/004-billing/plan.md); razones en [ADR-005](../ai-workspace/decisions/ADR-005-billing-engine.md). Las políticas fiscales acordadas todavía no existen como código.
