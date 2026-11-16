# 007-T01 — Capturas reales del shell

## Título sin contorno al cargar

16 de noviembre de 2026, ajuste solicitado por Alex. [Captura desktop actualizada](007-customers-ui-t01/heading-focus-desktop.png), revisada tras modificar solo el contorno visual del encabezado programáticamente enfocado. Smoke Chromium verifica a cuatro tamaños el título sin outline y el indicador solid de enlaces al navegar con Tab. [Salida real](../testing/007-heading-focus-browser.txt). Los apartados siguientes conservan las capturas históricas anteriores.

## Ajuste del encabezado

16 de noviembre de 2026, petición posterior de Alex. Botón «+ Nuevo cliente» alineado al título en escritorio; encabezado con reflujo en móvil. Nuevas capturas reales de Chromium, inspeccionadas tras pasar las 10 pruebas de componentes y repetir smoke a cuatro anchos.

- [Encabezado escritorio actualizado](007-customers-ui-t01/header-desktop.png).
- [Encabezado móvil actualizado](007-customers-ui-t01/header-mobile.png).

Las capturas originales siguientes conservan el estado anterior al ajuste.

16 de noviembre de 2026. Chromium 159 de Playwright 1.65.1, Vite local con perfil aislado. Contenido de T01, sin datos de clientes. Capturas realizadas durante el smoke y revisadas visualmente. El encabezado tiene foco programático, visible como contorno.

- [Escritorio, 1440 × 900](007-customers-ui-t01/desktop.png).
- [Móvil, 320 × 900](007-customers-ui-t01/mobile.png).

También se capturaron/revisaron 390 y 768 px en caché local. Navegación, recarga, foco y scrollWidth constan en [salida del smoke](../testing/007-customers-ui-t01-browser.txt).

La referencia es interfaces.pdf proporcionado por Alex, revisado antes de la implementación. Las pantallas con datos, formulario e historial llegarán en tareas siguientes. Esta evidencia acredita el shell, sin aceptación humana final ni revisión visual completa de 007.
