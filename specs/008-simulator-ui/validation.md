# Validación 008

Estado: decisiones 008-C01…C07 confirmadas, T01–T03 completadas técnicamente. RF1/RF2 conformes para preview; RF4 incorpora total guardado y fallback EUR. RF3/RF5 conformes para guardado/resultado; integración contextual de historial y cierre global pendientes de T04–T05. Los estados anteriores conservan su contexto histórico.

## Matriz prevista

| RF      | Tareas      | Pruebas previstas                                  | Resultado real                  |
| ------- | ----------- | -------------------------------------------------- | ------------------------------- |
| 008-RF1 | T01/T02/T05 | WEB-SIM-01, WEB-CONFIG-008, E2E-SIMULATIONS-008    | CONFORME PREVIEW                |
| 008-RF2 | T01/T02/T05 | WEB-SIM-02, E2E-SIMULATIONS-008                    | CONFORME PREVIEW                |
| 008-RF3 | T03/T04/T05 | WEB-SAVE-008, WEB-HISTORY-008, E2E-SIMULATIONS-008 | PARCIAL: HISTORIAL T04          |
| 008-RF4 | T02/T04/T05 | WEB-FX-008, WEB-HISTORY-008, E2E-SIMULATIONS-008   | CONFORME TOTAL PREVIEW/GUARDADO |
| 008-RF5 | T03/T04/T05 | WEB-POLICY-008, E2E-SIMULATIONS-008                | CONFORME GUARDADO               |

## T03 — Guardado autoritativo y discrepancias

