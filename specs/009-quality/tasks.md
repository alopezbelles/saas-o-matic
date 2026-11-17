# Tareas 009

Estado de preparación adaptado. 009-T01…T05 pendientes de ejecución por indicación de Alex. La cobertura existente de 007–008 se reutilizará y verificará antes de ampliarla. Sin registro ai-workspace.

## T01 — Inventario, entorno y trazabilidad de cobertura

- [ ] **009-T01**. RF1/RF4.
- Revisar scripts, fixtures, runner, aislamiento/limpieza y casos reales contra los RF de 009.
- Preparar matriz de cobertura reutilizada y huecos concretos. Referenciar las evidencias históricas de 008.
- Vincular requisitos explícitos del enunciado aportado con implementación, pruebas y resultados. Identificar los entregables asignados a 010.
- Actualizar MEMORY.md y la referencia de spec activa codificada en test/docs.test.mjs al iniciar 009.
- Archivos existentes, apps/web/e2e/environment.mjs, fixtures.mjs, run.mjs, apps/web/playwright.config.mjs, test/docs.test.mjs y documentos de contexto según necesidad.
- Hecho cuando el entorno y los casos reutilizables estén identificados y verificados, con diferencias frente a 008 visibles.
- Evidencia prevista QA-ENV-009 y QA-MATRIX-009. Resultado actual NO EJECUTADO.

## T02 — Flujos y resiliencia integrada

- [ ] **009-T02**. RF1/RF3/RF5/RF6. Depende de T01.
- Reejecutar reglas críticas, alta/listado/ficha/simulador/historial y recuperación frente a errores API/DB/FX.
- Revisar 404/422/409/500/503, lock/rollback, timeout/201 ilegible, doble envío, configuración incompatible, caducidad/carreras FX y persistencia autoritativa.
- Reutilizar suites API/shared, componentes/FX y E2E existentes. Añadir únicamente casos que cubran huecos concretos.
- Revisar seguridad básica conforme a 009-C01, con hallazgos verificables.
- Comprobar puntualmente conversión y CORS desde el simulador en Chromium con proveedor FX real y DB temporal. Registrar el resultado y cualquier limitación externa por separado de los fixtures.
- Hecho cuando los escenarios revisados tengan resultados observables y los defectos detectados estén descritos con reproducción e impacto.
- Evidencia prevista QA-FLOW-009, QA-RESILIENCE-009, QA-SECURITY-009 y QA-FX-LIVE-009. Resultado actual NO EJECUTADO.

## T03 — Accesibilidad y responsive

- [ ] **009-T03**. RF2. Depende de T02.
- Revisar VISUAL-007/008, cuatro anchos, teclado, foco, labels/errores, contraste, carga/error/vacío/confirmación y contenido ampliado.
- Mantener Chromium según 009-C02 y declarar el método de ampliación utilizado.
- Reutilizar visual.spec.mjs, simulator-visual.spec.mjs y contrast.mjs. Completar casos o realizar comprobaciones manuales cuando el hueco lo justifique.
- Hecho cuando datos y acciones relevantes sean accesibles en los escenarios revisados y las limitaciones de navegador/zoom/lector estén declaradas.
- Evidencia prevista QA-A11Y-009, con capturas reales cuando aporten información. Resultado actual NO EJECUTADO.

## T04 — Resolver defectos y comprobar regresiones

- [ ] **009-T04**. RF1/RF2/RF3/RF5/RF6. Depende de T03.
- Priorizar defectos por impacto en reglas, datos, guardado, recuperación y acceso a acciones.
- Corregir dentro del alcance aprobado, reutilizando las capas y contratos existentes.
- Cada corrección tendrá una prueba pertinente o reproducción verificable y comprobación posterior. Registrar también las regresiones ya cubiertas.
- Si no se detectan defectos, cerrar con evidencia de revisión sin generar cambios artificiales.
- Hecho cuando los defectos que impidan los RF estén resueltos y cualquier incidencia restante tenga impacto/estado explícitos.
- Evidencia prevista QA-REGRESSION-009. Resultado actual NO EJECUTADO.

## T05 — Verificación final y cierre técnico

- [ ] **009-T05**. RF1–RF6. Depende de T04.
- Ejecutar los controles globales del plan y test:docs después de actualizar documentos. Gates sin otros controles de código concurrentes.
- Actualizar validation.md, docs/traceability.md, memoria y documentación afectada con versión, comandos, resultados y límites reales.
- Preparar el resultado para revisión de Alex y registrar su aceptación únicamente si él la confirma. El cierre técnico puede quedar completado con aceptación humana pendiente.
- Comprobar cleanup de recursos temporales y que no se han tocado datos existentes.
- Dejar resultados técnicos y asuntos derivados disponibles para 010, que cerrará README, índice de auditoría, checkout limpio y preparación de publicación.
- Hecho cuando cada RF tenga evidencia actual y veredicto verificable.
- Evidencia prevista QA-ALL-009 y QA-REVIEW-009. Resultado actual NO EJECUTADO.

## Registro

Evidencia canónica en validation.md. ai-workspace continúa excluido hasta nueva indicación. No ejecutar estas tareas como parte de la adaptación documental. Sin commits/pushes.
