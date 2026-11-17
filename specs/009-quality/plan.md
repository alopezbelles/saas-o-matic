# Plan 009 — QA transversal

T01–T04 completadas técnicamente; T03 identificó 009-QA-01 y T04 corrigió el reflujo del simulador con regresiones en cuatro anchos. T05 y aceptación humana final pendientes. Registro ai-workspace excluido.

## Partir del estado existente

Instrucción previa de 009-T01 (17 de noviembre de 2026, antes de cambios de implementación): inventariar scripts y suites, comprobar descubrimiento y aislamiento del runner existente con un flujo representativo, y construir la matriz en validation.md a partir de los requisitos del PDF, código y pruebas reales. Actualizar la spec activa en MEMORY.md y el gate documental a 009. Identificar huecos y trabajo de T02–T05/010 sin atribuirles validación anticipada. Verificar lint, documentos y formato del cambio. Conservar evidencia temporal y exclusión ai-workspace, datos existentes y commits/pushes.

Inventariar suites y mapear RF a casos concretos antes de añadir pruebas. Reutilizar los 273 casos globales y 31 Playwright registrados al cerrar 008 como referencia histórica. Ejecutarlos sobre la versión que se revise y registrar diferencias.

Consultar [testing](../../docs/testing.md), [trazabilidad](../../docs/traceability.md) y [validación 008](../008-simulator-ui/validation.md). Confirmar scripts en package.json al comenzar.

Contrastar los apartados del enunciado Prueba Devs con IA.pdf aportado por Alex. Crear la matriz requisito oficial → implementación → prueba → resultado. Identificar los entregables asignados a 010 para mantener la separación de alcance.

## Archivos reales

- apps/web/playwright.config.mjs y apps/web/e2e/run.mjs configuran Chromium y su caché local.
- apps/web/e2e/environment.mjs crea API/Vite/SQLite por caso con puertos propios, migraciones, fixtures y limpieza segura.
- apps/web/e2e/fixtures.mjs contiene utilidades compartidas de formularios y FX.
- T02 incorpora apps/web/e2e/security.spec.mjs para markup persistido/búsqueda literal y fx-live.mjs para la comprobación de proveedor real mediante ejecución explícita.
- En apps/web/e2e, customers.spec.mjs, simulator-setup.spec.mjs, simulator-preview.spec.mjs, simulator-save.spec.mjs, simulator-history.spec.mjs y simulator-flow.spec.mjs cubren flujos, persistencia y recuperación.
- apps/web/e2e/visual.spec.mjs, simulator-visual.spec.mjs y contrast.mjs cubren responsive, teclado, foco y medidas renderizadas.
- apps/web/src contiene pruebas Vitest/RTL de transporte, componentes, estados y carreras. apps/web/test contiene node:test de FX/transporte.
- packages/shared/test y apps/api/test cubren contratos, fiscal, cálculo monetario, persistencia, transacciones, errores y locks.
- test/gates.test.mjs comprueba que los controles rechazan errores. test/docs.test.mjs valida enlaces/scripts y, después de T01, exige 009 como spec activa.

T01 actualiza la referencia activa de MEMORY.md y el gate documental de forma coherente con el inicio de 009. La preparación anterior había conservado ambos archivos.

## Entorno y aislamiento

Extender el runner actual cuando haga falta. Mantener rutas DB/contextos y cleanup existentes. Las pruebas no abrirán datos de desarrollo ni dependerán de servidores personales.

Interceptar FX con page.route o transporte inyectado, usando tasas y errores controlados. Controlar el tiempo en pruebas de caducidad y debounce donde sea necesario. Conservar los timeouts API de 10 s, FX de 5 s y busy_timeout SQLite de 1000 ms existentes. Cambiarlos requiere una decisión específica.

Los artefactos temporales del runner están en .cache/007-e2e/report.json y .cache/007-e2e/results, nombre heredado y vigente. El navegador usa .cache/playwright. Las nuevas salidas de comandos pueden conservarse bajo .cache/009-*. La validación enlazará fuentes canónicas y distinguirá artefactos efímeros de evidencia versionada.

## Seguridad básica y FX real

Instrucción previa de T02 (17 de noviembre de 2026, antes de cambios): reejecutar suites de dominio, API, transporte/componentes y flujos de navegador, revisar los escenarios negativos inventariados y completar huecos pertinentes de seguridad. Revisar entradas/SQL, límites, errores/logs, secretos en archivos versionados y privacidad de FX. Comprobar el proveedor real desde el simulador con Chromium y DB temporal mediante una ejecución explícita independiente de la suite determinista. Registrar resultados y hallazgos, incluidos límites externos, actualizar memoria/matriz y reservar correcciones de producto encontradas para T04. Mantener exclusión ai-workspace y datos existentes.

