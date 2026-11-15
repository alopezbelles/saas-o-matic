# ADR-006 — Conversión exacta y proveedor aislado de la interfaz

Fecha de registro: 15 de noviembre de 2026. **Retrospectiva posterior a T01–T05**, autorizada ahora. Decisiones confirmadas por Alex antes de implementar; no revisión humana de la entrega final.

## Contexto

002 persiste EUR y snapshots; 004 aporta motor puro y utilidades de dinero; 005 expone importes autoritativos. La web aún no tiene simulador. ADR-003 era propuesta amplia de preview/FX, no evidencia de una interfaz o integración externa ya implementadas.

## Decisión confirmada

- Conversión solo del total EUR a USD/GBP, catálogo explícito de exponente 2 e identidad EUR sin tasa.
- Función pura en packages/shared/src/currency, razón decimal BigInt y half-up final con utilidades existentes. Sin Zod/decimal.js ni paquetes nuevos.
- Payload del proveedor y validación en web; HTTP/caché en módulo separado sin React. Memoria por instancia compartida de pestaña hasta caducidad, timeout 5 s y petición concurrente compartida.
- ExchangeRate-API abierto directo desde navegador, sin clave/proxy ni datos privados.
- No persistir FX; no modificar cálculo fiscal/histórico. UI, hook y E2E diferidos.

## Alternativas relevantes

La plantilla proponía decimal.js/Zod y paquetes separados; se eligió reutilizar shared y utilidades actuales para esta complejidad. Snapshot FX contradice D05 y no se añade. Un proxy no se descarta para cualquier futuro: requiere decisión si una comprobación real de CORS demuestra que el acceso directo no sirve. No se diseñó un sistema de múltiples proveedores.

## Consecuencias y límites

La tasa actual de un histórico es orientativa. El consumidor debe mostrar fecha/atribución y ofrecer EUR sin ocultar un fallo FX. No convertir líneas evita discrepancias de redondeo entre desglose y total. La caché desaparece al recargar; no hay polling/retries automáticos.

Los contratos/pruebas están implementados y la suite global T05 pasa. CORS real sigue inconcluso por fallo del navegador del entorno, sin garantía de integración externa. No existe UI ni aceptación humana final. La atribución visible se integrará antes de publicar una pantalla que use tasas.

## Fuentes

[Decisiones confirmadas](../../specs/006-currency/clarifications.md), [plan](../../specs/006-currency/plan.md), [validación](../../specs/006-currency/validation.md), [ADR-003 histórico](ADR-003-preview-fx.md) y [revisión](../reviews/006-currency.md).
