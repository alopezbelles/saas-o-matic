# Aclaraciones 008

Preparación documental consolidada, sin código ni ai-workspace. Decisiones heredadas confirmadas en sus specs y 008-C01…C07 confirmadas por Alex una a una. No quedan decisiones funcionales imprescindibles abiertas para este alcance.

## Decisiones vigentes

| Origen        | Acuerdo existente                                                                         | Aplicación                                                   |
| ------------- | ----------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| D04 / 002–005 | Enteros: users 0..1000, storageGb 0..10000, apiCalls 0..10000000                          | UI/contratos/guardas coinciden; sin máximos antiguos.        |
| D02 / 002–004 | DEMO_BASIC/DEMO_PRO sin diferencias de precio; storage/API metadatos sin cargo            | No inventar cuotas/multiplicadores.                          |
| D05 / 005–006 | EUR/snapshots/versiones persistidos, sin FX                                               | Sin recálculo/conversión del registro guardado.              |
| 006-C01…C04   | ExchangeRate-API directo, caché por pestaña/5 s, EUR/USD/GBP, solo total y BigInt/half-up | Reutilizar servicio; ubicación UI/fallo FX se decide debajo. |
| D07 / 007     | Navegación superior, tokens/CSS Modules, fuente del sistema y PDF revisado                | Sin sidebar/Tailwind/librería UI.                            |
| 007 T04/T05   | Ficha/historial y Playwright aislado existentes                                           | Integrar sin historial/runner paralelos.                     |

Referencias: [002](../002-persistence/clarifications.md), [004](../004-billing/clarifications.md), [005](../005-simulations-api/clarifications.md), [006](../006-currency/clarifications.md), [007](../007-customers-ui/clarifications.md) y [decisiones globales](../../docs/decisions.md). Alex confirmó después consulta FX desde su navegador según MEMORY; no acredita integración UI 008.

## Decisiones de 008

| ID      | Punto               | Propuesta o acuerdo                                                                                                                                                                                                                    | Estado                                   |
| ------- | ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------- |
| 008-C01 | Navegación          | /customers/:id/simulations/new desde «Nueva simulación» en ficha; contexto conservado y sin sección global                                                                                                                             | CONFIRMADO por Alex en esta preparación. |
| 008-C02 | Slider              | 0..1000, paso 1, mismo rango que campo numérico                                                                                                                                                                                        | CONFIRMADO por Alex en esta preparación. |
| 008-C03 | Valores iniciales   | Tres consumos a cero, EUR como divisa inicial y sin guardado automático                                                                                                                                                                | CONFIRMADO por Alex en esta preparación. |
| 008-C04 | Ubicación FX        | Selector EUR/USD/GBP solo para total del simulador y resultado confirmado; base, impuesto, desglose e historial de 007 en EUR, sin selector FX en historial                                                                            | CONFIRMADO por Alex en esta preparación. |
| 008-C05 | Destino tras 201    | Permanecer en el simulador con resultado autoritativo, conversión del total y aviso de discrepancia; «Volver al cliente» permite consultar el historial actualizado, sin redirección automática                                        | CONFIRMADO por Alex en esta preparación. |
| 008-C06 | Fallo FX            | Mostrar total EUR identificado, aviso y «Reintentar conversión», permitiendo guardar EUR si el resto es válido; sin tasas caducadas ni POST automático al reintentar FX                                                                | CONFIRMADO por Alex en esta preparación. |
| 008-C07 | Configuración/motor | Comprobar pricingVersion/tramos/límites contra shared y bloquear preview/guardado incompatibles con aviso/recarga/reintento. Si cambia tras preview válido y servidor confirma 201, aceptar DTO autoritativo con aviso; sin otro motor | CONFIRMADO por Alex en esta preparación. |

## Alcance y autorización

«Ver detalle»/pantalla individual de simulación fuera de 008; incorporarlos requiere decisión separada y revisión de contratos/rutas. No se deducen del PDF.

Edición limitada a spec.md, plan.md, tasks.md, clarifications.md y validation.md. Sin ai-workspace/globales/datos existentes. Consolidar confirmaciones antes de implementar tareas por fases. Sin commits/pushes ni aceptación humana anticipada.
