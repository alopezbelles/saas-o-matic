# Matriz de trazabilidad SDD

## 1. Propósito y alcance

Esta matriz permite recorrer la cadena producto → requisitos y reglas → specs → criterios de aceptación → casos → evidencia. No sustituye las fuentes normativas ni los resultados detallados de validación, y no constituye una aceptación humana del producto.

Las relaciones normativas pueden establecerse al planificar; la evidencia solo puede añadirse después de una ejecución real. Esta consolidación vincula identificadores vigentes con documentación existente, sin afirmar que los nuevos IDs globales se utilizaran originalmente en las specs o que todas las relaciones se documentaran antes del código.

## 2. Modelo y convenciones

- `RF-01`…`RF-16`, `RNF-01`…`RNF-09` e `INF-01`…`INF-04` pertenecen a [requirements.md](requirements.md). Allí se conservan origen y distinción entre enunciado, políticas MVP y restricciones técnicas.
- `BR01`…`BR06` pertenecen a [business-rules.md](business-rules.md). El [producto](product.md) delimita capacidades y exclusiones; los [contratos](api-contracts.md) concretan comunicación.
- `004-RF1` identifica un requisito local de la spec 004, distinto de `RF-01`. Se conservan los identificadores originales, sin renumerarlos.
- `AC-01`…`AC-09` son los criterios generales de requirements. Las condiciones detalladas de cada spec y sus tareas precisan el criterio local.
- Los nombres `UT-*`, `IT-*`, `WEB-*`, `QA-*` y `DELIVERY-*` son casos o grupos definidos en sus fuentes. Su presencia en un plan no demuestra ejecución: deberá consultarse su validación.

En las tablas, **S**, **T** y **V** enlazan respectivamente spec, tareas con condiciones de completado y validación de una feature. La asociación expresa correspondencia de alcance; solo V aporta resultados, versión y límites. Una relación no garantiza cobertura exhaustiva ni aprobación humana.

## 3. Matriz de requisitos

La fuente normativa de cada ID y de los AC es [requirements](requirements.md). La columna Fuente añade la regla o decisión que concreta el comportamiento sin sustituir su procedencia allí documentada.

### Funcionales

| Requisito | Necesidad y fuente normativa                              | Spec y criterio local                                          | Aceptación general | Validación          |
| --------- | --------------------------------------------------------- | -------------------------------------------------------------- | ------------------ | ------------------- |
| RF-01     | Alta con cinco datos; contrato de clientes y BR04.        | [S03]: 003-RF1; [S07]: 007-RF2.                                | AC-01              | [V03], [V07]        |
| RF-02     | Control fiscal español; BR04 y tabla fiscal.              | [S03]: 003-RF2.                                                | AC-01              | [V03]               |
| RF-03     | Identidad fiscal única por país; BR04 y 002-D06.          | [S02]: 002-RF2; [S03]: 003-RF4.                                | AC-01              | [V02], [V03]        |
| RF-04     | Listado y búsqueda paginada; contrato y 007-C11.          | [S03]: 003-RF3; [S07]: 007-RF1/RF4.                            | AC-02              | [V03], [V07]        |
| RF-05     | Consulta de ficha y estados; producto/contrato.           | [S03]: 003-RF3/RF5; [S07]: 007-RF3.                            | AC-02              | [V03], [V07]        |
| RF-06     | Consumir dentro de límites; BR02.                         | [S05]: 005-RF1/RF2; [S08]: 008-RF1/RF2 y condiciones de [T08]. | AC-03              | [V05], [V08]        |
| RF-07     | Preview dinámico y controles sincronizados; 008-C02/C03.  | [S08]: 008-RF1/RF2, ausencia de guardado automático en [T08].  | AC-03              | [V08]               |
| RF-08     | Desglose acumulativo, impuesto y total; BR01–BR03.        | [S04]: 004-RF1/RF2/RF4; [S08]: 008-RF1/RF2.                    | AC-03              | [V04], [V08]        |
| RF-09     | País del cliente y tarifa válida; BR03.                   | [S04]: 004-RF2/RF3; [S05]: 005-RF1/RF2.                        | AC-03              | [V04], [V05]        |
| RF-10     | Conversión orientativa del total; BR05.                   | [S06]: 006-RF1/RF2; [S08]: 008-RF4.                            | AC-04              | [V06], [V08]        |
| RF-11     | Reserva EUR y recuperación FX; BR05 y 008-C06.            | [S06]: 006-RF3; [S08]: 008-RF4.                                | AC-04              | [V06], [V08]        |
| RF-12     | Guardado autoritativo y discrepancia; BR06, 008-C05/C07.  | [S05]: 005-RF1; [S08]: 008-RF3/RF5.                            | AC-05              | [V05], [V08]        |
| RF-13     | Historial paginado y recuperación independiente; BR06.    | [S05]: 005-RF3; [S07]: 007-RF3; actualización en [T08].        | AC-05              | [V05], [V07], [V08] |
| RF-14     | Recuperar resultado original tras recarga/reinicio; BR06. | [S02]: 002-RF1/RF3; [S05]: 005-RF3/RF4.                        | AC-05              | [V02], [V05], [V08] |
| RF-15     | Conservar entradas y comprobar guardado incierto; BR06.   | [S07]: 007-RF2; [S08]: 008-RF3.                                | AC-06              | [V07], [V08]        |
| RF-16     | Navegación y retorno contextual; 007-C01/C11, 008-C01.    | [S07]: 007-RF4/RF5; navegación en [S08] y [T08].               | AC-02, AC-07       | [V07], [V08]        |

