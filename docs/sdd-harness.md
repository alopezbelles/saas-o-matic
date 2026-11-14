# Flujo de trabajo

1. Leer AGENTS.md y MEMORY.md para identificar spec activa y alcance.
2. Leer spec, clarifications, plan y tasks; contrastar con el código existente.
3. Ejecutar solo trabajo autorizado; una instrucción del usuario es la fuente de autorización, no una etiqueta de plantilla.
4. Usar controles de testing pertinentes; no crear comandos vacíos ni evidencia anticipada.
5. Registrar resultados, límites y trazabilidad. Mantener aceptación humana separada del veredicto técnico.

## Registro continuo en ai-workspace

Cada spec debe dejar un registro proporcionado del desarrollo real. Capturar las decisiones e iteraciones significativas durante el trabajo, no reconstruirlas como si se hubieran documentado antes.

### Antes de implementar

- Identificar spec, RF/tarea, estado del código y autorización disponible.
- Preparar una instrucción técnica con contexto, objetivo, alcance, restricciones, contratos o reglas afectadas y criterios de aceptación/verificación. Puede formar parte del plan o del registro de iteración; no crear un prompt por cada edición trivial.
- Guardar en `ai-workspace/prompts` instrucciones técnicas relevantes, estructuradas y enlazadas al contexto canónico. Reformular las solicitudes breves o informales con claridad profesional, conservando intención y límites. Identificar la procedencia y si el texto se preparó antes de ejecutar o como reformulación retrospectiva; no es obligatorio reproducir el mensaje literal.
- Registrar en `ai-workspace/decisions` los ADR pertinentes con alternativas, justificación, consecuencias y estado real. No crear un ADR si la tarea solo aplica una decisión existente.

### Durante la implementación

- Usar `ai-workspace/iterations` como hilo conductor: fecha, spec/tarea, contexto o versión identificable, cambios y motivos, decisiones del usuario, incidencias y siguiente paso. Enlazar prompts, ADR y pruebas sin repetir su contenido completo.
- Registrar cambios de enfoque, fallos significativos y correcciones. Distinguir observación, hipótesis y causa comprobada; no presentar suposiciones como hechos.
- Para una corrección, describir comportamiento observado y esperado, solución y comprobación de regresión. No generar entradas por cada llamada a herramienta o cambio menor sin valor explicativo.

### Verificación y cierre

- En `ai-workspace/testing`, registrar comandos exactos, entorno, versión identificable del código, códigos de salida, resultados, artefactos y limitaciones. Si un control no se ejecutó, indicarlo; no confundir resultados esperados con resultados reales.
- En `ai-workspace/reviews`, diferenciar revisión técnica del agente y revisión humana. Solo registrar comprobaciones personales o aceptación de Alex cuando estén confirmadas por él, indicando su alcance.
- Usar `ai-workspace/visuals` cuando haya cambios visuales relevantes, con capturas reales y contexto reproducible; no exigir capturas para trabajo sin interfaz.
- Actualizar el índice de `ai-workspace` y enlazar los registros desde la validación de la spec. Mantener specs, contratos y arquitectura en sus ubicaciones canónicas.
- Comprobar que el registro explica qué se intentó, por qué se eligió la solución, qué cambió y cómo se verificó, sin atribuir funcionalidades o decisiones futuras al estado actual.

### Fidelidad y calidad de las evidencias

- Los registros deben ser concretos, técnicos y comprensibles para un evaluador; la profesionalidad se demuestra con decisiones justificadas y evidencia, no con lenguaje complicado.
- Un «prompt exacto» o extracto original conserva el texto real. Identificar omisiones y redacciones de datos sensibles; no reformularlo silenciosamente para mejorar su apariencia.
- Preferir la plantilla de instrucción técnica: contexto, objetivo, acciones, alcance, restricciones y verificación. Distinguir una instrucción previa realmente utilizada de una reformulación posterior; esta última no acredita por sí sola una autorización ni que ese texto se enviara originalmente.
- Etiquetar expresamente las síntesis técnicas y las retrospectivas, indicando cuándo se redactaron, qué período describen y las fuentes reales disponibles. No inventar fechas, conversaciones, alternativas evaluadas ni resultados.
- Las plantillas de `ai-workspace/templates` son ayudas, no evidencias. Omitir campos no aplicables y no rellenar resultados anticipadamente.
- Actualizar únicamente las carpetas que correspondan al trabajo realizado; no exigir que todas reciban un archivo por spec. Evitar duplicaciones y transcripciones masivas sin selección ni contexto.

001 cubre infraestructura y 002 cubre persistencia interna SQLite. Las funcionalidades de producto requieren su propia definición y autorización.
No crear commits, pushes, despliegues ni modificar datos existentes sin autorización específica.
