# Validación 007

Estado: T01 completada técnicamente, RF5 parcial. T02–T05 y aceptación humana final pendientes. Preparación documental histórica conservada debajo.

## Matriz prevista

| RF      | Tareas      | Pruebas previstas                                          | Resultado funcional real |
| ------- | ----------- | ---------------------------------------------------------- | ------------------------ |
| 007-RF1 | T02/T05     | WEB-API-01, WEB-SEARCH-01, WEB-STATE-01, E2E-CUSTOMERS-007 | NO EJECUTADO             |
| 007-RF2 | T03/T04/T05 | WEB-FORM-01, WEB-STATE-01, E2E-CUSTOMERS-007               | NO EJECUTADO             |
| 007-RF3 | T04/T05     | WEB-DETAIL-01, E2E-CUSTOMERS-007                           | NO EJECUTADO             |
| 007-RF4 | T02/T04/T05 | WEB-SEARCH-01, WEB-DETAIL-01, E2E-CUSTOMERS-007            | NO EJECUTADO             |
| 007-RF5 | T01–T05     | WEB-SHELL-01, WEB-STATE-01, VISUAL-007 y E2E               | PARCIAL: SHELL PROBADO   |

WEB-SHELL-01 se ejecuta con Vitest/RTL. node:test de 006/smoke se conserva; herramientas de componentes/Playwright instaladas en T01. Flujos de datos y E2E pendientes de T02–T05.

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
