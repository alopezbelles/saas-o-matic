# SaaS-O-Matic — instrucciones para Codex
Herramienta comercial de presupuestos SaaS: clientes, tramos, impuestos e histórico en SQLite.

## Contexto mínimo
- Leer MEMORY.md, docs/constitution.md y docs/decisions.md.
- Leer spec, clarifications, plan y tasks de la spec activa indicada en MEMORY.md.
- Reglas: docs/business-rules.md. Contratos: docs/api-contracts.md. Arquitectura: docs/architecture.md.
- Estado inicial: solo planificación. No hay autorización para implementar ni instalar.
- Aprobaciones explícitas: docs/approvals.md; un borrador nunca equivale a aprobado.

## Trabajo
- Ejecutar únicamente la tarea autorizada. Modificar sus archivos previstos, tests y documentación vinculada.
- Código y nombres en inglés; interfaz y documentación en español. TypeScript strict.
- Features con capas claras; dominio puro sin HTTP/SQL/React. SQL solo en repositorios.
- Contratos compartidos no importan tablas SQLite. El backend recalcula; no confía en importes enviados.
- No inventar precios de planes, almacenamiento, API calls ni impuestos.
- Usar enteros para dinero, redondeo explícito y fixtures deterministas.
- Revisar tamaño/cohesión a partir de 300 líneas; no fragmentar solo para cumplir una cifra.
- No duplicar lógica ni añadir dependencias sin autorización.

## Verificación
- Comandos previstos, disponibles tras 001: npm run lint; npm run typecheck; npm run test:unit; npm run test:integration; npm run test:web; npm run test:e2e; npm run build.
- Por tarea: controles afectados según docs/testing.md; por spec: gates completos pertinentes.
- Si falta un comando, informarlo: no afirmar que pasó. Nunca omitir tests para cerrar una tarea.

## Límites
- Pedir aprobación para arquitectura, reglas abiertas, specs/planes, dependencias, servicios, producción, datos existentes y despliegues.
- No commits/pushes, remotos, reset/clean, borrado de SQLite, secretos ni evidencias inventadas.
- No tocar .git, .env real, datos existentes ni configuración personal de Codex.
- .codex/config.toml local solo se modifica con autorización; no elevar permisos.
- Detener el trabajo dependiente de un bloqueo; avanzar solo en trabajo independiente autorizado.

## Cierre
Informar tarea/RF, archivos, comandos y resultados reales, riesgos y siguiente paso.
Actualizar MEMORY.md y evidencia real; marcar tarea solo con pruebas. Spec completa requiere revisión humana.

