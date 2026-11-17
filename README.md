# saas-o-matic

SaaS-O-Matic permite registrar clientes, consultar su ficha e historial y simular una suscripción con facturación por tramos, impuesto y conversión orientativa del total. pnpm dev arranca web y API desde raíz, compilando shared antes. El listado está en /customers y Vite conecta /api con el backend local en puerto 3000. Los fallos de servicio disponen de estados de error y recuperación.

Aplicación Full-Stack para la prueba técnica de Roams, con React/TypeScript/Vite, Express, contratos y dominio compartidos y persistencia SQLite.

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
  shared/              Contratos, validación y dominio de facturación/divisas
```

La configuración raíz contiene los workspaces, TypeScript estricto, ESLint y Prettier. `shared` emite JavaScript y declaraciones al compilar y centraliza contratos, validaciones y cálculo monetario. `pnpm-lock.yaml` fija las versiones resueltas y debe mantenerse versionado.

Web utiliza React/React DOM. API utiliza Express, Drizzle y better-sqlite3. No se han añadido librerías de UI ni Prisma.

## Pruebas y documentación

`pnpm test` ejecuta pruebas unitarias, integración de API, transporte/componentes web, comprobaciones negativas de los controles y enlaces documentales. Compila las aplicaciones antes de sus pruebas. Usa bases SQLite temporales aisladas.

También existen `test:unit` (contratos/fiscal de clientes), `test:integration`, `test:web`, `test:gates` y `test:docs`. No ejecutar `test:gates` en paralelo con lint, tipos o build: introduce errores temporales y comprueba que los controles los rechazan. El smoke web no sustituye pruebas de navegador.

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
Las pruebas automatizadas crean contextos temporales propios bajo .cache/002-tests.

[Modelo y recuperación](docs/data-model.md), [spec 002](specs/002-persistence/spec.md) y [validación](specs/002-persistence/validation.md).

## Interfaz de clientes (007)

Con API y web ejecutándose mediante pnpm dev, abre http://127.0.0.1:5173/customers. Listado con búsqueda/paginación, alta, ficha e historial EUR guardado disponibles. La web consulta /api a través del proxy de desarrollo Vite; en producción será necesario resolver ese prefijo por separado.

Pruebas de navegador desde raíz: pnpm test:e2e. Compila API/shared y ejecuta Playwright con API/Vite en puertos propios y una DB temporal por prueba; no requiere arrancar servidores ni usa registros existentes. En una instalación nueva, descarga primero Chromium en caché del proyecto con pnpm --filter @saas-o-matic/web test:e2e:install. No es una instalación global. Reporte JSON, capturas y trazas de fallo quedan en .cache/007-e2e; no se versionan automáticamente. pnpm test conserva suites unitarias/integración/componentes/gates/docs; E2E se ejecuta aparte.

[Validación y límites de 007](specs/007-customers-ui/validation.md).

## API de clientes (003)

Inicializa o actualiza la DB explícitamente con pnpm db:migrate antes de usar /customers. /health sigue funcionando sin ella; clientes devuelve 503 si falta el archivo o hay migraciones pendientes.
Para una base existente, genera primero un backup en un destino nuevo mediante pnpm db:backup --out apps/api/data/antes-003.sqlite. La migración 0001_optional_contact conserva contactos e histórico; no se ejecuta automáticamente al arrancar.

POST /customers acepta exactamente companyName, taxId, contactEmail, countryCode y planCode. No exige contactName. Responde 201 y Location.
GET /customers?q=&limit=&offset= busca por nombre/fiscal; GET /customers/:id devuelve detalle.
Contrato y ejemplo en [API](docs/api-contracts.md). Control ES algorítmico, no consulta censal; [fuentes y límites](specs/003-customers-api/fiscal-rules.md).

pnpm test:unit ejecuta contratos, fiscal y motor monetario; pnpm test:integration cubre clientes, persistencia, lifecycle y simulaciones.

## Simulaciones e histórico (005)

La infraestructura FX de [006](specs/006-currency/spec.md) proporciona conversión orientativa del total EUR a USD/GBP y cliente de tasas con caché/timeout. El simulador de 008 integra el selector y muestra fecha y atribución del proveedor. Contratos y límites en [API](docs/api-contracts.md#servicio-externo-fx--006).

Con la DB inicializada mediante los comandos existentes, POST /simulations acepta exactamente customerId (UUID de cliente registrado), users, storageGb y apiCalls. El servidor calcula y guarda EUR, versiones y snapshots; responde 201 después del commit. No enviar precios, país, plan ni importes calculados.
GET /customers/:id/simulations?limit=20&offset=0 devuelve historial paginado con total, desde datos guardados sin recalcular; cliente inexistente devuelve 404 y cliente sin registros devuelve lista vacía.
GET /billing-config publica tramos, versiones, tasas por país y límites; funciona sin DB y usa Cache-Control: no-store. /health también permanece independiente de DB.
Límites: users 0..1000, storageGb 0..10000, apiCalls 0..10000000, enteros. Solo users genera coste. Motor acumulativo users-tiered-v1 y política demo-standard-v1 (ES 21%, FR 20%, DE 19%, GB 20%); política simplificada, sin fiscalidad completa ni FX.
No se crea ni migra DB al arrancar y 005 no añade migraciones. Dos guardados deliberados pueden crear dos registros; no hay reintento POST automático ni idempotencia avanzada.
[Contratos](docs/api-contracts.md), [spec](specs/005-simulations-api/spec.md) y [verificación global](ai-workspace/testing/005-simulations-api-t05.md). T01–T05 completadas técnicamente; aceptación humana final no registrada.

## Simulador interactivo (008)

Desde la ficha del cliente, pulsa «Nueva simulación» para acceder a /customers/:id/simulations/new. Usuarios, almacenamiento y llamadas API comienzan en cero. Ajusta los consumos, revisa el desglose EUR y selecciona EUR/USD/GBP para el total. Al guardar se muestra el resultado confirmado por el servidor y cualquier diferencia respecto al presupuesto previo.

«Volver al cliente» consulta el historial conservando su contexto. «Actualizar historial» permite comprobar registros después de un resultado incierto. Los errores de red conservan el formulario y ofrecen consultar el historial en otra pestaña. El fallo del proveedor de divisas muestra EUR y permite guardar una simulación válida.

Ejecuta pnpm test:e2e para verificar el flujo completo y las revisiones de navegador con API/Vite/SQLite temporales. [Validación de 008](specs/008-simulator-ui/validation.md).
