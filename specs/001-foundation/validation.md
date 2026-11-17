# Validación 001

Alcance: infraestructura y controles; autorización en [approvals](../../docs/approvals.md).

## Resultados de la implementación histórica

| RF      | Comprobación                                                         | Resultado |
| ------- | -------------------------------------------------------------------- | --------- |
| 001-RF1 | Instalación congelada, build, arranque conjunto y API compilada      | CUMPLE    |
| 001-RF2 | Integración, web, controles negativos, lint, tipos y build           | CUMPLE    |
| 001-RF3 | Contexto activo y límites en MEMORY/AGENTS/approvals                 | CUMPLE    |
| 001-RF4 | Índice canónico y enlaces locales; validación con límites explícitos | CUMPLE    |

## Trazabilidad del cierre

| RF  | Tareas      | Casos registrados                   | Relación con la dirección del trabajo                         |
| --- | ----------- | ----------------------------------- | ------------------------------------------------------------- |
| RF1 | T01/T02/T05 | ENV-01 y API-01                     | Instalar/arrancar y observar health, sin ampliar a producto   |
| RF2 | T03/T05     | API-01, WEB-01 y GATE-01            | Verificar comportamiento y que los controles detecten errores |
| RF3 | T01/T04/T05 | DOC-01 y restricciones del contexto | Mantener stack/alcance y conciliar antes de modificar         |
| RF4 | T04/T05     | DOC-01 y registro de límites        | Permitir comprobar lo ejecutado y distinguir lo no probado    |

[Mensajes originales y contexto técnico](../../ai-workspace/prompts/001-foundation.md), [decisiones](../../ai-workspace/decisions/ADR-001-monorepo.md) y [evolución](../../ai-workspace/iterations/001-foundation-retrospective.md) explican los criterios técnicos. Las síntesis son retrospectivas y no añaden resultados. Los bloques identificados como mensajes originales en prompts/001-foundation.md se recuperan literalmente del historial local de Codex; el contexto técnico añadido se mantiene separado.

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
- En el cierre original no estaban disponibles las fuentes oficiales S1/S2/S3 e interfaces.pdf; no se certifica un contraste en aquella ejecución. Las consultas de entregas posteriores se registran por separado.
- No se han añadido dependencias ni cambiado pnpm-lock.yaml.
- No se han realizado commits, pushes ni cambios de remoto.
- Los procesos de arranque manual se detuvieron tras las consultas; su interrupción no se presenta como una salida espontánea de código cero.

Veredicto: **CUMPLE TÉCNICAMENTE** para el alcance de 001. T01–T05 completadas técnicamente.
La aceptación humana de la entrega no está registrada.

## Registro retrospectivo del proceso

Registro incorporado después del desarrollo: [iteración](../../ai-workspace/iterations/001-foundation-retrospective.md), [mensajes originales y contexto técnico](../../ai-workspace/prompts/001-foundation.md), [resumen de evidencia](../../ai-workspace/testing/001-foundation.md) y [revisión documental](../../ai-workspace/reviews/001-foundation.md).
Esta incorporación no reejecuta pruebas ni cambia los resultados históricos; no hay log íntegro de 001 conservado ni aceptación humana final registrada.

## Revisión editorial del registro

Base documental de referencia: 3f3265a. Revisión de once documentos existentes: instrucciones con entradas/objetivos/restricciones/entregables, decisiones con motivos/consecuencias, iteración problema→diagnóstico→corrección→comprobación e índice por las tres dimensiones del enunciado. Se conserva la cronología real de 001, sin cambiar requisitos, estado de tareas o resultados de la ejecución histórica.

No se modifica código ni se vuelven a ejecutar las seis pruebas de infraestructura como parte de esta revisión. Comprobaciones actuales: pnpm.cmd test:docs devuelve código 0 con dos pruebas correctas; Prettier sobre los once documentos cumple y git diff --check no presenta errores. La comprobación adicional de anclas Markdown locales recorre 159 documentos y 219 referencias sin fallos. Se compara la sección histórica de comandos con HEAD y permanece intacta. Salidas temporales .cache/001-review-docs.txt, -format-check.txt y -anchors.json. Estos controles no renuevan el veredicto técnico histórico. Aceptación humana separada.

## Recuperación de mensajes originales

Se localizan en el historial local de Codex los tres mensajes de usuario que corresponden a P001-01/P001-02/P001-03. Se incorporan literalmente a prompts/001-foundation.md, sin corregir su redacción ni atribuirles las explicaciones técnicas añadidas. No se exportan conversaciones completas, rutas personales o archivos de configuración. La literalidad de los tres bloques se contrasta con el texto recuperado; las síntesis de iteración/arquitectura siguen siendo registros posteriores.

Verificación de recuperación: los tres bloques coinciden con el texto extraído del historial, normalizando únicamente saltos de línea del soporte. Se protegen del formateador con prettier-ignore para conservar su contenido, incluidos dos espacios finales presentes en los originales. La comprobación estándar git diff --check los señala como whitespace; se mantienen deliberadamente como parte de la transcripción. Las dos pruebas documentales pasan y las anclas locales no presentan fallos. Salidas temporales .cache/001-original-prompts-docs.txt y .cache/001-review-anchors.json; no se adjuntan logs completos de sesión.
