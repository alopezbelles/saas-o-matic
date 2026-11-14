# 001 — Retrospectiva de infraestructura

Redactada el 14 de noviembre de 2026 después del desarrollo. Responsable de esta síntesis: Codex.
Período descrito: inicialización y cierre de 001 en esta conversación, sin atribuir horas individuales.
Fuentes: [instrucciones reformuladas](../prompts/001-foundation.md), código local, [plan](../../specs/001-foundation/plan.md) y [validación histórica](../../specs/001-foundation/validation.md).
Referencia Git comprobada: cbdd562, entrega foundation. No se reconstruye el diff original de cada intercambio.

## Problema y secuencia real

1. Alex pidió inicializar un monorepo en un directorio vacío, con stack y restricciones explícitas.
2. Se verificaron herramientas y se creó web/API/shared, scripts, calidad y health.
3. Más tarde se incorporaron documentos de planificación que no reflejaban todo el estado real: npm en lugar de pnpm y tareas declaradas sin implementar.
4. Alex pidió revisar antes de modificar. Se identificó infraestructura ya disponible y carencias de pruebas/contexto.
5. Tras autorización, se concilió la spec y se completaron pruebas y documentación.

La spec de 001 no precedió a toda la inicialización. La revisión posterior evitó rehacer infraestructura y completó sus criterios verificables.

## Decisiones y alcance

- Mantener pnpm, Node 22 y shared; no migrar a una propuesta documental antigua.
- Separar createApp de listen para pruebas HTTP en puertos efímeros.
- Usar node:test y fetch, sin dependencias de testing adicionales.
- Mantener negocio y SQLite fuera de 001.
- [ADR-001](../decisions/ADR-001-monorepo.md) explica estructura y límites.

## Iteraciones y correcciones

| Observación                                                                                | Corrección                                                     | Comprobación registrada          |
| ------------------------------------------------------------------------------------------ | -------------------------------------------------------------- | -------------------------------- |
| PowerShell bloqueaba npm.ps1 y no había pnpm                                               | npm.cmd y pnpm local al proyecto; PATH de terminal documentado | Instalación y scripts desde raíz |
| La rama ESLint inicialmente elegida avisaba falta de soporte                               | Se comprobó compatibilidad y se actualizó a ESLint 10          | Lint y tipos                     |
| Runner hijo heredaba NODE_TEST_CONTEXT y el fallo deliberado no se ejecutaba correctamente | Limpiar esa variable solo en el hijo                           | GATE-01                          |
| JSON escrito desde PowerShell contenía BOM                                                 | Reescritura UTF-8 sin BOM                                      | DOC-01                           |
| Formato intentaba escribir skills protegidas                                               | Excluir .agents y .codex del formato general                   | Prettier                         |

## Resultado y límites

La validación de 001 registra seis pruebas, controles de calidad y arranque sin .env.
No hay log íntegro independiente conservado de aquella ejecución; no se genera uno retrospectivamente.
El smoke web fue HTTP, sin navegador. El rechazo de Node incompatible se simuló mediante configuración de pnpm.
No consta revisión personal final de Alex. [Resumen de evidencia](../testing/001-foundation.md) y [revisión documental](../reviews/001-foundation.md).