16 de noviembre de 2026, base 49a9933, Git inicial limpio. Alex autoriza T03. [Instrucción previa](plan.md#guardado-y-recuperación). Se mantiene exclusión ai-workspace. Conformidad técnica T03, sin aceptación humana final.

Adaptador POST con parser compartido de entrada, payload exacto y validación de 201/DTO/identidad/consumos. Hook congela payload y copia profunda de preview, bloquea doble envío y conserva resultado confirmado hasta preparar otra simulación explícitamente. El resumen proyecta importes, tasa, versiones y desglose persistidos sin ejecutar el motor sobre ellos; muestra snapshot/fecha y discrepancia frente al preview. Preparar otra simulación reinicia cero/EUR y recarga configuración/cliente, sin POST automático. Retorno contextual al cliente conservado.

WEB-SAVE-008 cubre envío duplicado incluso tras confirmación, payload de cuatro campos, foco, reinicio, HTTP 422/404/503/500, campos whitelist/asociados y valores retenidos, red/timeout/201 ilegible o incoherente, consulta de historial sin reenviar, aborto al abandonar e identidad/status incorrectos. WEB-POLICY-008 acepta versiones nuevas y muestra importes autoritativos. saved-result prueba proyección sin recálculo, copias de desglose y discrepancias de versiones con total cero, tasa y tramos.

Cuatro E2E específicas usan API real y SQLite temporal por caso: POST persistido con base 14000/impuesto 2940/total 16940; política modificada tras preview que guarda 16800 y convierte a 201,60 USD con fixture 1,2; 503 sin fila y recuperación manual, fallo FX que permite guardar EUR; respuesta 201 ilegible después de commit real que permanece incierta sin duplicados. Sin proveedor real: transporte FX controlado. Capturas de resultado a 320/1440 y comprobación de reflujo; integración completa de historial y revisión visual global siguen en T04/T05.

Incidencias de verificación corregidas: ESLint exigió globalThis.document en contexto navegador del test; TypeScript requirió variantes separadas idle/pending para estrechar la unión y corregir opciones/índices del test. Primer E2E confundía dos alerts simultáneos; se acotó el aviso de guardado. Segundo esperaba el código EUR dentro del importe, que usa símbolo €, y se corrigió al oráculo monetario. No se presentan esas primeras ejecuciones como correctas.

Verificación final: pnpm.cmd lint, typecheck y build correctos. pnpm.cmd test devuelve código 0: 36 shared + 12 API unitarias + 49 integración + 22 node web + 139 componentes/transporte + 1 gates + 2 docs = 261 pruebas. Gates sin otros controles de código concurrentes. pnpm.cmd test:e2e devuelve código 0: 20 correctas, sin retries/omisiones, cuatro nuevas de T03. Salidas temporales .cache/008-t03-test.txt y .cache/008-t03-e2e-pass.txt; capturas/reporte .cache/007-e2e. Capturas reales de resultado a 320/1440 inspeccionadas, sin desbordamiento; no se atribuye revisión global de T05 ni prueba con proveedor real.

pnpm.cmd format:check, nueva ejecución de test:docs (2/2) y git diff --check correctos tras actualizar documentación.

Sin nuevas dependencias, backend, shared, schema, lockfile, DB existente ni registros ai-workspace. La política mutable existe solo en el fixture E2E; no cambia configuración de producto. Sin commits/pushes. T04/T05 y aceptación humana final pendientes.

## T02 — Preview, desglose y conversión

16 de noviembre de 2026, base 170187a, Git inicial limpio. Alex autoriza T02 y ajuste visual a referencia. [Instrucción previa](plan.md#conversión). Se mantiene exclusión ai-workspace. Conformidad técnica T02; aceptación humana final no registrada.

useSimulationQuote integra calculateQuote de shared con política fiscal validada del servidor; no replica tramos, precios o impuestos. Preview inválido/overflow retira total anterior. PricingBreakdown mantiene EUR y SimulationSummary convierte solo total mediante 006. Formato exacto con Intl/BigInt reutilizado por historial, sin modificarlo. Tasas/caché/petición compartida del cliente existente; hook adapta carga/error/reintento/caducidad y descarta respuestas anteriores, sin cancelar solicitudes compartidas.

La disponibilidad del recurso FX depende de configuración/divisa, no del valor o invalidez temporal de consumos; editar/vaciar/corregir tras fallo no provoca reintento implícito. Expiración mediante timer y revisión al recuperar foco/visibilidad. Cambio de selección limpia el resultado anterior antes de presentarlo, incluyendo volver de EUR a una divisa caducada. Fallo/caducidad/malformación/overflow de conversión vuelve a EUR identificado, sin tasa antigua ni POST. EUR no consulta proveedor.

Dos tarjetas de escritorio con cabecera/separador, slider/número en fila, selector y total verde mediante token; una columna móvil y acción de retorno. Pantalla se aproxima a la referencia adaptada a tokens/fuente/límites acordados. Guardar y resultado confirmado siguen pendientes de T03; el componente de resumen será reutilizable para ese resultado, sin afirmar integración ya realizada.

Oráculos independientes ES: usuarios 0→0,00; 10→121,00; 11→130,68; 15→169,40; 50→508,20; 51→514,25; 1000→6255,70 EUR. A 15: base 140,00/impuesto 29,40; con tasas de fixture USD 1,2 y GBP 0,8: 203,28 USD/135,52 GBP. Storage/API no alteran precio y plan profesional conserva tarifa. WEB-SIM-01/02 y WEB-FX-008 cubren invalidación, plan, overflow monetario, conversión/fecha/atribución, caché entre importes/divisas, fallo/reintento, datos inválidos/caducados, respuestas tardías y limpieza de timers/listeners. Regresiones específicas de vaciado/corrección sin retry y regreso a divisa caducada.

Lint/typecheck/build correctos. pnpm.cmd test devuelve código 0: 36 shared + 12 API unitarias + 49 integración + 22 node web + 125 componentes/transporte + 1 gates + 2 docs = 247 pruebas. Gates sin otros controles de código simultáneos. pnpm.cmd test:e2e devuelve código 0: 16 correctas, sin retries/omisiones, 3 nuevas de T02. API/Vite/SQLite real temporal y FX interceptado con fixture controlado: preview/desglose, ausencia de cargos extra, moneda/caché/carreras/error/reintento y ningún POST. No se atribuye al proveedor real el resultado del fixture.

Cuatro anchos 320/390/768/1440 sin desbordamiento; posiciones de tarjetas y slider/campo alineados comprobadas por geometría en navegador. Escritorio/móvil inspeccionados. Reportes/capturas y salida global temporales en .cache/007-e2e y .cache/008-t02-test.txt, sin trasladarlos a ai-workspace. Regresión de 007/T01 conservada. Primera ampliación de componentes 119/119 correcta; typecheck del harness detectó Promise de tipo unknown en mock diferido, se explicitó ExchangeRates y las ejecuciones posteriores pasan. Revisión posterior añadió regresiones/corrección de reintentos por borrador y selección caducada; no se ocultan esas iteraciones como si la primera versión fuera final.

Sin cambios de motor/shared productivo/API/lockfile, dependencias nuevas, persistencia o datos existentes. Recursos temporales cerrados/limpiados. Compatibilidad y países de T01 mantenidos. Guardado/resultado autoritativo e historial tras guardar, revisión visual/contraste exhaustiva del conjunto y aceptación humana quedan en tareas posteriores. Sin commits/pushes.

Cierre documental: pnpm.cmd test:docs (2 pruebas), pnpm.cmd format:check y git diff --check correctos, código 0. Auditoría git diff --exit-code -- ai-workspace apps/api packages/shared/src pnpm-lock.yaml devuelve 0; .cache/002-tests vacío.

## T01 — Pantalla, cliente/configuración e inputs

16 de noviembre de 2026, base d67aab0, Git inicial limpio. T01 autorizada por Alex, sin levantar exclusión ai-workspace. [Instrucción previa](plan.md#reutilización-y-responsabilidades). Conformidad técnica de T01; aceptación humana final no registrada.

Ruta/acceso desde ficha, breadcrumbs/retorno con búsqueda y historyOffset preservados, ID inválido/404/reintentos y país sin tarifa. Cliente y configuración usan recursos GET independientes cancelables. DTO completo validado por formato y compatibilidad separada de versión/tramos/límites; tasas/versiones fiscales del servidor, sin duplicar política. Controles iniciales cero/EUR, slider 0..1000 paso 1 y borradores string con errores asociados. Vacío/fracción/exceso no se coercionan a cero; slider conserva último valor válido hasta corregir. Cambio de cliente inicia borrador nuevo. Sin cálculo, FX, selector de moneda o POST de simulación en T01.

WEB-SIM-01/02 y WEB-CONFIG-008 ejecutados: límites/fronteras, valores inválidos, sincronización, contrato/compatibilidad, estados/reintentos/retorno y configuración tardía ignorada. Se actualiza la prueba de ficha de 007 para el acceso autorizado a nueva simulación, manteniendo ausencia de «Ver detalle». Shared solo añade export público de assertConsumption existente, sin cambios de reglas. test:docs identifica ahora 008 como spec activa.

pnpm.cmd test devuelve código 0: 36 shared + 12 API unitarias + 49 integración + 22 node web + 113 componentes/transporte + 1 gates + 2 docs = 235 pruebas. Gates sin otros controles de código simultáneos. pnpm.cmd test:e2e devuelve código 0: 13 correctas, incluidas 2 nuevas de T01, sin retries/omisiones. Las dos nuevas verifican API/Vite/SQLite real temporal, control por teclado/valores inválidos, ausencia de FX/POST, país no soportado y retorno contextual. Cuatro anchos 320/390/768/1440 sin desbordamiento; escritorio/móvil inspeccionados. Regresión completa de 007 conservada.

Incidencias corregidas: guarda de shared no exportada (se expone sin duplicarla); opción de locator Playwright usada por error en RTL (retirada); primera suite de componentes 111 correctas/1 fallo del harness al esperar aborto de una petición ya completada (se comprueba la petición de configuración pendiente). Se añade regresión de reinicio por cliente y suite global posterior correcta. No se atribuye éxito a primeras ejecuciones fallidas.

Lint/typecheck/build pasan. Salida global y capturas/reportes temporales bajo .cache/008-t01-test.txt y .cache/007-e2e, sin versionarlos ni trasladarlos a ai-workspace. API/lockfile sin cambios, sin dependencias nuevas o DB existente; recursos propios cerrados/limpiados. Zoom/contraste exhaustivos de la pantalla final y flujos de precio/FX/guardado quedan para tareas posteriores. No commits/pushes.

Cierre documental: pnpm.cmd test:docs (2 pruebas), pnpm.cmd format:check y git diff --check correctos, código 0. Auditoría git diff --exit-code -- ai-workspace apps/api pnpm-lock.yaml devuelve 0; .cache/002-tests vacío.

## Preparación documental

Revisados contratos shared, firma real de calculateQuote, adaptadores y decisiones 006/007. Decisiones 008-C01…C07 confirmadas en clarifications.md, sin decisiones funcionales imprescindibles abiertas. Validación técnica no es aceptación humana ni autorización para implementar toda la spec de golpe.

Controles reales de esta adaptación: pnpm.cmd test:docs devuelve código 0 con 2 pruebas correctas; pnpm.cmd exec prettier --check specs/008-simulator-ui devuelve código 0. Prettier aplicado exclusivamente a estos cinco documentos. git status --short solo muestra specs/008-simulator-ui como carpeta nueva. No ejecutados lint/typecheck/build/pruebas funcionales por tratarse de documentación. Sin ai-workspace por indicación de Alex.

## Al implementar

- Inputs/cliente/configuración, límites reales y estrategia de compatibilidad confirmada.
- pricingVersion/tramos/límites incompatibles bloquean preview/guardado con aviso/recarga/reintento; política fiscal validada desde servidor sin hardcodearla. Cambio posterior al preview con 201: éxito autoritativo con aviso, sin rechazo/reenvío.
- Tres consumos inicialmente a cero y EUR, sin petición FX para EUR ni POST automático al montar/cambiar campos.
- Sincronización/vacío/fracción/negativo/exceso y fronteras monetarias con motor compartido.
- Selector EUR/USD/GBP solo en total del simulador/resultado confirmado, conversión desde totalCents autoritativo después de guardar y desglose/historial EUR sin selector FX; tasas/fechas/atribución/error/carreras con fixtures, separando proveedor real.
- Fallo/caducidad FX conserva total identificado como EUR y permite guardado válido en EUR; aviso/reintento sin tasa caducada ni repetición de POST, también en resultado confirmado.
- POST exacto/201/DTO/identidad/envío único/422/404/503/red/timeout/201 ilegible, conservando borrador.
- Discrepancia contra preview congelado y aviso/resultado autoritativo sin cambiar persistencia.
- Tras 201 permanecer en simulador, anunciar éxito, conservar resultado/aviso y ofrecer «Volver al cliente» con historial actualizado; sin redirección automática.
- Historial de 007 actualizado, orden/recarga/retorno y resultado incierto sin filas ficticias.
- E2E/revisión visual con API/SQLite temporales y limpieza verificada, nunca DB existente.
- Controles del plan; gates sin otros controles de código concurrentes. Salidas reales y controles omitidos explícitos.

Autorización de implementación, conformidad técnica y revisión humana son distintas. Sin aceptación humana final ni commits/pushes.
