# 002 — Retrospectiva de persistencia

Redactada el 14 de noviembre de 2026 después del desarrollo. Responsable de esta síntesis: Codex.
Período descrito: análisis, aclaraciones, documentación previa, implementación y validación de 002 en esta conversación.
Fuentes: [prompts](../prompts/002-persistence.md), [spec/modelo](../../specs/002-persistence/spec.md), [validación](../../specs/002-persistence/validation.md) y [salida conservada](../testing/002-tests.txt).
Referencia Git comprobada: 9c03dc3, entrega persistence. No se atribuye el commit al instante de cada decisión.

## Problema y preparación

La plantilla pedía migraciones y seed, pero dependía de un diccionario ausente y decisiones abiertas.
Alex pidió primero explicar el alcance, delegó tecnología/modelo/planes y aceptó histórico EUR y prevención de duplicados.
El asistente concretó máximos razonables y modelo. Alex pidió actualizar la documentación antes de programar.
Solo después de esa preparación indicó implementar.

## Decisiones implementadas

- SQLite/Drizzle y driver local sin servidor; planes y límites comunes en shared.
- Unicidad por país/fiscal normalizado; FK, CHECK, STRICT y snapshots históricos.
- Migraciones explícitas con hashes/transacción; no ejecutar desde /health.
- Seed de clientes ficticios en demo marcada, sin inventar políticas fiscales.
- Backup consistente y validación exclusivamente con bases temporales.
- Sin endpoints, motor de precios/impuestos ni UI de negocio. [ADR-002](../decisions/ADR-002-sqlite-history.md).

## Iteraciones y correcciones

| Hallazgo                                                                                    | Respuesta                                                           | Evidencia                                                     |
| ------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- | ------------------------------------------------------------- |
| Driver más reciente declaraba engine compatible pero no tenía asset para Windows/ABI actual | Seleccionar 12.11.1 tras comprobar su binario publicado             | Versión instalada y SQLite cargado, registrados en validación |
| drizzle-kit cargaba schema mediante CommonJS                                                | Añadir condición default de export de shared hacia su ESM compilado | Generación y build                                            |
| Índice descendente no admitía el método usado inicialmente                                  | Usar desc() de Drizzle                                              | Generación y pruebas de esquema                               |
| Generador no expresaba STRICT y triggers requeridos                                         | Finalizador idempotente y runner con detección de deriva            | Migraciones, restricciones e inmutabilidad                    |
| Edición mediante pipe de PowerShell perdía acentos                                          | Escritura UTF-8 directa                                             | Revisión documental y formato                                 |
| ESLint exigía conservar causa del error al sanitizarlo                                      | Conservar cause sin imprimirlo en CLI                               | Lint y suite completa                                         |

## Resultado y límites

Se registraron 21 pruebas totales: 17 integración, 1 web, 1 gates y 2 documentación; no son 21 pruebas exclusivas de SQLite.
Se comprobó concurrencia, rollback, seed repetido, snapshots, bloqueo finito, aislamiento y backup desde raíz con ruta con espacios.
El arranque de apps siguió sin crear apps/api/data. No se inicializó la base de desarrollo del usuario.
La ejecución fue Windows/Node 22, sin acreditar otra plataforma ni máquina limpia.
[Resumen](../testing/002-persistence.md) y [revisión](../reviews/002-persistence.md). La autorización de implementar no equivale a aceptación humana final.
