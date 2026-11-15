# 006 — Instrucciones técnicas y procedencia

Registro redactado el 15 de noviembre de 2026, después de T01–T05 y por autorización posterior de Alex. Son reformulaciones técnicas retrospectivas de solicitudes y decisiones reales, no mensajes literales ni instrucciones originalmente enviadas con esta redacción. La preparación y ejecución excluyeron ai-workspace hasta esta autorización. No se reconstruyen horas ni conversaciones ausentes.

La [instrucción técnica del plan](../../specs/006-currency/plan.md#instrucción-técnica-previa) sí existía antes del código. Estas síntesis la enlazan; no sustituyen su procedencia. [Alcance autorizado](../../docs/approvals.md#006--preparación-e-implementación-incremental).

## P01 — Contrastar la spec con el proyecto

**Contexto:** 002 conserva snapshots EUR; 004 calcula importes exactos; 005 expone simulaciones y configuración. La web solo contiene pantalla inicial.
**Objetivo:** identificar reutilización, supuestos obsoletos y decisiones antes de implementar.
**Instrucción reformulada:** revisar spec/plan/tasks/clarifications/validation; eliminar supuestos de packages/billing y packages/contracts; distinguir infraestructura monetaria de integración visual.
**Restricciones reales:** análisis inicial sin cambios ni ai-workspace. Después, autorización para adaptar los cinco documentos, sin producción.
**Resultado:** Alex decidió diferir toda interfaz; no desarrollar hooks, selector ni E2E visuales en 006.

## P02 — Resolver arquitectura y precisión

**Objetivo:** cerrar contrato y límites sin instalar librerías por una propuesta antigua.
**Preguntas técnicas sintetizadas:** confirmar proveedor directo, caché y timeout; delimitar monedas e importes convertidos; elegir representación exacta compatible con el motor existente.
**Decisiones confirmadas:** ExchangeRate-API directo sin proxy/clave; memoria por pestaña hasta caducidad, timeout 5 s; EUR/USD/GBP solo total; BigInt y half-up sin Zod/decimal.js. Sin guardar FX; consultar alternativa si CORS impide acceso.
**Verificación prevista:** pruebas deterministas, validación externa estricta y smoke CORS separado.
**Fuente canónica:** [aclaraciones](../../specs/006-currency/clarifications.md). No reabrir D05 ni redondeo fiscal de 004.

## T01 — Contratos, catálogo y fixtures

**Contexto/objetivo:** preparar fronteras sin implementar conversión o transporte.
**Instrucción reformulada retrospectivamente:** definir catálogo cerrado con exponente explícito, entrada EUR identidad/moneda extranjera con tasa, salida en unidades menores, errores y contrato normalizado web; preparar fixtures independientes.
**Restricciones:** no red, UI, dependencias ni datos existentes.
**Criterios:** exports/TypeScript correctos; catálogo inmutable y fixtures coherentes. No atribuir RF completos a tipos.
**Resultado real:** cinco pruebas nuevas; [validación T01](../../specs/006-currency/validation.md#t01--contratos-catálogo-y-fixtures).

## T02 — Conversión exacta

**Objetivo:** convertir total EUR a unidades menores USD/GBP conservando exactitud.
**Instrucción reformulada retrospectivamente:** validar importes y tasa decimal acotada, transformar tasa en razón BigInt, reutilizar roundHalfUp y guardas monetarias; redondear solo al final y rechazar overflow.
**Restricciones:** dominio puro, sin modificar impuestos, persistencia ni histórico.
**Criterios:** oráculos 16940 ×1.1 →18634 y ×0.8 →13552; cero/identidad, mitad exacta y adyacentes, notación científica, tipos y rango.
**Resultado:** ocho pruebas productivas; [validación T02](../../specs/006-currency/validation.md#t02--conversión-pura).

## T03 — Frontera del proveedor

**Objetivo:** impedir que una respuesta externa inválida se convierta en tasas utilizables.
**Instrucción reformulada retrospectivamente:** recibir unknown y reloj explícito; validar éxito/base EUR/identidad/tasas/fechas; devolver decimales, ISO UTC y atribución fija inmutables; separar caducidad de payload inválido.
**Restricciones:** sin HTTP real ni librerías nuevas; node:test sobre módulo compilado.
**Criterios:** payloads malformados, result:error, campos ausentes, tasas inválidas y fronteras temporales fallan explícitamente.
**Resultado:** ocho pruebas nuevas; incidente y corrección del helper de reloj conservados en [validación T03](../../specs/006-currency/validation.md#t03--validación-del-proveedor).

## T04 — Transporte y caché

**Objetivo:** una consulta pública reutilizable, sin dependencia de la interfaz.
**Instrucción reformulada retrospectivamente:** inyectar fetch/reloj, compartir petición y caché inmutable, respetar expiresAt y timeout total de 5000 ms, liberar petición tras fallo y permitir recuperación explícita.
**Restricciones:** EUR sin red, sin datos privados, polling, retries automáticos ni respuesta tardía que sustituya caché.
**Criterios:** concurrencia USD/GBP, caducidad exacta/durante lectura, 429/red/JSON, timeout de fetch/cuerpo y recuperación.
**Resultado:** nueve pruebas nuevas; [validación T04](../../specs/006-currency/validation.md#t04--cliente-http-y-caché).

## T05 — Composición y cierre verificable

**Objetivo:** demostrar integración técnica y regresión sin presentar fixtures como conexión externa real.
**Instrucción reformulada retrospectivamente:** componer cliente/conversión con fixtures; preservar EUR, API y snapshots; ejecutar lint/typecheck/format/build/test, sin gates concurrentes; intentar CORS desde origen de desarrollo y declarar límites.
**Restricciones:** no UI, proxy, cambios de DB, dependencias, commits ni aceptación humana anticipada.
**Resultado:** 122 pruebas correctas; corrección de exclusión ESLint para caché anidada; smoke CORS inconcluso por fallo del navegador. [Validación T05](../../specs/006-currency/validation.md#t05--revisión-y-regresión-global).
