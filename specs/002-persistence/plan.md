# Plan 002 — Persistencia SQLite

Plan de implementación autorizado por Alex; resultados reales en validation.md. Modelo vinculante en [spec.md](spec.md); decisiones en [clarifications.md](clarifications.md).

## Compatibilidad y dependencias

Mantener Node 22, pnpm 10.33.4, TypeScript estricto y ESM.
Antes de instalar: consultar engines/peers de versiones estables de drizzle-orm, better-sqlite3, drizzle-kit y @types/better-sqlite3, y comprobar binario para Windows/Node actual.
Registrar versiones exactas resueltas y actualizar pnpm-lock.yaml al implementar. No instalar globalmente.
drizzle-orm y better-sqlite3 son de ejecución; drizzle-kit y tipos son de desarrollo.
Añadir únicamente better-sqlite3 a onlyBuiltDependencies si su compilación lo requiere; conservar esbuild.
Si no hay binario compatible y se necesita toolchain externo, informar antes de instalar herramientas del sistema; no cambiar driver silenciosamente.
No añadir decimal.js, UI, librerías de tests ni paquetes de negocio.

## Archivos previstos

- packages/shared/src/persistence-contracts.ts e index.ts: códigos de plan y límites de consumo; sin importar Drizzle.
- apps/api/src/db/schema.ts: tablas Drizzle, índices y restricciones.
- apps/api/drizzle/: SQL inicial revisable e historial generado; STRICT, CHECK y triggers presentes en SQL.
- apps/api/drizzle.config.ts: generación local; sin migración remota.
- apps/api/src/db/connection.ts: ruta, conexión, foreign_keys y timeout.
- apps/api/src/db/migrate.ts: aplicación transaccional e historial.
- apps/api/src/db/persistence.ts: operaciones mínimas insert/read para probar el modelo; validación y transacción de snapshots, sin capas genéricas.
- apps/api/src/db/seed.ts: datos demo y resolución de conflictos.
- apps/api/src/db/cli.ts: comandos explícitos, errores y cierre.
- apps/api/test/database.test.mjs: pruebas node:test contra build y SQLite real.
- package.json raíz/API, workspace YAML y tsconfig necesarios para scripts, orden de build e inclusión de configuración.
- README, .env.example, MEMORY, docs de arquitectura/decisiones/testing/trazabilidad/contratos y docs/data-model.md: sincronización al implementar, sin duplicar modelos divergentes.

El modelo vive ahora en esta spec. Si se crea docs/data-model.md al implementar, será un índice al diccionario y a operaciones; no una segunda lista de campos.
No crear carpetas vacías ni repositorios de negocio anticipados.

## Rutas y conexiones

- DATABASE_PATH por defecto: apps/api/data/dev.sqlite resuelto contra la raíz del repositorio, nunca contra el cwd accidental.
- DATABASE_KIND: development por defecto; demo explícito para los comandos demo.
- Rutas CLI de DB y backups dentro del proyecto; rechazar URI/file:, cadenas vacías y destinos en web/public/dist o código fuente.
- Resolver ruta absoluta y enlaces existentes; rechazar escapes fuera del proyecto antes de crear directorios o abrir SQLite.
- Solo comandos explícitos de inicialización crean el directorio data y el archivo. Una conexión ordinaria exige archivo existente y esquema conocido.
- Cada conexión activa y comprueba PRAGMA foreign_keys=ON y busy_timeout=1000. No activar WAL; journal DELETE.
- Cerrar conexión en finally; informar SQLITE_BUSY sin PII y con código no cero.
- Comprobar SQLite embebido soporta STRICT y funciones JSON. Si falta soporte, detener y resolver compatibilidad, no retirar restricciones.
- Tests reciben un contexto creado por helper que genera carpeta temporal propia dentro de .cache/002-tests; solo admite archivos nuevos dentro de esa carpeta.
- Comparar rutas canónicas contra desarrollo/demo y rechazar alias/symlinks hacia ellas. Rechazar antes de abrir, truncar o migrar.
- Tests siempre con archivo real; no usar solo :memory: para demostrar persistencia.

