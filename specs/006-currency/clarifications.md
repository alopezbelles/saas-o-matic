# Aclaraciones 006

Alex excluyó toda interfaz y confirmó expresamente estas propuestas durante la preparación documental. Implementación pendiente por tarea.

| ID      | Decisión confirmada                                                            | Consecuencia                                                                                                  |
| ------- | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------- |
| 006-C01 | ExchangeRate-API directo desde navegador, sin proxy ni clave                   | Base EUR; si CORS falla, consultar alternativa antes de cambiar arquitectura.                                 |
| 006-C02 | Caché en memoria por pestaña hasta caducidad del proveedor, timeout 5 segundos | Sin persistencia, tasas caducadas ni reintentos automáticos; recuperación mediante nueva solicitud explícita. |
| 006-C03 | EUR/USD/GBP y conversión solo del total final                                  | Exponente 2 por moneda; sin líneas convertidas ni snapshots FX.                                               |
| 006-C04 | Enteros/BigInt, decimal validado y half-up una sola vez al final               | Reutilizar utilidades; sin Zod, decimal.js ni otras dependencias externas nuevas.                             |
| 006-C05 | Infraestructura sin interfaz                                                   | Sin hooks, componentes ni E2E visuales; exponer contratos para futuras specs.                                 |

## Decisiones anteriores aplicables

- D05 ya resuelta: histórico EUR, sin persistir FX. Ver [decisiones](../../docs/decisions.md).
- D10 fiscal concretada en 004; no reabrir impuestos. 006 añade únicamente redondeo final de conversión.
- Conservar packages/shared; no crear packages/billing ni packages/contracts.

## Pendientes técnicos

No quedan decisiones funcionales abiertas para estas tareas. CORS es una comprobación pendiente, no un resultado conocido. Si bloquea el acceso, no añadir proxy ni sustituir proveedor sin decisión posterior.

La autorización actual es documental: no incluye código, instalaciones, commits, datos existentes ni aceptación humana. No registrar esta preparación en ai-workspace.
