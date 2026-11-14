# ADR-001 — Monorepo modular

Estado: decisión adoptada e implementada para 001. Registro actualizado retrospectivamente el 14 de noviembre de 2026.
Fuente: stack solicitado por Alex; [instrucciones reformuladas](../prompts/001-foundation.md).
Código de referencia: cbdd562. La aceptación humana final de la entrega es un estado separado.

## Contexto y decisión

Dos aplicaciones comparten contratos y guardas técnicas. Se mantiene pnpm workspaces, React/Vite, Express y TypeScript estricto con ESM.
Organización: apps/web, apps/api y packages/shared. No crear contracts/billing ni capas sin responsabilidad actual.
Las instrucciones de stack del usuario prevalecen sobre la propuesta importada npm/Node 24.

## Alternativas documentadas

Repos separados complicarían los cambios coordinados; un orquestador adicional no tiene una necesidad demostrada.
npm workspaces era una propuesta anterior, descartada al conciliarla con pnpm solicitado.
Son alternativas razonadas en documentación; no se afirma haber construido o medido esas alternativas.

## Consecuencias y verificación

Shared no debe importar ORM ni código exclusivo del servidor. Calidad y ejecución desde raíz.
La separación createApp/listen permite pruebas HTTP sin acoplar arranque.
No hay dependencia UI/router añadida por anticipación. El cálculo compartido será otra decisión cuando exista dominio.
[Arquitectura canónica](../../docs/architecture.md), [decisiones operativas](../../docs/decisions.md), [evidencia 001](../testing/001-foundation.md).
