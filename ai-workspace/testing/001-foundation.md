# Evidencia 001 — Resumen retrospectivo

Redactado el 14 de noviembre de 2026. Fuente: [validación histórica](../../specs/001-foundation/validation.md) y conversación del desarrollo.
Referencia de entrega: cbdd562. El resumen no vuelve a ejecutar controles ni garantiza que todas las ediciones posteriores estuvieran en aquella ejecución.

La validación registra pnpm.cmd install --frozen-lockfile --offline, lint, typecheck, build, format:check y test con código 0.
Suite de 001: seis pruebas (API 2, web 1, gates 1, docs 2).
Arranque dev y API compilada: health 200 y web 200.
El rechazo de Node incompatible se simuló mediante configuración de pnpm; no se ejecutó Node 20 realmente.

No se conserva log íntegro independiente de 001; la evidencia disponible es el registro de validación y las salidas de herramientas en la conversación.
No se genera un log nuevo para hacerlo pasar por aquella ejecución.
No acredita navegador, datos de negocio, SQLite ni otro equipo limpio.

[Iteración](../iterations/001-foundation-retrospective.md), [revisión](../reviews/001-foundation.md).
