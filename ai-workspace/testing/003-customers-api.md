# Pruebas 003

Registro de ejecución durante el desarrollo, 14 de noviembre de 2026.
Suite ejecutada: 32 pruebas, cero fallos; [salida conservada](003-tests.txt).
Resultados y límites canónicos en [validación](../../specs/003-customers-api/validation.md).
La suite incluye regresiones de 001/002, no solo funcionalidades nuevas.

- Unitarias: contratos HTTP y familias fiscales con oráculos fijos.
- Integración: cinco campos, DTO y Location, normalización, duplicados, queries/paginación, protocolo y privacidad.
- Migración: contacto previo y snapshots conservados, FK activa y rechazo de grafo inválido.
- Lifecycle: proveedor sin DB, apertura/reintento y cierre del driver en proceso hijo.
- El caso SIGTERM emite el evento dentro del proceso hijo; no acredita entrega de una señal OS real en Windows.

No se registran los prompts excluidos por Alex ni se escriben datos del usuario.
