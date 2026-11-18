# 007-T05 — E2E mantenido y cierre global

16 de noviembre de 2026, base 8a947eb y Git inicial limpio. [Instrucción previa](../features/007-customers-ui/prompts.md), [validación canónica](../../specs/007-customers-ui/validation.md#t05--e2e-real-revisión-visual-y-cierre-global).

## Ejecuciones finales

Node 22.19.0, pnpm 10.33.4 y Playwright 1.65.1/Chromium instalado en caché del proyecto. Path local de Node/pnpm habilitado. Comandos desde raíz:

| Comando            | Resultado                                                                                                                           |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------- |
| pnpm.cmd lint      | Código 0, sin errores/advertencias                                                                                                  |
| pnpm.cmd typecheck | Código 0, strict shared/web/API                                                                                                     |
| pnpm.cmd build     | Código 0, ambas apps                                                                                                                |
| pnpm.cmd test:e2e  | Código 0, 11 correctas, 0 omitidas, 0 inesperadas, 0 flaky, retries=0                                                               |
| pnpm.cmd test      | Código 0, 209 correctas: 36 shared + 12 API unitarias + 49 integración + 22 node web + 87 componentes/transporte + 1 gates + 2 docs |

[Reporte Playwright original](007-customers-ui-t05-e2e.json), [salida global original](007-customers-ui-t05.txt). E2E y test son ejecuciones separadas; no presentar 220 como una única suite. Gates secuencial y sin otros controles de código simultáneos. Test documental se repite tras cerrar registros.

## Cobertura real

Cuatro E2E funcionales en customers.spec.mjs: fiscal 422→corrección→201/persistencia/ficha/recarga/duplicado, listado/búsqueda/páginas/atrás/adelante/retorno/cancelación, histórico EUR/503 independiente/reintento/recarga, y vacíos/ID inválido/404/query inválida/restablecimiento. API y Vite reales con SQLite exclusiva por prueba; no mocks de datos como sustituto del flujo.

Siete casos VISUAL-007: tres pantallas a cuatro anchos, zoom de layout 200 % y reflujo equivalente, teclado/foco y contraste. Cada prueba comprueba ausencia de errores de página; reflujo mide scrollWidth. Capturas reales conservadas y revisadas en [evidencia visual](../../specs/007-customers-ui/validation.md).

Contraste obtenido de getComputedStyle y fórmula de luminancia: descripción 5,749:1; ayuda 6,279:1; texto de campo 14,102:1; borde de campo/select 3,628:1; acción principal/cancelar 6,020:1; error inline 6,574:1. Foco ≥3:1 verificado. Valores de medición completos adjuntos al reporte original. No es auditoría exhaustiva de todos los estados/elementos.

## Fallos y correcciones

Primera revisión visual: [9 correctas/2 fallos](007-customers-ui-t05-review-initial.json). El harness asumía foco inicial en body aunque la app enfoca h1; se corrige recorriendo cabecera con Shift+Tab. Borde de controles 1,355:1 era un problema real; token --color-control-border lo corrige sin oscurecer bordes decorativos.

Repetición: [10 correctas/1 fallo](007-customers-ui-t05-focus-initial.json). Al paginar, el control se retiraba y el foco terminaba en body; useQueryFocus restaura encabezado de listado/historial al finalizar, salvo si el usuario eligió otro control durante la espera. Prueba E2E dirigida pasa; regresión RTL de no robar foco añadida a las 87 finales.

Lint inicial del runner detectó globals DOM en callbacks .mjs; globalThis explícito conserva las reglas. Filtro con alternancia keyboard|contrast falló en cmd de Windows antes de pruebas; repetido con filtro simple. Primera ejecución funcional mostró 4 casos correctos pero el wrapper PowerShell devolvió 1 y avisos NO_COLOR/FORCE_COLOR; se retiró el flag heredado contradictorio solo del entorno hijo. El comando raíz final devuelve 0. No se modificó configuración personal.

## Aislamiento y límites

Cierre documental: pnpm.cmd test:docs (2 pruebas), pnpm.cmd format:check y git diff --check correctos, código 0. Reportes originales JSON excluidos expresamente de Prettier, sin editar sus datos o formato. Capturas y reportes enlazados existen; no se atribuyen verificaciones pendientes como realizadas.

Fixture crea contexto/DB de pruebas marcada, migra e inserta fixtures mediante repositorios existentes; API/Vite en puertos efímeros. Comprueba proxy real 3000/rewrite y sustituye solo target para aislamiento. finally cierra recursos y verifica raíz/prefijo del directorio antes de limpiar. .cache/002-tests vacío tras ejecuciones. git diff --exit-code -- apps/api packages/shared/src pnpm-lock.yaml devuelve 0; sin datos existentes ni instalaciones nuevas.

Solo Chromium local, sin lector de pantalla real, Safari/Firefox, menú nativo de zoom ni despliegue. Zoom probado con CSS layout 2× a 1280 px y reflujo equivalente de 640 px; no se atribuye una interacción nativa. No certificación global WCAG ni aceptación humana final. Sin commits/pushes.

Nota editorial: las capturas y el índice visual históricos enlazados anteriormente ya no están disponibles en el árbol actual. Los enlaces de contexto apuntan ahora a la validación escrita, que no sustituye esos artefactos originales. Las afirmaciones anteriores describen su disponibilidad durante la ejecución histórica.
