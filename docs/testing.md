# Verificación

Desde raíz con pnpm 10.33.4 y Node 22 compatible. En PowerShell usar pnpm.cmd si es necesario.

| Comando               | Control                                                                      |
| --------------------- | ---------------------------------------------------------------------------- |
| pnpm lint             | ESLint sin warnings                                                          |
| pnpm typecheck        | Compila shared y verifica tipos de todo el workspace y configuración Drizzle |
| pnpm format:check     | Prettier                                                                     |
| pnpm build            | Compila shared, API y web en orden workspace                                 |
| pnpm test:integration | Compila shared/API, prueba HTTP y SQLite real                                |
| pnpm test:web         | Compila web y prueba HTML/bundle HTTP                                        |
| pnpm test:gates       | Errores deliberados de tipos/lint/test devuelven no cero                     |
| pnpm test:docs        | Enlaces de ambas specs, contexto activo y scripts                            |
| pnpm test             | Todas las suites anteriores, secuencialmente                                 |

No ejecutar test:gates en paralelo con lint/typecheck/build. No se usa passWithNoTests.
La integración crea contextos únicos en .cache/002-tests, cierra conexiones y retira únicamente esos directorios.
Nunca abre datos reales de desarrollo/demo. Los casos demo se ejecutan dentro de la misma área temporal.
Prueba límites contra shared, SQL directo, concurrencia, snapshots, migración fallida, seed, guardas y backup.
El CLI se prueba también desde raíz con un destino con espacios.
Los fixtures monetarios son técnicos; no son políticas fiscales ni pruebas de un motor de cálculo.

No hay E2E de navegador ni unit tests del futuro dominio. El smoke HTTP web no acredita accesibilidad.
Instalación con caché no equivale a otra máquina limpia.
Evidencias: [001](../specs/001-foundation/validation.md), [002](../specs/002-persistence/validation.md).
