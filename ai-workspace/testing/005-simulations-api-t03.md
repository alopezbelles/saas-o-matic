# 005-T03 — Alta HTTP y errores

15 de noviembre de 2026. Windows/PowerShell; herramientas existentes Node 22.19.0, pnpm 10.33.4. Base d9b887a, rama specs/005-simulations-api, cambios T03 sin commit.

## Comandos y resultados reales

```powershell
$env:Path = "C:\Program Files\nodejs;$PWD\.tools\node_modules\.bin;$env:Path"
pnpm.cmd lint
pnpm.cmd typecheck
pnpm.cmd --filter @saas-o-matic/api... build
node --test apps/api/test/simulations.test.mjs
pnpm.cmd test:unit
pnpm.cmd test:integration
```

Todos devuelven 0. Prueba focalizada: 7 casos nuevos. Regresiones: 37 unitarios (25 shared, 12 API), 41 integración (34 previos + 7 HTTP nuevos), sin omitidos. No contar otra vez los siete focalizados.
[Salida real](005-simulations-api-t03.txt). No build completo, web/gates ni suite completa, previstos para T05. Los comandos ejecutados sí compilan shared/API y verifican tipos del workspace.

## Evidencias HTTP

- POST ES 15/51 devuelve 201 y DTO coincidente con fila ya guardada/commit cerrado; repeticiones deliberadas generan registros distintos. Sin Location hacia recurso inexistente ni X-Powered-By.
- Body, extras, consumos, UUID, JSON, tamaño y media/charset inválidos generan 400/413/415/422 antes de solicitar conexión; health tampoco pide DB.
- Cliente ausente → 404; cliente IT con cero usuarios → 422 TAX_COUNTRY_UNSUPPORTED y fields.customerId, sin escritura.
- DB ausente → 503 sin crear archivo; tras inicializar solo la DB temporal, petición válida funciona. DB bloqueada por otra conexión → 503, sin fila parcial; tras liberar bloqueo se recupera.
- Trigger TEMP AFTER INSERT provoca fallo real; 500 público sanitizado y registro previo intacto. Retirado el trigger, vuelve a funcionar.
- Política inválida/overflow sintéticos son 500 INTERNAL_ERROR; logs conservan solo código técnico y metadata. Ningún detalle del motor, SQL, PII o stack se devuelve en estos errores.
- X-Request-Id coincide con envelope; logs limitados a requestId/method/status/code. Snapshots autorizados sí forman parte de respuesta de éxito.
- Histórico/configuración siguen sin endpoint en T03. Se prueba su 404 actual, que T04 deberá actualizar al implementarlos.

## Reutilización y límites

jsonBody comparte exactamente el protocolo 003 (application/json, 32kb, strict:false) entre altas de clientes y simulaciones. Regresiones previas de clientes pasan.
billingPolicy es opción interna de createApp, no campo de body ni elección pública. Conexión sigue lazy; motor y transacción no se duplican.
Todas las integraciones usan contextos SQLite temporales y cierre/limpieza existentes. Sin DB real, migraciones, dependencias ni commits.
Tras actualizar registros: pnpm.cmd format:check devuelve 0, pnpm.cmd test:docs devuelve 0 (2 pruebas correctas) y git diff --check devuelve 0. No se repitieron pruebas funcionales por cambios solo documentales de cierre. [Validación](../../specs/005-simulations-api/validation.md) y [revisión](../reviews/005-simulations-api-t05.md).
