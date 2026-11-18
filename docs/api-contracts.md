# Contratos de comunicación de SaaS-O-Matic

## 1. Propósito y alcance

Este documento define el comportamiento contractual vigente de la API HTTP propia, los datos compartidos entre consumidores y backend y la integración externa de divisas. Debe orientar su especificación e implementación sin constituir un registro de avances ni atribuir una fecha ficticia de aprobación.

Los contratos deberán respetar las [reglas de negocio](business-rules.md) y el [alcance del producto](product.md). Las referencias detalladas son las specs de [clientes](../specs/003-customers-api/spec.md), [simulaciones](../specs/005-simulations-api/spec.md) y [divisas](../specs/006-currency/spec.md). Si se detecta una desviación del código, deberá señalarse; no se modificará el contrato para legitimarla automáticamente.

## 2. Convenciones de la API propia

Las rutas se expresan respecto al origen del backend, sin prefijo de versión ni autenticación definidos. El prefijo `/api` del consumidor web es un mecanismo de acceso descrito en [arquitectura](architecture.md), no parte de las rutas de este contrato.

- Los cuerpos de alta deberán ser objetos JSON con campos exactos, sin propiedades adicionales, arrays, null ni coerciones de tipos. Se exigirá `Content-Type: application/json`, con cuerpo máximo de 32 KiB.
- Las respuestas satisfactorias devolverán directamente el DTO o página, sin envoltorio adicional de éxito. Los errores usarán el envelope común.
- Los identificadores de cliente de entrada deberán ser UUID con grupos hexadecimales 8-4-4-4-12, versión 1–8 y variante 8/9/a/b, sin espacios. Se admitirán mayúsculas y se normalizarán a minúsculas.
- Identificadores y fechas de alta serán generados por el servidor. `createdAt` deberá representar un instante UTC ISO-8601 con milisegundos.
- Los importes se expresarán como enteros seguros no negativos en céntimos EUR; los porcentajes usarán puntos básicos. No se enviarán BigInt ni números no finitos en JSON.
- Los parámetros de consulta se limitarán a las claves expresamente admitidas. Se rechazarán claves desconocidas, repetidas o anidadas.

### Paginación

| Parámetro | Formato               | Valor predeterminado | Rango inclusivo |
| --------- | --------------------- | -------------------- | --------------- |
| `limit`   | Dígitos ASCII, entero | 20                   | 1–100           |
| `offset`  | Dígitos ASCII, entero | 0                    | 0–100000        |

Se admitirán ceros iniciales. No se admitirán valores vacíos, signos, espacios, fracciones o exponentes. El orden será `createdAt DESC, id DESC`. `total` contará los resultados antes de paginar y con los mismos filtros; una página fuera del rango devolverá `items: []` conservando el total. El orden estable no garantiza continuidad entre peticiones si cambian los datos.

### Errores y correlación

