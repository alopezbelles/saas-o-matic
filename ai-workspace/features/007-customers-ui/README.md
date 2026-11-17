# 007 Customers UI — Colaboración con IA

## Objetivo y reparto del trabajo

Utilizar Codex para construir listado, alta y ficha de clientes con historial persistido, trasladando las decisiones de producto y la referencia visual a interfaces React conectadas con la API existente.

La dirección del proyecto aportó interfaces.pdf, confirmó navegación superior, CSS Modules y tokens globales, y resolvió las adaptaciones de contenido antes del código. Autorizó React Router y herramientas de pruebas, después la ejecución por tareas y el registro del progreso. Se delegaron en Codex la estructura de componentes, integración, implementación y verificación. Las solicitudes posteriores sobre posición del botón y contorno del título proporcionan ejemplos concretos de supervisión visual.

## Directrices de diseño e integración

- Usar el PDF como referencia de composición, adaptando responsive y accesibilidad. Conservar los planes demo y datos realmente disponibles, sin reproducir columnas o acciones sin soporte.
- Centralizar valores visuales en tokens y mantener estilos locales por componente, con fuente del sistema y sin librería UI.
- Separar transporte y validación de respuestas, estado de pantalla y presentación; reutilizar contratos compartidos y mantener la validación fiscal autoritativa en backend.
- Conservar búsqueda y paginación al navegar, ignorar respuestas antiguas y ofrecer recuperación sin perder campos ni reenviar automáticamente un alta incierta.

Las [instrucciones consolidadas](prompts.md) explican cómo se dirigió el trabajo; las [iteraciones](iterations.md) recogen ajustes y correcciones reales.

## Resultado y fuentes

Las tres pantallas quedaron operativas con pruebas de componentes y flujos contra API/SQLite temporal. La [validación](../../../specs/007-customers-ui/validation.md) conserva resultados y límites de la revisión responsive, de teclado y contraste; no acredita certificación global de accesibilidad ni aceptación humana final.

El PDF de referencia estaba fuera del repositorio. Las [capturas actuales](../../../docs/images/customers.png) ilustran el producto posterior, no el estado exacto del cierre de 007. Esta reorganización no genera capturas ni vuelve a ejecutar flujos.

- [Especificación](../../../specs/007-customers-ui/spec.md), [aclaraciones](../../../specs/007-customers-ui/clarifications.md), [plan](../../../specs/007-customers-ui/plan.md) y [tareas](../../../specs/007-customers-ui/tasks.md).
- [Diseño](../../../docs/design.md), [producto](../../../docs/product.md) y [contratos API](../../../docs/api-contracts.md).
