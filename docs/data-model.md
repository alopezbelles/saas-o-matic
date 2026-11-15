# Modelo de persistencia

Diccionario canónico: [spec 002](../specs/002-persistence/spec.md#diccionario-vinculante).
Esquema ejecutable: [schema.ts](../apps/api/src/db/schema.ts).
Migración SQL: [0000_foundation.sql](../apps/api/drizzle/0000_foundation.sql).

## Evolución 003

La migración nueva 0001_optional_contact permite contact_name nulo. Los valores antiguos se conservan; el alta HTTP solo exige los cinco datos del enunciado y no expone esa columna. SQL 0000 no se modifica. La reconstrucción comprueba integridad/FK antes del commit y preserva simulaciones y triggers.

## Operación

- SQLite en archivo, tablas STRICT, FK activas, journal DELETE y busy_timeout 1000 ms.
- Catálogo y guardas de consumo en packages/shared; SQL materializado y probado contra esos valores.
- __app_migrations conserva identificador/hash SHA-256; el runner rechaza deriva y aplica todo el lote en una transacción.
- app_metadata identifica propietario y tipo; archivos desconocidos no se adoptan.
- Datos y backups solo bajo apps/api/data o .cache, nunca en código ni assets web.
- Normalización y estructura de snapshots se validan en la frontera de persistencia. La base impone además tipos, FK, unicidad, rangos, totales y JSON array.
- Los snapshots se toman del cliente en la transacción; la persistencia no calcula tarifas ni determina impuestos.
- SQLite STRICT admite coerciones exactas compatibles: no es una validación del tipo JSON de una futura petición HTTP.

## Backup y recuperación

Comando: pnpm db:backup --out apps/api/data/backup.sqlite.
El destino debe ser nuevo; se usa la API de backup del driver, no una copia de un archivo abierto.
Verificar integridad y leer la copia antes de restaurar. Para restauración manual: detener todos los procesos con conexiones, conservar el original y sustituirlo solo con autorización explícita.
No hay reset, down ni restauración automática destructiva. Los tests abren la copia en una ruta temporal nueva.

Nunca versionar archivos SQLite, journals, backups ni datos personales.
