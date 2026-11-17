# 001 — Mensajes originales y contexto técnico

Mensajes originales recuperados del historial local de Codex, conservados literalmente en los bloques «Mensaje original». Los apartados de contexto y lectura técnica explican su alcance y se distinguen de la transcripción. Referencia de infraestructura: cbdd562. [Registro de autorizaciones](../../docs/approvals.md).

## P001-01 — Inicialización del monorepo

### Mensaje original

<!-- prettier-ignore -->
```text
Quiero inicializar la estructura técnica de mi proyecto `saas-o-matic`, una aplicación Full-Stack para la prueba técnica de Roams.

El directorio de trabajo actual está vacío.

### Objetivo

Preparar exclusivamente la infraestructura inicial del monorepo, sin implementar funcionalidades de negocio.

### Stack inicial

- Monorepo: pnpm workspaces.
- Frontend: React + TypeScript + Vite.
- Backend: Node.js + TypeScript + Express.
- Backend development: tsx.
- Calidad: ESLint y Prettier.
- Control de versiones: Git.

### Tareas

1. Comprueba las versiones instaladas de Node.js, npm, pnpm y Git.
2. Verifica la compatibilidad de las versiones antes de instalar dependencias.
3. Inicializa Git si todavía no existe un repositorio.
4. Configura el monorepo con pnpm workspaces.
5. Crea `apps/web` utilizando Vite, React y TypeScript.
6. Crea `apps/api` con Express y TypeScript, incluyendo un endpoint mínimo `GET /health`.
7. Prepara `packages/shared` para futuros contratos TypeScript compartidos.
8. Configura scripts en el package.json raíz para ejecutar frontend y backend.
9. Configura TypeScript estricto, ESLint y Prettier.
10. Crea un `.gitignore` adecuado para Node.js, variables de entorno y futuras bases de datos SQLite.
11. Crea un README inicial con instrucciones para instalar y ejecutar el proyecto.
12. Ejecuta la instalación de dependencias y comprueba que ambas aplicaciones arrancan correctamente.

### Restricciones

- No implementes clientes, simulaciones, facturación ni impuestos.
- No configures todavía Prisma ni SQLite.
- No añadas librerías de UI ni dependencias innecesarias.
- No generes specs, AGENTS.md, skills ni documentación SDD. Work está preparando esos archivos.
- No crees carpetas vacías únicamente para anticipar entregables de Work.
- No crees un repositorio remoto.
- No hagas commit, push ni merge sin mi autorización.
- No modifiques archivos ajenos al directorio del proyecto.

### Validación

Al finalizar, comprueba:

- Que las dependencias se instalan correctamente.
- Que el frontend compila.
- Que el backend inicia sin errores.
- Que `GET /health` responde correctamente.
- Que TypeScript y ESLint no presentan errores.
- Que el monorepo puede ejecutarse desde la raíz.

Muéstrame un resumen de los archivos creados, las dependencias instaladas, los comandos de ejecución y cualquier problema detectado.

Indícame si el proyecto está listo para realizar el primer commit, pero no lo ejecutes todavía.

```

Los apartados siguientes explican el alcance técnico; no forman parte del mensaje original.

### Contexto y entradas

Directorio de proyecto inicialmente vacío. Stack definido como restricción: pnpm workspaces, React/TypeScript/Vite, Node/TypeScript/Express, tsx, ESLint y Prettier. Es necesario conocer las versiones instaladas de Node, npm, pnpm y Git y comprobar compatibilidad antes de instalar.

### Objetivo

Obtener una base ejecutable desde la raíz con frontend, backend mínimo y un paquete preparado para futuros contratos compartidos, sin anticipar funcionalidades de producto.

### Alcance técnico del mensaje

1. Inventariar herramientas y resolver incompatibilidades antes de instalar dependencias; conservar las versiones efectivamente utilizadas.
2. Configurar apps/web, apps/api y packages/shared dentro de pnpm workspaces, con TypeScript estricto y scripts raíz de desarrollo/calidad/compilación.
3. Incorporar un endpoint GET /health, exclusiones de Git y README con pasos de instalación/arranque. Usar tsx para iteración del backend.
4. Ejecutar instalación, build web, arranque API/health, comprobación de tipos y lint; registrar cualquier paso no validado o incidencia de entorno.

### Decisiones fijadas y límites

El stack y la división web/API/shared delimitan la implementación. No añadir clientes, simulaciones, precios, impuestos, Prisma, SQLite o librerías de UI. No generar todavía documentación SDD, AGENTS o skills, que se preparaban por separado. No crear remoto ni realizar commits, pushes o merges. Las restricciones forman parte del encargo, no son decisiones inferidas por la IA.

