# 005-T01 — Evidencia de verificación

15 de noviembre de 2026. Resumen retrospectivo creado por autorización posterior; resultados de la ejecución de T01 disponibles en la conversación y [validación canónica](../../specs/005-simulations-api/validation.md#t01--contratos-y-parsers).
Entorno registrado: Windows/PowerShell, Node 22.19.0 y pnpm 10.33.4 existentes. Base 675ac5e, cambios T01 sin commit al crear este registro.

## Comandos ejecutados durante T01

Desde raíz, usando herramientas locales mediante PATH de proceso:

```powershell
$env:Path = "C:\Program Files\nodejs;$PWD\.tools\node_modules\.bin;$env:Path"
pnpm.cmd lint
pnpm.cmd typecheck
pnpm.cmd test:unit
pnpm.cmd format:check
pnpm.cmd test:docs
git diff --check
```

Todos devolvieron 0. test:unit compiló shared/API y ejecutó 25 shared + 12 API = 37 tests, ninguno omitido. Los 12 API incluyen los 7 nuevos de contratos y 5 anteriores. test:docs pasó con 2 pruebas.
Tras actualizar evidencias de T01 se repitieron formato/docs/diff, también correctos. No se reconstruye un archivo de salida cruda como si se hubiera capturado durante esa ejecución.

## Qué acreditan las siete pruebas nuevas

UT-SIM-CONTRACT-005: objeto/cuatro campos y UUID; cuerpos inválidos/ausencias; overrides monetarios/cliente; cada consumo mínimo/máximo/máximo+1 y tipos sin coerción; UUID inválidos; paginación válida; query repetida/desconocida/no canónica.
Se comprobaron entrada congelada, salida independiente y normalización de UUID. Las regresiones de 003 y motor 004 se conservaron.
La extracción de paginación mantiene defaults/rangos y ceros iniciales; query de clientes continúa admitiendo q, histórico lo rechaza.
DTO y contratos compilan con TypeScript strict sin tipos ORM. Esto no equivale a disponer de serialización de filas, servicio o rutas HTTP.

## Controles no ejecutados y estado

No se ejecutaron build completo, integración/web/gates ni test completo durante T01; se reservan para el cierre T05. typecheck sí verificó workspaces y test:unit compiló shared/API.
Sin DB, instalación, migración ni commits. RF completos de 005 todavía pendientes; solo contratos/parsers conformes.
Comprobación real después de crear estos registros: pnpm.cmd format:check devuelve 0; pnpm.cmd test:docs devuelve 0 (2 tests pasan) y git diff --check devuelve 0. No se repitieron controles funcionales para una modificación solo documental; los 37 unitarios siguen siendo evidencia de T01, no una ejecución nueva atribuida al registro.
[Revisión](../reviews/005-simulations-api-t05.md) e [iteración](../features/005-simulations-api/iterations.md).
