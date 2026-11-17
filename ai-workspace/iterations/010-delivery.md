# 010 — Iteraciones de entrega

## T01 — Retrospectiva posterior

Registro creado el 17 de noviembre de 2026 en T02, después de T01. Fuente: [validación T01](../../specs/010-delivery/validation.md#t01--readme-técnico-y-demo-reproducible). El README se reorganizó con arquitectura/decisiones, necesidades, SDD/IA e inicio rápido. Se implementó demo:setup con destino nuevo explícito y servicios existentes, conservando el seed histórico. Se generaron cuatro capturas reales con API/SQLite temporal.

Incidencias conservadas: la primera prueba de helper rechazó una resolución de ruta sin contexto de test; se corrigió la comparación con la ruta absoluta predeterminada. El primer formateo incluyó .env.example, sin parser Prettier; se retiró de esa invocación y se normalizó LF. Tres pruebas nuevas y 276 globales pasaron; los importes esperados fueron independientes del motor. T01 no fue un ensayo de instalación limpia.

## T02 — Registro durante ejecución

Alex solicita ejecutar la tarea cuyo alcance es actualizar ai-workspace; se autoriza dicho registro sin reescribir el alcance histórico. [Autorización](../../docs/approvals.md) e [instrucción previa](../../specs/010-delivery/plan.md#t02--auditoría-enlazada-y-procedencia).

Objetivo: recorrido actual comprensible y trazable. Se añaden índices de instrucciones, síntesis de iteración 008/009/010, inventario de evidencias y revisión documental; se enlazan capturas ya conservadas. Las decisiones permanecen en aclaraciones/docs canónicos; no se crea un ADR sin decisión nueva. No se copian mensajes de análisis/adaptación excluidos ni se inventan sesiones de Product.

Verificación propia de T02: enlaces y formato documental, sin repetir suites de producto o consulta FX. Resultados actuales en [validación T02](../../specs/010-delivery/validation.md#t02--índice-y-evidencia-del-desarrollo-asistido). T03–T05 y aceptación humana pendientes; sin instalación limpia, publicación o modificación de datos.

## T03 — Ensayo durante ejecución

17 de noviembre de 2026, fuente 33774eb inicialmente limpia. Exportación git archive bajo .cache, sin .git, dependencias, cachés o DB heredadas; dotfiles/lockfile/imágenes conservados. Node/npm del equipo, pnpm 10.33.4 instalado en .tools de la copia. Se descargan 373 paquetes, cero reutilizados según pnpm, y Chromium en caché propia. El snapshot no contiene los cambios documentales de este registro.

Incidencias: una primera invocación de bootstrap salió desde la raíz y se canceló, sin usarla como evidencia de instalación limpia. El bootstrap de la copia recibió EACCES al acceder a npm en sandbox. La revisión automática de acceso de red falló por cuota antes de ejecutar; tras la reanudación solicitada por Alex, el acceso aprobado permitió bootstrap, dependencias y navegador. No se alteraron remotos ni configuración personal para resolverlo.

La demo nueva y pnpm dev funcionaron; navegador comprobó tres clientes iniciales, alta de otro, preview de 169,40 EUR, guardado e historial persistente tras recarga, sin pageerror. La automatización de taskkill no pudo cerrar el árbol desde sandbox; se detuvo la sesión propia y un bind independiente confirmó puertos 3000/5173 libres. El reporte inicial conserva ese fallo de cleanup, separado del recorrido funcional correcto. Los controles globales se ejecutan secuencialmente sobre la copia.

[Evidencia y límites de T03](../testing/010-delivery-t03.md). No se presenta esta exportación como clon remoto, máquina limpia o validación de otro SO.

Cierre técnico T03: instalación y flujo comprobados; 276 pruebas generales y 36 E2E correctas sobre la copia. Base original sin diferencias por hash, fixtures temporales vacíos y puertos propios cerrados. Se conserva el primer fallo del harness y su recuperación verificable en el resumen de resultados. T04/T05 y aceptación humana final pendientes.