### No funcionales e infraestructura

| Requisito | Necesidad y fuente normativa                                             | Spec y criterio local                                                       | Aceptación general         | Validación                 |
| --------- | ------------------------------------------------------------------------ | --------------------------------------------------------------------------- | -------------------------- | -------------------------- |
| RNF-01    | Guardado íntegro e histórico protegido; BR06, constitución 5–6.          | [S02]: 002-RF2/RF3; [S05]: 005-RF1/RF2/RF4.                                 | AC-05, AC-06               | [V02], [V05], [V09]        |
| RNF-02    | Exactitud y redondeo; BR01/BR03/BR05.                                    | [S04]: 004-RF1–RF4; [S06]: 006-RF1.                                         | AC-03, AC-04               | [V04], [V06]               |
| RNF-03    | Fronteras y errores controlados; contratos, constitución 4.              | [S03]: 003-RF2/RF5; [S05]: 005-RF2; [S06]: 006-RF2/RF3.                     | AC-01, AC-03, AC-06, AC-08 | [V03], [V05], [V06], [V09] |
| RNF-04    | Privacidad y seguridad básica; constitución 10, 009-C01.                 | [S03]: 003-RF5; [S09]: 009-RF5/RF6.                                         | AC-08                      | [V03], [V09]               |
| RNF-05    | Reflujo sin pérdida de contenido; producto y diseño.                     | [S07]: 007-RF5; [S08]: diseño y [T08]; [S09]: 009-RF2.                      | AC-07                      | [V07], [V08], [V09]        |
| RNF-06    | Teclado, foco, etiquetas y estados; diseño y alcance accesible aprobado. | [S07]: 007-RF5; [S09]: 009-RF2.                                             | AC-07                      | [V07], [V08], [V09]        |
| RNF-07    | Modularidad y reglas compartidas; constitución 1–4/8.                    | [S03]/[S04]/[S05]: límites de responsabilidad; [S09]: revisión transversal. | AC-08                      | [V03], [V04], [V05], [V09] |
| RNF-08    | Instalación y demo reproducibles; modalidad de entrega aprobada.         | [S10]: 010-RF1/RF3.                                                         | AC-09                      | [V10]                      |
| RNF-09    | Trazabilidad y evidencia fiel; constitución 7/9 y protocolo SDD.         | [S09]: 009-RF4; [S10]: 010-RF2/RF3.                                         | AC-09                      | [V09], [V10]               |
| INF-01    | Stack, workspaces y ejecución; encargo de infraestructura.               | [S01]: 001-RF1.                                                             | AC-09                      | [V01]                      |
| INF-02    | Tipos, lint, formato y controles reales; encargo de infraestructura.     | [S01]: 001-RF2.                                                             | AC-09                      | [V01]                      |
| INF-03    | Contexto y alcance autorizado; instrucciones operativas.                 | [S01]: 001-RF3.                                                             | AC-09                      | [V01]                      |
| INF-04    | Instrucciones, recorrido y evidencia; encargo de infraestructura.        | [S01]: 001-RF4; [S10]: 010-RF1/RF2.                                         | AC-09                      | [V01], [V10]               |

## 4. Matriz de reglas de negocio

La fuente normativa de cada regla es [business-rules](business-rules.md). Los casos se citan según sus planes/tareas y validaciones; no se reproducen fórmulas, resultados o políticas.

