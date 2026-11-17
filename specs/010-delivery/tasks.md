# Tareas 010

T01 completada técnicamente; T02–T05 pendientes de indicación de Alex. IDs 010-T01–T05. ai-workspace excluido hasta autorización explícita.

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

- [ ] **010-T02** — RF2/RF3. Depende de T01 y autorización expresa para escribir ai-workspace, hoy pendiente.
- Actualizar índice y registros pertinentes con enlaces a evidencia canónica de 008/009/010 y resolver estados operativos obsoletos sobre fuentes/CORS/capturas conservando historia.
- Distinguir instrucciones previas, reformulaciones y retrospectivas; respetar prompts excluidos. No inventar salidas, aceptación humana ni registros contemporáneos.
- Archivos: ai-workspace/README.md y únicamente registros pertinentes de prompts/iterations/testing/reviews/visuals según evidencia disponible, sin carpetas vacías por obligación.
- Controles: DOC-AUDIT-010, test:docs y formato.
- Hecho cuando el evaluador pueda recorrer planificación, arquitectura, intervención IA y calidad con procedencia verificable. Estado/evidencia: NO EJECUTADO.

## T03 — Ensayo de instalación limpia y paquete

- [ ] **010-T03** — RF1/RF3. Depende de T02, comando demo de T01 y método de ensayo C07 definido.
- Identificar versión y cambios incluidos; crear copia aislada dentro del proyecto sin dependencias, cachés, secretos ni DB heredadas; conservar configuración necesaria. No modificar .git ni datos existentes.
- Seguir README para instalación frozen-lockfile, Chromium, DB nueva/datos acordados y arranque web/API desde raíz. Comprobar /health, alta, simulación, persistencia e historial.
- Ejecutar lint, typecheck, format:check, build, test y test:e2e sin gates concurrentes. Corregir pasos ocultos y repetir controles afectados.
- Archivos: validation.md; evidencia pertinente en ai-workspace/testing tras autorización; README si el ensayo detecta instrucciones incorrectas. Recursos efímeros bajo .cache.
- Controles: DELIVERY-01, QA-ALL-010. Registrar sistema operativo real, red, reutilización de herramientas/almacén, códigos, incidencias y cleanup.
- Hecho cuando el recorrido sea reproducible en la copia limpia y los límites de aislamiento estén explícitos, sin afirmar otra máquina/SO no probados. Estado/evidencia: NO EJECUTADO.

## T04 — Preparación de entrega externa

- [ ] **010-T04** — RF3/RF4. Depende de T03.
- Preparar lista de contenido incluido/excluido, modalidad/destino y riesgos; revisar secretos/datos de archivos previstos y declarar alcance del historial revisado.
- Documentar condiciones de SPA, /api, variables y SQLite persistente/backup si se plantea hosting, sin elegir proveedor o implantar infraestructura por defecto.
- Archivos: docs/delivery.md; docs/approvals.md solo para alcance realmente autorizado. No subir archivos ni publicar/desplegar.
- Control: DELIVERY-02. No exigir auditoría absoluta o pruebas de restore/producción que no se hayan ejecutado.
- Hecho cuando la propuesta sea revisable, con acciones externas separadas y destino sin seleccionar si sigue pendiente. Estado/evidencia: NO EJECUTADO.

## T05 — Cierre técnico de la entrega

- [ ] **010-T05** — RF1–RF4. Depende de T04.
- Consolidar resultados/versiones, límites y pendientes externos; actualizar validation.md, MEMORY.md y docs/traceability.md. Revisar documentos tras sus cambios y repetir controles de código solo cuando proceda.
- Archivos: validación/memoria/trazabilidad y revisión pertinente en ai-workspace si continúa autorizado.
- Controles: DOC-AUDIT-010, DELIVERY-02 y test:docs, con referencia a QA-ALL-010 de T03 y controles posteriores necesarios.
- Hecho cuando cada RF tenga resultado real y veredicto técnico. La aceptación humana puede seguir pendiente. Publicación, commits/pushes y despliegue requieren autorización específica y no son requisito de cierre técnico.
- Estado/evidencia: NO EJECUTADO.
