# 004 Billing — Iteraciones del trabajo con IA

## Preparación y decisiones de alcance

La propuesta inicial contenía referencias a paquetes inexistentes, límites antiguos e integración ajena al motor. Se pidió adaptar primero la documentación y resolver las decisiones de forma incremental.

Codex concretó el dominio en shared, la política fiscal común y versionada, la precisión monetaria y los contratos. Se conservaron los límites de persistencia y se separó el motor de las entregas de API, guardado y divisas. Las propuestas se documentaron y aceptaron antes de ejecutar las tareas; las precisiones de firmas y errores no se atribuyen como instrucciones literales del usuario.

## Oráculos antes de funciones productivas

Codex preparó fixtures y conectó las pruebas de shared antes de implementar el cálculo. Se distinguió comprobar la coherencia de esos datos de comprobar código productivo.

Después se añadieron tramos, validación y desglose con pruebas de fronteras y comportamiento incremental. Esta secuencia permitió contrastar el resultado con esperados independientes, evitando usar el propio algoritmo como único oráculo.

## Precisión y composición del cálculo

La implementación incorporó helpers monetarios, política explícita y composición del presupuesto. Se centralizaron la conversión segura y las guardas de consumo para evitar duplicación, manteniendo el dominio sin acceso a datos o servicios externos.

Durante la revisión de la composición se añadió un caso independiente que diferencia el impuesto redondeado sobre la base completa del redondeo por tramo. Fue un refuerzo de cobertura documentado; no se presenta como un fallo de cálculo detectado. La [evidencia de esa tarea](../../testing/004-billing-t04.md) conserva el detalle. Las comprobaciones de determinismo, aislamiento de resultados y compatibilidad con el histórico no necesitaron escribir una DB.

## Incidencia de formato y cierre real

Los controles funcionales pasaron, pero el formato global seguía fallando por diferencias CRLF/LF en archivos ajenos al motor. La incidencia se mantuvo visible y no se corrigió masivamente durante tareas de alcance acotado.

Tras autorización posterior, Codex comprobó la equivalencia del contenido y normalizó únicamente los saltos de línea, dejando reglas versionadas para conservar LF. La [corrección registrada](../../testing/004-billing-format-fix.md) resolvió el control pendiente sin cambios de lógica; el fallo previo se conserva como histórico.

El motor quedó cerrado técnicamente con los límites indicados en la [validación](../../../specs/004-billing/validation.md). La política fiscal sigue siendo demo y no consta aceptación humana final. Esta memoria no repite pruebas ni atribuye a 004 integraciones realizadas después.
