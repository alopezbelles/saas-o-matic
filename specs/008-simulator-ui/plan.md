# Plan 008 — Simulador interactivo y guardado

Estado: preparación documental consolidada, decisiones 008-C01…C07 confirmadas. Lista para ejecutar tareas por fases cuando Alex lo indique; sin código nuevo ni tareas ejecutadas.

## Reutilización y responsabilidades

Conservar React/TypeScript strict/Vite, pnpm y packages/shared. Feature web simulations para pantalla, consumos, resumen y guardado. Separar transporte, contratos, estado y presentación; no nuevas capas backend.

Archivos existentes reutilizables o ampliables durante implementación:

- apps/web/src/app/AppRoutes.tsx y Breadcrumbs.tsx: ruta confirmada/contexto.
- features/customers/pages/CustomerDetailPage.tsx: acceso «Nueva simulación».
- features/customers/api/http.ts: GET/POST, envelope, abort/timeout API 10 s.
- features/customers/api/customers.ts y simulations.ts: cliente/DTO/identidad; compartir validadores con POST sin ciclos entre features ni movimientos solo estéticos.
- features/customers/api/billing-config.ts: actualmente solo valida proyección de países; ampliar o extraer contrato completo manteniendo compatibilidad del alta de cliente.
- features/customers/components/SimulationHistory.tsx: integrar historial existente, sin duplicarlo en simulations.
- features/currency/exchange-client.ts y exchange-contract.ts: FX existente con caché/timeout, sin reescribir proveedor.
- styles/tokens.css/global.css y módulos CSS: bordes accesibles, foco y reflujo de 007.
- apps/web/e2e y playwright.config.mjs: runner real con API/Vite/DB por caso, sin tests/e2e alternativo.

Destinos nuevos propuestos, aún inexistentes: features/simulations/pages/SimulationCreatePage.tsx, componentes ConsumptionInputs/PricingBreakdown/SimulationSummary y hooks/adaptadores con responsabilidad real. No crear carpetas vacías.

## Cliente, configuración y preview

Validar ID, cargar cliente/configuración sin consultas por tick. Validar BillingConfigDto completo: EUR/versiones/tramos/tasas/límites, no un cast. País sin política puede consultar historial, pero no simular; explicar bloqueo. Reintentos conservan borrador.

Firma real: calculateQuote(BillingInput, TaxPolicy), con consumos/país y {version: taxPolicyVersion, ratesByCountry}. Tramos/versiones base residen en shared mediante getPricingConfiguration. No acepta tramos arbitrarios de configuración. Comparar pricingVersion y secuencia de tramos (tierFrom/tierTo/unitPriceCents) con ese getter y consumptionLimits con CONSUMPTION_LIMITS. Si difieren, bloquear preview/guardado con aviso y recarga/reintento, conservando borrador; sin inventar calculateQuote(config), precios de reserva u otro motor.

TaxPolicy es una entrada validada del motor: versión y tasas proceden del servidor, sin importar configuración privada del backend ni hardcodear sus versiones/tasas en web. Congelar versión/tasa en preview. Si cambia después de un preview compatible y el servidor confirma 201, mostrar el DTO con aviso de RF5 incluso con versiones distintas; no aplicar a resultados guardados el bloqueo de compatibilidad del preview.

Borrador string validado antes de motor/POST. Slider/número 0..1000 paso 1. Inicializar los tres consumos con el borrador «0» y seleccionar EUR; no solicitar FX para EUR ni guardar automáticamente al montar o cambiar campos. Borrador inválido no deja presupuesto anterior presentado como vigente ni guardar habilitado.

## Conversión

Usar convertCurrency desde totalCents EUR y tasa decimal validada, sin convertir líneas/base/impuesto ni encadenar monedas. EUR sin red; USD/GBP con cliente existente, fecha/atribución y estados. Ignorar respuestas antiguas al cambiar cliente/divisa; no cancelar destructivamente solicitudes FX compartidas.

