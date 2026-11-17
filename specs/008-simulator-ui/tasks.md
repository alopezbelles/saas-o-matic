# Tareas 008

Estado: decisiones 008-C01…C07 confirmadas. T01–T05 completadas técnicamente. IDs canónicos 008-T01…T05. Resultados de cierres parciales conservados como historial. Aceptación humana final pendiente. Sin commits/pushes del agente.

## T01 — Pantalla, cliente/configuración e inputs

- [x] **008-T01**. RF1/RF2 y estados previos de RF3, sin completar esos RF funcionales.
- Dependencia: decisiones aplicables confirmadas e instrucción de ejecución.
- Acciones: ruta/breadcrumbs/enlace desde ficha, cliente/configuración completa, ID/404/país, borrador string y controles sincronizados con límites shared. Slider 0..1000 paso 1; tres consumos iniciales a cero y EUR, sin guardado automático.
- Destinos propuestos: SimulationCreatePage/ConsumptionInputs, adaptadores/hooks; rutas/ficha y contrato config existente. Sin endpoints/dependencias nuevas.
- Pruebas: WEB-SIM-01/02 y WEB-CONFIG-008; conservar alta/listado/ficha.
- Hecho cuando: pantalla contextual con estados, campos inválidos no guardables y sin divergencia de configuración silenciosa. Compatibilidad de pricingVersion/tramos/límites comprobada contra shared; incompatibilidad bloquea preview/guardado con aviso/recarga/reintento y borrador conservado. Política fiscal validada desde servidor, sin catálogo duplicado.
- Evidencia: [validación T01](validation.md#t01--pantalla-clienteconfiguración-e-inputs), 235 pruebas globales y 13 E2E correctas (2 nuevas de T01). Pantalla/inputs/configuración probados; cálculo/precio/FX/POST pendientes de sus tareas.

## T02 — Preview, desglose y conversión

- [x] **008-T02**. RF1/RF2/RF4, con guardado/resultado confirmado pendientes de T03.
- Dependencia: T01; decisiones FX/compatibilidad confirmadas.
- Acciones: motor con firma real y política validada, desglose EUR, selector EUR/USD/GBP solo para total del simulador y resultado confirmado mediante 006; fechas/atribución/estados/carreras. Historial permanece EUR sin selector FX.
- Destinos propuestos: PricingBreakdown/SimulationSummary y hooks; reutilizar motor/cliente sin tarifas nuevas.
- Pruebas: WEB-SIM-01/02, WEB-CONFIG-008, WEB-FX-008 y monetarias conservadas; ante fallo/caducidad FX, total EUR identificado y reintento explícito, manteniendo guardado EUR disponible cuando el resto sea válido.
- Hecho cuando: preview corresponde al borrador válido, sin cargos extra, conversión de líneas o configuración incompatible presentada como válida.
- Evidencia: [validación T02](validation.md#t02--preview-desglose-y-conversión), 247 pruebas globales y 16 E2E correctas; oráculos EUR, FX controlado/errores/caducidad/carreras, dos columnas y reflujo comprobados. Sin POST; integración del resultado guardado en T03.

## T03 — Guardado autoritativo y discrepancias

- [x] **008-T03**. RF3/RF5; integración completa del historial pendiente de T04.
- Dependencia: T02; destino tras 201 confirmado en 008-C05.
- Acciones: POST exacto/201/DTO/identidad, envío único, preview congelado/comparación con servidor y aviso. 422/404/503/red/timeout/201 ilegible con valores retenidos, sin retries.
- Destinos propuestos: adaptador POST, hook/estado y resultado/aviso en el propio simulador, con confirmación accesible y «Volver al cliente»; sin redirección automática.
- Pruebas: WEB-SAVE-008/WEB-POLICY-008, cambio entre preview/201 y resultado incierto. Un 201 con versiones/importes diferentes sigue siendo éxito confirmado con DTO/aviso, sin rechazo por compatibilidad local del preview.
- Hecho cuando: resultado del servidor visible y discrepancia explicada sin modificar guardado.
- Evidencia: [validación T03](validation.md#t03--guardado-autoritativo-y-discrepancias), WEB-SAVE-008/WEB-POLICY-008 y navegador con API/SQLite temporal. Resultado confirmado, errores e incertidumbre comprobados; T04/T05 pendientes.

## T04 — Integración con historial y recuperación

- [x] **008-T04**. RF3/RF4/RF5; resultado confirmado permanece en el simulador.
- Dependencia: T03.
- Acciones: integrar historial de 007, actualización/retorno y comprobación tras resultado incierto; conservar paginación/contexto/EUR. No otro SimulationHistory ni «Ver detalle».
- Destinos existentes según necesidad: CustomerDetailPage, SimulationHistory y navegación de pantalla nueva.
- Pruebas: WEB-HISTORY-008; persistencia/orden/recarga, sin filas optimistas ni pérdida del aviso de discrepancia al navegar.
- Hecho cuando: guardado confirmado aparece consultando API y el posible guardado puede comprobarse sin reenvío automático.
- Evidencia: [validación T04](validation.md#t04--integración-con-historial-y-recuperación), WEB-HISTORY-008 con retorno/paginación/recarga, comprobación en otra pestaña, actualización/reintento y discrepancia persistente. Tres E2E nuevas, 23 Playwright correctas en total. T05 pendiente.

## T05 — Flujo comercial, revisión visual y cierre

- [x] **008-T05**. RF1/RF2/RF3/RF4/RF5.
- Dependencia: T04.
- Acciones: extender apps/web/e2e/fixtures, flujo comercial/errores/discrepancias/FX y diseño/teclado/contraste/reflujo; documentación autorizada con resultados reales.
- Pruebas: E2E-SIMULATIONS-008/VISUAL-008 y controles del plan; gates sin otros controles concurrentes.
- Hecho cuando: evidencias reales, regresiones conservadas, recursos temporales cerrados/limpiados y límites explícitos. Conformidad técnica separada de aceptación humana.
- Evidencia: [cierre T05](validation.md#t05--flujo-comercial-revisión-visual-y-cierre-global), 273 pruebas globales y 31 E2E correctas. Flujo alta→historial con FX/discrepancia, cuatro anchos, teclado/foco, contraste y layout ampliado revisados. Aceptación humana final pendiente.

## Registro

Se mantiene la exclusión de ai-workspace por indicación de Alex. Los resultados ejecutados constan en validation.md y se distinguen de las previsiones originales. Sin commits/pushes ni cambios de datos existentes.
