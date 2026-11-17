# 005 Simulations API — Colaboración con IA

## Objetivo y reparto del trabajo

Utilizar Codex para conectar la API de simulaciones con la persistencia de 002, los clientes de 003 y el motor de facturación de 004, conservando resultados históricos verificables.

La dirección del proyecto solicitó adaptar la propuesta al código existente antes de implementar. Confirmó la configuración pública completa, el contenido del resultado e histórico y la continuidad de las reglas de errores y reintentos. Después autorizó la ejecución por tareas. Se delegaron en Codex la concreción de contratos, integración entre capas, pruebas y correcciones documentadas; el diseño transaccional no se atribuye como una instrucción literal del usuario.

## Directrices que guiaron la implementación

- Reutilizar contratos, validadores, motor e inserción existentes, evitando nuevas dependencias y cambios de esquema.
- Mantener el servidor como autoridad: recibir consumos, obtener el cliente y calcular con la política interna, sin aceptar importes o tasas del consumidor.
- Alinear lectura del cliente, cálculo, snapshots y guardado mediante una transacción controlada por el repositorio; separar transporte, orquestación y dominio puro.
- Consultar el histórico desde los datos guardados y publicar la configuración vigente desde sus fuentes reales, sin recalcular el pasado ni acceder a la DB para obtener configuración.

Las [instrucciones consolidadas](prompts.md) explican los objetivos delegados; las [iteraciones](iterations.md) recogen su ejecución y una corrección real de pruebas.

## Resultado y fuentes

La entrega quedó completada técnicamente con alta, histórico paginado y configuración pública. La [validación canónica](../../../specs/005-simulations-api/validation.md) conserva los controles ejecutados y sus límites; no consta aceptación humana final. La interfaz y la conversión de divisas pertenecen a entregas posteriores. Esta reorganización documental no vuelve a ejecutar las pruebas funcionales históricas.

- [Especificación](../../../specs/005-simulations-api/spec.md), [aclaraciones](../../../specs/005-simulations-api/clarifications.md), [plan](../../../specs/005-simulations-api/plan.md) y [tareas](../../../specs/005-simulations-api/tasks.md).
- [Contratos API](../../../docs/api-contracts.md), [reglas de negocio](../../../docs/business-rules.md) y [modelo de datos](../../../docs/data-model.md).
