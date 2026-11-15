# ADR-003 — Preview compartido, autoridad del servidor y FX visual

Nota de evolución añadida el 15 de noviembre de 2026: la propuesta original siguiente se conserva como antecedente. 004/005 implementaron motor y autoridad/configuración del servidor; 006 concreta infraestructura FX en [ADR-006](ADR-006-currency-infrastructure.md). Preview e interfaz siguen diferidos; CORS real no está acreditado. Esta nota no convierte el estado histórico de propuesta en aceptación humana final.

Fecha: 14-11-2026. Estado: PROPUESTA FUTURA, sin implementación de preview/FX. D05 (persistir solo EUR) ya se resolvió en 002; políticas fiscales y diseño del preview siguen fuera de esa implementación.
Contexto: slider inmediato, persistencia fiable y API pública de moneda.
Propuesta: módulo puro común para preview y backend; servidor recalcula al guardar; GET config versionada; FX directo desde navegador en caché de sesión, guardado solo EUR.
Alternativas: request de preview por tick (latencia y carreras), duplicar fórmula (divergencias), snapshot FX (más datos/semántica), proxy inicial (complejidad adicional).
Consecuencias: responder a cambios de configuración con aviso comparando preview y 201; fecha y atribución FX visibles. Si CORS bloquea proveedor, revisar este ADR antes de proxy.
Detalle: [negocio](../../docs/business-rules.md), [contratos](../../docs/api-contracts.md).
Aprobación y evidencia humana: PENDIENTE. No se ha llamado proveedor desde una aplicación.
