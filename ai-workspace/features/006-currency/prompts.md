# 006 Currency — Prompts consolidados

## 1. Delimitar la conversión y sus responsabilidades

**Contexto y objetivo.** El sistema ya calcula y guarda resultados EUR. Prepara conversión orientativa sin alterar facturación o persistencia.

**Instrucciones.** Adapta la propuesta al monorepo y confirma proveedor, monedas y precisión antes de implementar. Separa dominio puro, contrato externo y cliente HTTP. Mantén fuera de esta entrega pantallas, hooks y selector; prepara contratos y fixtures independientes antes de las funciones productivas.

**Criterio de aceptación.** Conserva EUR como base y limita la conversión al total. No añadas paquetes, dependencias externas, endpoints o snapshots FX.

## 2. Implementar conversión exacta y acotada

**Contexto y objetivo.** Reutiliza las utilidades monetarias para convertir sin introducir cálculos monetarios flotantes.

**Instrucciones.** Valida importe, moneda y texto decimal de la tasa. Acota longitud y exponente antes de construir valores BigInt, reutiliza el redondeo half-up y comprueba el rango seguro de salida. EUR debe ser identidad sin tasa ni red; no modifiques el cálculo fiscal.

**Criterio de aceptación.** Contrasta oráculos independientes, mitades y valores adyacentes, notación científica, cero, entradas inválidas y overflow. La función no debe depender del reloj o del proveedor.

## 3. Validar el proveedor y controlar su disponibilidad

**Contexto y objetivo.** Una respuesta externa solo puede usarse tras validar su contenido y vigencia.

**Instrucciones.** Recibe datos unknown y valida éxito, base, tasas y fechas; normaliza metadatos y atribución con salida inmutable. Implementa transporte con fetch y reloj inyectables, petición concurrente compartida, caché hasta caducidad y timeout que cubra también el cuerpo. No envíes datos privados ni importes.

**Criterio de aceptación.** Prueba errores HTTP, red, payload, timeout, respuesta tardía y expiración. Un fallo debe liberar la petición y permitir recuperación explícita sin publicar datos caducados ni reintentar automáticamente.

## 4. Componer y verificar con evidencia diferenciada

**Contexto y objetivo.** Comprueba cliente y conversión juntos, preservando las funcionalidades anteriores.

**Instrucciones.** Usa tasas y reloj controlados para probar composición, reutilización y recuperación. Ejecuta los controles pertinentes, conserva incidencias y revisa que API e histórico permanezcan intactos. Comprueba por separado el acceso desde navegador; una petición de Node no acredita CORS. Si el entorno impide observar el resultado, declara la limitación.

**Criterio de aceptación.** Distingue pruebas simuladas, comprobación externa y aceptación humana. No añadas un proxy o sustituyas proveedor sin decisión posterior, ni atribuyas a esta entrega una interfaz todavía diferida.