En T02 revisar validación de entradas y campos extra, SQL parametrizado, límites de cuerpo/paginación, errores y logs, secretos y datos que salen al proveedor FX. Usar código y pruebas existentes como evidencia y añadir regresiones ante huecos relevantes. Registrar hallazgos con impacto y corregirlos en T04 cuando corresponda al alcance aprobado.

Realizar una comprobación puntual en Chromium desde el simulador con el endpoint real configurado, cliente y DB temporales. Observar CORS, respuesta válida, total convertido y fecha/atribución. El proveedor recibe la solicitud de tasas, sin datos fiscales o de contacto del cliente. Registrar fecha, entorno y resultado, evitando secretos o datos personales en evidencias.

La suite automatizada mantendrá fixtures FX y ejecución determinista. La comprobación real tendrá resultado separado. Si el proveedor o la conectividad fallan, registrar la limitación y distinguirla de un defecto de aplicación. Cambiar proveedor, proxy o arquitectura requiere una decisión específica.

## Matriz de revisión

| Área              | Evidencia existente que se revisará                                         | Trabajo incremental                                            |
| ----------------- | --------------------------------------------------------------------------- | -------------------------------------------------------------- |
| Dominio/contratos | shared/test, contratos/fiscal API                                           | Casos faltantes o regresiones concretas                        |
| SQLite y HTTP     | database-operations, simulations-service, simulations y simulations-history | Verificar locks/rollback/500/503 y recuperación                |
| Frontend/FX       | Pruebas de componentes/transporte y cliente FX                              | Revisar conservación, expiración, respuestas tardías y errores |
| Flujo comercial   | E2E-SIMULATIONS-008 y suites de clientes/historial                          | Reejecutar y completar huecos con impacto                      |
| Accesibilidad     | VISUAL-007/008 y contraste compartido                                       | Revisar estados y acciones nuevos o deficientes                |
| Evidencia         | validation de cada spec y docs/traceability.md                              | Vincular resultado actual, límites y defectos                  |

El código ya contiene pruebas de DB ocupada→503/recuperación, inserción fallida→500 sanitizado y 404. El timeout de guardado se prueba en frontend, mientras integración verifica el estado transaccional. Un caso de red no demuestra por sí solo rollback en SQLite.

## Secuencia

Instrucción previa de T04 (17 de noviembre de 2026): corregir 009-QA-01 mediante estilos locales del simulador que permitan ajustar nombres válidos sin espacios, conservando el texto completo y los contratos existentes. Extender la regresión del cliente largo al guardado, confirmación e historial, retirar test.fail y exigir geometría correcta a 320/390/768/1440 px. Ejecutar pruebas afectadas, inspeccionar capturas y comprobar regresiones generales con datos temporales. Mantener exclusión ai-workspace; T05 y aceptación humana siguen pendientes.

Instrucción previa de T03 (17 de noviembre de 2026, antes de código): revisar las suites visuales existentes y completar los huecos de estados de carga/error/vacío, asociaciones accesibles y contenido largo en los cuatro anchos acordados. Reejecutar teclado/foco, contraste y ampliación/reflujo en Chromium con API/SQLite temporales y FX controlado. Inspeccionar capturas reales, registrar resultados y límites y describir defectos reproducibles para T04 si aparecen. Mantener exclusión ai-workspace y aceptación humana separada.

T01 inventario, entorno y matriz del enunciado/cobertura. T02 flujos, resiliencia, seguridad básica y comprobación FX real. T03 accesibilidad/responsive en Chromium. T04 correcciones necesarias y regresiones. T05 controles finales y cierre de trazabilidad técnica.

Un caso que ya esté cubierto puede cerrarse mediante revisión y reejecución con evidencia. Si no se encuentran defectos en T04, registrar ese resultado de la revisión. Las decisiones que amplíen arquitectura, servicios, dependencias o reglas se consultarán antes de implementarlas.

## Controles

Desde raíz, pnpm lint, pnpm typecheck, pnpm format:check, pnpm build, pnpm test y pnpm test:e2e. test:docs después de cambios documentales. En PowerShell se puede usar pnpm.cmd con el pnpm local ya disponible.

pnpm test incluye unit, integración, web, gates y docs. test:e2e se ejecuta aparte. test:gates debe ejecutarse sin otros controles de código concurrentes. Ejecutar primero pruebas afectadas por una corrección y completar la validación final sobre el código de cierre.

## Revisión y límites

Distinguir revisión técnica del agente y aceptación de Alex. Chromium es el navegador confirmado. Lectores de pantalla, otros navegadores y zoom nativo se registrarán solo si se utilizan. La revisión automatizada de contraste es representativa. El cotejo usará el enunciado completo aportado. La comprobación puntual de FX real tiene evidencia independiente de los fixtures.

README definitivo, índice de auditoría, organización de evidencias para entrega, instalación desde checkout limpio y preparación de publicación corresponden a 010. Los controles de 009 revisan la calidad de la aplicación en su entorno aislado existente.

No registrar ai-workspace durante esta preparación ni durante tareas posteriores hasta que Alex levante la exclusión.
