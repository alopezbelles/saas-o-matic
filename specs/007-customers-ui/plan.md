# Plan 007 — Interfaz de clientes

Estado: decisiones confirmadas y T01 completada técnicamente, con registro en ai-workspace desde su inicio. T02–T05 requieren indicación posterior.

## Instrucción técnica previa

Construir listado/alta/ficha con historial usando React/TypeScript y API existente. Seguir el PDF revisado con navegación superior y tokens; reutilizar contratos y separar transporte, estado de pantalla y presentación. No crear negocio, endpoints o funcionalidades de simulación para completar visualmente una maqueta. Ejecutar cada tarea únicamente por indicación de Alex, con pruebas y resultado revisable antes de proponer commit.

## Estructura prevista

Rutas futuras, no archivos existentes ni carpetas a crear vacías:

- apps/web/src/app/: router React Router y shell de navegación/breadcrumbs.
- apps/web/src/styles/tokens.css y global.css: variables comunes y base.
- apps/web/src/components/: componentes accesibles solo cuando haya uso real compartido (botón, campo, estado, paginación).
- apps/web/src/features/customers/api/: operaciones de clientes/configuración/historial y validación de respuestas.
- apps/web/src/features/customers/pages/: listado, alta y ficha.
- apps/web/src/features/customers/components/: formulario, tarjetas e historial con estilos .module.css.
- apps/web/src/lib/ o equivalente pequeño para transporte común solo si varias operaciones lo usan.
- Pruebas de componentes junto a sus features o directorio test coherente; suites node:test de 006 conservadas. Configuraciones Vitest/Playwright y fixtures en sus destinos reales durante tareas.
- packages/shared: consumir exports de clientes, errores, planes y parsers; no duplicar lógica ni crear packages/contracts.

No añadir state manager, cliente de caché global, form library, Zod, Tailwind o librería de iconos/UI. React local + router bastan para este alcance.

## Dependencias autorizadas y runners

React Router para navegación. Vitest, @testing-library/react, @testing-library/user-event, @testing-library/jest-dom, jsdom y @playwright/test como herramientas de desarrollo del conjunto autorizado. Comprobar versiones/peerDependencies y Node 22/Vite/React existentes antes de instalar en T01; no fijar números sin comprobación.

Añadir enlace interno web→shared workspace:* cuando se consuma shared en runtime/tipos, con build reproducible. No importar rutas fuente internas de otro paquete. Mantener los tests node:test de FX y smoke, añadiendo ejecución de componentes sin retirarlos ni duplicarlos accidentalmente. Vitest no debe recoger archivos de node:test ni estos recoger pruebas de componentes. No usar passWithNoTests.

Playwright tendrá configuración/flujo real en T05. No crear un test:e2e vacío en T01. Preparar navegador dedicado del runner sin perfiles personales ni instalación global; documentar bloqueo si el entorno no permite arrancar. No sustituir una prueba de navegador pendiente por mocks exitosos.

## Tokens y presentación

tokens.css define valores base y nombres semánticos: texto, fondo/superficie, borde, acción y sus estados, error/éxito, tipografía del sistema, espacios, radios, sombras, foco y ancho de contenido. Los componentes usan variables con nombres en inglés, sin copiar colores/tamaños en cada pantalla. No crear capas de tokens sin uso, temas o componentes anticipados.

global.css limita reset/base, box-sizing, body, tipografía y accesibilidad transversal. CSS Modules contienen estilos locales. Usar HTML semántico y componentes compartidos cuando eviten repetición real. Breakpoints se documentan/coordinan en CSS; var() no sustituye condiciones de media queries.

Seguir composición visual del PDF, no márgenes blancos de sus páginas impresas. Ajustar contrastes y reflujo; tablas desktop y presentación legible móvil. Sin datos/planes ficticios en producción ni badge «Importes de ejemplo» sobre datos persistidos reales.

## Rutas y estado navegable

- / → /customers.
- /customers?q=...&offset=...: tamaño fijo 20; q y offset validados con reglas existentes.
- /customers/new: formulario.
- /customers/:id?historyOffset=...: ficha e historial de tamaño 20.
- Ruta desconocida: 404 frontend con enlace a clientes. ID inválido: estado explícito sin consulta innecesaria.

Conservar contexto del listado en navegación del router y enlaces de retorno internos; sin confiar en URLs externas arbitrarias. Acceso directo a ficha/alta sin contexto vuelve al listado base. Búsqueda confirmada tras debounce reemplaza estado de URL sin entrada por tecla; paginación y navegación son navegables con atrás/adelante. Cambiar q vuelve a offset 0. Parámetros inválidos muestran error recuperable/restablecimiento, sin caída de aplicación.

