# 007 — Instrucciones técnicas

Registro iniciado el 16 de noviembre de 2026 al autorizar Alex T01 y el registro de progreso en ai-workspace. La preparación anterior quedó excluida de registro. Su resumen siguiente es retrospectivo, basado en conversación y [aclaraciones](../../specs/007-customers-ui/clarifications.md).

## Preparación — síntesis retrospectiva

Alex confirmó navegación superior y PDF como referencia, CSS Modules/tokens/global, fuente del sistema, historial EUR, omisión de última simulación/acciones futuras, países de configuración y planes demo existentes. Autorizó React Router y herramientas de pruebas, proxy /api, páginas de 20, debounce 250 ms y recuperación del alta. Los cinco documentos de 007 se consolidaron antes de implementar. Esta síntesis no es una conversación literal ni instrucción previamente enviada con esta redacción.

## T01 — Instrucción previa de implementación

Redactada antes de instalar dependencias o cambiar código productivo.

**Contexto:** web React/Vite/TypeScript con pantalla inicial, módulos FX y 22 pruebas node:test. La API y shared ya existen. [Plan canónico](../../specs/007-customers-ui/plan.md).

**Objetivo:** crear base visual y navegación comprobables para listado, alta, ficha y 404, con herramientas de componentes compatibles.

**Acciones:** comprobar engines/peerDependencies frente a Node 22.19, React 19 y Vite 8; instalar dependencias autorizadas; enlazar shared por workspace; tokens semánticos y CSS Modules; BrowserRouter/rutas, cabecera/breadcrumbs, contenido responsive y foco de navegación; tests Vitest/RTL con limpieza y selección independiente de node:test. Actualizar contexto/aprobaciones/registro durante el trabajo.

**Alcance:** T01 y WEB-SHELL-01. Los destinos futuros mostrarán estado de desarrollo explícito mientras no existan las siguientes tareas. No simular clientes o formularios funcionales.

**Restricciones:** respetar contratos/backend/DB y permisos; sin nuevas dependencias ajenas a decisiones, sin commits/pushes ni aceptación humana anticipada.

**Verificación:** instalación reproducible, lint/typecheck/build/formato, pruebas shell y suite web anterior, enlaces documentales; comprobar rutas directas y navegación/foco. Verificar el aspecto en navegador si el entorno permite y documentar cualquier límite real.

**Cierre:** evidencia real, estado de tareas y nombre de commit sugerido. Implementar T02 solo por indicación posterior.
