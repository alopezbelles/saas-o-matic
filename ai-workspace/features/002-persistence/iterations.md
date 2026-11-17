# 002 Persistence — Iteraciones del trabajo con IA


## Preparación del alcance y del modelo

La propuesta inicial dependía de un diccionario externo ausente y dejaba decisiones abiertas. Se solicitó aclarar el alcance; Codex concretó tecnología, modelo, planes demo y guardas dentro de la delegación recibida. Se confirmaron histórico EUR y prevención de duplicados.

Antes de implementar se pidió actualizar la documentación. El resultado fue un modelo canónico y una secuencia de trabajo delimitada; la autorización de ejecución llegó después de esa preparación. No se adelantaron endpoints, motor fiscal o interfaz.

## Compatibilidad del driver nativo

La versión más reciente del driver examinada declaraba compatibilidad de engines, pero no disponía del binario publicado para Windows y el ABI de Node utilizados. Codex seleccionó la versión compatible con asset disponible y comprobó que SQLite cargaba, sin instalar un toolchain del sistema. La incidencia mostró que revisar engines no bastaba para validar la dependencia nativa.

## Ajuste entre contratos, generador y SQL

La carga del schema por drizzle-kit desde CommonJS requirió ajustar la exportación del paquete compartido hacia su ESM compilado. También se corrigió la expresión del índice descendente con desc() de Drizzle.

El generador no expresaba por sí solo las garantías STRICT y los triggers requeridos. Se incorporó un finalizador idempotente para el SQL nuevo y un runner con hashes y transacciones. Se revisó el resultado generado, conservando el límite entre contratos compartidos y persistencia.

## Verificación de integridad y operación

Codex comprobó restricciones, snapshots y operaciones sobre archivos temporales, incluyendo conflictos y fallos deliberados. La validación documenta conservación del histórico, rollback de migraciones y seed, bloqueo finito y backup consistente. Los errores sanitizados se ajustaron para conservar su causa interna sin imprimirla en CLI.

El cierre registró persistencia y herramientas operativas sin inicializar la base del usuario ni introducir reglas fiscales. Los [resultados, incidencias y límites](../../../specs/002-persistence/validation.md) conservan la evidencia sin duplicarla aquí. No se acredita otra plataforma o equipo limpio y no consta aceptación humana final. Esta memoria no repite pruebas ni modifica bases de datos.
