# Aclaraciones 001

| ID      | Resolución para esta spec                                                                            | Evidencia y límite                                                                                                                                             |
| ------- | ---------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| D11     | Mantener pnpm 10.33.4, Node 22.13+ de la rama 22, React/Vite, Express, TypeScript y packages/shared. | Stack solicitado e infraestructura existente; no migrar a npm ni Node 24.                                                                                      |
| D12     | Validar 001 contra las instrucciones de infraestructura de Alex.                                     | No están disponibles las fuentes oficiales S1/S2/S3 ni interfaces.pdf; no se certifica su revisión. Su contraste corresponde al trabajo posterior de producto. |
| 001-C01 | Usar node:test y HTTP real para las pruebas mínimas.                                                 | Sin nuevas dependencias; Vitest/Supertest no son necesarios para esta base.                                                                                    |
| 001-C02 | No instalar ni probar drivers SQLite en 001.                                                         | Base de datos excluida por el alcance inicial.                                                                                                                 |
| 001-C03 | No crear scripts vacíos test:unit/test:e2e.                                                          | Se añadirán con casos reales cuando exista dominio o flujos de navegador.                                                                                      |

Registro canónico: [decisiones](../../docs/decisions.md). No se resuelven aquí países, tasas, planes ni políticas fiscales.
