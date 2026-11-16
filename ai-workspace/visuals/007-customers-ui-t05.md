# Revisión visual final 007-T05

16 de noviembre de 2026, base 8a947eb más cambios T05. Chromium headless en runner mantenido con API/Vite/SQLite temporales. Datos ficticios: Empresa 01–21 y Empresa E2E, correos example.invalid y fixtures fiscales. No captura datos existentes del usuario.

| Pantalla/ruta        | Escritorio 1440 × 1000                          | Móvil 320 × 1000                               |
| -------------------- | ----------------------------------------------- | ---------------------------------------------- |
| Listado /customers   | [Captura](007-customers-ui-t05/list-1440.png)   | [Captura](007-customers-ui-t05/list-320.png)   |
| Alta /customers/new  | [Captura](007-customers-ui-t05/form-1440.png)   | [Captura](007-customers-ui-t05/form-320.png)   |
| Ficha /customers/:id | [Captura](007-customers-ui-t05/detail-1440.png) | [Captura](007-customers-ui-t05/detail-320.png) |

[Alta con layout CSS al 200 %](007-customers-ui-t05/form-zoom-200.png), viewport de 1280 × 1000 y página completa. Capturas normales del listado/ficha son del viewport; su contenido continúa verticalmente. Alta se captura completa. También se generaron capturas 390/768 en caché del runner. Se inspeccionaron las siete enlazadas: composición clara, campos/acciones legibles, tarjetas/reflujo móvil y ausencia de solapamiento en lo visible.

Los cuatro anchos comprueban scrollWidth ≤ viewport. Zoom usa CSS layout 2× y prueba adicional a 640 px de reflujo equivalente a 1280 físicos al 200 %; no es interacción con menú nativo. Teclado recorre salto al contenido/navegación/alta/resumen y paginación de historial/listado. El foco se restablece si desaparece el control y se respeta otra elección del usuario.

Contraste real: borde de campo/select 3,628:1 tras corregir 1,355:1; texto representativo ≥4,5:1 y foco ≥3:1. [Reporte y mediciones](../testing/007-customers-ui-t05-e2e.json), [casos/fallos/límites](../testing/007-customers-ui-t05.md). Sin auditoría exhaustiva WCAG, lector de pantalla o aceptación humana final. PDF se usa como referencia adaptada con tokens/fuente del sistema y decisiones de 007; no se incorporan sus acciones futuras.
