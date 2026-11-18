# Requisitos de SaaS-O-Matic

## 1. Propósito y fuentes

Este documento establece requisitos funcionales, de calidad e infraestructura vigentes para orientar las especificaciones. No es un inventario de código ni una declaración de cumplimiento. La redacción normativa no atribuye a las decisiones una aprobación anterior a la acreditada por sus fuentes.

Fuentes y etiquetas de procedencia:

| Etiqueta | Autoridad y alcance                                                                                                                                                                                                                                                                                |
| -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| E        | Requisito del enunciado de Roams según el cotejo conservado en la [matriz de 009](../specs/009-quality/validation.md#qa-review-009--matriz-final-del-enunciado). Es una referencia secundaria: el PDF original es externo al repositorio y esta consolidación no acredita una nueva lectura de él. |
| BR       | Requisito derivado de las [reglas de negocio](business-rules.md); debe distinguirse allí requisito oficial y política complementaria.                                                                                                                                                              |
| MVP      | Decisión complementaria aprobada, con fuente en aclaraciones de specs y [definición de producto](product.md). No constituye exigencia oficial adicional.                                                                                                                                           |
| T        | Restricción técnica o de proceso autorizada, documentada en las instrucciones de infraestructura y la [constitución](constitution.md).                                                                                                                                                             |

Las etiquetas pueden combinarse: una capacidad puede proceder del enunciado y sus límites del MVP. Las [convenciones API](api-contracts.md) concretan entradas y respuestas; no se duplican aquí esquemas o fórmulas. La solución técnica pertenece a [arquitectura](architecture.md).

Una contradicción entre fuentes deberá identificarse y resolverse con la autoridad pertinente. No se cambiará un requisito para justificar el comportamiento de la implementación. Los identificadores RF y RNF siguientes consolidan requisitos vigentes; no sustituyen los IDs locales de las specs ni recuperan IDs antiguos de plantilla sin fuente.

## 2. Requisitos funcionales

### Clientes

| ID    | Requisito verificable                                                                                                                                                                    | Procedencia                                                                                                            |
| ----- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| RF-01 | El sistema deberá permitir registrar un cliente con nombre de empresa, identificador fiscal, email de contacto, país y plan elegido, rechazando datos obligatorios ausentes o inválidos. | E §2A; BR04 y contrato de clientes.                                                                                    |
| RF-02 | Para España, el sistema deberá comprobar formato y carácter de control del identificador fiscal según las categorías y límites aprobados; un valor inválido no deberá crear cliente.     | E §2A; BR04 y [tabla fiscal](../specs/003-customers-api/fiscal-rules.md).                                              |
| RF-03 | El sistema deberá impedir duplicar un cliente con el mismo país e identificador fiscal normalizado, conservando ceros iniciales.                                                         | MVP/BR04; [002 D06](../specs/002-persistence/clarifications.md) y [003](../specs/003-customers-api/clarifications.md). |
| RF-04 | El usuario deberá poder listar y buscar clientes por empresa o identificador fiscal y consultar resultados paginados.                                                                    | E §2B; MVP para paginación, [007 C11](../specs/007-customers-ui/clarifications.md).                                    |
| RF-05 | El usuario deberá poder consultar la ficha corporativa y de contacto de un cliente, distinguiendo identificador inválido, cliente ausente y fallo temporal.                              | E §2B según cotejo; MVP/contratos de 003 y 007.                                                                        |

### Simulaciones y presupuesto

| ID    | Requisito verificable                                                                                                                                                                                               | Procedencia                                                                                                               |
| ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| RF-06 | El usuario deberá poder preparar una simulación vinculada a un cliente existente introduciendo usuarios activos, almacenamiento y llamadas API estimadas, dentro de los límites aprobados.                          | E §2A; BR02 y [002 D04](../specs/002-persistence/clarifications.md).                                                      |
| RF-07 | El sistema deberá actualizar la previsualización al cambiar consumos válidos, sincronizando slider y número de usuarios, sin guardar automáticamente.                                                               | E §2B para controles dinámicos; MVP, [008 C02/C03](../specs/008-simulator-ui/clarifications.md).                          |
| RF-08 | El presupuesto deberá mostrar base acumulativa por tramos, impuesto, total y desglose conforme a BR01–BR03, sin cargos adicionales por parámetros sin tarifa definida.                                              | E §2A; BR01–BR03 para concreciones.                                                                                       |
| RF-09 | La simulación deberá utilizar el país del cliente y la política fiscal configurada; un país sin regla deberá impedir el cálculo, sin sustituirse por impuesto cero.                                                 | MVP/BR03; [004](../specs/004-billing/clarifications.md).                                                                  |
| RF-10 | El usuario deberá poder visualizar de forma orientativa el total EUR en USD o GBP mediante una API pública, con fecha y atribución, sin convertir el desglose o alterar el importe original.                        | E §2B; MVP/BR05 para catálogo y alcance, [006](../specs/006-currency/clarifications.md).                                  |
| RF-11 | Si falla o caduca la conversión, el usuario deberá conservar el total EUR, poder reintentar explícitamente y guardar una simulación EUR válida.                                                                     | MVP/BR05; [008 C06](../specs/008-simulator-ui/clarifications.md).                                                         |
| RF-12 | El sistema deberá permitir un guardado explícito, calcular su resultado autoritativo y mostrar la confirmación con el importe guardado; una discrepancia con el preview deberá comunicarse sin alterar el registro. | E para persistencia; BR06 y [008 C05/C07](../specs/008-simulator-ui/clarifications.md) para confirmación y discrepancias. |

### Histórico y recuperación

| ID    | Requisito verificable                                                                                                                                                                               | Procedencia                                                                                                                                    |
| ----- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| RF-13 | El usuario deberá poder consultar y actualizar el historial paginado de simulaciones del cliente, distinguiendo historial vacío de fallo y manteniendo disponibles los datos de ficha ya obtenidos. | E §2B para historial; MVP, [005 C02](../specs/005-simulations-api/clarifications.md) y [007 C04](../specs/007-customers-ui/clarifications.md). |
| RF-14 | El sistema deberá recuperar tras recarga o reinicio los resultados guardados con consumos, importes, desglose, versiones y contexto originales, sin recalcularlos con reglas actuales.              | E para persistencia; MVP/BR06 y [002 D05/C04](../specs/002-persistence/clarifications.md) para conservación.                                   |
| RF-15 | Ante errores contemplados, el usuario deberá conservar entradas recuperables; ante un guardado incierto deberá poder comprobar clientes o historial sin reenvío automático.                         | MVP/BR06; [007 C12](../specs/007-customers-ui/clarifications.md) y [008](../specs/008-simulator-ui/spec.md).                                   |
| RF-16 | El usuario deberá poder desplazarse entre listado, alta, ficha y simulador conservando el contexto de búsqueda y paginación cuando corresponda, con retorno seguro en accesos directos.             | MVP; [007 C01/C11](../specs/007-customers-ui/clarifications.md) y [008 C01](../specs/008-simulator-ui/clarifications.md).                      |

## 3. Requisitos no funcionales

| ID     | Requisito verificable                                                                                                                                                                                                                                           | Procedencia                                                                                |
| ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| RNF-01 | Un guardado deberá ser coherente y completo: un fallo anterior a su confirmación no dejará registros parciales ni modificará el histórico previo.                                                                                                               | BR06; constitución 5–6; specs 002/005.                                                     |
| RNF-02 | Los importes deberán respetar exactitud, rango y redondeo de BR03/BR05; desglose, base, impuesto y total deberán ser consistentes.                                                                                                                              | BR01/BR03/BR05; [004 D10](../specs/004-billing/clarifications.md).                         |
| RNF-03 | El sistema deberá validar entradas y respuestas externas en sus fronteras y devolver errores controlados, sin confiar en importes o tasas autoritativos aportados por el consumidor.                                                                            | BR06, contratos; constitución 4; specs 003/005/006.                                        |
| RNF-04 | Errores, logs y comunicaciones con el proveedor FX no deberán revelar secretos o datos privados innecesarios. La revisión de seguridad deberá declarar su alcance, sin garantía de auditoría exhaustiva.                                                        | E §1/§4 según cotejo; constitución 10 y [009 C01](../specs/009-quality/clarifications.md). |
| RNF-05 | La interfaz deberá permitir acceder a información y acciones en móvil y escritorio, con reflujo y sin pérdida de contenido relevante.                                                                                                                           | E §2B; MVP, specs 007/008 y [009 C02](../specs/009-quality/clarifications.md).             |
| RNF-06 | La interacción deberá admitir teclado, foco perceptible, etiquetas y errores asociados y mensajes de estado comprensibles. El objetivo de accesibilidad y el método de ampliación se verificarán dentro del alcance aprobado, sin afirmar certificación global. | MVP, specs 007/008/009 y [diseño](design.md).                                              |
| RNF-07 | La organización deberá separar responsabilidades y evitar duplicación de reglas, manteniendo contratos y dominio independientes de presentación y persistencia.                                                                                                 | E §1/§4 según cotejo; T, constitución 1–4 y 8.                                             |
| RNF-08 | La entrega deberá permitir instalar, inicializar una base nueva, arrancar y ejecutar controles siguiendo instrucciones reproducibles, declarando entorno y límites del ensayo.                                                                                  | E §3/§4 según cotejo; MVP, [010 C04/C05/C07](../specs/010-delivery/clarifications.md).     |
| RNF-09 | La evaluación deberá poder relacionar requisitos, specs y resultados reales, con evidencia del trabajo asistido por IA y distinción entre planificación, ejecución, cierre técnico y aceptación humana.                                                         | E §3/§4 según cotejo; T, constitución 7/9 y [protocolo SDD](sdd-harness.md).               |

No se establecen SLA, percentiles de latencia, capacidad de concurrencia, porcentajes de cobertura o métricas de satisfacción no aprobados. Los tiempos y anchos concretos acordados deben consultarse en las specs; no equivalen a un compromiso general de rendimiento o certificación.

## 4. Requisitos de infraestructura y proceso

Se conservan los identificadores de infraestructura y sus referencias originales. Su fuente son las instrucciones iniciales del responsable del proyecto, no una atribución automática al enunciado de Roams.

| ID     | Requisito                                                                                                                                                    | Referencia                                 | Naturaleza                      |
| ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------ | ------------------------------- |
| INF-01 | El proyecto deberá organizarse con pnpm workspaces, React/TypeScript/Vite, Node/TypeScript/Express y tsx.                                                    | [001-RF1](../specs/001-foundation/spec.md) | Infraestructura.                |
| INF-02 | El proyecto deberá utilizar TypeScript estricto, ESLint y Prettier, con comandos diferenciados de compilación y controles reales capaces de detectar fallos. | [001-RF2](../specs/001-foundation/spec.md) | Infraestructura y verificación. |
| INF-03 | El agente deberá disponer de contexto de trabajo y respetar el alcance autorizado; una tarea no autoriza funcionalidades posteriores.                        | [001-RF3](../specs/001-foundation/spec.md) | Proceso y autonomía.            |
| INF-04 | La documentación deberá ofrecer instrucciones reproducibles, recorrido de evidencias y enlaces verificables.                                                 | [001-RF4](../specs/001-foundation/spec.md) | Documentación y proceso.        |

La autorización de infraestructura no incluye negocio, ORM, SQLite o UI adicional dentro de 001. La persistencia y las funcionalidades requieren sus propios alcances aprobados; esa exclusión inicial no prohíbe las decisiones posteriores de otras specs.

## 5. Restricciones y supuestos

### Restricciones aprobadas

- El producto deberá respetar el MVP y sus [exclusiones](product.md); no se asumirán cobros, facturación legal, roles, multi-tenant, descuentos o cargos no definidos.
- Las políticas demo de planes e impuestos y los límites de consumo no deberán presentarse como catálogo comercial o fiscalidad completa.
- La validación fiscal deberá limitar sus afirmaciones a formato y control, sin acreditar identidad, censo o validez internacional.
- Las simulaciones deberán conservar EUR y contexto histórico, sin persistir divisas de visualización ni permitir edición o eliminación del registro.
- Pruebas y demos deberán usar datos ficticios y destinos aislados; ninguna operación rutinaria autoriza sobrescribir bases existentes.
- Nuevas dependencias, arquitectura relevante, alcance, servicios o acciones externas requerirán autorización conforme a AGENTS y al protocolo vigente. No se autorizarán implícitamente commits, push, publicación o despliegue.
- Entrega local y repositorio constituyen la modalidad confirmada; hosting y demo desplegada son opcionales. La mención de repositorio público en el cotejo del enunciado no acredita publicación, visibilidad o acceso del evaluador.

### Dependencias y supuestos de uso

Se contempla un comercial operando sobre clientes corporativos, sin roles diferenciados. Se requiere un entorno compatible para ejecutar el proyecto y acceso de red para instalar dependencias. La conversión externa depende de conectividad, validez de tasas y acceso desde el origen del navegador; su disponibilidad no debe suponerse garantizada.

Las limitaciones del entorno deberán documentarse, no transformarse en supuestos de cumplimiento. Una copia limpia en un equipo no acredita portabilidad universal ni despliegue productivo.

## 6. Criterios generales de aceptación

Estos criterios establecen qué deberá observarse; no afirman resultados obtenidos ni sustituyen los casos detallados de cada spec.

| ID    | Condición observable                                                                                                                           | Requisitos asociados           |
| ----- | ---------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------ |
| AC-01 | Un alta válida puede consultarse después; datos inválidos o duplicados reciben el error correspondiente sin crear un segundo cliente.          | RF-01–RF-03; RNF-03.           |
| AC-02 | Una búsqueda devuelve coincidencias o vacío coherentes, permite paginar y abrir una ficha y recuperar el contexto al volver.                   | RF-04, RF-05, RF-16.           |
| AC-03 | Cambiar consumos válidos produce el presupuesto y desglose de las reglas vigentes; entradas inválidas o país sin tarifa impiden guardar.       | RF-06–RF-09; RNF-02, RNF-03.   |
| AC-04 | La conversión muestra total, fecha y fuente; su fallo conserva EUR y no altera el registro original.                                           | RF-10, RF-11; RNF-02.          |
| AC-05 | El guardado confirmado presenta el resultado autoritativo y discrepancias; el histórico conserva el mismo hecho después de recarga o reinicio. | RF-12–RF-14; RNF-01.           |
| AC-06 | Los errores mantienen entradas recuperables y permiten comprobar un posible guardado sin repetirlo automáticamente.                            | RF-15; RNF-01, RNF-03.         |
| AC-07 | Los recorridos aprobados permiten consultar y actuar con teclado y reflujo, sin ocultar información esencial o errores.                        | RNF-05, RNF-06; RF-16.         |
| AC-08 | Entradas y fallos no exponen información sensible y las responsabilidades y reglas compartidas pueden revisarse sin duplicación injustificada. | RNF-03, RNF-04, RNF-07.        |
| AC-09 | Un evaluador puede seguir instrucciones para ejecutar una demo nueva y localizar evidencia con fuente, contexto y límites.                     | RNF-08, RNF-09; INF-01–INF-04. |

## 7. Relación con las especificaciones

La relación siguiente identifica dónde se concretan estos requisitos; no introduce cambios en los IDs o matrices existentes ni afirma que ya utilicen los identificadores consolidados aquí.

| Requisitos                                               | Specs relacionadas y responsabilidad                                                                     |
| -------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| INF-01–INF-04                                            | [001 Foundation](../specs/001-foundation/spec.md): base, controles, contexto y documentación.            |
| RF-03, RF-14; RNF-01                                     | [002 Persistence](../specs/002-persistence/spec.md): identidad, conservación y persistencia.             |
| RF-01–RF-05; RNF-03                                      | [003 Customers API](../specs/003-customers-api/spec.md): alta, fiscal, búsqueda y detalle.               |
| RF-08, RF-09; RNF-02                                     | [004 Billing](../specs/004-billing/spec.md): cálculo, impuestos y precisión.                             |
| RF-06, RF-12–RF-14; RNF-01, RNF-03                       | [005 Simulations API](../specs/005-simulations-api/spec.md): cálculo autoritativo, guardado e histórico. |
| RF-10, RF-11; RNF-02, RNF-03                             | [006 Currency](../specs/006-currency/spec.md): conversión y frontera externa.                            |
| RF-01, RF-04, RF-05, RF-13, RF-15, RF-16; RNF-05, RNF-06 | [007 Customers UI](../specs/007-customers-ui/spec.md): interacción de clientes e historial.              |
| RF-06–RF-12, RF-15, RF-16; RNF-05, RNF-06                | [008 Simulator UI](../specs/008-simulator-ui/spec.md): simulación, confirmación y recuperación.          |
| RNF-01–RNF-07, RNF-09                                    | [009 Quality](../specs/009-quality/spec.md): verificación transversal y matriz del enunciado.            |
| RNF-08, RNF-09; INF-04                                   | [010 Delivery](../specs/010-delivery/spec.md): reproducibilidad, evidencia y preparación de entrega.     |

La [trazabilidad detallada](traceability.md) y las validaciones conservan los casos y resultados. La adopción de estos RF/RNF en sus referencias entrantes queda pendiente de una actualización documental separada; no se atribuye una sincronización no realizada. No se recuperan los IDs históricos R01/R14/N07 ni otros de plantilla sin correspondencia acreditada.
