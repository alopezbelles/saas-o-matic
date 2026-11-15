# Tareas 006

Estado global: T01–T04 completadas técnicamente; T05 pendiente. Cada tarea requiere indicación de Alex. Sin aceptación humana final.

- [x] **T01 — Contratos, catálogo y fixtures**
  - RF: 006-RF1–RF4.
  - Definir contratos/errores compartidos, catálogo EUR/USD/GBP con exponente 2 y contrato normalizado del cliente web.
  - Destinos: packages/shared/src/currency/, apps/web/src/features/currency/exchange-contract.ts y fixtures de sus suites.
  - Verificación: compilación/exportaciones, catálogo y fixtures deterministas. Sin llamadas reales ni UI; no marcar RF completos solo por tipos.
  - Evidencia real: [validación T01](validation.md#t01--contratos-catálogo-y-fixtures). Catálogo/errores y cinco pruebas nuevas correctos; RF funcionales pendientes.

- [x] **T02 — Conversión pura**
  - Dependencia: T01. RF: 006-RF1.
  - Tasa decimal/racional con límites técnicos explícitos, BigInt y utilidades actuales; EUR identidad sin tasa, solo total.
  - Destinos: packages/shared/src/currency/ y packages/shared/test/currency.test.mjs.
  - Pruebas: 16940 EUR cents ×1.1 = 18634 USD cents; ×0.8 = 13552 GBP cents; cero, identidad, mitad exacta, notación científica, entradas inválidas, moneda no soportada y overflow.
  - Hecho cuando pasan oráculos independientes sin operaciones monetarias flotantes ni efectos externos.
  - Evidencia: [validación T02](validation.md#t02--conversión-pura). RF1 conforme en dominio; proveedor y metadatos externos pendientes de T03/T04.

- [x] **T03 — Validación del proveedor**
  - Dependencias: T01/T02. RF: 006-RF2/RF3.
  - Validar unknown, estado lógico, base EUR, EUR=1, USD/GBP y timestamps; normalizar tasas, fechas y atribución.
  - Destinos: apps/web/src/features/currency/exchange-contract.ts y pruebas node:test.
  - Pruebas: éxito, campos extra admitidos, estructura inválida, result:error, tasas ausentes/inválidas y fechas futuras/caducadas/incoherentes.
  - Hecho cuando payload rechazado nunca produce tasas utilizables.
  - Evidencia real: [validación T03](validation.md#t03--validación-del-proveedor). Ocho pruebas productivas correctas; sin transporte ni comprobación CORS.

- [x] **T04 — Cliente HTTP y caché**
  - Dependencia: T03. RF: 006-RF2/RF3/RF4.
  - Cliente sin React, fetch/reloj inyectables, timeout 5 s, petición compartida, caché hasta caducidad y recuperación explícita.
  - Destinos: apps/web/src/features/currency/exchange-client.ts y pruebas node:test.
  - Pruebas: EUR sin red; USD/GBP concurrentes con una petición; cambios de importe sin refetch; caducidad exacta; timeout/429/red/JSON; recuperación y protección contra mutación externa.
  - Hecho cuando no se entregan tasas caducadas como vigentes y los fallos no alteran EUR.
  - Evidencia: [validación T04](validation.md#t04--cliente-http-y-caché). Nueve pruebas nuevas sin proveedor real ni UI.

- [ ] **T05 — Revisión técnica y regresión**
  - Dependencia: T04. RF: 006-RF1–RF4.
  - Revisar conversión/cliente compuestos con fixtures, privacidad, exports y compilación; preservar motor, API y snapshots.
  - Ejecutar controles del plan, registrar resultados reales en validation.md y actualizar contexto/documentación global pertinente.
  - Comprobar CORS real desde navegador si el entorno permite, sin pantalla de producto; separar smoke externo de pruebas deterministas. Declarar limitación si no es comprobable; si falla, detener integración afectada y consultar alternativa.
  - Dejar pendientes para otras specs hook, selector, presentación, estados visuales, atribución visible y E2E.
  - Hecho cuando existe evidencia por RF, controles correctos y límites externos explícitos; no equivale a aceptación humana.