| Regla | Alcance                                         | Specs y criterios                                           | Casos relacionados                                                                                     | Evidencia                                                         |
| ----- | ----------------------------------------------- | ----------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------- |
| BR01  | Tramos acumulativos y desglose.                 | [S04]: 004-RF1/RF4; [S08]: 008-RF1.                         | UT-BILL-01, UT-QUOTE-004, UT-PROP-01; WEB-SIM-01.                                                      | [V04], [V08]                                                      |
| BR02  | Consumos, límites y planes sin cargos añadidos. | [S02]: 002-RF2; [S04]: 004-RF3; [S08]: 008-RF2.             | IT-CONSTRAINT-01, UT-INPUT-004, UT-SIM-CONTRACT-005, WEB-SIM-02.                                       | [V02], [V04], [V05], [V08]                                        |
| BR03  | Política fiscal y redondeo.                     | [S04]: 004-RF2/RF3; [S05]: 005-RF1/RF2.                     | UT-TAX-01, UT-MONEY-01, UT-QUOTE-004, IT-SIM-01, IT-INVALID-005.                                       | [V04], [V05]                                                      |
| BR04  | Identificador fiscal y unicidad por país.       | [S03]: 003-RF1/RF2/RF4.                                     | UT-CONTRACT-01, UT-FISC-01, IT-INVALID-01, IT-DUP-01.                                                  | [V03]; [tabla fiscal](../specs/003-customers-api/fiscal-rules.md) |
| BR05  | Total orientativo, vigencia y reserva EUR.      | [S06]: 006-RF1–RF4; [S08]: 008-RF4.                         | Casos monetarios/proveedor definidos en [T06]; WEB-FX-008 y QA-FX-LIVE-009.                            | [V06], [V08], [V09]                                               |
| BR06  | Resultado original, guardado y recuperación.    | [S02]: 002-RF3; [S05]: 005-RF1/RF3/RF4; [S08]: 008-RF3/RF5. | IT-SNAPSHOT-01, IT-SIM-02, IT-SNAPSHOT-005, IT-HIST-01, WEB-SAVE-008, WEB-POLICY-008, WEB-HISTORY-008. | [V02], [V05], [V08]                                               |

## 5. Cobertura por feature

Esta vista permite recorrer la relación inversa desde una feature a sus necesidades de origen. Las features de calidad y entrega son transversales; no constituyen funcionalidades comerciales adicionales.

| Feature             | Propósito y tipo                              | Requisitos relacionados                                       | Spec / criterios / validación |
| ------------------- | --------------------------------------------- | ------------------------------------------------------------- | ----------------------------- |
| 001 Foundation      | Infraestructura y control del trabajo.        | INF-01–INF-04.                                                | [S01] / [T01] / [V01]         |
| 002 Persistence     | Soporte de datos y conservación.              | RF-03, RF-14; RNF-01.                                         | [S02] / [T02] / [V02]         |
| 003 Customers API   | Alta, fiscal, búsqueda y detalle.             | RF-01–RF-05; RNF-03/RNF-04/RNF-07.                            | [S03] / [T03] / [V03]         |
| 004 Billing         | Dominio monetario compartido.                 | RF-08/RF-09; RNF-02/RNF-07.                                   | [S04] / [T04] / [V04]         |
| 005 Simulations API | Guardado autoritativo e histórico.            | RF-06, RF-12–RF-14; RNF-01/RNF-03/RNF-07.                     | [S05] / [T05] / [V05]         |
| 006 Currency        | Conversión y contrato externo.                | RF-10/RF-11; RNF-02/RNF-03.                                   | [S06] / [T06] / [V06]         |
| 007 Customers UI    | Interacción de clientes e historial.          | RF-01, RF-04/RF-05, RF-13, RF-15/RF-16; RNF-05/RNF-06.        | [S07] / [T07] / [V07]         |
| 008 Simulator UI    | Consumos, preview, conversión y confirmación. | RF-06–RF-12, RF-15/RF-16; RNF-05/RNF-06.                      | [S08] / [T08] / [V08]         |
| 009 Quality         | Revisión transversal de requisitos y riesgos. | RNF-01–RNF-07/RNF-09; verificación de recorridos funcionales. | [S09] / [T09] / [V09]         |
| 010 Delivery        | Reproducibilidad y preparación de evaluación. | RNF-08/RNF-09; INF-04.                                        | [S10] / [T10] / [V10]         |

## 6. Consulta de validaciones y evidencia

Se debe partir de V de la feature: su matriz relaciona IDs locales con casos y resultados reales. Las condiciones de T precisan el completado; no sustituyen las ejecuciones. La matriz del enunciado en [V09] identifica la procedencia externa sin convertir esta reorganización en una nueva revisión del PDF.

Para evidencia específica conservada:

