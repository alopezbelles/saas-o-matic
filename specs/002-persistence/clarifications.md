# Decisiones de 002

## Fuente y estado

Alex delegó tecnología/modelo/planes y aceptó los límites e histórico EUR. Después indicó «perfecto, desarrolla la spec». Resultados de implementación en validation.md.

| ID      | Decisión para 002                                                                                                                          |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| D02     | Catálogo compartido cerrado DEMO_BASIC / DEMO_PRO, sin tabla plans, precios ni multiplicadores por plan.                                   |
| D04     | Enteros: users 0..1000; storageGb 0..10000; apiCalls 0..10000000. Guardas técnicas iniciales, no cuotas oficiales.                         |
| D05     | Persistir EUR y contexto de cálculo; no almacenar moneda de visualización, proveedor ni tasa FX.                                           |
| D06     | UNIQUE(country_code, tax_id_normalized); email y nombre no únicos; normalizar sin perder ceros iniciales.                                  |
| 002-C01 | SQLite, Drizzle ORM y better-sqlite3; drizzle-kit para generar SQL y tipos del driver cuando sean necesarios. No Prisma ni servidor de DB. |
| 002-C02 | Modelo exacto dentro de spec.md; no esperar un diccionario externo ausente.                                                                |
| 002-C03 | Conservar node:test y la integración existente. Bases temporales por test; no añadir Vitest/Supertest.                                     |
| 002-C04 | Histórico con snapshots explícitos, desglose JSON validado y triggers append-only; sin recálculo de tarifas/impuestos.                     |
| 002-C05 | Seed solo de clientes ficticios en base demo marcada; no simulaciones con impuestos inventados.                                            |
| 002-C06 | Migraciones explícitas, transaccionales, sin borrados/reset ni aplicación automática al arrancar API.                                      |
| 002-C07 | busy_timeout de 1000 ms; error explícito después, sin bucle de reintentos. Journal DELETE, sin activar WAL en esta fase.                   |

## Límites de las decisiones

Las políticas fiscales D01/D10, checksum/separadores D03 y funcionalidades de siguientes specs no se resuelven aquí.
El campo tax_rate_bps no aprueba ninguna tasa real; su rango técnico no sustituye la política fiscal.
No reinterpretar los fixtures DEMO como datos fiscales válidos.

## Coherencia con documentos generales

docs/decisions.md y docs/architecture.md están sincronizados con 002.
Las decisiones acordadas se conservan en ambos documentos.
MEMORY.md identifica 002 como spec activa.
La restricción a esta carpeta correspondía únicamente a la preparación documental anterior.
