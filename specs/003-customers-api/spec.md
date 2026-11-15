# 003 — API de clientes, validación fiscal y búsqueda

## Estado y alcance

Implementación autorizada por Alex tras revisar el enunciado de cinco campos.
Alcance: API de clientes y corrección compatible del campo de contacto; solo bases temporales en validación.
Fuente de alcance: solicitud de adaptar esta spec al proyecto y objetivos funcionales de la plantilla original. No atribuir R03/R04/R10/N01/N02/N05 a requisitos oficiales ausentes.
Dependencias: [001](../001-foundation/spec.md) aporta Express/TypeScript/calidad y [002](../002-persistence/spec.md) aporta esquema, conexión, normalización técnica y unicidad.

## Objetivo

Como comercial quiero registrar un cliente y encontrar su detalle mediante una API consistente, sin duplicar su identidad fiscal.
Entregar POST /customers, GET /customers y GET /customers/:id. Sin frontend, edición/borrado, simulaciones, precios, impuestos, VIES ni verificación censal.

## Requisitos

- **003-RF1**: Ante un alta válida conforme al contrato, persistir una única fila y devolver 201 con el DTO normalizado, ID y fecha generados por el servidor.
- **003-RF2**: Ante un identificador español con formato/control incorrecto, rechazar con 422 y error de campo antes de escribir. La clasificación fiscal y sus fixtures deben superar la tarea documental T01.
- **003-RF3**: Ante consulta por nombre o identificador, devolver página y total con orden estable; el detalle devuelve 200 o 404 según existencia.
- **003-RF4**: Ante duplicado normalizado en el mismo país, devolver 409 desde la restricción UNIQUE de SQLite; en concurrencia exactamente una alta termina 201 y la otra 409.
- **003-RF5**: Ante petición inválida, DB ausente/bloqueada o fallo inesperado, devolver el error definido sin PII, SQL ni stack; mantener /health operativo sin DB.

## Reutilización obligatoria de 002

- Conservar customers y UNIQUE(country_code, tax_id_normalized). Excepción justificada por el enunciado: migración nueva 0001_optional_contact para permitir contact_name nulo, sin perder nombres ni snapshots existentes; no modificar SQL ya aplicado.
- Mantener DEMO_BASIC/DEMO_PRO desde packages/shared/src/persistence-contracts.ts. Sin precios ni cuotas por plan.
- Reutilizar insertCustomer/getCustomer de apps/api/src/db/persistence.ts; añadir solo consultas que faltan, desde el repositorio de la feature.
- Compartir contratos HTTP en packages/shared, sin exports ORM.
- No cambiar ni eliminar datos existentes. Los fixtures demo ES con fiscal DEMO-001/002 ya guardados siguen siendo legibles; la nueva validación se aplica a altas HTTP, no es una migración de registros antiguos.
- No modificar histórico de simulaciones ni la política fiscal de cálculo.

## Contrato de alta

POST /customers, Content-Type application/json. Body máximo 32 KiB.
Objeto exacto con **cinco campos**, todos strings y obligatorios. No se exige nombre de contacto:

| Campo JSON   | Tratamiento y límites tras trim                                                               |
| ------------ | --------------------------------------------------------------------------------------------- |
| companyName  | 1..200, normalización NFC                                                                     |
| taxId        | 1..64; conserva versión recortada como tax_id_original; versión normalizada trim + mayúsculas |
| contactEmail | 1..254, formato ASCII definido debajo; no único                                               |
| countryCode  | trim + mayúsculas; exactamente dos letras ASCII, igual a la guarda de 002                     |
| planCode     | trim; valor exacto DEMO_BASIC o DEMO_PRO, sin conversión implícita de códigos desconocidos    |

