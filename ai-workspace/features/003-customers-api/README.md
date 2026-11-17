# 003 Customers API — Colaboración con IA

## Objetivo y reparto del trabajo

Utilizar Codex para desarrollar la API de clientes sobre la persistencia de 002, manteniendo contratos claros, validación fiscal independiente e integración segura con SQLite.

La dirección del proyecto pidió adaptar la propuesta a lo ya implementado, aportó el enunciado de alta con cinco campos y autorizó la ejecución. Se delegaron en Codex la concreción técnica, contraste de fuentes fiscales, implementación de las capas y pruebas, y corrección de los problemas encontrados. Las soluciones de diseño y migración documentadas no se atribuyen como decisiones manuales del usuario.

## Criterios que guiaron el trabajo

- Ajustar el contrato al enunciado conservando la información existente: el contacto adicional de almacenamiento pasó a ser opcional mediante una migración nueva.
- Separar contrato y parsing, dominio fiscal puro, servicio, repositorio y transporte HTTP; reutilizar la persistencia de 002 sin dependencias adicionales.
- Abrir la conexión cuando se necesita, mantener health independiente de la base y tratar errores sin exponer datos personales o detalles internos.

[Prompts consolidados](prompts.md) organiza las instrucciones por objetivo. [Iteraciones relevantes](iterations.md) recoge el contraste fiscal, la adaptación compatible y la corrección de la migración.

## Resultado y fuentes canónicas

La API y su cierre técnico están registrados en la [validación de 003](../../../specs/003-customers-api/validation.md); no consta aceptación humana final. Esta memoria no ejecuta pruebas ni modifica la implementación.

Documentación de referencia: [spec](../../../specs/003-customers-api/spec.md), [aclaraciones](../../../specs/003-customers-api/clarifications.md), [plan](../../../specs/003-customers-api/plan.md), [tareas](../../../specs/003-customers-api/tasks.md), [reglas fiscales adoptadas](../../../specs/003-customers-api/fiscal-rules.md), [contratos API](../../../docs/api-contracts.md) y [modelo de datos](../../../docs/data-model.md). Los algoritmos y contratos completos permanecen en esas fuentes.
