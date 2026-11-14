# Tareas 002

T01–T06 completadas técnicamente. Evidencia real en validation.md; las casillas no equivalen a aceptación humana.
Modelo: [spec.md](spec.md). Evidencia: [validation.md](validation.md).

- [x] **002-T01 — Compatibilidad, dependencias y contratos técnicos**
  - RF1/RF2. Verificar versiones estables, engines/peers y binario Windows antes de instalar.
  - Archivos: manifests, pnpm-lock.yaml, pnpm-workspace.yaml y packages/shared.
  - Añadir catálogo y límites compartidos, sin precios ni ORM exportado.
  - Hecho cuando: instalación congelada y build compatibles; versiones y necesidad del postinstall registradas.

- [x] **002-T02 — Schema, conexión y migraciones**
  - RF1/RF2/RF5. Depende de T01.
  - Archivos: db/schema.ts, connection.ts, migrate.ts, cli.ts, drizzle.config.ts, SQL y scripts.
  - Implementar diccionario exacto, STRICT, FK, CHECK, UNIQUE, índice y triggers; guardas de rutas y aislamiento.
  - Hecho cuando: IT-DB-01, IT-MIG-01 e IT-SAFETY-01; sin creación automática al arrancar API.

- [x] **002-T03 — Escritura/lectura mínima y restricciones**
  - RF2/RF3. Depende de T02.
  - Archivos: db/persistence.ts y test/database.test.mjs.
  - Validar snapshots, JSON y enteros seguros; recuperar contexto del cliente transaccionalmente. Sin endpoints ni cálculo tarifario.
  - Hecho cuando: IT-CONSTRAINT-01 e IT-SNAPSHOT-01 verifican base real, SQL directo para restricciones DB y validación técnica para estructura JSON.

- [x] **002-T04 — Seed demo seguro**
  - RF4/RF5. Depende de T03.
  - Archivos: db/seed.ts, cli.ts y pruebas.
  - Dos clientes ficticios, fechas/UUID fijos, cero simulaciones; guardas demo y transacción sin borrar/sobrescribir.
  - Hecho cuando: IT-SEED-01 comprueba reejecución, conflicto con rollback y conservación de filas ajenas.

- [x] **002-T05 — Persistencia, bloqueos y backup**
  - RF1/RF3/RF5. Depende de T04.
  - Archivos: conexión/CLI/backup y pruebas.
  - Reabrir conserva datos; migración fallida no deja cambios; busy_timeout finito; backup a archivo nuevo.
  - Hecho cuando: IT-RECOVERY-01 e IT-BACKUP-01, sin datos de desarrollo utilizados.

- [x] **002-T06 — Integración documental y revisión**
  - Todos los RF. Depende de T05.
  - Actualizar README, .env.example, MEMORY, docs generales e índice de evaluación con decisiones ya acordadas; ampliar trazabilidad y comprobación de enlaces a 002.
  - Mantener único diccionario; indicar comandos existentes y alcance real.
  - Ejecutar instalación congelada, lint, tipos, formato, build y todas las suites; actualizar validation solo con salidas reales.
  - Hecho cuando: sin regresiones de 001, guardas y casos de la matriz cubiertos, límites explícitos y veredicto técnico registrado.
  - La aceptación humana no se marca en nombre de Alex.

Alex autorizó después la implementación de esta spec. No se amplía a endpoints, cálculos de negocio, datos preexistentes ni operaciones Git.
