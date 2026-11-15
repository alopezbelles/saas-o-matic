# Validación 006

Estado funcional: T01–T05 completadas técnicamente. RF1–RF4 conformes con pruebas deterministas y composición; 122 pruebas globales correctas. CORS externo inconcluso por fallo del navegador del entorno. Sin interfaz ni aceptación humana final.

| RF      | Verificación prevista                                      | Resultado funcional real |
| ------- | ---------------------------------------------------------- | ------------------------ |
| 006-RF1 | T02: conversión exacta, identidad, redondeo y overflow     | CONFORME EN DOMINIO      |
| 006-RF2 | T03/T04: contrato, concurrencia y metadatos                | CONFORME CON FIXTURES    |
| 006-RF3 | T03/T04: fallos, expiración y recuperación sin alterar EUR | CONFORME CON FIXTURES    |
| 006-RF4 | T04: reutilización de tasas y caducidad                    | CONFORME EN CLIENTE      |

## T01 — Contratos, catálogo y fixtures

2026-11-15, Windows PowerShell, Node 22 y pnpm local. Autorización: ejecutar T01 únicamente. Se siguió la instrucción previa del plan, sin registrar mensajes en ai-workspace.

Cambios: catálogo inmutable EUR/USD/GBP, entradas discriminadas (EUR sin tasa), salida en unidades menores, errores de dominio exportados y contrato web normalizado con fechas UTC/atribución. El payload externo sigue siendo unknown hasta T03. Fixtures independientes cubren importes, redondeo, overflow, tasas inválidas, fechas y fallos de transporte; no se presentan como respuestas ya validadas por producción.

Resultados reales, código 0:

- pnpm.cmd lint.
- pnpm.cmd typecheck (incluye build de shared y comprobación de shared/API/web).
- pnpm.cmd test:unit: 28 shared + 12 API = 40 pruebas correctas.
- pnpm.cmd test:web: compilación Vite y 3 pruebas correctas (2 de fixtures y smoke HTTP existente).

Las cinco pruebas nuevas verifican catálogo inmutable, errores exportados y coherencia/aislamiento de fixtures. No acreditan RF1–RF4 completos, parsing externo ni comportamiento HTTP del cliente. No se ejecutaron integración SQLite, test:gates ni suite global pnpm test por no cambiar API/DB o herramientas. Sin instalaciones, lockfile, red externa, UI, datos reales ni commits. CORS sigue sin comprobarse. Conformidad técnica de T01; aceptación humana pendiente.

### Controles de cierre documental

pnpm.cmd test:docs: 2 pruebas correctas, código 0. pnpm.cmd format:check: todos los archivos cumplen Prettier, código 0. git diff --check: código 0. El gate documental identifica 006 como spec activa sin alterar los resultados históricos de 005.

## Controles globales futuros

## T02 — Conversión pura

2026-11-15. Autorización explícita de T02; instrucción previa en plan. Se añade convertCurrency en shared con errores CURRENCY_*, identidad EUR, parser decimal acotado, intermediarios BigInt y utilidades existentes roundHalfUp/assertMoneyCents/toSafeCents. No se cambia el motor fiscal ni la persistencia. El parser compara el texto completo para rechazar también saltos de línea finales; Number se usa solo para validar finitud del número representado.

Ocho pruebas productivas cubren fixtures independientes, cero/máximo EUR, mitades y valores adyacentes, equivalencia decimal/científica, tipos inválidos, claves heredadas como monedas, límites de longitud/exponente, overflow e inputs congelados. RF1 conforme en dominio, no integración externa.

Primera secuencia lint/typecheck/test:unit correcta (código 0). Controles finales tras revisión: pnpm.cmd lint, pnpm.cmd typecheck, pnpm.cmd test:unit (36 shared + 12 API = 48), pnpm.cmd test:docs (2), pnpm.cmd format:check y git diff --check correctos, código 0. No se ejecutaron integración SQLite, CORS, test:web, test:gates, pnpm build global ni suite completa: no cambian transporte/API/UI/runners. typecheck y test:unit sí compilan shared/API. Sin red externa, instalaciones, datos reales, registros ai-workspace ni commits.

