# Tareas 007

Estado global: T01 completada técnicamente, T02–T05 pendientes. Progreso registrado en ai-workspace. Cada fase posterior requiere instrucción. Sin aceptación humana final ni commits/pushes del agente.

## T01 — Base visual, rutas y herramientas

- [x] **007-T01**. RF: base de RF5, sin completar pantallas funcionales.
- Dependencias: decisiones de clarifications y autorización de T01 antes de instalaciones.
- Acciones: comprobar compatibilidad y añadir React Router/herramientas aprobadas; conectar shared mediante workspace; crear tokens/global, shell superior/breadcrumbs y rutas base con 404. Configurar Vitest/RTL sin perder node:test de 006/smoke. Actualizar contexto global al iniciar implementación.
- Destinos previstos: apps/web/package.json, pnpm-lock.yaml, App/main, app/, styles/, configuración Vite/Vitest y pruebas del shell. Crear solo componentes/rutas con responsabilidad actual.
- Verificación: instalación reproducible, lint/typecheck/build, WEB-SHELL-01, pruebas previas de web y tests documentales. No crear runner E2E vacío.
- Hecho cuando: shell/tokens/rutas son comprobables y responsive básico, dependencias compatibles, sin simulación de RF1–RF4 como terminados.
- Evidencia real: [validación T01](validation.md#t01--base-visual-rutas-y-herramientas). Suite web final 22 node + 10 componentes y smoke Chromium correctos; suite global inicial 130/130 conservada.

## T02 — Adaptador API, listado y búsqueda

- [ ] **007-T02**. RF: RF1/RF4 y navegación de RF5.
- Dependencia: T01.
- Acciones: preparar transporte/validación de respuestas para operaciones necesarias antes de usarlas; configurar /api y proxy Vite; integrar GET clientes con búsqueda/paginación/estados y contexto en URL. Sin columna última simulación ni N+1.
- Destinos: features/customers/api/, CustomersPage y componentes/styles de lista, transporte compartido si procede, vite.config.ts y tests.
- Verificación: WEB-API-01, WEB-SEARCH-01, WEB-STATE-01; requests reales contra entorno temporal o smoke aislado del proxy, sin DB existente.
- Hecho cuando: páginas de 20, debounce 250 ms, latest-wins, vacío/error/total y atrás/adelante funcionan; contrato/peticiones correctos, no basta una lista con fixtures de producción.
- Evidencia real: NO EJECUTADO.

## T03 — Alta integrada y recuperación segura

- [ ] **007-T03**. RF: RF2/RF5.
- Dependencia: T02.
- Acciones: formulario de cinco campos; formato compartido/fiscal backend; configuración real para países y PLAN_CODES para etiquetas demo. Errores inline/resumen, bloqueo doble envío, cancelar contextual y creación→ficha. Registrar resultado incierto sin retry automático.
- Destinos: CustomerCreatePage, CustomerForm, adaptadores config/POST y pruebas de interacción.
- Verificación: WEB-FORM-01/WEB-STATE-01: 201, 422, 409, 503, timeout/red/201 ilegible, configuración no disponible, conservación de valores y una sola petición.
- Hecho cuando: alta usa contratos reales, no inventa planes/países, navegación de éxito tiene destino coherente y formulario no pierde campos al fallar. La ficha completa llegará en T04.
- Evidencia real: NO EJECUTADO.

## T04 — Ficha e historial persistido

- [ ] **007-T04**. RF: RF3/RF4/RF5 y final de navegación RF2.
- Dependencia: T03.
- Acciones: integrar detalle e historial con cargas/errores independientes; ID inválido y 404; tarjetas con campos reales; historial EUR paginado de 20 y historyOffset en URL; retorno preserva listado. Sin acciones de simulación futuras.
- Destinos: CustomerDetailPage, tarjetas/SimulationHistory, adaptadores GET y pruebas.
- Verificación: WEB-DETAIL-01/WEB-STATE-01; snapshot/importe guardado, sin recálculo/FX, vacío/historial fallido sin perder ficha, carreras al cambiar ID/página, clientes con país fuera del selector.
- Hecho cuando: ficha e historial leen datos guardados y cumplen sus estados, accesibilidad y retorno; ningún enlace apunta a un simulador/detalle inexistente.
- Evidencia real: NO EJECUTADO.

## T05 — E2E real, revisión visual y cierre global

- [ ] **007-T05**. RF: RF1–RF5.
- Dependencia: T04.
- Acciones: configurar Playwright y script E2E real; flujo alta→ficha y listado/retorno/historial contra backend/SQLite temporales; verificar recargas directas y proxy de desarrollo. Revisar PDF adaptado, estados y responsive/teclado; actualizar docs globales/validación con resultados reales.
- Destinos: configuración/fixtures/tests Playwright, scripts, docs pertinentes y validation.md. Capturas reales y registro ai-workspace autorizado desde T01.
- Verificación: E2E-CUSTOMERS-007, VISUAL-007 y controles globales del plan. No ejecutar test:gates en paralelo con otros controles de código. No tocar DB existente.
- Hecho cuando: RF trazados a evidencia, suites anteriores conservadas, navegadores/recursos temporales cerrados, limitaciones declaradas y revisión técnica diferenciada de aceptación humana. Un fallo del navegador no acredita responsive/E2E por inspección.
- Evidencia real: NO EJECUTADO.

## Procedimiento común

Antes de cada fase: leer contexto/contratos y alcance autorizado, concretar instrucción técnica y verificar solo responsabilidades de la tarea. No añadir carpetas vacías ni librerías fuera de las aprobadas. Registrar resultados en validation.md; no marcar pruebas planeadas como ejecutadas.

Alex levantó la exclusión de ai-workspace al autorizar T01. Registrar ahora progreso real, manteniendo como retrospectivo cualquier resumen de preparación anterior. Sin commits/pushes, despliegues ni aceptación humana anticipada.
