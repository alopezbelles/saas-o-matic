# Validación 004

Estado: documentación preparada; motor NO IMPLEMENTADO. Todas las tareas de código pendientes.

## Matriz de implementación futura

| RF  | Pruebas previstas                                  | Resultado de código |
| --- | -------------------------------------------------- | ------------------- |
| RF1 | UT-BILL-01, UT-QUOTE-004, UT-PROP-01               | NO EJECUTADO        |
| RF2 | UT-TAX-01, UT-MONEY-01, UT-QUOTE-004               | NO EJECUTADO        |
| RF3 | UT-INPUT-004, UT-TAX-01, UT-MONEY-01, UT-QUOTE-004 | NO EJECUTADO        |
| RF4 | UT-PROP-01, UT-QUOTE-004                           | NO EJECUTADO        |

Detalle de oráculos, límites, tasas sintéticas, cero usuarios y errores en [plan](plan.md). UT-FIX-004 comprueba fixtures, no requisitos productivos.
No endpoints, SQLite, UI ni FX exigidos en 004. Conservar compatibilidad estructural con 002 sin escribir bases existentes.
No afirmar que el backend calcula ni que existe configuración HTTP al cerrar esta preparación.

## Revisión documental

15 de noviembre de 2026. Alcance: spec, decisiones, plan, tareas, contratos, documentación contextual y registros de planificación.
La revisión distingue decisiones funcionales acordadas, precisiones técnicas de consolidación e implementación futura.
Comandos y resultados documentales se enlazan desde [revisión de preparación](../../ai-workspace/reviews/004-billing-planning.md); no sustituyen tests del motor.
Los dos tests documentales pasan. El formato global todavía falla en 46 archivos ajenos a esta revisión; no se ha aplicado una corrección masiva. Resolver o delimitar esta incidencia antes de afirmar que los gates de implementación pasan.

## Registro durante implementación

Por tarea: fecha, versión identificable, comandos exactos, códigos de salida, pruebas, incidencias y limitaciones. Enlazar ai-workspace sin duplicar salidas.
En T05 ejecutar controles completos y presentar casos ES 15/51 usuarios con bases 14000/42500, impuestos 2940/8925 y totales 16940/51425.
No rellenar evidencias anticipadamente. Aceptación humana de la entrega: no registrada.
