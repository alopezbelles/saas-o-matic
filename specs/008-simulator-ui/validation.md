# Validación 008

Estado: decisiones 008-C01…C07 confirmadas, T01 completada técnicamente. Inputs/navegación/configuración probados; RF1/RF2 parciales hasta cálculo/guardado. T02–T05 pendientes. Los estados de preparación siguientes conservan su contexto histórico.

## Matriz prevista

| RF      | Tareas      | Pruebas previstas                                  | Resultado real         |
| ------- | ----------- | -------------------------------------------------- | ---------------------- |
| 008-RF1 | T01/T02/T05 | WEB-SIM-01, WEB-CONFIG-008, E2E-SIMULATIONS-008    | PARCIAL: INPUTS/CONFIG |
| 008-RF2 | T01/T02/T05 | WEB-SIM-02, E2E-SIMULATIONS-008                    | PARCIAL: INPUTS        |
| 008-RF3 | T03/T04/T05 | WEB-SAVE-008, WEB-HISTORY-008, E2E-SIMULATIONS-008 | NO EJECUTADO           |
| 008-RF4 | T02/T04/T05 | WEB-FX-008, WEB-HISTORY-008, E2E-SIMULATIONS-008   | NO EJECUTADO           |
| 008-RF5 | T03/T04/T05 | WEB-POLICY-008, E2E-SIMULATIONS-008                | NO EJECUTADO           |

## T01 — Pantalla, cliente/configuración e inputs

16 de noviembre de 2026, base d67aab0, Git inicial limpio. T01 autorizada por Alex, sin levantar exclusión ai-workspace. [Instrucción previa](plan.md#reutilización-y-responsabilidades). Conformidad técnica de T01; aceptación humana final no registrada.

Ruta/acceso desde ficha, breadcrumbs/retorno con búsqueda y historyOffset preservados, ID inválido/404/reintentos y país sin tarifa. Cliente y configuración usan recursos GET independientes cancelables. DTO completo validado por formato y compatibilidad separada de versión/tramos/límites; tasas/versiones fiscales del servidor, sin duplicar política. Controles iniciales cero/EUR, slider 0..1000 paso 1 y borradores string con errores asociados. Vacío/fracción/exceso no se coercionan a cero; slider conserva último valor válido hasta corregir. Cambio de cliente inicia borrador nuevo. Sin cálculo, FX, selector de moneda o POST de simulación en T01.

WEB-SIM-01/02 y WEB-CONFIG-008 ejecutados: límites/fronteras, valores inválidos, sincronización, contrato/compatibilidad, estados/reintentos/retorno y configuración tardía ignorada. Se actualiza la prueba de ficha de 007 para el acceso autorizado a nueva simulación, manteniendo ausencia de «Ver detalle». Shared solo añade export público de assertConsumption existente, sin cambios de reglas. test:docs identifica ahora 008 como spec activa.

pnpm.cmd test devuelve código 0: 36 shared + 12 API unitarias + 49 integración + 22 node web + 113 componentes/transporte + 1 gates + 2 docs = 235 pruebas. Gates sin otros controles de código simultáneos. pnpm.cmd test:e2e devuelve código 0: 13 correctas, incluidas 2 nuevas de T01, sin retries/omisiones. Las dos nuevas verifican API/Vite/SQLite real temporal, control por teclado/valores inválidos, ausencia de FX/POST, país no soportado y retorno contextual. Cuatro anchos 320/390/768/1440 sin desbordamiento; escritorio/móvil inspeccionados. Regresión completa de 007 conservada.

Incidencias corregidas: guarda de shared no exportada (se expone sin duplicarla); opción de locator Playwright usada por error en RTL (retirada); primera suite de componentes 111 correctas/1 fallo del harness al esperar aborto de una petición ya completada (se comprueba la petición de configuración pendiente). Se añade regresión de reinicio por cliente y suite global posterior correcta. No se atribuye éxito a primeras ejecuciones fallidas.

Lint/typecheck/build pasan. Salida global y capturas/reportes temporales bajo .cache/008-t01-test.txt y .cache/007-e2e, sin versionarlos ni trasladarlos a ai-workspace. API/lockfile sin cambios, sin dependencias nuevas o DB existente; recursos propios cerrados/limpiados. Zoom/contraste exhaustivos de la pantalla final y flujos de precio/FX/guardado quedan para tareas posteriores. No commits/pushes.

Cierre documental: pnpm.cmd test:docs (2 pruebas), pnpm.cmd format:check y git diff --check correctos, código 0. Auditoría git diff --exit-code -- ai-workspace apps/api pnpm-lock.yaml devuelve 0; .cache/002-tests vacío.

## Preparación documental

Revisados contratos shared, firma real de calculateQuote, adaptadores y decisiones 006/007. Decisiones 008-C01…C07 confirmadas en clarifications.md, sin decisiones funcionales imprescindibles abiertas. Validación técnica no es aceptación humana ni autorización para implementar toda la spec de golpe.

Controles reales de esta adaptación: pnpm.cmd test:docs devuelve código 0 con 2 pruebas correctas; pnpm.cmd exec prettier --check specs/008-simulator-ui devuelve código 0. Prettier aplicado exclusivamente a estos cinco documentos. git status --short solo muestra specs/008-simulator-ui como carpeta nueva. No ejecutados lint/typecheck/build/pruebas funcionales por tratarse de documentación. Sin ai-workspace por indicación de Alex.

## Al implementar

- Inputs/cliente/configuración, límites reales y estrategia de compatibilidad confirmada.
- pricingVersion/tramos/límites incompatibles bloquean preview/guardado con aviso/recarga/reintento; política fiscal validada desde servidor sin hardcodearla. Cambio posterior al preview con 201: éxito autoritativo con aviso, sin rechazo/reenvío.
- Tres consumos inicialmente a cero y EUR, sin petición FX para EUR ni POST automático al montar/cambiar campos.
- Sincronización/vacío/fracción/negativo/exceso y fronteras monetarias con motor compartido.
- Selector EUR/USD/GBP solo en total del simulador/resultado confirmado, conversión desde totalCents autoritativo después de guardar y desglose/historial EUR sin selector FX; tasas/fechas/atribución/error/carreras con fixtures, separando proveedor real.
- Fallo/caducidad FX conserva total identificado como EUR y permite guardado válido en EUR; aviso/reintento sin tasa caducada ni repetición de POST, también en resultado confirmado.
- POST exacto/201/DTO/identidad/envío único/422/404/503/red/timeout/201 ilegible, conservando borrador.
- Discrepancia contra preview congelado y aviso/resultado autoritativo sin cambiar persistencia.
- Tras 201 permanecer en simulador, anunciar éxito, conservar resultado/aviso y ofrecer «Volver al cliente» con historial actualizado; sin redirección automática.
- Historial de 007 actualizado, orden/recarga/retorno y resultado incierto sin filas ficticias.
- E2E/revisión visual con API/SQLite temporales y limpieza verificada, nunca DB existente.
- Controles del plan; gates sin otros controles de código concurrentes. Salidas reales y controles omitidos explícitos.

Autorización de implementación, conformidad técnica y revisión humana son distintas. Sin aceptación humana final ni commits/pushes.
