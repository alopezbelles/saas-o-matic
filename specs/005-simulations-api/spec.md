# 005 — API de simulaciones e histórico

Estado: T01–T04 completadas técnicamente; alta, histórico y configuración HTTP disponibles. T05 pendiente de cierre global; aceptación humana no registrada. Sin commits automáticos.

## Contexto y fuentes

002 ya ofrece SQLite, tabla simulations, snapshots, inserción transaccional e histórico inmutable. 003 ofrece clientes, errores sanitizados y conexión lazy. 004 ofrece calculateQuote, límites y política demo-standard-v1. 005 conecta estas piezas mediante HTTP, sin reimplementar cálculo ni esquema.
Fuentes: enunciado aportado por Alex (POST /simulations con cliente y tres consumos), [reglas vigentes](../../docs/business-rules.md) y decisiones heredadas de 002/004. Historial y configuración son alcance complementario confirmado para 005. No atribuir requisitos a IDs inexistentes de la plantilla anterior.

## Requisitos funcionales

- **005-RF1:** CUANDO se reciba un cliente existente y tres consumos válidos, EL SERVIDOR calculará mediante el motor de 004 y guardará consumos, importes EUR, desglose, tasa, versiones y snapshots del cliente, devolviendo 201 después del commit.
- **005-RF2:** SI hay campos no admitidos, tipos/rangos inválidos, cliente inexistente o país sin tarifa, EL SERVIDOR rechazará el guardado sin escritura parcial y con error estable.
- **005-RF3:** CUANDO se consulte el historial de un cliente existente, EL SERVIDOR devolverá datos guardados, paginados y ordenados por createdAt DESC, id DESC, sin recalcularlos ni sustituir snapshots.
- **005-RF4:** CUANDO cambie la configuración para nuevas simulaciones, EL SISTEMA conservará los históricos previos y GET /billing-config publicará la configuración vigente desde sus fuentes reales, sin DB ni datos de clientes.

## Decisiones heredadas

D01/D10: política demo-standard-v1 ES 2100, FR 2000, DE 1900 y GB 2000 bps; céntimos enteros, BigInt intermedio y half-up una sola vez sobre impuesto de base completa. Sin fiscalidad real completa, exenciones ni territorialidad.
D04: CONSUMPTION_LIMITS existente: users 0..1000, storageGb 0..10000, apiCalls 0..10000000, enteros seguros. Solo users genera coste; planes sin multiplicador.
D05: histórico EUR sin FX. Precios users-tiered-v1. Sin nuevas dependencias ni migración prevista.
La DB limita taxRateBps a 0..10000; las tasas demo cumplen. Las tasas sintéticas extremas de tests del motor no son políticas persistibles; no ampliar CHECK por esos fixtures.

## Contrato HTTP previsto

Esta sección define el contrato aprobado e implementado: tipos/parsers en T01, POST en T03 y GET de histórico/configuración en T04. docs/api-contracts.md recoge lo disponible; cierre global T05 pendiente.

### POST /simulations

Cuerpo JSON con exactamente cuatro campos obligatorios: customerId (UUID válido), users, storageGb y apiCalls (números enteros dentro de límites). Sin coerción. Campos ausentes → VALIDATION_ERROR (422); customerId presente pero UUID inválido → INVALID_CUSTOMER_ID (400). UUID válido se normaliza a minúsculas como en 003.
Rechazar campos adicionales, incluidos importes, currency, país, plan, versiones, tasa, snapshots, id o createdAt. País y plan proceden del cliente; identificador/fecha se generan en servidor.
201 con SimulationDto tras guardar. No anunciar Location hacia un endpoint de detalle inexistente ni añadir ese endpoint en esta spec.

### SimulationDto

id, customerId, users, storageGb, apiCalls, currency ('EUR'), baseCents, taxCents, totalCents, taxRateBps, pricingVersion, taxPolicyVersion, breakdown, createdAt y customerSnapshot.
customerSnapshot: companyName, taxIdNormalized, countryCode y planCode, obtenidos de las columnas snapshot guardadas.
breakdown es un array tipado con tierFrom, tierTo, quantity, unitPriceCents y subtotalCents; no exponer breakdownJson ni modelos ORM. Motor rateBps se mapea a taxRateBps.
createdAt UTC ISO-8601 e id UUID de servidor. Histórico devuelve exactamente lo persistido, no datos actuales del cliente. No incorporar email/contactName no guardados en snapshots.
Importes seguros en céntimos, baseCents + taxCents = totalCents; desglose consistente con users/base.

