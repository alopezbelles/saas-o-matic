# Validación 007

Estado: PREPARACIÓN DOCUMENTAL. Sin implementación, instalaciones ni pruebas funcionales de 007 ejecutadas. Decisiones confirmadas no equivalen a aceptación humana de la entrega.

## Matriz prevista

| RF      | Tareas      | Pruebas previstas                                          | Resultado funcional real |
| ------- | ----------- | ---------------------------------------------------------- | ------------------------ |
| 007-RF1 | T02/T05     | WEB-API-01, WEB-SEARCH-01, WEB-STATE-01, E2E-CUSTOMERS-007 | NO EJECUTADO             |
| 007-RF2 | T03/T04/T05 | WEB-FORM-01, WEB-STATE-01, E2E-CUSTOMERS-007               | NO EJECUTADO             |
| 007-RF3 | T04/T05     | WEB-DETAIL-01, E2E-CUSTOMERS-007                           | NO EJECUTADO             |
| 007-RF4 | T02/T04/T05 | WEB-SEARCH-01, WEB-DETAIL-01, E2E-CUSTOMERS-007            | NO EJECUTADO             |
| 007-RF5 | T01–T05     | WEB-SHELL-01, WEB-STATE-01, VISUAL-007 y E2E               | NO EJECUTADO             |

Estos identificadores son casos previstos, no suites ya existentes. node:test de 006 y smoke web actuales deben conservarse. No hay todavía herramientas de componentes/Playwright instaladas ni un script E2E de 007.

## Revisión documental actual

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

Por tarea registrar fecha, versión/contexto, comandos exactos/códigos, fallos y correcciones, resultado técnico, limitaciones y controles omitidos. No inventar salidas, capturas o aceptación humana. No registrar esta preparación/decisiones en ai-workspace hasta indicación posterior.
