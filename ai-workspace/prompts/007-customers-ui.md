# 007 — Instrucciones técnicas

## T05 — Instrucción previa de implementación

16 de noviembre de 2026. Reformulación técnica de la solicitud de Alex, redactada antes de implementar T05; no transcripción literal.

Contexto: T01–T04 completas técnicamente, shell/listado/alta/ficha/historial operativos y herramientas Playwright autorizadas. Objetivo: runner E2E mantenido contra API/Vite/SQLite temporales y revisión final verificable de RF1–RF5.

Acciones: crear fixtures aislados con puertos propios y cierre de recursos, configurar descubrimiento independiente de Vitest/node:test y comandos raíz; cubrir alta fiscal/éxito/ficha, búsqueda/paginación/retorno/recarga e historial guardado. Revisar cuatro anchos, zoom 200 %, teclado/foco y contraste real. Corregir problemas reproducibles dentro de 007 y ejecutar regresión global.

Restricciones: sin nuevas dependencias, servicios, endpoints, datos existentes, simulador/FX o acciones futuras. No usar servidores o perfiles personales, no reutilizar DB real y comprobar ruta antes de limpiar recursos propios. Sin retries que oculten fallos ni snapshots/capturas inventados. Gates secuencial sin otros controles de código simultáneos.

Verificación: E2E reales y negativos, cierre/limpieza, controles globales, documentos enlazados y evidencias con resultados reales. Registrar fallos y correcciones; distinguir alcance comprobado de auditoría exhaustiva/certificación y aceptación humana. Proponer commit sin ejecutarlo.

## T04 — Instrucción previa de implementación

16 de noviembre de 2026. Reformulación técnica de la solicitud de Alex, redactada antes del código de T04; no transcripción literal.

Contexto: listado y alta operativos, ficha provisional, contratos de clientes 003 e historial 005 existentes. Objetivo: ficha con tarjetas corporativa/contacto e historial persistido EUR de 20 por página.

Acciones: integrar GET de cliente e historial con validación runtime de DTO/página, ID inválido/404 explícitos y cargas/reintentos independientes; validar historyOffset de URL, conservar contexto de retorno y descartar respuestas antiguas al cambiar cliente/página. Mostrar fecha, usuarios, almacenamiento, llamadas y total guardado en EUR; preservar snapshots sin aplicar configuración actual.

Restricciones: sin cálculo/FX, nuevas dependencias, endpoints, SQL, datos existentes o acciones de simulación futuras. Pruebas deterministas y navegador con API/SQLite temporal. No registrar como originales mensajes reformulados ni atribuir aceptación humana.

Verificación: estructura e identidad de DTO, historial vacío/fallido/fuera de rango, configuración histórica distinta, países fuera del selector, retorno/recarga, carreras/abortos, foco y responsive. Ejecutar controles pertinentes, conservar resultados y actualizar solo registros relacionados. Sin commit/push; proponer nombre al terminar.

## T03 — Instrucción previa de implementación

16 de noviembre de 2026. Bloque redactado antes de modificar código, por autorización explícita de Alex para T03.

Contexto: listado/adaptador GET/proxy de T02 operativos, contratos de alta 003 y configuración 005 existentes. Ficha completa pendiente de T04.

Objetivo: formulario de cinco campos conectado a POST /customers, países reales y planes shared, con validación compartida, errores accesibles y navegación de éxito.

Acciones: ampliar transporte con POST JSON reutilizando timeout/cancelación/envelope, validar 201/DTO y proyección de países; construir formulario y estados separados por responsabilidad; bloquear doble envío, conservar campos con 422/409/503 y resultado incierto; cancelar con contexto y anunciar éxito en destino.

Restricciones: algoritmo fiscal autoritativo en backend, sin librerías/planes/países inventados ni cambios DB/servicios existentes. Pruebas con datos temporales exclusivos; no usar la base local del usuario. No reenviar POST automáticamente tras red/timeout/201 ilegible.

