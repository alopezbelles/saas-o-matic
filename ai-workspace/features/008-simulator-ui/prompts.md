# 008 Simulator UI — Prompts consolidados

## 1. Preparar la pantalla y validar su configuración

**Contexto y objetivo.** Clientes, configuración y navegación ya existen. Prepara el simulador del cliente sin adelantar cálculo o guardado.

**Instrucciones.** Integra ruta, breadcrumbs y retorno contextual. Carga y valida cliente y configuración, comprobando versiones, tramos y límites contra shared. Conserva borradores de texto y sincroniza slider y número con los límites acordados, partiendo de cero y EUR. Distingue ID inválido, ausencia de cliente y fallos recuperables.

**Criterio de aceptación.** Una entrada inválida o configuración incompatible no puede producir presupuesto guardable. Los reintentos deben conservar consumos y las respuestas tardías no deben reemplazar el contexto vigente.

## 2. Componer presupuesto y conversión visual

**Contexto y objetivo.** Conecta los controles con el motor y construye la composición de consumos y resumen de la referencia.

**Instrucciones.** Reutiliza calculateQuote con la política validada del servidor, sin implementar tarifas en JSX. Presenta desglose e impuestos en EUR y convierte únicamente el total mediante 006. Expón fecha, atribución y estados FX; retira conversiones caducadas y evita consultar por cada cambio de importe. Reutiliza tokens, componentes y reglas responsive.

**Criterio de aceptación.** Comprueba fronteras con oráculos independientes, controles sincronizados y estados de conversión con proveedor controlado. Un fallo FX conserva EUR disponible sin ocultarse como éxito extranjero.

## 3. Guardar y presentar el resultado autoritativo

**Contexto y objetivo.** Completa la simulación sin confundir previsualización y registro persistido.

**Instrucciones.** Congela payload y presupuesto al enviar, bloquea doble envío y valida respuesta, identidad y consumos. Presenta los importes y snapshots del servidor sin recalcularlos. Si difieren del presupuesto previo, muestra aviso y conserva la confirmación. Mantén campos ante errores y trata red, timeout o éxito ilegible como resultado incierto, sin reenvío automático.

**Criterio de aceptación.** Verifica cambios de política entre preview y guardado, errores de campo e indisponibilidad. La conversión posterior usa el total confirmado y no modifica el registro EUR; preparar otra simulación exige una acción explícita.

## 4. Recuperar el historial y verificar el recorrido

**Contexto y objetivo.** Integra el resultado con la ficha y comprueba la experiencia completa.

**Instrucciones.** Reutiliza el historial de 007, conserva contexto y aviso de discrepancia al volver y permite actualizar sin duplicar componentes. Ofrece comprobar un guardado incierto en otra pestaña manteniendo el borrador original. Extiende las pruebas existentes con API/SQLite temporal y FX controlado; revisa teclado, foco, contraste y reflujo.

**Criterio de aceptación.** Demuestra alta→simulación→resultado→historial, persistencia y recuperación sin POST adicional. Conserva fallos y límites reales; las pruebas con fixtures no acreditan una nueva consulta al proveedor externo ni aceptación humana.
