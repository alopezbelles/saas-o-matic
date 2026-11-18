# Definición de producto — SaaS-O-Matic

## 1. Visión general

SaaS-O-Matic es una herramienta B2B para que un comercial registre clientes corporativos, consulte su información y prepare simulaciones del coste mensual de una suscripción SaaS según el consumo previsto.

El producto debe reunir contexto del cliente, estimación comprensible y consulta de resultados anteriores en un recorrido coherente. Se desarrolla en el contexto de una prueba técnica de Roams; no es un sistema de cobros, emisión de facturas legales o asesoramiento tributario.

Este documento define el producto y su alcance vigente, sin atribuir una cronología de aprobación. Las [reglas de negocio](business-rules.md) establecen las condiciones obligatorias de cálculo, validación y conservación; las [specs](../specs/) las concretan en requisitos y criterios de aceptación. Las políticas complementarias del MVP no deben presentarse como exigencias oficiales de Roams.

## 2. Problema y oportunidad

La preparación de un presupuesto requiere disponer de los datos del cliente, introducir consumos y comprender cómo contribuyen al importe. También exige poder recuperar la estimación guardada sin confundirla con un cálculo nuevo realizado con otras condiciones.

SaaS-O-Matic debe conectar esas necesidades: registrar una empresa, localizarla, simular su consumo y consultar su historial. El desglose económico debe permitir entender el precio por tramos y el impuesto, mientras la conversión de divisas facilita una lectura orientativa sin alterar el importe original.

Este planteamiento delimita el problema funcional del encargo; no presupone estudios de mercado, resultados de investigación o mejoras de productividad medidas.

## 3. Usuario principal

El perfil contemplado es el **comercial que gestiona información de clientes corporativos y prepara estimaciones de suscripción**.

Sus necesidades son:

- Registrar los datos necesarios del cliente y recibir indicaciones si son inválidos o ya existe su identidad fiscal.
- Localizar una empresa por nombre o identificador y consultar su ficha.
- Introducir consumos previstos y entender el coste mensual resultante.
- Consultar el total en una divisa admitida, reconociendo el carácter orientativo del cambio.
- Guardar y recuperar simulaciones, distinguiendo el resultado confirmado del presupuesto previo.
- Corregir datos o recuperarse de errores sin perder innecesariamente el trabajo.

Las empresas registradas son los sujetos de la información y las simulaciones, no un segundo perfil con acceso propio. El MVP no define roles de administración, portales de clientes ni permisos diferenciados.

## 4. Objetivos del producto

El producto deberá facilitar el registro y la consulta de clientes, ofrecer simulaciones comprensibles y conservar resultados para su consulta posterior.

La experiencia deberá reducir pasos innecesarios entre ficha, simulador e historial, mantener el contexto de navegación y explicar los estados que impidan continuar. La información económica deberá ser transparente: base, impuesto, total y condiciones de conversión reconocibles, sin costes o prestaciones inventados.

Estos son objetivos funcionales y de experiencia; no imponen una tecnología ni representan resultados de uso ya medidos.

## 5. Propuesta de valor

SaaS-O-Matic permite preparar y conservar una estimación vinculada a un cliente desde un mismo recorrido. Aporta claridad sobre el origen del coste, acceso a la información anterior y recuperación ante fallos sin presentar como confirmado lo que todavía es incierto.

Su valor se centra en organizar información y hacer comprensible el presupuesto. No promete optimizar automáticamente contratos, reducir costes o garantizar obligaciones fiscales.

## 6. Alcance del MVP

| Área                       | Capacidad que debe ofrecer                                                                                                                                      |
| -------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Registro de clientes       | Alta con nombre de empresa, identificador fiscal, email de contacto, país y plan; control fiscal español y prevención de duplicados según las reglas aprobadas. |
| Consulta y búsqueda        | Búsqueda por empresa o identificador, resultados paginados y ficha con información corporativa y de contacto.                                                   |
| Simulación de consumos     | Introducción de usuarios activos, almacenamiento contratado y llamadas API estimadas, con validación y ajuste de usuarios mediante controles sincronizados.     |
| Presupuesto                | Previsualización del coste mensual, desglose acumulativo por tramos, base, impuesto y total; sin cargos por parámetros que carezcan de tarifa.                  |
| Impuestos y divisas        | Aplicación de la política demo aprobada y conversión orientativa del total EUR a las divisas admitidas, con fecha y fuente.                                     |
| Guardado e historial       | Confirmación del resultado calculado para el cliente e historial paginado de simulaciones persistidas, sin recalcular el pasado.                                |
| Interacción y recuperación | Uso adaptable a móvil y escritorio, navegación por teclado, mensajes comprensibles y conservación de entradas recuperables.                                     |

Planes demo, límites de consumo, países con tarifa y monedas soportadas se delimitan en [BR02–BR05](business-rules.md), sin duplicar aquí sus fórmulas o catálogos. Registrar un cliente de un país no implica que exista una política de simulación para ese país.

## 7. Recorridos principales

### Registrar un cliente

