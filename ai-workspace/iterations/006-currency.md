# 006 — Iteración retrospectiva

Redactada el 15 de noviembre de 2026 después de T01–T05 por autorización posterior. Fuentes: conversación disponible, commits locales, [plan](../../specs/006-currency/plan.md), [validación](../../specs/006-currency/validation.md) y log real T05. No es una transcripción ni registro contemporáneo.

## Preparación y decisiones

La spec inicial mezclaba infraestructura y requisitos visuales sobre una web aún sin simulador. Alex difirió interfaz y confirmó proveedor directo, monedas EUR/USD/GBP solo total y exactitud BigInt sin librerías nuevas. Se adaptaron cinco documentos antes de implementar. Definición documentada en c1c3f37; [reformulaciones](../prompts/006-currency.md), [decisión arquitectónica](../decisions/ADR-006-currency-infrastructure.md).

## Ejecución incremental

| Fase | Versión local observada                              | Resultado y límite                                                                                                |
| ---- | ---------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| T01  | debed8e                                              | Catálogo, contratos, errores y fixtures; RF funcionales aún pendientes.                                           |
| T02  | 4768911                                              | Conversión pura; ocho pruebas productivas y RF1 conforme en dominio.                                              |
| T03  | c4e1b91                                              | Parser externo y runner node:test compilado; corrección del helper de reloj, sin cambio productivo por ese fallo. |
| T04  | 53c38a7                                              | Cliente/caché/timeout; nueve pruebas nuevas con fetch/reloj simulados.                                            |
| T05  | Cambios de trabajo posteriores a 53c38a7 al redactar | Dos pruebas de composición, 122 globales y documentación; CORS inconcluso.                                        |

Los commits son observados en Git y no fueron ejecutados por el agente. No se atribuyen horas individuales ni se corrige retrospectivamente el título de 4768911.

## Incidencias que cambiaron el trabajo

- T03: test:web obtuvo 10 correctas/1 fallida. El helper sustituía undefined por reloj por defecto y la expectativa fallaba. Se probó ese caso mediante llamada directa; repetición 11/11. No se ocultó el fallo ni se cambió producción para satisfacerlo.
- T05: lint detectó tres no-undef en JS generado dentro de apps/web/.cache. La exclusión solo cubría caché raíz. Se amplió a **/.cache/**, manteniendo reglas de fuentes; controles posteriores correctos.
- CORS: Vite sirvió origen local para smoke temporal. Chrome no produjo resultado verificable; Edge headless falló por GPU antes de producir DOM/resultado del cliente. No demuestra fallo del proveedor. Sin proxy ni cambio de arquitectura.
- MockTimers emite aviso experimental en Node 22; las pruebas pasan sin esperas reales ni dependencias nuevas.

## Verificación y estado

[Resumen de pruebas](../testing/006-currency.md), [salida real de suite T05](../testing/006-currency-t05.txt), [revisión técnica](../reviews/006-currency.md) y [validación canónica](../../specs/006-currency/validation.md).

T01–T05 conformes técnicamente con limitación externa CORS explícita. UI/hook/selector/estados visuales/atribución visible/E2E se definirán después. No hay aceptación humana final registrada.

## Registro autorizado ahora

La exclusión de ai-workspace fue respetada durante preparación/ejecución. Esta actualización la levanta por indicación de Alex, sin reescribir lo sucedido. Solo se verifican documentación/enlaces/formato ahora; las 122 pruebas corresponden a la ejecución T05 conservada.
