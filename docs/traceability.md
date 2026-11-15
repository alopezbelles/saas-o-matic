# Trazabilidad

| Requisito  | Tareas             | Casos                                      |
| ---------- | ------------------ | ------------------------------------------ |
| 001-RF1..4 | T01..T05 de 001    | ENV/API/WEB/GATE/DOC de 001                |
| 002-RF1    | T01, T02, T05, T06 | IT-DB-01, IT-MIG-01, IT-RECOVERY-01        |
| 002-RF2    | T01, T02, T03, T06 | IT-CONSTRAINT-01, IT-SAFETY-01             |
| 002-RF3    | T03, T05, T06      | IT-SNAPSHOT-01, IT-BACKUP-01               |
| 002-RF4    | T04, T06           | IT-SEED-01                                 |
| 002-RF5    | T02, T04, T05, T06 | IT-SAFETY-01, IT-RECOVERY-01, IT-BACKUP-01 |

Especificaciones y resultados: [001](../specs/001-foundation/spec.md), [validación 001](../specs/001-foundation/validation.md),
[002](../specs/002-persistence/spec.md), [validación 002](../specs/002-persistence/validation.md).

## Clientes 003

| RF      | Tareas   | Casos                                      |
| ------- | -------- | ------------------------------------------ |
| 003-RF1 | T02..T06 | UT-CONTRACT-01, IT-CUS-01, IT-MIG-003      |
| 003-RF2 | T01..T06 | UT-FISC-01, IT-INVALID-01                  |
| 003-RF3 | T02..T06 | IT-CUS-03                                  |
| 003-RF4 | T02..T06 | IT-DUP-01                                  |
| 003-RF5 | T02..T06 | IT-HTTP-01, IT-LIFECYCLE-01, IT-PRIVACY-01 |

[Spec](../specs/003-customers-api/spec.md), [validación](../specs/003-customers-api/validation.md).
