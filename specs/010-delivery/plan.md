# Plan 010 — Documentación, auditoría y entrega

T01–T02 completadas técnicamente por indicación de Alex; T03–T05 pendientes. La instrucción de preparación siguiente conserva su alcance histórico. T02 autoriza actualizar ai-workspace sin reproducir mensajes excluidos. Usar [aclaraciones](clarifications.md) para decisiones pendientes.

## Instrucción de preparación

17 de noviembre de 2026, antes de implementar: adaptar los cinco documentos a 001–009 y al README solicitado por Alex. Definir contenido arquitectónico, necesidades, proceso SDD, procedencia Codex/ChatGPT Work con Product, capturas reales y criterios de entrega reproducible. Eliminar referencias de plantilla sin fuente. Conservar decisiones demo/hosting pendientes, exclusión ai-workspace y controles sin resultados anticipados.

## T01 — README como entrada a la entrega

Instrucción previa de ejecución T01 (17 de noviembre de 2026): implementar demo:setup con destino explícito/kind demo y creación exclusiva mediante withNewDatabase; aplicar migraciones y poblar tres clientes/simulaciones por servicios y parsers existentes. Probar resultado persistido y rechazo de archivos existentes/rutas inseguras en contextos temporales, sin tocar dev.sqlite. Reestructurar README según spec, corregir .env.example, sincronizar memoria/gate a 010 y capturar cuatro pantallas con entorno Playwright temporal. Ejecutar controles de código e integración afectados y comprobaciones documentales. Mantener T02–T05, ensayo limpio y ai-workspace pendientes.

Actualización posterior a la instrucción inicial: Alex confirma C04/C05, demo local completa y entrega mediante instalación local/repositorio. La referencia anterior a decisiones pendientes conserva la secuencia de preparación; ambas están ahora resueltas.

T01 incluye un comando separado del seed de 002 para crear una DB demo nueva con tres clientes ficticios y una simulación por cliente. Exigir destino nuevo bajo las rutas permitidas; reutilizar reconocimiento de propietario/demo, migraciones y servicios de clientes/simulaciones con precios calculados, sin duplicar SQL o lógica monetaria. Consumir únicamente planes/países configurados, consumos moderados dentro de límites e identificadores fiscales de fixture válidos. Sin .env real, API pública adicional, FX o dependencias nuevas. Mantener intacto el seed histórico y documentar cómo iniciar API/web usando esa DB. El comando no hará reset ni sobreescritura; probar destino existente, contenido persistido, importes/versiones y conservación de DB ajena con recursos temporales. La aceptación del ensayo global corresponde a T03.

Reestructurar README.md existente con índice, contexto/recorrido, necesidades, arquitectura, decisiones y consecuencias, proceso SDD/IA, inicio rápido y validación/límites. Incluir tabla necesidad→solución→spec/evidencia. Vincular docs/architecture.md, decisions.md, data-model.md, api-contracts.md y validaciones; evitar duplicar contratos completos o transcribir el enunciado.

Explicar decisiones relevantes enumeradas en spec.md desde el código y sus registros: tecnología, capas, dinero, histórico, FX, estilos, navegación, pruebas y restricciones. Diferenciar decisión explícita de Alex, decisión técnica delegada y explicación retrospectiva del estado implementado. No presentar el scaffolding 001 como precedido íntegramente por una spec cuando su retrospectiva indica otra secuencia.

Documentar requisitos exactos de engines y packageManager, instalación frozen-lockfile, dependencia nativa better-sqlite3, inicialización SQLite explícita, variables usadas por CLI y API, ausencia de carga automática .env, proxy /api de desarrollo y necesidad de resolver API/SPA en un despliegue futuro. Corregir la explicación errónea de .env.example sobre variables DB solo usadas por comandos, incluido su texto dañado, si se modifica ese ejemplo. No tocar .env real.

Seleccionar capturas de listado, alta, ficha/historial y simulador mediante Chromium existente, datos/servidores temporales. Guardar imágenes revisadas en docs/images, solo cuando se generen; no crear carpetas vacías. Se pueden reutilizar capturas existentes únicamente si siguen representando la aplicación actual y su contexto está comprobado. No añadir dependencias o herramientas visuales para esta tarea.

## T02 — Auditoría enlazada y procedencia

