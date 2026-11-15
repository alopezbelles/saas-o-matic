# 005 — Instrucciones técnicas y procedencia

15 de noviembre de 2026. Registro creado después de implementar T01, por autorización posterior de Alex. La preparación y ejecución inicial se realizaron con exclusión expresa de ai-workspace.
Las secciones P01–P03 son reformulaciones técnicas retrospectivas de solicitudes y decisiones reales; no citas literales ni prompts originales con esta redacción. No se reconstruyen horas o interacciones inexistentes.

## P01 — Análisis de integración sobre la base existente

**Contexto:** 002 dispone de SQLite e histórico, 003 de clientes y conexión lazy, 004 de motor puro y política fiscal versionada.
**Objetivo:** contrastar los cinco documentos de 005 con ese código antes de programar.
**Instrucción reformulada retrospectivamente:** identificar piezas reutilizables, rutas o requisitos de plantilla obsoletos y decisiones de contrato aún abiertas. Mantener separados contrato HTTP, cálculo y persistencia.
**Restricciones reales:** sin implementación, modificaciones ni registro en ai-workspace durante el análisis inicial.
**Resultado:** se detectaron packages/contracts y rutas de tests inexistentes, límites antiguos y D01/D04/D05 ya resueltas. Se propuso reutilizar shared, node:test, snapshots/transacciones y calculateQuote.

## P02 — Adaptar y cerrar contratos antes de implementar

**Objetivo:** preparar spec/plan/tasks con alcance ejecutable, preguntando solo decisiones pendientes.
**Preguntas técnicas sintetizadas:** ¿se publica configuración vigente completa sin DB? ¿qué consumos, importes y snapshots devuelve el DTO y cómo se pagina? ¿qué errores y semántica de reintento se mantienen?
**Decisiones confirmadas:** GET /billing-config completo; DTO con snapshots e historial limit/offset; errores compatibles con 003, sin reintento automático ni deduplicación de guardados deliberados.
**Restricciones:** solo los cinco archivos de spec, sin implementación ni ai-workspace.
**Verificación realizada entonces:** formato de esos documentos y dos pruebas documentales. No acreditaba endpoints.
[Decisiones canónicas](../../specs/005-simulations-api/clarifications.md). La propuesta de callback/transacción y nombres concretos de tipos son precisiones técnicas del plan, no respuestas literales de Alex.

## P03 — Autorizar y delimitar T01

**Contexto:** documentación preparada sobre base 675ac5e, contratos sin implementar.
**Solicitud reformulada retrospectivamente:** ejecutar exclusivamente T01: tipos/parsers compartidos, pruebas y actualización de contexto; posponer servicio, repositorios y rutas.
**Objetivo:** aceptar solo customerId y tres consumos; definir DTO públicos sin ORM; rechazar overrides y query inválida usando reglas existentes.
**Restricciones:** sin DB, dependencias, commits ni T02. El registro en ai-workspace seguía excluido.
**Criterio de aceptación:** parsers probados, regresiones conservadas y controles pertinentes correctos; no presentar contratos como rutas disponibles.

## Instrucción de T01 que sí existía antes del código

La instrucción técnica real se preparó y utilizó en [plan 005, instrucción previa para T01](../../specs/005-simulations-api/plan.md#instrucción-previa-para-t01), antes de modificar código.
Ese texto conserva su procedencia: ordena reutilizar UUID/consumos, extraer InputError/paginación sin ciclos, probar el contrato y actualizar contexto/gate, sin endpoints ni ai-workspace en esa fase.
Este archivo se redacta después; enlazar la instrucción previa no convierte las reformulaciones P01–P03 en mensajes originales.

## Registro posterior y continuidad

Alex autoriza ahora registrar preparación y T01 antes del commit. Se añaden registros técnicos con fuentes, resultados reales y límites; no se atribuye autorización retroactiva a la fase inicial ni aceptación humana de entrega.
Para T02 y siguientes, mantener el registro durante el trabajo autorizado. No ejecutar T02 por crear este archivo.
[Iteración](../iterations/005-simulations-api.md), [verificación T01](../testing/005-simulations-api-t01.md) y [revisión](../reviews/005-simulations-api-t01.md).
