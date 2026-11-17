# Verificación

## Entrega 010 — T03

DELIVERY-01 y QA-ALL-010 ejecutados desde exportación limpia del commit 33774eb, con pnpm/dependencias/Chromium propios y DB demo nueva. Arranque raíz y flujo alta→simulación→historial correctos, 276 pruebas generales y 36 E2E pasan. Se recuperaron restricciones de red y cleanup del harness; el fallo inicial queda documentado. Base original sin cambios por hash y fixtures/puertos cerrados. [Método, resultados e incidencias](../specs/010-delivery/validation.md#t03--ensayo-de-instalación-limpia). Mismo Windows/Node/npm, sin acreditar otro SO o máquina. T04/T05 y aceptación humana pendientes.

## Entrega 010 — T02

DOC-AUDIT-010: índice y registros pertinentes actualizados por autorización de Alex, con instrucciones canónicas enlazadas, retrospectivas identificadas, evidencia histórica/actual separada y prompts excluidos respetados. Dos pruebas documentales correctas; sin reejecución funcional. [Verificación, procedencia y límites](../specs/010-delivery/validation.md#t02--índice-y-evidencia-del-desarrollo-asistido). T03–T05 y aceptación humana final pendientes.

## Entrega 010 — T01

RF1/RF2/RF3 parciales: README técnico con necesidades/decisiones/SDD/IA, cuatro capturas reales y comando db:demo:setup para DB nueva. IT-DEMO-010 añade tres casos de persistencia/importes/snapshots, CLI y protección de destinos/rutas. 276 pruebas globales correctas; lint/typecheck/formato/build pasan. [Comandos, incidencias, capturas y límites](../specs/010-delivery/validation.md#t01--readme-técnico-y-demo-reproducible). T02–T05 y aceptación humana pendientes; ai-workspace excluido. No se acredita todavía instalación limpia.

## Calidad 009 — Cierre T05

RF1–RF6 conformes técnicamente dentro del alcance acordado. 273 pruebas globales y 36 E2E Chromium correctas, sin fallos esperados. Lint, TypeScript, formato, compilación y documentos pasan. 009-QA-01 resuelto; base de desarrollo sin cambios y recursos temporales cerrados/limpiados. FX real conserva la evidencia puntual de T02; el cierre usa fixtures. [Matriz final, comandos, resultados y límites](../specs/009-quality/validation.md#t05--verificación-final-y-cierre-técnico). Aceptación humana final pendiente. README definitivo, auditoría de entrega, checkout limpio y publicación corresponden a 010. Los registros siguientes conservan su alcance histórico.

## Calidad 009 — T04

009-QA-01 resuelto técnicamente mediante ajuste local de texto largo en el simulador y su confirmación. Cuatro regresiones con el mismo cliente largo pasan sin fallos esperados; las 14 pruebas visuales existentes también pasan. RF2 conforme dentro del alcance Chromium documentado. [Corrección, resultados y límites](../specs/009-quality/validation.md#t04--corrección-y-regresiones). T05 y aceptación humana final pendientes. Los apartados anteriores de ejecución se conservan como historial.

## 009 — T03

QA-A11Y-009 reejecuta las suites visuales y añade cuatro casos de carga/error/vacío, referencias accesibles, contenido largo y recuperación por teclado. Resultado, 14 casos correctos y cuatro fallos esperados por 009-QA-01, declarado al final tras pasar las comprobaciones previas. El runner devuelve código 0 con esa expectativa, mientras RF2 queda con cambios necesarios. T04 debe corregir el reflujo y retirar test.fail. [Evidencia, capturas y límites](../specs/009-quality/validation.md#t03--accesibilidad-y-responsive).

## 009 — T02

270 pruebas funcionales actuales correctas mediante test:unit, test:integration y test:web. Playwright ejecuta 32 casos correctos, con una nueva regresión de markup persistido y búsqueda literal. La comprobación del proveedor real usa apps/web/e2e/fx-live.mjs y se invoca explícitamente desde raíz con pnpm --filter @saas-o-matic/web exec node e2e/fx-live.mjs después de compilar API/shared. Reporte y captura bajo .cache/009-t02-fx-live. [Seguridad, resiliencia, FX real e incidencia de red](../specs/009-quality/validation.md#t02--flujos-resiliencia-seguridad-y-fx-real). T03–T05 pendientes.

## 009 — T01

Inventario de suites y matriz inicial en [validación T01](../specs/009-quality/validation.md#t01--inventario-entorno-y-matriz). Playwright descubre 31 casos en 8 archivos. Se ejecuta simulator-flow.spec.mjs como comprobación representativa de entorno/persistencia con FX controlado, conservando el runner y su aislamiento. Reejecución funcional completa, seguridad, FX real y accesibilidad corresponden a tareas posteriores. MEMORY.md y gate documental identifican 009 como spec activa.

## 008 — Cierre T05

E2E-SIMULATIONS-008 recorre alta→ficha→simulación→resultado→historial con fallo/reintento FX y precio del servidor distinto del preview. VISUAL-008 verifica cuatro anchos, estados, teclado/foco, layout ampliado/reflujo y contraste renderizado. Playwright ejecuta 31 casos, ocho nuevos de T05, conservando regresiones de 007 y 008. Helper de contraste compartido por ambas specs. [Evidencia y límites](../specs/008-simulator-ui/validation.md#t05--flujo-comercial-revisión-visual-y-cierre-global). Bases/puertos temporales por caso y proveedor FX controlado.

## 008 — T04

WEB-HISTORY-008 verifica retorno/paginación/contexto, comprobación incierta en otra pestaña, actualización/reintento y aviso de discrepancia conservado con importes EUR persistidos. Tres E2E nuevas con API/Vite/SQLite temporal y 12 pruebas de estado de navegación añadidas. El runner existente ejecuta 23 casos de navegador. [Resultados e incidencias](../specs/008-simulator-ui/validation.md#t04--integración-con-historial-y-recuperación). Revisión global de T05 pendiente.

## 008 — T02

WEB-SIM-01/02 y WEB-FX-008 verifican oráculos EUR, plan/metadata sin cargos, borrador inválido/overflow, conversión solo total, fechas/atribución, caché, errores/reintento, caducidad/foco y respuestas antiguas. Regresiones específicas impiden reintento por vaciar/corregir y mostrar tasa caducada al volver desde EUR. 247 pruebas globales correctas (125 componentes/transporte) y 16 E2E, con tres nuevas de T02: API/SQLite temporal y proveedor FX controlado. Cuatro anchos/geometría/capturas comprobados. [Evidencia y límites](../specs/008-simulator-ui/validation.md#t02--preview-desglose-y-conversión). Sin prueba externa nueva de CORS ni guardado de simulación.

## 008 — T01

WEB-SIM-01/02 comprueban borrador entero, fronteras, vacío/fracción/exceso y sincronización; WEB-CONFIG-008 distingue formato/compatibilidad, política fiscal del servidor y estados/reintentos/carreras/retorno. 235 pruebas globales correctas, incluidas 113 componentes/transporte. Dos E2E añadidas al runner existente: nueva pantalla con API/Vite/SQLite temporal, límites/teclado/retorno/ausencia FX y POST, y país fuera de política. Total 13 Playwright correctas; cuatro anchos sin desbordamiento. [Evidencia canónica y fallos corregidos](../specs/008-simulator-ui/validation.md#t01--pantalla-clienteconfiguración-e-inputs). Precio, FX y guardado no acreditados por T01.

## 007 — Cierre T05

pnpm test:e2e desde raíz compila API/shared y ejecuta 11 casos Playwright/Chromium: cuatro funcionales y siete visuales/teclado/contraste. DB/contexto propio por caso, puertos efímeros, migraciones/fixtures explícitos y limpieza de recursos. No requiere API/web personales arrancadas. Preparar navegador en instalación nueva con pnpm --filter @saas-o-matic/web test:e2e:install; caché local .cache/playwright. Resultados JSON/capturas/trazas bajo .cache/007-e2e. Vitest y node:test mantienen descubrimiento separado; pnpm test no incluye E2E.

209 pruebas globales y 11 E2E correctas; gates secuencial sin otros controles concurrentes. Revisados 320/390/768/1440, layout 200 %/reflujo equivalente, teclado/foco y contraste representativo; corregidos borde de controles y foco al paginar. [Resultados reales, fallos iniciales y límites](../ai-workspace/testing/007-customers-ui-t05.md). Solo Chromium local, sin certificación exhaustiva ni aceptación humana final.

## 007 — T04

WEB-DETAIL-API-01 valida identidad/DTO/snapshots/paginación y coherencia de importes guardados sin aplicar tarifas vigentes. WEB-DETAIL-01/WEB-STATE-01 cubren ficha/404/ID inválido, estados independientes, reintento, historial vacío/fuera de rango/query inválida, historyOffset/atrás/retorno y carreras/abortos. Formato EUR probado en cero y máximo entero seguro. Suite global 208 correcta; smoke Chromium con 21 registros temporales acredita historial 20/1/recarga, 503 independiente, retorno y alta→ficha. [Evidencia y límites](../ai-workspace/testing/007-customers-ui-t04.md). T05 conserva E2E mantenido y revisión exhaustiva pendientes.

## 007 — T03

WEB-API-02 y WEB-FORM-01 cubren POST de cinco campos/201/DTO, países del servidor, planes compartidos, validación local, errores asociados/foco, 422/409/503, envío único, red/timeout/201 ilegible, reintento explícito de configuración y aborto al desmontar. Pruebas de ruta verifican creación→ID persistido y cancelación/retorno conservando búsqueda y página. 49 pruebas de componentes/transporte y 171 globales correctas. Smoke Chromium con proxy/API/SQLite temporal comprueba 422 fiscal→corrección→201 persistido→listado y 409, a cuatro anchos sin desbordamiento. [Evidencia y límites](../ai-workspace/testing/007-customers-ui-t03.md). E2E mantenido y revisión exhaustiva corresponden a T05.

## 007 — T02

WEB-API-01 prueba URL/DTO/envelope, red, JSON/Content-Type, timeout de cuerpo, aborto y compatibilidad de campos históricos. WEB-SEARCH-01/WEB-STATE-01 cubren debounce 249/250 ms, URL/páginas, retorno/atrás/adelante, vacíos diferenciados, 503/reintento y respuesta antigua ignorada. Primera ejecución: 29 correctas/1 fallo por selección de role status del harness; corregido selector y repetición 30/30.

Smoke Chromium con API real/SQLite temporal de 21 clientes y proxy Vite en puertos aislados. Se comprueba configuración de destino 3000 y se sustituye solo el puerto del backend de pruebas. Cuatro anchos, búsqueda, paginación, retorno, recarga y recuperación 503 correctos. [Evidencia T02](../ai-workspace/testing/007-customers-ui-t02.md).

## 007 — T01

test:web conserva las 22 pruebas node:test de 006/smoke y añade componentes con Vitest/RTL en jsdom. test:node y test:components separan descubrimiento y limpieza. WEB-SHELL-01 cubre rutas, raíz/404, retorno, teclado, breadcrumbs y foco. Smoke Chromium independiente comprueba cuatro viewports y navegación/recarga; [evidencia T01](../ai-workspace/testing/007-customers-ui-t01.md).

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
