# ADR-002 — SQLite e histórico inmutable

Estado: decisión adoptada e implementada para 002. Actualización retrospectiva: 14 de noviembre de 2026.
Fuente: decisiones delegadas y aceptadas por Alex antes de implementar; [prompts](../prompts/002-persistence.md).
Código de referencia: 9c03dc3. No se declara una aceptación humana de la entrega final.

## Decisión

Drizzle ORM 0.45.4, better-sqlite3 12.11.1 y migraciones SQL versionadas.
Clientes y simulaciones con FK/UNIQUE/CHECK/STRICT; céntimos EUR seguros, snapshots y triggers append-only.
Planes DEMO_BASIC/DEMO_PRO sin multiplicadores; guardas compartidas de consumo y fiscal único por país.
app_metadata marca propietario/tipo. El historial __app_migrations registra hashes.
Seed transaccional de dos clientes ficticios, solo demo marcada; no utiliza la propuesta anterior _seed_runs.

## Razones y alternativas

Se eligió una base local sin servidor para la escala del ejercicio y un schema TypeScript con SQL inspeccionable.
Prisma y SQL directo eran alternativas documentadas, no experimentos ejecutados; Drizzle conserva tipos sin introducir generación de cliente Prisma.
Recalcular histórico al leer perdería el resultado original: se conservan importes, contexto y versiones.
No guardar FX reduce alcance y evita confundir la conversión actual con el resultado EUR persistido.
12.11.1 disponía del binario Windows/Node necesario según la comprobación registrada; no se necesitó toolchain adicional.

## Consecuencias

El finalizador añade STRICT/triggers al SQL generado y requiere revisión del SQL nuevo.
Migraciones y seed son explícitos; /health no los dispara. Tests y backup operan en archivos temporales aislados.
No hay API de negocio ni motor fiscal. D01/D03/D10 siguen fuera del alcance resuelto.
[Modelo canónico](../../specs/002-persistence/spec.md), [índice del modelo](../../docs/data-model.md), [decisiones](../../docs/decisions.md), [evidencia](../testing/002-persistence.md).
