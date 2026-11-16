# 007-T01 — Verificación

16 de noviembre de 2026. Base Git 4906dbf y cambios de trabajo de T01. Windows PowerShell, Node 22.19.0, pnpm 10.33.4, React/React DOM 19.3.1 y Vite 8.3.8.

## Compatibilidad e instalación

Consultas npm view a engines/peerDependencies antes de instalar. El acceso inicial bajo sandbox devolvió EACCES; consultas e instalación se completaron con elevación revisada. React Router latest 8.5.1 requiere Node >=22.22.0 y jsdom latest 31.0.1 requiere ^22.22.2 o superior; se eligieron react-router 7.18.5 y jsdom 27.0.1 compatibles. Resto fijado: Vitest 5.1.0, RTL React 16.3.3, DOM 10.4.2, user-event 14.6.12, jest-dom 7.0.1 y Playwright 1.65.1. Los peers de canvas siguen opcionales.

Comandos ejecutados desde raíz con Node y pnpm locales en PATH:

```powershell
pnpm.cmd --filter @saas-o-matic/web add --save-exact react-router@7.18.5
pnpm.cmd --filter @saas-o-matic/web add -D --save-exact vitest@5.1.0 jsdom@27.0.1 @testing-library/react@16.3.3 @testing-library/user-event@14.6.12 @testing-library/jest-dom@7.0.1 @testing-library/dom@10.4.2 @playwright/test@1.65.1
pnpm.cmd install --frozen-lockfile --offline
```

Código 0, engine-strict conservado y enlace shared workspace:* instalado. Advertencias de subdependencias obsoletas observadas en instalación, sin error. Chromium/FFmpeg/Winldd de Playwright se descargaron con PLAYWRIGHT_BROWSERS_PATH bajo .cache/playwright, sin instalación global.

## Pruebas y controles reales

pnpm.cmd lint correcto. Primer typecheck falló TS2375 porque NavLink recibe clase indexada CSS Modules con tipo string|undefined bajo exactOptionalPropertyTypes; se concretó la clase existente. Repetición pnpm.cmd typecheck correcta.

pnpm.cmd test:web pasó con 22 node:test conservadas y 8 Vitest iniciales. pnpm.cmd build pasó para todo el workspace. Primera pnpm.cmd test global pasó 130 pruebas: 36 shared, 12 unitarias API, 49 integración, 22 node web, 8 componentes, 1 gates y 2 docs. Después se añadieron dos regresiones de barra final/breadcrumb; la suite web final pasó 22 node + 10 componentes, código 0.

Descubrimiento aislado: node:test test/_.test.mjs; Vitest src/\**/_.test.{ts,tsx}, con cleanup y entorno jsdom. No se retiró cobertura FX ni smoke de 006. Sin E2E vacío.

## Navegador real

Smoke de shell ejecutado con Chromium Playwright desde Vite en puerto temporal, reloj/red reales solo para recursos locales. Verificó rutas directas, recarga de alta, retorno de 404, foco, salto al contenido y anchos 320/390/768/1440. ScrollWidth igual al ancho en los cuatro. Cero errores de página. [Salida conservada](007-customers-ui-t01-browser.txt) y [capturas](../visuals/007-customers-ui-t01.md).

El script diagnóstico inicial usó import nombrado de un entry CJS de Playwright y falló antes de lanzar navegador; se corrigió lectura del export default y el smoke pasó. Script local bajo .cache, no runner de alta E2E.

No se verificaron formularios, datos de clientes, zoom 200% o estados finales de pantallas, que se implementan después. El contorno del encabezado en capturas es el foco programático de navegación visible.

## Conservación y estado

Diff de apps/api y packages/shared/src vacío. Solo dependencias web/lockfile, shell, tests y documentación cambiados. Integración usa SQLite temporal del runner; .cache/002-tests vacío después de suite, sin datos reales o commits.

RF5 parcial, T01 conforme técnicamente. T02–T05 pendientes y aceptación humana final no registrada. Tras dos regresiones de barra final, pnpm.cmd lint/typecheck/test:web pasan con 22 node + 10 componentes. La suite global inicial conserva 130 resultados; la web final se verificó por separado. [Log global inicial](007-customers-ui-t01.txt), [log web final](007-customers-ui-t01-web.txt) y [validación canónica](../../specs/007-customers-ui/validation.md). Cierre documental: pnpm.cmd test:docs (2), pnpm.cmd format:check y git diff --check correctos, código 0.
