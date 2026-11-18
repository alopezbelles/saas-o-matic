# 004 — Revisión documental de preparación

15 de noviembre de 2026. Revisión técnica del agente, autorizada para corregir documentación. No aceptación humana de la entrega ni revisión de código implementado.

## Alcance y hallazgos resueltos

- Sustituir referencias a requisitos sin fuente, paquetes inexistentes y límites antiguos por contexto real de 001/002/003.
- Consolidar política demo, precisión, versiones, consumos, salida, desglose y errores de dominio.
- Mantener integración HTTP/DB/UI y FX fuera de 004.
- Hacer ejecutable la secuencia T01–T05: fixtures primero, pruebas productivas con cada módulo, runner shared conectado desde raíz y gate de contexto actualizado al implementar T01.
- Distinguir decisiones acordadas de precisiones técnicas de consolidación y de aceptación de código todavía inexistente.
- Registrar prompts como reformulaciones retrospectivas, sin atribuir palabras literales ni pruebas no realizadas.

## Verificación

Resultados reales de esta revisión:

- node --test test/docs.test.mjs: código 0, 2 pruebas pasan; enlaces locales existentes y comprobaciones documentales actuales.
- .\node_modules\.bin\prettier.cmd --check .: código 1; avisos en 46 archivos ajenos a los modificados en esta revisión, incluidos código y documentación de 003. No se aplica formato masivo fuera de alcance. El listado del comando no muestra avisos en los documentos modificados para 004.
- git diff --check: código 0; Git informa además de normalización futura LF→CRLF en archivos documentales. No se modifica configuración Git.
- Comprobación de formato acotada a los archivos modificados: código 0, todos conformes. Comando exacto:

```powershell
.\node_modules\.bin\prettier.cmd --check MEMORY.md docs/approvals.md docs/decisions.md docs/business-rules.md docs/traceability.md docs/architecture.md specs/004-billing ai-workspace/README.md ai-workspace/prompts/004-billing.md ai-workspace/iterations/004-billing.md ai-workspace/decisions/README.md ai-workspace/decisions/ADR-005-billing-engine.md ai-workspace/reviews/004-billing-planning.md
```

Ninguna prueba del motor ejecutada; no hay implementación ni tareas completadas. Los controles documentales no acreditan conformidad técnica de la futura feature.

## Límites

El gate documental actual comprueba enlaces de docs/specs/ai-workspace y presencia de 003 en memoria, pero no acredita semánticamente que la spec activa sea correcta. Se revisó manualmente el contexto 004; T01 corregirá esa limitación del test.
No se ejecutan lint, typecheck, build ni suites funcionales por esta modificación exclusivamente documental. T01 y siguientes tendrán sus propios controles.

[Spec](../../specs/004-billing/spec.md), [validación](../../specs/004-billing/validation.md), [prompts reformulados](../features/004-billing/prompts.md) y [iteración](../features/004-billing/iterations.md).
