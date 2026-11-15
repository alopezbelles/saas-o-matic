# Validación 003 — Clientes API

## Resultado

**CUMPLE TÉCNICAMENTE**. T01–T06 completadas; aceptación humana de entrega no registrada.
Trabajo iniciado el 14 y cierre documental el 15 de noviembre de 2026 (Europe/Madrid). Windows x64, Node 22.19.0 y pnpm 10.33.4.
Base Git observada al cierre: 786d7e0; implementación actual en working tree, sin commit del agente.

## Controles ejecutados

| Comando                                      | Resultado real                                                |
| -------------------------------------------- | ------------------------------------------------------------- |
| pnpm.cmd test:unit                           | 0; tres grupos de pruebas de contrato y fiscal                |
| pnpm.cmd test:integration                    | 0; 25 pruebas, incluidas regresiones de 001/002               |
| pnpm.cmd test                                | 0; 32 pruebas: unit 3, integración 25, web 1, gates 1, docs 2 |
| pnpm.cmd lint                                | 0; sin errores/warnings                                       |
| pnpm.cmd typecheck                           | 0; shared/web/API y configuración Drizzle                     |
| pnpm.cmd build                               | 0; tres paquetes, Vite compila 15 módulos                     |
| pnpm.cmd db:generate                         | 0; no cambios adicionales de schema                           |
| pnpm.cmd install --frozen-lockfile --offline | 0; lockfile consistente, sin nuevas dependencias              |
| pnpm.cmd dev                                 | Web/API arrancan desde raíz; detenidas con Ctrl+C             |

Salida conservada: [003-tests.txt](../../ai-workspace/testing/003-tests.txt).
Cierre documental: pnpm.cmd format:check devuelve 0; pnpm.cmd test:docs devuelve 0 con dos pruebas; git diff --check devuelve 0. No equivalen a tests funcionales adicionales.

## Trazabilidad y evidencia

| RF      | Tareas   | Casos ejecutados                           | Resultado |
| ------- | -------- | ------------------------------------------ | --------- |
| 003-RF1 | T02..T06 | UT-CONTRACT-01, IT-CUS-01, IT-MIG-003      | CUMPLE    |
| 003-RF2 | T01..T06 | UT-FISC-01, IT-INVALID-01                  | CUMPLE    |
| 003-RF3 | T02..T06 | IT-CUS-03                                  | CUMPLE    |
| 003-RF4 | T02..T06 | IT-DUP-01                                  | CUMPLE    |
| 003-RF5 | T02..T06 | IT-HTTP-01, IT-LIFECYCLE-01, IT-PRIVACY-01 | CUMPLE    |

### Casos comprobados

- Cinco campos de alta y rechazo de contactName/atributos internos extra. 201, Location, DTO exacto y GET con igualdad.
- NFC, trim, mayúsculas fiscales, ceros iniciales, email y límites. Rechazo de IP como dominio y de longitud normalizada fiscal excesiva.
- Fiscal: fixtures independientes para DNI, NIE X/Y/Z, K/L/M y cada prefijo de entidades, minúsculas y negativos de formato/control.
- Validación errónea no abre DB ni crea filas. 422 fiscal y de campos; 400 JSON/query/UUID, 413 tamaño, 415 tipo de contenido.
- 409 de país/fiscal específico; carrera HTTP con 201/409 y una fila. Otro UNIQUE no se mapea como duplicado fiscal.
- Búsqueda literal de %, _ y escape, inyección como texto, exclusión de email, orden/página/total y offset más allá del resultado.
- Cliente inexistente 404 y fallback envelope; requestId generado por servidor, header coherente e ID externo ignorado.
- Logs y respuestas sin valores sintéticos sensibles, SQL, stack o ruta dinámica.
- DB ausente/no actualizada produce 503. Reintento posterior funciona tras migración explícita temporal. SQLITE_BUSY 503 sin fila parcial.
- /health no depende de DB; createApp no añade listeners globales ni cierra conexión inyectada.
- Proceso hijo abre conexión real y la cierra al manejar un evento SIGTERM simulado; salida 0 y cierre del driver observado.
- Migración desde 0000 con contacto guardado y simulación relacionada conserva ambos, mantiene FK activa y permite contacto nulo.
- Grafo final inválido en migración provoca rollback; triggers históricos siguen protegiendo simulaciones.
- Seed anterior sigue legible sin revalidar fiscales demo.
- Regresiones de persistencia, HTTP, web y fallos deliberados de controles siguen pasando.

## Incidencias y decisiones

Se detectó fallo de FK al reconstruir tabla padre con simulaciones existentes. Se difiere la comprobación, se valida el grafo con foreign_key_check/integrity_check y se liberan contadores diferidos antes del commit; foreign_keys permanece ON. El caso de grafo inválido impide ocultar una infracción.
Se corrigió el contrato de seis campos de la preparación: el enunciado exige cinco. No se inventa nombre de contacto ni se pierden valores previos; nueva migración 0001_optional_contact, sin alterar 0000.
D03 se documenta con [fuentes y discrepancias](fiscal-rules.md); se prioriza nota AEAT para K/L/M y tipos de control.

## Arranque manual

pnpm dev ejecutado con DATABASE_PATH apuntando a un archivo ausente dentro de .cache, distinto de cualquier DB del usuario.
GET /health: 200 {"status":"ok"}. Web: 200. GET /customers: 503 DATABASE_UNAVAILABLE. No se creó el archivo.
Los procesos se interrumpieron expresamente al terminar; no se representa Ctrl+C como salida espontánea con código 0.

## Límites y revisión

- No censo/titularidad, formatos fiscales históricos fuera del formato canónico ni reglas tributarias de precios.
- K/L/M numérico y NIE de nueve caracteres; no se afirma soporte de toda representación histórica.
- Señal simulada dentro del proceso hijo: no se acredita entrega de SIGTERM real por el sistema operativo Windows.
- No navegador, UI de clientes, otro SO ni equipo limpio. Búsqueda case-insensitive ASCII, sin promesa de eliminar acentos.
- No POST /simulations, cálculo por tramos ni impuestos en 003.
- Bases temporales propias; no apertura/migración de datos existentes del usuario. No dependencias nuevas.
- Sin commits/pushes ni cambios de remoto. 0000 y log histórico 002 comprobados sin cambios.

## Registro del trabajo

[Instrucción técnica previa](../../ai-workspace/prompts/003-customers-api.md), [iteración](../../ai-workspace/iterations/003-customers-api.md), [ADR](../../ai-workspace/decisions/ADR-004-customers-api.md), [revisión técnica](../../ai-workspace/reviews/003-customers-api.md).
No se registran los mensajes de análisis/adaptación que Alex excluyó.
