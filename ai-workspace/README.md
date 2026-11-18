# Desarrollo asistido por IA — SaaS-O-Matic

SaaS-O-Matic es un proyecto técnico Full-Stack para Roams que permite a un comercial registrar clientes corporativos y estimar el coste mensual de su suscripción. Combina validación de identificadores fiscales españoles, tarificación acumulativa por tramos, impuestos, historial persistido de simulaciones y conversión orientativa de divisas en una interfaz adaptable a distintos dispositivos.

Codex apoyó la implementación, las pruebas y la documentación dentro de un proceso dirigido por el desarrollador. El trabajo se dividió en funcionalidades acotadas, tomando como referencia el código existente y decisiones explícitas de producto e ingeniería. Las propuestas se aclararon antes de implementar, los resultados se comprobaron mediante pruebas automatizadas y recorridos en navegador, y los defectos permanecieron registrados hasta disponer de correcciones verificadas. Esta carpeta explica esa colaboración: qué se delegó, cómo evolucionó el trabajo y qué evidencias respaldan sus conclusiones. Para instalar el proyecto y conocer el producto, comienza por el [README del repositorio](../README.md).

## Enfoque de desarrollo

**Desarrollo guiado por especificaciones (SDD).** Las especificaciones de cada funcionalidad reunieron requisitos, aclaraciones, planes, tareas y validación. Se revisó la implementación existente antes de adaptar cada propuesta. Existe una excepción documentada: la especificación formal de la infraestructura llegó después del esqueleto inicial; los registros posteriores conservan esa secuencia sin dar a entender que todos los documentos precedieron al código.

**Ingeniería de contexto (Context Engineering).** Codex recibió la especificación pertinente, los contratos existentes, las reglas de negocio y el estado del proyecto. [AGENTS.md](../AGENTS.md) y la [constitución del proyecto](../docs/constitution.md) aportaron límites arquitectónicos, restricciones de alcance y criterios de verificación.

**Configuración del entorno de trabajo del agente (Harness Engineering).** El [procedimiento de trabajo](../docs/sdd-harness.md) conectó instrucciones, herramientas y controles: TypeScript estricto, análisis estático, formato, pruebas por capas y entornos de navegador aislados. Los límites sobre dependencias, datos existentes y acciones externas acotaron el trabajo del agente. Una prueba negativa también comprobó que los controles de calidad rechazaban defectos introducidos deliberadamente en un contexto temporal.

**Iteración y calidad (QA).** Las tareas se implementaron de forma incremental, con comprobaciones específicas y regresiones más amplias cuando correspondía. Los registros de validación distinguen una prueba propuesta, su implementación, su ejecución y el resultado observado.

## Colaboración entre el desarrollador y la IA

El desarrollador definió objetivos, aportó el enunciado y las referencias visuales, delimitó cada tarea y confirmó decisiones de producto. Entre ellas figuran la navegación, la ubicación de la conversión de divisas, la recuperación ante guardados inciertos y la separación entre revisión de calidad y entrega. En algunos casos se delegó en Codex la propuesta y concreción de alternativas arquitectónicas; los registros no implican que cada elección técnica fuera diseñada manualmente por el desarrollador.

Codex contrastó las especificaciones con el repositorio, propuso detalles de implementación, escribió y refactorizó código, añadió pruebas, diagnosticó fallos y documentó resultados. La revisión humana también dirigió ajustes concretos, como la alineación del botón y la presentación del foco del encabezado en las [interfaces de clientes](features/007-customers-ui/README.md).

El desarrollador indicó que utilizó ChatGPT Work con el complemento Product para el diseño general de las interfaces. Codex implementó la aplicación. No se aportan sesiones originales de Product como evidencia. La autorización de tareas, la verificación técnica y la aceptación humana final se mantienen como estados separados; los registros no atribuyen una aceptación final cuando no está documentada.

## Flujo de trabajo por funcionalidad

**Especificación → Planificación → Implementación → Validación → Iteración** guio el trabajo incremental, con la excepción de infraestructura indicada anteriormente.

Diez áreas de trabajo construyeron el producto desde la infraestructura y la persistencia hasta las API de clientes, facturación, simulaciones y divisas, seguidas de las interfaces, la revisión integrada de calidad y la preparación de la entrega. La implementación reutilizó las capas completadas en lugar de reconstruirlas para cada pantalla. En las funcionalidades posteriores, las tareas se autorizaron individualmente, permitiendo revisar su alcance y sus resultados intermedios.

Cada carpeta de [features/](features/) contiene un resumen de la colaboración, instrucciones consolidadas y las iteraciones relevantes. Los requisitos y las validaciones canónicas permanecen en [specs/](../specs/).

## Prácticas de ingeniería

La implementación ofrece ejemplos concretos de:

- Responsabilidades modulares entre pantallas React, transporte HTTP, servicios, dominio puro y persistencia, con contratos tipados y validación de datos en tiempo de ejecución en las fronteras.
- Operaciones monetarias exactas, redondeo explícito e histórico EUR inmutable con snapshots y versiones de reglas. El backend conserva la autoridad cuando una previsualización difiere del resultado guardado.
- Recuperación que conserva los datos introducidos, evita el reenvío automático ante un guardado incierto y mantiene EUR disponible cuando falla el servicio externo de divisas.
- Pruebas unitarias, de integración, componentes y navegador con datos aislados, junto con revisiones básicas de seguridad y accesibilidad con límites declarados.