pnpm lint, pnpm typecheck, pnpm format:check, pnpm build y pnpm test. No ejecutar test:gates en paralelo con otros controles de código.

Conservar fecha, entorno, comandos y códigos reales por tarea. Diferenciar pruebas deterministas, smoke externo y limitaciones; no marcar PASS por inspección.

## Comprobaciones externas

CORS desde origen de desarrollo: INCONCLUSO. Smoke intentado con navegadores headless; Edge abortó por GPU no utilizable antes de producir DOM. No hay evidencia de fallo CORS del proveedor. Un fetch de Node no acredita CORS; verificar en navegador operativo antes de integrar UI. Si CORS realmente falla, consultar alternativa antes de añadir proxy o cambiar proveedor.

Atribución: verificar metadatos del cliente; presentación visible diferida a specs de interfaz.

## Alcance diferido

Sin hook React, componentes, formulario, simulador, selector ni E2E visuales. No atribuir a 006 conservación de inputs o estados visuales comprobados.

## T03 — Validación del proveedor

2026-11-15, Windows PowerShell, pnpm local/Node 22. Autorización explícita de T03 e instrucción previa en el plan. parseExchangeRates recibe unknown y reloj explícito en milisegundos, valida propiedades propias, result/base/EUR=1, tasas USD/GBP positivas finitas y timestamps Unix enteros seguros representables como ISO. Rechaza actualización futura y caducidad incoherente; caducidad exacta produce EXCHANGE_RATE_EXPIRED, otros errores de contrato EXCHANGE_PAYLOAD_INVALID. Normaliza decimales, fechas UTC y atribución fija; salida profundamente congelada y separada del payload.

Runner web adaptado sin dependencias: tsc -p tsconfig.test.json emite solo módulos currency en .cache/currency-tests, seguido por node:test existente. No hay petición real, JSON parsing de transporte, UI, caché ni validación CORS en T03.

Ocho pruebas nuevas: éxito y campos extra, fixtures negativos, propiedades/tipos, tasas, notación científica extrema, fechas/rango del reloj, fronteras temporales y aislamiento/inmutabilidad. Primera ejecución test:web: 10 correctas y 1 fallida, código 1; helper de pruebas reemplazaba undefined por reloj por defecto, causando una expectativa incorrecta. Se añadió llamada directa para ese caso sin modificar producción. Repetición test:web: 11/11, código 0; incluye compilación Vite y módulo de pruebas.

pnpm.cmd lint y pnpm.cmd typecheck correctos, código 0. Cierre: pnpm.cmd test:docs (2/2), pnpm.cmd format:check y git diff --check correctos, código 0. No se ejecutaron test:unit, integración SQLite, test:gates, build global o suite completa; sin cambios API/shared/DB, dependencias/lockfile, red externa, ai-workspace ni commits. test:web sí compiló la web y sus módulos de pruebas. RF2/RF3 parciales hasta T04. Conformidad técnica de T03; aceptación humana pendiente.

## T04 — Cliente HTTP y caché

2026-11-15. Autorización explícita de T04 e instrucción previa del plan. createExchangeClient inyecta fetch/reloj; exchangeClient comparte instancia sin petición al importar. EUR devuelve null identidad; USD/GBP comparten payload validado inmutable. No recibe ni modifica importes o consumos; composición con convertCurrency reservada a revisión T05.

GET fijo, credentials omit, sin body/referrer ni caché HTTP para no confundirla con la caché de tasas. Timeout 5000 ms con AbortController y Promise.race cubre fetch y lectura JSON, incluso si el transporte ignora abort. Solo se publica el ganador validado al terminar; respuesta tardía no llena caché. Petición liberada en finally; sin reintentos automáticos ni caché caducada.

Resultados reales: pnpm.cmd lint y pnpm.cmd typecheck correctos, código 0. pnpm.cmd test:web compila Vite/módulos y ejecuta 20/20 correctas, código 0. Nueve casos nuevos agrupan EUR sin red, concurrencia/privacidad, reutilización/inmutabilidad, caducidad exacta/refresco compartido, HTTP/red/JSON/error lógico y recuperación, fallo de refresco sin datos viejos, expiración durante lectura, timeout/respuesta tardía, cuerpo bloqueado, aislamiento y moneda inválida.

