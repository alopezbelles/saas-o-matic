# ADR-003 — Preview compartido, autoridad del servidor y FX visual

Fecha: 14-11-2026. Estado: PROPUESTA FUTURA, sin implementación de preview/FX. D05 (persistir solo EUR) ya se resolvió en 002; políticas fiscales y diseño del preview siguen fuera de esa implementación.
Contexto: slider inmediato, persistencia fiable y API pública de moneda.
Propuesta: módulo puro común para preview y backend; servidor recalcula al guardar; GET config versionada; FX directo desde navegador en caché de sesión, guardado solo EUR.
Alternativas: request de preview por tick (latencia y carreras), duplicar fórmula (divergencias), snapshot FX (más datos/semántica), proxy inicial (complejidad adicional).
Consecuencias: responder a cambios de configuración con aviso comparando preview y 201; fecha y atribución FX visibles. Si CORS bloquea proveedor, revisar este ADR antes de proxy.
Detalle: [negocio](../../docs/business-rules.md), [contratos](../../docs/api-contracts.md).
Aprobación y evidencia humana: PENDIENTE. No se ha llamado proveedor desde una aplicación.