Todas las respuestas propias deberán incluir `X-Request-Id` generado por el servidor. No se confiará en un identificador externo como identidad de correlación.

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Revisa los campos indicados.",
    "requestId": "UUID generado por el servidor",
    "fields": { "users": "Consumo no válido." }
  }
}
```

`error`, `code`, `message` y `requestId` son obligatorios. `fields` es opcional, un mapa de nombre de campo a mensaje; no debe presumirse su presencia o un objeto vacío. Los mensajes públicos serán españoles y no repetirán datos sensibles. El ejemplo representa la estructura; no un requestId literal válido.

| Estado | Código                                   | Significado                                                  |
| ------ | ---------------------------------------- | ------------------------------------------------------------ |
| 400    | `INVALID_JSON`                           | JSON mal formado o cuerpo recibido inválido según protocolo. |
| 400    | `INVALID_CUSTOMER_ID`                    | Identificador de cliente inválido.                           |
| 400    | `INVALID_QUERY`                          | Query no admitida.                                           |
| 404    | `CUSTOMER_NOT_FOUND`                     | Cliente válido en formato pero ausente.                      |
| 404    | `ROUTE_NOT_FOUND`                        | Ruta no definida.                                            |
| 409    | `CUSTOMER_TAX_ID_CONFLICT`               | Duplicado de país e identificador fiscal normalizado.        |
| 413    | `PAYLOAD_TOO_LARGE`                      | Cuerpo superior al máximo.                                   |
| 415    | `UNSUPPORTED_MEDIA_TYPE`                 | Tipo, charset o codificación de cuerpo no admitidos.         |
| 422    | `VALIDATION_ERROR`                       | Campos, estructura o consumos inválidos.                     |
| 422    | `TAX_ID_INVALID`                         | Identificador español con formato o control incorrecto.      |
| 422    | `TAX_COUNTRY_UNSUPPORTED`                | País del cliente sin regla de simulación.                    |
| 503    | `DATABASE_UNAVAILABLE` / `DATABASE_BUSY` | Base no disponible u ocupada.                                |
| 500    | `INTERNAL_ERROR`                         | Fallo inesperado o configuración/cálculo interno inválido.   |

Los errores no deberán exponer PII, SQL, stack ni detalles internos. La aplicabilidad de cada código depende del endpoint. No se garantiza prioridad entre varios defectos simultáneos más allá de las distinciones expresas siguientes.

## 3. API de clientes

### POST /customers

Deberá registrar un cliente mediante exactamente cinco campos obligatorios de tipo string:

| Campo          | Restricciones y normalización                                                                                          |
| -------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `companyName`  | Trim y NFC; longitud 1–200.                                                                                            |
| `taxId`        | Trim; longitud 1–64, también dentro del límite al normalizar a mayúsculas. Conservar original recortado y normalizado. |
| `contactEmail` | Trim; longitud 1–254 y formato ASCII indicado debajo; conservar mayúsculas recibidas.                                  |
| `countryCode`  | Trim y mayúsculas; exactamente dos letras ASCII. No certifica pertenencia a ISO ni soporte fiscal.                     |
| `planCode`     | Trim; valor exacto `DEMO_BASIC` o `DEMO_PRO`.                                                                          |

Se rechazarán caracteres de control C0/C1. No se admitirán `contactName`, id, fecha o fiscal normalizado aportados por el consumidor. No se eliminarán caracteres fiscales interiores ni se aplicará normalización de compatibilidad para transformar caracteres visualmente parecidos.

El email deberá tener parte local dot-atom ASCII de 1–64 caracteres: letras, dígitos y signos `!#$%&'*+/=?^_` más acento grave, llaves, barra vertical, tilde, guion y punto. El punto no podrá iniciar, terminar o repetirse consecutivamente. El dominio tendrá al menos dos etiquetas alfanuméricas de 1–63 caracteres, con guiones solo interiores; no se admitirán direcciones IP, quoted-local, espacios o email internacional. No se comprobará DNS ni entrega del correo.

Para ES deberá verificarse el algoritmo fiscal conforme a la [tabla fiscal](../specs/003-customers-api/fiscal-rules.md). Para otros países se aplicarán las restricciones estructurales, sin prometer validez fiscal internacional. El duplicado se determinará por país y fiscal normalizado, no por empresa o email.

**Éxito:** 201 con `CustomerDto` y `Location: /customers/{id}`. Ejemplo sintético, sin identidad censal acreditada:

```json
{
  "companyName": "Empresa de prueba",
  "taxId": "12345678Z",
  "contactEmail": "demo@example.invalid",
  "countryCode": "ES",
  "planCode": "DEMO_BASIC"
}
```

**Errores:** 400 de JSON; 413/415 de protocolo; 422 de validación o fiscal; 409 de duplicado; 503 de datos; 500 interno. El error fiscal deberá señalar `fields.taxId`. Una entrada rechazada no deberá crear cliente.

### GET /customers

Deberá devolver `CustomerPage` con 200. Admitirá únicamente `q`, `limit` y `offset`.

