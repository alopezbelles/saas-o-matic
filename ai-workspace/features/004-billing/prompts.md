# 004 Billing — Prompts consolidados

## 1. Delimitar el dominio y sus dependencias

**Contexto y objetivo.** El proyecto dispone de infraestructura, persistencia y clientes, pero necesita el motor económico. Ajusta la propuesta al monorepo y resuelve las decisiones antes de implementar.

**Instrucciones.** Sitúa el cálculo puro en shared, reutiliza los límites existentes y recibe la política fiscal como dato explícito. Documenta los acuerdos sobre precisión, entrada y salida, sin añadir paquetes, dependencias o módulos por país. Mantén fuera de esta entrega HTTP, DB, UI y FX.

**Criterio de aceptación.** El motor debe poder probarse aisladamente y dejar clara la separación entre reglas de cálculo, configuración e integración posterior.

## 2. Preparar oráculos e implementar los tramos

**Contexto y objetivo.** Las reglas acumulativas están definidas. Implementa la base y su desglose con resultados esperados independientes.

**Instrucciones.** Prepara fixtures de fronteras y casos representativos antes de incorporar las funciones productivas. Acumula el consumo de cada tramo sin aplicar el último precio a todos los usuarios. Reutiliza las guardas de entrada y las convenciones monetarias acordadas; conserva pruebas anteriores.

**Criterio de aceptación.** Comprueba fronteras, consumos inválidos, desglose y comportamiento incremental. El éxito de los fixtures por sí solo no acredita el funcionamiento del motor.

## 3. Aplicar dinero exacto e impuestos explícitos

**Contexto y objetivo.** Completa el cálculo usando la política demo acordada y una política monetaria verificable.

**Instrucciones.** Centraliza guardas y conversión segura, usa BigInt en operaciones intermedias y aplica half-up una sola vez al impuesto sobre la base completa. Valida política y país, distinguiendo tasa cero de tasa ausente. Rechaza importes inválidos o inseguros sin coerción o resultado parcial. No consultes tasas en red ni conviertas a otras divisas.

**Criterio de aceptación.** Utiliza casos independientes de redondeo, ausencia de tasa y overflow. Devuelve importes seguros serializables y versiones correspondientes a las reglas aplicadas.

## 4. Componer y verificar el presupuesto completo

**Contexto y objetivo.** Integra los componentes ya comprobados en una función determinista, manteniendo el contrato compatible con el histórico existente.

**Instrucciones.** Valida todos los consumos aunque solo usuarios genere coste. Comprueba coherencia entre cantidades, subtotales e importes finales, sin mutar entradas o configuración. Añade pruebas que distingan el redondeo global del redondeo por tramo y verifica compatibilidad estructural con persistencia sin abrir una DB. Ejecuta los controles pertinentes y registra incidencias con su alcance real.

**Criterio de aceptación.** Los resultados deben ser repetibles, explicables y respaldados por casos productivos. No declares un cierre global mientras exista un control pendiente; separa aceptación humana y conformidad técnica.