La [revisión de calidad](features/009-quality/iterations.md) muestra este proceso: un nombre de cliente largo y válido rompía la composición del simulador. Los fallos esperados conservaron la reproducción, pero no se consideraron cumplimiento del requisito. Una corrección local mantuvo el nombre completo y se repitieron las regresiones antes del cierre.

## Documentación y evidencias

Consulta [docs/](../docs/) para comprender el producto y su contexto técnico, [specs/](../specs/) para requisitos, planificación y validación, y [features/](features/) para conocer el proceso de colaboración. La [guía de pruebas](../docs/testing.md) explica la estrategia de verificación; el [registro de trazabilidad](../docs/traceability.md) conecta requisitos y evidencias.

Los prompts consolidados o reconstruidos se identifican como síntesis técnicas, no como mensajes literales. Los extractos identificados como originales conservan su redacción. Las retrospectivas explican trabajo anterior sin presentarse como instrucciones contemporáneas. Las comprobaciones históricas describen la versión probada y los informes temporales pueden haber dejado de estar disponibles.

El [registro de entrega](features/010-delivery/README.md) documenta un ensayo local de instalación satisfactorio en el mismo entorno Windows. No acredita portabilidad a todas las plataformas, publicación o despliegue de producción.

## Verificación, evidencias y revisiones técnicas

Las carpetas [testing/](testing/) y [reviews/](reviews/) son ubicaciones transversales que complementan las validaciones de las specs. Se conservan separadas de features/: una explica el proceso de colaboración y las otras permiten consultar evidencia de ejecución y evaluación técnica sin repetirla íntegramente.

| Ubicación                       | Responsabilidad                                                                                                    |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `specs/<feature>/validation.md` | Referencia del estado de verificación de requisitos y criterios de aceptación, con contexto, resultados y límites. |
| `ai-workspace/testing/`         | Evidencias de comprobaciones ejecutadas: resúmenes, salidas originales y referencias a artefactos disponibles.     |
| `ai-workspace/reviews/`         | Evaluación técnica de esas fuentes: alcance, hallazgos, conclusión, riesgos y decisiones pendientes.               |

### Testing: evidencia de ejecución

Un registro de testing puede conservar qué se comprobó, comandos ejecutados, entorno y versión identificable, resultados observados, incidencias, correcciones y limitaciones. Puede enlazar logs originales, capturas o reportes cuando existan, sin exigir una salida completa para cada tarea.

Un **resumen de pruebas** explica una ejecución desde sus fuentes; una **salida original** conserva lo emitido por la herramienta. No son intercambiables: no se deben reconstruir logs ausentes ni presentar una síntesis como salida literal. Por ejemplo, el [registro de facturación](testing/004-billing-t04.md) describe alcance y resultados y remite a la validación canónica.

Merece la pena crear un registro cuando se verifica un comportamiento crítico, ocurre una incidencia significativa, se necesita preservar evidencia reproducible o se cierra un bloque importante. Si una tarea pequeña queda suficientemente explicada en validation.md, no hace falta añadir otro archivo.

### Reviews: evaluación técnica

Una review debe indicar qué se revisó, con qué requisitos o criterios y qué evidencias se consultaron. Puede recoger hallazgos, problemas, conformidad dentro del alcance comprobado, riesgos, límites y acciones pendientes. No sustituye la ejecución de una prueba por una opinión.

La **revisión técnica de Codex** es la evaluación del agente sobre código, documentos y evidencias disponibles. La **revisión humana** recoge comprobaciones o decisiones confirmadas por el responsable del proyecto. Una conclusión de Codex no equivale a aceptación humana y no debe registrarse como tal. La [revisión de facturación](reviews/004-billing-t05.md) ilustra esa separación.

Una review aporta valor cuando existe evaluación significativa de requisitos, riesgos o defectos, una conclusión técnica que preservar o un cierre de feature que requiere revisión. No se exige un archivo de testing y otro de review por cada tarea.

### Enlaces, nomenclatura e integridad

La [validación de la feature](../specs/004-billing/validation.md) debe enlazar los registros complementarios pertinentes; estos deben remitir a ella sin copiar matrices o resultados completos. Las [reglas de testing](../docs/testing.md) y el [protocolo SDD](../docs/sdd-harness.md) desarrollan el procedimiento.

Los nombres deben identificar feature y tarea cuando resulte útil, como `testing/004-billing-t04.md` para una ejecución concreta y `reviews/004-billing-t05.md` para una revisión consolidada, o la feature completa, como `testing/006-currency.md`. Deben respetarse los nombres históricos: no se renombrarán archivos ni se trasladarán a features/ solo para uniformar su organización.

Los registros deben distinguir hechos observados e interpretaciones, ejecuciones nuevas y evidencia histórica. Las retrospectivas deben identificarse y conservar procedencia. No se deben inventar resultados, modificar silenciosamente los anteriores, presentar revisiones documentales como nuevas pruebas de código o atribuir aprobaciones humanas no confirmadas. Si faltan artefactos o quedan verificaciones pendientes, debe indicarse y enlazarse la fuente original disponible.
