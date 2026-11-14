# Validación 002

## Entorno y veredicto

14 de noviembre de 2026. Windows x64, Node 22.19.0 (ABI 127), pnpm 10.33.4.
Drizzle ORM 0.45.4; better-sqlite3 12.11.1 con SQLite 3.53.2; drizzle-kit 0.31.11; @types/better-sqlite3 9.6.0.
Veredicto: **CUMPLE TÉCNICAMENTE**. Aceptación humana de la entrega no registrada.

## Trazabilidad y resultados reales

| RF      | Tareas             | Casos ejecutados                           | Resultado |
| ------- | ------------------ | ------------------------------------------ | --------- |
| 002-RF1 | T01, T02, T05, T06 | IT-DB-01, IT-MIG-01, IT-RECOVERY-01        | CUMPLE    |
| 002-RF2 | T01, T02, T03, T06 | IT-CONSTRAINT-01, IT-SAFETY-01             | CUMPLE    |
| 002-RF3 | T03, T05, T06      | IT-SNAPSHOT-01, IT-BACKUP-01               | CUMPLE    |
| 002-RF4 | T04, T06           | IT-SEED-01                                 | CUMPLE    |
| 002-RF5 | T02, T04, T05, T06 | IT-SAFETY-01, IT-RECOVERY-01, IT-BACKUP-01 | CUMPLE    |

Salida conservada de la suite completa: [002-tests.txt](../../ai-workspace/testing/002-tests.txt).

## Comandos y salidas observadas

Ejecutados desde raíz con .tools/node_modules/.bin en PATH:

| Comando                                      | Resultado real                                                                     |
| -------------------------------------------- | ---------------------------------------------------------------------------------- |
| pnpm.cmd install --frozen-lockfile --offline | Código 0, cuatro workspaces, lockfile consistente y Already up to date             |
| pnpm.cmd format:check                        | Código 0, archivos con formato correcto                                            |
| pnpm.cmd lint                                | Código 0, sin errores ni warnings                                                  |
| pnpm.cmd typecheck                           | Código 0, shared/web/API y configuración Drizzle                                   |
| pnpm.cmd build                               | Código 0, tres paquetes; Vite 8.3.8 compila 15 módulos                             |
| pnpm.cmd db:generate                         | Código 0; No schema changes, nothing to migrate; no nueva migración                |
| pnpm.cmd test                                | Código 0; 21 pruebas: 17 integración, 1 web, 1 gates, 2 documentación; cero fallos |
| pnpm.cmd dev                                 | Web/API arrancaron desde raíz; HTTP 200 en web y health; detenidas con Ctrl+C      |

