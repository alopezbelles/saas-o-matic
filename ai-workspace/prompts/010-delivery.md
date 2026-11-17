# 010 — Instrucciones técnicas de entrega

## Procedencia

Archivo creado el 17 de noviembre de 2026 durante T02. El registro de T01 es posterior a su ejecución; las instrucciones previas están en el [plan canónico](../../specs/010-delivery/plan.md#t01--readme-como-entrada-a-la-entrega). La instrucción de T02 se escribió en ese mismo plan antes de editar ai-workspace. No se incluyen mensajes previamente excluidos ni transcripciones reconstruidas.

## T01 — Síntesis posterior

Contexto: aplicación y revisión 009 implementadas; README/índice anteriores acumulaban estados históricos. Objetivo: explicar la prueba, necesidades, decisiones arquitectónicas y proceso SDD/IA, además de permitir una demo local completa. Restricciones: DB nueva explícita, servicios/motor existentes, sin dependencias, sin alterar seed histórico ni datos existentes. Verificación: fixtures fiscales, snapshots/importes, CLI desde otro directorio, protección de destinos y cuatro capturas reales. El ensayo de instalación limpia queda para T03.

La atribución de Codex a implementación/ejecución y ChatGPT Work con Product al diseño general procede de la declaración de Alex. No se conservan aquí sesiones originales de Product ni se inventan prompts de diseño.

## T02 — Instrucción previa enlazada

[Plan T02](../../specs/010-delivery/plan.md#t02--auditoría-enlazada-y-procedencia): actualizar el índice y registros pertinentes desde validaciones/artefactos reales, separar evidencia histórica/actual, mantener las exclusiones de mensajes y resolver referencias obsoletas de CORS/fuentes/capturas. No repetir suites de producto para un cambio documental. Comprobar enlaces/formato y distinguir aceptación humana de conformidad técnica.

[Iteración](../iterations/010-delivery.md), [verificación](../testing/008-010-evidence-index.md) y [revisión T02](../reviews/010-delivery-t02.md).

## T03 — Instrucción previa y método aplicado

Registro durante ejecución, 17 de noviembre de 2026. [Plan T03](../../specs/010-delivery/plan.md#t03--ensayo-reproducible): exportar 33774eb con git archive, conservar dotfiles necesarios y excluir .git/dependencias/cachés/DB. Instalar pnpm y dependencias/Chromium en la copia, seguir README para demo y dev desde raíz, comprobar alta→simulación→historial y controles secuenciales. Identificar Windows/Node/npm compartidos y límites del aislamiento; cerrar procesos propios, conservar datos originales y registrar fallos de entorno sin convertirlos en resultados exitosos. La instrucción se escribió en el plan antes del ensayo; este enlace no reproduce un prompt original de conversación.

## T04 — Preparación externa

Registro durante ejecución, 17 de noviembre de 2026. [Instrucción previa de elaboración](../../specs/010-delivery/plan.md#t04--preparación-externa-revisable): inventariar contenido versionado sin exponer valores de secretos, preparar lista incluida/excluida y riesgos, y documentar condiciones SPA/API/SQLite a partir del código. Conservar límites de escaneo/historial, destino conocido solo por configuración local y decisiones de publicación separadas. No alterar salidas históricas silenciosamente, publicar, elegir hosting o introducir cambios de infraestructura. Verificar documentos y mantener aceptación humana pendiente.
