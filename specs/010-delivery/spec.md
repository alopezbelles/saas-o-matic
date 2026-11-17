# 010 — Documentación, auditoría y entrega

T01–T03 completadas técnicamente: README/demo/capturas, auditoría y ensayo limpio en Windows. Registro ai-workspace autorizado en T02 con procedencia y exclusiones de mensajes respetadas. T04–T05 pendientes de indicación. Aceptación humana separada del cierre técnico. [Evidencia T01](validation.md#t01--readme-técnico-y-demo-reproducible).

## Contexto y fuentes

009-quality está completada técnicamente: 273 pruebas globales y 36 E2E correctas, con límites y revisión humana pendiente en su [validación](../009-quality/validation.md). 010 convierte el proyecto existente en una entrega comprensible, reproducible y auditable. README, scripts y registros ya existen; se completan y verifican, sin partir de cero.

Fuentes: enunciado Prueba Devs con IA.pdf aportado y consultado, referencia visual interfaces.pdf utilizada en 007–008, [matriz del enunciado](../009-quality/validation.md#qa-review-009--matriz-final-del-enunciado), [arquitectura](../../docs/architecture.md), [decisiones](../../docs/decisions.md), [contratos](../../docs/api-contracts.md) y [procedimiento SDD](../../docs/sdd-harness.md). Los PDF externos no se incorporan automáticamente al repositorio. docs/requirements.md recoge infraestructura; no se le atribuyen los identificadores antiguos R14/R16/R17/R18/O03.

## Objetivo y destinatario

El evaluador de Roams debe comprender qué se construyó, por qué se eligió esa solución, cómo se dirigió la IA, cómo se comprobó y cómo ejecutarlo sin conocimiento previo de la conversación.

## Requisitos y aceptación

- **010-RF1.** CUANDO el evaluador siga el README desde una copia limpia identificada, LA ENTREGA permitirá instalar dependencias, inicializar una base nueva, arrancar la aplicación y ejecutar controles sin pasos ocultos. Se declararán sistema operativo, herramientas, red necesaria y límites reales del ensayo.
- **010-RF2.** CUANDO el evaluador consulte el README y ai-workspace, LA DOCUMENTACIÓN explicará necesidades, decisiones de software relevantes, evolución hacia specs/tareas y uso de IA, enlazando evidencias reales y distinguiendo registros contemporáneos, reformulaciones y retrospectivas.
- **010-RF3.** SI una funcionalidad, prueba, fuente o entorno no se ha validado, LA ENTREGA lo declarará, separando resultados históricos, ejecución actual y aceptación humana. No se reconstruirán conversaciones ni decisiones para aparentar un proceso diferente.
- **010-RF4.** CUANDO se prepare la entrega externa, LA REVISIÓN identificará contenido, destino, riesgos de secretos/datos y preservación SQLite, dejando publicación, cambios de remoto y despliegue pendientes de autorización explícita. La preparación puede completarse sin publicar ni elegir hosting.

## Contenido obligatorio del README

1. Título «SaaS-O-Matic — Prueba técnica de desarrollo con IA para Roams», descripción y recorrido funcional; síntesis del enunciado sin reproducir el PDF.
2. Desglose de necesidades: clientes y control fiscal, simulaciones persistidas, tramos/impuesto, búsqueda/historial responsive y conversión orientativa; diferenciar requisitos oficiales de políticas demo acordadas.
3. Arquitectura y stack: monorepo pnpm, React/TypeScript/Vite/Express, SQLite/Drizzle/better-sqlite3, dominio y contratos shared, separación de responsabilidades y flujo web→API→persistencia. Explicar motivos, alternativas relevantes documentadas y consecuencias; no inventar deliberaciones.
4. Decisiones transversales: backend autoritativo, céntimos/BigInt/half-up, snapshots/versiones/histórico EUR, FX directo/caché/timeout/reserva EUR, CSS Modules/tokens, navegación y calidad. Explicar proporcionalidad y límites; no afirmar arquitectura universalmente óptima.
5. Proceso SDD: recorrido real 001 infraestructura, 002 persistencia, 003 clientes API, 004 facturación, 005 simulaciones API, 006 divisas, 007 clientes UI, 008 simulador UI, 009 calidad y 010 entrega. Explicar requisitos→aclaraciones→plan→tasks→validación, con excepciones históricas documentadas y enlaces canónicos.
6. Desarrollo con IA: Codex para ejecución del código, implementación incremental y controles; ChatGPT Work con el complemento Product para diseño general de interfaces, según declaración de Alex en esta preparación. Distinguir herramienta, aportación, decisiones humanas y evidencia conservada. No atribuir a una herramienta acciones no acreditadas ni simular prompts originales.
7. Instalación/ejecución, variables, inicialización DB, datos demo elegidos, comandos de pruebas, limitaciones conocidas y enlaces de auditoría. Inicio rápido visible mediante índice/anclas, sin obligar a leer toda la explicación arquitectónica antes de arrancar.
8. Capturas de pantallas principales cuando aporten claridad: listado, alta, ficha/historial y simulador. Deben corresponder a la aplicación actual, usar datos ficticios y texto alternativo, sin rutas personales o datos sensibles. Diferenciar mockup de captura; no presentar imágenes generadas como evidencia de ejecución.

## Límites

Entrega confirmada: instalación local y repositorio. La demo desplegada es opcional y no se elige hosting. La demo local completa se implementará en T01: comando explícito sobre destino nuevo, tres clientes ficticios con formatos válidos y al menos una simulación por cliente. Usará países/planes configurados y cálculo autoritativo existente, sin tasas FX persistidas ni importes inventados. Rechazará cualquier destino ya existente y no reiniciará ni alterará la base de desarrollo. Los identificadores fiscales serán fixtures con control válido, sin afirmar identidad o existencia censal.

No nuevas funcionalidades, rediseño, stack, dependencias, endpoints, políticas fiscales, CI o hosting por defecto. La demo completa con nuevos fixtures/comando está incluida por C04; no cambia reglas de negocio ni el seed histórico de 002. Ningún ensayo usará la DB de desarrollo. No subir PDF privados, archivos .env reales, DB, backups, cachés o node_modules. No tocar .git ni configuración personal para ensayar. Preparar despliegue no equivale a desplegar.

## Dependencias y completado

Depende del cierre técnico 009. Nuevas decisiones pendientes en [aclaraciones](clarifications.md); no bloquean la adaptación documental independiente. Cada RF se cerrará con pruebas, versión y límites reales en [validación](validation.md). El cierre técnico puede completarse con aceptación humana pendiente. No se exige publicación externa para completar 010.
