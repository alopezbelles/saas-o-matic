# Arquitectura

## Base implementada — spec 001

Monorepo pnpm workspaces, monolito modular con dos aplicaciones y un paquete compartido.

| Área          | Configuración                                                       |
| ------------- | ------------------------------------------------------------------- |
| Runtime       | Node 22.13+ dentro de la rama 22; validado inicialmente con 22.19.0 |
| Gestor        | pnpm 10.33.4; pnpm-lock.yaml; engine-strict                         |
| Web           | React + TypeScript + Vite, ESM                                      |
| API           | Express 5 + TypeScript; tsx en desarrollo                           |
| Compartido    | packages/shared, sin contratos de negocio todavía                   |
| Calidad       | TypeScript estricto, ESLint, Prettier                               |
| Tests de base | node:test, fetch y puertos efímeros; Vite preview para smoke web    |

`apps/api/src/app.ts` exporta createApp sin abrir puertos; index.ts valida PORT y ejecuta listen.
Web usa 127.0.0.1:5173 y API 127.0.0.1:3000. El script raíz dev ejecuta ambas.
PORT es opcional y se lee del entorno; los archivos .env no se cargan automáticamente.
[.env.example](../.env.example) documenta su uso sin secretos.

## Evolución del producto

La separación futura será transporte, validación, servicios, dominio puro y repositorios.
El backend recalculará importes y no confiará en totales del navegador.
Los contratos compartidos no expondrán tipos de persistencia.

React Router, Zod, CSS Modules, un paquete monetario, Drizzle/better-sqlite3 y herramientas de tests de producto son opciones para fases posteriores. No están instalados ni se requieren en 001.
No crear packages/contracts o packages/billing sin una necesidad concreta; actualmente existe packages/shared.

## Datos y despliegue

No hay SQLite, migraciones ni servicios externos configurados.
Una futura base no debe estar en web root ni en disco efímero sin persistencia.
No se ha seleccionado proveedor ni se ha autorizado despliegue.

## Referencias

[Decisiones](decisions.md), [contrato actual](api-contracts.md), [testing](testing.md),
[reglas de producto](business-rules.md) y [plan 001](../specs/001-foundation/plan.md).
Las reglas de negocio no implican que las funcionalidades estén implementadas.
