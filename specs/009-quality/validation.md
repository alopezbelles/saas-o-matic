# Validación 009

Estado de ejecución NO EJECUTADO. Los cinco documentos se han adaptado al código existente. No se han ejecutado tareas funcionales de 009.

## Referencia histórica

008 cerró técnicamente con 273 pruebas globales y 31 E2E, dentro de sus límites documentados. Esa ejecución pertenece a 008 y no acredita por sí sola la validación de 009. [Evidencia anterior](../008-simulator-ui/validation.md#t05--flujo-comercial-revisión-visual-y-cierre-global).

## Matriz de ejecución prevista

| RF      | Tareas          | Evidencia prevista                                     | Resultado de 009 |
| ------- | --------------- | ------------------------------------------------------ | ---------------- |
| 009-RF1 | T01/T02/T04/T05 | QA-ENV-009, QA-FLOW-009, QA-REGRESSION-009, QA-ALL-009 | NO EJECUTADO     |
| 009-RF2 | T03/T04/T05     | QA-A11Y-009, QA-REGRESSION-009, QA-ALL-009             | NO EJECUTADO     |
| 009-RF3 | T02/T04/T05     | QA-RESILIENCE-009, QA-REGRESSION-009, QA-ALL-009       | NO EJECUTADO     |
| 009-RF4 | T01/T05         | QA-MATRIX-009, QA-REVIEW-009                           | NO EJECUTADO     |
| 009-RF5 | T02/T04/T05     | QA-SECURITY-009, QA-REGRESSION-009                     | NO EJECUTADO     |
| 009-RF6 | T02/T04/T05     | QA-FX-LIVE-009                                         | NO EJECUTADO     |

## Registro por tarea

Al ejecutar una tarea, registrar fecha, versión identificable, entorno, comandos exactos y códigos de salida. Enlazar suites/casos concretos, archivos de salida y capturas reales pertinentes. Distinguir pruebas existentes reejecutadas de nuevas regresiones.

Para cada defecto, indicar reproducción, comportamiento esperado, impacto, cambio y verificación. Si no se encuentran defectos, registrar la revisión realizada. Los casos no ejecutados y los fallos deben conservar su estado real.

Las salidas temporales podrán usar .cache/009-*. El reporte/capturas del runner vigente están en .cache/007-e2e. Declarar la naturaleza efímera de estos artefactos. Mantener ai-workspace excluido hasta nueva autorización.

## Límites que deberá declarar el cierre

Navegadores y dispositivo/viewport realmente revisados. Diferencia entre zoom nativo y layout ampliado. Alcance de contraste/teclado y uso efectivo de lector de pantalla. FX controlado frente a proveedor real. Documentos oficiales disponibles y ausentes. Recursos temporales, cleanup y defectos pendientes.

La comprobación FX real registrará conversión/CORS observados y limitaciones externas. Un fallo del proveedor no se convertirá en éxito por tener fixtures correctos. La matriz incorporará los requisitos del enunciado completo aportado por Alex. Los ensayos de checkout limpio y el cierre del paquete de entrega se documentarán en 010.

## Revisión

Veredicto funcional actual PENDIENTE DE EJECUCIÓN. Revisión técnica final y aceptación humana aún sin realizar para 009. El resultado documental de esta preparación se registrará aparte y no cambiará esos estados.

## Revisión documental de preparación

17 de noviembre de 2026. Revisados los cinco documentos frente a scripts, suites, fixtures, estado de 008 y documentos canónicos. Retiradas referencias a requisitos sin correspondencia y rutas de pruebas inexistentes. Aclarada la diferencia entre cobertura heredada, auditoría de 009 y aceptación humana.

pnpm.cmd test:docs devuelve código 0 con 2 pruebas correctas. pnpm.cmd exec prettier --check specs/009-quality devuelve código 0. Las suites funcionales, E2E y controles de código no se han reejecutado en esta preparación documental. Solo se modifican estos cinco documentos y se mantiene la exclusión de ai-workspace.
