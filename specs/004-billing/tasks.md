# Tareas 004

T01–T04 completadas técnicamente. T05 ejecutada: regresión correcta, cierre global pendiente del formato de 41 archivos ajenos. Motor implementado; sin aceptación humana final.
Ejecutar una tarea por indicación de Alex. Informar cambios, controles y propuesta de commit por bloque; no hacer commits/pushes sin autorización específica.
Alcance común: motor puro, contratos, configuración y pruebas. Sin HTTP, UI, DB, migraciones ni FX.

## T01 — Preparar oráculos y conectar tests de shared

- [x] Completada técnicamente. Preparación de RF1..4; no acredita RF implementados.
- Archivos previstos: packages/shared/test/billing-fixtures.mjs, billing-fixtures.test.mjs, packages/shared/package.json, package.json raíz, test/docs.test.mjs y docs/testing.md.
- Preparar resultados independientes de tramos, países, límites, redondeo y errores; distinguir tasas sintéticas.
- Conectar test:unit de shared y raíz conservando API. No importar funciones inexistentes ni omitir tests.
- Actualizar el gate documental de contexto: comprobar la spec activa 004 y la existencia de su enlace, sustituyendo la expresión fija de 003 sin alterar sus referencias históricas.
- Verificar UT-FIX-004 y controles por tarea del plan. PASS de fixtures no acredita RF implementados.
- Antes del cierre, revisar la incidencia de formato global detectada en preparación (46 archivos ajenos a 004); no atribuirla a esta tarea ni afirmar gates completos mientras falle. No aplicar correcciones masivas fuera del alcance autorizado.
- Cierre: fixtures coherentes y ejecución reproducible.
- Commit propuesto: test(billing): add pricing fixtures and shared test runner.
- Evidencia: [verificación T01](../../ai-workspace/testing/004-billing-t01.md). Lint/typecheck y 8 tests unitarios + 2 documentales pasan; format:check global falla en 43 archivos ajenos por CRLF/LF. Incidencia delimitada, no corregida masivamente.

## T02 — Implementar tramos y contrato básico

- [x] Completada técnicamente. RF1 y partes de RF3/RF4 relativas a tramos. Depende de T01.
- Archivos previstos: billing/types.ts, errors.ts, tiers.ts, billing.test.mjs y exports de shared.
- Implementar calculateTieredBase y users-tiered-v1. Desglose compatible con 002, cero usuarios → base 0 y [].
- Validar users con límites y errores acordados; no cargos adicionales.
- Verificar UT-BILL-01, marginales UT-PROP-01 y entradas inválidas de users. Controles por tarea.
- Cierre: pruebas reales de fronteras y desglose.
- Commit propuesto: feat(billing): implement cumulative user pricing.
- Evidencia: [verificación T02](../../ai-workspace/testing/004-billing-t02.md); 13 tests unitarios pasan (5 fixtures, 5 productivos de tramos, 3 API). Sin impuestos ni cálculo completo.

## T03 — Implementar dinero e impuestos versionados

- [x] Completada técnicamente. RF2/RF3 en su parte de dinero e impuestos; composición pendiente de T04. Depende de T02.
- Archivos previstos: billing/money.ts, tax.ts, tipos/errores/exports, apps/api/src/config/tax-policy.ts, apps/api/test/tax-policy.test.mjs y apps/api/package.json.
- Implementar BigInt, half-up, rango seguro, validación de política y país no soportado.
- Configurar demo-standard-v1: ES 2100, FR 2000, DE 1900, GB 2000 bps; sin entorno ni red.
- Añadir prueba de configuración a test:unit de API sin retirar pruebas previas.
- Verificar UT-TAX-01 y UT-MONEY-01: tasas sintéticas, cero frente a ausencia, versión inválida y overflow. Controles por tarea.
- Cierre: dinero exacto y configuración real probada.
- Commit propuesto: feat(billing): add versioned tax policy and exact rounding.
- Evidencia: [verificación T03](../../ai-workspace/testing/004-billing-t03.md). Lint/typecheck y 21 unitarios pasan (16 shared, 5 API). Formato global con incidencia en 41 archivos ajenos.

## T04 — Componer presupuesto y validar todos los consumos

- [x] Completada técnicamente. RF1..4. Depende de T03.
- Archivos previstos: billing/quote.ts, types.ts, exports y pruebas shared.
- Implementar calculateQuote(input, policy) validando users, storageGb, apiCalls y countryCode.
- Devolver baseCents, taxCents, totalCents, currency EUR, rateBps, pricingVersion, taxPolicyVersion y breakdown.
- Verificar UT-INPUT-004, UT-QUOTE-004 y UT-PROP-01: límites, errores, invariantes, no mutación, versiones y serialización.
- Sin planCode, clientId, HTTP ni consultas de clientes.
- Cierre: contrato completo, salida determinista y errores observables; controles por tarea.
- Commit propuesto: feat(billing): compose deterministic billing quotes.
- Evidencia: [verificación T04](../../ai-workspace/testing/004-billing-t04.md). Lint/typecheck y 30 unitarios pasan (25 shared y 5 API). Sin HTTP/DB/FX. Incidencia global de formato ajena permanece.

## T05 — Verificar entrega y documentar resultados

- [ ] Verificación ejecutada; cierre global pendiente de format:check. RF1..4 revisados. Depende de T04.
- Archivos: validation.md, MEMORY.md, docs/testing.md y registros pertinentes en ai-workspace.
- Ejecutar lint, typecheck, format:check, build y test secuencialmente; registrar resultados reales.
- Revisar cobertura RF, compatibilidad con 002, dominio puro y ausencia de integración HTTP/DB/FX.
- Actualizar trazabilidad y evidencias. Presentar a Alex casos ES 15/51 y política fiscal.
- Cierre técnico con evidencia; aceptación humana solo cuando Alex la confirme, por separado.
- Commit propuesto: docs(billing): record validation and implementation review.
- Evidencia: [verificación global T05](../../ai-workspace/testing/004-billing-t05.md). Lint/typecheck/build y 59 tests pasan; formato global falla por CRLF/LF en 41 archivos ajenos. No marcar todos los gates correctos ni aceptación humana.

Evidencias futuras en [validación](validation.md) y ai-workspace. Los nombres de commit son propuestas, no autorización ni operaciones realizadas.
