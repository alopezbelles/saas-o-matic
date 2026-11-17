# 001 — Base del proyecto y controles

## Contexto y objetivo

Completar y verificar la infraestructura ya creada para disponer de una base Full-Stack instalable, ejecutable y comprobable. El alcance procede de las instrucciones iniciales de infraestructura recogidas en [requisitos](../../docs/requirements.md); la autorización se conserva en [su registro](../../docs/approvals.md).

La inicialización técnica precedió a la spec formal. Esta especificación concilia el estado existente y define su cierre, no acredita que toda la implementación se planificara previamente mediante SDD. La [retrospectiva](../../ai-workspace/iterations/001-foundation-retrospective.md) explica la secuencia.

## Necesidades y decisiones de alcance

| Necesidad                                                 | Respuesta prevista                                            | Requisito |
| --------------------------------------------------------- | ------------------------------------------------------------- | --------- |
| Instalar y arrancar frontend/API coordinadamente          | pnpm workspaces, lockfile y scripts desde raíz                | RF1       |
| Detectar problemas antes de continuar con negocio         | Tipos, lint, build, HTTP y controles negativos                | RF2       |
| Dirigir la implementación asistida sin ampliar el encargo | Spec/contexto activo, restricciones y autorización explícitas | RF3       |
| Permitir comprobar el trabajo realizado                   | Índice, casos y resultados reales con límites identificados   | RF4       |

Stack fijado: React/TypeScript/Vite, Node/TypeScript/Express, tsx, ESLint/Prettier y packages/shared. Se conserva pnpm y la infraestructura Node 22 existente; no se migra por discrepancias de una plantilla. El modelo de datos, reglas de negocio y contratos compartidos de producto pertenecen a entregas posteriores.

## Requisitos y aceptación

- **001-RF1:** Al preparar un entorno con Node compatible, el repositorio permite instalar mediante pnpm y lockfile congelado, arrancar web y API desde la raíz y consultar GET /health.
- **001-RF2:** Al ejecutar los controles, lint, tipos, tests y build tienen comandos diferenciados; los fallos producen código no cero. Hay pruebas automatizadas de health, web compilada y fallos deliberados de los controles.
- **001-RF3:** Al continuar el trabajo, Codex encuentra la spec activa y los límites autorizados; una autorización de infraestructura no habilita features posteriores.
- **001-RF4:** Al revisar el trabajo, existe un índice con enlaces locales válidos a documentos canónicos y evidencia real, diferenciada de verificaciones no ejecutadas.

## Contrato mínimo y casos límite

GET /health devuelve HTTP 200 y JSON status ok. Ruta inexistente y POST /health devuelven 404; no se añade negocio mediante este contrato. La API puede comprobarse en desarrollo y compilada, sin archivo .env obligatorio.

Node incompatible se rechaza mediante engine-strict. PORT inválido o ocupado debe producir error. Los tests HTTP usan puertos efímeros y cierran sus servidores. No utilizar passWithNoTests o scripts vacíos para representar cobertura. El [plan](plan.md) relaciona cada riesgo con una comprobación.

## Fuera de alcance

Clientes, simulaciones, facturación, impuestos, SQLite/ORM, dependencias globales, publicación y CI remoto. No se exigen pruebas unitarias de dominio o E2E de navegador cuando esos flujos no existen; un smoke HTTP tampoco se presenta como inspección visual.

## Definición de completado

Los cuatro RF deben estar relacionados con tareas, casos y evidencia. Los controles pertinentes deben pasar y los no ejecutados o limitados deben quedar identificados. El [resultado histórico](validation.md) conserva comandos/entorno; la revisión editorial posterior mejora su lectura sin volver a ejecutar ni modificar esos resultados. La conformidad técnica y la aceptación humana se registran por separado.
