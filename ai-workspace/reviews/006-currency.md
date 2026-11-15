# 006 — Revisión técnica final

Registro del 15 de noviembre de 2026, posterior a T01–T05 y autorizado ahora. Síntesis de la revisión técnica real de T05, no una aceptación humana ni una ejecución nueva.

**Veredicto: CUMPLE TÉCNICAMENTE el alcance de infraestructura, con CORS externo inconcluso documentado.**

| Requisito | Evidencia                                                                     | Límite                                       |
| --------- | ----------------------------------------------------------------------------- | -------------------------------------------- |
| RF1       | Oráculos monetarios, mitad/adyacentes, identidad, overflow y composición.     | Solo total EUR→USD/GBP; sin UI.              |
| RF2       | Parser unknown, metadatos y concurrencia compartida.                          | Fetch simulado; no certifica proveedor real. |
| RF3       | Payload/fechas inválidos, HTTP/red/timeout, late response y recuperación EUR. | No prueba avisos visuales.                   |
| RF4       | Caché hasta frontera exacta y variación de importes sin refetch.              | No hay hook ni editor de consumos.           |

## Arquitectura y precisión

Dominio puro en shared; proveedor aislado en web; HTTP separado de validación; sin SQL/React en cálculo. Reutiliza roundHalfUp y guardas de entero seguro. BigInt opera sobre la representación decimal original; Number solo valida finitud/rango, sin multiplicación monetaria flotante. Parseo JSON no promete recuperar dígitos perdidos. Catálogo cerrado y límites técnicos explícitos.

Caché congelada, instancia compartida sin petición al importar, timeout cubre cuerpo y fetch. No envía PII ni importes; no persiste FX. Sin dependencias externas nuevas, proxy o cambios de API/DB. La exclusión ESLint anidada evita analizar artefactos generados sin desactivar reglas de fuentes.

## Calidad y limitaciones

[Pruebas y salida real](../testing/006-currency.md): 122 pruebas correctas y controles globales conformes. Incidencias de helper T03 y lint T05 conservadas en [iteración](../iterations/006-currency.md). No se inventa evidencia contemporánea: estos registros son retrospectivos.

CORS no acreditado por fallo del navegador del entorno. Antes de integrar UI, verificar acceso real; si falla por CORS, consultar alternativa antes de proxy. Pendientes visuales: hook, selector, formato, mensajes/carga/reintento, fecha/atribución y E2E de usuario.

Alex confirmó alcance/decisiones y autorizó tareas y registro; **no se ha registrado aceptación humana final de la entrega**. Sin commits/pushes del agente. Este registro no autoriza nueva feature ni despliegue.
