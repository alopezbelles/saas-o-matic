# Guía de documentación — SaaS-O-Matic

## 1. Visión general

La documentación conecta necesidades de producto, requisitos y reglas de negocio con diseño, especificaciones, implementación y validación. Su organización permite comprender el alcance antes de trabajar y comprobar después qué evidencias respaldan cada resultado.

Esta guía sirve a desarrolladores, agentes de IA y evaluadores técnicos. Para instalar y ejecutar el proyecto, consulta el [README principal](../README.md); para conocer la colaboración con Codex, comienza en [ai-workspace](../ai-workspace/README.md).

## 2. Mapa documental

| Documento                              | Contenido y responsabilidad                                                                  | Función en el desarrollo                                                                                        |
| -------------------------------------- | -------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| [constitution.md](constitution.md)     | Principios de modularidad, integridad, seguridad, calidad y autorización.                    | Establecer límites transversales para decisiones y cambios.                                                     |
| [product.md](product.md)               | Problema, usuario, objetivos, MVP, recorridos y exclusiones.                                 | Delimitar qué se quiere construir y por qué.                                                                    |
| [requirements.md](requirements.md)     | Requisitos funcionales, no funcionales e INF, procedencia y criterios generales.             | Convertir necesidades en obligaciones verificables sin confundir enunciado y políticas complementarias.         |
| [business-rules.md](business-rules.md) | BR01–BR06: precios, consumos, impuestos, fiscal, divisas e histórico.                        | Fijar comportamientos e invariantes que las specs deben respetar.                                               |
| [design.md](design.md)                 | Referencia UX/UI vigente, tokens reales, pantallas, interacción, responsive y accesibilidad. | Alinear presentación y experiencia sin sustituir los requisitos funcionales.                                    |
| [data-model.md](data-model.md)         | Entidades, atributos, cardinalidades, integridad y snapshots.                                | Definir la información necesaria y su conservación, manteniendo la referencia al diccionario vinculante de 002. |
| [api-contracts.md](api-contracts.md)   | Endpoints, DTO, entradas, respuestas, errores e integración FX externa.                      | Establecer acuerdos de comunicación para backend y consumidores.                                                |
| [architecture.md](architecture.md)     | Organización técnica vigente, responsabilidades, dependencias, flujo y límites operativos.   | Explicar la solución y sus decisiones, sin redefinir necesidades desde el código.                               |
| [sdd-harness.md](sdd-harness.md)       | Ciclo SDD, contexto, skills, autonomía y fidelidad de registros.                             | Guiar el trabajo autorizado del agente y su revisión.                                                           |
| [testing.md](testing.md)               | Niveles de prueba, aislamiento, controles, resiliencia y criterios de validación.            | Determinar cómo verificar cambios de forma proporcional al riesgo.                                              |
| [traceability.md](traceability.md)     | Relaciones entre RF/RNF/INF, BR, specs, criterios y validaciones.                            | Recorrer la justificación y evidencia en ambos sentidos sin duplicar resultados.                                |

[images/](images/) contiene capturas de implementación utilizadas como referencias visuales. Su contexto se explica en diseño; una imagen no sustituye una prueba de interacción o validación funcional.

## 3. Flujo metodológico

### Definición de producto

Producto, requisitos, reglas y constitución establecen necesidades, límites y criterios. Deben distinguirse requisitos del enunciado, políticas complementarias y restricciones técnicas; una propuesta no equivale a decisión aprobada.

### Diseño funcional y técnico

Diseño, modelo de datos y contratos concretan experiencia, información y comunicación. Arquitectura explica responsabilidades y decisiones de la solución. Las discrepancias deben revisarse contra las fuentes pertinentes, sin adaptar silenciosamente las reglas a la implementación.

### Especificación e implementación

Las specs desarrollan requisitos en comportamientos, planes y tareas autorizadas. El protocolo SDD define el ciclo de trabajo; las instrucciones operativas y el contexto relevante condicionan la ejecución con Codex.

### Verificación y trazabilidad

Testing orienta los controles según el cambio. Cada validation.md conserva resultados reales y límites; trazabilidad conecta esos registros con requisitos y criterios. ai-workspace explica instrucciones e iteraciones significativas de la colaboración.

Este es un orden lógico de consulta, no una cronología estricta. Arquitectura y trazabilidad pueden evolucionar, y la evidencia se genera después de ejecutar. No se afirma que todos los documentos precedieran al primer código; las excepciones históricas permanecen en sus registros.

