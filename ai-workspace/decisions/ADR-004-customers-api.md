# ADR-004 — Contrato de clientes y compatibilidad con 002

14 de noviembre de 2026. Decisión aplicada durante 003; no aceptación humana de entrega.
La autorización de implementación sigue a la corrección del requisito extra de nombre de contacto.

## Decisión y razón

El alta HTTP exige únicamente los cinco campos del enunciado. No rellenar contact_name con el nombre de empresa ni una cadena ficticia para satisfacer una restricción antigua.
Conservar la columna interna como nullable mantiene datos previos y permite reutilizar la persistencia de 002.
Se añade migración, no se edita SQL aplicado. Reconstrucción transaccional con FK activa, validación de grafo e histórico conservado.

## Alternativas descartadas

Exigir el sexto campo incumpliría el contrato aportado. Inventar un contacto ocultaría la discrepancia.
Eliminar la columna perdería información previa; mantener nullable es la modificación mínima compatible.

## Arquitectura

DTO y parsing en shared sin ORM; dominio fiscal puro; servicio y repositorio; HTTP solo parsea/mapea.
Conexión lazy con schema actualizado: health no depende de DB ni ejecuta migraciones.
[Fuentes fiscales](../../specs/003-customers-api/fiscal-rules.md), [spec](../../specs/003-customers-api/spec.md), [validación](../../specs/003-customers-api/validation.md).
