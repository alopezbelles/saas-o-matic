# 003 Customers API — Prompts consolidados

## 1. Alinear el contrato con la persistencia existente

**Contexto y objetivo.** La base de 002 está disponible y el enunciado exige un alta de cinco campos. Integra la API sin añadir requisitos de entrada o perder información existente.

**Instrucciones.** Ajusta el contrato y los parsers al alcance aprobado. Reutiliza las operaciones de persistencia y conserva los tipos compartidos independientes del ORM. Resuelve la incompatibilidad del contacto obligatorio mediante una migración nueva y compatible, sin inventar valores ni modificar SQL ya aplicado.

**Criterio de aceptación.** El alta debe respetar el contrato y la migración conservar clientes, contactos e histórico; los datos inválidos se rechazan antes de escribir.

## 2. Contrastar e implementar la validación fiscal

**Contexto y objetivo.** La validación española requiere comprobar formato y control, con criterios respaldados antes de implementar cada familia.

**Instrucciones.** Utiliza las fuentes y la clasificación adoptadas en la spec, identifica discrepancias y deja explícitos los límites. Implementa el dominio fiscal sin HTTP o acceso a datos y prepara positivos y negativos independientes de la función productiva. Mantén la distinción entre control algorítmico e identidad o existencia censal.

**Criterio de aceptación.** Cada familia cubierta debe tener una regla documentada y oráculos independientes; no basta una expresión regular o la autoconsistencia del código.

## 3. Integrar endpoints, consultas y errores

**Contexto y objetivo.** Implementa registro, listado con búsqueda y detalle utilizando las responsabilidades ya definidas.

**Instrucciones.** Mantén parsing y respuestas en el transporte, reglas en el servicio y SQL en el repositorio. Parametriza consultas y trata la búsqueda como texto literal. Deja la exclusión de duplicados a SQLite y traduce solo el conflicto fiscal correspondiente. Usa conexión lazy, errores y logs sanitizados, sin crear o migrar bases al arrancar.

**Criterio de aceptación.** Las respuestas deben respetar el contrato; health debe seguir disponible sin DB y un fallo de apertura debe permitir recuperación tras inicialización explícita.

## 4. Comprobar integración y corregir regresiones

**Contexto y objetivo.** El cierre necesita evidencia de contrato, control fiscal y comportamiento real de HTTP/SQLite.

**Instrucciones.** Reutiliza las herramientas y bases temporales de 001/002. Comprueba entradas rechazadas, búsqueda, duplicados concurrentes, errores y privacidad, migración con relaciones existentes y cierre de conexiones. Ante un fallo, diagnostica su causa y repite el caso afectado sin debilitar las restricciones. No uses datos del usuario ni amplíes a UI o simulaciones.

**Criterio de aceptación.** Registra resultados y límites reales, preserva las regresiones previas y diferencia conformidad técnica de aceptación humana.
