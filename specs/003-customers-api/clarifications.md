# Decisiones de 003

## Alcance autorizado

Alex autorizó implementar 003 tras aportar el enunciado: alta con cinco campos.
No registrar los mensajes previos de análisis/adaptación. La instrucción técnica de ejecución actual se documenta separadamente.

## Decisiones

| ID      | Decisión                                                                                                                                                       |
| ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| D02/D06 | Heredadas de 002: planes DEMO_BASIC/DEMO_PRO y fiscal normalizado único por país.                                                                              |
| D03     | Tabla contrastada y fixtures independientes en [fiscal-rules](fiscal-rules.md).                                                                                |
| 003-C01 | Cinco campos HTTP; contactName no se admite en alta. Columna histórica opcional mediante nueva migración, sin inventar valores ni perder contactos existentes. |
| 003-C02 | Contratos y parsers concretos en shared; sin Zod ni dependencias nuevas.                                                                                       |
| 003-C03 | Reutilizar insertCustomer/getCustomer; repositorio añade búsquedas parametrizadas.                                                                             |
| 003-C04 | Proveedor lazy, esquema actualizado obligatorio para API, sin crear/migrar DB al arrancar.                                                                     |
| 003-C05 | Envelope/requestId/logs sanitizados; país de dos letras es guarda técnica, no catálogo fiscal.                                                                 |
| 003-C06 | node:test con unitarias reales, HTTP, SQLite temporal y prueba de cierre en proceso hijo.                                                                      |

## D03 y límites

DNI/NIE según Interior. K/L/M y tipos de control según nota técnica AEAT DIT alojada por CAIB.
Eustat respalda el cálculo de entidades; su discrepancia en K/L/M queda explícita y se prioriza AEAT.
Se valida formato canónico de nueve caracteres y K/L/M numéricos; no censo, identidad ni todo formato histórico.
Las fuentes y oráculos están enlazados en la tabla adoptada; no se afirma haber verificado cada ejemplo contra un registro real.

## Integridad de migración

0000 se mantiene intacta. 0001_optional_contact reconstruye customers en una transacción, conservando nombres previos y referencias de simulaciones.
FK permanece activa. La reconstrucción difiere las comprobaciones; el runner verifica el grafo final e integridad antes de limpiar los contadores diferidos y hacer commit.
Se prueba también que un grafo final inválido provoca rollback.
No se ha aplicado sobre datos existentes del usuario; solo archivos de test creados para esta ejecución.

## Estado

Implementación y evidencia real en [validation](validation.md).
[Contratos](../../docs/api-contracts.md) y MEMORY se sincronizan al cerrar. Aceptación humana separada.
