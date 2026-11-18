# Protocolo SDD y desarrollo asistido por IA

## 1. Propósito y metodología

Este protocolo debe guiar el trabajo de Codex y los agentes durante la definición, implementación y revisión de una funcionalidad. Es una norma de trabajo vigente, no una afirmación de que todas las prácticas se aplicaron desde el primer día ni un registro de ejecuciones anteriores.

- **Spec-Driven Development (SDD):** requisitos y reglas aprobadas deben orientar la especificación y el plan antes de implementar. No se deben adaptar automáticamente para justificar el código existente.
- **Context Engineering:** cada tarea debe recibir contexto pertinente, vigente y suficiente, con requisitos, restricciones y dependencias identificados.
- **Harness Engineering:** instrucciones, skills, herramientas, límites y verificaciones deben acotar la ejecución y hacer revisables sus resultados.

El procedimiento define lo esperado. Solo los registros y resultados reales acreditan qué se ejecutó en cada caso.

## 2. Fuentes de referencia y responsabilidades

| Fuente                                    | Responsabilidad                                                                                     |
| ----------------------------------------- | --------------------------------------------------------------------------------------------------- |
| [Producto](product.md)                    | Propósito, usuarios, objetivos y alcance funcional.                                                 |
| [Reglas de negocio](business-rules.md)    | Comportamientos e invariantes obligatorios; distinción entre enunciado y políticas complementarias. |
| [Requisitos](requirements.md)             | Requisitos y restricciones de infraestructura documentados; no sustituye el enunciado completo.     |
| [Constitución](constitution.md)           | Principios transversales de arquitectura, calidad y protección de datos.                            |
| [Specs](../specs/)                        | Requisitos de cada feature, aclaraciones, plan, tareas y validación.                                |
| [AGENTS.md](../AGENTS.md)                 | Instrucciones operativas y límites del agente.                                                      |
| [MEMORY.md](../MEMORY.md)                 | Estado operativo y contexto de continuidad, sin sustituir fuentes canónicas.                        |
| [ai-workspace](../ai-workspace/README.md) | Explicación y evidencias del proceso asistido por IA.                                               |

Estas fuentes tienen responsabilidades complementarias, no una precedencia absoluta basada únicamente en su ubicación. Se deben consultar además contratos, modelo de datos y diseño cuando afecten a la tarea.

Ante contradicciones, el agente debe identificar los textos y su ámbito, distinguir una instrucción actual de un estado histórico y comprobar la autorización disponible. No debe resolver una discrepancia funcional copiando el comportamiento del código. Si implica cambiar una regla, decisión o alcance aprobado, debe presentar el conflicto al responsable humano y detener únicamente el trabajo dependiente; puede continuar trabajo independiente autorizado.

Un enlace roto no autoriza a recrear documentos ni a inventar su contenido. La instrucción vigente del usuario debe respetarse dentro de las restricciones aplicables.

## 3. Roles y responsabilidades

El responsable humano debe definir objetivos y prioridades, confirmar decisiones funcionales relevantes, autorizar ampliaciones de alcance y revisar o aceptar resultados cuando corresponda. Puede delegar propuestas técnicas sin que ello convierta cada detalle posterior en una decisión humana explícita.

Codex debe analizar contexto, proponer soluciones proporcionadas, ejecutar tareas autorizadas, verificar cambios y documentar resultados y límites. Debe elevar decisiones fuera de su autonomía sin atribuir aprobaciones inexistentes. La implementación y la revisión técnica del agente no sustituyen aceptación humana.

La mera presencia de herramientas o skills no acredita que se hayan utilizado. No se deben presuponer agentes paralelos, automatizaciones, permisos o integraciones por describir esta metodología.

## 4. Ciclo de vida de una feature

1. **Contexto:** leer instrucciones operativas y memoria; confirmar petición, alcance y restricciones vigentes.
2. **Identificación:** localizar la spec activa y la tarea autorizada; contrastarlas con fuentes canónicas y estado real sin asumir implementación.
3. **Requisitos:** revisar spec y clarifications, casos límite y decisiones abiertas. Resolver las dudas que condicionen el trabajo antes de implementarlo.
4. **Planificación:** elaborar o consultar responsabilidades, contratos, dependencias y estrategia de verificación. No introducir reglas nuevas mediante un detalle del plan.
5. **Tareas:** descomponer en bloques concretos con dependencias, criterio de completado y resultado revisable; identificar cuáles están autorizados.
6. **Instrucción previa:** preparar contexto, objetivo, acciones, alcance, restricciones y criterios de verificación antes de cada bloque significativo. Puede formar parte del plan; no hace falta un prompt por edición trivial.
7. **Implementación:** ejecutar solo el bloque autorizado, reutilizar piezas existentes y mantener separados cambios propios y trabajo previo del usuario.
8. **Verificación:** ejecutar controles pertinentes, inspeccionar resultados y corregir defectos dentro del alcance. Registrar también ejecuciones fallidas y controles no ejecutados.
9. **Registro y revisión:** actualizar validación y documentación pertinente con evidencia real; presentar resultados y decisiones pendientes al responsable humano cuando corresponda.
10. **Cierre:** marcar tarea o feature únicamente según sus criterios y evidencia. Mantener separados cierre técnico, validación automatizada y aceptación humana.

