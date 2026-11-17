# 008 — Instrucciones técnicas de implementación

Índice retrospectivo creado el 17 de noviembre de 2026 durante 010-T02, después de implementar 008. No es una transcripción ni un prompt original nuevo. No se reproducen los mensajes de análisis/adaptación que Alex excluyó del registro.

Las instrucciones previas se conservan en el [plan canónico](../../specs/008-simulator-ui/plan.md): T01 en «Reutilización y responsabilidades», T02 en «Conversión», T03/T04 en «Guardado y recuperación» y T05 en la sección de verificación. Cada bloque identifica alcance, restricciones y criterios de prueba. Su existencia en el plan durante implementación es distinta de este índice posterior.

Contexto técnico: integrar la UI sobre clientes, simulaciones y dominio de 003–006; reutilizar validaciones, transporte y dinero exacto. La secuencia implementada fue inputs/configuración → preview/FX → guardado/resultado autoritativo → historial/recuperación → flujo y revisión visual. Mantener EUR persistido y evitar reenvíos automáticos ante guardado incierto.

[Decisiones confirmadas](../../specs/008-simulator-ui/clarifications.md), [iteración retrospectiva](../iterations/008-simulator-ui.md) y [resultados canónicos](../../specs/008-simulator-ui/validation.md). La síntesis de este archivo explica el trabajo; no acredita conversaciones adicionales ni aceptación humana.