Verificación: DTO/payload exactos, configuración inválida/indisponible, etiquetas y errores asociados, formato/fiscal/duplicidad, una sola petición, conservación/retorno, estado incierto y creación→destino. Tests componentes/API y navegador con API/SQLite temporal, controles y evidencias reales. Cierre incremental con nombre de commit, sin commits/pushes ni aceptación humana anticipada.

## T02 — Instrucción previa de implementación

16 de noviembre de 2026. Redactada antes del código de T02, tras autorización explícita de Alex.

Contexto: shell/tokens/rutas de T01 disponibles, con acción «+ Nuevo cliente» en encabezado y foco de título sin contorno. API 003 aporta listado paginado real y contratos shared; Vite aún necesita proxy.

Objetivo: integrar listado/búsqueda con /api, DTO validado, timeout/cancelación y páginas de 20. Conservar consulta al visitar ficha/alta y volver, con estado URL y latest-wins ante respuestas fuera de orden.

Acciones: crear transporte GET y validación de CustomerPage antes de consumidor; configurar proxy Vite hacia puerto 3000; construir listado responsive, búsqueda accesible/debounce 250 ms, estados diferenciados y paginación. Probar adaptador y carreras con fetch/reloj controlados y verificar proxy/navegador real con datos temporales.

Restricciones: sin instalar librerías, modificar API/DB existente, inventar filas o columna de última simulación. Alta/ficha siguen en sus próximas tareas. Mantener markup/estilos legibles y responsabilidades cohesionadas.

Criterios: URL/payload/envelope correctos, aborto/timeout/protocolo diferenciados, páginas/total y retorno fiables, cero publicación de respuestas obsoletas, UI móvil/teclado revisada. Ejecutar controles pertinentes, guardar evidencia/incidencias durante trabajo y proponer commit. No afirmar aceptación humana final.

Registro iniciado el 16 de noviembre de 2026 al autorizar Alex T01 y el registro de progreso en ai-workspace. La preparación anterior quedó excluida de registro. Su resumen siguiente es retrospectivo, basado en conversación y [aclaraciones](../../specs/007-customers-ui/clarifications.md).

## Preparación — síntesis retrospectiva

Alex confirmó navegación superior y PDF como referencia, CSS Modules/tokens/global, fuente del sistema, historial EUR, omisión de última simulación/acciones futuras, países de configuración y planes demo existentes. Autorizó React Router y herramientas de pruebas, proxy /api, páginas de 20, debounce 250 ms y recuperación del alta. Los cinco documentos de 007 se consolidaron antes de implementar. Esta síntesis no es una conversación literal ni instrucción previamente enviada con esta redacción.

## T01 — Instrucción previa de implementación

Redactada antes de instalar dependencias o cambiar código productivo.

**Contexto:** web React/Vite/TypeScript con pantalla inicial, módulos FX y 22 pruebas node:test. La API y shared ya existen. [Plan canónico](../../specs/007-customers-ui/plan.md).

**Objetivo:** crear base visual y navegación comprobables para listado, alta, ficha y 404, con herramientas de componentes compatibles.

**Acciones:** comprobar engines/peerDependencies frente a Node 22.19, React 19 y Vite 8; instalar dependencias autorizadas; enlazar shared por workspace; tokens semánticos y CSS Modules; BrowserRouter/rutas, cabecera/breadcrumbs, contenido responsive y foco de navegación; tests Vitest/RTL con limpieza y selección independiente de node:test. Actualizar contexto/aprobaciones/registro durante el trabajo.

**Alcance:** T01 y WEB-SHELL-01. Los destinos futuros mostrarán estado de desarrollo explícito mientras no existan las siguientes tareas. No simular clientes o formularios funcionales.

**Restricciones:** respetar contratos/backend/DB y permisos; sin nuevas dependencias ajenas a decisiones, sin commits/pushes ni aceptación humana anticipada.

**Verificación:** instalación reproducible, lint/typecheck/build/formato, pruebas shell y suite web anterior, enlaces documentales; comprobar rutas directas y navegación/foco. Verificar el aspecto en navegador si el entorno permite y documentar cualquier límite real.

**Cierre:** evidencia real, estado de tareas y nombre de commit sugerido. Implementar T02 solo por indicación posterior.
