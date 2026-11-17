# 010 Delivery — Colaboración con IA

## Objetivo y reparto del trabajo

Utilizar Codex para preparar una entrega comprensible y reproducible, explicando decisiones y uso de IA, comprobando el arranque desde una copia aislada y conservando evidencia revisable.

La dirección del proyecto pidió un README técnico con necesidades, arquitectura, proceso SDD y capturas. Declaró Codex como herramienta de ejecución y ChatGPT Work con Product para el diseño general. Confirmó demo local completa y entrega mediante instalación local/repositorio, dejando hosting opcional. Autorizó las tareas y el registro de ai-workspace; posteriormente eliminó la guía de entrega separada y estableció README y ai-workspace como recorrido del evaluador.

Se delegaron en Codex redacción, comando demo seguro, capturas reales, organización de evidencias, ensayo y revisión local de contenido. Las sesiones originales de Product no se inventaron a partir de esa declaración.

## Preparación y verificaciones

- El README reunió contexto, decisiones e instrucciones; la demo reutilizó servicios y cálculo existentes sobre un destino nuevo, sin alterar bases previas.
- El ensayo siguió esas instrucciones desde una exportación identificada, con dependencias y navegador propios, verificando arranque, flujo e historial persistido.
- La revisión externa inventarió contenido y exclusiones con un escaneo acotado; no publicó ni acreditó ausencia absoluta de secretos.
- El cierre enlazó resultados por versión y separó controles documentales de pruebas funcionales anteriores.

Las [instrucciones consolidadas](prompts.md) explican los objetivos delegados y las [iteraciones](iterations.md) conservan incidencias y recuperación.

## Estado y fuentes

La [validación](../../../specs/010-delivery/validation.md) registra preparación técnica completada. El [ensayo](../../testing/010-delivery-t03.md) pasó en el mismo Windows mediante exportación local, sin acreditar clon remoto, otra máquina o sistema operativo. La [revisión final](../../reviews/010-delivery-t05.md) mantiene pendientes aceptación humana, tratamiento de rutas locales históricas y revisión de historial/visibilidad antes de publicar. No hay despliegue acreditado.

Esta reorganización no repite instalaciones, pruebas o escaneos. Las referencias globales antiguas a documentos ausentes siguen siendo observaciones pendientes, no se consideran resueltas por los controles históricos.

- [README principal](../../../README.md), [spec](../../../specs/010-delivery/spec.md), [aclaraciones](../../../specs/010-delivery/clarifications.md), [plan](../../../specs/010-delivery/plan.md) y [tareas](../../../specs/010-delivery/tasks.md).
- [Preparación externa](../../testing/010-delivery-t04.md) e [índice de evidencias](../../testing/008-010-evidence-index.md).