### Entregables y criterios de comprobación

Esqueleto web/API/shared, configuración de workspaces/TypeScript/calidad, scripts operativos y README. La aceptación técnica requiere poder instalar y compilar, arrancar ambas apps desde raíz y observar una respuesta de health. Los resultados concretos se consultan en [validación](../../specs/001-foundation/validation.md), sin convertir esta lista retrospectiva en un registro de ejecución.

## P001-02 — Análisis de cobertura sobre infraestructura existente

### Mensaje original

<!-- prettier-ignore -->
```text
analiza la carpeta specs/001-foundations, dime si la entiendes y antes de hacer nada, dime si necesitamos hacer algo o ya está hecho. 

```

Los apartados siguientes explican el alcance técnico; no forman parte del mensaje original.

### Contexto y entradas

La spec formal se incorporó después del esqueleto inicial. Entradas de esta fase: spec, aclaraciones, plan/tareas importados y archivos/configuración ya presentes en el repositorio.

### Objetivo

Separar trabajo implementado, discrepancias documentales y criterios pendientes antes de modificar el proyecto. Evitar reconstruir la infraestructura o migrar el stack por una propuesta antigua.

### Alcance técnico del mensaje

Contrastar cada requisito/tarea con archivos, scripts y evidencia. Preparar un diagnóstico que identifique: elementos reutilizables, diferencias npm/pnpm o de versiones, huecos de pruebas/contexto y comprobaciones sin resultado. Proponer el trabajo mínimo de cierre y su verificación, sin implementar durante la fase de análisis.

### Entregable y criterio de decisión

Diagnóstico de cobertura y propuesta acotada de cambios. Conservar pnpm y la infraestructura válida; una incoherencia de la plantilla debe corregirse en la documentación, no justificar por sí sola una migración. El análisis encontró discrepancias de stack y carencias de controles/contexto; ese hallazgo es un resultado posterior, no una exigencia inventada del briefing inicial.

## P001-03 — Completar y verificar la base

### Mensaje original

<!-- prettier-ignore -->
```text
claro, corrije todo lo que ya está hecho e implementa si falta por hacer algo. 

```

Los apartados siguientes explican el alcance técnico; no forman parte del mensaje original.

### Contexto y entradas

Diagnóstico disponible y ejecución del cierre autorizada. Se parte de web/API/shared existentes y de los criterios de infraestructura conciliados; [plan](../../specs/001-foundation/plan.md) y [tareas](../../specs/001-foundation/tasks.md) definen el trabajo de cierre.

### Objetivo y alcance técnico

Reutilizar la base válida y completar los controles pendientes. Separar la creación de Express del proceso que escucha el puerto para poder probar HTTP con puertos efímeros. Usar node:test y fetch, sin dependencias nuevas, y comprobar API, artefactos web y detección de errores deliberados de los controles. Integrar contexto/documentación y registrar comandos, resultados, incidencias y límites reales.

### Restricciones y salida esperada

No ampliar a negocio, persistencia o UI avanzada. No sustituir pruebas por scripts vacíos o declaraciones de cobertura. Los procesos y fixtures propios deben cerrarse. La salida esperada es una infraestructura verificable con requisito→caso→resultado y una revisión técnica diferenciada de la aceptación humana.

## Trazabilidad del encargo y del resultado

| Instrucción | Necesidad dirigida                 | Trabajo asociado                                  | Comprobación disponible                    |
| ----------- | ---------------------------------- | ------------------------------------------------- | ------------------------------------------ |
| P001-01     | Base instalable y ejecutable       | 001-RF1; inicialización anterior a la spec formal | ENV-01 y registro de herramientas/arranque |
| P001-02     | Mantener stack y delimitar cambios | 001-RF3; T01 de conciliación                      | Diagnóstico recogido en la retrospectiva   |
| P001-03     | Cierre verificable y contexto      | T02–T05; 001-RF1–RF4                              | API-01, WEB-01, GATE-01 y DOC-01           |

[Secuencia de iteración](../iterations/001-foundation-retrospective.md), [decisiones arquitectónicas](../decisions/ADR-001-monorepo.md) y [evidencia](../testing/001-foundation.md). La dirección del trabajo se observa en el encargo inicial y sus restricciones, el diagnóstico previo y la autorización de cierre. Los bloques originales constituyen la transcripción; la explicación técnica aporta contexto sin modificarla.
