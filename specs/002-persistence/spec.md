# 002 — Esquema, migraciones y seed

## Estado y fuente

Especificación concretada con Alex e implementación autorizada después mediante «perfecto, desarrolla la spec».
La implementación incluye dependencias y bases temporales de validación; no operar sobre datos preexistentes del usuario.
Las decisiones delegadas y aceptadas se registran en [clarifications.md](clarifications.md).
No se atribuyen R02/R06/N02/N04/N05/N08 a una fuente oficial ausente.

## Objetivo y alcance

Preparar almacenamiento SQLite para futuros clientes y simulaciones: esquema, conexión, migraciones, seed y pruebas.
Como comercial quiero que los datos guardados sobrevivan a reinicios.
Depende de la infraestructura [001](../001-foundation/spec.md): pnpm, Node 22, TypeScript estricto y ESM.
Tecnología elegida: Drizzle ORM y better-sqlite3. Pruebas con node:test y bases SQLite reales temporales.

## Requisitos y aceptación

- **002-RF1**: Al inicializar una base vacía mediante comando explícito, se crea el esquema versionado. Reaplicar migraciones no modifica datos ni repite migraciones; cerrar y reabrir conserva datos.
- **002-RF2**: Ante referencias inexistentes, duplicados fiscales por país, tipos o valores fuera de restricciones, la base rechaza la escritura. Cada conexión activa y verifica foreign_keys. Tests no pueden abrir la base de desarrollo.
- **002-RF3**: Al persistir una simulación, se conservan céntimos EUR enteros, consumos, desglose, contexto y versiones. La lectura no recalcula ni consulta datos externos; posteriores cambios del cliente no alteran sus snapshots.
- **002-RF4**: Al ejecutar el seed en una base marcada explícitamente como demo, se insertan fixtures ficticios deterministas. Reejecutarlo no duplica, sobrescribe ni elimina datos; cualquier conflicto revierte la transacción.
- **002-RF5**: Ante ruta insegura, bloqueo o fallo de migración, el comando termina con código no cero, cierra conexiones e informa sin exponer datos personales. No reintenta escrituras indefinidamente ni realiza borrados automáticos.

## Decisiones de producto cerradas para persistencia

- Planes DEMO_BASIC y DEMO_PRO; son códigos comerciales sin diferencias tarifarias.
- users: entero 0..1000; storageGb: entero 0..10000; apiCalls: entero 0..10000000.
- Son guardas iniciales del proyecto, iguales para ambos planes; no son requisitos oficiales ni cuotas comerciales.
- Histórico solo EUR: sin moneda de visualización ni tasa FX persistida.
- UNIQUE(country_code, tax_id_normalized). Nombre y email admiten repetición.
- Los consumos y el catálogo se declaran una vez en packages/shared y se reutilizan para generar las restricciones SQL. El SQL versionado materializa esos valores; las pruebas detectan divergencias.

## Diccionario vinculante

Este apartado es la fuente del modelo de 002. docs/data-model.md enlaza aquí sin duplicar este diccionario.
Columnas snake_case en SQL; propiedades camelCase en TypeScript. Ningún tipo ORM se exporta desde packages/shared.

### Convenciones

- Tablas de aplicación STRICT, con NOT NULL salvo excepción explícita. No aceptar coerciones que pierdan información; SQLite puede convertir representaciones numéricas exactas compatibles con STRICT.
- IDs TEXT con UUID generado por Node; fixtures con UUID fijos. Validar formato en la frontera de persistencia.
- Fechas TEXT UTC ISO-8601 con milisegundos, formato YYYY-MM-DDTHH:mm:ss.sssZ. Validación de fecha real en persistencia; la base comprueba forma/longitud.
- Texto recortado, no vacío y con longitud máxima según tabla; la base comprueba longitud y ausencia de espacios exteriores.
- País: dos letras ASCII mayúsculas. Esto comprueba formato, no pertenencia a un catálogo de países soportados ni política fiscal.
- Identificador normalizado: trim y mayúsculas, conservando ceros iniciales y separadores internos. No implementar checksum fiscal ni cambiar la política de separadores de D03.
- Todos los importes: INTEGER entre 0 y Number.MAX_SAFE_INTEGER (9007199254740991). No REAL para dinero.

### customers

| Columna           | Tipo y restricciones                                                                 |
| ----------------- | ------------------------------------------------------------------------------------ |
| id                | TEXT, PK UUID                                                                        |
| company_name      | TEXT, 1..200                                                                         |
| tax_id_original   | TEXT, 1..64; conserva escritura recortada del identificador                          |
| tax_id_normalized | TEXT, 1..64; trim y mayúsculas; debe coincidir con la normalización del original     |
| contact_name      | TEXT, 1..200                                                                         |
| contact_email     | TEXT, 1..254; no único; validación de formato de alta queda para la spec de clientes |
| country_code      | TEXT, dos letras ASCII mayúsculas                                                    |
| plan_code         | TEXT, DEMO_BASIC o DEMO_PRO                                                          |
| created_at        | TEXT, fecha UTC según convenciones                                                   |

