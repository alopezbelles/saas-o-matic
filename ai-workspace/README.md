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
