---
name: review-quality
description: Revisar una tarea, spec o entrega de SaaS-O-Matic frente a requisitos, arquitectura, tests y evidencias; usar al validar cambios o preparar cierre.
---
# Revisión verificable
Leer spec/plan/tasks activos, docs/testing.md y docs/traceability.md. Por defecto revisar sin editar; corregir solo si se autoriza.
1. Relacionar cada cambio con RF/tarea. Separar incumplimientos de sugerencias opcionales.
2. Revisar contratos, errores, privacidad, precisión y capas; buscar lógica duplicada.
3. Ejecutar gates pertinentes en entorno aislado. No instalar ni modificar DB real para revisar.
4. Examinar pruebas negativas y oráculos; no aceptar cobertura numérica sin casos críticos.
5. Para UI, comprobar teclado, estados, responsive y error FX; no confundir captura con test funcional.
6. Informar por RF test, resultado y evidencia. Marcar no ejecutado cuando corresponda.
7. Emitir CUMPLE TÉCNICAMENTE o CAMBIOS NECESARIOS; aceptación humana sigue pendiente.
## Restricciones
No fabricar salidas, rellenar aprobaciones, elevar permisos ni cerrar tareas por inspección cuando requieren ejecución.
## Checklist
- [ ] Alcance sin extras.
- [ ] Tests reales y negativos.
- [ ] Contratos y docs al día.
- [ ] Datos de prueba aislados.
- [ ] Decisiones pendientes visibles.