Al cancelar una consulta o cambiar parámetros, impedir que su resultado o su finally modifique el estado vigente; manejar AbortController y un identificador de vigencia. StrictMode no debe causar mensajes falsos de error ni POST en efectos.

## Comunicación con API

Fetch relativo a /api; Vite reenvía a http://127.0.0.1:3000 y retira prefijo. Sin cambios de endpoints/CORS Express. El proxy es solo desarrollo: vite preview/build no proporciona ese backend; documentar que futura producción debe enrutar /api.

Operaciones: GET/POST /customers, GET /customers/:id, GET /customers/:id/simulations y GET /billing-config. Ver [contratos reales](../../docs/api-contracts.md), CustomerPage/CustomerDto/CreateCustomer/ApiError y SimulationPage/BillingConfigDto de shared. Validar JSON/respuestas antes de renderizar; no tratar un cast TypeScript como validación runtime. Un fallo de protocolo no equivale a lista vacía.

Transporte con abort/timeout acotado (constante técnica inicial 10 s, testeable), HTTP y envelope diferenciados; mensajes de UI españoles, sin stack/SQL/PII en logs. No añadir retries automáticos. Un POST con red/timeout o 201 ilegible es resultado incierto: conservar formulario, explicar y ofrecer comprobar listado; no redirigir por Location sin validar, usar ID del DTO.

## Lista, alta y ficha

Crear adaptadores antes de consumidores (T02), reutilizando validadores estructurales; no copiar algoritmo fiscal en web. Listado usa q/limit=20/offset, total y acciones reales, sin última simulación.

Alta toma países de ratesByCountry, con nombres españoles para ES/FR/DE/GB, y planes de PLAN_CODES con etiquetas acordadas. Si faltan países válidos/configuración, bloquear envío y permitir reintento, manteniendo campos. Cliente creado → ficha + anuncio de éxito; submit deshabilitado mientras pendiente con guardia contra doble llamada. 422: errores de campo/resumen; 409: duplicidad fiscal/país; 503: indisponibilidad recuperable sin vaciar datos. Validación fiscal permanece en backend.

Ficha obtiene datos e historial como estados independientes; fallo de historial no borra ficha. Mostrar total EUR guardado, fecha y consumos, orden/paginación de API; no recomputar ni aplicar FX. Formato español con Intl, sin alterar valores persistidos. Nombres de países fuera del selector pueden mostrarse mediante etiqueta/código sin impedir leer clientes existentes.

## Pruebas previstas

- WEB-SHELL-01: rutas directas, raíz/404, navegación superior, foco y tokens.
- WEB-API-01: URL/payload/DTO/envelope, abort/timeout, JSON inválido y resultado incierto.
- WEB-SEARCH-01: debounce 250 ms con reloj simulado, páginas de 20, estados y respuestas fuera de orden.
- WEB-FORM-01: labels/validación, países/planes reales, 201, 422/409/503, doble envío y conservación/retorno.
- WEB-DETAIL-01: ficha/ID inválido/404, historial paginado/orden/empty/error independiente y EUR guardado.
- WEB-STATE-01: carga, reintento, teclado, mensajes accesibles y conservación de contexto.
- E2E-CUSTOMERS-007: alta→ficha real, búsqueda/paginación/retorno, historial con datos temporales y navegación/recarga.
- VISUAL-007: 320/390/768/1440 px, zoom 200%, contraste, teclado y capturas reales cuando se pueda ejecutar navegador.

Vitest/RTL con fixtures y fetch controlado no sustituyen E2E contra API/SQLite temporal. E2E usa DB exclusiva bajo .cache, migraciones explícitas y fixtures deterministas mediante mecanismos existentes; sin modificar seed productivo ni bases del usuario. Limpiar solo recursos propios, cerrar procesos/conexiones.

Controles de cierre: pnpm lint, pnpm typecheck, pnpm format:check, pnpm build, pnpm test y nuevo flujo E2E real cuando exista. No ejecutar test:gates en paralelo con otros controles de código. Si navegador falla, declarar limitación y mantener aceptación/verificación afectada pendiente.

## Documentación y límites

[Decisiones](clarifications.md), [fases](tasks.md) y [validación](validation.md). Actualizar contexto, aprobaciones, diseño, testing y trazabilidad al implementar cada tarea. Alex autorizó registrar progreso en ai-workspace al iniciar T01. La restricción documental anterior describe la preparación. No prometer despliegue, certificación WCAG o aceptación humana por pasar pruebas.
