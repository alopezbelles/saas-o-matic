# saas-o-matic

Infraestructura inicial Full-Stack para la prueba técnica de Roams. Incluye infraestructura y persistencia SQLite; las funcionalidades de negocio todavía no están implementadas.

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
  shared/              Planes y límites técnicos compartidos
```

La configuración raíz contiene los workspaces, TypeScript estricto, ESLint y Prettier. `shared` emite JavaScript y declaraciones al compilar; exporta planes y límites usados por la persistencia de API. `pnpm-lock.yaml` fija las versiones resueltas y debe mantenerse versionado.

Web utiliza React/React DOM. API utiliza Express, Drizzle y better-sqlite3. No se han añadido librerías de UI ni Prisma.

## Pruebas y documentación

`pnpm test` ejecuta integración de API, smoke HTTP de web, comprobaciones negativas de los controles y enlaces documentales. Compila las aplicaciones antes de sus pruebas. Usa bases SQLite temporales aisladas; no abre la base de desarrollo.

También existen `test:integration`, `test:web`, `test:gates` y `test:docs`. No ejecutar `test:gates` en paralelo con lint, tipos o build: introduce errores temporales y comprueba que los controles los rechazan. El smoke web no sustituye pruebas de navegador.

El arranque no carga `.env` automáticamente; [.env.example](.env.example) explica la variable opcional PORT. Contexto y evidencias en [ai-workspace](ai-workspace/README.md), [testing](docs/testing.md) y [validación 001](specs/001-foundation/validation.md).

## Git

El repositorio local está vinculado al remoto indicado por Alex. Esta tarea no realiza commits ni pushes. Se ignoran dependencias, cachés, compilaciones, variables de entorno y archivos SQLite (incluidos sus archivos auxiliares).

## Persistencia SQLite (002)

No necesitas instalar un servidor SQLite. El archivo se crea solo mediante un comando explícito.
Los comandos se ejecutan desde la raíz y compilan shared/API antes de operar.

```sh
pnpm db:migrate
pnpm db:generate
pnpm db:backup --out apps/api/data/backup.sqlite
```

db:migrate usa apps/api/data/dev.sqlite por defecto. Si ya existe, exige propietario y esquema reconocidos.
db:generate solo genera SQL para revisión, no abre DB. Nunca modificar una migración ya aplicada.
El backup exige un destino nuevo. No hay reset ni borrado automático.

Para crear una demo en PowerShell:

```powershell
$env:DATABASE_KIND = 'demo'
$env:DATABASE_PATH = 'apps/api/data/demo.sqlite'
pnpm.cmd db:demo:init
pnpm.cmd db:seed
pnpm.cmd db:seed
pnpm.cmd db:backup --out apps/api/data/demo-backup.sqlite
Remove-Item Env:DATABASE_KIND
Remove-Item Env:DATABASE_PATH
```

En POSIX, anteponer DATABASE_KIND=demo DATABASE_PATH=apps/api/data/demo.sqlite a cada comando de demo.
demo:init exige archivo nuevo; seed exige base demo marcada, conserva filas ajenas y no duplica.
El seed contiene solo clientes ficticios; no representa identificadores fiscales válidos ni precios reales.

Las rutas relativas son respecto a la raíz del repo, independientes del directorio de trabajo.
DB y backups solo pueden situarse bajo apps/api/data o .cache. Nunca en web, código ni fuera del proyecto.
No hay carga automática de .env: exportar las variables en la terminal.
No se ha creado una DB persistente de desarrollo durante la implementación: los tests usan .cache/002-tests.

[Modelo y recuperación](docs/data-model.md), [spec 002](specs/002-persistence/spec.md) y [validación](specs/002-persistence/validation.md).
