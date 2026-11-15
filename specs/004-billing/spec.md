# 004 — Motor acumulativo, impuestos y precisión

Estado: preparación documental consolidada; implementación no iniciada. Decisiones funcionales acordadas con Alex. Ejecutar cada tarea cuando se indique; sin commits automáticos.

## Contexto y fuentes

001 aporta monorepo y controles; 002 aporta límites, persistencia e histórico EUR; 003 aporta clientes y país. Ninguna implementa el motor monetario.
004 entrega dominio puro en packages/shared/src/billing/, contratos, configuración fiscal versionada en API y pruebas. Sin paquetes ni dependencias nuevos.
Fuentes: tramos del enunciado aportado por Alex, [reglas](../../docs/business-rules.md) y [aclaraciones](clarifications.md). No atribuir requisitos a identificadores inexistentes de plantillas anteriores.

## Requisitos y aceptación

- **004-RF1:** CUANDO users sea válido, EL MOTOR acumulará usuarios 1–10 a 1000 céntimos, 11–50 a 800 y desde 51 a 500, devolviendo base y desglose.
- **004-RF2:** CUANDO exista tasa para el país en la política recibida, EL MOTOR calculará impuesto sobre la base completa, redondeará una vez half-up y sumará base + impuesto.
- **004-RF3:** SI la entrada, política o dinero es inválido, o falta el país, EL MOTOR rechazará el cálculo con código estable, sin coerción, fallback ni resultado parcial.
- **004-RF4:** CUANDO entradas y versiones coincidan, EL MOTOR devolverá el mismo resultado sin red, reloj, entorno, HTTP, DB ni React.

## Entrada

calculateQuote(input, policy): input contiene users, storageGb, apiCalls y countryCode; policy contiene version y ratesByCountry.
Validar los tres consumos antes de calcular. Reutilizar CONSUMPTION_LIMITS: users 0..1000, storageGb 0..10000 y apiCalls 0..10000000, enteros seguros no negativos. Rechazar fracciones, NaN, Infinity, tipos incorrectos y valores fuera de rango; sin truncar ni saturar.
countryCode debe contener dos letras mayúsculas. Su normalización pertenece a 003; un código bien formado sin tasa produce país no soportado.
Sin clientId ni planCode. DEMO_BASIC/DEMO_PRO no alteran límites ni precios; almacenamiento y llamadas no generan cargos. calculateTieredBase recibe solo users.
Validar política: version no vacía, sin espacios exteriores y máximo 64 caracteres (compatible con 002); ratesByCountry es un mapa de países a tasas enteras seguras no negativas en bps. Diferenciar tasa explícita cero de ausencia.

## Tarifas y precisión

Versión inicial de precios: users-tiered-v1, identificador técnico de los tramos oficiales. Reglas y versión se definen juntas, sin admitir etiquetas arbitrarias del consumidor.
Política demo-standard-v1: ES 2100 bps (21%), FR 2000 (20%), DE 1900 (19%), GB 2000 (20%). Configuración única, sin módulos por país. Simulación simplificada acordada, sin exenciones, inversión del sujeto pasivo ni particularidades territoriales; no constituye fiscalidad completa de operaciones reales. No restringe los países de alta de clientes; GB no implica GBP.
Céntimos EUR e intermediarios BigInt. Sumar tramos, calcular taxCents = (baseCents × rateBps + 5000) div 10000 con división entera no negativa, y totalCents = baseCents + taxCents. No redondear por tramo.
Comprobar todos los importes antes de convertir a Number; rechazar resultados superiores a Number.MAX_SAFE_INTEGER. Ningún BigInt en salida JSON. No modificar reglas bajo una versión publicada.

## Salida

baseCents, taxCents, totalCents, currency: 'EUR', rateBps, pricingVersion, taxPolicyVersion y breakdown. Versiones de las reglas realmente aplicadas.
Cada línea contiene exactamente tierFrom, tierTo (null para el tramo abierto), quantity, unitPriceCents y subtotalCents. Tramos 1..10, 11..50, 51..null.
Omitir tramos sin consumo. Cero usuarios produce [] y tres importes cero; aun así se valida país y política.
Suma de cantidades = users; suma de subtotales = baseCents; baseCents + taxCents = totalCents. Formato compatible con 002, sin dependencia de shared hacia API.

## Errores del dominio

BillingError extiende Error, con code y field opcional. Mensajes técnicos sin datos del cliente.

| Código                  | Condición                                             |
| ----------------------- | ----------------------------------------------------- |
| BILLING_INPUT_INVALID   | Entrada, consumo o formato de país inválido.          |
| BILLING_POLICY_INVALID  | Estructura, versión o tasas de la política inválidas. |
| TAX_COUNTRY_UNSUPPORTED | País válido sin entrada propia en ratesByCountry.     |
| BILLING_MONEY_INVALID   | Importe de entrada de un helper monetario inválido.   |
| BILLING_MONEY_OVERFLOW  | Resultado monetario superior al entero seguro.        |

Orden: validar entrada, política, soporte del país y cálculo. La traducción HTTP corresponde a 005.

## Fuera de alcance

Endpoints, UI/preview integrado, DB/migraciones, simulaciones guardadas, FX, descuentos y tarifas por plan/storage/API.
005 integrará cálculo autoritativo y guardado; 006 conversión de visualización conservando histórico EUR. No crear ni modificar esas specs en esta preparación.

## Verificación y cierre

Oráculos independientes de base: 0→0, 10→10000, 11→10800, 15→14000, 50→42000, 51→42500 céntimos.
Cubrir límites, marginales, cuatro países, tasa cero, redondeo sintético, errores, overflow y determinismo.
Cada RF tendrá prueba y evidencia en [validación](validation.md). Conformidad técnica y aceptación humana se distinguen. Ningún RF implementado; [tareas](tasks.md) pendientes.
