# 001 — Base del proyecto y controles

## Contexto y objetivo

Completar y verificar la infraestructura ya creada, sin implementar negocio ni base de datos.
Fuente de alcance: instrucciones de Alex en esta conversación, recogidas en [requisitos](../../docs/requirements.md).
Autorización: [registro](../../docs/approvals.md). Implementación y revisión se registran por separado.

## Historia

Como desarrollador y evaluador quiero instalar, ejecutar y verificar ambas aplicaciones desde un repositorio.

## Requisitos y aceptación

- **001-RF1**: Al preparar un entorno con Node compatible, el repositorio permite instalar mediante pnpm y lockfile congelado, arrancar web y API desde la raíz y consultar `GET /health`.
- **001-RF2**: Al ejecutar los controles, lint, tipos, tests y build tienen comandos diferenciados; los fallos producen código no cero. Hay pruebas automatizadas de health, web compilada y fallos deliberados de los controles.
- **001-RF3**: Al continuar el trabajo, Codex encuentra la spec activa y los límites autorizados; una autorización de infraestructura no habilita features posteriores.
- **001-RF4**: Al revisar el trabajo, existe un índice con enlaces locales válidos a documentos canónicos y evidencia real, diferenciada de verificaciones no ejecutadas.

## Casos límite

Node incompatible se rechaza por `engine-strict`; PORT inválido o ocupado debe producir error.
El arranque por defecto no requiere .env. Los tests HTTP usan puertos efímeros y cierran sus servidores.
No usar `passWithNoTests` ni comandos vacíos para representar cobertura.

## Fuera de alcance

Clientes, simulaciones, facturación, impuestos, SQLite/ORM, dependencias globales, publicación y CI remoto.
No se exigen tests unitarios de dominio ni E2E de navegador cuando ese dominio y esos flujos no existen.

## Definición de completado

RF trazados a pruebas y evidencia; controles pertinentes pasan; instrucciones y contexto coherentes.
La conformidad técnica no sustituye la aceptación humana. Resultado en [validación](validation.md).