## 4. Relación entre ubicaciones

**docs/** concentra definiciones funcionales, técnicas y metodológicas estables. Cada archivo tiene su responsabilidad; esta guía no duplica sus reglas, esquemas o procedimientos completos.

**[specs/](../specs/)** organiza diez áreas, desde infraestructura y persistencia hasta APIs, dominio, interfaces, calidad y entrega. Las dos últimas son transversales. Cada carpeta contiene:

- `spec.md`: comportamiento, requisitos locales, alcance y criterios.
- `clarifications.md`: decisiones, dudas y procedencia de su resolución.
- `plan.md`: responsabilidades, dependencias, enfoque y verificaciones previstas.
- `tasks.md`: bloques de ejecución, dependencias y condiciones de completado.
- `validation.md`: comprobaciones realmente ejecutadas, contexto, resultados y limitaciones.

**[ai-workspace/](../ai-workspace/README.md)** explica el proceso asistido por IA. En [features/](../ai-workspace/features/), cada `<NNN-feature>` dispone de README.md para colaboración y contexto, prompts.md para instrucciones relevantes con procedencia e iterations.md para decisiones, cambios e incidencias. Las carpetas testing y reviews conservan evidencias adicionales cuando existen; no se debe asumir que un artefacto temporal sigue disponible o que un prompt consolidado es un mensaje literal.

**[AGENTS.md](../AGENTS.md)** establece instrucciones operativas y límites de autonomía. **[MEMORY.md](../MEMORY.md)** facilita continuidad y estado de trabajo; sus referencias históricas no sustituyen una spec o regla vigente. Las skills locales complementan el protocolo, sin conceder autorización por sí mismas.

## 5. Fuentes de referencia y principios

La documentación **normativa** establece obligaciones y procedimiento: producto, requisitos, reglas, contratos, constitución y protocolo. La documentación **descriptiva**, especialmente arquitectura y referencia visual, explica la solución vigente. Los **registros de evidencia** acreditan comprobaciones concretas con su contexto. Estas funciones son complementarias, no una jerarquía absoluta basada solo en carpetas.

Los requisitos y reglas aprobados deben guiar specs e implementación. El código sirve para contrastar el estado técnico, no para modificar automáticamente el alcance. Las validaciones deben distinguir planificación, ejecución, resultado técnico y aceptación humana.

Las evidencias históricas no sustituyen definiciones vigentes ni garantizan el estado actual tras cambios posteriores. Si hay contradicción, se deben identificar fuente, ámbito e impacto y resolver la decisión por el proceso de autorización correspondiente. Un enlace roto no autoriza a reconstruir contenido ausente.

## 6. Lectura recomendada

1. [Producto](product.md) y [constitución](constitution.md): propósito, alcance y límites.
2. [Requisitos](requirements.md) y [reglas](business-rules.md): obligaciones y comportamientos.
3. [Diseño](design.md), [datos](data-model.md), [contratos](api-contracts.md) y [arquitectura](architecture.md): experiencia y solución.
4. [Protocolo SDD](sdd-harness.md) y [testing](testing.md): ejecución, autonomía y verificación.
5. La [spec](../specs/) de interés: requisitos locales, decisiones, tareas y validación.
6. [Trazabilidad](traceability.md) y [ai-workspace](../ai-workspace/README.md): correspondencias y proceso con evidencias.

La ruta orienta una primera lectura. Para una tarea concreta conviene seleccionar únicamente el contexto pertinente y consultar siempre la autorización vigente.

## 7. Mantenimiento

Cada información debe actualizarse en su fuente correspondiente, enlazándola en lugar de copiarla. Las referencias relativas y anclas deben comprobarse al cambiar títulos, mover registros o retirar archivos.

Los cambios documentales no autorizan funcionalidades nuevas. Las decisiones relevantes deben conservar procedencia, y las specs y validaciones deben permanecer alineadas sin reescribir resultados históricos como ejecuciones actuales. No se deben fabricar aprobaciones, prompts o evidencias.

Cuando un documento todavía contenga referencias obsoletas, debe señalarse el problema y corregirse dentro de un alcance autorizado. No se deben eliminar registros únicos ni afirmar migraciones de evidencia sin comprobarlas. El detalle operativo de estas obligaciones pertenece al protocolo SDD.
