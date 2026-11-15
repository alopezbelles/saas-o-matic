# Tareas 004

Todas pendientes. Preparación documental consolidada; ninguna tarea de implementación ejecutada.
Ejecutar una tarea por indicación de Alex. Informar cambios, controles y propuesta de commit por bloque; no hacer commits/pushes sin autorización específica.
Alcance común: motor puro, contratos, configuración y pruebas. Sin HTTP, UI, DB, migraciones ni FX.

## T01 — Preparar oráculos y conectar tests de shared

- [ ] Pendiente. Preparación de RF1..4; sin dependencia de implementación.
- Archivos previstos: packages/shared/test/billing-fixtures.mjs, billing-fixtures.test.mjs, packages/shared/package.json, package.json raíz, test/docs.test.mjs y docs/testing.md.
- Preparar resultados independientes de tramos, países, límites, redondeo y errores; distinguir tasas sintéticas.
- Conectar test:unit de shared y raíz conservando API. No importar funciones inexistentes ni omitir tests.
- Actualizar el gate documental de contexto: comprobar la spec activa 004 y la existencia de su enlace, sustituyendo la expresión fija de 003 sin alterar sus referencias históricas.
- Verificar UT-FIX-004 y controles por tarea del plan. PASS de fixtures no acredita RF implementados.
- Antes del cierre, revisar la incidencia de formato global detectada en preparación (46 archivos ajenos a 004); no atribuirla a esta tarea ni afirmar gates completos mientras falle. No aplicar correcciones masivas fuera del alcance autorizado.
- Cierre: fixtures coherentes y ejecución reproducible.
- Commit propuesto: test(billing): add pricing fixtures and shared test runner.

## T02 — Implementar tramos y contrato básico

- [ ] Pendiente. RF1, RF3, RF4. Depende de T01.
- Archivos previstos: billing/types.ts, errors.ts, tiers.ts, billing.test.mjs y exports de shared.
- Implementar calculateTieredBase y users-tiered-v1. Desglose compatible con 002, cero usuarios → base 0 y [].
- Validar users con límites y errores acordados; no cargos adicionales.
- Verificar UT-BILL-01, marginales UT-PROP-01 y entradas inválidas de users. Controles por tarea.
- Cierre: pruebas reales de fronteras y desglose.
- Commit propuesto: feat(billing): implement cumulative user pricing.

## T03 — Implementar dinero e impuestos versionados

- [ ] Pendiente. RF2, RF3. Depende de T02.
- Archivos previstos: billing/money.ts, tax.ts, tipos/errores/exports, apps/api/src/config/tax-policy.ts, apps/api/test/tax-policy.test.mjs y apps/api/package.json.
- Implementar BigInt, half-up, rango seguro, validación de política y país no soportado.
- Configurar demo-standard-v1: ES 2100, FR 2000, DE 1900, GB 2000 bps; sin entorno ni red.
- Añadir prueba de configuración a test:unit de API sin retirar pruebas previas.
- Verificar UT-TAX-01 y UT-MONEY-01: tasas sintéticas, cero frente a ausencia, versión inválida y overflow. Controles por tarea.
- Cierre: dinero exacto y configuración real probada.
- Commit propuesto: feat(billing): add versioned tax policy and exact rounding.

## T04 — Componer presupuesto y validar todos los consumos

- [ ] Pendiente. RF1..4. Depende de T03.
- Archivos previstos: billing/quote.ts, types.ts, exports y pruebas shared.
- Implementar calculateQuote(input, policy) validando users, storageGb, apiCalls y countryCode.
- Devolver baseCents, taxCents, totalCents, currency EUR, rateBps, pricingVersion, taxPolicyVersion y breakdown.
- Verificar UT-INPUT-004, UT-QUOTE-004 y UT-PROP-01: límites, errores, invariantes, no mutación, versiones y serialización.
- Sin planCode, clientId, HTTP ni consultas de clientes.
- Cierre: contrato completo, salida determinista y errores observables; controles por tarea.
- Commit propuesto: feat(billing): compose deterministic billing quotes.

## T05 — Verificar entrega y documentar resultados

- [ ] Pendiente. RF1..4. Depende de T04.
- Archivos: validation.md, MEMORY.md, docs/testing.md y registros pertinentes en ai-workspace.
- Ejecutar lint, typecheck, format:check, build y test secuencialmente; registrar resultados reales.
- Revisar cobertura RF, compatibilidad con 002, dominio puro y ausencia de integración HTTP/DB/FX.
- Actualizar trazabilidad y evidencias. Presentar a Alex casos ES 15/51 y política fiscal.
- Cierre técnico con evidencia; aceptación humana solo cuando Alex la confirme, por separado.
- Commit propuesto: docs(billing): record validation and implementation review.

Evidencias futuras en [validación](validation.md) y ai-workspace. Los nombres de commit son propuestas, no autorización ni operaciones realizadas.
