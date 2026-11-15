# Validación 006

Estado funcional: NO IMPLEMENTADO. Preparación documental únicamente; sin pruebas funcionales ejecutadas ni aceptación humana.

| RF      | Verificación prevista                                      | Resultado funcional real |
| ------- | ---------------------------------------------------------- | ------------------------ |
| 006-RF1 | T02: conversión exacta, identidad, redondeo y overflow     | NO EJECUTADO             |
| 006-RF2 | T03/T04: contrato, concurrencia y metadatos                | NO EJECUTADO             |
| 006-RF3 | T03/T04: fallos, expiración y recuperación sin alterar EUR | NO EJECUTADO             |
| 006-RF4 | T04: caché, cambios de importe y caducidad                 | NO EJECUTADO             |

## Controles previstos

pnpm lint, pnpm typecheck, pnpm format:check, pnpm build y pnpm test. No ejecutar test:gates en paralelo con otros controles de código.

Conservar fecha, entorno, comandos y códigos reales por tarea. Diferenciar pruebas deterministas, smoke externo y limitaciones; no marcar PASS por inspección.

## Comprobaciones externas

CORS desde origen de desarrollo: NO COMPROBADO. Un fetch de Node no acredita CORS del navegador. Un fallo exige consultar alternativa antes de añadir proxy o cambiar proveedor.

Atribución: verificar metadatos del cliente; presentación visible diferida a specs de interfaz.

## Alcance diferido

Sin hook React, componentes, formulario, simulador, selector ni E2E visuales. No atribuir a 006 conservación de inputs o estados visuales comprobados.

## Registro

No registrar esta preparación en ai-workspace por instrucción de Alex. Incorporar futuras evidencias cuando se autorice su registro.
