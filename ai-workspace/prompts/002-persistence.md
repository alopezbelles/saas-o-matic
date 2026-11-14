# 002 — Instrucciones técnicas de trabajo

Tipo de registro: **reformulación técnica retrospectiva**, redactada el 14 de noviembre de 2026.
Fuente: solicitudes, aclaraciones y decisiones de la conversación. No son mensajes literales ni textos elaborados enviados originalmente.
Se mantiene la secuencia de decisiones, sin convertir resultados posteriores en instrucciones previas. Referencia de código posterior: 9c03dc3.
[Autorizaciones](../../docs/approvals.md) y [decisiones canónicas](../../specs/002-persistence/clarifications.md).

## P002-01 — Análisis previo de persistencia

### Instrucción reformulada

Revisar la spec 002 y sus dependencias antes de modificar el proyecto.
Explicar qué infraestructura de datos se construirá, qué queda fuera y qué decisiones faltan para ejecutar el plan sin supuestos de negocio.
Contrastar las referencias del modelo con los documentos existentes y presentar las ambigüedades.

### Resultado del análisis

Se identificaron un diccionario externo ausente y decisiones abiertas sobre planes, consumos, moneda y duplicados. Estos hallazgos no se presentan como instrucciones del usuario.

## P002-02 — Definición técnica delegada

### Instrucción reformulada

Proponer una tecnología de persistencia y un modelo proporcionados al ejercicio. Seleccionar planes de demostración y guardas de consumo razonables, evitando máximos excesivos.
Conservar importes históricos en EUR e impedir duplicados fiscales.
Documentar las elecciones y sus consecuencias antes de implementar, sin inventar tarifas o políticas fiscales.

### Concreción posterior adoptada

Se eligieron SQLite, Drizzle y better-sqlite3; clientes y simulaciones con snapshots; planes DEMO_BASIC/DEMO_PRO.
Se propusieron y aceptaron usuarios 0..1000, almacenamiento 0..10000 GB y llamadas 0..10000000; unicidad por país/fiscal normalizado.
Estos detalles concretan la delegación: no se atribuyen como valores escritos en la petición original ni como requisitos oficiales.

## P002-03 — Consolidación documental

### Instrucción reformulada

Actualizar exclusivamente los documentos de 002 para que el alcance sea ejecutable: diccionario de campos, restricciones, decisiones, secuencia de implementación y matriz de pruebas.
Concretar migraciones, aislamiento de archivos, seed repetible y backup seguro.
Durante esta fase no instalar dependencias ni crear bases de datos.

### Criterio de salida

La documentación debe diferenciar las decisiones acordadas de la implementación y de los controles todavía no ejecutados.

## P002-04 — Implementación autorizada del alcance definido

### Instrucción reformulada

Implementar la spec ya concretada, comprobar compatibilidad de dependencias y validar migraciones, integridad, snapshots, seed y backup con bases temporales.
Mantener las capas del proyecto y preservar las regresiones de 001.
No operar sobre datos preexistentes del usuario ni ampliar a endpoints, interfaz o motor de precios/impuestos.

### Criterios de cierre

Registrar comandos y resultados reales, límites de la validación y cambios relevantes. Mantener aceptación humana separada del veredicto técnico.

## Trazabilidad

[Retrospectiva](../iterations/002-persistence-retrospective.md), [modelo](../../specs/002-persistence/spec.md), [validación](../../specs/002-persistence/validation.md).
La reformulación facilita la revisión técnica; no constituye una exportación de conversación ni una comprobación personal del usuario.