`q` será texto recortado, de 0–200 caracteres, sin controles C0/C1; ausente o vacío listará todos. La búsqueda será substring literal OR sobre empresa e identificador fiscal normalizado, sin incluir email, contacto o plan. `%`, `_` y texto con apariencia SQL deberán tratarse como datos, no operadores del consumidor.

Para empresa se conservará la semántica LIKE de SQLite, insensible a mayúsculas ASCII, sin promesa de equivalencia Unicode o búsqueda sin acentos. El fiscal se buscará con query normalizada a mayúsculas. Total y página deberán corresponder a una lectura coherente.

Sin coincidencias se devolverán `items: []` y `total: 0`. **Errores:** 400 `INVALID_QUERY`, 503 o 500 según corresponda.

### GET /customers/:id

Deberá devolver 200 con `CustomerDto`, sin incluir simulaciones. Los registros existentes deberán poder consultarse sin volver a aplicar el checksum de una nueva alta.

**Errores:** 400 `INVALID_CUSTOMER_ID`, 404 `CUSTOMER_NOT_FOUND`, 503 o 500. Una cadena con formato UUID no acredita existencia del cliente.

## 4. API de simulaciones

### POST /simulations

Deberá aceptar exclusivamente `CreateSimulation`, definido en la sección de datos. Todos sus campos son obligatorios; no se permitirán importes, currency, país, plan, versiones, tasa, snapshots, id o fecha en el cuerpo.

El resultado deberá calcularse en el servidor con el cliente existente y la política vigente, conservando coherencia entre cálculo y snapshots. La respuesta solo se enviará tras confirmar el guardado completo; una excepción anterior al commit no deberá dejar una simulación parcial.

**Éxito:** 201 con `SimulationDto`. No se anunciará `Location` hacia un detalle individual de simulación inexistente.

**Errores:** campo ausente → 422 `VALIDATION_ERROR`; `customerId` presente pero UUID inválido → 400 `INVALID_CUSTOMER_ID`; consumos o campos extra → 422; cliente ausente → 404; país sin regla → 422 `TAX_COUNTRY_UNSUPPORTED` con `fields.customerId`. También se contemplarán 400 de JSON, 413/415, 503 y 500. Una política inválida o overflow con entrada válida deberá producir 500 sanitizado, no atribuirse al usuario.

No habrá reintentos automáticos ni deduplicación contractual de guardados deliberados. Dos envíos deliberados podrán generar dos registros. Un timeout o pérdida de respuesta después de un posible commit dejará resultado incierto para el consumidor; no acredita rollback ni autoriza reenvío automático.

### GET /customers/:id/simulations

Deberá devolver 200 con `SimulationPage`. Solo admitirá `limit` y `offset`; `q` no pertenece a este contrato.

Un cliente existente sin registros devolverá lista vacía y total cero; un cliente ausente devolverá 404. Existencia, total y página deberán corresponder a una lectura coherente. El orden y paginación seguirán las convenciones comunes.

Cada item deberá proyectar importes, desglose, versiones y snapshots guardados. No se recalculará con tarifas actuales ni se sustituirá el contexto por datos actuales del cliente.

**Errores:** 400 de ID/query, 404 de cliente, 503 o 500. No se definen endpoints de edición, eliminación o detalle individual de simulaciones.

## 5. Configuración de facturación

### GET /billing-config

Deberá devolver 200 con `BillingConfigDto` y `Cache-Control: no-store`, sin depender de que exista una conexión a la base de datos. No recibirá selección administrativa de política por petición.

La configuración deberá corresponder a los precios/versiones, política fiscal y límites vigentes, sin permitir al consumidor mutar las fuentes. Una configuración inválida deberá generar 500 `INTERNAL_ERROR` sanitizado.

El catálogo de países con tasa no será un catálogo de planes ni limitará por sí mismo el formato de país admitido al registrar clientes. Las fórmulas y valores de negocio se definen en [business-rules.md](business-rules.md).

## 6. Disponibilidad

### GET /health

Deberá devolver 200 con el cuerpo exacto:

```json
{ "status": "ok" }
```

