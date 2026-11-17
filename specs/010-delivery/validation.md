# Validación 010

Preparación documental adaptada; T01–T05 NO EJECUTADAS. El cierre técnico de 009 es evidencia previa, no prueba de instalación limpia de 010. Aceptación humana pendiente.

## Matriz prevista

| RF      | Tareas y controles                                         | Resultado real de implementación                    |
| ------- | ---------------------------------------------------------- | --------------------------------------------------- |
| 010-RF1 | T01/T03/T05, DOC-README-010, DELIVERY-01, QA-ALL-010       | NO EJECUTADO                                        |
| 010-RF2 | T01/T02/T05, DOC-README-010, DOC-AUDIT-010                 | NO EJECUTADO; ai-workspace excluido                 |
| 010-RF3 | T01–T05, procedencia/versión/límites y revisión documental | NO EJECUTADO                                        |
| 010-RF4 | T04/T05, DELIVERY-02                                       | NO EJECUTADO; sin publicación/despliegue autorizado |

## Criterios de evidencia

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