El comercial accede al alta desde Clientes, introduce los cinco datos y envía. Si hay errores o duplicidad, recibe una explicación y conserva los valores para corregirlos. Tras una creación confirmada accede a la ficha; cancelar devuelve al listado conservando su contexto.

### Buscar y consultar

El comercial busca por nombre o identificador, recorre páginas y abre una ficha. Puede consultar datos corporativos, contacto e historial y regresar al listado con la búsqueda previa. La ausencia de coincidencias debe distinguirse de un error de consulta.

### Crear y ajustar una simulación

Desde la ficha inicia una nueva simulación vinculada al cliente. Los consumos comienzan en cero y la divisa en EUR. Al modificar parámetros válidos consulta la previsualización y su desglose sin guardar automáticamente. Los valores inválidos o la ausencia de condiciones de cálculo deben explicarse antes de permitir guardar.

Cambiar la divisa modifica únicamente la visualización del total. Si la conversión no está disponible, el comercial conserva acceso al presupuesto EUR y puede reintentar la consulta de tasas.

### Guardar un presupuesto

El comercial confirma el guardado mediante una acción explícita. Durante el envío no debe duplicarse la misma acción. Una confirmación válida permanece visible en el simulador con el resultado guardado; si difiere de la previsualización, se muestra el importe confirmado y un aviso comprensible.

Puede volver a la ficha para consultar el historial o preparar explícitamente otra simulación. Cambiar la divisa del resultado confirmado no altera el registro original.

### Recuperar simulaciones y resolver fallos

Al consultar o recargar la ficha, el comercial debe recuperar las simulaciones guardadas con sus importes originales. Puede actualizar el historial y reintentar una lectura fallida sin perder la información del cliente disponible.

Un fallo de envío no debe provocar pérdida innecesaria de consumos. Si no se puede saber si el guardado se confirmó, se comunica la incertidumbre y se ofrece comprobar el historial sin reenviar automáticamente. La comprobación puede abrirse en otra pestaña para conservar el formulario original.

## 8. Principios de producto

- **Simplicidad:** priorizar los recorridos de clientes, simulación e historial, sin añadir módulos para completar una apariencia de SaaS comercial.
- **Claridad:** diferenciar carga, vacío, error y confirmación, con etiquetas y siguientes pasos comprensibles.
- **Transparencia:** mostrar el origen de los importes, el alcance demo de los planes e impuestos y el carácter orientativo de las divisas.
- **Consistencia:** conservar términos, contexto del cliente y patrones de navegación entre pantallas.
- **Prevención:** rechazar entradas inválidas y evitar envíos repetidos mientras una acción está pendiente.
- **Recuperación:** conservar trabajo recuperable, ofrecer reintentos explícitos y no confundir una comunicación fallida con un guardado necesariamente fallido.
- **Respeto al alcance:** cualquier ampliación funcional deberá definirse y aprobarse antes de incorporarse; el nombre del producto no constituye un requisito adicional.

## 9. Criterios de éxito

El producto cumplirá sus objetivos cuando el comercial pueda:

1. Registrar un cliente válido, recibir errores accionables y localizar después su ficha mediante búsqueda.
2. Introducir consumos admitidos y comprender base, impuesto y total conforme a las reglas de negocio.
3. Distinguir una conversión orientativa del importe EUR original y continuar con EUR cuando falle el servicio externo.
4. Guardar una simulación, reconocer su confirmación y recuperar el mismo resultado desde el historial tras recargar o reiniciar la aplicación.
5. Comprender diferencias entre previsualización y guardado sin que se altere el registro histórico.
6. Completar los recorridos principales con presentación adaptable y navegación por teclado, y recuperarse de los errores contemplados sin pérdida innecesaria de datos o reenvíos automáticos.

Estos criterios definen qué deberá verificarse; no afirman que una ejecución concreta haya pasado ni establecen métricas de conversión, satisfacción o rendimiento. Las evidencias y límites de comprobación pertenecen a las validaciones de cada spec.

## 10. Fuera de alcance

El MVP no incluye:

- Autenticación, autorización, roles o acceso propio para empresas registradas.
- Cobros, pagos, facturas legales, suscripciones recurrentes o fiscalidad completa.
- Catálogo comercial real o gestión avanzada de planes y sus prestaciones.
- Edición y eliminación de clientes, edición o eliminación de simulaciones guardadas.
- Descuentos o cargos adicionales por almacenamiento y llamadas API.
- Optimización automática, dashboards con KPI, analítica avanzada o exportaciones.
- Multi-tenant, catálogo ampliado de divisas o verificación censal e internacional de identificadores fiscales.
- Sección global de simulaciones o pantalla individual de detalle no contempladas en el alcance aprobado.

El término «Optimizer» no exige desarrollar un motor adicional de optimización. La consulta del desglose en el simulador no implica una nueva acción Ver detalle en el historial.

La entrega obligatoria comprende ejecución local y repositorio con instrucciones reproducibles. Una demo desplegada es opcional y no presupone hosting elegido. Si se plantea publicación sin autenticación, deberá limitarse a datos ficticios aislados y requerirá una decisión expresa sobre acceso y exposición; la definición del producto no autoriza publicar datos existentes.
