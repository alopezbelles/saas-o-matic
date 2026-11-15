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

## Revisión de entregas

La conformidad técnica se documenta en la validación de cada spec.
No registrar aceptación humana de una entrega terminada en nombre de Alex.
