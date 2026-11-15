# Plan 003 — API de clientes sobre persistencia 002

Fase actual: implementación autorizada; resultados reales en validation.md.
Contratos y aceptación en [spec](spec.md); decisiones y gate fiscal en [clarifications](clarifications.md).

## Arquitectura y responsabilidades

- packages/shared/src/customers.ts (nuevo): tipos DTO/body/query/error y parsers específicos de entrada, sin importar ORM ni crear un sistema genérico de schemas.
- packages/shared/src/index.ts (existente): exports del contrato; mantener planes/límites existentes.
- apps/api/src/features/customers/domain/tax-id.ts (nuevo): clasificar y verificar fiscal como función pura, sin DB/HTTP/React.
- features/customers/service.ts (nuevo): caso de uso, normalización/reglas fiscales y coordinación; sin SQL.
- features/customers/repository.ts (nuevo): adaptador sobre insertCustomer/getCustomer de db/persistence.ts; queries de búsqueda/count con Drizzle parametrizado. Único lugar nuevo con acceso SQL.
- features/customers/routes.ts y controller.ts (nuevos): rutas, parseo y mapeo HTTP; no lógica fiscal/SQL.
- apps/api/src/http/errors.ts (nuevo): envelope, parser errors y requestId; sin exponer errores internos.
- apps/api/src/db/provider.ts (nuevo): proveedor lazy para index.ts; utiliza openDatabase y rutas/guardas existentes.
- apps/api/src/app.ts e index.ts (existentes): inyección y lifecycle, sin migración al arrancar.
- apps/api/test/tax-id.test.mjs y customers.test.mjs (nuevos): node:test sobre código compilado; fixtures independientes en test/tax-id-fixtures.mjs.
- Manifests/scripts y documentación: solo cambios necesarios; no nuevas dependencias ni paquetes.

Los archivos nuevos son entregables previstos, no referencias a documentación ya existente.
No mover ni duplicar lógica de 002 por anticipación: insertar/leer un cliente reutiliza sus funciones. La futura reorganización de persistencia solo se hará si existe necesidad concreta y conservando regresiones.

## Secuencia

1. Contrastar fuentes y fijar tabla fiscal/fixtures. No copiar oráculos de la función que se prueba.
2. Crear contrato/shared y parsers concretos; el catálogo viene de persistence-contracts.
3. Implementar dominio fiscal y servicio de alta; semántica de separadores explícita para ES y no ES.
4. Añadir repositorio de búsqueda/detalle y adaptador de inserción existente.
5. Añadir HTTP, requestId, errores y proveedor DB lazy; mantener health sin DB.
6. Integración real con conexiones inyectadas y concurrencia; cierre documental con evidencia.

## Alta

Tipo JSON y límite de body → parseo/forma/campos → trim y normalización → algoritmo ES → insertCustomer → DTO explícito.
La unicidad la decide SQLite. Evitar check-then-insert como mecanismo de exclusión.
Mapear solo conflicto de índice customers_country_tax_unique o columnas equivalentes verificadas a 409; el resto se sanitiza sin asumir duplicado.
Generar UUID/fecha con persistencia existente; no aceptar atributos internos del cliente HTTP.
Un fallo de validación no abre conexión ni escribe filas.

## Lista y detalle

Validar query e ID antes de consultar. Construir SQL parametrizado y escapar LIKE con carácter de escape explícito.
Aplicar mismo filtro en count y página, dentro de transacción de lectura.
Orden fijo created_at DESC/id DESC; limit/offset conforme contrato. Mapear filas a DTO con allowlist.
No consultar email ni exponer datos de simulaciones.
Conservar lectura de datos demo de 002 aunque su fiscal no pase la validación nueva.

## Integración con conexión

createApp({ customers: dependencias }) monta rutas; ausencia de dependencias produce 503 en rutas válidas de clientes.
index.ts construye proveedor lazy con DATABASE_PATH/DATABASE_KIND; solo development/demo en runtime normal.
El proveedor utiliza openDatabase y deja propagar fallos para mapearlos; no desactiva las guardas.
Un archivo ausente produce 503 y puede reintentarse después de una inicialización explícita mediante CLI.
No inicializar ni migrar desde el servidor. Inyección test con createTestContext de 002; no DB de desarrollo.
SIGINT/SIGTERM cierra servidor y conexión propia; crear aplicación de test no instala listeners globales.
Los parsers JSON/límites deben afectar endpoints de clientes sin convertir health en dependiente del body de otras rutas.
Mantener fallback 404 en envelope; pruebas HTTP antiguas no deben exigir HTML del fallback de Express.

## Pruebas

Conservar node:test y API compilada. Añadir test:unit con casos fiscales/contrato reales y test:integration para HTTP+DB.
API test:integration debe seleccionar explícitamente archivos HTTP/DB existentes y customers.test.mjs; test:unit selecciona tax-id.test.mjs y, si se separa, customers-contract.test.mjs.
Actualizar root test para ejecutar ambas sin duplicar pruebas ni usar passWithNoTests.
test:integration compila shared/API como hoy. test:unit también compila antes de importar dist.
No introducir Vitest, Zod o Supertest por copiar herramientas de la plantilla.
Casos y trazabilidad detallados en [validation](validation.md).

## Sincronización al implementar

Actualizar README, docs/api-contracts.md, business-rules.md (D03 con fuentes), decisions.md, testing.md, traceability.md, MEMORY y estado de la spec.
En ai-workspace registrar las iteraciones futuras pertinentes según harness cuando se autorice la implementación; no registrar ahora estos mensajes.
No modificar migraciones aplicadas ni crear evidencias anticipadas. Se añade 0001_optional_contact para el campo no exigido por el enunciado; reconstrucción transaccional con FK activas, defer_foreign_keys y comprobación final de integridad antes de liberar contadores diferidos.

## Riesgos y criterios de parada

- Tabla fiscal incompleta: resolver T01 antes de afirmar cobertura.
- Tipos/checks de 002 no sustituyen validación HTTP ni validación fiscal.
- Name LIKE no ofrece búsqueda Unicode sin acentos; declararlo y probarlo.
- Errores SQL pueden contener PII; no imprimir sus mensajes ni cause en logs/respuestas.
- SQLite es síncrono; no añadir retries infinitos, índices nuevos o abstracciones sin necesidad medida.
