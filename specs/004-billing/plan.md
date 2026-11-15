# Plan 004 — Motor monetario puro

Estado: preparado para ejecución incremental; no implementado. [Spec](spec.md) y [decisiones](clarifications.md) canónicas.

## Arquitectura

Reutilizar 001 (monorepo), 002 (límites y formato histórico) y convenciones de 003. El dominio no depende de clientes, SQL, React, HTTP ni entorno. Sin dependencias nuevas.
Configuración fiscal en API; shared recibe datos explícitos. No publicar configuración HTTP ni integrar preview.

## Archivos previstos

Las rutas siguientes son futuras, no enlaces a archivos existentes:

| Archivo                                        | Responsabilidad                                                   |
| ---------------------------------------------- | ----------------------------------------------------------------- |
| packages/shared/src/billing/types.ts           | BillingInput, TaxPolicy, TierBreakdown, TieredBase, BillingQuote. |
| packages/shared/src/billing/errors.ts          | BillingError y códigos.                                           |
| packages/shared/src/billing/tiers.ts           | Tramos, users-tiered-v1 y calculateTieredBase.                    |
| packages/shared/src/billing/money.ts           | Guardas, BigInt, conversión segura y half-up.                     |
| packages/shared/src/billing/tax.ts             | Validación de política, resolución de tasa y calculateTax.        |
| packages/shared/src/billing/quote.ts           | Validación de consumos y composición calculateQuote.              |
| apps/api/src/config/tax-policy.ts              | Configuración demo-standard-v1.                                   |
| packages/shared/test/billing-fixtures.mjs      | Resultados independientes; distinguir tasas sintéticas.           |
| packages/shared/test/billing-fixtures.test.mjs | Coherencia de fixtures, sin acreditar producción.                 |
| packages/shared/test/billing.test.mjs          | Pruebas del motor añadidas progresivamente T02–T04.               |
| apps/api/test/tax-policy.test.mjs              | Configuración real contra motor, sin DB ni HTTP.                  |

Ampliar index.ts de shared y package.json raíz/shared/API al integrar pruebas. No mover validadores de persistencia ni refactorizar 002 por anticipación. Revisar cohesión; no fragmentar solo por cantidad de líneas.

## Contratos y secuencia

- calculateTieredBase(users: number): TieredBase (baseCents, pricingVersion, breakdown).
- calculateTax(baseCents: number, rateBps: number): number (impuesto en céntimos).
- calculateQuote(input: BillingInput, policy: TaxPolicy): BillingQuote.

Entrada, salida, errores y versiones definidos en [spec](spec.md). Validar runtime además de tipos strict. No mutar entradas, política ni reglas, ni devolver referencias mutables a configuración interna.
CONSUMPTION_LIMITS es fuente única. Tasas enteras seguras no negativas, sin máximo fiscal nuevo; detectar overflow. Campos desconocidos no participan ni se propagan; el cuerpo HTTP estricto pertenece a 005.

1. Validar tres consumos y formato de país.
2. Validar política y buscar entrada propia del país, sin fallback.
3. Calcular tramos acumulativos y versión de precios.
4. Calcular impuesto una vez con BigInt y half-up.
5. Sumar total, comprobar rango seguro y devolver contrato EUR.

a=min(n,10), b=min(max(n-10,0),40), c=max(n-50,0); base=a×1000+b×800+c×500.
tax=(BigInt(base)×BigInt(rateBps)+5000n)/10000n. No redondear por tramo ni cambiar reglas bajo una versión publicada.

## Implementación incremental y scripts

T01 prepara fixtures y comprobación ejecutable sin importar funciones inexistentes. No tests omitidos ni placeholders; un PASS de fixtures no demuestra el motor. Las pruebas productivas se incorporan con T02–T04.
En T01 añadir test:unit en shared: node --test test/*.test.mjs. Ampliar test:unit raíz: compilar shared/API, ejecutar shared y después API, preservando pruebas actuales de 003. Actualizar docs/testing.md al implementar, no antes.
En T03 incluir tax-policy.test.mjs en el listado explícito test:unit de API.
En T01 actualizar test/docs.test.mjs: la comprobación actual busca 003 en memoria mediante expresión fija; debe comprobar 004 como spec activa y su enlace existente, conservando la historia 003.
No cambiar scripts durante esta preparación.

Por tarea: pnpm lint, pnpm typecheck, pnpm format:check y pnpm test:unit. T05 añade pnpm build y pnpm test, secuencialmente. No ejecutar test:gates en paralelo con otros controles de código.
Pruebas importan build actualizado de shared; sin runner ni dependencia nueva.

## Casos previstos

| Caso         | Cobertura                                                                                   | RF          |
| ------------ | ------------------------------------------------------------------------------------------- | ----------- |
| UT-FIX-004   | Coherencia de fixtures; no prueba producción.                                               | Preparación |
| UT-BILL-01   | 0/10/11/15/50/51/1000 y desglose.                                                           | RF1         |
| UT-TAX-01    | Cuatro países, tasa cero, ausente y política inválida.                                      | RF2, RF3    |
| UT-MONEY-01  | Medio céntimo, importes inválidos y overflow.                                               | RF2, RF3    |
| UT-INPUT-004 | Cada consumo: 0/máximo/máximo+1; tipos, fracciones, negativos, NaN/Infinity; país inválido. | RF3         |
| UT-QUOTE-004 | Contrato completo, errores, versiones, serialización y cero usuarios con país no soportado. | RF1..4      |
| UT-PROP-01   | Marginales 1000/800/500 en rango completo, monotonía, determinismo y no mutación.           | RF1, RF4    |

ES, 15/51 usuarios: base 14000/42500, impuesto 2940/8925 y total 16940/51425 céntimos.
Half-up sintético: base 1 céntimo con 4999/5000/5001 bps → impuesto 0/1/1. No son tasas de producto.
Overflow en helpers y política sintética; las tasas demo y consumos permitidos no lo alcanzan.
Compatibilidad con 002 estructural, sin escrituras DB.

## Riesgos y alternativas

No confundir demo fiscal con liquidación real, fixtures con reglas, ni revisión documental con validación del motor.
Se descartan paquetes adicionales, coma flotante monetaria, límites duplicados y precios por plan/storage/API. Integración HTTP/DB y FX pertenecen a fases siguientes.
