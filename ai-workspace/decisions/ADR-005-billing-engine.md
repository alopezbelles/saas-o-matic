# ADR-005 — Motor monetario puro en shared

## Estado y procedencia

Decisión de ubicación y alcance aceptada por Alex durante preparación de 004. Documento redactado retrospectivamente el 15 de noviembre de 2026, antes de implementación.
No implica aceptación de código ni autorización de commits. [Aclaraciones](../../specs/004-billing/clarifications.md).

## Contexto

El monorepo ya tiene shared y persistencia con límites e histórico EUR. Se necesita lógica única, exacta y explicable, reutilizable por backend y futuro simulador, sin mezclar responsabilidades.

## Alternativas relevantes

- Crear paquetes billing/contracts: propuesta de plantilla descartada por complejidad innecesaria.
- Situar todo en API: impediría compartir directamente el dominio puro con web.
- Mantener dominio en shared y política fiscal como configuración explícita del servidor: opción adoptada.

Las alternativas se describen por sus consecuencias técnicas; no se atribuyen evaluaciones o experimentos no realizados.

## Decisión

Motor en shared/src/billing, sin HTTP, SQLite, React, red, reloj ni entorno. Configuración demo-standard-v1 en API, recibida como dato.
Céntimos y BigInt intermedio; resultados seguros serializables. Límites existentes y versiones vinculadas a reglas.
004 prepara cálculo/contratos/configuración/tests; 005 orquestación y guardado; 006 FX de visualización.

## Consecuencias y límites

Una sola implementación y tests de dominio sin DB. La política simplificada no representa fiscalidad B2B completa.
El backend futuro recalculará importes; una preview no será fuente autoritativa. Esta integración no existe aún.
El formato de desglose encaja con 002, sin mover validadores SQL ni refactorizar persistencia ahora.
No añadir servicios, dependencias ni paquetes nuevos. [Plan](../../specs/004-billing/plan.md) y [tareas](../../specs/004-billing/tasks.md).
