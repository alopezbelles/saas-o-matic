# 001 — Instrucciones técnicas de trabajo

Tipo de registro: **reformulación técnica retrospectiva**, redactada el 14 de noviembre de 2026.
Fuente: solicitudes y contexto de la conversación de desarrollo. No es una transcripción literal ni acredita que estos textos elaborados se enviaran originalmente.
Se conserva la intención y el alcance de cada fase. Código de referencia posterior: cbdd562.
Autorizaciones documentadas por separado en [approvals](../../docs/approvals.md).

## P001-01 — Inicialización del monorepo

### Contexto y objetivo

Preparar la infraestructura de SaaS-O-Matic en un directorio vacío, con instalación y ejecución reproducibles desde la raíz.

### Instrucción reformulada

Configurar pnpm workspaces con una aplicación React/TypeScript/Vite en apps/web, una API Node/TypeScript/Express en apps/api y packages/shared como punto de extensión para contratos.
Comprobar versiones de herramientas y compatibilidad antes de instalar. Incorporar tsx para desarrollo del backend, TypeScript estricto, ESLint y Prettier.
Añadir GET /health, scripts de ejecución, exclusiones de Git y README operativo.

### Restricciones y verificación solicitadas

No desarrollar clientes, simulaciones, precios o impuestos; no configurar Prisma/SQLite ni añadir UI innecesaria.
No crear documentación SDD, AGENTS o skills en esta fase, porque se preparaban aparte.
No crear remoto ni hacer commits/pushes/merges.
Verificar instalación, build web, arranque API, health, tipos y lint.

## P001-02 — Análisis de cobertura antes de modificar

### Contexto y objetivo

La documentación de 001 se incorporó después del esqueleto inicial. Determinar qué partes están implementadas y cuáles necesitan trabajo.

### Instrucción reformulada

Leer la spec, sus aclaraciones, plan y tareas, y contrastarlos con los archivos existentes.
Identificar discrepancias de stack, tareas ya cubiertas y criterios sin evidencia.
Presentar el diagnóstico antes de realizar cambios, evitando repetir la inicialización.

### Resultado de esa fase

Se identificaron discrepancias npm/pnpm y carencias en pruebas, contexto y registros. Esta observación es resultado del análisis, no un requisito añadido retrospectivamente al mensaje inicial.

## P001-03 — Completar la base existente

### Instrucción reformulada

Tras el diagnóstico, corregir la documentación para reflejar el monorepo existente y completar los elementos necesarios para cerrar 001.
Reutilizar el trabajo válido, añadir controles verificables y registrar resultados reales sin ampliar a funcionalidades de negocio o persistencia.

### Criterios de cierre

Las tareas completadas deben vincularse a evidencia; los controles no ejecutados deben quedar explícitos.
La autorización de implementar no equivale a revisión humana de la entrega.

## Trazabilidad

[Iteración](../iterations/001-foundation-retrospective.md), [plan](../../specs/001-foundation/plan.md), [validación](../../specs/001-foundation/validation.md).
Este documento explica técnicamente las solicitudes; no sustituye fuentes originales de conversación ni prueba por sí solo una autorización.
