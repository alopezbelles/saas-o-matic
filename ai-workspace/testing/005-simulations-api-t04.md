# 005-T04 — Histórico y configuración

15 de noviembre de 2026. Base 7d968a2; rama specs/005-simulations-api, cambios sin commit. Windows/PowerShell, Node 22.19.0 y pnpm 10.33.4 existentes.

## Comandos y resultados

```powershell
$env:Path = "C:\Program Files\nodejs;$PWD\.tools\node_modules\.bin;$env:Path"
pnpm.cmd lint
pnpm.cmd typecheck
pnpm.cmd --filter @saas-o-matic/api... build
node --test apps/api/test/simulations-history.test.mjs apps/api/test/billing-config.test.mjs apps/api/test/simulations.test.mjs
pnpm.cmd test:unit
pnpm.cmd test:integration
```

Lint/typecheck devuelven 0. Primera ejecución focalizada: 14 pasan/1 falla por fixture que esperaba 503 mientras lanzaba Error genérico; el 500 del handler era correcto. Se sustituyó solo ese error simulado por HttpError(503, DATABASE_UNAVAILABLE), sin cambiar producción. Repetición focalizada: 15/15 pasan.
Regresiones finales: 37 unitarios y 49 integración (41 anteriores + 5 histórico + 3 configuración), códigos 0, sin omitidos. No sumar otra vez los casos focalizados.
[Salida real](005-simulations-api-t04.txt) conserva fallo inicial y regresión posterior. No build completo, web/gates ni suite completa, reservados para T05; los comandos ejecutados compilan shared/API y verifican tipos del workspace.

## Evidencia funcional

- Histórico: SQL limitado/paginado y total bajo transacción de lectura con comprobación de cliente. Empates por id DESC, aislamiento entre clientes, defaults, página vacía fuera de rango, cliente vacío frente a 404 y query inválida antes de DB.
- No recalcular: cliente/política fixture cambiados y aplicación con política actual inválida; GET conserva los DTO previos y nuevos desde sus snapshots/versiones. Configuración inválida no bloquea lectura histórica.
- DB bloqueada con BEGIN EXCLUSIVE en segunda conexión: 503 sanitizado, recuperación tras ROLLBACK.
- Config: 200 completo, Cache-Control no-store y requestId; funciona aunque el proveedor DB lanzase error si se usara. Cero llamadas al proveedor.
- Tarifas/versiones leídas desde getter de reglas reales, no constantes duplicadas. Config coincide con motor en 0/10/11/15/50/51/1000 y cuatro países.
- getPricingConfiguration devuelve copias: mutarlas no altera reglas/cálculo posterior. Proyección HTTP copia también tasas/límites; JSON no expone referencias del servidor.
- Política interna inyectada aparece con su versión/tasas; política inválida produce 500 público genérico sin detalles.
- Expectativas 404 de T03 para rutas futuras actualizadas a 200 ahora que T04 las implementa. Regresiones de POST/clientes pasan.

## Límites

Sin migración, esquema, dependencias, DB real, UI, FX ni commits. SQLite solo temporal. No altera listSimulations de 002 ni consulta el motor al listar histórico.
Tras actualizar registros: pnpm.cmd format:check devuelve 0, pnpm.cmd test:docs devuelve 0 (2 pruebas correctas) y git diff --check devuelve 0. [Validación](../../specs/005-simulations-api/validation.md), [revisión](../reviews/005-simulations-api-t04.md).
