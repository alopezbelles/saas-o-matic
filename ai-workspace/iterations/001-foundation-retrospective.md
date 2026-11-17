# 001 — Evolución de la infraestructura

Retrospectiva del desarrollo, revisada para explicar las decisiones y sus comprobaciones. Síntesis de Codex basada en solicitudes conservadas, plan/validación y referencia cbdd562. No reconstruye intercambios o diffs individuales de conversación. [Mensajes originales y contexto técnico](../prompts/001-foundation.md) y [evidencia canónica](../../specs/001-foundation/validation.md).

## Necesidad y secuencia real

Se definió una base Full-Stack ejecutable y comprobable, con stack y exclusiones explícitos. Primero se verificaron herramientas y se inicializaron web/API/shared, calidad, scripts y health. La documentación formal de 001 llegó después y contenía discrepancias con esa base.

Antes de continuar se solicitó analizar la cobertura. El contraste permitió distinguir infraestructura reutilizable de pruebas/contexto pendientes. Tras autorizar el cierre se concilió la spec con el stack existente y se completaron sus controles. Por tanto, 001 no se presenta como una implementación enteramente precedida por su spec formal: el análisis posterior corrigió la dirección documental y evitó repetir trabajo válido.

## Dirección técnica e intervención de la IA

| Punto de control          | Decisión o restricción                                            | Efecto sobre la ejecución                                                          |
| ------------------------- | ----------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| Encargo inicial           | Fijar stack, estructura mínima y exclusión de negocio/SQLite      | La IA dispone de una frontera concreta; no decide catálogo, precios o persistencia |
| Análisis previo al cierre | Contrastar spec/tareas con código antes de modificar              | Se reutiliza la base y se identifican huecos de evidencia                          |
| Conciliación              | Mantener pnpm y Node 22 frente a la propuesta documental anterior | La documentación se ajusta al proyecto, sin migración innecesaria                  |
| Diseño de controles       | Separar createApp/listen y usar HTTP/puertos temporales           | La comprobación observa comportamiento sin depender de servidores personales       |
| Cierre                    | Exigir códigos/resultados y límites explícitos                    | La propuesta de la IA no basta como prueba de cumplimiento                         |

Las restricciones y autorizaciones proceden de la dirección del proyecto; las soluciones técnicas implementadas se describen como tales. No se atribuye una decisión manual o revisión personal que no esté registrada. [ADR-001](../decisions/ADR-001-monorepo.md) relaciona diseño y consecuencias.

## Problemas, diagnóstico y corrección

| Observación                                                        | Diagnóstico y respuesta                                                       | Comprobación registrada    |
| ------------------------------------------------------------------ | ----------------------------------------------------------------------------- | -------------------------- |
| PowerShell bloqueaba npm.ps1 y pnpm no estaba disponible           | Usar npm.cmd y bootstrap de pnpm local; documentar PATH de terminal           | Instalación y scripts raíz |
| La versión inicial de ESLint avisaba falta de soporte              | Revisar compatibilidad y actualizar a ESLint 10                               | Lint y tipos               |
| El gate no ejecutaba el fallo deliberado como runner independiente | El hijo heredaba NODE_TEST_CONTEXT; retirarlo únicamente del entorno del hijo | GATE-01 pasó después       |
| JSON escrito por PowerShell incluía BOM                            | Reescribir los manifests como UTF-8 sin BOM                                   | DOC-01                     |
| El formateador intentaba escribir skills protegidas                | Excluir .agents/.codex del formato general, sin modificar las skills          | Prettier                   |

El caso del gate muestra una iteración relevante: un fallo de la prueba no se aceptó como resultado válido; se aisló su causa y se volvió a comprobar la detección de errores. La tabla conserva hechos registrados, no una conversación reconstruida.

## Resultado y aprendizaje

La validación histórica cerró los cuatro RF con seis pruebas, controles de calidad y arranque sin .env. La base permitió continuar con responsabilidades acotadas; los contratos de negocio y el modelo de datos pertenecen a entregas posteriores, no se diseñaron aquí por anticipación.

El análisis de cobertura y las pruebas negativas resultaron esenciales para dirigir la IA: conservar código correcto, corregir instrucciones incompatibles y comprobar el propio mecanismo de validación. Los límites de evidencia y ejecución están concentrados en [resumen de pruebas](../testing/001-foundation.md); la [revisión](../reviews/001-foundation.md) distingue esa evidencia histórica de esta mejora documental.
