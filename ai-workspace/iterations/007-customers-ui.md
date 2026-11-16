# 007 — Iteración de desarrollo

## T05 — Inicio

16 de noviembre de 2026. Alex autoriza revisión global y E2E mantenido. Git inicial limpio. [Instrucción previa](../prompts/007-customers-ui.md#t05--instrucción-previa-de-implementación). Se revisan runners existentes para separar Playwright de Vitest/node:test y reutilizar aislamiento de DB/puertos. Resultados pendientes.

Se añaden configuración/runner Playwright, fixtures con DB propia por caso y puertos efímeros, cuatro flujos funcionales y siete controles visuales/teclado/contraste. Los cuatro flujos iniciales pasan. Primera revisión ampliada: 9 correctas/2 fallos; el harness asumía foco inicial en body aunque la app enfoca h1, y los bordes de campos tenían contraste 1,355:1. Se corrige el harness con navegación real hacia atrás y se incorpora token de borde de control separado de bordes decorativos.

Repetición: 10 correctas/1 fallo real de foco tras paginar historial. Se añade useQueryFocus compartido con listado para enfocar encabezado cuando el control desaparece durante carga, sin desplazar foco elegido después por el usuario. Prueba de teclado dirigida posterior correcta. Una regresión de componentes comprueba este último límite. Lint detectó globals DOM en callbacks de Playwright .mjs; se hacen explícitos mediante globalThis sin desactivar reglas. Intento de filtro con alternancia «keyboard|contrast» falló en el shell Windows antes de ejecutar pruebas; se repitió la suite y el filtro simple correctamente.

Zoom verificado mediante layout CSS al 200 % y viewport de 640 px equivalente al reflujo de 1280 px físicos al 200 %; no se presenta como interacción con el menú nativo de zoom. Revisión final/controles globales en curso.

Cierre funcional: 11 Playwright correctas, sin skips/retries/flaky; 209 pruebas globales correctas, lint/typecheck/build pasan. Se inspeccionan capturas de las tres pantallas a 1440/320 y zoom; contraste de borde corregido 3,628:1 y textos representativos ≥4,5:1. [Resultados](../testing/007-customers-ui-t05.md), [revisión](../reviews/007-customers-ui-t05.md) y [capturas](../visuals/007-customers-ui-t05.md). Sin cambios API/shared productivo/lockfile o datos existentes; recursos temporales cerrados/limpiados. Aceptación humana final no registrada.

Cierre documental con test:docs (2), formato global y diff check correctos, código 0. Reportes JSON originales protegidos frente a reformateo automático; no se modifican sus resultados.

## T04 — Inicio

16 de noviembre de 2026. Alex autoriza ficha e historial. Estado Git inicial limpio. Revisados spec/plan/tasks y contratos shared para reutilizar DTO y paginación, con importes guardados y backend autoritativo. [Instrucción previa](../prompts/007-customers-ui.md#t04--instrucción-previa-de-implementación). Resultados pendientes.

Ficha, tarjetas e historial implementados con recursos independientes y historyOffset validado en URL. Se extraen validación de páginas y gestión GET cancelable para reutilizarlas entre listado/ficha/historial, manteniendo la interfaz de useCustomers. El histórico valida estructura/coherencia de datos guardados sin aplicar tarifas actuales; formato EUR exacto incluso en el límite entero seguro.

Primera ampliación de componentes: 85 correctas/1 fallo por referencia del test al nav desmontado durante carga. Corregida consulta al nav vigente; repetición 86/86. Typecheck detectó pathname posiblemente undefined en el harness del test; corregido usando URL. Build posterior correcto. Estas incidencias fueron del harness, sin atribuir éxito a sus primeras ejecuciones.

Smoke Chromium contra proxy/API/SQLite temporal pasa: historial de 21 registros en páginas 20/1, EUR histórico fuera de política actual, 503 de historial sin perder ficha/reintento, retorno contextual, recarga, URL inválida, ID inválido/404 y alta→ficha completa/historial vacío. Anchos 320/390/768/1440 sin desbordamiento; capturas escritorio/móvil inspeccionadas. Regresión global y cierre documental en curso.

Regresión global posterior a reutilizar useApiResource en listado: 208/208 pruebas correctas, lint/typecheck/build pasan. [Salida y límites](../testing/007-customers-ui-t04.md), [revisión](../reviews/007-customers-ui-t04.md), [capturas](../visuals/007-customers-ui-t04.md). API/shared productivo/lockfile sin cambios, recursos temporales cerrados/limpiados. T05 pendiente de instrucción; aceptación humana final no registrada.

Cierre documental con dos pruebas de docs, formato global y diff check correctos, código 0.

## T03 — Inicio

16 de noviembre de 2026. Alex autoriza formulario de alta y continúa registro de progreso de 007. Se revisa transporte GET y contratos antes de implementar. [Instrucción previa](../prompts/007-customers-ui.md#t03--instrucción-previa-de-implementación). Estado inicial Git limpio; resultados pendientes.

Se separan presentación, estado de creación, carga de países y adaptadores HTTP. Se reutilizan parseCreateCustomer, PLAN_CODES y validateTaxPolicy; etiquetas de países/planes extraídas para compartirlas con el listado. El backend conserva control fiscal y unicidad. Campos retenidos ante 422/409/503; resultado incierto ofrece búsqueda en otra pestaña sin reenvío automático. Cancelar/salir conserva contexto; éxito utiliza el ID persistido y la ficha provisional existente.

Primera suite ampliada 47/47 correcta; tras añadir dos regresiones de navegación, suite global 171/171 correcta (49 componentes/transporte). Lint/typecheck/build pasan. Smoke Chromium real valida alta, fiscal inválido/corrección, duplicado y cuatro anchos sin errores de página; capturas inspeccionadas. No hubo fallos funcionales detectados en estas ejecuciones. Los registros históricos de T01/T02 mantienen sus incidencias previas.

[Pruebas](../testing/007-customers-ui-t03.md), [revisión](../reviews/007-customers-ui-t03.md) y [capturas](../visuals/007-customers-ui-t03.md). Sin dependencias nuevas ni cambios API/shared productivo/lockfile. T04–T05 pendientes; aceptación humana final no registrada.

## T02 — Inicio

16 de noviembre de 2026. Alex autoriza adaptador API, listado y búsqueda. Estado inicial Git limpio, base 0436e20. [Instrucción previa](../prompts/007-customers-ui.md#t02--instrucción-previa-de-implementación). Se revisaron DTO/parsers antes de código y se mantuvo validación estructural compatible con filas históricas.

Transporte GET, proxy, listado responsive, búsqueda con debounce/URL y retorno contextual implementados. Se protege vigencia ante abortos/respuestas tardías y se distinguen vacío/error/página fuera de rango. Build/dev compilan shared para su consumo runtime reproducible.

Primera suite de componentes 29 correctas/1 fallo: output del harness también tenía role status. Se ajustó el selector del test de carga; repetición 30/30. Smoke con API real y SQLite temporal de 21 clientes pasa en cuatro anchos, paginación/búsqueda/retorno/recarga y 503/reintento. Suite global 152/152 correcta. [Resultados](../testing/007-customers-ui-t02.md), [revisión](../reviews/007-customers-ui-t02.md) y [capturas](../visuals/007-customers-ui-t02.md).

Sin cambios API/shared productivo/lockfile, dependencias nuevas o DB real. T03–T05 pendientes y aceptación humana final no registrada. Formato global, dos pruebas documentales y diff check correctos al cerrar registros.

## Contorno de foco del título

16 de noviembre de 2026. Alex solicita eliminar el rectángulo azul del título al cargar. Se identifica como :focus-visible por foco programático de navegación y se aplica una excepción visual a h1 con tabindex=-1. El foco lógico sigue en encabezado; enlaces/controles conservan indicador de teclado.

10 pruebas de componentes correctas. Smoke Chromium valida outline none del encabezado a 320/390/768/1440 y outline solid en el enlace al pulsar Tab; rutas y salto al contenido siguen correctos. [Captura actualizada](../visuals/007-customers-ui-t01.md#título-sin-contorno-al-cargar).

## Ajuste visual posterior a T01

16 de noviembre de 2026. Alex solicita alinear «Nuevo cliente» con el título «Clientes» y anteponer «+» según la captura facilitada. Se mueve la acción al encabezado con flex adaptable y símbolo decorativo oculto a lectores de pantalla; el nombre accesible conserva «Nuevo cliente». En pantallas estrechas el encabezado permite salto de línea para evitar desbordamientos.

pnpm.cmd --filter @saas-o-matic/web test:components: 10/10 correctas, código 0. Smoke Chromium local repetido: rutas, foco y anchos 320/390/768/1440 correctos. Se inspeccionaron capturas desktop/móvil actualizadas; [evidencia visual](../visuals/007-customers-ui-t01.md#ajuste-del-encabezado). Sin aceptación humana final anticipada.

Registro iniciado el 16 de noviembre de 2026 durante T01. [Instrucción previa](../prompts/007-customers-ui.md#t01--instrucción-previa-de-implementación), [spec](../../specs/007-customers-ui/spec.md) y [decisiones](../../specs/007-customers-ui/clarifications.md).

## T01 — Inicio

Alex autoriza ejecutar T01 y levantar la exclusión de ai-workspace para el progreso de 007. Estado inicial de Git limpio. Se comprueban dependencias y herramientas antes de instalar. La documentación previa es antecedente; este registro comienza durante ejecución.

Se registró instrucción antes de instalar o cambiar código. [Resultados y comandos](../testing/007-customers-ui-t01.md), [revisión](../reviews/007-customers-ui-t01.md) y [capturas](../visuals/007-customers-ui-t01.md).

Compatibilidad llevó a fijar React Router 7.18.5/jsdom 27.0.1 con Node 22.19; latest exige Node superior. Instalación reproducible correcta. Acceso npm inicial bajo sandbox falló EACCES y se repitió con elevación revisada.

Shell y rutas base implementados, con foco tras navegación, salto al contenido y tokens. Primer typecheck detectó string|undefined en clase de NavLink, corregido. Smoke inicial falló por import nombrado de CJS en script diagnóstico; corrección de import y repetición Chromium correcta a cuatro anchos.

Primera suite global 130/130; revisión posterior detectó breadcrumb al usar barra final, normalizado con dos casos de regresión. Repetición lint/typecheck/test:web correcta con 22 node + 10 componentes. Sin cambios API/DB/shared productivo ni ejecución de commits; T02–T05 pendientes. Registro y capturas se mantuvieron durante la tarea.
