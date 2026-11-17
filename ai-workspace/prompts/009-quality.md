# 009 — Instrucciones técnicas de calidad

Índice retrospectivo creado el 17 de noviembre de 2026 en 010-T02, posterior a T01–T05 de 009. No reproduce solicitudes de análisis o preparación excluidas, ni reconstruye conversaciones como originales.

El [plan canónico](../../specs/009-quality/plan.md) conserva instrucciones previas para T01 (inventario), T02 (seguridad/FX/flujos) y T03–T05 (accesibilidad, corrección y cierre). Consultarlas en su contexto, con versiones y resultados en [validación](../../specs/009-quality/validation.md).

Síntesis técnica posterior: mapear requisitos del enunciado a código/pruebas, reutilizar suites con datos aislados y oráculos independientes, distinguir proveedor FX real de fixtures y comprobar acceso/reflujo antes de declarar conformidad. El defecto 009-QA-01 se mantuvo reproducible con fallos esperados durante la revisión y se exigió resolverlo sin truncar nombres en T04. Retirar la expectativa de fallo solo tras comprobar el mismo cliente largo durante guardado, confirmación e historial.

Esta explicación describe la estrategia aplicada; no es un prompt enviado antes de ejecutar. [Iteración y límites](../iterations/009-quality.md).
