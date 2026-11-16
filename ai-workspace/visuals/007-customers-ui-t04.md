# Evidencia visual 007-T04

16 de noviembre de 2026, cambios T04 sobre base local limpia. Chromium headless, Vite/API con puertos propios y SQLite temporal. Ruta /customers/:id, cliente ficticio Empresa Histórica/PT y 21 simulaciones de fixture histórico. Capturas sin datos del usuario.

- [Escritorio 1440 × 1000, página completa](007-customers-ui-t04/desktop.png): título/país/plan, tarjetas corporativa/contacto, historial 20 filas con importes guardados EUR y paginación.
- [Móvil 320 × 1000](007-customers-ui-t04/mobile.png): tarjetas en una columna y comienzo del historial con cada dato etiquetado. El historial continúa verticalmente; captura del viewport.

Se generaron cuatro anchos 320/390/768/1440 y se midió scrollWidth igual al viewport en todos. Escritorio/móvil inspeccionados. [Salida real](../testing/007-customers-ui-t04-browser.txt). Referencia PDF adaptada: sin acciones de simulación futuras ni badge de importes de ejemplo sobre datos guardados.

No acredita auditoría exhaustiva de contraste, zoom 200%, lector de pantalla o aceptación humana. La revisión global y runner E2E mantenido corresponden a T05.
