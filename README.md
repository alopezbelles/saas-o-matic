# saas-o-matic

Infraestructura inicial Full-Stack para la prueba técnica de Roams. No incluye funcionalidades de negocio ni configuración de base de datos.

## Requisitos

- Node.js 22, versión 22.13 o superior (validado con 22.19.0).
- npm (validado con 10.9.3).
- pnpm 10.33.4, fijado en `packageManager`.
- Git (validado con 2.51.0).

## Instalación

Desde la raíz, con pnpm disponible:

```sh
pnpm install --frozen-lockfile
```

En Windows PowerShell, si pnpm no está instalado, se puede instalar únicamente dentro del proyecto. Se usa `npm.cmd` para evitar el bloqueo de `npm.ps1` por la política de ejecución:

```powershell
npm.cmd install --prefix .tools --no-package-lock --no-audit --no-fund --cache .cache/npm pnpm@10.33.4
$env:Path = "$PWD\.tools\node_modules\.bin;$env:Path"
pnpm.cmd install --frozen-lockfile
```

La modificación de `Path` solo afecta a la terminal actual. En esa terminal, usar `pnpm.cmd` en lugar de `pnpm` para los comandos siguientes. `.tools` y `.cache` están ignorados por Git. La instalación verifica los requisitos de Node mediante `engine-strict`.

## Ejecución desde la raíz

```sh
pnpm dev
```

- Frontend: <http://127.0.0.1:5173>.
- API: <http://127.0.0.1:3000>.
- Salud: `GET http://127.0.0.1:3000/health`, respuesta `{"status":"ok"}`.
- Detener ambos procesos con `Ctrl+C`.

Comandos independientes:

```sh
pnpm dev:web
pnpm dev:api
pnpm typecheck
pnpm lint
pnpm format:check
pnpm format
pnpm build
pnpm start:api
pnpm test
```

`start:api` requiere ejecutar `build` previamente. El backend acepta la variable de entorno opcional `PORT` y usa 3000 por defecto. No se necesita archivo `.env` para arrancar. Ambos servidores de desarrollo escuchan en la interfaz local.

## Estructura

```text
apps/
  web/                 React + TypeScript + Vite
  api/                 Express + TypeScript; desarrollo con tsx
packages/
  shared/              Punto de entrada para futuros contratos TypeScript
```

La configuración raíz contiene los workspaces, TypeScript estricto, ESLint y Prettier. `shared` emite JavaScript y declaraciones al compilar; todavía no define contratos ni tiene consumidores. `pnpm-lock.yaml` fija las versiones resueltas y debe mantenerse versionado.

Las dependencias de ejecución son React y React DOM en web y Express en API. El resto son herramientas de desarrollo y tipos. No se han añadido librerías de UI, Prisma ni SQLite.

## Pruebas y documentación

`pnpm test` ejecuta integración de API, smoke HTTP de web, comprobaciones negativas de los controles y enlaces documentales. Compila las aplicaciones antes de sus pruebas. No instala dependencias nuevas ni usa base de datos.

También existen `test:integration`, `test:web`, `test:gates` y `test:docs`. No ejecutar `test:gates` en paralelo con lint, tipos o build: introduce errores temporales y comprueba que los controles los rechazan. El smoke web no sustituye pruebas de navegador.

El arranque no carga `.env` automáticamente; [.env.example](.env.example) explica la variable opcional PORT. Contexto y evidencias en [ai-workspace](ai-workspace/README.md), [testing](docs/testing.md) y [validación 001](specs/001-foundation/validation.md).

## Git

El repositorio local está vinculado al remoto indicado por Alex. Esta tarea no realiza commits ni pushes. Se ignoran dependencias, cachés, compilaciones, variables de entorno y archivos SQLite (incluidos sus archivos auxiliares).
