# 005-T02 — Revisión técnica

15 de noviembre de 2026. Revisión del agente: CUMPLE TÉCNICAMENTE T02, sin aceptación humana final ni rutas HTTP disponibles.

Servicio mantiene cálculo puro con política explícita y obtiene conexión solo al crear. Repositorio abre transacción inmediata, lee cliente y llama cálculo con su país; insertSimulation reutiliza snapshots/allowlist en savepoint. Mapping y validación del DTO quedan antes del commit.
No se duplican tarifas, inserciones ni snapshots. rateBps del motor se mapea a taxRateBps. Mapper valida JSON/desglose, enteros y contexto histórico sin recalcular importes con reglas vigentes.
RF1/RF2 y conservación de RF4 conformes en capa de servicio; estados HTTP, historial paginado y publicación de configuración siguen pendientes.
Se revisó cohesión del test de 321 líneas: nueve casos del mismo servicio/transacción, con fixture común. Se conserva en un archivo porque dividir solo por el umbral no mejora las responsabilidades. Servicio y repositorio permanecen separados por responsabilidades reales.
37 unitarios y 34 integración pasan, además de lint/typecheck. Los errores deliberados de triggers y rollback son fixtures negativos reales, no fallos ocultados de ejecución. [Evidencia](../testing/005-simulations-api-t02.md).
Sin dependencias, migraciones, datos del usuario ni commits. Continuar con T03 solo por indicación de Alex.
