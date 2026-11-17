# Validación 009

T01–T05 completadas técnicamente. 009-QA-01 resuelto. Cierre con 273 pruebas globales y 36 E2E correctas, controles de código y documentos correctos. Aceptación humana final pendiente. Registro ai-workspace excluido; entrega reproducible y publicación corresponden a 010.

## Referencia histórica

008 cerró técnicamente con 273 pruebas globales y 31 E2E, dentro de sus límites documentados. Esa ejecución pertenece a 008 y no acredita por sí sola la validación de 009. [Evidencia anterior](../008-simulator-ui/validation.md#t05--flujo-comercial-revisión-visual-y-cierre-global).

## Matriz de requisitos

| RF      | Tareas          | Evidencia prevista                                     | Resultado de 009                                  |
| ------- | --------------- | ------------------------------------------------------ | ------------------------------------------------- |
| 009-RF1 | T01/T02/T04/T05 | QA-ENV-009, QA-FLOW-009, QA-REGRESSION-009, QA-ALL-009 | CONFORME T05, 273 pruebas globales y 36 E2E       |
| 009-RF2 | T03/T04/T05     | QA-A11Y-009, QA-REGRESSION-009, QA-ALL-009             | CONFORME alcance Chromium T04, 009-QA-01 resuelto |
| 009-RF3 | T02/T04/T05     | QA-RESILIENCE-009, QA-REGRESSION-009, QA-ALL-009       | CONFORME escenarios T02                           |
| 009-RF4 | T01/T05         | QA-MATRIX-009, QA-REVIEW-009                           | CONFORME T05, matriz final y límites explícitos   |
| 009-RF5 | T02/T04/T05     | QA-SECURITY-009, QA-REGRESSION-009                     | CONFORME revisión básica T02                      |
| 009-RF6 | T02/T04/T05     | QA-FX-LIVE-009                                         | CONFORME comprobación real T02                    |

## T05 — Verificación final y cierre técnico

17 de noviembre de 2026, base df8202d y Git inicial limpio. Alex autoriza T05. [Instrucción previa](plan.md#secuencia). Entorno Windows, Node 22.19.0 y pnpm 10.33.4. Esta tarea revisa el código resultante de T04; no añade funcionalidades, dependencias, cambios monetarios o migraciones.

### QA-ALL-009 — Controles sobre el código de cierre

Desde la raíz se ejecutan secuencialmente pnpm.cmd lint, pnpm.cmd typecheck, pnpm.cmd format:check, pnpm.cmd build y pnpm.cmd test; todos devuelven código 0. test:gates se ejecuta dentro de test sin otros controles de código concurrentes. Las 273 pruebas pasan: 36 shared, 12 API unitarias, 49 integración SQLite/HTTP, 22 web node:test, 151 componentes/transporte, un gate negativo y dos documentales. Las pruebas negativas comprueban rechazo de entradas/errores y el gate verifica que los controles detectan defectos introducidos en su contexto temporal.

Salidas reproducibles y efímeras en .cache/009-t05-lint.txt, .cache/009-t05-typecheck.txt, .cache/009-t05-format-check.txt, .cache/009-t05-build.txt y .cache/009-t05-test.txt. No se realiza una instalación desde cero; ese ensayo corresponde a 010.

pnpm.cmd test:e2e devuelve código 0: 36 pruebas Chromium passed, sin fallos esperados, omitidos o inestables. Incluye flujo comercial, recuperación API/FX, guardado incierto, contenido persistido y las cuatro regresiones del nombre largo. Salida .cache/009-t05-test-e2e.txt; reporte y capturas en .cache/007-e2e/report.json y results. La suite utiliza API/Vite/SQLite temporales y cierra esos recursos al finalizar.

Inventario SHA-256 de los archivos existentes en apps/api/data antes/después: un archivo de desarrollo, sin diferencias. La primera comparación PowerShell envolvía el array JSON en otro array y notificó diferencias de estructura; se corrigió la lectura y se verificaron ruta/hash iguales. No se conecta a esa base ni se ejecutan migraciones sobre ella. .cache/002-tests queda sin directorios residuales. Resumen en .cache/009-t05-summary.json e inventario inicial en .cache/009-t05-data-before.json, sin contenido de registros. Git no presenta cambios de código, lockfile, schema, migraciones o ai-workspace en T05.

Veredicto global de 009: CUMPLE TÉCNICAMENTE dentro del alcance y límites acordados. 009-QA-01 está resuelto y no quedan defectos bloqueantes identificados durante esta revisión. QA-ALL-009 y QA-REVIEW-009 completados; aceptación humana final pendiente.

Después de actualizar memoria, tareas, matriz y trazabilidad, pnpm.cmd format:check y pnpm.cmd test:docs vuelven a pasar con código 0 y dos pruebas documentales, sin enlaces rotos. Salidas .cache/009-t05-format-final.txt y .cache/009-t05-docs-final.txt. git diff --check sin errores. Las modificaciones de T05 son documentales; no se han realizado commits/pushes ni publicación.

### QA-REVIEW-009 — Matriz final del enunciado

La matriz inicial de T01 se conserva como inventario histórico. Este cierre relaciona los apartados del enunciado aportado con las suites reejecutadas y las revisiones realizadas durante 009:

| Apartado del enunciado                                                      | Código y pruebas concretas                                                                                                                                                                                                                                                                           | Evidencia de 009                                                                                                                        |
| --------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| §2, comunicación frontend/backend/SQLite                                    | [Flujo comercial](../../apps/web/e2e/simulator-flow.spec.mjs), [integración DB](../../apps/api/test/database.test.mjs)                                                                                                                                                                               | Suites globales y E2E de QA-ALL-009                                                                                                     |
| §2A, alta con cinco datos, DNI/NIF/CIF y duplicados                         | [Contratos](../../apps/api/test/customers-contract.test.mjs), [fiscal](../../apps/api/test/tax-id.test.mjs), [HTTP](../../apps/api/test/customers.test.mjs), [clientes E2E](../../apps/web/e2e/customers.spec.mjs)                                                                                   | Unitarias, integración y flujo real con fixtures independientes                                                                         |
| §2A, simulaciones persistidas y facturación acumulativa 10/8/5 más impuesto | [Quote](../../packages/shared/test/billing-quote.test.mjs), [impuestos](../../packages/shared/test/billing-tax.test.mjs), [HTTP](../../apps/api/test/simulations.test.mjs), [servicio/transacción](../../apps/api/test/simulations-service.test.mjs)                                                 | Fronteras, dinero entero, impuesto, límites, rollback y recálculo autoritativo                                                          |
| §2B, búsqueda por empresa/identificador                                     | [Listado](../../apps/web/src/features/customers/pages/CustomersPage.test.tsx), [clientes E2E](../../apps/web/e2e/customers.spec.mjs), [búsqueda literal/markup](../../apps/web/e2e/security.spec.mjs)                                                                                                | Búsqueda, paginación, contexto y contenido persistido seguro                                                                            |
| §2B, cards/historial responsive y controles dinámicos                       | [Historial](../../apps/web/e2e/simulator-history.spec.mjs), [preview](../../apps/web/e2e/simulator-preview.spec.mjs), [visual 007](../../apps/web/e2e/visual.spec.mjs), [visual 008](../../apps/web/e2e/simulator-visual.spec.mjs), [estados y texto largo](../../apps/web/e2e/a11y-states.spec.mjs) | Cuatro anchos, teclado, foco, ampliación CSS/reflujo y 009-QA-01 corregido                                                              |
| §2B, divisas mediante API pública                                           | [Cliente FX](../../apps/web/test/currency-client.test.mjs), preview/flujo E2E y [smoke explícito](../../apps/web/e2e/fx-live.mjs)                                                                                                                                                                    | Fixtures en cierre; [HTTP/CORS y USD/GBP reales en T02](#qa-fx-live-009)                                                                |
| §1/§4, arquitectura, calidad y seguridad                                    | Capas existentes, controles globales y [revisión básica](#qa-security-009)                                                                                                                                                                                                                           | Entradas, SQL parametrizado, errores/logs y privacidad revisados; no auditoría exhaustiva                                               |
| §3/§4, planificación y trabajo con IA                                       | [Specs y trazabilidad](../../docs/traceability.md), [directrices](../../AGENTS.md), validaciones por tarea                                                                                                                                                                                           | Evidencia técnica canónica disponible. Completar/organizar paquete e índice de auditoría corresponde a 010; ai-workspace sigue excluido |
| §3/§4, repositorio público e instrucciones reproducibles                    | README definitivo, instalación desde checkout limpio y preparación de publicación                                                                                                                                                                                                                    | Pendiente de 010. No se certifica la entrega completa ni se publica desde 009                                                           |

### Límites y transferencia a 010

La revisión de interfaz se limita a Chromium, anchos CSS 320/390/768/1440, teclado/foco, asociaciones accesibles y contraste representativo. La ampliación usa CSS al 200 % y viewport equivalente; no zoom nativo ni lector de pantalla u otros navegadores. El smoke FX real de T02 fue puntual y no garantiza disponibilidad futura ni CORS en un dominio de producción. En T05 se usan fixtures deterministas y no se repite la consulta externa. La revisión de seguridad no incluye pentest, análisis exhaustivo de secretos/historial ni auditoría de vulnerabilidades de dependencias.

010 conserva README definitivo, índice/organización de evidencias con autorización de registro, ensayo de checkout limpio y preparación revisable de publicación/despliegue. No se ha ejecutado ese trabajo en 009. La aceptación humana de Alex sigue pendiente y no se deduce de las pruebas técnicas.

## T04 — Corrección y regresiones

17 de noviembre de 2026, base c1e0bae, Git inicial limpio. Alex autoriza T04. [Instrucción previa](plan.md#secuencia). Se corrige 009-QA-01 con una clase CSS local del simulador: overflow-wrap:anywhere permite cortar palabras largas y min-width:0 evita imponer un ancho mínimo de contenido. El estilo se hereda también en la confirmación del guardado. No se trunca el nombre ni se modifican sus límites, contratos, importes o datos existentes.

QA-REGRESSION-009 extiende los cuatro casos de a11y-states.spec.mjs: el mismo cliente con nombre válido de 200 caracteres recorre ficha, simulador, fallo FX con reserva EUR, guardado confirmado e historial. Se retiran las cuatro declaraciones test.fail. La aserción final exige documento de ancho menor o igual al viewport y nombre completo visible. Las comprobaciones de asociaciones accesibles y geometría también pasan durante la confirmación.

Primera comprobación focalizada: pnpm.cmd --filter @saas-o-matic/api... build y pnpm.cmd --filter @saas-o-matic/web test:e2e visual.spec.mjs simulator-visual.spec.mjs a11y-states.spec.mjs. Código 0, 18 casos passed, sin fallos esperados, omitidos o inestables. Salidas .cache/009-t04-build-api.txt y .cache/009-t04-visual.txt. Se inspeccionan capturas reales de la confirmación a 320 px y del simulador a 1440 px: nombre completo ajustado, tarjetas y acciones dentro del ancho. Los cuatro anchos 320/390/768/1440 pasan las aserciones de reflujo.

Controles desde raíz, pnpm.cmd lint, pnpm.cmd typecheck, pnpm.cmd build y pnpm.cmd test, todos con código 0. La suite general pasa 273 pruebas: 36 shared, 12 API unitarias, 49 integración, 22 web node:test, 151 componentes, un gate negativo y dos documentales. test:gates se ejecuta sin otros controles de código concurrentes. Salidas .cache/009-t04-lint.txt, .cache/009-t04-typecheck.txt, .cache/009-t04-build.txt y .cache/009-t04-test.txt.

Regresión completa pnpm.cmd test:e2e, código 0 y 36 casos passed, cero fallos esperados, omitidos o inestables; salida .cache/009-t04-e2e.txt y reporte .cache/007-e2e/report.json. El runner finaliza y .cache/002-tests queda sin directorios residuales. pnpm.cmd format:check y pnpm.cmd test:docs pasan, dos pruebas documentales; git diff --check sin errores. Salidas .cache/009-t04-format.txt y .cache/009-t04-docs.txt. Artefactos de caché efímeros, regenerables con los comandos indicados.

Veredicto T04 CUMPLE TÉCNICAMENTE. No quedan defectos bloqueantes identificados por T02–T03. El registro histórico de T03 conserva la reproducción y las medidas anteriores. La comprobación de FX real de T02 no se repite para este cambio CSS. Chromium y los métodos de ampliación de T03 conservan sus límites; no se acredita zoom nativo, lector de pantalla u otros navegadores. La aceptación humana final y T05 siguen pendientes. Sin registro ai-workspace por indicación de Alex.

## T03 — Accesibilidad y responsive

17 de noviembre de 2026, base 06f8dda, Git inicial limpio. Alex autoriza T03. [Instrucción previa](plan.md#secuencia). Se reutilizan VISUAL-007/008 y se añaden cuatro casos QA-A11Y-009 en a11y-states.spec.mjs, uno por ancho. Revisión de T03 ejecutada, RF2 con CAMBIOS NECESARIOS y corrección asignada a T04.

### QA-A11Y-009 — Cobertura ejecutada

Los 14 casos visuales existentes pasan. Comprueban listado/alta/ficha, preview/error/resultado/historial, anchos 320/390/768/1440, teclado, foco, labels/errores, contraste renderizado, layout CSS al 200 % y reflujo equivalente. Los cuatro casos nuevos recorren carga retenida y error 503 del listado, reintento con Enter, resultados con nombre largo, búsqueda vacía, resumen de errores de alta y enlace al campo con teclado, ficha con nombre de 200 caracteres/email largo e historial vacío, fallo FX, confirmación y retorno a historial. El tramo FX/confirmación usa el cliente corto de fixture para revisar esos estados sin quedar bloqueado por 009-QA-01. Después se comprueba el simulador del cliente largo y se reproduce el defecto.

En los estados previos al fallo conocido se verificaron IDs únicos, referencias aria-labelledby/aria-describedby existentes, etiquetas asociadas a campos, descripción de controles inválidos y una sola región main/h1. Las snapshots de estructura accesible del resumen y del historial se adjuntan al reporte. Esto revisa asociaciones y semántica observables en Chromium.

Capturas representativas inspeccionadas de alta con errores y ficha larga a 320 px, simulador largo a 1440 px y estados del simulador existentes. Los formularios y cards largos conservan reflujo. El contexto largo del simulador produce desbordamiento. Los controles habituales y la recuperación de foco de las rutas revisadas se verificaron mediante teclado.

Medidas actuales del reporte, texto representativo entre 5,749:1 y 14,102:1, bordes de campos/select 3,628:1 y foco de acción 9,357:1. El total destaca con 6,084:1 y los errores inline con 6,574:1. Se reutiliza contrast.mjs.

### 009-QA-01 — Nombre de empresa largo desborda el simulador

Estado RESUELTO técnicamente en [T04](#t04--corrección-y-regresiones). La siguiente reproducción corresponde al estado anterior revisado en T03. Entrada válida de 200 caracteres, companyName igual a «Empresa » seguido de 192 letras W. Crear cliente y abrir /customers/:id/simulations/new. El nombre se presenta en el párrafo de contexto de SimulationCreatePage dentro de layout.intro. La palabra sin cortes aumenta el ancho mínimo del grid y desplaza contenido y acciones fuera del viewport.

| Viewport CSS | Ancho de documento observado |
| ------------ | ---------------------------- |
| 320          | 2886                         |
| 390          | 2886                         |
| 768          | 2894                         |
| 1440         | 3038                         |

Resultado esperado, el nombre completo debe poder ajustarse al espacio disponible y todas las acciones mantenerse accesibles sin desplazamiento horizontal. T04 deberá corregir el reflujo del contexto del simulador conservando la entrada válida y comprobar estos cuatro anchos.

Las cuatro pruebas nuevas declaran test.fail exclusivamente antes de su última aserción geométrica del defecto conocido. Las comprobaciones anteriores deben pasar antes de activar esa expectativa. El reporte contiene cuatro resultados failed con expectedStatus failed. Tras corregirlo en T04, retirar esa expectativa y exigir que la geometría pase. El código 0 del runner con fallos esperados no acredita conformidad de RF2.

### Ejecuciones e incidencias

La primera ejecución devolvió código 1, con 14 correctas y cuatro fallos del interceptor del test, que dejaba pasar la segunda petición de React StrictMode. Se corrigió el control de carga/error para abarcar las peticiones iniciales hasta su liberación explícita. Salida .cache/009-t03-a11y.txt.

La segunda ejecución devolvió código 1, con 14 correctas y cuatro fallos reales por 009-QA-01. Salida .cache/009-t03-a11y-final.txt. La revisión posterior continúa los estados del cliente corto y conserva el fallo del cliente largo como regresión esperada.

Comando de revisión final, pnpm.cmd --filter @saas-o-matic/web test:e2e visual.spec.mjs simulator-visual.spec.mjs a11y-states.spec.mjs. Devuelve código 0, con 14 casos passed y cuatro fallos esperados del defecto conocido, cero fallos inesperados. El resumen textual de Playwright agrupa los 18 como esperados. El desglose de estado se conserva en .cache/009-t03-summary.json, generado desde .cache/007-e2e/report.json. Salida .cache/009-t03-a11y-reviewed.txt. Capturas y anexos bajo .cache/007-e2e/results/a11y-states-*. Recursos temporales cerrados y .cache/002-tests observado sin directorios residuales.

### Límites y veredicto

Revisión específica en Chromium de escritorio con los cuatro viewports. Ampliación mediante CSS zoom y viewport equivalente. No se ejecutó zoom del menú nativo, lector de pantalla, otros navegadores o hardware móvil. La inspección DOM y las medidas de contraste son representativas. Las imágenes y snapshots de estructura son evidencia de revisión y no certificación exhaustiva.

T03 completada como revisión y detección de defectos. Veredicto de RF2 CAMBIOS NECESARIOS, pendiente de resolver 009-QA-01 en T04 y comprobar el cierre en T05. Aceptación humana final pendiente. Registro ai-workspace excluido.

pnpm.cmd lint, test:docs (2/2), format:check y git diff --check correctos tras la actualización. API/shared compilados para las pruebas. Suites unitarias/integración/componentes, typecheck y build globales, test:gates, suite E2E completa y proveedor FX real no se han reejecutado en T03.

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

Revisión histórica de T01: CUMPLE TÉCNICAMENTE para inventario, matriz y entorno; en ese momento el veredicto global estaba pendiente de T02–T05. El resultado vigente está en [cierre T05](#t05--verificación-final-y-cierre-técnico). Aceptación humana final pendiente. Las comprobaciones de preparación siguientes conservan su fecha y alcance propios.

## Revisión documental de preparación

17 de noviembre de 2026. Revisados los cinco documentos frente a scripts, suites, fixtures, estado de 008 y documentos canónicos. Retiradas referencias a requisitos sin correspondencia y rutas de pruebas inexistentes. Aclarada la diferencia entre cobertura heredada, auditoría de 009 y aceptación humana.

pnpm.cmd test:docs devuelve código 0 con 2 pruebas correctas. pnpm.cmd exec prettier --check specs/009-quality devuelve código 0. Las suites funcionales, E2E y controles de código no se han reejecutado en esta preparación documental. Solo se modifican estos cinco documentos y se mantiene la exclusión de ai-workspace.
