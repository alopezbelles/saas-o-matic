# 004 — Preparación de la especificación

15 de noviembre de 2026. Registro retrospectivo de las decisiones de preparación, creado por autorización posterior de Alex. No transcripción literal ni implementación.

## Contexto y objetivo

001, 002 y 003 ofrecen infraestructura, persistencia y clientes. El motor de importes no está implementado.
La plantilla 004 contenía referencias a paquetes inexistentes, límites antiguos y propuestas de integración ajenas al motor. Se pidió adaptar primero la documentación y decidir incrementalmente.

## Decisiones e iteraciones relevantes

1. Ubicar dominio en shared, preservando API como consumidor y sin nuevos paquetes.
2. Incluir ES/FR/DE/GB mediante política única; aceptar explícitamente alcance fiscal demo.
3. Fijar céntimos, BigInt y half-up sobre impuesto de base completa.
4. Reservar integración/guardado para 005 y FX para 006.
5. Reutilizar límites de 002; validar tres consumos sin tarifas secundarias.
6. Definir entrada explícita y salida con desglose y versiones para trazabilidad histórica.
7. Consolidar errores, identificador users-tiered-v1 y plan de pruebas progresivas. Son precisiones técnicas de revisión, no nuevos precios.

[Decisiones canónicas](../../specs/004-billing/clarifications.md) y [ADR](../decisions/ADR-005-billing-engine.md).

## Cambios de esta consolidación

Reescribir spec/plan/tasks para eliminar estados y referencias obsoletas; preservar estado de implementación pendiente. Actualizar memoria, autorizaciones, reglas y trazabilidad contextual.
Añadir [reformulaciones técnicas](../prompts/004-billing.md), esta iteración, ADR y revisión documental. No añadir capturas, resultados de motor ni registros vacíos.
Se detectó que un script supuesto scripts/test-unit.mjs no existe; la planificación final usa los scripts reales de package.json, sin crear ese archivo.
El comprobador documental aún identifica 003 mediante expresión fija; al implementar T01 se revisará ese gate para comprobar la spec activa 004 sin confundir referencia histórica con contexto vigente.

## Validación y límites

[Revisión documental](../reviews/004-billing-planning.md) y [validación canónica](../../specs/004-billing/validation.md).
No código, dependencias instaladas, DB ni commits. Ninguna prueba monetaria ejecutada.
Los 2 tests documentales pasan; el control global de formato informa 46 archivos ajenos a la revisión con avisos. Se documenta la incidencia sin reformatear código ni otras entregas.
Siguiente paso: T01 cuando Alex indique empezar; registrar desde entonces las instrucciones y verificaciones durante cada tarea.

## T01 — Implementación autorizada y registro durante el trabajo

15 de noviembre de 2026, después del commit documental 06fd82b. Alex autorizó T01. Se preparó una instrucción técnica antes de modificar código, añadida en prompts/004-billing.md; esta sección registra la ejecución y no modifica la procedencia retrospectiva de la preparación anterior.
Se añadieron fixtures y cinco pruebas de integridad, runner shared y encadenamiento test:unit raíz conservando API. Se corrigió el gate de contexto para exigir la spec activa 004 y su archivo. No se implementaron funciones de cálculo.
La shell no encontraba Node en PATH; se utilizó la instalación existente en C:\Program Files\nodejs y el pnpm local mediante PATH de proceso. Sin instalación ni cambios personales.
Lint/typecheck pasan; unitarios 5 shared + 3 API y 2 documentales pasan. Formato global falla en 43 archivos externos; comparación con Prettier confirma que son diferencias exclusivas CRLF/LF. No se corrigieron fuera de alcance.
[Evidencia](../testing/004-billing-t01.md) y [revisión técnica](../reviews/004-billing-t01.md). T01 cerrada en su alcance, RF del motor pendientes. Sin DB ni commits. Siguiente paso: T02 por indicación de Alex.

## T02 — Tramos y contrato básico