Representa liveness de la API, no disponibilidad integral de todas sus dependencias. No exigirá base inicializada, migraciones ejecutadas o proveedor FX disponible; tampoco deberá crear o migrar datos para responder. No se define un endpoint adicional de readiness.

## 7. Contratos de datos

Todos los campos de las siguientes estructuras son obligatorios salvo indicación expresa. No se expondrán columnas ORM, metadatos de almacenamiento o JSON serializado como sustituto de estructuras públicas.

### CustomerDto y CustomerPage

`CustomerDto` tendrá exactamente:

| Campo             | Tipo y restricción                                                |
| ----------------- | ----------------------------------------------------------------- |
| `id`              | UUID de servidor.                                                 |
| `companyName`     | String normalizado del cliente.                                   |
| `taxId`           | String original recortado.                                        |
| `taxIdNormalized` | String recortado y en mayúsculas, sin pérdida de ceros iniciales. |
| `contactEmail`    | String del cliente.                                               |
| `countryCode`     | Código de dos letras mayúsculas.                                  |
| `planCode`        | `DEMO_BASIC` o `DEMO_PRO`.                                        |
| `createdAt`       | String UTC ISO-8601 con milisegundos.                             |

`CustomerPage` será `{items: CustomerDto[], total, limit, offset}`. Los metadatos numéricos serán enteros; total no negativo y paginación dentro de sus rangos.

### CreateSimulation

| Campo        | Tipo y rango inclusivo                 |
| ------------ | -------------------------------------- |
| `customerId` | UUID válido, normalizado a minúsculas. |
| `users`      | Number entero 0–1000.                  |
| `storageGb`  | Number entero 0–10000.                 |
| `apiCalls`   | Number entero 0–10000000.              |

No se convertirán strings numéricos en numbers ni se admitirán fracciones o valores no finitos.

### SimulationDto y estructuras anidadas

`SimulationDto` incluirá los cuatro campos de `CreateSimulation` y:

| Campo                                 | Tipo y restricción                                                      |
| ------------------------------------- | ----------------------------------------------------------------------- |
| `id`                                  | UUID generado por servidor.                                             |
| `currency`                            | Literal `EUR`.                                                          |
| `baseCents`, `taxCents`, `totalCents` | Numbers enteros seguros no negativos; base más impuesto igual a total.  |
| `taxRateBps`                          | Number entero de puntos básicos, 0–10000 según el contrato persistible. |
| `pricingVersion`, `taxPolicyVersion`  | Strings no vacíos que identifican las reglas aplicadas.                 |
| `breakdown`                           | Array de líneas de desglose coherente con usuarios y base.              |
| `createdAt`                           | String UTC ISO-8601.                                                    |
| `customerSnapshot`                    | `CustomerSnapshotDto` con los datos guardados al calcular.              |

`CustomerSnapshotDto` tendrá exactamente `companyName`, `taxIdNormalized`, `countryCode` y `planCode`, con tipos correspondientes al cliente. No contendrá email ni nombre de contacto.

Cada línea de `breakdown` tendrá `tierFrom: number`, `tierTo: number | null`, `quantity: number`, `unitPriceCents: number` y `subtotalCents: number`. `null` representará límite superior abierto. Las cantidades e importes serán enteros no negativos conforme a los tramos de negocio; las líneas deberán sumar la base. No se expondrá `breakdownJson`.

`SimulationPage` será `{items: SimulationDto[], total, limit, offset}`, con las convenciones de página comunes.

### BillingConfigDto

| Campo                                | Tipo y contenido                                                        |
| ------------------------------------ | ----------------------------------------------------------------------- |
| `currency`                           | Literal `EUR`.                                                          |
| `pricingVersion`, `taxPolicyVersion` | Strings de versión vigentes.                                            |
| `tiers`                              | Array de `{tierFrom: number, tierTo: number                             | null, unitPriceCents: number}`. |
| `ratesByCountry`                     | Mapa de código de país a tasa entera en puntos básicos.                 |
| `consumptionLimits`                  | Objeto con `users`, `storageGb`, `apiCalls`: máximos enteros admitidos. |

