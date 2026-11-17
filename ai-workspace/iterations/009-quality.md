# 009 — Retrospectiva de revisión y corrección

Redactada el 17 de noviembre de 2026 en 010-T02, después del cierre de 009. Fuente principal: [validación canónica](../../specs/009-quality/validation.md), que conserva bases/versiones, comandos e incidencias por tarea. No se reproducen prompts excluidos ni se presenta esta retrospectiva como un diario previo.

1. T01 inventarió cobertura y enlazó los requisitos del enunciado aportado. Se separó calidad técnica (009) de instalación/paquete de entrega (010).
2. T02 reejecutó flujos/errores y revisó seguridad básica. Se añadió el caso de markup persistido y búsqueda literal. El primer smoke FX recibió ERR_NETWORK_ACCESS_DENIED del sandbox; la repetición autorizada con red respondió HTTP 200/CORS y permitió observar USD/GBP. Ese resultado es puntual y distinto de fixtures.
3. T03 amplió estados y contenido largo a cuatro anchos. Primero corrigió el interceptor de test para las peticiones iniciales de StrictMode. Después encontró 009-QA-01: un nombre válido de 200 caracteres sin cortes expandía el grid del simulador. Cuatro fallos esperados conservaron la reproducción, sin declarar conforme RF2.
4. T04 corrigió el ajuste de texto con estilos locales, conservó el nombre completo y extendió el cliente largo al guardado/confirmación/historial. Retiró test.fail cuando pasaron los cuatro anchos; regresión completa de 36 E2E correcta.
5. T05 cerró los seis RF dentro de su alcance: 273 pruebas generales y 36 E2E correctas, controles globales/documentales y preservación de la base existente comprobados.

La [reproducción y corrección](../../specs/009-quality/validation.md#t04--corrección-y-regresiones) conservan comportamiento anterior y resultado posterior. No se ocultan las expectativas de fallo de T03 detrás del código 0 del runner.

Límites: Chromium, ampliación CSS/reflujo equivalente y contraste representativo; sin zoom nativo, lector de pantalla, pentest o auditoría exhaustiva de dependencias. CORS real no garantiza un dominio futuro. [Instrucciones previas](../prompts/009-quality.md). Aceptación humana final pendiente.
