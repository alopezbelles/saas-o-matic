# Verificación

Ejecutar desde la raíz con Node compatible y pnpm 10.33.4.
En PowerShell usar pnpm.cmd y el PATH local explicado en el README si no hay pnpm global.

| Comando               | Verificación                                                            |
| --------------------- | ----------------------------------------------------------------------- |
| pnpm lint             | ESLint sin warnings                                                     |
| pnpm typecheck        | Tipos de web, API y shared                                              |
| pnpm format:check     | Formato de archivos versionables                                        |
| pnpm build            | Compilación de los tres paquetes                                        |
| pnpm test:integration | Compila API y prueba health, JSON y rutas negativas por HTTP            |
| pnpm test:web         | Compila web y prueba HTML/bundle mediante Vite preview                  |
| pnpm test:gates       | Introduce errores temporales de tipos/lint/test y exige salidas no cero |
| pnpm test:docs        | Comprueba enlaces locales y contexto de 001                             |
| pnpm test             | Ejecuta secuencialmente todas las suites anteriores                     |

No ejecutar test:gates a la vez que lint/typecheck/build: sus fixtures erróneos son deliberados.
Los fixtures se crean en un directorio único dentro de apps/api/src y se eliminan en finally.
Las suites HTTP usan puertos efímeros y cierran servidores; no abren ni escriben SQLite.
Los tests fallidos hacen fallar el comando: no se usa passWithNoTests.

## Comprobaciones de entorno

Instalar con pnpm install --frozen-lockfile. Arrancar pnpm dev y verificar web y /health.
Comprobar también start:api después de build, PORT inválido y puerto ocupado.
La ausencia de .env es válida para los valores por defecto; no hay carga automática de .env.
engine-strict rechaza Node fuera del rango de engines.

## Límites

No existen tests unitarios de dominio ni E2E de navegador: no hay dominio implementado ni flujos de negocio.
El smoke HTTP de web no afirma accesibilidad, renderizado ni interacción en navegador.
Una reinstalación con caché no demuestra instalación en otro equipo o entorno totalmente limpio.
Registrar ejecuciones reales y límites en [validación](../specs/001-foundation/validation.md).