- Persistencia: [salida original de 002](../ai-workspace/testing/002-tests.txt).
- Facturación: [revisión global](../ai-workspace/testing/004-billing-t05.md) y [corrección de formato](../ai-workspace/testing/004-billing-format-fix.md), ambas con sus salidas enlazadas; no debe confundirse el estado previo con el cierre posterior.
- Simulaciones: [cierre de API e histórico](../ai-workspace/testing/005-simulations-api-t05.md), con referencias incrementales conservadas en [V05].
- Clientes UI: [cierre de navegador](../ai-workspace/testing/007-customers-ui-t05.md) y [revisión](../ai-workspace/reviews/007-customers-ui-t05.md); las fuentes conservan alcance e incidencias sin que esta matriz los copie.
- Entrega: [ensayo local](../ai-workspace/testing/010-delivery-t03.md), [resultados estructurados](../ai-workspace/testing/010-delivery-t03-results.json) y [revisión final](../ai-workspace/reviews/010-delivery-t05.md).
- Artefactos temporales: el [índice de evidencia 008–010](../ai-workspace/testing/008-010-evidence-index.md) distingue registros conservados de logs y capturas sobrescribibles.

Las evidencias pertenecen a su contexto y versión; no acreditan el estado actual de todo el repositorio después de cambios documentales posteriores. La presencia de un enlace a V tampoco significa que cada prueba se haya repetido durante esta edición. No se ejecutan nuevas suites funcionales para elaborar esta matriz.

La revisión técnica y la aceptación humana deben leerse separadamente. Una comprobación puntual del proveedor real no garantiza disponibilidad futura o CORS de producción; los límites de navegador, accesibilidad y ensayo local permanecen en V correspondientes.

## 7. Brechas y cuestiones abiertas

- **Adopción de IDs globales:** los RF/RNF consolidados tienen correspondencia de alcance en esta matriz, pero las specs conservan sus IDs locales y no se modifican aquí para añadir referencias entrantes. La nota de requirements que describe su sincronización como pendiente queda desactualizada respecto a esta matriz; requiere revisión separada.
- **Fuente externa:** el enunciado no está versionado. El origen oficial se apoya en el cotejo de [V09]; esta tarea no acredita una nueva lectura del PDF ni su disponibilidad para otro evaluador.
- **Referencia histórica ausente:** `ai-workspace/iterations/007-customers-ui.md`, enlazado en la versión anterior de este documento, no existe en el árbol actual. La [síntesis por feature](../ai-workspace/features/007-customers-ui/iterations.md) y [V07] conservan relato y referencias, pero no se afirma equivalencia íntegra o migración del archivo eliminado. Su contenido original requiere historial Git si se necesita una revisión literal.
- **Estados parciales:** [V06] conserva la limitación histórica del intento externo; la comprobación real posterior se documenta en [V09]. Deben consultarse juntas, sin convertir el resultado antiguo en garantía de fallo o éxito actual.
- **Acciones externas:** la matriz secundaria del enunciado menciona repositorio público; [V10] distingue preparación local de visibilidad/acceso remoto e historial no comprobados. No existe aquí evidencia de publicación o despliegue ni aceptación humana final.

No se ha identificado un RF, RNF o INF sin spec de alcance relacionada, ni una BR sin criterio/caso localizado en las fuentes revisadas. Esta correspondencia documental no declara cobertura exhaustiva ni elimina las limitaciones de evidencia indicadas.

[S01]: ../specs/001-foundation/spec.md
[T01]: ../specs/001-foundation/tasks.md
[V01]: ../specs/001-foundation/validation.md
[S02]: ../specs/002-persistence/spec.md
[T02]: ../specs/002-persistence/tasks.md
[V02]: ../specs/002-persistence/validation.md
[S03]: ../specs/003-customers-api/spec.md
[T03]: ../specs/003-customers-api/tasks.md
[V03]: ../specs/003-customers-api/validation.md
[S04]: ../specs/004-billing/spec.md
[T04]: ../specs/004-billing/tasks.md
[V04]: ../specs/004-billing/validation.md
[S05]: ../specs/005-simulations-api/spec.md
[T05]: ../specs/005-simulations-api/tasks.md
[V05]: ../specs/005-simulations-api/validation.md
[S06]: ../specs/006-currency/spec.md
[T06]: ../specs/006-currency/tasks.md
[V06]: ../specs/006-currency/validation.md
[S07]: ../specs/007-customers-ui/spec.md
[T07]: ../specs/007-customers-ui/tasks.md
[V07]: ../specs/007-customers-ui/validation.md
[S08]: ../specs/008-simulator-ui/spec.md
[T08]: ../specs/008-simulator-ui/tasks.md
[V08]: ../specs/008-simulator-ui/validation.md
[S09]: ../specs/009-quality/spec.md
[T09]: ../specs/009-quality/tasks.md
[V09]: ../specs/009-quality/validation.md
[S10]: ../specs/010-delivery/spec.md
[T10]: ../specs/010-delivery/tasks.md
[V10]: ../specs/010-delivery/validation.md
