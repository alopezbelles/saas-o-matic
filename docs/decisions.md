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
Los códigos y tasas de fixtures técnicos no definen reglas fiscales. D03 corresponde a 003.

## Preparación 004

D01/D10 quedan concretadas para el motor pendiente: política simplificada demo-standard-v1 (ES 2100, FR 2000, DE 1900, GB 2000 bps), céntimos EUR, BigInt intermedio y half-up una vez sobre impuesto de la base completa. No fiscalidad real completa ni FX.
004-C01..C05: dominio puro en shared, política única de cuatro países, alcance sin HTTP/DB/UI/FX, entrada con tres consumos/país/política y salida con importes, desglose y versiones. D04 conserva límites de 002. Detalle y procedencia en [aclaraciones 004](../specs/004-billing/clarifications.md) y [ADR-005](../ai-workspace/decisions/ADR-005-billing-engine.md).
users-tiered-v1 es el identificador técnico inicial de los tramos existentes, definido durante la consolidación documental e implementado en T02. Impuestos y quote todavía no están implementados.
