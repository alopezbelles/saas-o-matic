# Aclaraciones 004

Decisiones funcionales acordadas durante la preparación. No equivalen a implementación ni aceptación de una entrega.

| ID      | Decisión                                                                                                                                                       | Estado              |
| ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------- |
| 004-C01 | Motor puro en packages/shared/src/billing/, exportado desde shared. Sin paquetes billing/contracts ni dependencias nuevas.                                     | Aceptada por Alex   |
| 004-C02 | ES, FR, DE y GB; configuración única y motor común, sin módulos por país.                                                                                      | Aceptada por Alex   |
| D01     | Política simplificada demo-standard-v1: ES 2100, FR 2000, DE 1900, GB 2000 bps. Sin exenciones, inversión del sujeto pasivo ni particularidades territoriales. | Aceptada por Alex   |
| D10     | Céntimos enteros, intermediarios BigInt, impuesto sobre base completa redondeado una vez half-up; total como suma. Rechazar inválidos/overflow.                | Aceptada por Alex   |
| 004-C03 | 004 entrega motor, contratos, configuración y tests; 005 integra API/guardado y 006 conversión de visualización. Sin integración HTTP, DB, UI ni FX aquí.      | Aceptada por Alex   |
| D04     | Reutilizar límites de 002: users 1000, storageGb 10000, apiCalls 10000000, enteros desde cero. Solo users genera coste; planes sin multiplicadores.            | Confirmada por Alex |
| 004-C04 | Entrada completa: tres consumos, countryCode y política explícita; validar todos. Helper de tramos recibe solo users.                                          | Aceptada por Alex   |
| 004-C05 | Salida: base, impuesto, total, EUR, tasa, desglose compatible con 002 y versiones de precios/política fiscal.                                                  | Aceptada por Alex   |

## Precisiones técnicas de consolidación

Redactadas en la revisión documental autorizada, sin atribuirlas a respuestas individuales de Alex:

- users-tiered-v1 identifica los tramos ya exigidos; demo-standard-v1 identifica la política fiscal acordada.
- Contrato, firmas, nombres de campos, errores estables y validación detallada están en [spec](spec.md) y [plan](plan.md).
- Política con version y ratesByCountry; no aceptar versiones arbitrarias para las tarifas ni depender de entorno en el motor.
- T01 conecta runner y fixtures; T02–T04 añaden pruebas productivas progresivamente. Ningún PASS de fixtures acredita cálculo real.
- Cada tarea se ejecutará por indicación posterior. No hay autorización de commits, nuevas dependencias ni modificación de datos.

## Alcance fiscal y fuentes

Tasas de referencia contrastadas durante la preparación: [Your Europe](https://europa.eu/youreurope/business/finance-and-tax/vat/vat-rules-rates/indexamp_en.htm) y [GOV.UK](https://www.gov.uk/vat-rates).
Su aplicación es una política demo acordada, no una determinación tributaria completa por operación. No se han revalidado en esta consolidación.
GB no implica conversión a GBP; el catálogo de cálculo no restringe alta de clientes. País no configurado → error explícito; tasa cero solo si está presente.
Tests pueden usar tasas sintéticas identificadas; no son configuración de producto.
El motor no consulta tasas en red ni cambia reglas bajo una versión publicada.

## Procedencia

[Prompts técnicos reformulados](../../ai-workspace/prompts/004-billing.md), [iteración de preparación](../../ai-workspace/iterations/004-billing.md) y [decisión arquitectónica](../../ai-workspace/decisions/ADR-005-billing-engine.md).
El registro de preparación se redacta retrospectivamente por solicitud de Alex; no es transcripción literal ni evidencia de implementación.
