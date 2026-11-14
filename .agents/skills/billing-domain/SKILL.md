---
name: billing-domain
description: Implementar o revisar tramos, impuestos, dinero, conversiones o snapshots monetarios de SaaS-O-Matic; activar ante cualquier cambio que afecte importes.
---
# Dominio monetario
Leer docs/business-rules.md, data-model.md y decisiones D01/D04/D05/D10. No reescribir las tarifas en esta skill.
1. Localizar la función pura compartida antes de crear lógica.
2. Comprobar que solo usuarios contribuye a base; plan/storage/API no añaden cargos.
3. Definir oráculos independientes para fronteras 0,10,11,15,50,51 y casos negativos.
4. Usar céntimos enteros e intermediarios seguros; impuesto una vez, conversión decimal desde EUR con exponente explícito.
5. Verificar subtotal+impuesto=total, desglose coherente y conservación histórica.
6. Exigir recálculo backend; no confiar en importes enviados por UI.
7. Ejecutar unit y tests de consumidores afectados; registrar resultados.
## Restricciones
No inventar impuestos, precios o diferencias de plan. No mutar histórico al cambiar divisa/configuración. No red ni SQLite dentro del motor puro.
## Checklist
- [ ] Fronteras y marginales correctos.
- [ ] Redondeos y overflow cubiertos.
- [ ] País sin política falla explícitamente.
- [ ] FX no altera base histórica.
- [ ] Fixtures no son políticas aprobadas.

