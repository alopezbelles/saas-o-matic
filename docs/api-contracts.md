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
