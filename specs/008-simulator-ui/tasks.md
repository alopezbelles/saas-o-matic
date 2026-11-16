# Tareas 008

Estado: preparación documental consolidada, decisiones 008-C01…C07 confirmadas. Ninguna tarea implementada; ejecutar por fases solo por indicación de Alex. IDs canónicos 008-T01…T05.

## T01 — Pantalla, cliente/configuración e inputs

- [ ] **008-T01**. RF1/RF2 y estados previos de RF3.
- Dependencia: decisiones aplicables confirmadas e instrucción de ejecución.
- Acciones: ruta/breadcrumbs/enlace desde ficha, cliente/configuración completa, ID/404/país, borrador string y controles sincronizados con límites shared. Slider 0..1000 paso 1; tres consumos iniciales a cero y EUR, sin guardado automático.
- Destinos propuestos: SimulationCreatePage/ConsumptionInputs, adaptadores/hooks; rutas/ficha y contrato config existente. Sin endpoints/dependencias nuevas.
- Pruebas: WEB-SIM-01/02 y WEB-CONFIG-008; conservar alta/listado/ficha.
- Hecho cuando: pantalla contextual con estados, campos inválidos no guardables y sin divergencia de configuración silenciosa. Compatibilidad de pricingVersion/tramos/límites comprobada contra shared; incompatibilidad bloquea preview/guardado con aviso/recarga/reintento y borrador conservado. Política fiscal validada desde servidor, sin catálogo duplicado.
- Evidencia: NO EJECUTADO.

## T02 — Preview, desglose y conversión

- [ ] **008-T02**. RF1/RF2/RF4.
- Dependencia: T01; decisiones FX/compatibilidad confirmadas.
- Acciones: motor con firma real y política validada, desglose EUR, selector EUR/USD/GBP solo para total del simulador y resultado confirmado mediante 006; fechas/atribución/estados/carreras. Historial permanece EUR sin selector FX.
- Destinos propuestos: PricingBreakdown/SimulationSummary y hooks; reutilizar motor/cliente sin tarifas nuevas.
- Pruebas: WEB-SIM-01/02, WEB-CONFIG-008, WEB-FX-008 y monetarias conservadas; ante fallo/caducidad FX, total EUR identificado y reintento explícito, manteniendo guardado EUR disponible cuando el resto sea válido.
- Hecho cuando: preview corresponde al borrador válido, sin cargos extra, conversión de líneas o configuración incompatible presentada como válida.
- Evidencia: NO EJECUTADO.

## T03 — Guardado autoritativo y discrepancias

- [ ] **008-T03**. RF3/RF5.
- Dependencia: T02; destino tras 201 confirmado en 008-C05.
- Acciones: POST exacto/201/DTO/identidad, envío único, preview congelado/comparación con servidor y aviso. 422/404/503/red/timeout/201 ilegible con valores retenidos, sin retries.
- Destinos propuestos: adaptador POST, hook/estado y resultado/aviso en el propio simulador, con confirmación accesible y «Volver al cliente»; sin redirección automática.
- Pruebas: WEB-SAVE-008/WEB-POLICY-008, cambio entre preview/201 y resultado incierto. Un 201 con versiones/importes diferentes sigue siendo éxito confirmado con DTO/aviso, sin rechazo por compatibilidad local del preview.
- Hecho cuando: resultado del servidor visible y discrepancia explicada sin modificar guardado.
- Evidencia: NO EJECUTADO.

## T04 — Integración con historial y recuperación

- [ ] **008-T04**. RF3/RF4/RF5; resultado confirmado permanece en el simulador.
- Dependencia: T03.
- Acciones: integrar historial de 007, actualización/retorno y comprobación tras resultado incierto; conservar paginación/contexto/EUR. No otro SimulationHistory ni «Ver detalle».
- Destinos existentes según necesidad: CustomerDetailPage, SimulationHistory y navegación de pantalla nueva.
- Pruebas: WEB-HISTORY-008; persistencia/orden/recarga, sin filas optimistas ni pérdida del aviso de discrepancia al navegar.
- Hecho cuando: guardado confirmado aparece consultando API y el posible guardado puede comprobarse sin reenvío automático.
- Evidencia: NO EJECUTADO.

## T05 — Flujo comercial, revisión visual y cierre

- [ ] **008-T05**. RF1/RF2/RF3/RF4/RF5.
- Dependencia: T04.
- Acciones: extender apps/web/e2e/fixtures, flujo comercial/errores/discrepancias/FX y diseño/teclado/contraste/reflujo; documentación autorizada con resultados reales.
- Pruebas: E2E-SIMULATIONS-008/VISUAL-008 y controles del plan; gates sin otros controles concurrentes.
- Hecho cuando: evidencias reales, regresiones conservadas, recursos temporales cerrados/limpiados y límites explícitos. Conformidad técnica separada de aceptación humana.
- Evidencia: NO EJECUTADO.

## Registro

No registrar esta preparación en ai-workspace por indicación de Alex. Las pruebas anteriores son previsiones. Sin commits/pushes ni cambios de datos existentes.
