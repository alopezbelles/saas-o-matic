# 006 Currency — Iteraciones del trabajo con IA

Síntesis del [registro de desarrollo](../../iterations/006-currency.md), la [validación](../../../specs/006-currency/validation.md) y la confirmación posterior conservada en [memoria](../../../MEMORY.md). Los resultados citados son históricos; esta reorganización no vuelve a ejecutar la funcionalidad.

## Delimitación antes de implementar

La propuesta inicial mezclaba infraestructura monetaria y requisitos visuales sobre una web todavía sin simulador. La dirección del proyecto difirió la interfaz y confirmó proveedor directo, caché temporal, conversión exclusiva del total y precisión BigInt sin nuevas librerías. Codex adaptó los cinco documentos antes de ejecutar las tareas.

Primero preparó catálogo, contratos, errores y fixtures. Se distinguió comprobar tipos y datos de prueba de demostrar una conversión o transporte ya funcionales. El registro de ai-workspace se redactó después de las tareas por autorización posterior; el plan conserva la instrucción previa realmente disponible.

## Conversión pura y frontera externa

Codex implementó conversión exacta reutilizando utilidades monetarias, con tasas decimales acotadas y casos independientes de redondeo y overflow. Después incorporó validación de payloads y fechas sin mezclarla con HTTP.

La primera ejecución de las pruebas del proveedor falló porque un helper sustituía un reloj undefined por un valor por defecto. Se comprobó ese caso mediante llamada directa y la repetición pasó, sin cambiar producción para satisfacer la expectativa. El detalle se conserva en la [validación de T03](../../../specs/006-currency/validation.md#t03--validación-del-proveedor).

## Transporte, composición y corrección de herramientas

El cliente añadió petición compartida, caché inmutable, timeout y recuperación con fetch y reloj simulados. Las pruebas cubrieron caducidad y respuestas tardías, evitando que un fallo devolviera tasas antiguas como vigentes.

Durante el cierre, ESLint analizó JavaScript generado en una caché anidada y detectó errores no-undef. Se corrigió el patrón de exclusión para cubrir esas cachés, manteniendo las reglas sobre fuentes. Los controles posteriores y las pruebas de composición pasaron. La [evidencia](../../testing/006-currency.md), la [salida conservada](../../testing/006-currency-t05.txt) y la [revisión](../../reviews/006-currency.md) respaldan ese cierre.

## Comprobación externa y estado final

El intento automatizado desde origen local no produjo un resultado verificable: Chrome no devolvió evidencia útil y Edge abortó por GPU. Se declaró CORS inconcluso sin atribuir el fallo al proveedor ni introducir un proxy.

Posteriormente, el desarrollador ejecutó el cliente desde su navegador local y confirmó una respuesta normalizada correcta. Esta comprobación posterior acredita ese acceso local; no reescribe el intento anterior ni garantiza otros entornos. La infraestructura quedó cerrada técnicamente, con integración visual diferida y sin aceptación humana final registrada.
