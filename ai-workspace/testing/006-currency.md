# 006 — Evidencia de verificación

Registro retrospectivo redactado el 15 de noviembre de 2026 por autorización posterior. Fuente canónica: [validación por tarea](../../specs/006-currency/validation.md). No se ejecuta nuevamente la funcionalidad para crear este documento.

## Versiones y entorno

Windows PowerShell, Node 22 y pnpm local 10.33.4. T05 se ejecutó sobre base 53c38a7 más cambios de cierre sin commit; comparación de conservación frente a 6d4d14e. No atribuir esta ejecución a un commit de cierre inexistente al redactar.

## Resultados históricos por tarea

| Tarea | Controles reales principales                                  | Resultado                                                        |
| ----- | ------------------------------------------------------------- | ---------------------------------------------------------------- |
| T01   | lint, typecheck, test:unit, test:web, test:docs, format:check | 40 unitarias, 3 web, 2 docs; código 0. Solo contratos/fixtures.  |
| T02   | lint, typecheck, test:unit, test:docs, format:check           | 48 unitarias y 2 docs; código 0. Conversión pura.                |
| T03   | lint, typecheck, test:web, test:docs, format:check            | 11 web y 2 docs finales; código 0 tras corregir helper.          |
| T04   | lint, typecheck, test:web, test:docs, format:check            | 20 web y 2 docs; código 0. Transporte simulado.                  |
| T05   | lint, typecheck, build, test, format:check y diff check       | Suite global 122/122; código 0 tras corregir exclusión de caché. |

No sumar ejecuciones históricas a los 122 tests actuales. Comandos exactos por fase, controles omitidos y fallos previos en la validación canónica.

## Suite global conservada

[Salida real T05](006-currency-t05.txt), trasladada del archivo local .cache/006-t05-tests.log. Texto transcodificado a UTF-8 para versionarlo, sin reconstruir resultados ni añadir salidas de controles ajenos. No contiene un log íntegro de lint/typecheck/build/formato; sus códigos se conservan en la validación.

Comandos ejecutados desde raíz en T05:

```powershell
pnpm.cmd lint
pnpm.cmd typecheck
pnpm.cmd build
pnpm.cmd test
pnpm.cmd test:docs
pnpm.cmd format:check
git diff --check
```

Gates no concurrentes con otros controles de código. Desglose del log: 36 shared + 12 unitarias API + 49 integración + 22 web + 1 gates + 2 docs = 122; cero fallos/omitidas. MockTimers emite aviso experimental, sin fallo.

## Incidencias y límites

T03 falló inicialmente por helper que reemplazaba reloj undefined por default; llamada directa corregida y repetición correcta. T05 falló inicialmente en lint por caché JS anidada; se corrigió exclusión y controles pasaron. Esos fallos están descritos con sus resultados en la validación; no se fabrica una salida completa que no se guardó.

CORS inconcluso: Edge headless falló por GPU antes de producir DOM/resultado FX; Chrome no produjo resultado verificable. No afirmar que el proveedor falla o que funciona CORS. Sin E2E visual; próxima integración debe comprobarlo en navegador operativo y mostrar atribución.

Auditoría frente a cierre 005: API/migraciones, lockfile y pantallas App/main sin cambios. .cache/002-tests quedó vacío y sin gate-check residual. Solo SQLite temporal del runner, sin datos reales. La conservación de snapshots cuenta además con regresión existente; la prueba de composición nueva no sustituye a SQL ni a aceptación humana.

## Verificación documental de este registro

Tras escribir registros/índices: pnpm.cmd test:docs (2 pruebas), pnpm.cmd format:check y git diff --check correctos, código 0. No se repite suite funcional por cambios solo documentales; los 122 resultados pertenecen a T05.