15 de noviembre de 2026. Base 84818bf; T02 autorizada por Alex. [Instrucción previa](../prompts/004-billing.md#t02--instrucción-previa-de-implementación) preparada antes del código.
Se implementaron TierBreakdown/TieredBase, BillingError y calculateTieredBase con versión/reglas agrupadas. Validación de users mediante límite shared, BigInt en operaciones monetarias y resultados nuevos por llamada; sin impuestos ni quote.
Cinco tests productivos se suman a los cinco fixtures y tres de API: 13 pasan. Se cubren rango completo, marginales, oráculos, errores, JSON y aislamiento. Lint y typecheck pasan; formato global informa 42 archivos ajenos, uno menos al modificar/formatear index.ts en esta tarea.
RF1 implementado y probado; RF3/RF4 parciales. [Evidencia](../testing/004-billing-t02.md) y [revisión](../reviews/004-billing-t02.md). Sin DB, nuevas dependencias ni commits. Esperar indicación para T03.

## T03 — Dinero e impuestos versionados

15 de noviembre de 2026, base eb24f0a. Alex autoriza T03; [instrucción técnica](../prompts/004-billing.md#t03--instrucción-previa-de-implementación) preparada antes del código.
Se implementaron money/tax, TaxPolicy, configuración API demo-standard-v1 y pruebas. Se centralizó conversión segura de tramos en toSafeCents para evitar duplicación. Objetos de política planos o sin prototipo, sin tasas heredadas; cero es explícito, nunca fallback.
Seis tests shared y dos de API nuevos; 21 unitarios pasan junto con lint/typecheck. La configuración se congela en runtime. Formato global con 41 archivos ajenos; se formateó package.json de API al modificar el runner. No cambios masivos.
[Evidencia](../testing/004-billing-t03.md) y [revisión](../reviews/004-billing-t03.md). Sin quote, DB, HTTP, FX, dependencias ni commits. Esperar indicación para T04.

## T05 — Verificación global

### Corrección posterior autorizada de formato

15 de noviembre de 2026, base 9246956. Alex autoriza resolver issues. Se preparó instrucción previa y normalizaron los 41 archivos tras comprobar equivalencia exacta CRLF→LF; sin cambios de lógica. .gitattributes y Prettier fijan LF, sin configuración personal/.git.
Lint/typecheck/format:check/build/test correctos; 59 pruebas pasan. git ls-files --eol confirma índice/working tree LF en los 41, por lo que no se renormalizó el índice. T05 cerrada técnicamente, aceptación humana pendiente. [Evidencia y revisión](../testing/004-billing-format-fix.md). Fallos originales siguientes son históricos, no estado vigente. Sin commits.

15 de noviembre de 2026, base 88ce6b1. Autorización de Alex para T05; instrucción previa en prompts/004-billing.md. Se ejecutaron lint, typecheck, format:check, build y test secuencialmente, sin paralelizar gates con controles de código.
Lint/typecheck/build correctos; suite completa con 59 tests correctos. Comprobación adicional de 4004 desgloses contra validador 002 sin DB, todos aceptados. Solo se modifican registros/documentación, sin código productivo.
Formato global falla en 41 archivos ajenos; diagnóstico read-only confirma exclusivamente CRLF/LF. No reformateo masivo ni configuración Git. T05 ejecutada, cierre global pendiente de formato. [Pruebas](../testing/004-billing-t05.md) y [revisión](../reviews/004-billing-t05.md). Casos ES 15/51 y política presentados para revisión, sin aceptación humana registrada ni commits.

## T04 — Presupuesto completo (detalle histórico)

15 de noviembre de 2026. Base b3f3061; autorización expresa de Alex para T04. [Instrucción previa](../prompts/004-billing.md#t04--instrucción-previa-de-implementación) preparada antes del código.
Se añadieron quote.ts, BillingInput/BillingQuote y exports. validation.ts centraliza guardas de consumo que usan tanto tiers como quote. Se compone base/impuesto, se suma con BigInt y se devuelven EUR, tasa, versiones y desglose, sin cargos secundarios ni datos de cliente.
Primera ejecución: 29 tests unitarios pasan. La revisión añadió un caso independiente que diferencia redondeo sobre base completa de redondeo por tramo; ejecución final de 30 tests correcta, junto con lint/typecheck. Formato global mantiene 41 archivos ajenos con incidencia conocida.
[Evidencia](../testing/004-billing-t04.md) y [revisión](../reviews/004-billing-t04.md). RF1..4 implementados en motor puro; T05 y aceptación humana pendientes. Sin HTTP/DB/FX, dependencias ni commits.