La primera instalación descargó dependencias con acceso autorizado; better-sqlite3 se reconstruyó con su instalador permitido en apps/api y descargó binario precompilado, sin instalar toolchain del sistema.
La comprobación inicial de better-sqlite3 13.2.0 encontró engine compatible pero no binario publicado para esta plataforma; se seleccionó 12.11.1 con asset node-v127-win32-x64.
Fuentes: [releases del driver](https://github.com/WiseLibs/better-sqlite3/releases/tag/v12.11.1), [API de backup](https://github.com/WiseLibs/better-sqlite3/blob/master/docs/api.md), [integración Drizzle](https://orm.drizzle.team/docs/sqlite/get-started-sqlite).

## Casos comprobados

- IT-DB-01: tablas STRICT, dos triggers, FK activa por conexión; cerrar/reabrir conserva cliente e historial; reaplicar deja datos e historial de migración iguales.
- IT-MIG-01: detecta hash cambiado; un lote que crea tabla e inserta antes de fallar revierte DDL/datos/historial. Una inicialización fallida retira exclusivamente su archivo recién creado; la siguiente inicialización funciona. Archivo ajeno permanece byte a byte igual.
- IT-CONSTRAINT-01: SQL directo rechaza FK inexistente, nulos, vacíos, plan desconocido, país/fecha mal formados, consumos negativos/fraccionarios/sobre máximo y texto incompatible. Los máximos coinciden con shared y se aceptan.
- Dinero: SQL rechaza negativos, fracciones, >MAX_SAFE_INTEGER, total incoherente, moneda distinta de EUR y JSON inválido/no array. MAX_SAFE_INTEGER se conserva.
- Duplicados: países distintos y nombres/emails repetidos se permiten. Dos procesos concurrentes con una misma clave fiscal solo aceptan una escritura.
- IT-SNAPSHOT-01: round-trip exacto, validación de claves/tipos/productos/sumas, cero usuarios y límites seguros. Snapshots se recuperan del cliente, ignorando campos forjados. Cambios posteriores del cliente no alteran histórico; UPDATE/DELETE y borrado del cliente referenciado se rechazan.
- IT-SAFETY-01: rechaza rutas vacías, URI, fuera del proyecto/área temporal, código/web, alias por junction y hardlinks. Contexto test requerido. Centinelas no cambian.
- IT-SEED-01: dos clientes ficticios, cero simulaciones; segunda ejecución idéntica; conserva filas ajenas. Conflicto de fixture o clave fiscal aborta sin sobrescribir; conflicto en segundo fixture revierte también la primera inserción.
- IT-RECOVERY-01: bloqueo competidor devuelve SQLITE_BUSY tras aproximadamente 1,2 s, sin filas parciales; tras liberar bloqueo una escritura funciona.
- IT-BACKUP-01: driver genera copia consistente que supera integrity_check/FK y devuelve snapshots exactos; bytes de origen sin cambios. Rechaza destino existente e igual al origen.
- CLI: demo:init/seed/migrate operan solo sobre archivos temporales preparados por tests. Opciones inválidas devuelven 1 con códigos sanitizados, sin PII.
- pnpm db:backup --out con ruta con espacios se ejecutó realmente desde raíz; compiló shared/API y reenvió argumentos correctamente.
- Arranque manual: GET /health devolvió 200 con {"status":"ok"}, web 200; apps/api/data no se creó.
- Las suites previas HTTP/web/gates siguen pasando. El test documental ahora recorre ambas specs y comprueba comandos DB.

## Revisión de implementación

- Ningún archivo de producción supera 300 líneas. Se revisó cohesión de las dos suites SQLite de más de 300 líneas: una agrupa esquema/integridad/snapshots y otra operación/seguridad/backup; fixtures compartidos separados.
- ORM y SQL quedan en backend; shared no exporta Drizzle. No endpoints ni lógica tarifaria/fiscal nuevos.
- El runner de migraciones es explícito y transaccional con hash, en lugar de confiar solo en timestamps.
- El finalizador añade STRICT/triggers al SQL nuevo y conserva archivos ya finalizados; revisar SQL antes de migrar.
- SQLite STRICT permite coerciones numéricas exactas; validación de tipos y estructura también existe en persistencia.
- Docs canónicas, contexto e instrucciones actualizados. El diccionario no se duplica en docs/data-model.md.

## Incidencias resueltas y límites

- ESLint exigió conservar la causa al sanitizar errores de propietario: se añadió cause sin imprimirla en el CLI; lint y suite completa volvieron a pasar.
- drizzle-kit carga schemas desde CommonJS: se añadió export default de shared hacia su ESM compilado, compatible con Node 22.
- El índice descendente usa desc() de Drizzle. La comprobación nativa confirmó el binario cargado.
- Se detectó y corrigió una pérdida de acentos al editar documentación mediante un pipe de PowerShell; la escritura final usa UTF-8 directo.
- npm informó de subdependencias obsoletas prebuild-install y esbuild-kit, transitivas de las herramientas elegidas; no se añadieron alternativas para ocultar esos avisos.
- No se prueba otro sistema operativo, equipo limpio, UI de negocio ni política fiscal real.
- No se ha inicializado la base development/demo del usuario; todos los datos de validación eran temporales y se retiraron al cerrar conexiones.
- No commits/pushes ni cambios de remoto. No se registra aceptación humana.
