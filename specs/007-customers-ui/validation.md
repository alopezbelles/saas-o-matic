# Validación 007

Estado: T01–T04 completadas técnicamente. RF1–RF4 conformes en pruebas incrementales; RF5 parcial hasta revisión global T05. E2E mantenido, revisión exhaustiva y aceptación humana final pendientes. Preparación documental histórica conservada debajo.

## Matriz prevista

| RF      | Tareas      | Pruebas previstas                                          | Resultado funcional real |
| ------- | ----------- | ---------------------------------------------------------- | ------------------------ |
| 007-RF1 | T02/T05     | WEB-API-01, WEB-SEARCH-01, WEB-STATE-01, E2E-CUSTOMERS-007 | CONFORME LISTADO         |
| 007-RF2 | T03/T04/T05 | WEB-FORM-01, WEB-STATE-01, E2E-CUSTOMERS-007               | CONFORME ALTA Y FICHA    |
| 007-RF3 | T04/T05     | WEB-DETAIL-01, E2E-CUSTOMERS-007                           | CONFORME INCREMENTAL     |
| 007-RF4 | T02/T04/T05 | WEB-SEARCH-01, WEB-DETAIL-01, E2E-CUSTOMERS-007            | CONFORME INCREMENTAL     |
| 007-RF5 | T01–T05     | WEB-SHELL-01, WEB-STATE-01, VISUAL-007 y E2E               | PARCIAL: SHELL PROBADO   |

WEB-SHELL-01, WEB-API-01/02, WEB-DETAIL-01, listado y alta se ejecutan con Vitest/RTL. node:test de 006/smoke conservado. E2E mantenido y revisión global pendientes de T05. Estados siguientes de T01–T03 conservan su contexto histórico.

## T04 — Ficha e historial persistido

