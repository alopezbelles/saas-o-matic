# ADR-001 — Monorepo y límites de la infraestructura

Decisión adoptada e implementada en 001. Registro retrospectivo revisado para explicar motivos y consecuencias. Referencia cbdd562. Fuente del alcance: stack definido para el proyecto, [aclaraciones](../../specs/001-foundation/clarifications.md) e [mensajes originales y contexto técnico](../prompts/001-foundation.md).

## Contexto y fuerzas de diseño

Se necesitan frontend y API con instalación, scripts y controles coordinados. La entrega inicial todavía no incluye negocio ni persistencia; debe permitir evolucionar sin generar módulos, capas o dependencias sin responsabilidad actual. El stack inicial y pnpm son restricciones del encargo, no el resultado de un benchmark de herramientas.

## Decisiones y consecuencias

| Decisión                                           | Motivo                                                                 | Consecuencia o límite                                                                                                                            |
| -------------------------------------------------- | ---------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| Un repositorio con pnpm workspaces                 | Coordinar instalación, versiones y comandos de ambas apps              | Lockfile común y ejecución desde raíz; no se certifica escalado a equipos o proyectos mayores                                                    |
| apps/web con React/Vite y apps/api con Express/tsx | Materializar el stack acordado con ciclos de desarrollo independientes | Cada app conserva su compilación/arranque; la API puede probarse sin el navegador                                                                |
| packages/shared como punto de extensión            | Preparar una ubicación común para contratos futuros                    | En 001 no se atribuyen contratos o dominio de negocio ya implementados; evitar importar ORM o código exclusivo del servidor cuando se incorporen |
| TypeScript estricto y ESM                          | Mantener convenciones consistentes en los paquetes                     | Tipos y build son controles explícitos, no garantía suficiente del comportamiento HTTP                                                           |
| Separar createApp y listen                         | Desacoplar rutas/middleware del proceso que ocupa un puerto            | Tests HTTP con puertos efímeros y cierre de recursos; el arranque mantiene su validación de PORT                                                 |
| node:test y fetch para la base                     | Cubrir salud, smoke HTTP y controles sin dependencias adicionales      | No acredita interacción React ni inspección visual; esas pruebas se introducirán con flujos reales                                               |
| No anticipar capas, router/UI o SQLite             | Complejidad proporcional al alcance inicial                            | El modelo de datos, tarifas y contratos de negocio requieren sus propias especificaciones                                                        |

## Alternativas y procedencia

La propuesta importada con npm/Node 24 se descartó al conciliarla con pnpm y la infraestructura Node 22 existente. Separar repositorios dificultaría coordinar cambios de esta prueba; añadir un orquestador no tenía una necesidad demostrada. Estas últimas son razones arquitectónicas documentadas retrospectivamente, no alternativas construidas o comparadas mediante mediciones.

## Directrices verificables para la IA

Respetar web/API/shared y las restricciones del encargo; reutilizar la infraestructura válida; no generar contratos/billing o capas vacías para necesidades futuras. Mantener scripts de calidad operativos y separar aplicación/servidor. La decisión se comprueba mediante ENV-01/API-01/WEB-01 y los controles de [validación](../../specs/001-foundation/validation.md), no por la mera existencia de carpetas.

[Plan y responsabilidades](../../specs/001-foundation/plan.md), [arquitectura canónica](../../docs/architecture.md) y [decisiones operativas](../../docs/decisions.md). El ADR describe el alcance histórico de 001; las decisiones de entregas posteriores se consultan en sus propios registros.
