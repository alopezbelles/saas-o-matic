# Verificación

Desde raíz con pnpm 10.33.4 y Node 22 compatible. En PowerShell usar pnpm.cmd si es necesario.

| Comando               | Control                                                                      |
| --------------------- | ---------------------------------------------------------------------------- |
| pnpm test:unit        | Compila shared/API, prueba fixtures/tramos de 004 y contratos/fiscal de 003  |
| pnpm lint             | ESLint sin warnings                                                          |
| pnpm typecheck        | Compila shared y verifica tipos de todo el workspace y configuración Drizzle |
| pnpm format:check     | Prettier                                                                     |
| pnpm build            | Compila shared, API y web en orden workspace                                 |
| pnpm test:integration | Compila shared/API, prueba HTTP y SQLite real                                |
| pnpm test:web         | Compila web y prueba HTML/bundle HTTP                                        |
| pnpm test:gates       | Errores deliberados de tipos/lint/test devuelven no cero                     |
| pnpm test:docs        | Enlaces documentales, spec activa 004 y scripts                              |
| pnpm test             | Todas las suites anteriores, secuencialmente                                 |

No ejecutar test:gates en paralelo con lint/typecheck/build. No se usa passWithNoTests.
La integración crea contextos únicos en .cache/002-tests, cierra conexiones y retira únicamente esos directorios.
Nunca abre datos reales de desarrollo/demo. Los casos demo se ejecutan dentro de la misma área temporal.
Prueba límites contra shared, SQL directo, concurrencia, snapshots, migración fallida, seed, guardas y backup.
El CLI se prueba también desde raíz con un destino con espacios.
Los fixtures monetarios son técnicos; no son políticas fiscales ni pruebas de un motor de cálculo.

test:unit cubre fiscal/contratos de clientes, fixtures y cálculo de base por tramos de 004. No hay E2E de navegador, impuestos ni presupuesto completo. El smoke HTTP web no acredita accesibilidad.
Instalación con caché no equivale a otra máquina limpia.
Evidencias: [001](../specs/001-foundation/validation.md), [002](../specs/002-persistence/validation.md).

003 incorpora test:unit con tres casos agrupados de contrato/fiscal; integración incluye customers y lifecycle además de regresión 002.
El cierre SIGTERM se simula emitiendo el evento en proceso hijo e instrumentando el cierre real del driver; no equivale a probar entrega de una señal OS en Windows.
La migración de contacto se prueba partiendo del esquema 0000 con cliente referenciado por una simulación. También se verifica rollback si el grafo final es inválido.
[Resultados 003](../specs/003-customers-api/validation.md).

## 004 — T01

Desde raíz, pnpm test:unit compila shared/API, ejecuta pnpm --filter @saas-o-matic/shared test:unit y conserva pnpm --filter @saas-o-matic/api test:unit.
El runner de shared es node --test test/*.test.mjs; puede ejecutarse aisladamente tras pnpm --filter @saas-o-matic/shared build.
UT-FIX-004 verifica coherencia de datos esperados: fronteras, desglose, totales, países, casos sintéticos de redondeo/overflow, límites contra CONSUMPTION_LIMITS y vocabulario de errores. No importa un motor de facturación ni acredita RF implementados. Las pruebas productivas se añadirán con T02–T04.
El gate de contexto comprueba la línea de spec activa 004 y la existencia del destino, sin dar por válida una mención histórica de 003.

## 004 — T02

billing.test.mjs añade cinco tests productivos: oráculos independientes, desglose/JSON para 0..1000, marginales para 1..1000, rechazo runtime sin coerción y determinismo/aislamiento entre llamadas. Usa exports del build de shared; sin DB ni red.
Con los cinco tests de fixtures y tres de API, test:unit ejecuta 13 pruebas. RF1 queda probado; RF3/RF4 solo en su parte de tramos. No acredita impuestos ni quote. [Evidencia T02](../ai-workspace/testing/004-billing-t02.md).
