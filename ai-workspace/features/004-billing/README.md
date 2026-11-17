# 004 Billing — Colaboración con IA

## Objetivo y reparto del trabajo

Utilizar Codex para desarrollar un motor de facturación exacto y reutilizable, manteniendo las reglas económicas separadas de HTTP, persistencia e interfaz.

La dirección del proyecto pidió adaptar la propuesta a lo existente, resolver las decisiones de forma incremental y ejecutar la implementación por tareas. Las propuestas de ubicación del dominio, política demo y precisión monetaria se aclararon y aceptaron antes del código. Se delegaron en Codex su concreción técnica, implementación, preparación de oráculos y pruebas, y registro de resultados.

## Criterios que guiaron el trabajo

- Reutilizar shared para el dominio puro, con política fiscal explícita y versionada suministrada desde la API, sin paquetes o dependencias nuevos.
- Trabajar en céntimos con intermediarios BigInt, redondeo definido y rechazo de resultados fuera del rango seguro.
- Validar los consumos con las guardas existentes y devolver un desglose explicable, sin inventar cargos por planes o consumos secundarios.
- Reservar la integración HTTP y el guardado para entregas posteriores; la conversión de divisas también queda fuera de 004.

[Prompts consolidados](prompts.md) recoge las instrucciones por objetivo. [Iteraciones relevantes](iterations.md) explica cómo se prepararon los oráculos, se compuso el cálculo y se resolvió la incidencia de formato.

## Resultado y fuentes canónicas

El motor tiene cierre técnico registrado en la [validación de 004](../../../specs/004-billing/validation.md), incluida la corrección posterior de formato. No consta aceptación humana final. Esta memoria no ejecuta cálculos ni añade resultados de pruebas.

Documentación de referencia: [spec](../../../specs/004-billing/spec.md), [aclaraciones](../../../specs/004-billing/clarifications.md), [plan](../../../specs/004-billing/plan.md), [tareas](../../../specs/004-billing/tasks.md), [reglas de negocio](../../../docs/business-rules.md) y [arquitectura](../../../docs/architecture.md). Las tarifas, fórmulas y límites fiscales completos permanecen en esas fuentes; la política demo no representa fiscalidad completa de operaciones reales.
