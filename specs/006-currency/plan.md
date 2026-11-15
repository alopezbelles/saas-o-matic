# Plan 006 — Infraestructura de conversión

Estado: decisiones confirmadas; implementación pendiente por tarea.

## Instrucción técnica previa

Crear módulos comprobables para convertir el total EUR y consultar tasas públicas, sin depender de React, SQL o HTTP del backend. Conservar contratos de 002–005 y separar dominio puro de proveedor. Implementar únicamente la tarea autorizada, con fixtures deterministas y evidencia real.

## Módulos previstos

Destinos futuros, no archivos existentes:

- packages/shared/src/currency/: catálogo, contratos, errores y conversión pura; exportar desde packages/shared/src/index.ts. Reutilizar billing/money.ts.
- apps/web/src/features/currency/exchange-contract.ts: validar unknown del proveedor y normalizarlo. El payload externo permanece en web.
- apps/web/src/features/currency/exchange-client.ts: fetch, timeout, caché y concurrencia; sin React ni conocimiento de consumos.
- packages/shared/test/currency.test.mjs y apps/web/test/currency-*.test.mjs: node:test y fixtures locales. Adaptar compilación/runner cuando sea necesario sin nuevas librerías.

## Contratos internos

Conversión: amountEurCents, targetCurrency y tasa decimal EUR→destino. Resultado: importe en unidades menores, moneda y exponente. Validar entero seguro no negativo, catálogo cerrado y tasa positiva finita. EUR es identidad y no requiere tasa.

Cliente: base EUR, tasas decimales USD/GBP, updatedAt/expiresAt, fuente y atribución. Componer estos metadatos con el resultado al consumirlo; la función monetaria pura no consulta reloj ni red.

Errores discriminables: entrada/moneda/tasa inválidas, overflow, red, timeout, HTTP, payload inválido y tasa caducada. Sin fallback silencioso a tasa 1 o éxito EUR; conservar el importe original.

## Proveedor

[ExchangeRate-API Open Access](https://www.exchangerate-api.com/docs/free).
Endpoint fijo: https://open.er-api.com/v6/latest/EUR.

Validar objeto, result=success, base_code=EUR, rates.EUR=1, USD/GBP numéricas positivas finitas y timestamps enteros seguros en segundos. Exigir actualización no futura, caducidad posterior a actualización y al reloj actual. Admitir campos/monedas adicionales sin ampliar soporte. HTTP 200 result:error no es éxito.

Normalizar números JSON mediante su representación decimal de JavaScript, incluyendo notación científica. No prometer recuperar dígitos perdidos al parsear JSON. Acotar longitud/exponente antes de construir potencias BigInt y probar los límites técnicos.

Proporcionar fuente, enlace https://www.exchangerate-api.com y texto de atribución «Rates By Exchange Rate API». La UI futura debe mostrarlo antes de publicar una pantalla que use tasas. No enviar datos privados ni importes.

## Cálculo exacto

Transformar tasa decimal en numerador/denominador BigInt. Calcular:

amountTargetMinor = roundHalfUp(amountEurCents × rateNumerator × 10^targetExponent, rateDenominator × 100).

Reutilizar roundHalfUp y comprobación de entero seguro; convertir a number solo al final. No modificar lógica fiscal.

## Caché y transporte

- Inyectar fetch y reloj; AbortController con timeout de 5000 ms.
- Instancia compartida para la futura pestaña; caché y petición en curso privadas. Instancias aislables en pruebas.
- EUR sin red; USD/GBP comparten respuesta y petición en curso.
- Comprobar caducidad en cada acceso y al finalizar la petición; devolver copias o datos inmutables.
- Fallos liberan petición en curso y no almacenan payload inválido ni reactivan caché caducada; siguiente solicitud explícita puede recuperar.
- Sin polling, reintentos automáticos ni petición por cambio de importe.
- Sin cancelación por selección de moneda: no existe UI en 006 y no debe abortarse una petición compartida por un consumidor.

## Pruebas y cierre

Ver [tareas](tasks.md). node:test con fetch/reloj inyectados, oráculos independientes y fixtures; sin suite visual ficticia. Un fetch de Node no acredita CORS: comprobar desde navegador con origen de desarrollo o declarar limitación. Si falla, consultar alternativa antes de cambiar arquitectura.

Controles: pnpm lint, pnpm typecheck, pnpm format:check, pnpm build y pnpm test. No ejecutar test:gates en paralelo con otros controles de código.

Revisar exports y empaquetado: web todavía no declara shared como dependencia directa; añadir solo el enlace workspace interno necesario si lo importa, sin librería externa.

## Documentación

No modificar docs/design.md por trabajo sin interfaz. No afirmar que docs/api-contracts.md contiene ya el contrato externo. Actualizar contexto y documentación global pertinente durante implementación autorizada. Esta preparación solo modifica la carpeta 006 y no se registra en ai-workspace.
