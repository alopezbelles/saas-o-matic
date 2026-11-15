# 005-T02 — Servicio y guardado transaccional

15 de noviembre de 2026. Windows/PowerShell; Node 22.19.0 y pnpm 10.33.4 existentes. Base 64a1aba, cambios T02 sin commit, rama specs/005-simulations-api.

## Comandos y resultados

```powershell
$env:Path = "C:\Program Files\nodejs;$PWD\.tools\node_modules\.bin;$env:Path"
pnpm.cmd lint
pnpm.cmd typecheck
pnpm.cmd --filter @saas-o-matic/api... build
node --test apps/api/test/simulations-service.test.mjs
pnpm.cmd test:unit
pnpm.cmd test:integration
```

Todos devuelven 0. Prueba focalizada: 9 casos nuevos pasan. Regresión: 37 unitarios (25 shared, 12 API) y 34 integración (25 previos + 9 nuevos), sin omitidos. No sumar los nueve focalizados otra vez como cobertura distinta.
[Salida real](005-simulations-api-t02.txt). No se ejecutó build completo, suite web/gates ni pnpm test completo: reservados para T05. Los comandos ejecutados sí compilan shared/API y typecheck verifica el workspace.

## Evidencia de comportamiento

- ES 15/51: bases 14000/42500, impuestos 2940/8925, totales 16940/51425. Consumos, EUR, tasa/versiones y snapshots en DTO sin ORM ni breakdownJson; reapertura conserva resultados.
- Cero, máximo y cuatro países usan calculateQuote. Storage/API sin tarifa; plan no cambia precio.
- Dos guardados deliberados crean IDs distintos. Overrides runtime no alteran cálculo/snapshots ni fijan id/fecha; en T03 el parser HTTP además los rechazará.
- Cliente ausente, país sin tarifa incluso con cero, política inválida y consumo inválido no añaden filas ni alteran commits previos.
- Trigger TEMP AFTER INSERT falla realmente tras insertar; SQLite y transacción exterior revierten y luego se puede guardar de nuevo.
- Una transacción exterior que falla elimina el guardado de los savepoints anidados y conserva commits anteriores.
- Segunda conexión intenta cambiar país durante el callback: SQLITE_BUSY; el bloqueo inmediato protege estado usado en cálculo y snapshots. Tras commit se puede modificar cliente, sin cambiar histórico.
- Cliente/política fixture posteriores solo afectan nuevas simulaciones. Política sintética identificada, no configuración de producto ni endpoint administrativo.
- Mapper rechaza JSON/desglose/total incoherentes mediante helpers existentes. La prueba de corrupción usa copias de filas, sin alterar histórico append-only.

## Aislamiento y límites

Solo SQLite bajo contextos temporales de fixture existente, con cierre y limpieza comprobados por suite. No DB real/demo, SQL de migración ni schema modificado.
Sin endpoints nuevos; traducción HTTP de BillingError y validación de body antes de DB pertenecen a T03. El servicio recibe CreateSimulation ya parseado; no repite el parser de transporte.
Tras actualizar registros se ejecutaron pnpm.cmd format:check (0), pnpm.cmd test:docs (0, 2 pruebas correctas) y git diff --check (0). Sin repetir pruebas funcionales por los cambios exclusivamente documentales posteriores.
[Validación canónica](../../specs/005-simulations-api/validation.md) y [revisión](../reviews/005-simulations-api-t02.md).
