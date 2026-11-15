# Validación 006

Estado funcional: T01 completada técnicamente; conversión, validación del proveedor y cliente pendientes. Sin RF completo ni aceptación humana.

| RF      | Verificación prevista                                      | Resultado funcional real |
| ------- | ---------------------------------------------------------- | ------------------------ |
| 006-RF1 | T02: conversión exacta, identidad, redondeo y overflow     | NO EJECUTADO             |
| 006-RF2 | T03/T04: contrato, concurrencia y metadatos                | NO EJECUTADO             |
| 006-RF3 | T03/T04: fallos, expiración y recuperación sin alterar EUR | NO EJECUTADO             |
| 006-RF4 | T04: caché, cambios de importe y caducidad                 | NO EJECUTADO             |

## T01 — Contratos, catálogo y fixtures

2026-11-15, Windows PowerShell, Node 22 y pnpm local. Autorización: ejecutar T01 únicamente. Se siguió la instrucción previa del plan, sin registrar mensajes en ai-workspace.

Cambios: catálogo inmutable EUR/USD/GBP, entradas discriminadas (EUR sin tasa), salida en unidades menores, errores de dominio exportados y contrato web normalizado con fechas UTC/atribución. El payload externo sigue siendo unknown hasta T03. Fixtures independientes cubren importes, redondeo, overflow, tasas inválidas, fechas y fallos de transporte; no se presentan como respuestas ya validadas por producción.

Resultados reales, código 0:

- pnpm.cmd lint.
- pnpm.cmd typecheck (incluye build de shared y comprobación de shared/API/web).
- pnpm.cmd test:unit: 28 shared + 12 API = 40 pruebas correctas.
- pnpm.cmd test:web: compilación Vite y 3 pruebas correctas (2 de fixtures y smoke HTTP existente).

Las cinco pruebas nuevas verifican catálogo inmutable, errores exportados y coherencia/aislamiento de fixtures. No acreditan RF1–RF4 completos, parsing externo ni comportamiento HTTP del cliente. No se ejecutaron integración SQLite, test:gates ni suite global pnpm test por no cambiar API/DB o herramientas. Sin instalaciones, lockfile, red externa, UI, datos reales ni commits. CORS sigue sin comprobarse. Conformidad técnica de T01; aceptación humana pendiente.

### Controles de cierre documental

pnpm.cmd test:docs: 2 pruebas correctas, código 0. pnpm.cmd format:check: todos los archivos cumplen Prettier, código 0. git diff --check: código 0. El gate documental identifica 006 como spec activa sin alterar los resultados históricos de 005.

## Controles globales futuros

pnpm lint, pnpm typecheck, pnpm format:check, pnpm build y pnpm test. No ejecutar test:gates en paralelo con otros controles de código.

Conservar fecha, entorno, comandos y códigos reales por tarea. Diferenciar pruebas deterministas, smoke externo y limitaciones; no marcar PASS por inspección.

## Comprobaciones externas

CORS desde origen de desarrollo: NO COMPROBADO. Un fetch de Node no acredita CORS del navegador. Un fallo exige consultar alternativa antes de añadir proxy o cambiar proveedor.

Atribución: verificar metadatos del cliente; presentación visible diferida a specs de interfaz.

## Alcance diferido

Sin hook React, componentes, formulario, simulador, selector ni E2E visuales. No atribuir a 006 conservación de inputs o estados visuales comprobados.

## Registro

No registrar esta preparación en ai-workspace por instrucción de Alex. Incorporar futuras evidencias cuando se autorice su registro.