Si surge un cambio de comportamiento o arquitectura, se debe revisar su autorización y reflejar la decisión en la fuente pertinente antes del trabajo dependiente. No se debe ampliar una tarea para completar visualmente una propuesta o anticipar otra feature.

## 5. Gestión del contexto

El agente debe comenzar por fuentes canónicas y leer los archivos relacionados con la tarea. Debe identificar requisitos, restricciones, contratos, dependencias y estado comprobado, distinguiendo propuestas de capacidades disponibles.

Más contexto no siempre mejora la decisión: se deben evitar volcados indiscriminados, documentación duplicada y conclusiones basadas en fragmentos sin su ámbito. Las referencias históricas deben conservar su condición de históricas.

La memoria debe permanecer breve y operativa durante el trabajo que autorice actualizarla. No debe convertirse en sustituto de specs, contratos o resultados. Las restricciones expresas sobre archivos prevalecen sobre una actualización rutinaria: no se modificarán documentos excluidos para satisfacer una plantilla.

## 6. Entorno de ejecución y control del agente

[AGENTS.md](../AGENTS.md) debe aportar reglas operativas; MEMORY.md debe facilitar continuidad. Las instrucciones específicas de la tarea deben concretar destinos, acciones permitidas y verificaciones necesarias.

Las skills locales disponibles se organizan en [.agents/skills](../.agents/skills/):

- `sdd`: especificación, aclaración, planificación e implementación incremental.
- `billing-domain`: revisión de importes, tramos, impuestos, conversión y conservación monetaria.
- `review-quality`: contraste de requisitos, arquitectura, pruebas y evidencia al revisar o cerrar.

Se debe consultar la skill pertinente antes de aplicarla. Una skill es una guía de ejecución, no un servicio automático ni una aprobación. Su contenido no autoriza dependencias, ampliaciones de alcance o acciones externas.

Los mecanismos configurados incluyen TypeScript estricto, ESLint, Prettier y suites de pruebas. Las restricciones de permisos y herramientas efectivas deben comprobarse en la sesión; el documento no garantiza acceso a red, navegador o servicios. Si una limitación impide verificar, se debe declarar sin sustituir la ejecución por una afirmación de éxito.

No se deben introducir secretos, utilizar datos reales para pruebas ni modificar configuración personal para resolver un fallo de entorno sin autorización. Las operaciones temporales deben aislar recursos y comprobar sus destinos antes de limpiar.

## 7. AI workspace y fidelidad de las evidencias

La documentación del proceso debe mantenerse en `ai-workspace/features/<NNN-feature>/`, con registros proporcionados al trabajo:

| Archivo       | Contenido                                                                                                     |
| ------------- | ------------------------------------------------------------------------------------------------------------- |
| README.md     | Objetivo de colaboración, reparto de responsabilidades, decisiones relevantes, resultado y enlaces canónicos. |
| prompts.md    | Instrucciones técnicas significativas con contexto, objetivo, restricciones y procedencia.                    |
| iterations.md | Evolución relevante, decisiones, cambios de enfoque, incidencias, correcciones y límites.                     |

La evidencia técnica canónica debe registrarse en `specs/<feature>/validation.md`: versión o contexto identificable, comandos, resultados, controles omitidos y límites, con enlaces a artefactos adicionales cuando existan. No se deben duplicar matrices, contratos o logs completos en las tres piezas de la feature.

Durante una spec deben registrarse las iteraciones significativas conforme al alcance autorizado, sin dejar toda la explicación para el cierre. Si el usuario excluye un registro, se debe respetar; una autorización posterior no convierte un resumen en evidencia contemporánea.

Reglas de fidelidad:

