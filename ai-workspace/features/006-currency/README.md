# 006 Currency — Colaboración con IA

## Objetivo y reparto del trabajo

Utilizar Codex para preparar la conversión orientativa del total EUR a USD o GBP y un cliente de tasas reutilizable, manteniendo intactos el cálculo autoritativo y el histórico de simulaciones.

La dirección del proyecto decidió diferir toda interfaz y confirmó las propuestas de proveedor directo, caché temporal, monedas soportadas y precisión sin librerías nuevas. Autorizó después la implementación por tareas y el registro posterior en ai-workspace. Se delegaron en Codex la concreción de módulos, integración, pruebas y diagnóstico de incidencias.

## Directrices que guiaron la implementación

- Separar conversión pura en shared, validación del proveedor y transporte en web, sin dependencia de React en estos módulos.
- Reutilizar las utilidades monetarias y operar con enteros/BigInt, validando la tasa decimal y redondeando al final.
- Consultar ExchangeRate-API desde el navegador sin clave, proxy, importes ni datos privados; compartir petición y caché en memoria hasta su caducidad.
- Diferenciar errores externos, evitar tasas vencidas y permitir recuperación explícita, conservando EUR y los snapshots existentes.

Las [instrucciones consolidadas](prompts.md) explican los objetivos delegados; las [iteraciones](iterations.md) recogen resultados, correcciones y comprobación externa.

## Resultado y fuentes

La infraestructura quedó completada técnicamente. La [validación](../../../specs/006-currency/validation.md) conserva las pruebas históricas y el intento automatizado de CORS inconcluso por el entorno. Posteriormente, el desarrollador confirmó en conversación una consulta correcta desde su navegador local, recogida en [memoria](../../../MEMORY.md). Esa comprobación local no acredita un despliegue ni aceptación humana final.

Las pantallas y su integración visual corresponden a specs posteriores. Esta reorganización no ejecuta nuevamente la funcionalidad ni consulta al proveedor.

- [Especificación](../../../specs/006-currency/spec.md), [aclaraciones](../../../specs/006-currency/clarifications.md), [plan](../../../specs/006-currency/plan.md) y [tareas](../../../specs/006-currency/tasks.md).
- [Reglas de negocio](../../../docs/business-rules.md), [contratos](../../../docs/api-contracts.md) y [decisión de integración](../../decisions/ADR-006-currency-infrastructure.md).
