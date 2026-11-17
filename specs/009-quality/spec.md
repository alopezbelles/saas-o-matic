# 009 — QA transversal, accesibilidad y resiliencia

T01–T02 completadas técnicamente. T03 revisada el 17 de noviembre de 2026, con 009-QA-01 abierto y RF2 pendiente de corrección. T04–T05 requieren indicación posterior de Alex. Registro ai-workspace excluido. Aceptación humana final pendiente.

## Objetivo

Revisar el sistema integrado de 001–008, detectar huecos relevantes, corregir defectos comprobados y reunir evidencias de entrega. La revisión parte de los controles y flujos implementados.

La validación histórica de 008 registra 273 pruebas globales y 31 Playwright correctas, con alta→ficha→simulación→resultado→historial, FX controlado, discrepancias, recuperación, teclado, contraste y cuatro anchos. Es una referencia anterior que deberá verificarse en la versión revisada por 009. [Cierre de 008](../008-simulator-ui/validation.md#t05--flujo-comercial-revisión-visual-y-cierre-global).

## Fuentes y relación con el proyecto

Reglas y contratos en [business-rules](../../docs/business-rules.md), [api-contracts](../../docs/api-contracts.md), [constitución](../../docs/constitution.md) y specs anteriores. docs/requirements.md contiene requisitos de infraestructura. Los identificadores R15/R17/N06/N07 de la plantilla carecen de correspondencia allí y se retiran como supuestas fuentes oficiales.

Navegación superior, tokens/CSS Modules, fuente del sistema y referencia visual de interfaces.pdf ya se acordaron en 007–008. Alex aportó el enunciado completo Prueba Devs con IA.pdf, consultado en C:/Users/alope/Desktop/roams/Prueba Devs con IA.pdf. Esa fuente externa permite contrastar los requisitos oficiales, aunque el archivo no esté versionado en el repositorio.

## Requisitos EARS

- **009-RF1.** CUANDO se realice la revisión final, EL SISTEMA ejecutará los controles existentes y cubrirá reglas críticas y flujo comercial con API/Vite/SQLite temporales y FX controlado, identificando pruebas reutilizadas y regresiones añadidas.
- **009-RF2.** CUANDO se use la interfaz con teclado, en 320/390/768/1440 px o con contenido ampliado al 200 %, EL SISTEMA permitirá acceder a los datos y acciones relevantes con foco, etiquetas y errores asociados. La evidencia distinguirá zoom nativo, layout CSS ampliado y viewport equivalente según lo realmente ejecutado.
- **009-RF3.** SI fallan API, SQLite o FX, EL SISTEMA respetará los contratos de error y recuperación existentes, conservará entradas recuperables y tratará red/timeout/201 ilegible como posible guardado incierto cuando corresponda.
- **009-RF4.** CUANDO se declare un requisito comprobado, EL INFORME enlazará prueba, versión y resultado reales, distinguirá evidencia histórica de ejecución actual y registrará límites y revisión humana por separado.
- **009-RF5.** CUANDO se revise la seguridad básica, LA REVISIÓN comprobará validación de entradas, consultas parametrizadas, límites de peticiones, errores/logs sanitizados, secretos y datos enviados a FX, registrando hallazgos y verificaciones pertinentes.
- **009-RF6.** CUANDO se compruebe puntualmente FX real desde el simulador en Chromium, LA REVISIÓN registrará petición, respuesta, comportamiento de CORS y conversión observada. Cualquier fallo o limitación externa conservará su estado real y se distinguirá de las pruebas automatizadas con fixtures.

## Casos críticos

Validación fiscal y duplicados. Usuarios 0/10/11/15/50/51/1000 y límites de storage/API. Dinero entero, redondeo y versiones. Configuración incompatible, país sin tarifa, 404/422/409/500/503, DB ocupada y recuperación sin escrituras parciales. Timeout o respuesta ilegible después de un posible guardado, bloqueo de doble envío, persistencia/orden/recarga del historial y navegación directa.

FX fallido, caducado, inválido o tardío, EUR de reserva y reintento explícito. Búsqueda/paginación/contexto, estados vacíos, errores asociados, foco y reflujo. Las pruebas de integración, componentes y navegador se combinan según la responsabilidad del caso.

## Alcance

Se reutilizan dominio, contratos, APIs, migraciones, pruebas y herramientas existentes. Se añadirán pruebas cuando cubran un hueco relevante o un defecto reproducible. Cada defecto tendrá comportamiento esperado, evidencia, corrección y comprobación apropiada.

Decisiones confirmadas por Alex, revisión básica de seguridad, Chromium con cuatro anchos/teclado/foco/contraste/ampliación y comprobación puntual de FX real. La suite automatizada mantiene FX controlado y aislamiento de datos.

009 reúne la matriz requisito del enunciado → implementación → prueba → resultado y resuelve defectos técnicos. 010 se encarga del README definitivo, índice de auditoría y organización de evidencias para entrega, ensayo de checkout limpio y preparación de publicación. La inspección de riesgos o carencias de entrega durante 009 podrá derivar trabajo a 010.

No se incluyen funcionalidades nuevas, rediseño, despliegue/CI, dependencias nuevas, cuotas arbitrarias de cobertura, auditoría certificada o benchmark de escala. Las ampliaciones que surjan se propondrán separadamente. Datos reales, commits/pushes y registro ai-workspace mantienen sus límites de autorización.

## Completado

Los seis RF deben quedar vinculados a resultados actuales. Los controles pertinentes deben pasar y los defectos encontrados deben resolverse o quedar identificados con impacto y motivo. No se declarará conforme un RF que conserve un defecto que lo impida. Una limitación externa en RF6 se documentará como comprobación limitada o fallida, sin atribuir éxito al proveedor real a partir de fixtures.

El cierre técnico del agente y la aceptación humana son estados diferentes. Alex confirmará su revisión cuando la realice. Decisiones de alcance y fuentes en [clarifications.md](clarifications.md), ejecución en [tasks.md](tasks.md) y evidencia en [validation.md](validation.md).