Aviso observado: MockTimers experimental en Node 22, sin fallo ni dependencias nuevas. No se ejecutaron test:unit, integración, test:gates, build global ni suite completa en T04; cierre global reservado a T05. Sin red externa, UI, cambios shared/API/SQLite/lockfile, instalaciones, ai-workspace o commits. CORS pendiente. Cierre documental: pnpm.cmd test:docs (2/2), pnpm.cmd format:check y git diff --check correctos, código 0. Conformidad técnica T04, sin aceptación humana.

## T05 — Revisión y regresión global

2026-11-15. Base revisada: 53c38a7 (T04); comparación adicional con 6d4d14e (cierre 005). Instrucción previa: revisar composición/privacidad/exportaciones, ejecutar controles, documentar límites reales y preservar UI/API/DB. Alex autorizó T05; ai-workspace sigue excluido.

Cambios: dos pruebas de composición en currency-composition.test.mjs verifican tasas normalizadas → conversión exacta de total EUR, USD/GBP con fecha/atribución, cambio de importe sin refetch, error 429 → EUR utilizable → recuperación explícita. Snapshot de prueba congelado; no se persiste FX. Runner web compila shared antes de importar sus exports productivos; sin dependencia runtime nueva. Se actualizan reglas/arquitectura/contratos y contexto para retirar propuesta obsoleta decimal.js/packages/billing. UI, hook, selector, formato, estados visuales, atribución visible y E2E quedan diferidos.

Incidencia real: primer pnpm.cmd lint falló (código 1) con tres no-undef sobre JavaScript generado en apps/web/.cache/currency-tests. La exclusión anterior solo cubría .cache raíz; se cambió a **/.cache/**. No se silenciaron reglas productivas. Repetición lint correcta tras caché generada.

Resultados globales reales: pnpm.cmd lint, pnpm.cmd typecheck, pnpm.cmd build y pnpm.cmd test correctos, código 0. Suite completa: 36 shared + 12 unitarios API + 49 integración + 22 web + 1 gates + 2 docs = 122 correctas, cero fallos/omitidas. Gates no ejecutados en paralelo con otros controles. MockTimers emite aviso experimental en Node 22, sin fallo. Cierre documental: pnpm.cmd test:docs (2/2), pnpm.cmd format:check y git diff --check correctos, código 0.

Smoke externo separado: Vite iniciado en http://127.0.0.1:5173; HTML temporal ignorado carga el cliente real desde ese origen. Chrome headless no produjo resultado verificable. Edge headless con perfil aislado bajo .cache terminó con «GPU process isn't usable. Goodbye.»; no produjo DOM ni resultado del cliente. CORS queda INCONCLUSO por entorno, no se atribuye fallo al proveedor ni se añade proxy. No se usó fetch Node como sustituto. Artefactos diagnósticos locales ignorados, sin datos privados ni modificación de perfiles personales. Verificación real de CORS pendiente antes de integrar UI en navegador operativo.

Auditoría git diff contra cierre 005: sin cambios en apps/api, pnpm-lock.yaml, App.tsx o main.tsx; sin schema/migraciones/endpoints nuevos. Integración usó archivos temporales existentes del runner; .cache/002-tests vacío al finalizar y sin gate-check residual. No se abrió DB real ni se instalaron librerías. Sin commits/pushes ni registros ai-workspace. Conformidad técnica de T05 con limitación externa documentada; aceptación humana no registrada.

## Restricción vigente

Tras T05, Alex autorizó registrar ahora el trabajo en ai-workspace. Se mantiene en los apartados históricos la exclusión que realmente aplicaba durante preparación/ejecución. Los nuevos registros son retrospectivos, sin aceptación humana final: [prompts](../../ai-workspace/prompts/006-currency.md), [iteración](../../ai-workspace/iterations/006-currency.md), [ADR-006](../../ai-workspace/decisions/ADR-006-currency-infrastructure.md), [pruebas y salida real](../../ai-workspace/testing/006-currency.md) y [revisión](../../ai-workspace/reviews/006-currency.md).