Instrucción previa de ejecución T02 (17 de noviembre de 2026): la petición de ejecutar T02 autoriza escribir los registros previstos en ai-workspace. Actualizar su recorrido actual sin alterar la procedencia histórica; enlazar instrucciones canónicas previas y crear síntesis retrospectivas de implementación 008/009/010-T01 a partir de sus validaciones y artefactos disponibles. No reproducir mensajes de análisis/adaptación expresamente excluidos ni inventar prompts o aceptación humana. Resolver afirmaciones operativas obsoletas sobre fuentes, CORS y capturas. Conservar evidencia mediante enlaces/versiones, documentar límites de logs efímeros y verificar índice/enlaces/formato sin repetir suites de producto por este cambio documental.

Solo tras autorización para escribir ai-workspace: revisar índice y registros pertinentes, incorporar enlaces a 008/009 y 010 y resolver afirmaciones operativas obsoletas sobre CORS, fuentes y capturas. Conservar resultados históricos como históricos y hacer visible el estado actual. No reescribir retrospectivas como conversaciones originales. Resumir desde validaciones y artefactos conservados; si falta una salida o captura, no inventarla ni afirmar conservación. Respetar exclusión de prompts que Alex haya mantenido fuera del registro.

## T03 — Ensayo reproducible

Identificar versión fuente y modificaciones incluidas. Preparar copia aislada bajo .cache dentro del proyecto, sin node_modules, .tools, .cache heredados, .env reales, DB/backups o secretos; mantener dotfiles necesarios como .npmrc y configuración. No copiar recursivamente la propia carpeta de destino. Verificar destino absoluto dentro del área temporal antes de cualquier limpieza y borrar solo recursos propios. Una copia/exportación limpia no es un clon remoto: documentar método y limitación. No modificar .git ni requerir commit/push para el ensayo.

Seguir exclusivamente el README con dependencias nuevas en la copia, pnpm install --frozen-lockfile y Chromium local cuando corresponda. Registrar red/almacén de paquetes utilizado y cualquier reutilización inevitable; no afirmar aislamiento total de máquina. Inicializar DB nueva y datos según C04; comprobar /health, clientes, alta→simulación→historial y arranque desde raíz. Ejecutar lint, typecheck, format:check, build, test y test:e2e. test:gates nunca concurrente con otros controles. Capturar comandos, códigos y cleanup. Si se descubre un paso oculto, corregir instrucciones y repetir el tramo afectado.

## T04 — Preparación externa revisable

Preparar docs/delivery.md con contenido incluido/excluido, modalidad/destino conocido o sin seleccionar, revisión de datos/secretos y riesgos. Revisar archivos versionados y contenido que se pretende entregar; declarar si el historial Git no se ha auditado exhaustivamente. No declarar ausencia absoluta de secretos por un escaneo parcial. Preparar requisitos de despliegue condicionales: servir SPA/rutas directas y /api, configuración de puerto y SQLite persistente/backup. Sin elegir proveedor, contratar servicios ni publicar por defecto. Una guía no acredita despliegue, restore o CORS de producción.

## T05 — Cierre

Consolidar RF→prueba→versión→resultado, actualizar MEMORY.md, validación y trazabilidad. Al iniciar implementación de 010, sincronizar spec activa y referencia del gate test/docs.test.mjs hoy fijadas a 009. Verificar enlaces después de documentación, repetir controles afectados por cambios reales y distinguir el cierre 009 del ensayo nuevo. No repetir toda la suite por cada edición documental si no hay un motivo técnico.

## Correspondencia de controles

| Control        | Criterio                                                                                                |
| -------------- | ------------------------------------------------------------------------------------------------------- |
| DOC-README-010 | README cubre contenido de spec y comandos/scripts reales, imágenes locales verificadas y límites claros |
| DOC-AUDIT-010  | Índice navegable, enlaces válidos, procedencia honesta y resultados sin contradicciones de estado       |
| DELIVERY-01    | Instalación y recorrido completo observados en copia limpia identificada, sin DB de desarrollo          |
| DELIVERY-02    | Contenido/riesgos de entrega revisados; publicación y despliegue separados de la preparación            |
| QA-ALL-010     | Controles globales del ensayo con salidas y códigos reales, gates sin concurrencia                      |

Controles documentales: pnpm test:docs, Prettier y git diff --check. Herramientas existentes; no dependencias nuevas. La preparación documental no constituye evidencia de ejecución de tareas.
