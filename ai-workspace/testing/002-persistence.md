# Evidencia 002 — Resumen retrospectivo

Redactado el 14 de noviembre de 2026. Fuente: [validación](../../specs/002-persistence/validation.md) y [salida conservada](002-tests.txt).
Referencia de entrega: 9c03dc3. No se repite ni se modifica la ejecución histórica al redactar este resumen.

La validación registra instalación congelada, lint, tipos, formato, build y generación de esquema sin cambios, todos con código 0.
El log conserva la suite: 17 pruebas de integración, 1 web, 1 gates y 2 documentación, sin fallos.
Incluye regresión de 001; 21 no significa 21 pruebas exclusivas de persistencia.

Casos: reconexión, migraciones/reaplicación/rollback/deriva, FK/UNIQUE/CHECK/STRICT, guardas compartidas, snapshots, seed idempotente, concurrencia, bloqueos y backup.
Entorno registrado: Windows x64, Node 22.19.0, pnpm 10.33.4; DB temporales en .cache/002-tests.
La ruta con espacios se probó para backup, no una copia completa del repo en otra ubicación.
No se acreditan políticas fiscales, navegador ni otra plataforma.

[Retrospectiva](../iterations/002-persistence-retrospective.md), [revisión](../reviews/002-persistence.md).
