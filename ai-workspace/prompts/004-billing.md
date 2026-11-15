# 004 — Instrucciones técnicas de preparación

## Procedencia y momento

15 de noviembre de 2026. Reformulaciones técnicas retrospectivas de las solicitudes y aclaraciones de la conversación disponible, redactadas después de las decisiones y antes de implementar 004.
No son mensajes literales, una exportación de chat ni prompts originales enviados con esta redacción. La agrupación temática no reconstruye timestamps ni atribuye al usuario formulaciones del agente.
Alex excluyó inicialmente el registro; después autorizó documentar esta preparación en ai-workspace. Solo se resume el alcance pertinente a 004.

Fuentes canónicas: [spec](../../specs/004-billing/spec.md), [aclaraciones](../../specs/004-billing/clarifications.md), [plan](../../specs/004-billing/plan.md) y [tareas](../../specs/004-billing/tasks.md).

## P01 — Analizar ajuste al proyecto existente

**Contexto:** monorepo 001, persistencia 002 y clientes 003 disponibles; motor de facturación todavía ausente.
**Objetivo:** contrastar 004 con el repositorio y detectar rutas, límites y propuestas obsoletas antes de programar.
**Instrucción reformulada:** revisar los documentos de 004 frente a contratos de shared, esquema histórico, scripts y capas actuales. Enumerar decisiones pendientes y eliminar referencias a paquetes o requisitos sin fuente. Separar motor puro de integración API, persistencia y conversión.
**Restricciones:** no implementar, añadir dependencias ni modificar datos. Mantener el stack y las responsabilidades existentes.
**Verificación prevista:** cada archivo futuro se identifica como previsto; requisitos, tareas y tests describen responsabilidades reales.

## P02 — Resolver arquitectura y países de forma incremental

**Objetivo:** cerrar una decisión cada vez y trasladar cada acuerdo a la documentación.
**Preguntas técnicas sintetizadas:** ¿qué ubicación permite compartir cálculo sin acoplar dominio a HTTP/SQL? ¿Qué países se incluyen y cómo evitar módulos duplicados?
**Decisión real:** shared/src/billing como dominio puro; ES, FR, DE y GB en una política versionada común. Sin paquetes adicionales ni archivo por país.
**Justificación:** reutilizar el workspace y permitir futuros consumidores web/API con una sola lógica.
**Verificación prevista:** sin imports de API en shared, sin React/DB/red y sin límites duplicados.

## P03 — Precisar impuestos y política monetaria

**Contexto:** la base procede de tramos acumulativos oficiales; la cobertura fiscal completa no forma parte del reto.
**Preguntas técnicas sintetizadas:** ¿se acepta una política demo explícita con tasas por país? ¿En qué momento se redondea el impuesto y cómo se protege la precisión?
**Decisión real:** demo-standard-v1 con ES 21%, FR 20%, DE 19%, GB 20%; céntimos, BigInt intermedio y half-up una vez sobre base completa.
**Restricciones:** sin exenciones o territorialidad inventadas, tasa por defecto, flotantes monetarios ni FX.
**Verificación prevista:** cuatro países, país ausente, cero explícito, fracciones sintéticas de céntimo, overflow y JSON sin BigInt. Fuentes y limitaciones en aclaraciones.

## P04 — Delimitar 004 frente a las siguientes specs

**Preguntas técnicas sintetizadas:** ¿debe esta entrega incluir guardado de simulaciones y exposición HTTP, o reservarlos para 005? ¿La conversión corresponde a 006?
**Decisión real:** 004 solo dominio, contratos, configuración y tests; 005 integración autoritativa/guardado y 006 visualización monetaria.
**Restricciones:** sin endpoint nuevo, migración, UI ni lectura/escritura de DB en 004. No modificar anticipadamente specs futuras.
**Verificación prevista:** tareas separadas y ausencia de cambios en comportamiento HTTP o histórico.

## P05 — Cerrar entrada, límites y salida explicable

**Preguntas técnicas sintetizadas:** ¿se mantienen las guardas de 002? ¿El cálculo completo valida todos los consumos aunque solo users genere coste? ¿La salida conserva desglose y versiones para el futuro histórico?
**Decisiones reales:** límites existentes; entrada con users, storageGb, apiCalls, countryCode y política explícita; salida con base/impuesto/total EUR, tasa, desglose y versiones.
**Restricciones:** planes sin diferencias de precio; sin cargos por storage/API, clientId obligatorio ni consulta de cliente dentro del motor.
**Verificación prevista:** máximos y máximo+1, consumos secundarios inválidos, invariantes de desglose, determinismo y compatibilidad estructural con 002.

## P06 — Consolidar documentos y preparar ejecución por tareas

**Objetivo:** dejar una base ejecutable sin ambigüedades ni implementación anticipada.
**Instrucción reformulada:** actualizar contexto y referencias, fijar identificador de precios y errores de dominio, conectar en el plan los tests de shared al comando raíz y dividir implementación en bloques verificables con propuestas de commit.
**Precisiones técnicas del agente:** users-tiered-v1, BillingError y sus códigos, política con version/ratesByCountry y T01 de fixtures ejecutables. No se presentan como respuestas individuales del usuario.
**Restricciones:** no commits/pushes; ninguna tarea marcada completa; registrar resultados reales de documentación, no tests futuros.
**Criterio de salida:** documentos coherentes, enlaces existentes y formato comprobado. La siguiente ejecución requiere indicar T01.

## Uso posterior

Este archivo documenta la preparación. Antes de cada bloque significativo de código, añadir la instrucción técnica realmente utilizada con su momento y alcance, sin convertir esta retrospectiva en evidencia de una instrucción original.
[Iteración](../iterations/004-billing.md) y [revisión documental](../reviews/004-billing-planning.md).

