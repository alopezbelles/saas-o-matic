# 003 — Iteración de implementación

Registro iniciado el 14 de noviembre de 2026 durante el trabajo, no retrospectiva.
Estado: completado técnicamente. 32 pruebas pasan, sin aceptación humana de la entrega. [Instrucción previa](../prompts/003-customers-api.md).

## Decisiones antes de código

- Cinco campos HTTP del enunciado; contact_name opcional en almacenamiento mediante nueva migración que conserva datos.
- D03: tipos de control y K/L/M según nota AEAT DIT 2008 (CAIB); discrepancia de K/L/M con Eustat identificada. Se prioriza la autoridad emisora.
- Entidades nacionales ABCDEFGHJUV usan dígito; NPQRSW usan letra. No aceptar ambos indistintamente.
- Sin dependencias nuevas ni endpoints de simulación.

[Tabla y fuentes](../../specs/003-customers-api/clarifications.md).

## Iteración de pruebas y correcciones

Las primeras pruebas HTTP pasaron. IT-MIG-003 detectó FOREIGN KEY constraint failed al reconstruir customers con simulaciones existentes.
Causa comprobada: persistencia de contadores diferidos de DROP del padre incluso tras restituir sus IDs. Solución: verificar foreign_key_check e integrity_check dentro de la transacción antes de liberar contadores con defer_foreign_keys=OFF; foreign_keys sigue ON.
El caso se amplió para comprobar que un grafo final inválido revierte el lote; no se omitió integridad para hacer pasar la migración.
También se añadieron rechazo de longitud fiscal normalizada excesiva y dominio IP, y comprobación de esquema actualizado en apertura lazy.
Un fallo transitorio del lanzador Windows impidió crear un archivo de tests; se comprobó su ausencia y se continuó mediante la herramienta de edición, sin cambios fuera del proyecto.
