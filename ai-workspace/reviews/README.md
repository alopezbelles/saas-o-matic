# Revisiones técnicas

Esta carpeta conserva evaluaciones que aportan criterio sobre decisiones, riesgos o límites. No contiene nuevas ejecuciones por el hecho de resumir resultados y sus conclusiones no equivalen a aceptación humana.

## Lectura recomendada

| Revisión                                          | Aportación                                                                                          |
| ------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| [001 Foundation](001-foundation.md)               | Secuencia real de planificación y límites de la retrospectiva documental.                           |
| [003 Customers API](003-customers-api.md)         | Contrato, validación fiscal, migración compatible y cohesión.                                       |
| [004 Billing](004-billing-t05.md)                 | Evaluación del dominio y cierre condicionado por formato, con criterios intermedios consolidados.   |
| [005 Simulations API](005-simulations-api-t05.md) | Responsabilidades, transacción, histórico y configuración, con criterios intermedios consolidados.  |
| [006 Currency](006-currency.md)                   | Precisión e integración externa dentro de su alcance histórico; sin garantía de CORS de producción. |
| [007 Customers UI](007-customers-ui-t05.md)       | Evaluación final de flujos, accesibilidad y límites del navegador.                                  |
| [010 Delivery](010-delivery-t05.md)               | Evidencia por versión, pendientes externos y separación entre preparación y publicación.            |

## Evaluaciones específicas conservadas

- [Preparación del dominio 004](004-billing-planning.md): revisión que detectó referencias de plantilla y límites documentales antes del motor.
- Revisiones de clientes UI: [base](007-customers-ui-t01.md), [listado](007-customers-ui-t02.md), [alta](007-customers-ui-t03.md) y [ficha](007-customers-ui-t04.md). Conservan evaluación específica de contratos, interacción y cohesión que complementa el cierre.

Los resultados de ejecución se consultan en [testing](../testing/README.md) y en la validación de cada spec. No hace falta un archivo de review por tarea; se debe registrar cuando exista una evaluación o conclusión significativa.

Las revisiones intermedias de 004/005 se han consolidado editorialmente en las finales, sin atribuir una nueva evaluación de código. Las referencias a síntesis actuales no acreditan conservación de antiguos prompts o ADR eliminados. Los originales retirados pueden consultarse en el historial Git, no se presentan como archivos todavía disponibles.