UNIQUE(country_code, tax_id_normalized) resuelve concurrencia en la base; no sustituirlo por un SELECT previo.
La normalización Unicode se comprueba en TypeScript, sin depender de upper() de SQLite para caracteres no ASCII.
No hay updated_at ni endpoints de edición en 002.

### simulations

| Columna                | Tipo y restricciones                                                        |
| ---------------------- | --------------------------------------------------------------------------- |
| id                     | TEXT, PK UUID                                                               |
| customer_id            | TEXT, FK a customers.id; ON DELETE RESTRICT, ON UPDATE RESTRICT             |
| users                  | INTEGER, 0..1000                                                            |
| storage_gb             | INTEGER, 0..10000                                                           |
| api_calls              | INTEGER, 0..10000000                                                        |
| currency               | TEXT, CHECK igual a EUR                                                     |
| base_cents             | INTEGER monetario seguro                                                    |
| tax_cents              | INTEGER monetario seguro                                                    |
| total_cents            | INTEGER monetario seguro; CHECK total_cents = base_cents + tax_cents        |
| customer_name_snapshot | TEXT, 1..200                                                                |
| tax_id_snapshot        | TEXT, 1..64; identificador normalizado en el instante de guardado           |
| country_code_snapshot  | TEXT, dos letras ASCII mayúsculas                                           |
| plan_code_snapshot     | TEXT, DEMO_BASIC o DEMO_PRO                                                 |
| pricing_version        | TEXT, 1..64                                                                 |
| tax_policy_version     | TEXT, 1..64                                                                 |
| tax_rate_bps           | INTEGER, 0..10000; guarda técnica 0..100%, no define la tasa de ningún país |
| breakdown_json         | TEXT JSON válido, array con la estructura indicada debajo                   |
| created_at             | TEXT, fecha UTC según convenciones                                          |

Índice de historial: (customer_id, created_at DESC, id DESC).
Sin cascadas destructivas. Las simulaciones son append-only: triggers rechazan UPDATE y DELETE ordinarios.
Una migración futura que cambie esa protección requiere revisión explícita; no se ofrecen métodos de edición/borrado.

Cada entrada de breakdown_json contiene exactamente:

- tierFrom: entero >=1; tierTo: entero >=tierFrom o null para tramo abierto.
- quantity: entero >0 y <=1000.
- unitPriceCents y subtotalCents: enteros monetarios seguros.

Todos los números del desglose deben ser enteros seguros de JavaScript. La base verifica JSON válido y tipo array. La frontera de persistencia valida estructura, claves, tipos, rangos, subtotal = quantity * unitPriceCents, suma de cantidades = users y suma de subtotales = base_cents.
Para users=0: desglose [] y base_cents=0.
Usar operaciones enteras seguras/BigInt para comprobar productos y sumas; no se calcula una tarifa nueva ni un impuesto en 002.
El guardado toma snapshots del cliente recuperado en la misma transacción; no confía en snapshots proporcionados externamente.
Las versiones y la tasa deben acompañar al resultado calculado por el futuro backend; no se elige una política fiscal en esta spec.

### app_metadata e historial de migraciones

app_metadata: key TEXT PK y value TEXT NOT NULL, tabla STRICT.
Claves iniciales: schema_owner=saas-o-matic, database_kind=development o demo; tests usan test.
El historial de migraciones lo administra el migrador; no exponerlo en contratos compartidos.
Una marca demo no constituye una barrera de seguridad frente a quien pueda editar directamente el archivo.

## Seed

Dos clientes claramente ficticios: DEMO_BASIC y DEMO_PRO, nombres con prefijo DEMO y emails bajo example.invalid.
UUID y fechas fijos, país ES como dato de fixture, identificadores DEMO-001 y DEMO-002; no afirmar que son NIF válidos.
No insertar simulaciones en el seed: así no se introduce una política fiscal ficticia. Los tests de snapshots usan sus propios fixtures identificados como técnicos.
La primera inserción es transaccional. Si ya existe un ID de fixture con los mismos campos, no hace nada; si difiere o su clave fiscal pertenece a otro ID, falla sin tocar filas.
Datos ajenos sin conflicto permanecen intactos.

## Fuera de alcance

API/UI de clientes o simulaciones, validación fiscal completa, motor de precios/impuestos, FX, tabla editable de planes, tablas fiscales, repositorios genéricos, servicios externos, despliegue y rollback destructivo.
No conectar la base al arranque de /health ni convertirlo en una comprobación de persistencia.
No migrar ni sembrar archivos existentes del usuario como parte de la implementación o de sus tests.

## Definición de completado

T01–T06 con evidencia real de [validation.md](validation.md), pruebas automatizadas de cada RF y controles de 001 sin regresiones.
Compatibilidad y binario nativo verificados antes de instalar versiones elegidas.
Instrucciones operativas, backup y límites documentados. Conformidad técnica y aceptación humana se registran por separado.
