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

## T02 — Instrucción previa de implementación

Preparada por el agente antes del código tras autorización de Alex para T02. Base 64a1aba. No transcripción literal ni retrospectiva de código ya escrito.
**Objetivo:** crear servicio/repository de alta que calculen con país del cliente y política explícita, reutilicen insertSimulation y devuelvan SimulationDto tras una transacción inmediata coherente.
**Alcance:** servicio, repositorio/mapping, inyección interna de política y tests SQLite temporales conectados a integración. Sin rutas, dependencias, migraciones ni datos reales.
**Pruebas:** ES 15/51, cuatro países, consumos secundarios, cero, máximos, cliente ausente/país no soportado, invariantes, snapshots, reapertura, duplicados deliberados, fallo antes/después de insertar y rollback de savepoint bajo transacción exterior. Verificar bloqueo de una segunda conexión al intentar cambiar cliente durante el cálculo.
**Restricciones:** SQL/control transaccional solo en repositorio; callback de cálculo síncrono y puro en servicio. Sin endpoints auxiliares ni políticas seleccionables por HTTP. No commits ni T03.
**Verificación:** lint, typecheck, format:check, unitarios, integración y docs; registrar evidencia real y distinguir este alcance de RF HTTP pendientes.

## T03 — Instrucción previa de implementación

Preparada por el agente antes del código, por autorización de Alex para T03. Base d9b887a. Publicar solo POST /simulations, usando parseCreateSimulation antes del proveedor DB y servicio T02 sin duplicar cálculo.
Reutilizar protocolo JSON 32kb/strict:false de 003 mediante middleware compartido; mantener requestId, logs sin PII y respuestas sanitizadas. País no soportado → 422/customerId; cliente ausente → 404; DB busy/ausente → 503; política inválida/overflow/fallo interno → 500. Inyección interna opcional de política para tests, nunca seleccionable por HTTP.
Probar 201 confirmado en DB, rechazo de JSON/UUID/extras/consumos antes de conexión, 413/415, país sin tarifa con cero, DB lazy/reintento/busy y rollback real ante fallo INSERT; no Location de recurso inexistente. Revisar logs/cuerpos sin PII/SQL/stack. Ejecutar lint/tipos/unitarios/integración/formato/docs. Sin historial/configuración HTTP, DB real, dependencias, migraciones ni commits.

## T04 — Instrucción previa de implementación

Preparada por el agente antes del código, por autorización de Alex para T04. Base 7d968a2. Implementar GET /customers/:id/simulations con parse previo, SQL paginado/total y existencia bajo transacción de lectura; devolver snapshots guardados sin motor ni política actual.
Publicar GET /billing-config sin DB y no-store. Exportar lectura de precios/versiones desde reglas reales de shared mediante copias, sin duplicar tarifas; copiar tasas/límites del servidor. Conservar inyección interna de política y semántica de POST.
Probar vacío/404, límites/query inválida antes de DB, páginas y empate por id, aislamiento entre clientes y conservación ante cambio de cliente/política. Probar config con DB ausente, igualdad con motor en fronteras, copias no mutables por referencia y error de política sanitizado. Actualizar expectativas 404 de T03 ahora obsoletas. Sin migraciones, dependencias, UI, FX, datos reales ni commits; T05 queda pendiente. Ejecutar lint, tipos, unitarios, integración, formato/docs y guardar evidencias reales.

## T05 — Instrucción previa de verificación global

Preparada por el agente antes de ejecutar el cierre, tras autorización de Alex para T05. Revisar RF1..4, contratos públicos, transacciones/snapshots, histórico sin recálculo y configuración sin DB. Ejecutar lint, typecheck, format:check, build y test secuencialmente; no ejecutar gates en paralelo con otros controles de código.
Contrastar cambios desde la base documental 675ac5e: sin migraciones/schema, dependencias, FX/UI ni datos reales. Conservar salidas y comandos exactos, distinguir pruebas reales de revisión por inspección, y presentar a Alex ejemplos de alta/configuración e histórico sin atribuir aceptación humana.
Actualizar tareas, memoria, validación, trazabilidad y registros pertinentes solo con resultados observados. No commits/pushes, nueva funcionalidad ni inicio de spec 006.

## Registro posterior de T01 y continuidad

Alex autorizó registrar preparación y T01 antes del commit. Se añadieron registros técnicos con fuentes, resultados reales y límites; no se atribuye autorización retroactiva a la fase inicial ni aceptación humana de entrega.
Para T02 y siguientes, mantener el registro durante el trabajo autorizado. No ejecutar T02 por crear este archivo.
[Iteración](../iterations/005-simulations-api.md), [verificación T01](../testing/005-simulations-api-t01.md) y [revisión](../reviews/005-simulations-api-t01.md).