Selector EUR/USD/GBP solo para el total del simulador y el resultado confirmado. Tras un 201, la conversión se obtiene del totalCents del DTO autoritativo, no del preview anterior. Desglose e historial de 007 permanecen en EUR, sin selector ni solicitudes FX del historial.

Fallo/caducidad FX: retirar conversión no válida y mostrar total identificado como EUR, aviso y «Reintentar conversión». Un fallo del proveedor no bloquea calcular/guardar EUR si cliente, configuración y consumos son válidos. No cambiar importes persistidos ni presentar EUR con etiqueta USD/GBP. El reintento de FX no repite POST; volver a EUR no requiere red. El mismo comportamiento aplica al resultado confirmado tras guardar.

## Guardado y recuperación

Congelar preview/datos al enviar. POST con exactamente cuatro campos, sin precios/país/plan. Una petición pendiente, sin guardado en efectos ni retries automáticos. Exigir 201 y validar SimulationDto/identidad. Comparar pricingVersion, taxPolicyVersion, baseCents, taxCents y totalCents con preview congelado, no un borrador posterior.

422: campos/país; 404: cliente; 503: servicio/DB; errores internos sanitizados. Conservar valores sin filas confirmadas ficticias. Red/timeout/201 ilegible: explicar posible guardado y ofrecer consultar historial antes de repetir. Abortar navegador no prueba que servidor no guardó.

Tras 201 permanecer en pantalla, anunciar éxito y presentar el DTO autoritativo con el aviso de discrepancia cuando proceda. La conversión usa su totalCents; el resultado confirmado debe distinguirse de cualquier borrador posterior. «Volver al cliente» conduce a ficha/historial consultados de nuevo, conservando contexto previo. Sin redirección automática, GET individual nuevo o «Ver detalle» implícito.

## Diseño

Ruta /customers/:id/simulations/new desde ficha; breadcrumbs y retorno contextual. PDF adaptado, dos columnas desktop/una móvil, tokens/CSS Modules/sistema y semántica accesible. Sin nuevas dependencias previstas.

## Pruebas previstas

- WEB-SIM-01: controles sincronizados, entradas temporales y fronteras/límites reales.
- WEB-SIM-02: storage/API conservados/enviados sin alterar precio ni multiplicador por plan.
- WEB-CONFIG-008: cliente/configuración/país, DTO completo y estrategia de compatibilidad confirmada.
- WEB-FX-008: EUR sin red, USD/GBP solo total, fechas/atribución, caché/caducidad/error/reintento y carreras.
- WEB-SAVE-008: payload/201/DTO, envío único, 422/404/503 y resultado incierto.
- WEB-POLICY-008: versiones/importes distintos al preview congelado, aviso y resultado autoritativo sin alterar guardado.
- WEB-HISTORY-008: integración, actualización/orden/recarga/retorno, comprobación incierta sin fila fantasma.
- E2E-SIMULATIONS-008: alta→ficha→simulación→historial, discrepancia y fallo FX.
- VISUAL-008: 320/390/768/1440, zoom/reflujo, teclado/foco/contraste y PDF adaptado.

Conservar Vitest/RTL/node:test y extender Playwright existente con DB/puertos propios y limpieza segura. FX en suites con fixtures controlados: no depender del proveedor ni atribuir resultados simulados como integración externa real.

Controles: pnpm lint, pnpm typecheck, pnpm format:check, pnpm build, pnpm test, pnpm test:e2e; test:docs tras documentación. Gates sin otros controles de código concurrentes. Resultados de 007 no acreditan 008.

## Procedimiento

Decisiones de preparación completadas; ejecutar cada tarea solo por instrucción de Alex. Solo cinco documentos en esta preparación; ai-workspace excluido hasta nueva indicación. Sin commits/pushes/datos existentes. Si después se autoriza registro, distinguir preparación retrospectiva de evidencia contemporánea.