## T01 — Instrucción previa de implementación

Preparada antes de modificar código para ejecutar T01, autorizada expresamente por Alex. Instrucción técnica del agente, no cita literal del usuario.

**Contexto:** 004 definida, sin motor monetario. Existen tests API y límites compartidos; falta runner de tests en shared.
**Objetivo:** crear datos esperados independientes y conectar su verificación al test:unit raíz conservando las pruebas de 003.
**Acciones:** añadir fixtures de tramos/desglose, impuestos demo, half-up sintético, límites y errores; verificar coherencia sin reproducir el algoritmo productivo. Añadir runner shared, actualizar gate documental para comprobar la línea de spec activa 004 y su destino real; documentar comandos y alcance.
**Restricciones:** no implementar funciones de cálculo ni tests omitidos, no dependencias ni DB/HTTP/FX, no commits. El PASS de fixtures no acredita RF implementados. No reformatear masivamente archivos ajenos para ocultar la incidencia global conocida.
**Verificación:** lint, typecheck, format:check, test:unit y test:docs; registrar resultados reales y separar fallos globales preexistentes del formato de archivos afectados. Actualizar tareas, memoria y registros al cerrar.

## T02 — Instrucción previa de implementación

Preparada antes del código por el agente para ejecutar T02, autorizada por Alex; no transcripción literal. Base: 84818bf, T01 implementada.
**Objetivo:** implementar calculateTieredBase(users) con tramos acumulativos, versión users-tiered-v1, tipos básicos y BillingError. Validar runtime usando CONSUMPTION_LIMITS; rechazo sin coerción con code BILLING_INPUT_INVALID y field users.
**Alcance:** tipos TierBreakdown/TieredBase, errores, cálculo puro y exports públicos. Intermediarios monetarios BigInt y salida segura en céntimos. Sin impuestos, política fiscal, presupuesto completo, dependencias ni persistencia.
**Pruebas:** consumir oráculos independientes de T01, comprobar fronteras/desglose, usuarios inválidos, todos los marginales 1..1000, invariantes, serialización y aislamiento entre llamadas. No replicar el algoritmo como único oráculo.
**Verificación:** lint, typecheck, test:unit, test:docs, format:check global y acotado; documentar incidencia CRLF/LF ajena sin reformateo masivo. Actualizar evidencias y marcar solo T02 si cumple. No ejecutar commits ni continuar T03.

## T03 — Instrucción previa de implementación

Preparada por el agente antes del código, tras autorización de Alex para T03; no cita literal. Base eb24f0a, T01/T02 disponibles.
**Objetivo:** implementar dinero exacto, calculateTax y validación/resolución de política explícita, con demo-standard-v1 en configuración API.
**Alcance:** money.ts, tax.ts, TaxPolicy y exports; centralizar la conversión segura ya presente en tiers.ts para evitar duplicación. Configuración congelada con ES 2100, FR 2000, DE 1900 y GB 2000 bps, sin entorno/red.
**Restricciones:** no calculateQuote ni integración HTTP/DB/FX, dependencias o commits. Datos inválidos no se coercionan; cero explícito no equivale a ausencia; versiones y tasas se validan antes del uso.
**Verificación prevista:** oráculos fiscales independientes y sintéticos de T01; half-up alrededor de medio céntimo, cero, valores seguros extremos, intermediarios mayores al rango Number, overflow, tasas/políticas inválidas y países ausentes o heredados. Probar configuración real desde build API y preservar tests anteriores. Lint, typecheck, unitarios, docs y formato global/acotado; registrar resultados reales.

## T04 — Instrucción previa de implementación

Instrucción del agente preparada antes del código, por autorización de Alex para T04; no cita literal. Base b3f3061.
**Objetivo:** componer calculateQuote(input, policy) con los helpers existentes, devolviendo contrato completo EUR, versiones y desglose.
**Alcance:** BillingInput/BillingQuote, quote.ts, exports y tests. Centralizar validación de consumos usada por tramos/quote para no duplicar reglas; sin modificar límites ni tarifas.
**Restricciones:** sin HTTP/DB/FX, nuevas dependencias, commits ni T05. Validar tres consumos antes de política y cálculo; no usar campos monetarios/versiones proporcionados por consumidor.
**Verificación:** oráculos de T01, máximos/máximo+1 para cada consumo, entradas inválidas y orden de errores, cero usuarios con país no soportado, invariantes y serialización en todo el rango/países, no mutación y versiones reales. Forzar overflow tanto de impuesto como de suma total mediante política sintética. Lint, typecheck, unitarios, docs y formato global/acotado; actualizar registros con evidencia real.

## T05 — Instrucción previa de verificación global

Preparada por el agente antes de ejecutar controles de cierre, por autorización de Alex para T05; no cita literal.
**Objetivo:** verificar RF1..4, arquitectura y regresiones mediante lint, typecheck, format:check, build y test, secuencialmente. Revisar independencia del dominio y compatibilidad del desglose con 002 sin tocar datos existentes.
**Restricciones:** sin nueva funcionalidad, dependencias, DB real, commits ni aceptación humana inventada. test:gates no se ejecuta en paralelo con controles de código. La incidencia de formato preexistente se diagnostica y registra; no aplicar una corrección masiva fuera de alcance.
**Cierre:** conservar resultados exactos, señalar controles fallidos y presentar a Alex casos ES 15/51 y política fiscal. Si falla un criterio obligatorio, distinguir implementación terminada de cierre técnico pendiente; actualizar memoria, validación y registros con ese estado real.
