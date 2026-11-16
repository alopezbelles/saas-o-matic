# Evidencia visual 007-T03

16 de noviembre de 2026, base 83b9432 más cambios T03. Chromium headless sobre Vite y API/SQLite temporales; ruta /customers/new. Datos ficticios: Empresa Formulario, identificador de fixture y correo example.invalid.

- [Escritorio 1440 × 1000](007-customers-ui-t03/desktop.png): formulario centrado, secciones empresa/suscripción, cinco campos, planes demo y acciones.
- [Móvil 320 × 1000](007-customers-ui-t03/mobile.png): campos y acciones accesibles sin desplazamiento horizontal; altura completa capturada.
- [Error fiscal 1440 × 1000](007-customers-ui-t03/fiscal-error.png): 422 real, resumen enfocado, enlace/campo y mensaje asociado; valores conservados.

Capturas generadas también a 390/768 y medida de scrollWidth en los cuatro anchos: [salida real](../testing/007-customers-ui-t03-browser.txt). Se inspeccionaron visualmente escritorio/móvil/error. PDF es referencia adaptada con tokens y fuente del sistema. El foco visible en el input corresponde a la interacción con controles.

Esto no acredita zoom 200%, auditoría completa de contraste, lector de pantalla o aceptación humana final. Esas revisiones y E2E mantenido corresponden a T05. [Flujo funcional y controles](../testing/007-customers-ui-t03.md).
