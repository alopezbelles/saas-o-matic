# Contratos API implementados

## Clientes (003)

| Método/ruta                      | Respuesta                                           |
| -------------------------------- | --------------------------------------------------- |
| POST /customers                  | 201 CustomerDto; Location /customers/{id}           |
| GET /customers?q=&limit=&offset= | 200 {items,total,limit,offset}                      |
| GET /customers/:id               | 200 CustomerDto; 400 ID inválido; 404 no encontrado |

Alta de cinco strings: companyName, taxId, contactEmail, countryCode y planCode.
contactName no es obligatorio ni se admite como campo HTTP extra; la columna histórica queda opcional en almacenamiento.
Ejemplo sintético (control matemático, no identidad acreditada):

```json
{
  "companyName": "Empresa de prueba",
  "taxId": "12345678Z",
  "contactEmail": "demo@example.invalid",
  "countryCode": "ES",
  "planCode": "DEMO_BASIC"
}
```

DTO: id, companyName, taxId, taxIdNormalized, contactEmail, countryCode, planCode, createdAt.
Reglas exactas de normalización/email/query y estados en [spec 003](../specs/003-customers-api/spec.md).
Fiscal ES verifica formato/control, no censo ni existencia. [Fuentes y límites](../specs/003-customers-api/fiscal-rules.md).

## Errores

Envelope: {error:{code,message,requestId,fields?}}; requestId de servidor y X-Request-Id.
400 petición inválida, 413 tamaño, 415 formato, 422 validación, 409 duplicado país/fiscal, 503 DB ausente/ocupada, 500 inesperado.
Sin PII, SQL o stack. Las rutas desconocidas devuelven 404 con envelope.
No se reintenta POST automáticamente.

## GET /health

200 {"status":"ok"}, sin DB ni migraciones. Conserva la semántica liveness.
Las rutas de clientes usan conexión lazy; requieren inicialización explícita vía CLI cuando no hay archivo.
No hay POST /simulations, cálculo monetario ni configuración fiscal HTTP todavía.

## Simulaciones 005 — contratos preparados, rutas no implementadas

T01 implementa tipos y parsers en packages/shared/src/simulations.ts; no añade endpoints. El motor de 004 existe como librería pura, sin integración HTTP todavía.
CreateSimulation: customerId, users, storageGb, apiCalls, los cuatro obligatorios. Sin campos adicionales ni coerción numérica. UUID válido se normaliza a minúsculas mediante parseCustomerId de 003. Campo ausente → VALIDATION_ERROR (422); customerId presente pero inválido → INVALID_CUSTOMER_ID (400).
Consumos enteros no negativos hasta límites shared: users 1000, storageGb 10000, apiCalls 10000000. parseCreateSimulation reutiliza guardas del motor y traduce errores a InputError con campos/mensajes sanitizados.
SimulationDto: id, customerId, users, storageGb, apiCalls, currency EUR, baseCents, taxCents, totalCents, taxRateBps, pricingVersion, taxPolicyVersion, breakdown, createdAt y customerSnapshot.
Snapshot: companyName, taxIdNormalized, countryCode, planCode. Desglose: tierFrom, tierTo, quantity, unitPriceCents y subtotalCents. Sin breakdownJson, email/contactName o modelos ORM. Mapping de filas implementado bajo T02, sin rutas nuevas.
SimulationQuery: limit/offset, defaults 20/0 y rangos 1..100 / 0..100000. Sin repetidos, fracciones, exponentes, signos, espacios ni extras. Mantiene aceptación de ceros iniciales de 003. SimulationPage: {items: SimulationDto[], total, limit, offset}.
BillingConfigDto: currency EUR, pricingVersion, taxPolicyVersion, tiers ({tierFrom,tierTo,unitPriceCents}[]), ratesByCountry y consumptionLimits. Solo tipos; proyección/endpoint pendientes de T04.
Rutas futuras: POST /simulations (201), GET /customers/:id/simulations y GET /billing-config (200). Semántica y errores en [spec 005](../specs/005-simulations-api/spec.md). Contratos disponibles no acreditan rutas implementadas.
T02 añade servicio interno de creación y repositorio transaccional: calculateQuote usa país del cliente bajo transacción inmediata; persistencia guarda snapshots/resultado y devuelve DTO validado después del commit. No hay endpoint todavía; traducción HTTP de BillingError pertenece a T03.
