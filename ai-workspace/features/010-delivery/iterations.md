# 010 Delivery — Iteraciones del trabajo con IA

## README, demo y presentación

Codex reorganizó el README para explicar necesidades, decisiones, SDD y aportación de las herramientas declaradas por el desarrollador. Preparó una demo con clientes y simulaciones mediante servicios existentes, exigiendo base nueva, y generó cuatro capturas reales con recursos temporales.

Una prueba inicial comparaba una ruta sin el contexto correcto; se corrigió frente al destino absoluto previsto. El formateo también incluyó por error un archivo de ejemplo de entorno sin parser aplicable; se retiró de esa invocación. Los controles posteriores pasaron. Este bloque preparó la entrega, pero todavía no acreditaba una instalación limpia.

## Organización de registros y procedencia

La ejecución de T02 autorizó actualizar ai-workspace. Codex enlazó instrucciones canónicas, resumió implementación anterior y distinguió artefactos temporales de evidencia conservada. Respetó mensajes excluidos y no reconstruyó sesiones de Product. Las verificaciones de ese bloque fueron documentales, sin repetir suites funcionales.

## Ensayo limpio e incidencias recuperadas

El ensayo exportó una versión identificada sin dependencias o DB heredadas e instaló herramientas y Chromium propios. Una primera invocación de bootstrap desde la raíz se canceló y no se usó como evidencia limpia. Hubo bloqueos de red y de revisión automática; tras la reanudación solicitada, el acceso autorizado permitió completar la instalación.

El arranque y recorrido de alta, simulación, guardado e historial pasaron. El harness inicialmente falló al cerrar procesos con taskkill; se interrumpió la sesión propia y una comprobación independiente confirmó puertos libres, conservando el fallo inicial. Después pasaron controles generales y E2E en la copia. El [registro del ensayo](../../testing/010-delivery-t03.md) y su [resumen estructurado](../../testing/010-delivery-t03-results.json) conservan método, resultados y límites: mismo Windows y herramientas del host, sin acreditar otra máquina o clon remoto.

## Preparación externa y revisión humana de la organización

La revisión local no encontró coincidencias de los patrones de credenciales seleccionados ni bases versionadas dentro de su alcance. Identificó rutas locales en documentos históricos y dejó pendiente decidir su tratamiento antes de publicar; no afirmó auditoría exhaustiva del historial.

Se preparó inicialmente una guía separada. La dirección del proyecto la eliminó y pidió concentrar la presentación en README y la evidencia en ai-workspace. Se respetó esa decisión sin recrear el archivo. La [revisión externa](../../testing/010-delivery-t04.md) conserva condiciones y riesgos, sin acreditar publicación, visibilidad remota o despliegue.

## Cierre técnico y pendientes actuales

T05 consolidó los requisitos y usó los resultados del ensayo como evidencia previa identificada; no volvió a atribuirse sus pruebas. La [revisión final](../../reviews/010-delivery-t05.md) separa preparación completada, aceptación humana y acciones externas pendientes.

Durante esta reorganización se observa que el README principal aún enlaza docs/decisions.md, ausente. Esa referencia queda pendiente fuera del alcance; los controles documentales históricos no garantizan el estado actual tras cambios posteriores. No se corrige ni se realiza una auditoría global en esta tarea.