No aceptar null, arrays, coerción de números, campos extra, ID, fecha ni taxIdNormalized proporcionados por el cliente.
Rechazar controles C0/C1 en todos los campos; no convertir caracteres visualmente similares ni aplicar NFKC al fiscal.
El país comprueba formato técnico: no certifica pertenencia a ISO ni soporte tributario. No añadir lista fiscal de países.
Email: dirección ASCII sin espacios, local-part de 1..64 caracteres en formato dot-atom (letras/dígitos y !#$%&'*+/=?^_`{|}~-; puntos sin inicio/final ni consecutivos), dominio con al menos dos etiquetas de letras/dígitos/guion, cada etiqueta 1..63, sin guion inicial/final. No quoted-local, direcciones IP, email internacional ni consulta DNS. Mantener mayúsculas recibidas tras trim.
Estas son reglas de entrada del proyecto, no verificación de entrega del correo.

Respuesta 201: CustomerDto directamente, sin envoltorio. Header Location: /customers/{id}.
CustomerDto contiene exactamente id, companyName, taxId, taxIdNormalized, contactEmail, countryCode, planCode, createdAt.
taxId corresponde al original recortado; taxIdNormalized al valor guardado por 002. Fecha UTC ISO-8601 con milisegundos.
El DTO no expone columnas ORM, metadatos DB ni simulaciones.

## Validación fiscal

Solo countryCode=ES activa validación algorítmica.

- Normalizar trim y mayúsculas preservando ceros iniciales.
- Para ES no retirar separadores: rechazar espacios interiores, guiones, puntos, prefijos de país y caracteres no ASCII.
- Alcance objetivo: DNI, NIE X/Y/Z, NIF de entidades y NIF especiales K/L/M. Clasificar por familias separadas; no tratar K/L/M como entidades.
- Un patrón solo clasifica formato; el carácter de control debe comprobarse mediante el algoritmo de esa familia.
- Tabla y fuentes de T01 en [fiscal-rules.md](fiscal-rules.md): DNI/NIE y K/L/M con módulo 23; entidades ABCDEFGHJUV numéricas y NPQRSW alfabéticas. Se documenta discrepancia de Eustat en K/L/M y se prioriza AEAT.
- T01 contrastada; no se afirma validación censal ni soporte de toda forma histórica. Se exige formato canónico de nueve caracteres y siete dígitos en K/L/M; límites descritos en fiscal-rules.md.
- Para no ES: longitud/presencia y ausencia de controles; conservar separadores y normalizar mayúsculas como 002. Sin aplicar algoritmo español ni afirmar validez internacional.
- Error de campo taxId con TAX_ID_INVALID. Un checksum válido no prueba existencia, titularidad o alta censal.

D02/D06 se heredan de 002; D03 se concreta con fuentes y fixtures independientes en esta implementación.

## Búsqueda y detalle

GET /customers acepta exclusivamente q, limit y offset, sin parámetros repetidos ni anidados.

- q: string, trim, 0..200, sin controles C0/C1. Vacío o ausente lista todos.
- limit: decimal de dígitos ASCII, entero 1..100, por defecto 20.
- offset: decimal de dígitos ASCII, entero 0..100000, por defecto 0.
- Rechazar signos, fracciones, notación exponencial, espacios o tipos estructurados; query inválida devuelve 400.
- Buscar substring literal OR sobre company_name y tax_id_normalized; nunca email, contacto ni plan.
- Escapar %, _ y el carácter de escape de LIKE; siempre usar parámetros SQL. Un intento de SQL injection se trata como texto.
- Nombre: semántica LIKE de SQLite, insensible a mayúsculas ASCII; no prometer case-fold Unicode ni búsqueda sin acentos. Fiscal: query a mayúsculas según la misma normalización.
- Orden created_at DESC, id DESC; total con los mismos filtros y antes de limit/offset. Count y página en una misma transacción de lectura.
- Respuesta 200: { items: CustomerDto[], total: number, limit: number, offset: number }. Sin coincidencias: items=[], total=0. Offset más allá del total conserva ese total y devuelve [].
- Orden estable para datos sin cambios; offset no garantiza continuidad ante altas entre peticiones.

GET /customers/:id exige UUID con el criterio ya usado en persistencia; mal formado 400, inexistente 404.
Respuesta 200: CustomerDto, sin historial de simulaciones.
Registros existentes se leen sin revalidar su checksum fiscal.

## Errores y límites HTTP

Envoltorio: { error: { code: string, message: string, requestId: string, fields?: Record<string, string> } }.
requestId generado por servidor con UUID; respuesta con X-Request-Id. Mensajes genéricos en español.
fields usa nombres del body y explica la regla, sin repetir valores recibidos.
No registrar cuerpos, queries, fiscal, emails ni nombres; log mínimo con requestId, método, estado y código. No usar ruta con ID/query ni mensajes SQL en logs.
No confiar en requestId externo.

| Estado | code                     | Situación                                                           |
| ------ | ------------------------ | ------------------------------------------------------------------- |
| 400    | INVALID_JSON             | JSON mal formado                                                    |
| 400    | INVALID_QUERY            | Parámetros de búsqueda inválidos                                    |
| 400    | INVALID_CUSTOMER_ID      | UUID inválido                                                       |
| 413    | PAYLOAD_TOO_LARGE        | Body supera 32 KiB                                                  |
| 415    | UNSUPPORTED_MEDIA_TYPE   | Alta sin application/json, admitiendo parámetros charset            |
| 422    | VALIDATION_ERROR         | Campos, estructura, email, país o plan incorrectos                  |
| 422    | TAX_ID_INVALID           | Fiscal ES no supera formato/control                                 |
| 404    | CUSTOMER_NOT_FOUND       | UUID válido no guardado                                             |
| 404    | ROUTE_NOT_FOUND          | Ruta no reconocida                                                  |
| 409    | CUSTOMER_TAX_ID_CONFLICT | UNIQUE país/fiscal concreto; no mapear cualquier UNIQUE a ese error |
| 503    | DATABASE_UNAVAILABLE     | Archivo no inicializado o DB no disponible para rutas de clientes   |
| 503    | DATABASE_BUSY            | SQLITE_BUSY, sin reintentar POST automáticamente                    |
| 500    | INTERNAL_ERROR           | Cualquier fallo inesperado, sanitizado                              |

Prioridad de alta: tipo de contenido, tamaño/JSON, estructura/campos, reglas fiscales, escritura.
Las restricciones inesperadas distintas del duplicado fiscal no se ocultan como 409.
Mantener GET /health con 200 y {"status":"ok"} sin DB; las rutas inexistentes conservan 404 y usan el envelope común.

## Conexión y arranque

createApp recibe dependencias opcionales; sin configuración de clientes, sus rutas devuelven 503 y health sigue funcionando.
En index.ts configurar un proveedor de conexión lazy usando DATABASE_PATH/DATABASE_KIND y openDatabase de 002. No usar migrateDatabase desde la API.
Abrir conexión al primer acceso válido que la requiera, mantenerla durante la vida del proceso y cerrarla en SIGINT/SIGTERM.
DB ausente no debe impedir arrancar ni crear archivos. Poder reintentar una consulta tras inicialización explícita, sin cachear para siempre un error de apertura.
Tests inyectan su conexión temporal; la app no la cierra porque no es su propietaria.

## Definición de completado

T01–T06 con pruebas reales y controles de 001/002 sin regresión.
Sin nuevas dependencias previstas: parsers específicos y tipos compartidos, no un framework de validación propio.
Contratos exactos, semántica fiscal respaldada y evidencias con límites. Aceptación humana separada del veredicto técnico.