### GET /customers/:id/simulations?limit=&offset=

200 con {items: SimulationDto[], total, limit, offset}. Defaults limit=20, offset=0; limit 1..100, offset 0..100000, como 003.
Solo limit y offset; rechazar parámetros desconocidos, repetidos, no enteros o fuera de rango. id inválido → 400; cliente inexistente → 404; existente sin registros → items=[], total=0. Una página fuera del resultado devuelve items=[] conservando total real.
Orden createdAt DESC, id DESC. Verificación del cliente, total y página en una lectura transaccional coherente. Aplicar paginación en SQL, no cargando todo el historial.

### GET /billing-config

200, sin consultar DB: currency EUR, pricingVersion, taxPolicyVersion, tiers, ratesByCountry y consumptionLimits.
tiers: array de {tierFrom, tierTo, unitPriceCents}, con límite abierto null. ratesByCountry: mapa de país a bps; consumptionLimits conserva nombres users, storageGb y apiCalls.
Proyectar fuentes reales de 004 y CONSUMPTION_LIMITS, sin duplicar constantes ni publicar referencias mutables. Proporcionar una lectura pública de las reglas privadas de tiers.ts con copia de datos y su versión; no aceptar etiquetas arbitrarias.
Config de despliegue, sin endpoint administrativo ni consulta fiscal externa. Usar Cache-Control: no-store para evitar configuración HTTP obsoleta en esta fase.
Exponer configuración prepara el futuro preview; no lo implementa.

## Errores y recuperación

Conservar envelope de 003: {error:{code,message,requestId,fields?}}, X-Request-Id, mensajes españoles y logs sin PII/SQL/stack.

| Estado  | Situación y código                                                                                          |
| ------- | ----------------------------------------------------------------------------------------------------------- |
| 400     | INVALID_JSON, INVALID_CUSTOMER_ID o INVALID_QUERY según frontera.                                           |
| 413/415 | PAYLOAD_TOO_LARGE / UNSUPPORTED_MEDIA_TYPE, mismas reglas HTTP de 003.                                      |
| 422     | VALIDATION_ERROR para campos extra/tipos/consumos; TAX_COUNTRY_UNSUPPORTED para país del cliente sin regla. |
| 404     | CUSTOMER_NOT_FOUND, tanto alta referenciada como historial.                                                 |
| 503     | DATABASE_UNAVAILABLE / DATABASE_BUSY reutilizados.                                                          |
| 500     | INTERNAL_ERROR para configuración/política inválida, overflow con entrada válida o fallo inesperado.        |

País sin tarifa: field customerId, explicando que el país del cliente no está soportado, sin exponer identificadores fiscales.
No convertir fallos de configuración en errores imputados al usuario. Aun con cero usuarios se valida política/país.
No reintentar POST automáticamente, sin deduplicación/idempotency-key en 005. Dos guardados deliberados pueden producir dos registros. Si el transporte termina sin respuesta tras commit, el resultado es incierto para el consumidor; no prometer rollback por timeout. Doble clic y mensajes visuales pertenecen a la futura UI.

## Transacciones y conservación

Leer cliente usado para calcular y guardar snapshots en la misma transacción corta de escritura. Reutilizar insertSimulation y su allowlist/snapshots; no calcular con un cliente y guardar los datos de otro estado.
SQL y control transaccional en repositorio; servicio orquesta motor y política. No red ni operaciones asíncronas dentro de la transacción síncrona.
Fallo antes del commit → sin inserción parcial. Histórico append-only: no editar/borrar ni recalcular al consultar. Test de cambios usa clientes/políticas ficticios en contexto temporal, sin añadir endpoints para modificarlos.

## Fuera de alcance y cierre

Sin frontend, preview integrado, FX/monedas (006), autenticación nueva, edición/borrado, migraciones nuevas previstas ni datos demo adicionales.
RF con pruebas/evidencia reales; controles globales correctos; aceptación humana separada del cierre técnico. Ningún RF implementado en 005 todavía.
[Plan](plan.md), [tareas](tasks.md), [decisiones](clarifications.md) y [validación](validation.md).
