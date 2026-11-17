# 008 Simulator UI — Iteraciones del trabajo con IA

## Configuración y controles antes del presupuesto

La preparación adaptó la propuesta a los contratos y módulos disponibles, cerrando las decisiones antes de implementar por tareas. Codex añadió pantalla contextual, cliente/configuración y borradores sincronizados, sin cálculo, conversión o guardado en T01.

Al revisar esa primera pantalla, la dirección del proyecto preguntó por su diferencia con la referencia visual. La composición completa correspondía al bloque siguiente. T02 incorporó las dos tarjetas, slider y número alineados, desglose y total destacado reutilizando tokens y estilos de 007.

En T01 se expuso una guarda compartida existente para evitar duplicarla. También se corrigieron errores del harness: una opción de locator ajena a RTL y una expectativa de aborto sobre una petición ya completada. La comprobación se dirigió a la petición pendiente y las regresiones posteriores pasaron.

## Preview y FX sin duplicar reglas

Codex reutilizó el motor puro y el cliente de tasas, separando cálculo y presentación. La compatibilidad de configuración se comprobó antes del preview; los borradores inválidos retiraron presupuestos anteriores como resultados vigentes.

El total convertido incorporó vigencia, errores y recuperación explícita, manteniendo EUR como alternativa. Las pruebas utilizaron tasas controladas y comprobaron carreras y caducidad; no acreditaron una nueva conexión real al proveedor. Desglose e historial permanecieron en EUR.

## Guardado y recuperación contextual

El guardado congeló consumos y presupuesto, validó el resultado del servidor y mantuvo su importe autoritativo ante diferencias de política. La comprobación de un commit real con respuesta ilegible permitió verificar el estado incierto sin fabricar filas confirmadas ni reenviar automáticamente.

La integración posterior conservó historial, paginación y aviso al volver. Se añadió actualización explícita y comprobación en otra pestaña con el formulario original intacto. Una ejecución global falló por una aserción de foco que no esperaba el efecto de React tras aparecer el alert; se ajustó la espera y la repetición pasó. El detalle permanece en la [validación T04](../../../specs/008-simulator-ui/validation.md#t04--integración-con-historial-y-recuperación).

## Revisión final y límites de la evidencia

T05 comprobó el recorrido comercial con cambio de política y fallo/recuperación FX, además de cuatro anchos, teclado, contraste y layout ampliado. Los controles globales y E2E pasaron; no se detectaron fallos funcionales en la primera ejecución E2E de ese cierre. También se corrigió el README que aún describía funcionalidades disponibles como futuras.

El [índice de evidencias](../../testing/008-010-evidence-index.md) distingue resultados conservados de reportes y capturas sobrescribibles. La revisión no equivale a certificación exhaustiva, CORS externo nuevo o aceptación humana. El defecto de texto largo detectado posteriormente pertenece a 009 y no se atribuye a 008.
