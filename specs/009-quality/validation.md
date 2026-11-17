# Validación 009

T01–T02 completadas técnicamente. Flujos/resiliencia reejecutados, seguridad básica revisada y FX real comprobado desde Chromium. T03–T05 y aceptación humana final pendientes. Los registros anteriores conservan su fecha y alcance.

## Referencia histórica

008 cerró técnicamente con 273 pruebas globales y 31 E2E, dentro de sus límites documentados. Esa ejecución pertenece a 008 y no acredita por sí sola la validación de 009. [Evidencia anterior](../008-simulator-ui/validation.md#t05--flujo-comercial-revisión-visual-y-cierre-global).

## Matriz de ejecución prevista

| RF      | Tareas          | Evidencia prevista                                     | Resultado de 009                       |
| ------- | --------------- | ------------------------------------------------------ | -------------------------------------- |
| 009-RF1 | T01/T02/T04/T05 | QA-ENV-009, QA-FLOW-009, QA-REGRESSION-009, QA-ALL-009 | PARCIAL T02, suites y flujos correctos |
| 009-RF2 | T03/T04/T05     | QA-A11Y-009, QA-REGRESSION-009, QA-ALL-009             | NO EJECUTADO                           |
| 009-RF3 | T02/T04/T05     | QA-RESILIENCE-009, QA-REGRESSION-009, QA-ALL-009       | CONFORME escenarios T02                |
| 009-RF4 | T01/T05         | QA-MATRIX-009, QA-REVIEW-009                           | PARCIAL T01, matriz inicial            |
| 009-RF5 | T02/T04/T05     | QA-SECURITY-009, QA-REGRESSION-009                     | CONFORME revisión básica T02           |
| 009-RF6 | T02/T04/T05     | QA-FX-LIVE-009                                         | CONFORME comprobación real T02         |

## T02 — Flujos, resiliencia, seguridad y FX real

17 de noviembre de 2026, base 2bc6f81, Git inicial limpio. Alex autoriza T02 y las decisiones C01–C03. [Instrucción previa](plan.md#seguridad-básica-y-fx-real). Se mantienen exclusión ai-workspace y datos existentes. T03–T05 y aceptación humana final pendientes.

### QA-FLOW-009 y QA-RESILIENCE-009

| Área de la matriz del enunciado | Comprobación ejecutada                                                                                                   | Resultado                                    |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------- |
| §2A, clientes y control fiscal  | Contratos y familias fiscales, HTTP de alta, duplicados, búsquedas y límites                                             | Unit/API y clientes E2E correctos            |
| §2A, tramos/impuestos/consumos  | Fronteras, dinero/overflow, validación, país sin política, recálculo autoritativo                                        | Dominio y consumidores correctos             |
| §2A, persistencia y fallos      | Locks→503, rollback, inserción fallida→500 sanitizado, recuperación, histórico inmutable y versiones                     | 49 pruebas de integración correctas          |
| §2B, frontend y flujo comercial | Alta→ficha→simulación→resultado→historial, retorno/contexto, duplicados, 404/422/409/500/503 y formularios conservados   | Componentes/transporte y E2E correctos       |
| §2B, configuración/FX           | Incompatibilidad, caducidad/datos inválidos, respuestas tardías, reintento, fallback EUR y conversión del total guardado | Fixtures y pruebas de consumidores correctos |
| §2A/2B, guardado incierto       | Timeout/red/201 ilegible, comprobación del historial en otra pestaña, un commit real y ausencia de reenvío automático    | Componentes y E2E correctos                  |

pnpm.cmd test:unit devuelve código 0, 36 shared y 12 API unitarias. pnpm.cmd test:integration devuelve código 0, 49 correctas. pnpm.cmd test:web devuelve código 0, 22 node web y 151 componentes/transporte. Son 270 pruebas funcionales actuales. Salidas temporales .cache/009-t02-unit.txt, .cache/009-t02-integration.txt y .cache/009-t02-web.txt.

pnpm.cmd test:e2e devuelve código 0, 32 correctas sin retries/omisiones. Incluye un nuevo caso QA-SECURITY-009 y conserva los 31 existentes. Salida .cache/009-t02-e2e.txt. La suite también reejecutó sus casos visuales existentes. La revisión específica de accesibilidad y responsive de 009 se completará en T03.

### QA-SECURITY-009

| Control básico                           | Evidencia revisada/ejecutada                                                         | Resultado y alcance                                                                                                |
| ---------------------------------------- | ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------ |
| Entradas, campos extra, IDs y paginación | Parsers shared, control fiscal y pruebas HTTP antes de conexión DB                   | Rechazos y límites comprobados                                                                                     |
| Cuerpo/protocolo                         | json-body.ts, límite 32kb, 400/413/415 y pruebas existentes                          | Sin escritura ante payload rechazado                                                                               |
| SQL parametrizado                        | Repositorios y persistence, fixtures de búsqueda literal                             | Parámetros de consulta separados de SQL. sql.raw del schema usa constantes de planes/límites                       |
| Contenido persistido en UI               | Nuevo security.spec.mjs guarda markup, recarga ficha y busca SQL/comodines literales | Se muestra texto, no se crea imagen ni se ejecuta onerror, búsqueda con un solo resultado                          |
| Errores y logs                           | app.ts, errorHandler, IT-LIFECYCLE-01/PRIVACY-01 e IT-SIM-02                         | Mensajes sanitizados, logs limitados a requestId/method/status/code y error 500 sin SQL/stack/datos de cliente     |
| Navegación                               | Validación de returnTo y pruebas de ubicaciones                                      | Destino de retorno restringido al listado interno                                                                  |
| Secretos y datos versionados             | Inspección de .gitignore y escaneo de 357 archivos de texto versionados              | Cero coincidencias para patrones de clave privada y tokens seleccionados. Ningún .env real o archivo DB versionado |
| Privacidad FX                            | Cliente/contratos, pruebas existentes y petición real observada                      | GET al endpoint fijo, sin cuerpo, cookies, Authorization o Referer                                                 |

Escaneo con salida .cache/009-t02-security-scan.json, que registra conteos y nombres de candidatos, sin valores de secretos. El resultado cubre los patrones concretos inspeccionados en archivos versionados. La revisión es básica y no representa un análisis exhaustivo de secretos/historial, vulnerabilidades de dependencias o una auditoría certificada.

### QA-FX-LIVE-009

Se añade apps/web/e2e/fx-live.mjs para una comprobación explícita con red. La suite determinista descubre solo *.spec.mjs. El script reutiliza el entorno API/Vite/SQLite temporal, abre Chromium sin interceptar FX, comprueba USD/GBP contra la tasa recibida y el conversor compartido y registra metadatos de red seleccionados. Conserva reporte y captura en .cache/009-t02-fx-live.

Comando desde apps/web, node e2e/fx-live.mjs, equivalente a pnpm.cmd --filter @saas-o-matic/web exec node e2e/fx-live.mjs desde raíz, después de compilar API/shared. El primer intento recibió net::ERR_NETWORK_ACCESS_DENIED del sandbox, conservó 169,40 EUR y mostró reintento. Salida .cache/009-t02-fx-live.txt. La repetición con red fuera del sandbox, autorizada por la revisión automática, devuelve código 0. Salida .cache/009-t02-fx-live-network.txt.

Consulta correcta el 17 de noviembre de 2026 a las 11:19:40–11:19:43 UTC. Endpoint https://open.er-api.com/v6/latest/EUR, HTTP 200 y Access-Control-Allow-Origin *. Con base de 16940 céntimos EUR, tasas observadas USD 1.100615 y GBP 0.834349. La pantalla mostró 186,44 USD y 141,34 GBP, fecha y atribución del proveedor. Cambio USD→GBP reutilizó la misma consulta. Actualización del proveedor 17 de noviembre a las 00:02:31 UTC y caducidad 18 de noviembre a las 00:19:41 UTC.

La petición observada fue un único GET, sin cuerpo, cookies, Authorization o Referer. Reporte .cache/009-t02-fx-live/report.json y captura simulator-gbp.png inspeccionada. El resultado corresponde a esa consulta puntual y a la validez de las tasas recibidas.

### Revisión y límites de T02

Revisión técnica de T02 conforme en su alcance. No se han observado defectos de aplicación nuevos que requieran corrección de producto. La incidencia inicial de red y su repetición correcta quedan registradas. El escaneo de seguridad y las pruebas conservaron el aislamiento y se observó .cache/002-tests sin directorios residuales después de las ejecuciones.

pnpm.cmd lint, test:docs (2/2), format:check y git diff --check correctos tras actualizar documentación. Las suites ejecutadas compilan sus consumidores. Los comandos separados pnpm typecheck, pnpm build, pnpm test y test:gates no se han ejecutado en T02. Los controles globales de cierre corresponden a T05.

Código de producto, schema, dependencias y datos existentes conservados. Cambios de código limitados al caso de seguridad y la comprobación FX explícita. Registro ai-workspace excluido. Cierre global de controles en T05, revisión específica de accesibilidad en T03 y correcciones que se deriven en T04.

## T01 — Inventario, entorno y matriz

17 de noviembre de 2026, base bb8557a, Git inicial limpio. Alex autoriza T01. [Instrucción previa](plan.md#partir-del-estado-existente). Node v22.19.0 y pnpm 10.33.4 comprobados. Se actualizan MEMORY.md y el gate documental a 009. Sin nuevas dependencias ni cambios de aplicación, datos existentes o ai-workspace.

### QA-ENV-009 — Inventario verificado

| Capa            | Descubrimiento y responsabilidad                                                        | Situación en T01                                                        |
| --------------- | --------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| shared          | 6 archivos test/*.test.mjs, contratos FX, tramos, impuestos, quote y dinero             | Inventariados. Reejecución de dominio en T02                            |
| API unit        | 4 archivos explícitos en test:unit, fiscal, contratos y política fiscal                 | Inventariados. Reejecución en T02                                       |
| API integración | 9 archivos explícitos en test:integration, HTTP/DB/lifecycle/simulaciones/configuración | Inventariados. Reejecución completa en T02                              |
| Web node        | 5 archivos test/*.test.mjs, smoke y cliente/contrato/composición FX                     | Inventariados. Reejecución en T02                                       |
| Web Vitest/RTL  | 18 archivos src/**/*.test.{ts,tsx}, jsdom y setup existentes                            | Inventariados. Revisión de flujos en T02 y accesibilidad en T03         |
| Playwright      | 31 casos en 8 archivos e2e/*.spec.mjs, Chromium, un worker, retries 0                   | Descubrimiento ejecutado. Un caso representativo correcto               |
| Gates y docs    | test/gates.test.mjs y test/docs.test.mjs                                                | Referencia activa de docs actualizada. Gates global reservado al cierre |

pnpm test encadena unit, integración, web, gates y docs. pnpm test:e2e se ejecuta aparte y compila API/shared. Vitest descubre únicamente src y Playwright únicamente e2e, sin doble descubrimiento. Los límites de ejecución se conservaron.

El entorno usa createTestContext, DB marcada propia bajo .cache/002-tests/case-*, migración/seed explícitos y puertos efímeros de API/Vite. El proxy conserva /api y cambia solo el destino al puerto temporal. El fixture cierra Vite/API/DB antes de eliminar su directorio, comprobando pertenencia a la raíz y prefijo del contexto. El runner fija la caché Chromium bajo .cache/playwright y propaga el código de salida del proceso hijo.

Comandos ejecutados con código 0, pnpm.cmd --filter @saas-o-matic/web test:e2e --list (31 casos/8 archivos), pnpm.cmd --filter @saas-o-matic/api... build y pnpm.cmd --filter @saas-o-matic/web test:e2e simulator-flow.spec.mjs (1 caso correcto). El caso recorre alta→ficha→simulación→resultado→historial, cambio fiscal de fixture y fallo/reintento FX interceptado. Acredita que el entorno existente arranca y permite verificar persistencia. No constituye reejecución de las 273 pruebas o los 31 E2E completos.

Salidas temporales .cache/009-t01-e2e-list.txt y .cache/009-t01-environment.txt. El runner conserva su reporte vigente en .cache/007-e2e/report.json, que se sobrescribe en cada ejecución. Tras terminar el flujo se observó .cache/002-tests sin directorios residuales.

pnpm.cmd lint, pnpm.cmd test:docs (2/2), pnpm.cmd format:check y git diff --check correctos. La compilación ejecutada es la de API/shared para el entorno E2E. Typecheck global, build global, pnpm test, test:gates y los 31 E2E completos no se han ejecutado en T01. No se añaden pruebas ni se modifican fixtures o código de producto al disponer del entorno necesario.

### QA-MATRIX-009 — Requisitos del enunciado

Fuente consultada, Prueba Devs con IA.pdf aportado por Alex. Los apartados siguientes describen requisitos reales del documento. Las comprobaciones automatizadas anteriores a 009 pertenecen al cierre de 008. En T01 se inventaría cobertura y se ejecuta únicamente el caso representativo indicado.

| Requisito del PDF                                               | Implementación existente                                                                                                                                         | Cobertura reutilizable                                                                                                                                                             | Resultado actual y siguiente comprobación                                                                              |
| --------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| §2, frontend/backend/SQLite comunicados                         | [createApp](../../apps/api/src/app.ts), [conexión DB](../../apps/api/src/db/connection.ts), [rutas web](../../apps/web/src/app/AppRoutes.tsx)                    | [Flujo comercial](../../apps/web/e2e/simulator-flow.spec.mjs), [integración DB](../../apps/api/test/database.test.mjs)                                                             | Flujo representativo correcto en T01. Integración completa en T02                                                      |
| §2A, POST /customers y cinco datos                              | [Servicio clientes](../../apps/api/src/features/customers/service.ts), [controlador](../../apps/api/src/features/customers/controller.ts)                        | [Contratos](../../apps/api/test/customers-contract.test.mjs), [HTTP clientes](../../apps/api/test/customers.test.mjs)                                                              | Alta positiva ejecutada en T01. Negativos y límites en T02                                                             |
| §2A, control DNI/NIF/CIF español                                | [Dominio fiscal](../../apps/api/src/features/customers/domain/tax-id.ts)                                                                                         | [Fiscal](../../apps/api/test/tax-id.test.mjs), [fixtures independientes](../../apps/api/test/tax-id-fixtures.mjs)                                                                  | Cobertura localizada. Revisión de familias y controles en T02                                                          |
| §2A, POST /simulations y persistencia del cálculo/consumos      | [Servicio](../../apps/api/src/features/simulations/service.ts), [repositorio](../../apps/api/src/features/simulations/repository.ts)                             | [HTTP simulaciones](../../apps/api/test/simulations.test.mjs), [servicio/transacción](../../apps/api/test/simulations-service.test.mjs), flujo comercial                           | Persistencia y recarga del caso representativo correctas. Locks/rollback/negativos en T02                              |
| §2A, tramos acumulativos 10/8/5 euros e impuesto por país       | [Tramos](../../packages/shared/src/billing/tiers.ts), [política fiscal](../../apps/api/src/config/tax-policy.ts)                                                 | [Quote](../../packages/shared/test/billing-quote.test.mjs), [impuestos](../../packages/shared/test/billing-tax.test.mjs), [preview](../../apps/web/e2e/simulator-preview.spec.mjs) | Caso de 15 usuarios y cambio fiscal probado en T01. Fronteras/países en T02                                            |
| §2B, API pública de divisas y cambio dinámico EUR/USD/GBP       | [Cliente FX](../../apps/web/src/features/currency/exchange-client.ts), [adaptación React](../../apps/web/src/features/simulations/useExchangeRates.ts)           | [Cliente FX](../../apps/web/test/currency-client.test.mjs), preview/flujo E2E                                                                                                      | Fallo/reintento y conversión con fixture correctos en T01. Proveedor real/CORS pendientes de T02                       |
| §2B, búsqueda por empresa o identificador fiscal                | [Repositorio clientes](../../apps/api/src/features/customers/repository.ts), [listado](../../apps/web/src/features/customers/pages/CustomersPage.tsx)            | [Clientes E2E](../../apps/web/e2e/customers.spec.mjs), [componentes listado](../../apps/web/src/features/customers/pages/CustomersPage.test.tsx)                                   | Inventariada. Búsquedas y paginación en T02                                                                            |
| §2B, cards responsive e historial guardado                      | [Ficha](../../apps/web/src/features/customers/pages/CustomerDetailPage.tsx), [historial](../../apps/web/src/features/customers/components/SimulationHistory.tsx) | [Historial E2E](../../apps/web/e2e/simulator-history.spec.mjs), [visual 007](../../apps/web/e2e/visual.spec.mjs)                                                                   | Ficha/historial del caso correctos. Estados/retorno en T02, cuatro anchos en T03                                       |
| §2B, controles dinámicos y proyección mensual                   | [Inputs](../../apps/web/src/features/simulations/components/ConsumptionInputs.tsx), [preview](../../apps/web/src/features/simulations/useSimulationQuote.ts)     | [Setup](../../apps/web/e2e/simulator-setup.spec.mjs), preview y [visual 008](../../apps/web/e2e/simulator-visual.spec.mjs)                                                         | Inputs/precio/guardado representativos correctos. Fronteras en T02, teclado/foco en T03                                |
| §1 y §4, control de arquitectura, calidad y seguridad           | Separación dominio/transporte/repositorios y validación existentes                                                                                               | Suites anteriores, revisión QA-SECURITY-009 y controles de código                                                                                                                  | Arquitectura localizada. Revisión básica de seguridad pendiente de T02 y controles globales de T05                     |
| §3 y §4, planificación, arquitectura e interacción IA           | [Specs](../../docs/traceability.md), [directrices](../../AGENTS.md), [índice IA](../../ai-workspace/README.md)                                                   | Registros canónicos y evidencia técnica de cada tarea                                                                                                                              | Matriz técnica en 009. Organización/completado del índice y entrega de evidencias en 010, con autorización de registro |
| §3 y §4, repositorio público e instrucciones de ejecución local | [README](../../README.md) y scripts existentes                                                                                                                   | Ensayo de checkout limpio y revisión del paquete                                                                                                                                   | Asignado a 010. Visibilidad, instalación y arranque limpio sin comprobar en T01                                        |

### Huecos y trabajo asignado

- T02 debe reejecutar suites funcionales relevantes y revisar la cobertura de errores, transacciones, límites, fiscal y FX. Sus resultados no se deducen del único flujo de T01.
- La seguridad básica y la comprobación FX real aprobadas en C01/C03 carecen todavía de evidencia de 009. Se asignan a T02, incluyendo resultado externo limitado o fallido si procede.
- T03 revisará responsive/teclado/foco/contraste y ampliación en Chromium. Las capturas y medidas de 008 son evidencia histórica.
- T04 corregirá defectos reproducibles encontrados. En T01 no se ha identificado un defecto de aplicación nuevo que requiera cambios de producto.
- T05 completará la matriz con resultados actuales y controles globales. El cambio de contexto del gate documental, antes fijado a 008, queda resuelto en T01.
- 010 conserva README definitivo, índice/paquete de evidencias, checkout limpio y preparación de publicación. La exclusión vigente de ai-workspace continúa.

## Registro por tarea

Al ejecutar una tarea, registrar fecha, versión identificable, entorno, comandos exactos y códigos de salida. Enlazar suites/casos concretos, archivos de salida y capturas reales pertinentes. Distinguir pruebas existentes reejecutadas de nuevas regresiones.

Para cada defecto, indicar reproducción, comportamiento esperado, impacto, cambio y verificación. Si no se encuentran defectos, registrar la revisión realizada. Los casos no ejecutados y los fallos deben conservar su estado real.

Las salidas temporales podrán usar .cache/009-*. El reporte/capturas del runner vigente están en .cache/007-e2e. Declarar la naturaleza efímera de estos artefactos. Mantener ai-workspace excluido hasta nueva autorización.

## Límites que deberá declarar el cierre

Navegadores y dispositivo/viewport realmente revisados. Diferencia entre zoom nativo y layout ampliado. Alcance de contraste/teclado y uso efectivo de lector de pantalla. FX controlado frente a proveedor real. Documentos oficiales disponibles y ausentes. Recursos temporales, cleanup y defectos pendientes.

La comprobación FX real registrará conversión/CORS observados y limitaciones externas. Un fallo del proveedor no se convertirá en éxito por tener fixtures correctos. La matriz incorporará los requisitos del enunciado completo aportado por Alex. Los ensayos de checkout limpio y el cierre del paquete de entrega se documentarán en 010.

## Revisión

T01 CUMPLE TÉCNICAMENTE para inventario, matriz y entorno. Veredicto global de 009 pendiente de T02–T05. Aceptación humana final pendiente. Las comprobaciones de preparación siguientes conservan su fecha y alcance propios.

## Revisión documental de preparación

17 de noviembre de 2026. Revisados los cinco documentos frente a scripts, suites, fixtures, estado de 008 y documentos canónicos. Retiradas referencias a requisitos sin correspondencia y rutas de pruebas inexistentes. Aclarada la diferencia entre cobertura heredada, auditoría de 009 y aceptación humana.

pnpm.cmd test:docs devuelve código 0 con 2 pruebas correctas. pnpm.cmd exec prettier --check specs/009-quality devuelve código 0. Las suites funcionales, E2E y controles de código no se han reejecutado en esta preparación documental. Solo se modifican estos cinco documentos y se mantiene la exclusión de ai-workspace.
