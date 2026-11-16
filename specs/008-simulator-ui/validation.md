# Validación 008

Estado: preparación documental consolidada, decisiones 008-C01…C07 confirmadas. Lista para implementar por tareas, aún sin ejecutar ninguna. No se ha implementado el simulador ni ejecutado pruebas funcionales de 008. Resultados de 004–007 acreditan dependencias, no esta pantalla.

## Matriz prevista

| RF      | Tareas      | Pruebas previstas                                  | Resultado real |
| ------- | ----------- | -------------------------------------------------- | -------------- |
| 008-RF1 | T01/T02/T05 | WEB-SIM-01, WEB-CONFIG-008, E2E-SIMULATIONS-008    | NO EJECUTADO   |
| 008-RF2 | T01/T02/T05 | WEB-SIM-02, E2E-SIMULATIONS-008                    | NO EJECUTADO   |
| 008-RF3 | T03/T04/T05 | WEB-SAVE-008, WEB-HISTORY-008, E2E-SIMULATIONS-008 | NO EJECUTADO   |
| 008-RF4 | T02/T04/T05 | WEB-FX-008, WEB-HISTORY-008, E2E-SIMULATIONS-008   | NO EJECUTADO   |
| 008-RF5 | T03/T04/T05 | WEB-POLICY-008, E2E-SIMULATIONS-008                | NO EJECUTADO   |

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
