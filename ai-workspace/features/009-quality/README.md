# 009 Quality — Colaboración con IA

## Objetivo y reparto del trabajo

Utilizar Codex para contrastar el sistema integrado con los requisitos aprobados, revisar cobertura y resiliencia, detectar defectos reproducibles y verificar sus correcciones con evidencia.

La dirección del proyecto aportó el enunciado completo y confirmó revisión básica de seguridad, Chromium con cuatro anchos y comprobación puntual del proveedor FX real. Separó calidad técnica de las actividades de entrega de 010 y autorizó la ejecución por tareas. Se delegaron en Codex inventario, trazabilidad, revisión de código, ampliación de pruebas, diagnóstico y corrección del defecto encontrado. La aceptación humana final no se deduce de esas autorizaciones.

## Estrategia aplicada

- Inventariar pruebas existentes y vincular requisitos, implementación y casos antes de añadir cobertura, sin atribuir a 009 los resultados anteriores de 008.
- Combinar dominio, integración HTTP/SQLite, componentes e interacción en navegador con datos y recursos temporales propios.
- Separar FX controlado en suites de la comprobación puntual con proveedor real, y revisión básica de seguridad de una auditoría exhaustiva.
- Mantener visible un defecto aunque el runner termine correctamente con fallos esperados; exigir corrección y regresión antes de declarar conforme el requisito afectado.

Las [instrucciones consolidadas](prompts.md) explican cómo se dirigió la revisión; las [iteraciones](iterations.md) muestran el recorrido desde detección hasta cierre de 009-QA-01.

## Resultado y fuentes

La [validación canónica](../../../specs/009-quality/validation.md) registra cierre técnico con controles globales y E2E correctos, defecto resuelto y comprobación FX real limitada a su entorno. Conserva comandos, resultados e incidencias; la existencia actual de una prueba no acredita por sí sola su ejecución.

Esta reorganización inspecciona fuentes y enlaces sin ejecutar pruebas ni repetir auditorías de seguridad o navegador. Los artefactos temporales históricos pueden sobrescribirse; el [índice de evidencias](../../testing/008-010-evidence-index.md) explica esa limitación. No consta aceptación humana final.

- [Especificación](../../../specs/009-quality/spec.md), [aclaraciones](../../../specs/009-quality/clarifications.md), [plan](../../../specs/009-quality/plan.md) y [tareas](../../../specs/009-quality/tasks.md).
- [Estrategia de testing](../../../docs/testing.md), [trazabilidad](../../../docs/traceability.md), [constitución](../../../docs/constitution.md) y [procedimiento SDD](../../../docs/sdd-harness.md).
