# Revisión 007-T04

16 de noviembre de 2026. Base 010a716. Resultado: **CUMPLE TÉCNICAMENTE T04**. [Pruebas](../testing/007-customers-ui-t04.md), [validación](../../specs/007-customers-ui/validation.md#t04--ficha-e-historial-persistido).

- RF2: alta conduce a ficha real con ID persistido y anuncio, conservando retorno al listado.
- RF3: datos corporativos/contacto e historial guardado con estados separados. ID inválido/404/temporal diferenciados; fallo de historial no borra tarjetas. Clientes fuera del selector pueden consultarse.
- RF4: historyOffset/atrás/recarga/retorno y respuestas antiguas verificadas. Aborto por cambio/desmontaje; cliente no se vuelve a consultar al paginar historial.
- RF5: tarjetas y tabla/cards usan tokens/CSS Modules, semántica de secciones, encabezados, labels de datos y estados accesibles. Capturas desktop/móvil inspeccionadas a partir de smoke con cuatro anchos.
- Contratos/dinero: validación de DTO/identidad/página/snapshots y coherencia de importes guardados. EUR exacto con BigInt/Intl; sin recálculo, FX o consulta de tarifas actuales. Pruebas usan precios históricos distintos y máximo entero seguro.
- Cohesión: transporte, parsers, gestión de recursos y presentación separados. useApiResource/parsePage se comparten con listado para evitar lógica duplicada. CustomerDetailPage.test.tsx alcanza 307 líneas con 12 casos del mismo flujo y harness común; se revisa su cohesión y se conserva sin dividir solo por tamaño. Archivos productivos del módulo por debajo de 300 líneas.

208 pruebas globales correctas y lint/typecheck/build pasan. Primeros fallos del harness de paginación/tipos corregidos y conservados en evidencia. Sin cambios API/shared productivo/lockfile/dependencias ni datos existentes.

No se detectan incumplimientos bloqueantes de T04. T05 y aceptación humana final siguen pendientes; esta revisión no acredita zoom/contraste/teclado exhaustivos, lector de pantalla o despliegue.
