# 007 — Iteración de desarrollo

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
