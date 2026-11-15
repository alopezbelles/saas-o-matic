# Decisiones

| ID      | Decisión                                                                                                 |
| ------- | -------------------------------------------------------------------------------------------------------- |
| D11     | Conservar pnpm 10.33.4, Node 22 y packages/shared.                                                       |
| D12     | Fuentes oficiales de producto no disponibles; no certificar revisión.                                    |
| 001-C01 | Pruebas con node:test, HTTP y Vite preview.                                                              |
| 001-C02 | Base de datos fuera de 001; implementada exclusivamente bajo alcance 002.                                |
| D02     | DEMO_BASIC y DEMO_PRO sin precios/multiplicadores de plan.                                               |
| D04     | Enteros: users 0..1000, storageGb 0..10000, apiCalls 0..10000000. Guardas técnicas, no cuotas oficiales. |
| D05     | Histórico EUR; sin persistir FX.                                                                         |
| D06     | UNIQUE(country_code, tax_id_normalized), nombre/email no únicos.                                         |
| 002-C01 | Drizzle ORM 0.45.4, better-sqlite3 12.11.1, drizzle-kit 0.31.11 y tipos 9.6.0.                           |
| 002-C02 | Modelos de 002 en su spec, indexados desde docs/data-model.md.                                           |
| 002-C03 | SQL STRICT finalizado tras generación; triggers append-only; runner transaccional con hashes.            |
| 002-C04 | Rutas restringidas a apps/api/data y .cache; tests necesitan contexto temporal propio.                   |
| 002-C05 | Seed de dos clientes ficticios, solo demo marcada; sin simulaciones ni políticas fiscales ficticias.     |
| 002-C06 | journal DELETE, timeout 1000 ms, sin retries infinitos. Backup del driver a archivo nuevo.               |

Fuente de D02/D04/D05/D06: decisiones delegadas y aceptadas por Alex antes de implementar 002; [detalle](../specs/002-persistence/clarifications.md).
Se eligió 12.11.1 porque tiene binario publicado Windows x64/Node ABI127; 13.2.0 declaraba compatibilidad pero no tenía ese asset.
D03 se concreta para clientes en [003 fiscal-rules](../specs/003-customers-api/fiscal-rules.md), sin censo/identidad. contact_name pasa a opcional para aceptar los cinco datos oficiales; migración nueva, datos antiguos conservados.
Los códigos y tasas de fixtures técnicos no definen reglas fiscales. D01/D10 siguen fuera del motor monetario; D03 corresponde a 003.
