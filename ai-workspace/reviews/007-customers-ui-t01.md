# 007-T01 — Revisión técnica

16 de noviembre de 2026. Alcance autorizado T01, decisiones de [clarifications](../../specs/007-customers-ui/clarifications.md) e [instrucción previa](../prompts/007-customers-ui.md#t01--instrucción-previa-de-implementación).

Shell con navegación superior, breadcrumbs y rutas directas /customers, /customers/new, /customers/:id y 404. El contenido provisional informa de disponibilidad futura; no presenta altas o clientes simulados. Tokens/global y CSS Modules comparten estilo; fuente del sistema y HTML semántico. Salto al contenido y foco de navegación comprobados en Chromium.

React Router y herramientas instaladas en versiones compatibles, con enlace workspace shared y lock reproducible. Runners independientes conservan node:test y añaden Vitest/RTL. Sin abstracciones para formularios o datos aún no implementados.

Incidencias reales: restricción de red sandbox recuperada, tipo CSS Modules/NavLink corregido y script diagnóstico CJS corregido. Revisión detectó breadcrumb de barra final y añadió dos regresiones. [Evidencia](../testing/007-customers-ui-t01.md).

El aspecto se inspeccionó en capturas de 320/390/768/1440 y se conservan desktop/móvil. No hay desbordamiento en smoke. Formularios, listado real, ficha e historial corresponden a tareas posteriores. Zoom/contraste exhaustivo y E2E de alta siguen previstos para T05.

Veredicto: CUMPLE TÉCNICAMENTE T01. Tras dos regresiones de barra final, lint/typecheck y suite web final pasan con 22 node + 10 componentes. Controles globales anteriores conservados en evidencia; formato global, dos pruebas documentales y diff check correctos. Aceptación humana no registrada.
