# 001 Foundation — Prompts consolidados

## 1. Preparar la infraestructura

**Contexto y objetivo.** Partimos de un directorio vacío. Prepara la infraestructura de SaaS-O-Matic con pnpm workspaces, React/TypeScript/Vite, Express/TypeScript, tsx y controles de calidad.

**Instrucciones.** Comprueba las herramientas instaladas y su compatibilidad antes de instalar dependencias. Organiza frontend, API y paquete compartido; incorpora TypeScript estricto, ESLint, Prettier, un endpoint de salud y comandos desde la raíz. Documenta instalación y arranque. No implementes negocio, base de datos o UI adicional, ni crees remoto o hagas commits/pushes.

**Criterio de aceptación.** Ambas aplicaciones deben poder arrancar, el frontend compilar y la API responder a la consulta de salud. Informa de incompatibilidades, fallos y comprobaciones pendientes con resultados observables.

## 2. Contrastar la spec con la base existente

**Contexto y objetivo.** La infraestructura ya está creada y se ha incorporado su spec formal. Revisa la cobertura antes de proponer cambios.

**Instrucciones.** Contrasta los documentos de 001 con archivos, scripts y evidencia disponible. Distingue trabajo reutilizable, discrepancias de stack y controles pendientes. Conserva pnpm y la base válida; una propuesta documental antigua no justifica migrar herramientas. Presenta el diagnóstico antes de implementar.

**Criterio de aceptación.** Identifica qué está hecho y qué falta, con una propuesta de cierre acotada al alcance de infraestructura.

## 3. Completar el cierre y comprobar los controles

**Contexto y objetivo.** El diagnóstico está disponible y se ha autorizado completar lo pendiente. Reutiliza la base y verifica su comportamiento.

**Instrucciones.** Completa las pruebas HTTP, el smoke del build web y los controles negativos con herramientas existentes. Separa aplicación y arranque cuando lo requiera el aislamiento de las pruebas. Corrige incidencias, repite los casos afectados y cierra recursos propios. Registra comandos, resultados y límites sin ampliar a negocio ni presentar un smoke HTTP como prueba de navegador.

**Criterio de aceptación.** El cierre debe estar respaldado por comprobaciones reales, incluida la detección de errores deliberados por los controles. La autorización de implementar y la aceptación humana del resultado permanecen separadas.
