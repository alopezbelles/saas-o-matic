# Validación 010

T01–T02 completadas técnicamente. T03–T05 NO EJECUTADAS. El cierre técnico de 009 es evidencia previa, no prueba de instalación limpia de 010. Aceptación humana pendiente.

## Matriz prevista

| RF      | Tareas y controles                                         | Resultado real de implementación                               |
| ------- | ---------------------------------------------------------- | -------------------------------------------------------------- |
| 010-RF1 | T01/T03/T05, DOC-README-010, DELIVERY-01, QA-ALL-010       | PARCIAL T01, instrucciones y demo; ensayo limpio pendiente     |
| 010-RF2 | T01/T02/T05, DOC-README-010, DOC-AUDIT-010                 | CONFORME alcance documental T02, índice/procedencia/evidencias |
| 010-RF3 | T01–T05, procedencia/versión/límites y revisión documental | PARCIAL T01, resultados y límites documentados                 |
| 010-RF4 | T04/T05, DELIVERY-02                                       | NO EJECUTADO; sin publicación/despliegue autorizado            |

## T02 — Índice y evidencia del desarrollo asistido

17 de noviembre de 2026, base 41a6454 y Git inicial limpio. Alex autoriza ejecutar T02, cuyo alcance incluye actualizar ai-workspace; C06 queda resuelta para ese registro. La exclusión vigente durante 008/009/010-T01 se conserva como contexto histórico y no se reproducen mensajes de análisis/adaptación excluidos. [Instrucción previa](plan.md#t02--auditoría-enlazada-y-procedencia).

DOC-AUDIT-010: se actualizan recorrido actual e índices por carpeta, tres índices de instrucciones previas, tres síntesis de iteración, un inventario de evidencias 008–010, una revisión técnica y un índice de capturas ya conservadas. No se añaden decisiones arquitectónicas o ADR artificiales. README raíz refleja el registro autorizado. Fuentes consultadas frente a PDF distribuidos, CORS histórico frente a comprobación posterior y capturas existentes quedan diferenciados.

Los registros de 008/009/010-T01 se identifican como posteriores; T02 tiene instrucción previa en plan y registro durante ejecución. Los resultados funcionales 273/31 E2E de 008, 273/36 E2E de 009 y 276 generales de 010-T01 se enlazan sin atribuir nuevas ejecuciones a T02. Salidas históricas consultadas en caché disponibles en esta revisión; su carácter efímero/sobrescribible queda declarado. Las cuatro imágenes se enlazan a docs/images, sin duplicarlas ni generar capturas nuevas.

pnpm.cmd test:docs pasa con código 0, dos pruebas correctas, después de crear los registros e índices. Salida .cache/010-t02-docs.txt. pnpm.cmd format:check pasa, salida .cache/010-t02-format-final.txt; git diff --check sin errores. No se repiten pruebas de producto, FX real o instalación por este cambio documental. Veredicto T02 CUMPLE TÉCNICAMENTE dentro de su alcance. T03–T05, ensayo limpio y aceptación humana final pendientes. Sin código de producto, dependencias, migraciones, datos existentes, commits/pushes o publicación modificados.

## T01 — README técnico y demo reproducible

17 de noviembre de 2026, base 05bedcf, Git inicial limpio. Alex autoriza T01 con C01–C05 confirmadas. [Instrucción previa](plan.md#t01--readme-como-entrada-a-la-entrega). Entorno Windows, Node 22.19.0 y pnpm 10.33.4; sin nuevas dependencias o cambios de schema/migraciones/seed histórico.

DOC-README-010: README reorganizado con título de la prueba, índice/inicio rápido, tabla de necesidades, arquitectura/decisiones/consecuencias, recorrido 001–010, procedencia Codex/ChatGPT Work con Product y enlaces canónicos. Se distinguen requisitos y política demo, declaración de Alex y evidencia conservada, validación 009 y ensayo limpio de 010 todavía pendiente. .env.example corrige el uso de variables DB tanto en API como CLI. MEMORY.md y el gate documental identifican 010 como spec activa.

El nuevo comando raíz pnpm db:demo:setup exige DATABASE_KIND=demo y DATABASE_PATH explícito distinto de dev.sqlite. Reutiliza creación exclusiva/cleanup de withNewDatabase, migraciones, parsers y servicios de clientes/simulaciones. Crea tres clientes ES ficticios válidos y una simulación por cliente; los importes se calculan con el motor existente. No cambia el seed histórico y no sobrescribe destinos. IDs/fechas son de creación, datos de entrada fijos. No usa red FX ni precios introducidos por UI.

IT-DEMO-010 añade tres pruebas: reapertura/contenido/integridad/snapshots e importes esperados independientes (16940/50820/56870 céntimos), CLI desde otro directorio con variables explícitas y rechazo de archivo ajeno/argumentos, y guardas de tipo/ruta sin creación. Primera ejecución, dos correctas y una fallida: el helper resolvía la ruta predeterminada sin contexto dentro de node:test, que correctamente lo rechazaba. Se corrigió la comparación contra defaultDatabasePath ya absoluto, conservando resolución/validación del destino real. Repetición focalizada con tres pruebas correctas, código 0. Salidas .cache/010-t01-demo-tests.txt y .cache/010-t01-demo-tests-final.txt. El primer formateo incluyó .env.example, que no tiene parser Prettier; se retiró de la invocación y se normalizó LF sin cambiar configuración.

### Capturas reales

Generadas mediante Playwright/Chromium con createEnvironment, API/Vite/SQLite temporal y datos ficticios insertados por HTTP. Se guardan cuatro PNG en docs/images: customers, customer-create, customer-detail y simulator, enlazados desde README con texto alternativo. Se inspeccionaron visualmente los cuatro archivos a 1440 × 1000 CSS; el simulador muestra 15 usuarios y 169,40 EUR, el historial una simulación guardada. Cero pageerror; no se consulta FX al seleccionar EUR. El listado filtra DEMO y las capturas no son una exportación de la base de desarrollo ni imágenes generadas. Metadatos/salida/script temporal en .cache/010-t01-capture.json, .txt y .mjs; recursos cerrados en finally.

### Controles y preservación

Desde raíz, pnpm.cmd lint, typecheck, format:check, build y test devuelven código 0. La suite general pasa 276 pruebas: 36 shared, 12 API unitarias, 52 integración (tres nuevas), 22 web node:test, 151 componentes, un gate negativo y dos documentales. Gates ejecutados sin otros controles de código concurrentes. Salidas .cache/010-t01-lint.txt, -typecheck.txt, -format-check.txt, -build.txt y -test.txt.

Comprobación adicional pnpm.cmd db:demo:setup desde raíz con DATABASE_KIND=demo y destino temporal nuevo bajo .cache, código 0. Se restauran variables del proceso y retira únicamente el archivo nuevo propio. Salida .cache/010-t01-root-command.txt. Esta comprobación usa las dependencias presentes, no sustituye el ensayo limpio de T03.

SHA-256 de archivos existentes en apps/api/data antes/después: cero diferencias; .cache/002-tests sin directorios residuales. Evidencia temporal .cache/010-t01-data-before.json y -cleanup.json. Sin DB de usuario modificada ni cambios de lockfile/dependencias o schema. Veredicto T01 CUMPLE TÉCNICAMENTE dentro de su alcance; cierre global 010 pendiente.

Tras actualizar los documentos, pnpm.cmd format:check y pnpm.cmd test:docs pasan nuevamente, código 0 y dos pruebas documentales; git diff --check sin errores. Salidas .cache/010-t01-format-final.txt y .cache/010-t01-docs-final.txt. La suite documental comprueba existencia de las cuatro imágenes enlazadas y el nuevo script raíz; la inspección visual se hizo sobre los PNG reales.

### Trabajo posterior

T01 no acredita instalación limpia, otro SO, despliegue o auditoría completa del paquete. Las 36 E2E de 009 no se vuelven a atribuir a T01; se ejecuta el flujo de captura y las suites pertinentes. T02 espera autorización de registro ai-workspace; T03–T05 y aceptación humana final pendientes. No se escriben registros ai-workspace ni se hacen commits/pushes.

## Criterios generales de evidencia

Registrar fecha, versión fuente y cambios incluidos, sistema operativo, herramientas, comandos exactos, códigos, incidencias, resultados y artefactos conservados. Diferenciar pruebas actuales e históricas; no convertir 273 pruebas/36 E2E de 009 en validación de un checkout limpio de 010.

Para README: comprobar título/contexto, necesidades, decisiones/motivos/consecuencias, proceso specs/tasks e IA, instrucciones y capturas reales accesibles. La declaración de Alex sobre Codex y ChatGPT Work/Product acredita la procedencia declarada, no sesiones o prompts que no se conserven.

Para instalación: registrar método de copia/exportación, aislamiento de dependencias/cachés/DB, red/almacén reutilizado, arranque desde raíz y flujo alta→simulación→historial. No afirmar portabilidad a otros SO por una prueba en Windows. Conservar datos existentes y limpiar solo recursos propios.

Para auditoría: enlaces a registros disponibles, fecha y carácter retrospectivo cuando corresponda, sin completar artificialmente resultados ausentes. T02 espera autorización para ai-workspace; la presente adaptación no la concede.

Para entrega: lista de archivos/destino/riesgos, revisión de secretos y datos con límites explícitos, condiciones SQLite/API/SPA. Preparación revisada y publicación efectiva tienen estados distintos.

## Validación de esta adaptación

17 de noviembre de 2026: adaptación de los cinco documentos de specs/010-delivery según instrucciones de Alex y cierre de 009. pnpm.cmd test:docs devuelve código 0, dos pruebas correctas. Salida temporal .cache/010-preparation-docs.txt. Prettier aplicado a los cinco documentos. No se ejecutan suites de código porque el cambio es exclusivamente documental. No se implementan README, capturas, fixtures, comandos demo, hosting ni tareas durante esta fase. No se escribe en ai-workspace.

## Cierre futuro

C04/C05 confirmadas posteriormente por Alex: demo completa en base nueva y entrega local/repositorio; despliegue opcional sin hosting elegido. Se actualizan spec, plan y tareas para incluir el comando demo en T01. Esta confirmación no ejecuta tareas ni levanta la exclusión ai-workspace.

Veredicto técnico pendiente. Cerrar únicamente con evidencia real de los RF, decisiones necesarias resueltas y límites declarados. Revisión/aceptación humana y acciones externas siempre separadas.
