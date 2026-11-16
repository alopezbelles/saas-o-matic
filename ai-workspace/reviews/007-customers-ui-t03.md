# Revisión 007-T03

16 de noviembre de 2026. Resultado: **CUMPLE TÉCNICAMENTE T03**. [Pruebas y límites](../testing/007-customers-ui-t03.md), [validación](../../specs/007-customers-ui/validation.md#t03--alta-integrada-y-recuperación-segura).

- RF2: alta de cinco campos mediante POST real, normalización compartida, fiscal/duplicados autoritativos en backend, respuesta 201 validada y navegación al ID persistido. Ficha completa queda en T04.
- RF5: labels, campos obligatorios, errores asociados y resumen enfocado, mensajes de carga/error, conservación del borrador y bloqueo de doble envío. Cancelación preserva listado. Resultado incierto permite comprobar en otra pestaña; no se reenvía automáticamente.
- Arquitectura: transporte reutilizado, adaptadores de contratos, hooks de estado y componentes separados por responsabilidad. Países del servidor y planes shared; sin lógica fiscal duplicada ni catálogo de precios local. Ningún archivo TypeScript del módulo alcanza 300 líneas en esta revisión.
- Calidad: 171 pruebas globales correctas; lint/typecheck/build pasan. Smoke Chromium contra proxy/API/SQLite temporal acredita 422 fiscal→corrección→201/persistencia/listado y duplicado 409. Capturas de cuatro anchos generadas; escritorio/móvil/error inspeccionados.

No se detectan incumplimientos bloqueantes de T03. T04–T05 requieren nueva indicación. La conformidad técnica no constituye aceptación humana; zoom/contraste/teclado exhaustivos, E2E mantenido y despliegue no están acreditados por este cierre.
