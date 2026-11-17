# 002 Persistence — Colaboración con IA

## Objetivo y reparto del trabajo

Utilizar Codex para preparar la persistencia local de clientes y simulaciones sobre la infraestructura de 001, sin implementar todavía API de negocio, interfaz o cálculo de tarifas.

Se delegaron al asistente la propuesta de tecnología y modelo, su concreción documental, implementación y comprobaciones. La dirección del proyecto confirmó histórico EUR y prevención de duplicados, pidió consolidar las decisiones antes de programar y autorizó posteriormente la implementación. Los planes demo y límites concretos fueron propuestos dentro de esa delegación y aceptados; no se presentan como requisitos oficiales o valores escritos inicialmente por el usuario.

## Decisiones que guiaron a Codex

- SQLite con Drizzle y better-sqlite3 para una persistencia local con SQL inspeccionable, manteniendo ORM y almacenamiento fuera de los contratos compartidos.
- Snapshots y protección del histórico para conservar el resultado guardado sin recalcularlo al leer.
- Migraciones explícitas y transaccionales, con reconocimiento del archivo y detección de deriva; sin creación automática desde el arranque de la API.
- Seed restringido a demo y pruebas con archivos temporales propios, preservando datos existentes.

Los motivos y límites se desarrollan en las fuentes canónicas, sin reproducir aquí el modelo.

## Recorrido y resultado

[Prompts consolidados](prompts.md) resume las instrucciones por objetivo. [Iteraciones relevantes](iterations.md) explica la preparación, los ajustes de compatibilidad y las correcciones documentadas.

La persistencia tiene cierre técnico registrado en la [validación de 002](../../../specs/002-persistence/validation.md); no consta aceptación humana final. Esta memoria no ejecuta pruebas ni operaciones de datos.

Documentación canónica: [spec](../../../specs/002-persistence/spec.md), [aclaraciones](../../../specs/002-persistence/clarifications.md), [plan](../../../specs/002-persistence/plan.md), [tareas](../../../specs/002-persistence/tasks.md) y [modelo y operación](../../../docs/data-model.md). Las evoluciones posteriores del esquema se consultan en sus propias entregas.
