# 010-T04 — Revisión de contenido y preparación externa

17 de noviembre de 2026, base cca1373 inicialmente limpia. [Instrucción previa de elaboración](../../specs/010-delivery/plan.md#t04--preparación-externa-revisable), [presentación de entrega vigente](../../README.md#limitaciones-y-entrega) y [resultado de escaneo](010-delivery-t04-scan.json). Registro actual, no retrospectiva de una publicación.

## Método y alcance

Inventario git ls-files de solo lectura y SHA-256 del inventario de rutas/contenido. Texto: cabeceras de clave privada, formas de tokens GitHub/AWS/Slack/OpenAI y URLs con autenticación. Se registran archivo/línea/tipo de hallazgo, nunca su valor. También se clasifican archivos que deberían quedar excluidos, cabeceras SQLite, rutas locales y candidatos de email fuera de dominios de ejemplo. No se contacta al remoto ni se examina el historial completo; la URL origin se limita a formato GitHub sin credenciales.

Escaneo base: 407 archivos, 378 texto y 29 binarios; cero coincidencias de patrones de credenciales, cero archivos excluidos versionados y cero cabeceras SQLite. Se detectan rutas locales en 22 documentos/logs históricos. Un candidato de email en customers-contract.test.mjs se revisa y corresponde a un caso de email inválido esperado. No es una validación de que no pueda existir ningún secreto o dato personal.

Las rutas locales no se sustituyen silenciosamente en los registros históricos. Este registro deja su tratamiento como decisión explícita antes de publicar. No se ejecutan OCR o revisión visual exhaustiva de binarios; T01 conserva la inspección de cuatro capturas actuales. No se distribuyen PDF externos, DB o secretos por el hecho de tener un remoto configurado.

## Condiciones de despliegue revisadas por código

API ligada a 127.0.0.1, PORT configurable y variables DB consumidas por CLI/API. Proxy /api de Vite es desarrollo; estático requiere fallback SPA y proxy real. SQLite solo bajo rutas admitidas y con volumen persistente para conservar datos. Backup a archivo nuevo con driver, restauración manual fuera del alcance actual. Sin hosting elegido, autenticación de aplicación, cambio HOST o prueba de CORS de producción. La guía enumera requisitos, no demuestra un despliegue.

## Organización vigente tras revisión de Alex

Alex elimina el documento de entrega separado y establece README y ai-workspace como recorrido del evaluador. Se conservan aquí los resultados técnicos, sin recrear ese archivo. El README contiene instalación, necesidades, decisiones, uso de IA, capturas y condiciones de despliegue; el índice de ai-workspace permite seguir las evidencias.

Contenido previsto: fuente apps/packages, lockfile y workspaces, dotfiles/configuración necesarios, migraciones/tests, docs/specs, directrices del proyecto y evidencias pertinentes. Se excluyen .env reales, DB/backups, dependencias, compilaciones, cachés, configuración personal y PDF externos no autorizados. No se genera paquete ni se publica desde esta revisión.

Origin leído localmente: https://github.com/alopezbelles/saas-o-matic.git. Visibilidad, acceso del evaluador y sincronización no comprobados. Antes de publicar, decidir tratamiento de rutas locales de los 22 archivos señalados, revisar el historial con el alcance necesario y confirmar contenido/revisión/destino. No hay auditoría exhaustiva de historia Git ni afirmación de ausencia absoluta de secretos.

Despliegue futuro: servir SPA/rutas directas y /api con un proxy real; Vite solo resuelve ese proxy en desarrollo. API en loopback, variables PORT/DATABASE_PATH/DATABASE_KIND sin carga automática .env y SQLite persistente dentro de rutas permitidas. Backup mediante driver a archivo nuevo y restauración manual con conexiones detenidas y autorización. No se ha probado restore o volumen de producción. La aplicación no tiene autenticación; una demo pública exige decidir acceso y aislamiento con datos ficticios, sin exponer datos reales. CORS del proveedor FX debe comprobarse en el destino futuro. No se elige hosting o se cambia infraestructura.

## Comprobación documental

Solo controles documentales tras preparar contenido y registro; resultados en [validación T04](../../specs/010-delivery/validation.md#t04--preparación-externa-revisable). No repetir suites de producto para este cambio ni atribuir las pruebas 276/36 de T03 como ejecución nueva. No se modifica código, DB existente, remoto, visibilidad o historial. T05 y aceptación humana pendientes.

Veredicto T04: CUMPLE TÉCNICAMENTE como preparación revisable. Dos pruebas documentales correctas, con hallazgos y acciones externas explícitos. La revisión no declara que el contenido esté aprobado para publicar ni que el historial completo esté libre de secretos.
