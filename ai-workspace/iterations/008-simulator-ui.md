# 008 — Retrospectiva de implementación

Redactada el 17 de noviembre de 2026 en 010-T02. Fuentes: plan/tareas/validación canónicos; no diario contemporáneo ni reconstrucción de mensajes excluidos.

Objetivo: llevar al navegador la simulación de 004–006, manteniendo el backend autoritativo y aprovechando ficha/historial de 007. Las [decisiones](../../specs/008-simulator-ui/clarifications.md) acotaron navegación, consumos iniciales, slider, divisas, resultado confirmado, reserva EUR y bloqueo de configuración incompatible.

| Bloque | Cambio y motivo                                                                                           | Evidencia canónica                                                                                        |
| ------ | --------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| T01    | Ruta contextual, cliente/configuración y consumos validados; preparar entrada sin guardar automáticamente | [Validación](../../specs/008-simulator-ui/validation.md#t01--pantalla-clienteconfiguración-e-inputs)      |
| T02    | Preview compartido y dos tarjetas, total convertido con vigencia/recuperación; conservar desglose EUR     | [Validación](../../specs/008-simulator-ui/validation.md#t02--preview-desglose-y-conversión)               |
| T03    | Guardar con DTO autoritativo, mostrar discrepancias y tratar red/timeout/201 ilegible como posible commit | [Validación completa](../../specs/008-simulator-ui/validation.md)                                         |
| T04    | Retorno contextual, historial actualizado y comprobación en otra pestaña sin reenviar POST                | [Validación completa](../../specs/008-simulator-ui/validation.md)                                         |
| T05    | Flujo comercial, teclado/foco, contraste y reflujo con API/SQLite temporal                                | [Cierre](../../specs/008-simulator-ui/validation.md#t05--flujo-comercial-revisión-visual-y-cierre-global) |

Cierre histórico: 273 pruebas generales y 31 E2E correctas. FX de navegador controlado con fixtures; no se acreditó CORS externo nuevo en 008. El defecto posterior de texto largo se detectó en 009 y se resolvió allí; no se atribuye a la revisión de 008 su descubrimiento.

[Instrucciones previas y procedencia](../prompts/008-simulator-ui.md). Aceptación humana final no registrada. Este archivo no repite pruebas ni acredita portabilidad o despliegue.
