# SaaS-O-Matic — instrucciones para Codex

## Contexto

Leer [MEMORY.md](MEMORY.md), [constitución](docs/constitution.md), [decisiones](docs/decisions.md) y los documentos de la spec activa.
Alcance autorizado en [approvals](docs/approvals.md); reglas de producto en [business-rules](docs/business-rules.md).
La infraestructura existe. No asumir que las features descritas en docs están implementadas.

## Trabajo

- Ejecutar únicamente la tarea autorizada; las instrucciones de Alex prevalecen sobre plantillas locales.
- Código y nombres en inglés; interfaz y documentación en español. TypeScript strict.
- Monorepo pnpm: apps/web, apps/api y packages/shared; no migrar stack por una propuesta antigua.
- Separar transporte, validación, servicios, dominio y persistencia cuando existan responsabilidades reales.
- Dominio puro sin HTTP/SQL/React; SQL solo en repositorios. Contratos sin tablas ORM.
- Backend autoritativo; no inventar planes, precios, países ni impuestos.
- Enteros para dinero, redondeo explícito y fixtures deterministas.
- Revisar cohesión a partir de 300 líneas; no fragmentar solo por una cifra.
- No duplicar lógica ni añadir dependencias sin autorización.

## Verificación

Comandos actuales: pnpm lint, pnpm typecheck, pnpm format:check, pnpm build y pnpm test.
Suites: test:integration, test:web, test:gates, test:docs. Ver [testing](docs/testing.md).
No existen test:unit ni test:e2e: añadirlos solo con casos reales.
No ejecutar test:gates en paralelo con otros controles de código.
Informar controles no ejecutados; no afirmar que pasaron por inspección.

## Límites

- No implementar negocio ni instalar SQLite/ORM bajo el alcance 001.
- Nuevas decisiones de arquitectura, reglas abiertas, dependencias, servicios, producción y despliegues requieren autorización.
- No commits/pushes, cambios de remotos, reset/clean, secretos ni evidencias inventadas.
- No tocar .git, .env real, datos existentes ni configuración personal de Codex sin autorización específica.
- Detener trabajo dependiente de un bloqueo y continuar solo trabajo independiente autorizado.

## Cierre

Actualizar memoria y validación con resultados reales; marcar tareas solo con evidencia.
La conformidad técnica no equivale a aceptación humana.

## Registro del desarrollo asistido por IA

- Durante cada spec, mantener `ai-workspace` actualizado con las iteraciones relevantes, decisiones y verificaciones reales; no dejar todo el registro para el cierre. Seguir el procedimiento de [sdd-harness](docs/sdd-harness.md).
- Escribir registros técnicos concretos: requisito/tarea, contexto, objetivo, restricciones, alternativas relevantes, decisión y justificación, cambios, validación y límites. Priorizar claridad y evidencia sobre formalismo o lenguaje complejo.
- Preparar instrucciones técnicas estructuradas antes de implementar cada bloque significativo; no considerar un prompt vago como especificación suficiente ni convertir su síntesis posterior en un prompt original.
- En `ai-workspace/prompts`, priorizar instrucciones elaboradas con contexto, objetivo, alcance, restricciones y criterios de verificación. Se permite reformular solicitudes informales, manteniendo intención y límites y etiquetándolas como reformulaciones técnicas; indicar si se redactaron antes o después de la ejecución. No es obligatorio incluir el mensaje literal.
- Conservar fielmente los prompts y extractos de conversación que se presenten como originales. Identificar por separado contexto técnico, síntesis y retrospectivas; no inventar ni retocar interacciones para aparentar un proceso distinto.
- Enlazar documentación canónica y evidencias sin duplicarlas. Actualizar solo las carpetas pertinentes; no generar ADR, capturas ni registros vacíos por obligación.
- Distinguir decisión acordada, implementación, validación técnica y aceptación humana. Registrar revisiones personales de Alex únicamente cuando él las confirme; omitir secretos y datos sensibles de las evidencias.
