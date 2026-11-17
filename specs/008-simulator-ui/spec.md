# 008 — Simulador interactivo y guardado

Estado: decisiones 008-C01…C07 confirmadas. T01–T05 completadas técnicamente con pruebas globales y de navegador. Aceptación humana final pendiente.

## Contexto y fuentes

Flujo comercial implementado con consumos, previsualización y guardado autoritativo. T01–T05 integran cliente/configuración, controles, presupuesto, conversión visual del total, resultado confirmado, recuperación contextual del historial y revisión global del flujo. Motor/API/persistencia existentes conservados.

Fuentes: contratos y decisiones confirmadas de 002–007 y conversación de preparación de 008. docs/requirements.md define infraestructura: no contiene R05/R09/R12/R13/N06 y no se le atribuyen esos identificadores. La cuarta pantalla de interfaces.pdf, revisada desde C:/Users/alope/Desktop/roams/interfaces.pdf, sirve de referencia visual adaptada; documento externo no copiado al repositorio. No se certifica revisión del enunciado oficial completo.

## Relación con lo implementado

- 002–003: cliente persistido, país/plan, validación y DTO.
- 004: calculateQuote y dinero exacto en packages/shared; no packages/billing.
- 005: POST /simulations, configuración e historial con snapshots/versiones/importes EUR guardados.
- 006: convertCurrency y ExchangeRate-API, caché por pestaña, timeout 5 s, EUR/USD/GBP y solo total; sin FX persistido.
- 007: rutas/shell, tokens/CSS Modules, transporte/adaptadores, ficha/historial y runners Vitest/Playwright.

## Pantalla y navegación

Ruta confirmada /customers/:id/simulations/new, acceso «Nueva simulación» desde ficha, sin sección global Simulaciones. Volver conserva contexto del listado/ficha en estado validado del router; acceso directo tiene destino seguro. ID inválido sin consulta innecesaria, 404 explícito y error temporal recuperable.

PDF como referencia: consumos/resumen en dos columnas de escritorio y una en móvil. Navegación superior, breadcrumbs, fuente del sistema y tokens/CSS Modules existentes. Sin sidebar, Tailwind, nueva librería UI o tipografía descargada.

Slider de usuarios confirmado: 0..1000, paso 1, mismo rango que campo numérico. Cada nueva simulación comienza con usuarios, almacenamiento y llamadas API a cero, EUR como divisa inicial y sin guardado automático. Selector EUR/USD/GBP limitado al total del simulador y al resultado confirmado; desglose e historial en EUR. Si falla FX, mostrar total EUR claramente identificado, aviso y «Reintentar conversión»; el cálculo y guardado EUR siguen disponibles si el resto de condiciones son válidas.

Tras un 201 válido, permanecer en el simulador mostrando confirmación accesible y resultado autoritativo, con conversión del total si se solicita y aviso visible de discrepancia cuando proceda. Ofrecer «Volver al cliente» para consultar su historial actualizado, conservando el contexto previo. No redirigir automáticamente a la ficha.

## Requisitos funcionales EARS

- **008-RF1:** CUANDO se cambien usuarios válidos mediante slider o número, EL SISTEMA sincronizará ambos controles y actualizará la previsualización con el motor compartido, sin solicitudes por tick.
- **008-RF2:** CUANDO se introduzcan almacenamiento o llamadas API, EL SISTEMA conservará y validará esos consumos sin añadir cargos. Solo usuarios determina la base; el plan no multiplica precios.
- **008-RF3:** CUANDO se confirme un guardado válido, EL SISTEMA enviará exactamente customerId/users/storageGb/apiCalls, bloqueará doble envío y presentará el DTO confirmado por servidor. Ante error conservará valores; ante resultado incierto no reenviará automáticamente y ofrecerá comprobar el historial existente.
- **008-RF4:** CUANDO se seleccione EUR/USD/GBP en el simulador o su resultado confirmado, EL SISTEMA mostrará el total final en esa divisa, convirtiendo desde EUR mediante 006 cuando proceda e indicando conversión orientativa y fecha/fuente del proveedor. Base, impuesto, desglose, historial de clientes y persistencia conservarán EUR; no se añadirá selector FX al historial. SI falla o caduca FX, EL SISTEMA mostrará total EUR, aviso y reintento explícito de conversión, sin bloquear un guardado EUR válido ni presentar una tasa caducada como vigente.
- **008-RF5:** SI el 201 difiere del preview congelado al enviar en versiones de precios/impuestos o importes, EL SISTEMA mostrará resultado autoritativo y aviso comprensible, sin recalcular ni modificar el registro guardado.

## Reglas existentes

Consumos enteros no negativos de shared: users 0..1000, storageGb 0..10000, apiCalls 0..10000000. No modificar schema/CHECK/tarifas/límites para acomodar propuestas antiguas. Borradores string: vacío, fracción, negativo, notación inválida o exceso no se convierten silenciosamente en cero ni producen presupuesto guardable.

País/plan del cliente, no campos editables de precio. Configuración publicada: versiones/tramos/tasas/límites. Si cliente/configuración/país impiden presupuesto fiable, mostrar estado explícito y bloquear guardado hasta resolverlo; sin política de reserva inventada. Comprobar pricingVersion y tramos contra getPricingConfiguration de shared y límites contra CONSUMPTION_LIMITS. Si son incompatibles, bloquear previsualización y guardado con aviso y recarga/reintento, conservando borrador; sin cambiar reglas locales. La política fiscal se valida desde el servidor con las reglas del motor, sin catálogo fiscal duplicado en web.

Si la política cambia después de un preview válido y el backend confirma 201, aceptar su DTO con el aviso de RF5. La comprobación inicial no debe ocultar un guardado confirmado ni convertirlo en error o reenviarlo.

Backend recalcula y persiste EUR/snapshots/versiones. Dos guardados deliberados pueden crear registros distintos; bloqueo de doble clic no supone idempotencia de red. HTTP/mensajes sanitizados de 005/007. Red/timeout/201 ilegible pueden implicar guardado incierto; no filas optimistas que aparenten confirmación.

## Casos límite

0/10/11/15/50/51/1000 usuarios y máximos de otros consumos; borrador vacío/fraccionario; país sin política; ID inválido/404; configuración ausente/ilegible/incompatible; FX fallido/caducado; cambios rápidos y respuestas tardías; 422/503; red/timeout/201 ilegible; preview distinto del servidor; historial actualizado tras recarga.

## Fuera de alcance

Nuevas tablas/migraciones/endpoints, packages/billing/contracts, historial paralelo al de 007, edición/borrado, guardado por tick, motor duplicado en JSX, precios enviados desde web, FX persistido, monedas adicionales y «Ver detalle»/pantalla individual de simulación. Cualquier ampliación requiere decisión separada.

## Completado y límites

RF con pruebas reales, controles pertinentes y E2E con API/DB temporal; nunca bases existentes. Distinguir conformidad técnica de aceptación humana. Completar decisiones antes de implementación incremental por indicación de Alex. Esta adaptación modifica solo los cinco documentos de 008, sin registrar ai-workspace.
