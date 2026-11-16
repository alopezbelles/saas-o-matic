# 007-T02 — Verificación del listado y adaptador

16 de noviembre de 2026. Base Git 0436e20 y cambios de T02. Windows PowerShell, Node 22.19.0 y pnpm 10.33.4 existentes. [Instrucción previa](../prompts/007-customers-ui.md#t02--instrucción-previa-de-implementación).

## Ejecución real

Desde raíz con Node/pnpm locales en PATH:

```powershell
pnpm.cmd lint
pnpm.cmd typecheck
pnpm.cmd build
pnpm.cmd --filter @saas-o-matic/web test:components
pnpm.cmd test
```

Lint/typecheck/build correctos, código 0. Primera prueba de componentes: 29 correctas/1 fallida. El harness muestra URL en output con rol implícito status y el test consultaba un único status; se cambió a identificar el texto de carga. Repetición 30/30 correcta, código 0. Se conserva la incidencia como error de selector, sin modificar producción por esa expectativa.

Suite global pnpm.cmd test: código 0 y 152 pruebas correctas: 36 shared, 12 unitarias API, 49 integración, 22 node web, 30 componentes (10 previas y 20 nuevas), 1 gates y 2 docs. Gates ejecutados en secuencia sin otros controles de código concurrentes. [Salida real](007-customers-ui-t02.txt).

No instalación ni dependencias nuevas. Dev/build web compilan shared antes de Vite; dev raíz compila shared antes del arranque paralelo. Esto resuelve el consumo runtime de contratos desde una instalación limpia.

## Cobertura significativa

- WEB-API-01: URL codificada, método/envelope, protocolo y JSON, DTO/página coherentes, duplicados/ID/plan/fechas, red, aborto externo y timeout 10 s durante cuerpo bloqueado. Tipo estructural de respuesta conserva registros históricos sin imponer reglas de entrada recientes.
- WEB-SEARCH-01: parser URL/página 20, debounce en 249/250 ms, reinicio offset, paginación/contexto, atrás/adelante y descarte de respuesta antigua aunque fetch ignore abort.
- WEB-STATE-01: carga, vacío inicial/sin coincidencias/página fuera de rango, errores/reintento explícito, query conservada, parámetros inválidos y campo estable durante escritura.
- Navegación de retorno solo admite destinos locales del listado con query validada. Alta/ficha continúan provisionales; se verifica su retorno sin atribuirles funciones de T03/T04.

## Proxy y navegador real

Smoke ejecutado mediante node .cache/007-t02-browser.mjs con PLAYWRIGHT_BROWSERS_PATH bajo .cache/playwright. Crea DB exclusiva mediante createTestContext/migraciones existentes e inserta 21 clientes ficticios deterministas. API Express y Vite usan puertos temporales; se comprueba que la configuración de desarrollo apunta a 3000 y retira /api, sustituyendo solo el target del backend para el smoke aislado.

Chromium obtiene datos atravesando proxy real y SQLite. Valida cuatro anchos (320/390/768/1440), búsqueda/paginación, vuelta desde ficha, recarga con q, 503 conservando búsqueda y recuperación, vacío e invalid URL. ScrollWidth igual al viewport en todos los tamaños. Cero errores de página. [Salida](007-customers-ui-t02-browser.txt), [capturas revisadas](../visuals/007-customers-ui-t02.md).

No se usan bases existentes ni se añade script E2E incompleto. El diagnóstico temporal inicia/cierra sus procesos y verifica el directorio propio antes de limpiarlo. .cache/002-tests quedó vacío tras pruebas. La validación completa de alta/E2E/zoom de 007 queda para T03–T05.

## Auditoría y cierre

git diff --exit-code -- apps/api packages/shared/src pnpm-lock.yaml devolvió 0. Contratos y persistencia conservados. Formularios y ficha/historial siguen pendientes. Aceptación humana final no registrada; sin commits/pushes del agente.

Cierre documental real: pnpm.cmd test:docs (2 pruebas), pnpm.cmd format:check y git diff --check correctos, código 0. [Validación canónica](../../specs/007-customers-ui/validation.md#t02--adaptador-api-listado-y-búsqueda).
