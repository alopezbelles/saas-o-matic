# 010-T03 — Ensayo de entrega desde exportación limpia

Registro durante ejecución el 17 de noviembre de 2026. Fuente: commit 33774eb, inicialmente limpio; exportación local con git archive, no clon remoto. Los cambios documentales de T03 son posteriores al snapshot. No se modificó .git.

## Fuente y entorno

Archivo .cache/010-t03-source.zip, SHA-256 611191F1FDF18977345E45FF4D6FD78586A15BF906C6D20E0FF003D906E1118A. Copia de trabajo .cache/d10-33774eb. Se verificó ausencia inicial de .git, node_modules, .tools, .cache, .env y apps/api/data. Se conservaron .npmrc, .gitignore, lockfile/workspaces, README e imágenes.

Windows del equipo disponible, Node 22.19.0 y npm 10.9.3 del host; pnpm 10.33.4 instalado en la copia y Chromium 159.0.8154.6 descargado en su .cache/playwright. pnpm usa almacén/caché locales de .npmrc y descargó 373 paquetes con cero reutilizados. Lockfile igual al original tras instalar. No se copian dependencias, DB o cachés del proyecto original. No se certifica aislamiento de máquina, configuración global de herramientas o todas las cachés nativas del sistema.

## Comandos del README ejecutados

Desde raíz de la copia, usando pnpm.cmd en PowerShell:

1. npm.cmd install --prefix .tools --no-package-lock --no-audit --no-fund --cache .cache/npm pnpm@10.33.4; PATH de esa terminal incluye .tools/node_modules/.bin y Node.
2. pnpm.cmd install --frozen-lockfile; lockfile vigente, 373 paquetes descargados, scripts nativos better-sqlite3/esbuild correctos.
3. pnpm.cmd --filter @saas-o-matic/web test:e2e:install; Chromium y utilidades descargados en la copia.
4. DATABASE_KIND=demo y DATABASE_PATH=apps/api/data/roams-demo.sqlite en el entorno del proceso; pnpm.cmd db:demo:setup crea base nueva con tres clientes/simulaciones.
5. pnpm.cmd dev, seguido de /health, proxy /api y recorrido de navegador real descrito abajo.

Pasos 1–4 devuelven código 0 tras resolver la restricción de red. Salidas temporales: .cache/010-t03-bootstrap-network.txt, -install.txt, -chromium.txt y -demo.txt. El flujo no necesitó añadir pasos de aplicación al README. La red externa sirve para instalación/navegador; el recorrido de negocio permanece en EUR y no depende del proveedor FX.

## DELIVERY-01 — Recorrido observado

Arranque desde raíz con ambos servidores, /health devuelve status ok y /api/customers devuelve los tres clientes demo. En Chromium: listado → alta de DEMO Entrega limpia con NIF fixture válido → ficha → nueva simulación de 15 usuarios, 100 GB y 10.000 llamadas → preview 169,40 EUR → guardado confirmado → historial → recarga. Consulta HTTP final: un registro histórico con totalCents 16940. Cero pageerror. El cuarto cliente existe solo en la base demo de la copia.

El script de comprobación lanzó el mismo comando dev del README con la selección demo en el entorno. Su primera ejecución dejó status failed exclusivamente porque taskkill no pudo cerrar el árbol desde sandbox; todas las aserciones funcionales anteriores pasaron. Se interrumpió la sesión propia y un bind independiente confirmó 3000/5173 libres. Se conservan ambos reportes: .cache/010-t03-smoke.json y -ports.json. No se transforma el primer código de fallo en un éxito del harness.

## Incidencias de ejecución y permisos

La primera invocación de bootstrap se lanzó desde la raíz por error y se canceló; no forma parte de la evidencia limpia. Los intentos en sandbox contra registry.npmjs.org recibieron EACCES. La primera revisión automática del acceso de red falló por cuota antes de ejecutar. Tras la reanudación solicitada por Alex, la descarga autorizada se completó. Los límites fetch_retries=0 y fetch_timeout=20000 se usaron para diagnosticar el bloqueo sin esperas largas; no alteran la configuración versionada.

El intento de inventariar procesos mediante CIM también recibió acceso denegado; el cierre efectivo fue la interrupción de la sesión, verificada mediante puertos. No se modificó configuración personal ni se detuvieron servidores ajenos.

## QA-ALL-010

Lint, typecheck, format:check, build, test y test:e2e pasan sobre la copia, secuencialmente, con código 0: 276 pruebas generales (36 shared, 12 API unitarias, 52 integración, 22 web node:test, 151 componentes, un gate negativo y dos docs) y 36 E2E. Reporte sin fallos inesperados, omitidos o inestables. Gates sin otros controles concurrentes. Evidencia canónica vigente en [validación T03](../../specs/010-delivery/validation.md#t03--ensayo-de-instalación-limpia).

## Límites

Veredicto T03: CUMPLE TÉCNICAMENTE, con incidencias recuperadas y límites declarados. [Resumen estructurado](010-delivery-t03-results.json) conserva fuente/hash, resultados y fallo inicial de cleanup con su recuperación. Hash de los archivos originales de apps/api/data sin diferencias; cero directorios de fixtures bajo .cache/002-tests tanto en origen como copia. Los procesos propios se cerraron y los puertos fijos quedaron disponibles. Se retienen copia/ZIP/logs en .cache como artefactos ignorados; no se versionan dependencias, navegador o DB demo. No se ejecuta limpieza de datos ajenos.

Es una instalación limpia de archivos/dependencias del proyecto en el mismo Windows, no una VM, un clon remoto o prueba de Linux/macOS. Los resultados no garantizan hosting, CORS de producción o seguridad completa. Los artefactos locales de caché son efímeros; este registro conserva fuente, método e incidencias sin copiar rutas personales ni datos reales. Aceptación humana y T04/T05 pendientes.
