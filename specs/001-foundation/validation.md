# Validación 001

Fecha: 14 de noviembre de 2026. Entorno: Windows PowerShell, Node 22.19.0, npm 10.9.3, pnpm 10.33.4 y Git 2.51.0.windows.1.
Alcance: infraestructura y controles; autorización en [approvals](../../docs/approvals.md).

## Resultados reales

| RF      | Comprobación                                                         | Resultado |
| ------- | -------------------------------------------------------------------- | --------- |
| 001-RF1 | Instalación congelada, build, arranque conjunto y API compilada      | CUMPLE    |
| 001-RF2 | Integración, web, controles negativos, lint, tipos y build           | CUMPLE    |
| 001-RF3 | Contexto activo y límites en MEMORY/AGENTS/approvals                 | CUMPLE    |
| 001-RF4 | Índice canónico y enlaces locales; validación con límites explícitos | CUMPLE    |

### Comandos ejecutados

Desde la raíz, con `.tools/node_modules/.bin` añadido al PATH de la terminal:

| Comando                                                                   | Código / resultado observado                                                      |
| ------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| pnpm.cmd install --frozen-lockfile --offline                              | 0; lockfile actualizado, sin cambios necesarios, cuatro proyectos                 |
| pnpm.cmd test                                                             | 0; seis pruebas, cero fallos: API 2, web 1, gates 1 y docs 2                      |
| pnpm.cmd lint                                                             | 0; sin errores ni warnings                                                        |
| pnpm.cmd typecheck                                                        | 0; web, API y shared                                                              |
| pnpm.cmd build                                                            | 0; tres paquetes compilados, Vite 8.3.8, 15 módulos                               |
| pnpm.cmd --config.node-version=20.0.0 install --frozen-lockfile --offline | 1 esperado; ERR_PNPM_UNSUPPORTED_ENGINE, esperado >=22.13.0 <23 y recibido 20.0.0 |
| pnpm.cmd dev                                                              | Web y API arrancaron desde raíz; detenidas mediante Ctrl+C tras consultas HTTP    |
| pnpm.cmd start:api                                                        | API compilada arrancó; detenida mediante Ctrl+C tras consulta HTTP                |
| git diff --check                                                          | 0; sin errores de whitespace; avisos de conversión LF/CRLF del Git local          |

El rechazo de Node se comprobó mediante la configuración node-version de pnpm; no se ejecutó realmente el runtime Node 20.

### Casos y salidas observadas

- ENV-01: sin archivo .env, web http://127.0.0.1:5173 devolvió HTTP 200 y HTML con /src/main.tsx.
- ENV-01: health de desarrollo y de API compilada devolvió HTTP 200 con `{"status":"ok"}`.
- API-01: health JSON 200, ruta inexistente 404 y POST health 404.
- API-01: PORT invalid, 0, 65536 y 1.5 devolvieron código 1; puerto ocupado devolvió código 1 con EADDRINUSE.
- WEB-01: Vite preview sirvió HTML español con raíz React, bundle JavaScript HTTP 200 y contenido esperado.
- GATE-01: TypeScript detectó TS2322, ESLint detectó no-undef y el runner detectó un test fallido; todos devolvieron no cero. El directorio temporal se retiró en finally.
- DOC-01: enlaces locales existentes, spec activa identificada y scripts de calidad presentes.
- Formato final: pnpm.cmd format:check devolvió 0; todos los archivos comprobados cumplen Prettier. pnpm.cmd test:docs se repitió tras actualizar la documentación: dos pruebas pasaron, código 0.

## Incidencias corregidas

- El runner hijo heredaba NODE_TEST_CONTEXT y el caso de fallo intencional no se ejecutaba como runner independiente. Se elimina esa variable solo del entorno del hijo; GATE-01 pasó después.
- La escritura de JSON desde PowerShell introdujo BOM; se reescribieron los manifests como UTF-8 sin BOM y DOC-01 pasó.
- El formateador intentaba escribir las skills protegidas de .agents. Se excluyen .agents y .codex del formato general; no se modificaron skills.

## Límites y revisión

- Reinstalación reproducible con caché existente: no se ha probado en otro equipo ni descargando desde cero en esta ejecución. La descarga inicial se realizó durante la inicialización anterior.
- No se ha ejecutado una copia del proyecto en una ruta con espacios.
- No hay E2E ni inspección visual de navegador; el smoke web es HTTP.
- No hay pruebas SQLite, de negocio ni de UI avanzada porque están fuera de 001.
- Fuentes oficiales S1/S2/S3 e interfaces.pdf no disponibles; no se certifica contraste con ellas.
- No se han añadido dependencias ni cambiado pnpm-lock.yaml.
- No se han realizado commits, pushes ni cambios de remoto.
- Los procesos de arranque manual se detuvieron tras las consultas; su interrupción no se presenta como una salida espontánea de código cero.

Veredicto: **CUMPLE TÉCNICAMENTE** para el alcance de 001. T01–T05 completadas técnicamente.
La aceptación humana de la entrega no está registrada.
