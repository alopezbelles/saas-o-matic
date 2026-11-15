# 003 — Instrucción técnica previa de implementación

14 de noviembre de 2026. Preparada antes del código como instrucción de trabajo de Codex; no es transcripción de un mensaje del usuario.
Autorización actual: implementar spec 003 y sus tareas. No registrar las solicitudes previas de análisis/adaptación, conforme a la indicación de Alex.

## Contexto y alcance

001 aporta Express y calidad; 002 aporta SQLite y persistencia. El enunciado aportado exige cinco campos de alta, sin nombre de contacto.
Implementar POST /customers, lista/búsqueda paginada y detalle. Validación de DNI/NIE/NIF entidades y K/L/M; sin censo ni motor monetario.

## Plan técnico

Corregir contrato de cinco campos; migrar contact_name a opcional preservando filas existentes y snapshots.
Resolver D03 con Interior, nota técnica AEAT alojada por CAIB y documentación de entidades. Mantener clasificación pura.
Reutilizar insertCustomer/getCustomer y shared. Queries parametrizadas, errores sanitizados, proveedor lazy y lifecycle explícito.
Validar con node:test, HTTP y DB temporales. No escribir bases del usuario ni modificar migraciones aplicadas.

## Criterios de verificación

Algoritmos con fixtures independientes, alta de cinco campos, normalización, duplicados concurrentes, búsqueda literal y paginación.
No DB por health, reintento tras apertura fallida, 503/500 sanitizados y cierre de recursos.
Regresiones de 001/002, migración con cliente referenciado por simulación y conservación de datos.
Resultados se registrarán después de ejecutar; no hay aceptación humana de entrega anticipada.

[Spec](../../specs/003-customers-api/spec.md), [iteración](../iterations/003-customers-api.md).
