# Autorización y alcance

## 001

Alex solicitó la infraestructura inicial y autorizó completar sus controles y documentación.
La exclusión de SQLite correspondía a ese alcance.

## 002

Alex delegó tecnología, modelo y planes, aceptó histórico EUR y duplicados por país/fiscal, y pidió máximos razonables.
Aceptó la propuesta documentada y después indicó: «perfecto, desarrolla la spec».
Esto autoriza implementar 002, instalar sus dependencias y ejecutar migraciones/seed/backup en archivos temporales de validación.
No autoriza modificar bases preexistentes del usuario, desplegar, hacer commits/pushes ni cambiar remotos.

## 003

Alex autorizó ejecutar 003 y sus tasks después de señalar la diferencia entre cinco campos oficiales y contactName extra. Se implementa esa corrección con migración compatible, validada solo en archivos temporales. No se registran los mensajes de análisis/adaptación excluidos expresamente por el usuario.

## 004 — Preparación

Alex autorizó adaptar y consolidar spec/plan/tasks, resolver decisiones una a una y registrar ahora la preparación en ai-workspace mediante reformulaciones técnicas retrospectivas. Las decisiones de países, política demo, precisión, límites, entrada y salida constan en [aclaraciones](../specs/004-billing/clarifications.md).
La autorización inicial fue documental. La implementación se aborda tarea a tarea por indicación posterior, con commits separados propuestos, sin ejecutar commits/pushes automáticamente. No modificar DB, HTTP, UI ni FX bajo 004.

Actualización posterior: Alex autoriza implementar T01 (fixtures, runner shared, gate documental y evidencias). No autoriza todavía T02–T05 ni commits/pushes.

Actualización tras T01: Alex autoriza T02 (tramos, contrato básico, errores y pruebas). T03–T05 y commits/pushes requieren indicación posterior.

Actualización tras T02: Alex autoriza T03 (dinero exacto, impuestos versionados, configuración y pruebas). No autoriza todavía T04/T05 ni commits/pushes.

Actualización tras T03: Alex autoriza T04 (presupuesto completo, validación de consumos y pruebas). T05 y commits/pushes siguen pendientes de indicación.

Actualización tras T04: Alex autoriza ejecutar T05 (controles globales, revisión y documentación de resultados). Sin autorización de commits/pushes ni aceptación humana final anticipada.

Corrección posterior a T05: Alex autoriza resolver los issues de formato, normalizar los archivos afectados y establecer reglas versionadas para evitar su recurrencia. No autoriza commits/pushes ni cambios de configuración personal o del directorio .git.

## 005 — Implementación incremental

Alex autoriza T01 de 005: contratos, parsers, pruebas, contexto y documentación. Las decisiones de contrato constan en su spec/clarifications. T02–T05 requieren indicación posterior. Se mantiene la exclusión de ai-workspace hasta autorización explícita; sin commits/pushes ni datos reales.

Después de T01, Alex autoriza registrar en ai-workspace preparación y trabajo realizado antes del commit, siguiendo el procedimiento habitual. Se levanta la exclusión para este registro; los documentos se identifican como retrospectivos y enlazan la instrucción previa real del plan. No autoriza T02 ni implica aceptación humana final.

T02 de 005 autorizada después de T01: servicio, guardado transaccional, mapping y pruebas aisladas. T03–T05 y commits/pushes requieren indicación posterior.

Después de T02, Alex autoriza T03: alta HTTP, errores y pruebas. T04/T05 y commits/pushes requieren indicación posterior.

Después de T03, Alex autoriza T04: histórico paginado, configuración pública y pruebas. T05 y commits/pushes requieren indicación posterior.

Después de T04, Alex autoriza T05: revisión y verificación global de 005, con cierre documental/evidencias. Sin commits/pushes ni aceptación humana final anticipada.

## 006 — Preparación e implementación incremental

Después de T05, Alex autoriza registrar ahora en ai-workspace preparación, decisiones, implementación y verificaciones de 006. Se levanta la exclusión anterior para este registro, identificado como retrospectivo y con procedencia fiel. No implica nueva ejecución funcional, aceptación humana final ni autorización de commits/pushes.

Después de T04, Alex autoriza T05: composición con fixtures, revisión, controles globales, documentación y smoke CORS si el entorno lo permite. No autoriza cambios de arquitectura/proxy, instalaciones, UI, datos reales ni commits/pushes. Sigue excluido ai-workspace.

Tras T03, Alex autoriza T04: cliente HTTP/caché y pruebas con transporte inyectado, sin proveedor real. T05 pendiente; mantener exclusión ai-workspace, commits/pushes y datos reales.

Tras T02, Alex autoriza T03: validación/normalización del proveedor y pruebas, incluido ajuste del runner sin dependencias externas. T04/T05 requieren indicación posterior. Se mantiene exclusión de ai-workspace y ausencia de autorización para commits/pushes o datos reales.

Tras T01, Alex autoriza T02: conversión pura y pruebas, con reutilización monetaria y sin nuevas dependencias. T03–T05 siguen pendientes; se conserva exclusión de ai-workspace, commits/pushes y datos existentes.

Alex autorizó adaptar los cinco documentos de 006, excluyó interfaz/hooks y confirmó proveedor directo, caché por pestaña, timeout 5 s, EUR/USD/GBP solo total y precisión BigInt sin librerías nuevas. Después autorizó T01: contratos, catálogo, errores y fixtures deterministas. T02–T05 requieren indicación posterior. Mantener exclusión de ai-workspace hasta nueva autorización; sin commits/pushes, red externa ni datos existentes en T01.

## Revisión de entregas — criterio general

La conformidad técnica se documenta en la validación de cada spec.
No registrar aceptación humana de una entrega terminada en nombre de Alex.