## Migraciones

- pnpm db:migrate inicializa un archivo nuevo development o migra una base reconocida cuando el operador lo solicita explícitamente.
- pnpm db:demo:init inicializa solo un archivo nuevo demo; requiere DATABASE_KIND=demo y DATABASE_PATH explícito distinto de dev.sqlite. Si ya existe, falla sin alterarlo.
- Inicialización marca schema_owner y database_kind en la misma transacción que el esquema; antes de adoptar un archivo existente, exigir propietario/marca/historial conocidos.
- Aplicar migraciones pendientes e historial en una misma transacción; comprobar FK e integridad antes del commit. Una falla revierte esquema, datos e historial de esa ejecución.
- Reaplicar es no-op. Detectar divergencia de archivos/historial de migración; no modificar SQL ya aplicado. Registrar identificador y hash mediante el migrador.
- No ejecutar migraciones desde pnpm dev ni health. No db:reset ni down automático.
- No probar contra archivos preexistentes del usuario. Crear todas las bases de validación en el área temporal.

## Persistencia y seed

- Insertar cliente validando formato técnico y normalización; la base resuelve unicidad concurrente.
- Insertar simulación valida el payload monetario técnico y recupera el cliente en la misma transacción para generar snapshots.
- Leer devuelve exactamente los datos persistidos, sin red ni motor monetario.
- Triggers impiden UPDATE/DELETE de simulaciones; FK RESTRICT impide borrar un cliente referenciado.
- pnpm db:seed exige DATABASE_KIND=demo, ruta explícita no predeterminada y metadatos demo/propietario correctos; nunca crea ni migra implícitamente.
- No basta NODE_ENV para autorizar el seed.
- Comparar fixtures existentes campo por campo. Insertar faltantes y conservar idénticos; conflicto aborta toda la transacción sin upserts que sobrescriban.
- Sin simulaciones de seed, sin deletes y sin generar datos aleatorios.

## Scripts previstos desde raíz

| Comando                     | Responsabilidad                                                |
| --------------------------- | -------------------------------------------------------------- |
| pnpm db:generate            | Generar SQL para revisión; no abrir DB del usuario             |
| pnpm db:migrate             | Crear development nueva o aplicar pendientes explícitamente    |
| pnpm db:demo:init           | Crear demo nueva bajo guardas                                  |
| pnpm db:seed                | Sembrar demo ya inicializada y marcada                         |
| pnpm db:backup --out <ruta> | Backup consistente a archivo nuevo; origen y destino distintos |
| pnpm test:integration       | Compilar shared/API y ejecutar health más base de datos        |
| pnpm test                   | Mantener suites de 001 e incluir persistencia                  |

Los comandos operativos compilan shared/API antes de ejecutar el CLI compilado; no dependen de un build manual olvidado.
Las dependencias workspace enlazadas mantienen el orden shared antes de API. No hacen falta nuevos exports ORM compartidos.
Los comandos están implementados; el reenvío de --out desde raíz se verificó en la integración con una ruta que contiene espacios.

## Backup y recuperación

Usar la API de backup consistente del driver a un destino nuevo; no copiar a ciegas un archivo abierto.
Rechazar destino existente o igual al origen antes de escribir. Guardar fuera del directorio público.
Probar apertura del backup, integridad y lectura exacta; el test no modifica el archivo origen.
Restauración manual documentada: detener conexiones, conservar el archivo original y verificar backup antes de sustituirlo con autorización explícita. No comando automático de sobreescritura ni borrado.
La implementación demuestra restauración solo en una ruta temporal nueva.

## Pruebas y gates

Resultados reales y límites en [validation.md](validation.md).
Además: pnpm lint, typecheck, format:check, build y test; test:gates secuencial, sin compartir ejecución con controles sobre código.
No cambiar /health ni obligar a crear una DB para arrancar las apps.
Sin cálculos de impuestos/precios nuevos, tests UI ni E2E de producto en esta spec.
