---
name: sdd
description: Guiar especificación, clarificación, planificación, cambio o implementación incremental de una feature de SaaS-O-Matic cuando se trabaje con specs y tareas.
---
# SDD de proyecto
Leer AGENTS.md, MEMORY.md y docs/sdd-harness.md desde la raíz. Leer solo la spec activa y documentos de dominio afectados.
1. Identificar fase solicitada y autorización real. Un borrador no concede permiso.
2. Para requisitos nuevos, redactar RF EARS, casos límite y dudas; no escribir producción.
3. Para plan, listar módulos, contratos, dependencias y pruebas. No cerrar decisiones pendientes.
4. Para implementar, comprobar aprobación de spec/plan/tarea e instalación necesaria; ejecutar una tarea dentro del alcance.
5. Ejecutar controles de docs/testing.md y conservar salida real. Actualizar validation/tasks solo con evidencia.
6. Si cambia comportamiento, volver a spec y aprobación; si cambia arquitectura, ADR.
7. Actualizar memoria breve y reportar RF, archivos, comandos, fallos y siguiente paso.
## Restricciones
No aprobar en nombre de Alex, instalar herramientas, hacer commit/push o tocar SQLite existente sin autorización. No convertir plantillas en evidencia.
## Checklist
- [ ] Fase y tarea identificadas.
- [ ] Aprobaciones y dudas revisadas.
- [ ] RF enlazados a pruebas.
- [ ] Evidencia real diferenciada de previsión.
- [ ] Memoria y docs coherentes.