- Los mensajes y extractos presentados como originales deben conservar su texto, señalando omisiones o redacciones sensibles.
- Las reformulaciones, prompts consolidados y retrospectivas deben identificarse como tales, con procedencia y relación temporal respecto a la ejecución. No deben aparentar haber sido enviados antes del código si se redactaron después.
- No se deben inventar conversaciones, aprobaciones, alternativas evaluadas, revisiones humanas, fechas, capturas o resultados.
- Se deben distinguir observación, hipótesis y causa verificada. Una incidencia debe explicar comportamiento esperado, observado, corrección y comprobación posterior.
- Las pruebas previstas, implementadas, ejecutadas y superadas son estados distintos. Un artefacto ausente debe declararse, no reconstruirse como salida original.
- Los registros deben ser técnicos y concretos, con enlaces a fuentes, sin formalismo vacío, secretos o datos personales innecesarios.

Las evidencias históricas que aún existan en otras carpetas deben conservarse y enlazarse cuando sean pertinentes. No se debe afirmar que se migraron o eliminaron sin comprobarlo, ni crear índices, ADR, plantillas o capturas por obligación. Una decisión arquitectónica relevante debe quedar documentada con alternativas y consecuencias en una ubicación existente y autorizada; no se debe recrear una estructura retirada sin permiso.

## 8. Pruebas y controles de calidad

La selección debe corresponder al riesgo y naturaleza del cambio, siguiendo [testing](testing.md):

| Cambio                     | Verificación que debe considerarse                                                                          |
| -------------------------- | ----------------------------------------------------------------------------------------------------------- |
| Reglas puras y validadores | Unitarias, casos límite, negativos y oráculos independientes.                                               |
| Contratos y transporte     | Parsing runtime, respuestas, errores y regresiones de consumidores.                                         |
| Persistencia o API         | Integración con datos temporales, transacciones, integridad y recuperación.                                 |
| Interfaz o interacción     | Componentes, estados, teclado, foco, responsive y E2E cuando el recorrido lo requiera.                      |
| Documentación              | Coherencia de contenido, archivos/enlaces/anclas y formato; sin suites funcionales nuevas si no hay motivo. |

Comandos existentes: `pnpm lint`, `pnpm typecheck`, `pnpm format:check`, `pnpm build`, `pnpm test` y `pnpm test:e2e`, además de suites específicas. Deben comprobarse los scripts vigentes antes de ejecutarlos. No se debe ejecutar `test:gates` en paralelo con otros controles de código.

No se deben exigir todas las suites para cada cambio. Se deben ejecutar primero controles afectados y ampliar ante cambios, fallos o dudas que lo justifiquen. Un test existente no acredita una ejecución; un código cero con fallos esperados no acredita conformidad del requisito defectuoso. La prueba con proveedor simulado no demuestra acceso externo real.

Se deben informar controles no ejecutados, fallidos, bloqueados o limitados. Los resultados históricos deben identificar su versión y no atribuirse a un cambio documental nuevo. Los criterios de accesibilidad no equivalen a certificación; se debe indicar el alcance realmente comprobado.

## 9. Autonomía y autorización

El agente puede realizar el trabajo necesario dentro de la tarea autorizada, sin solicitar repetidamente aprobación para decisiones rutinarias ya cubiertas por el encargo.

Requieren autorización cuando no esté concedida en el contexto vigente:

- Cambiar reglas de negocio, alcance, arquitectura relevante, dependencias o servicios.
- Ejecutar operaciones destructivas o modificar datos existentes fuera de una tarea específica.
- Tocar .git, remotos, archivos .env reales, secretos o configuración personal.
- Hacer commits, push, merges, publicación o despliegue.

Una plantilla, checklist o estado de spec no constituye autorización. Los resultados técnicos tampoco autorizan una acción externa. Ante un bloqueo, se debe detener el trabajo dependiente y continuar únicamente el independiente permitido.

El agente no puede declarar aceptación humana en nombre del responsable. Si se exige aceptación para un cierre funcional, debe solicitar su revisión sobre un resultado concreto y registrar solo la confirmación realmente recibida. Un cierre técnico puede quedar completo con aceptación humana pendiente, si ese estado está permitido por los criterios de la tarea.

## 10. Criterios de completado

Una tarea puede cerrarse técnicamente cuando:

- El alcance autorizado está resuelto y respeta requisitos y reglas vigentes.
- Las verificaciones pertinentes se han ejecutado con evidencia suficiente; cualquier excepción tiene alcance, impacto y motivo explícitos.
- No queda un defecto que impida declarar conforme el requisito afectado.
- Los resultados reales, limitaciones y pendientes están registrados sin anticipar aceptación.
- La documentación afectada es coherente y se han respetado las exclusiones de modificación.
- Las aprobaciones imprescindibles se han obtenido; las revisiones humanas o acciones externas pendientes permanecen separadas.

El cierre debe indicar cambios, evidencia, controles no ejecutados y riesgos o decisiones pendientes. No se debe iniciar otra feature, publicar o realizar acciones de Git por haber terminado una tarea. El nombre de commit puede proponerse sin ejecutarlo.