Las versiones deberán identificar las reglas publicadas. La configuración no incluirá datos de clientes, secretos ni referencias mutables del servidor.

## 8. Integración externa de divisas

El proveedor definido es ExchangeRate-API Open Access. La consulta será `GET https://open.er-api.com/v6/latest/EUR`, directamente desde el consumidor web, sin clave, proxy propio o endpoint FX del backend. No se enviarán importes ni datos privados del cliente.

La respuesta externa mínima deberá satisfacer:

| Propiedad               | Restricción                                                                                |
| ----------------------- | ------------------------------------------------------------------------------------------ |
| `result`                | Literal `success`; HTTP 200 con `result: error` no será éxito.                             |
| `base_code`             | Literal `EUR`.                                                                             |
| `rates`                 | Objeto con `EUR: 1` y USD/GBP numéricas, positivas y finitas.                              |
| `time_last_update_unix` | Entero seguro en segundos, representable como fecha UTC y no futuro.                       |
| `time_next_update_unix` | Entero seguro representable como fecha UTC, posterior a actualización y al momento de uso. |

Se admitirán campos o monedas adicionales sin ampliar el catálogo de producto. La caducidad exacta deberá considerarse vencida. Datos malformados o incoherentes no deberán convertirse en tasas utilizables.

El contrato normalizado de consumo será `ExchangeRates`: `baseCurrency: EUR`, `rates: {USD: string, GBP: string}`, `updatedAt` y `expiresAt` como fechas UTC ISO-8601, y `source` con nombre ExchangeRate-API, enlace del proveedor y atribución «Rates By Exchange Rate API». Las tasas se expresarán en texto decimal a partir del número recibido, sin prometer recuperar precisión perdida al interpretar JSON.

EUR no necesitará tasa externa. Para USD/GBP, la conversión deberá respetar BR05, fecha, vigencia y atribución. Una tasa decimal de conversión estará acotada a 64 caracteres, parte entera obligatoria, fracción opcional y exponente científico de valor absoluto máximo 324; sin espacios o signo inicial y representando valor positivo finito.

Los fallos externos se distinguirán como `EXCHANGE_NETWORK_ERROR`, `EXCHANGE_TIMEOUT`, `EXCHANGE_HTTP_ERROR`, `EXCHANGE_PAYLOAD_INVALID` o `EXCHANGE_RATE_EXPIRED`. Son códigos locales de integración, no respuestas del envelope de Express. Los errores puros de conversión se distinguirán como `CURRENCY_AMOUNT_INVALID`, `CURRENCY_UNSUPPORTED`, `CURRENCY_RATE_INVALID` o `CURRENCY_MONEY_OVERFLOW`; tampoco son endpoints HTTP.

Una consulta fallida no alterará EUR ni publicará datos caducados como vigentes. No se sustituirá silenciosamente por tasa 1. La presentación deberá conservar EUR y permitir recuperación explícita sin repetir un guardado. No se modificará proveedor o arquitectura por un fallo de conectividad sin decisión posterior. El contrato no garantiza disponibilidad o CORS en cualquier entorno.

## 9. Invariantes contractuales

- Los DTO HTTP deberán permanecer independientes de modelos ORM y detalles de almacenamiento.
- Los importes autoritativos, fechas y snapshots deberán proceder del servidor; el consumidor no podrá fijarlos al guardar.
- El histórico devolverá resultados originales sin recálculo y la conversión no alterará EUR persistido.
- Una petición inválida deberá producir el error controlado correspondiente sin escritura parcial.
- Errores públicos y logs no deberán revelar cuerpos, queries, PII, SQL o stack; la correlación utilizará requestId generado por el servidor.
- No se deducirán idempotencia, autenticación, edición, eliminación o endpoints adicionales de propiedades no definidas.
- Los contratos deberán mantenerse coherentes con las reglas aprobadas; una discrepancia requerirá resolución explícita, no adaptación retrospectiva al código.
