# 008 Simulator UI — Colaboración con IA

## Objetivo y reparto del trabajo

Utilizar Codex para llevar al navegador el presupuesto de consumo, la conversión orientativa y el guardado de simulaciones, reutilizando dominio, API y navegación existentes.

La dirección del proyecto confirmó de forma incremental navegación contextual, controles sincronizados, valores iniciales, ubicación de divisas y comportamiento tras guardar. También acordó mantener EUR disponible ante fallo FX y bloquear configuraciones incompatibles. Autorizó la implementación por tareas y aportó una referencia visual al revisar la primera pantalla. Se delegaron en Codex la concreción técnica, componentes, integración y pruebas. El registro original de ai-workspace se incorporó posteriormente, respetando la exclusión durante la ejecución.

## Directrices de diseño e integración

- Adaptar la referencia a dos tarjetas de consumos y resumen, con reflujo móvil, tokens y CSS Modules de 007; mantener controles numéricos y slider coherentes.
- Reutilizar el motor compartido para la previsualización y comprobar compatibilidad con la configuración del servidor, sin duplicar tarifas en React.
- Separar borrador, presupuesto previo y resultado confirmado. Guardar únicamente consumos y mostrar el DTO autoritativo, avisando de discrepancias sin recalcular el pasado.
- Integrar FX solo en el total mediante el cliente de 006; conservar desglose, persistencia e historial en EUR y permitir guardar aunque falle el proveedor.
- Recuperar el historial existente sin filas optimistas ni reenvío automático ante un guardado incierto.

Las [instrucciones consolidadas](prompts.md) explican los objetivos delegados; las [iteraciones](iterations.md) recogen su evolución y ajustes comprobables.

## Resultado y fuentes

El recorrido quedó operativo desde la ficha hasta la simulación, confirmación e historial. La [validación](../../../specs/008-simulator-ui/validation.md) conserva pruebas, revisión visual y límites: FX controlado en las suites, Chromium local y ausencia de aceptación humana final. Esta reorganización no ejecuta nuevamente esos controles.

La [captura del simulador](../../../docs/images/simulator.png) ilustra el producto posterior; no sustituye las capturas temporales históricas ni demuestra el estado exacto del cierre de 008.

- [Especificación](../../../specs/008-simulator-ui/spec.md), [aclaraciones](../../../specs/008-simulator-ui/clarifications.md), [plan](../../../specs/008-simulator-ui/plan.md) y [tareas](../../../specs/008-simulator-ui/tasks.md).
- [Diseño](../../../docs/design.md), [producto](../../../docs/product.md), [contratos API](../../../docs/api-contracts.md) y [reglas de negocio](../../../docs/business-rules.md).
