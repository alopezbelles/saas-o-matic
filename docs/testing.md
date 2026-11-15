# Verificación

## 006 — T05: cierre global

Actualización posterior: Alex autorizó registrar ai-workspace tras T05; [resumen retrospectivo y salida real](../ai-workspace/testing/006-currency.md). La exclusión mencionada en el relato de ejecución describe el estado histórico, no la autorización vigente.

Lint/typecheck/build/test correctos: 122 pruebas (36 shared, 12 unitarios API, 49 integración, 22 web, 1 gates y 2 docs). Gates ejecutados secuencialmente. Dos pruebas nuevas componen cliente y conversión con fixtures, importes variables sin refetch y recuperación EUR. Primer lint detectó JS generado en apps/web/.cache; corregida exclusión ESLint a **/.cache/** y repetición correcta. MockTimers mantiene aviso experimental de Node 22.

Smoke CORS inconcluso: Edge headless falla por GPU del entorno, sin evidencia del proveedor. Sin E2E visual ni aceptación humana. [Resultados y límites](../specs/006-currency/validation.md#t05--revisión-y-regresión-global); sin registros ai-workspace por instrucción vigente.

## 006 — T04

test:web ejecuta 20 pruebas: nueve nuevas del cliente, ocho del parser, dos fixtures y smoke web. Transporte/reloj inyectados y MockTimers de node:test (aviso experimental en Node 22) verifican timeout sin esperar. Concurrencia, caducidad durante descarga, recuperación y respuestas tardías probadas. Sin proveedor real/CORS. [Evidencia T04](../specs/006-currency/validation.md#t04--cliente-http-y-caché).

## 006 — T03

test:web compila los módulos currency mediante apps/web/tsconfig.test.json en apps/web/.cache/currency-tests, ignorado por Git, y prueba el JavaScript real con node:test. Conserva el smoke Vite. Total 11 pruebas: 8 del parser, 2 fixtures y 1 smoke. Sin nuevas librerías ni comprobación de CORS. Primera ejecución falló por el default de reloj del helper de pruebas ante undefined; corregido el helper/caso explícito y repetición 11/11 correcta. [Evidencia T03](../specs/006-currency/validation.md#t03--validación-del-proveedor).

## 006 — T02

Ocho pruebas productivas nuevas de convertCurrency: oráculos USD/GBP, identidad EUR, half-up exacto, notación científica, entradas inválidas, límites de tasa, overflow e independencia. test:unit suma 36 shared y 12 API. [Evidencia T02](../specs/006-currency/validation.md#t02--conversión-pura). Sin validación de proveedor, transporte ni CORS en este alcance.

## 006 — T01

test:unit incorpora 3 pruebas de contratos/fixtures FX en shared (28 shared + 12 API). test:web incorpora 2 pruebas de fixtures del proveedor y conserva el smoke HTTP (3 en total). Verifican catálogo, errores y datos de prueba; no acreditan todavía conversión, validación externa, cliente HTTP o CORS. El gate documental identifica 006 como spec activa. [Evidencia T01](../specs/006-currency/validation.md#t01--contratos-catálogo-y-fixtures). Sin registro ai-workspace por indicación de Alex.

## 005 — T05: cierre global

Lint/typecheck/format:check/build/test pasan (código 0) con 90 pruebas: 25 shared, 12 unitarios API, 49 integración, 1 smoke web, 1 gates, 2 docs. Secuencia sin concurrencia de gates con otros controles de código.
Regresiones 001–004 conservadas, sin datos reales ni cambios de schema/dependencias. Smoke web no equivale a E2E de navegador o accesibilidad. [Evidencia global](../ai-workspace/testing/005-simulations-api-t05.md). Aceptación humana final pendiente; resultados parciales siguientes son históricos.

## 005 — T04

test:integration incorpora cinco pruebas de simulations-history.test.mjs y tres de billing-config.test.mjs; total 49 integración. test:unit conserva 37. Histórico paginado, total, orden con empates, vacío/404, validación previa, snapshots sin motor y DB busy/recovery probados; config sin DB/no-store y concordancia con motor/copia de reglas probadas.
Fallo inicial de fixture en test de DB ausente (Error genérico frente a 503 esperado) corregido a HttpError(503), sin alterar handler; focalizado repetido 15/15 y regresión 49/49. [Evidencia T04](../ai-workspace/testing/005-simulations-api-t04.md). Web/gates y suite completa reservados a T05.

## 005 — T03

test:integration incorpora simulations.test.mjs, siete pruebas HTTP nuevas; total 41 integración. test:unit mantiene 37. POST 201 después de commit; 400/413/415/422 antes de conexión, cliente ausente/país sin regla, DB lazy/busy y recuperación, rollback de fallo AFTER INSERT y privacidad de error/log.
La configuración/histórico HTTP siguen en 404 hasta T04; su implementación deberá actualizar esas expectativas explícitas del test de T03. [Evidencia T03](../ai-workspace/testing/005-simulations-api-t03.md).

## 005 — T02

test:integration incorpora simulations-service.test.mjs; 9 pruebas nuevas y 25 anteriores, total 34, sobre contextos temporales de SQLite. Comprueban cálculo/DTO, cero/máximos/países, repetición, fallos transaccionales, savepoints, bloqueo de segundo escritor, reapertura y conservación histórica. test:unit mantiene 37 pruebas. Sin endpoint de simulaciones todavía. [Evidencia T02](../ai-workspace/testing/005-simulations-api-t02.md).

## 005 — T01

test:unit incorpora apps/api/test/simulations-contract.test.mjs sin retirar pruebas anteriores. Siete tests UT-SIM-CONTRACT-005 prueban petición estricta, ausencia/extras, tres límites, rechazo sin coerción, UUID, paginación y regresión compartida de clientes.
InputError conserva reexport compatible al separarse; query.ts centraliza paginación sin cambiar defaults/rangos ni ceros iniciales. Contratos sin ORM, DB ni HTTP.
El gate documental exige 005 en la línea activa y un destino existente. Resultados reales en [validación 005](../specs/005-simulations-api/validation.md); [resumen en ai-workspace](../ai-workspace/testing/005-simulations-api-t01.md) añadido después por autorización de Alex.

Desde raíz con pnpm 10.33.4 y Node 22 compatible. En PowerShell usar pnpm.cmd si es necesario.

| Comando               | Control                                                                      |
| --------------------- | ---------------------------------------------------------------------------- |
| pnpm test:unit        | Compila shared/API; fixtures, tramos, dinero, impuestos y contratos/fiscal   |
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

test:unit cubre fiscal/contratos de clientes, fixtures y motor completo de 004. No hay E2E de navegador ni integración HTTP de presupuestos. El smoke HTTP web no acredita accesibilidad.
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

## 004 — T03

billing-tax.test.mjs añade seis pruebas de dinero/política y API incorpora dos de configuración real. test:unit conserva las anteriores: 16 shared y 5 API, 21 en total.
UT-MONEY-01 cubre half-up, tipos/rangos, intermediarios BigInt y overflow. UT-TAX-01 cubre cuatro países, versión, tasa cero, ausentes, política inválida y congelación. Sin DB ni HTTP. RF2/RF3 siguen parciales hasta T04. [Evidencia T03](../ai-workspace/testing/004-billing-t03.md).

## 004 — T05: verificación global

Estado posterior: normalización CRLF/LF autorizada y completada; todos los controles globales pasan con 59 pruebas. T05 cerrada técnicamente, sin aceptación humana final. [Corrección y evidencia](../ai-workspace/testing/004-billing-format-fix.md). El fallo descrito a continuación corresponde a la primera ejecución.

Lint/typecheck/build pasan y pnpm test completa 59 pruebas (30 unitarias, 25 integración, 1 web, 1 gates, 2 docs). Compatibilidad adicional: 4004 desgloses aceptados por validador de 002 sin DB.
format:check falla en 41 archivos ajenos por CRLF/LF confirmado; cierre global pendiente de normalización. [Evidencia global](../ai-workspace/testing/004-billing-t05.md). No confundir regresión correcta con todos los gates verdes ni aceptación humana.

## 004 — T04: detalle histórico

billing-quote.test.mjs añade nueve pruebas productivas. Total unitario: 25 shared (5 fixtures y 20 productivos) y 5 API; 30 pasan.
UT-INPUT-004 valida los tres consumos; UT-QUOTE-004 cubre salida, versiones, errores, suma segura, ausencia de cargos secundarios y redondeo único; UT-PROP-01 recorre 0..1000 en cuatro países (4004 combinaciones), con invariantes/JSON y aislamiento de llamadas. Sin DB ni HTTP. RF1..4 implementados y probados; regresión global reservada a T05. [Evidencia T04](../ai-workspace/testing/004-billing-t04.md).
