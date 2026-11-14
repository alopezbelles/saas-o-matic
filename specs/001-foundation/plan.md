# Plan 001 — Base del proyecto y controles

## Estrategia

Conservar el monorepo pnpm existente y su lockfile. Node 22, TypeScript estricto y ESM.
Separar `createApp` de `listen` para probar Express en un puerto efímero.
Usar el ejecutor de pruebas de Node; no añadir dependencias.

## Archivos y responsabilidades

- Raíz: scripts de calidad y tests, lockfile, configuración y README.
- apps/api/src/app.ts: factoría Express y health.
- apps/api/src/index.ts: configuración de puerto y arranque.
- apps/api/test: integración HTTP real.
- apps/web/test: smoke HTTP del build con Vite preview; no afirma renderizado en navegador.
- test: controles negativos y enlaces/contexto documental.
- docs, MEMORY.md, AGENTS.md y ai-workspace: instrucciones, trazabilidad y evidencia.

## Secuencia

1. Conciliar stack y autorización con lo ya solicitado.
2. Reutilizar workspaces y arranque; separar aplicación y servidor.
3. Añadir integración, smoke web y controles negativos.
4. Documentar contratos, comandos y contexto; verificar enlaces.
5. Ejecutar instalación congelada, gates y arranque conjunto; registrar salidas reales.

## Validaciones

- ENV-01: instalación con lockfile congelado, build, arranque conjunto y health.
- API-01: health JSON 200; ruta desconocida y POST health 404.
- WEB-01: HTML compilado y bundle JavaScript disponibles por HTTP.
- GATE-01: errores deliberados de tipos, lint y test devuelven no cero; fixtures temporales se retiran en finally.
- DOC-01: enlaces locales válidos, contexto activo y comandos existentes.

## Riesgos y límites

No probar SQLite ni crear capas de negocio anticipadas. Los tests no usan datos persistentes.
El smoke web no es un E2E de navegador. Las pruebas de rutas con espacios y entorno totalmente limpio se reportan aparte si no se ejecutan.
Contrato mínimo en [API](../../docs/api-contracts.md); comandos en [testing](../../docs/testing.md).
