# Reglas de negocio

Solo BR01 y los datos exigidos proceden directamente de S1; las políticas complementarias se relacionan con las decisiones indicadas.

## BR01 — tramos oficiales

n entero no negativo. Céntimos:
a=min(n,10); b=min(max(n-10,0),40); c=max(n-50,0).
base=a*1000+b*800+c*500.
No aplicar el precio del último tramo a todos los usuarios.

| n   | Base EUR | Céntimos |
| --- | -------- | -------- |
| 0   | 0,00     | 0        |
| 10  | 100,00   | 10000    |
| 11  | 108,00   | 10800    |
| 15  | 140,00   | 14000    |
| 50  | 420,00   | 42000    |
| 51  | 425,00   | 42500    |

## BR02 — consumo y plan

Guardar usuarios, storageGb y apiCalls. Almacenamiento/API no tienen precio definido: son metadatos, no cero tarifado por un plan inventado. Plan identifica selección comercial sin alterar base. D02/D04 definidos para persistencia en spec 002: DEMO_BASIC/DEMO_PRO; users 0..1000, storageGb 0..10000 y apiCalls 0..10000000, enteros sin cargos adicionales. No convertir “0 usuarios” en “mínimo 1”.

## BR03 — impuesto

Aplicar después de base, antes de FX. Configuración versionada por país soportado; tasa en puntos básicos (2100 = 21%). Para 004 se acordó demo-standard-v1: ES 2100, FR 2000, DE 1900 y GB 2000 bps. Política de simulación simplificada, sin exenciones, inversión del sujeto pasivo ni particularidades territoriales; no fiscalidad completa de operaciones reales. Configuración aún no implementada. [Decisiones 004](../specs/004-billing/clarifications.md).
taxCents=roundHalfUp(baseCents*rateBps/10000); total=base+tax.
Usar intermediarios BigInt para evitar overflow; serializar importes como enteros JSON dentro de Number.MAX_SAFE_INTEGER. Valores no negativos: half-up = (numerador + divisor/2) div divisor cuando divisor par.
País sin política: error TAX_COUNTRY_UNSUPPORTED, no 0% por defecto. No confundir país con jurisdicción completa real. D01/D10 acordados para 004; motor todavía pendiente.

## BR04 — identificadores fiscales

La especificación ejecutable de control para clientes está en [003 fiscal-rules](../specs/003-customers-api/fiscal-rules.md). Se prioriza nota AEAT para K/L/M y tipos de control. La descripción inicial siguiente es contexto histórico y no prevalece sobre esa tabla contrastada.

Normalizar trim y mayúsculas; preservar ceros iniciales. Propuesta rechazar separadores internos, no eliminar caracteres arbitrariamente. País ISO alpha-2 normalizado antes de seleccionar algoritmo.

- DNI: ocho dígitos y letra según resto 23 de TRWAGMYFPDXBNJZSQVHLCKE.
- NIE X/Y/Z: sustituir prefijo por 0/1/2 y aplicar mismo control. Su inclusión se propone por alcance NIF; D03.
- Entidades (“CIF” coloquial): prefijo legal + siete dígitos + control. Sumar posiciones pares de los siete dígitos; duplicar impares y sumar cifras; d=(10-(suma mod 10)) mod 10; letra de control JABCDEFGHI[d].
- Tipo de control por prefijo: propuesta números A/B/E/H, letras P/Q/S, otros admitidos según clasificación verificada. **La tabla completa de entidades, incluidos N/R/W, debe contrastarse con especificación oficial antes de implementar su validación; no aceptar ambos por defecto sin comprobarla.**
- K/L/M son NIF especiales de persona física, no CIF. Diseñar rama separada; ampliar fixtures y fuente de control antes de cerrar D03. No excluirlos silenciosamente.
- No españoles: presencia y límites, sin algoritmo español ni promesa de validez fiscal internacional.

Checksum correcto no prueba existencia, titularidad ni alta censal. Texto UI: “Formato y carácter de control válidos”, no “empresa verificada”.
Fuente DNI/NIE: [Interior](https://www.interior.gob.es/opencms/ca/servicios-al-ciudadano/tramites-y-gestiones/dni/calculo-del-digito-de-control-del-nif-nie/).
Estructura NIF entidades: [BOE EHA/451/2008](https://www.boe.es/buscar/act.php?id=BOE-A-2008-3580). Esta norma fija estructura/prefijos, no se atribuye a ella una tabla completa de checksum no verificada.

## BR05 — monedas

Base e histórico EUR. Conversión de visualización usa tasa EUR→destino validada >0 y fecha del proveedor. No invertirla ni volver a convertir desde una moneda ya convertida.
Propuesta usar decimal.js en packages/billing para FX, con precisión configurada y ROUND_HALF_UP. Parsear tasa como decimal, redondear una vez a unidades menores de destino. EUR/USD/GBP usan 2 decimales; admitir otra moneda exige catálogo explícito de exponente, por ejemplo JPY=0, KWD=3. No asumir todas a 2.
Fuente JSON da números: convertir representación recibida a decimal sin realizar operaciones binarias intermedias.
Importe principal es conversión de total EUR; si se muestran líneas convertidas, ajustar/exponer diferencia de redondeo para que la suma visible sea coherente.
D05 establece no persistir FX: indicar “Conversión orientativa al tipo de [fecha]”. Tasa actual jamás modifica cents históricos.
[Proveedor](https://www.exchangerate-api.com/docs/free): endpoint abierto sin clave, actualización diaria, atribución obligatoria, límite de peticiones. “Tiempo real” en UI significa respuesta inmediata al consumo/divisa, no cotización bursátil en directo.

## BR06 — histórico

Backend obtiene país y plan del cliente; conserva snapshots y versiones, importes y desglose. GET devuelve lo guardado, no llama al motor con política actual. Simulaciones append-only; no API de editar/borrar. Fechas de creación UTC ISO-8601 (instantes, no fechas contables).
Un guardado fallido no aparece en historial. Un segundo guardado deliberado sí puede crear otra simulación. Doble clic bloqueado en UI; idempotencia de red avanzada fuera del MVP, riesgo documentado.
