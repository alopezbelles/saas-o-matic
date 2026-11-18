# 001 — Evidencia de infraestructura y controles

Resumen retrospectivo revisado para relacionar requisitos, comprobaciones y resultados. Fuente principal: [validación histórica](../../specs/001-foundation/validation.md), referencia cbdd562. Este archivo organiza lo comprobado en aquella entrega; las comprobaciones documentales de la revisión actual se registran por separado.

## Requisito, comprobación y resultado

| Necesidad / RF                             | Caso y método                                                                        | Resultado histórico registrado                                                                   |
| ------------------------------------------ | ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------ |
| Instalar y ejecutar desde raíz — RF1       | ENV-01: instalación frozen-lockfile offline, build y arranque web/API; consulta HTTP | Instalación/build con código 0, web 200 y health 200 en desarrollo y API compilada               |
| Delimitar el contrato mínimo — RF1/RF2     | API-01: GET /health, método/ruta no disponibles y errores de PORT                    | JSON status ok, 404 esperados y código 1 en configuraciones de arranque inválidas/puerto ocupado |
| Comprobar artefactos web — RF2             | WEB-01: Vite preview y peticiones HTTP al HTML/bundle                                | HTML español con raíz React y JavaScript servido con HTTP 200                                    |
| Comprobar los propios controles — RF2      | GATE-01: introducir errores temporales de tipos, lint y test                         | TS2322, no-undef y fallo intencional detectados con código no cero; limpieza del fixture         |
| Mantener contexto y trazabilidad — RF3/RF4 | DOC-01: enlaces locales, spec activa y scripts                                       | Comprobaciones correctas; dos pruebas documentales tras actualizar documentos                    |

Suite histórica: **seis pruebas, cero fallos** — API 2, web 1, gates 1 y docs 2. Lint, typecheck, build y formato registraron código 0. El detalle de comandos, entorno, salidas y errores esperados se conserva una sola vez en [validación](../../specs/001-foundation/validation.md#comandos-ejecutados).

## Evidencia disponible y alcance de la afirmación

| Disponible                                                                 | Lo que permite afirmar                               | Lo que no acredita                                               |
| -------------------------------------------------------------------------- | ---------------------------------------------------- | ---------------------------------------------------------------- |
| Registro canónico y salidas de herramientas conservadas en la conversación | Controles y comportamiento registrados para 001      | Un log íntegro independiente, que no se conserva                 |
| Instalación offline con caché existente                                    | Reinstalación con versiones fijadas en aquel entorno | Instalación desde cero en otro equipo                            |
| Rechazo simulado con configuración node-version de pnpm                    | Aplicación de la restricción de engines              | Haber ejecutado realmente Node 20                                |
| Smoke HTTP del build                                                       | Disponibilidad de HTML/bundle y contrato de salud    | Interacción React, inspección visual o E2E de navegador          |
| Alcance de infraestructura                                                 | Cierre de 001 sin negocio/DB                         | Persistencia SQLite, cálculo monetario o flujos añadidos después |

No se reconstruyen logs ausentes ni se atribuyen resultados de versiones posteriores a cbdd562. El [registro de iteración](../features/001-foundation/iterations.md) explica las incidencias; la [revisión documental](../reviews/001-foundation.md) identifica qué se comprueba en esta mejora editorial. La aceptación humana final permanece separada.
