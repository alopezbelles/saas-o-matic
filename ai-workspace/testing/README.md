# Evidencias de ejecución

La referencia de cumplimiento de cada feature es su `specs/<feature>/validation.md`. Esta carpeta conserva resúmenes con contexto y artefactos originales que permiten profundizar, sin sumar resultados de versiones distintas ni convertir una revisión documental en nueva ejecución.

## Recorrido recomendado

| Área                | Evidencia y valor para la revisión                                                                                                                                    |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Infraestructura     | [001](001-foundation.md): alcance y límites de la evidencia histórica; no se conserva un log íntegro.                                                                 |
| Persistencia        | [Validación 002](../../specs/002-persistence/validation.md) y [salida original](002-tests.txt): integridad, migraciones, snapshots y recuperación.                    |
| Clientes API        | [Validación 003](../../specs/003-customers-api/validation.md) y [salida original](003-tests.txt): fiscal, contratos, datos y lifecycle.                               |
| Facturación         | [Cierre](004-billing-t05.md) y [corrección de formato](004-billing-format-fix.md): distingue lógica correcta del control global inicialmente fallido y su resolución. |
| Simulaciones API    | [Cierre](005-simulations-api-t05.md) y [fallo/corrección del fixture](005-simulations-api-t04.md): cálculo, transacción e histórico con salidas conservadas.          |
| Divisas             | [006](006-currency.md): pruebas deterministas, incidencias y límites del intento externo original; comprobación real posterior en la validación de 009.               |
| Clientes UI         | [Cierre 007](007-customers-ui-t05.md): flujos y correcciones de contraste/foco, con reportes originales iniciales y finales.                                          |
| Simulador y calidad | [Índice 008–010](008-010-evidence-index.md): fuentes canónicas y límites de artefactos efímeros.                                                                      |
| Instalación limpia  | [Ensayo 010](010-delivery-t03.md) y [resumen estructurado](010-delivery-t03-results.json): método, incidencias y recuperación en copia aislada.                       |
| Preparación externa | [Revisión de contenido](010-delivery-t04.md) y [escaneo acotado](010-delivery-t04-scan.json): hallazgos y límites, sin publicación acreditada.                        |

## Registros y artefactos

Los informes intermedios de 004, 005 y 007 se conservan cuando contextualizan alcance, fallos o salidas originales; se localizan desde las validaciones y los cierres anteriores. Los `.txt` y `.json` originales se mantienen sin alterar. Un resumen Markdown no sustituye una salida literal.

Las capturas históricas retiradas del árbol no se reconstruyen ni se consideran conservadas porque exista una descripción escrita. Los informes afectados identifican esa ausencia. Las referencias editoriales a features apuntan a síntesis actuales, no a los mensajes originales antes enlazados.

Crear registros solo cuando aporten evidencia relevante o expliquen una incidencia; una tarea pequeña puede quedar suficientemente documentada en su validación. Criterios de registro y revisión en el [README de ai-workspace](../README.md).