16 de noviembre de 2026, base 010a716. T04 autorizada por Alex. [Instrucción previa](../../ai-workspace/prompts/007-customers-ui.md#t04--instrucción-previa-de-implementación), [iteración](../../ai-workspace/iterations/007-customers-ui.md#t04--inicio), [pruebas y salida global](../../ai-workspace/testing/007-customers-ui-t04.md), [revisión](../../ai-workspace/reviews/007-customers-ui-t04.md) y [capturas](../../ai-workspace/visuals/007-customers-ui-t04.md).

Ficha de datos reales con tarjetas corporativa/contacto, ID inválido sin requests, 404 y reintento temporal. Historial independiente, URL historyOffset, páginas de 20, retorno contextual conservado y datos EUR guardados. Validación runtime de DTO/página/identidad/snapshots y coherencia aritmética; sin motor/configuración vigente/FX. Gestión cancelable y validación de páginas compartidas con listado, conservando su contrato de UI.

Lint/typecheck/build y pnpm.cmd test correctos, código 0: 36 shared + 12 API unitarias + 49 integración + 22 node web + 86 componentes/transporte + 1 gates + 2 docs = 208 pruebas. Gates secuencial sin controles de código concurrentes. Primera ampliación de componentes 85 correctas/1 fallo por referencia a nav desmontado del test; corregida y repetición 86/86. Typecheck inicial del harness falló por pathname posiblemente undefined; corregido con URL y repetición correcta.

Smoke Chromium con proxy/API/SQLite temporal: cliente PT fuera del selector, importes históricos ajenos a configuración actual, 21 registros en 20/1, orden/recarga, 503 de historial con ficha conservada/reintento, retorno contextual, query inválida/restablecimiento, ID inválido/404 y alta→ficha completa/historial vacío. Cuatro anchos 320/390/768/1440 sin desbordamiento; cero errores de página y capturas escritorio/móvil revisadas. Recursos cerrados/temporales limpiados. Sin cambios API/shared productivo/lockfile/dependencias ni datos existentes.

RF2–RF4 conformes incrementalmente; RF5 y E2E mantenido/revisión exhaustiva quedan en T05. Sin aceptación humana final, commits o pushes del agente.

Cierre documental: pnpm.cmd test:docs (2 pruebas), pnpm.cmd format:check y git diff --check correctos, código 0.

## T03 — Alta integrada y recuperación segura

16 de noviembre de 2026, base 83b9432. T03 autorizada por Alex. [Instrucción previa](../../ai-workspace/prompts/007-customers-ui.md#t03--instrucción-previa-de-implementación), [iteración](../../ai-workspace/iterations/007-customers-ui.md#t03--inicio), [pruebas y log](../../ai-workspace/testing/007-customers-ui-t03.md), [revisión](../../ai-workspace/reviews/007-customers-ui-t03.md) y [capturas](../../ai-workspace/visuals/007-customers-ui-t03.md).

Formulario de cinco campos con parseCreateCustomer, países derivados de GET /billing-config y PLAN_CODES/etiquetas demo compartidos. POST exige 201/DTO válido. Errores asociados/resumen enfocado; valores conservados ante 422/409/503, envío único, cancelación contextual y éxito al ID persistido. Red/timeout/201 ilegible informa resultado incierto, sin reenvío automático, y ofrece comprobar por identificador en otra pestaña. Fiscal y unicidad siguen en backend. Ficha provisional coherente con aviso de éxito; datos completos e historial quedan en T04.

Lint/typecheck/build y pnpm.cmd test correctos, código 0. Suite global: 36 shared + 12 API unitarias + 49 integración + 22 node web + 49 componentes/transporte + 1 gates + 2 docs = 171 correctas. Gates secuencial sin otros controles concurrentes. Primera ampliación de componentes 47/47; dos regresiones posteriores de navegación incluidas en las 49 finales. Sin fallos funcionales detectados en estas ejecuciones.

Smoke Chromium real con Vite/API/SQLite temporales pasa: configuración, fiscal inválido/422/foco y campos retenidos → corrección/201/persistencia/ID/anuncio/listado → duplicado/409, total uno. Anchos 320/390/768/1440 sin desbordamiento, cero errores de página. Escritorio/móvil/error inspeccionados; capturas conservadas. Recursos cerrados y DB temporal limpiada. No cambios API/shared productivo/lockfile ni dependencias nuevas. T04–T05, E2E mantenido, zoom/contraste/teclado exhaustivos y aceptación humana final pendientes.

Cierre documental de T03: pnpm.cmd test:docs (2 pruebas), pnpm.cmd format:check y git diff --check correctos, código 0.

## T02 — Adaptador API, listado y búsqueda

16 de noviembre de 2026. Base 0436e20, T02 autorizada por Alex. [Instrucción previa](../../ai-workspace/prompts/007-customers-ui.md#t02--instrucción-previa-de-implementación), [iteración](../../ai-workspace/iterations/007-customers-ui.md#t02--inicio), [pruebas/log](../../ai-workspace/testing/007-customers-ui-t02.md), [revisión](../../ai-workspace/reviews/007-customers-ui-t02.md) y [capturas](../../ai-workspace/visuals/007-customers-ui-t02.md).

Adaptador GET con timeout 10 s, cancelación y validación DTO/página/envelope; proxy /api; listado responsive con búsqueda 250 ms, páginas de 20, q/offset en URL, latest-wins y retorno contextual desde destinos existentes. Vacío, sin coincidencias y página fuera de rango diferenciados; reintento explícito conserva búsqueda. Dev/build compilan shared antes de consumirlo. Alta/ficha siguen en sus tareas posteriores.

Lint/typecheck/build y pnpm.cmd test correctos, código 0. Suite global: 36 shared + 12 unitarias API + 49 integración + 22 node web + 30 componentes + 1 gates + 2 docs = 152 correctas. Gates sin otros controles de código concurrentes. Primera prueba de componentes 29 correctas/1 fallo por selector ambiguo de status en harness; corregido test, repetición 30/30.

Smoke Chromium real con API/SQLite temporales de 21 clientes y proxy a puerto aislado: búsqueda, paginación, retorno, recarga, 503/reintento, vacío e invalid URL correctos. Cuatro anchos 320/390/768/1440 sin desbordamiento; capturas revisadas y dos conservadas. DB temporal cerrada/limpiada y .cache/002-tests vacío. Diff API/shared productivo/lockfile vacío, sin instalaciones ni datos reales. Cierre documental: pnpm.cmd test:docs (2), pnpm.cmd format:check y git diff --check correctos, código 0. Conformidad técnica T02, aceptación humana final pendiente.

## T01 — Base visual, rutas y herramientas

Ajuste posterior de foco solicitado por Alex: contorno visual eliminado solo de h1 programáticamente enfocado. 10 pruebas de componentes y smoke Chromium correctos; se comprueba outline none del título a cuatro tamaños y outline solid de enlace con teclado. [Evidencia](../../ai-workspace/visuals/007-customers-ui-t01.md#título-sin-contorno-al-cargar).

Ajuste posterior solicitado por Alex: «+ Nuevo cliente» situado junto al título en escritorio, con reflujo móvil. 10 pruebas de componentes y smoke Chromium a cuatro anchos correctos; [capturas actualizadas](../../ai-workspace/visuals/007-customers-ui-t01.md#ajuste-del-encabezado). Verificación acotada a markup/CSS y navegación, sin repetir suites de persistencia.

16 de noviembre de 2026, base 4906dbf y cambios de trabajo. Alex autorizó T01 y progreso en ai-workspace. [Instrucción previa](../../ai-workspace/prompts/007-customers-ui.md#t01--instrucción-previa-de-implementación), [iteración](../../ai-workspace/iterations/007-customers-ui.md), [pruebas](../../ai-workspace/testing/007-customers-ui-t01.md), [revisión](../../ai-workspace/reviews/007-customers-ui-t01.md) y [capturas](../../ai-workspace/visuals/007-customers-ui-t01.md).

Tokens/global/CSS Modules, shell superior, breadcrumbs y rutas base/404 con foco/salto al contenido implementados. Destinos de listado/alta/ficha indican disponibilidad futura. Dependencias compatibles y shared workspace instalados con engine-strict; frozen/offline correcto.

Lint, typecheck y build global correctos. Primera pnpm.cmd test global: 130 correctas (36 shared, 12 unitarias API, 49 integración, 22 node web, 8 componentes, 1 gates, 2 docs). Tras revisar barra final, repetición lint/typecheck/test:web: 22 node + 10 componentes correctas. Gates sin concurrencia con otros controles; no sumar ejecuciones como pruebas globales adicionales.

Smoke Chromium real: rutas directas, recarga, retorno, foco, salto al contenido y 320/390/768/1440 px correctos, sin desbordamiento o errores de página. Capturas de los cuatro revisadas, dos conservadas. Zoom/contraste exhaustivo y E2E de alta corresponden a T05.

Incidencias corregidas: EACCES de npm sandbox recuperado por elevación revisada, TS2375 de clase CSS/NavLink e import CJS en script diagnóstico. Revisión añadió normalización de barra final y dos regresiones. API/shared productivo sin cambios, DB real intacta y temporales limpiados. Conformidad técnica T01, sin aceptación humana final. Cierre documental: pnpm.cmd test:docs (2), pnpm.cmd format:check y git diff --check correctos, código 0.

## Preparación documental anterior a T01

Fuente visual: interfaces.pdf facilitado por Alex, cuatro páginas revisadas en esta conversación antes de consolidar (listado, alta, ficha/historial y simulador). Las adaptaciones y decisiones constan en [aclaraciones](clarifications.md). No certifica revisión de otro material oficial ni implementación visual.

Alcance de esta edición: únicamente spec.md, plan.md, tasks.md, clarifications.md y validation.md. Sin cambios de código/configuración/lockfile, documentos globales, datos existentes o ai-workspace.

Controles documentales reales de esta consolidación (15 de noviembre de 2026): pnpm.cmd test:docs devuelve código 0, dos pruebas correctas; pnpm.cmd exec prettier --check specs/007-customers-ui devuelve código 0. Se aplicó Prettier exclusivamente a esta carpeta. git status --short solo muestra specs/007-customers-ui como carpeta nueva, sin cambios ajenos a estos cinco documentos. No se ejecutaron lint/typecheck/build/pruebas funcionales por tratarse de documentación; no extrapolar resultados de 006 a 007.

## Verificación requerida al implementar

- Compatibilidad e instalación de dependencias autorizadas antes de código consumidor.
- Validación de request/response y errores, configuración/planes reales, ausencia de doble envío y recuperación de POST incierto.
- Búsqueda y paginación URL, carreras y contexto de retorno.
- Historial con importes guardados EUR, sin FX/recálculo ni acciones inexistentes.
- Componentes con Vitest/RTL y flujos de Playwright contra API/DB temporal; no mocks como sustituto de E2E.
- Capturas/revisión a 320/390/768/1440 px, zoom 200%, teclado/foco/labels/contraste. No marcar conforme si navegador o flujo no se ejecutan.
- pnpm lint, pnpm typecheck, pnpm format:check, pnpm build, pnpm test y E2E real cuando exista. No ejecutar test:gates en paralelo con otros controles de código.

## Límites y registro futuro

Datos de prueba deterministas y DB temporal exclusiva; nunca abrir base real del usuario. No ejecutar seed/migración implícita al arrancar la aplicación. La instalación del navegador de pruebas no autoriza tocar perfiles personales o configuración del sistema.

La prueba CORS de FX que Alex confirmó en su navegador corresponde a 006 y no valida la conexión /api de 007. Esta última requiere su propia comprobación de proxy/navegador. El dominio de producción no está desplegado ni verificado.

Por tarea registrar fecha, versión/contexto, comandos exactos/códigos, fallos y correcciones, resultado técnico, limitaciones y controles omitidos. No inventar salidas, capturas o aceptación humana. Alex autorizó ai-workspace al iniciar T01; los resúmenes de preparación anterior se identifican como retrospectivos.
