# Tareas 010

T01–T05 completadas técnicamente; aceptación humana final y acciones externas pendientes. IDs 010-T01–T05. Registro ai-workspace autorizado en T02, respetando mensajes excluidos.

## T01 — README técnico y demo reproducible

- [x] **010-T01** — RF1/RF2/RF3 parciales hasta sus tareas posteriores.
- Reestructurar README existente con título/contexto de la prueba, necesidades, recorrido, decisiones de arquitectura/tecnología y consecuencias, evolución specs/tasks y proceso de IA.
- Explicar Codex para ejecución del código y ChatGPT Work con Product para diseño general, según declaración de Alex. Vincular evidencia real y etiquetar retrospectivas sin inventar interacciones.
- Incluir inicio rápido, requisitos, variables/API/DB, migraciones, comandos de pruebas, límites de demo/FX/producción y enlaces canónicos. Capturas reales de pantallas principales con datos ficticios y texto alternativo.
- Archivos: README.md; docs/images con capturas seleccionadas; .env.example si procede corregir explicación de variables DB; package.json y módulo CLI/fixtures/tests demo en apps/api. Sin cambiar .env real.
- Al iniciar 010, actualizar MEMORY.md y el contexto del gate test/docs.test.mjs de forma coherente. No alterar el cierre histórico de 009.
- Implementar el comando demo completo acordado en C04 según plan.md: DB nueva, tres clientes ficticios válidos y una simulación por cliente, sin sobrescribir bases existentes ni modificar el seed histórico. Reutilizar servicios/cálculo/migraciones; incluir pruebas de aislamiento, datos y rechazo de destino existente. Dependencia: autorización para ejecutar T01.
- Controles: DOC-README-010, test:docs, formato y comprobación de contenido/imágenes; para el comando demo, lint/typecheck y pruebas de integración pertinentes en DB temporal. No exige haber ensayado todavía otra instalación.
- README y demo preparados con cuatro capturas reales. Tres pruebas nuevas IT-DEMO-010, comando raíz y controles correctos; 276 pruebas globales pasan. [Evidencia, incidencias y límites](validation.md#t01--readme-técnico-y-demo-reproducible). Ensayo limpio reservado a T03; aceptación humana pendiente.

## T02 — Índice y evidencia del desarrollo asistido

- [x] **010-T02** — RF2/RF3. T01 completada y registro ai-workspace autorizado al solicitar Alex ejecutar T02.
- Actualizar índice y registros pertinentes con enlaces a evidencia canónica de 008/009/010 y resolver estados operativos obsoletos sobre fuentes/CORS/capturas conservando historia.
- Distinguir instrucciones previas, reformulaciones y retrospectivas; respetar prompts excluidos. No inventar salidas, aceptación humana ni registros contemporáneos.
- Archivos: ai-workspace/README.md y únicamente registros pertinentes de prompts/iterations/testing/reviews/visuals según evidencia disponible, sin carpetas vacías por obligación.
- Controles: DOC-AUDIT-010, test:docs y formato.
- Recorrido e índices actualizados, retrospectivas/procedencia diferenciadas y evidencias canónicas enlazadas. Dos pruebas documentales pasan; sin nuevas suites funcionales. [Evidencia y límites T02](validation.md#t02--índice-y-evidencia-del-desarrollo-asistido). Aceptación humana pendiente.

## T03 — Ensayo de instalación limpia y paquete

- [x] **010-T03** — RF1/RF3. T02 y comando demo T01 disponibles; método C07 aplicado.
- Identificar versión y cambios incluidos; crear copia aislada dentro del proyecto sin dependencias, cachés, secretos ni DB heredadas; conservar configuración necesaria. No modificar .git ni datos existentes.
- Seguir README para instalación frozen-lockfile, Chromium, DB nueva/datos acordados y arranque web/API desde raíz. Comprobar /health, alta, simulación, persistencia e historial.
- Ejecutar lint, typecheck, format:check, build, test y test:e2e sin gates concurrentes. Corregir pasos ocultos y repetir controles afectados.
- Archivos: validation.md; evidencia pertinente en ai-workspace/testing tras autorización; README si el ensayo detecta instrucciones incorrectas. Recursos efímeros bajo .cache.
- Controles: DELIVERY-01, QA-ALL-010. Registrar sistema operativo real, red, reutilización de herramientas/almacén, códigos, incidencias y cleanup.
- Ensayo correcto desde exportación 33774eb en el mismo Windows: dependencias/Chromium propios, demo nueva, dev y flujo real, 276 pruebas generales y 36 E2E correctas. Incidencias de red/cleanup y recuperación documentadas. [Evidencia y límites T03](validation.md#t03--ensayo-de-instalación-limpia). T04/T05 y aceptación humana pendientes.

## T04 — Preparación de entrega externa

- [x] **010-T04** — RF3/RF4. T03 completada.
- Preparar lista de contenido incluido/excluido, modalidad/destino y riesgos; revisar secretos/datos de archivos previstos y declarar alcance del historial revisado.
- Documentar condiciones de SPA, /api, variables y SQLite persistente/backup si se plantea hosting, sin elegir proveedor o implantar infraestructura por defecto.
- Archivos vigentes por indicación de Alex: README.md y ai-workspace/testing/010-delivery-t04.md; docs/approvals.md solo para alcance realmente autorizado. Sin documento de entrega separado, publicación o despliegue.
- Control: DELIVERY-02. No exigir auditoría absoluta o pruebas de restore/producción que no se hayan ejecutado.
- Presentación en README y evidencia técnica en ai-workspace, con contenido/exclusiones, inventario/escaneo acotado, rutas locales pendientes de decisión y condiciones SPA/API/SQLite. Dos pruebas documentales pasan. [Evidencia T04](validation.md#t04--preparación-externa-revisable). Sin publicar ni desplegar; T05 y aceptación humana pendientes.

## T05 — Cierre técnico de la entrega

- [x] **010-T05** — RF1–RF4. T04 completada.
- Consolidar resultados/versiones, límites y pendientes externos; actualizar validation.md, MEMORY.md y docs/traceability.md. Revisar documentos tras sus cambios y repetir controles de código solo cuando proceda.
- Archivos: validación/memoria/trazabilidad y revisión pertinente en ai-workspace si continúa autorizado.
- Controles: DOC-AUDIT-010, DELIVERY-02 y test:docs, con referencia a QA-ALL-010 de T03 y controles posteriores necesarios.
- Hecho cuando cada RF tenga resultado real y veredicto técnico. La aceptación humana puede seguir pendiente. Publicación, commits/pushes y despliegue requieren autorización específica y no son requisito de cierre técnico.
- Cierre técnico conforme: cuatro RF enlazados a versiones/resultados, recorrido README/ai-workspace coherente, dos pruebas documentales/anclas/formato correctos. Se conserva la evidencia 276/36 de T03 sin reejecución funcional en T05. [Cierre y pendientes externos](validation.md#t05--cierre-técnico-de-la-entrega).
