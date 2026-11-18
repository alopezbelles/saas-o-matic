# Reglas de negocio

## Alcance y autoridad

Este documento establece las reglas funcionales vigentes que deben respetarse al especificar, diseñar e implementar SaaS-O-Matic. Las specs concretan contratos y casos de aceptación; el código no puede redefinir estas reglas para justificar un comportamiento distinto.

Se distinguen las siguientes fuentes de autoridad:

- **Requisitos del enunciado de Roams:** alta de cliente con empresa, identificador fiscal, email, país y plan; control algorítmico del identificador español; simulaciones de consumos persistidas; precios acumulativos por usuarios más impuesto; consulta de clientes y conversión mediante API pública. El cotejo del enunciado se conserva en la [matriz de requisitos](../specs/009-quality/validation.md#qa-review-009--matriz-final-del-enunciado).
- **Políticas complementarias vigentes del MVP:** límites de consumo, catálogo de planes demo, tasas fiscales de simulación, precisión, catálogo de divisas e inmutabilidad histórica. Concretan aspectos no definidos por el enunciado y no deben presentarse como exigencias oficiales de Roams.
- **Fuera de alcance:** cobros, facturas legales, suscripciones recurrentes, fiscalidad completa, catálogo comercial real, descuentos, cargos adicionales no definidos y comprobación censal. No se deben deducir estas capacidades del nombre del producto.

Si existe contradicción, el enunciado prevalece sobre políticas complementarias y propuestas técnicas. Una discrepancia con una spec o con el código deberá señalarse y resolverse expresamente antes de cambiar comportamiento; no autoriza a alterar silenciosamente el contrato.

## BR01 — Modelo de precios por tramos

**Origen:** tarifas acumulativas del enunciado; cero usuarios y representación monetaria se concretan como política del MVP.

El cálculo se realizará sobre el número entero no negativo de usuarios activos. Cada usuario deberá contabilizarse en un único tramo:

| Tramo   | Usuarios incluidos | Precio unitario |
| ------- | ------------------ | --------------- |
| Primero | Del 1 al 10        | 10 EUR          |
| Segundo | Del 11 al 50       | 8 EUR           |
| Tercero | Desde el 51        | 5 EUR           |

Para `n` usuarios, la base en céntimos será:

```text
a = min(n, 10)
b = min(max(n - 10, 0), 40)
c = max(n - 50, 0)
baseCents = a × 1000 + b × 800 + c × 500
```

No se permitirá aplicar retroactivamente el precio del último tramo a todos los usuarios. Cero usuarios deberá producir base cero, sin mínimo de uno ni cuota fija añadida. El desglose deberá conservar cantidades, precio unitario y subtotal de cada tramo aplicado.

| Usuarios | Base EUR | Base en céntimos |
| -------- | -------- | ---------------- |
| 0        | 0,00     | 0                |
| 10       | 100,00   | 10000            |
| 11       | 108,00   | 10800            |
| 15       | 140,00   | 14000            |
| 50       | 420,00   | 42000            |
| 51       | 425,00   | 42500            |

## BR02 — Consumos y planes

**Origen:** los tres consumos y la elección de plan proceden del enunciado. Catálogo, límites y ausencia de cargos adicionales son políticas del MVP, recogidas en las [aclaraciones de persistencia](../specs/002-persistence/clarifications.md) y [facturación](../specs/004-billing/clarifications.md).

Cada simulación deberá registrar:

| Consumo                   | Unidad   | Rango admitido, inclusivo |
| ------------------------- | -------- | ------------------------- |
| Usuarios activos          | Usuarios | 0–1.000                   |
| Almacenamiento contratado | GB       | 0–10.000                  |
| Llamadas API estimadas    | Llamadas | 0–10.000.000              |

Los valores deberán ser enteros no negativos. No se admitirán fracciones, valores no numéricos o consumos fuera de rango ni se convertirán entradas inválidas silenciosamente en cero. Los tres consumos deberán validarse aunque solo uno genere coste.

Los únicos planes admitidos serán DEMO_BASIC y DEMO_PRO, identificados como Básico (demo) y Profesional (demo). El plan deberá conservar la elección del cliente, pero no cambiará el precio, añadirá cuotas ni multiplicará importes.

Solo los usuarios activos contribuirán a la base. Almacenamiento y llamadas API se conservarán como consumos informativos: no existe una tarifa definida para ellos. No se permitirá inventar cargos, prestaciones o diferencias comerciales entre planes. Los máximos son límites acordados del MVP, no cuotas comerciales oficiales.

## BR03 — Política de impuestos

**Origen:** sumar impuesto a la base es requisito del enunciado. Tasas, países y redondeo constituyen la política complementaria [demo-standard-v1](../specs/004-billing/clarifications.md).

| País de cálculo | Código | Tasa demo | Puntos básicos |
| --------------- | ------ | --------- | -------------- |
| España          | ES     | 21 %      | 2100           |
| Francia         | FR     | 20 %      | 2000           |
| Alemania        | DE     | 19 %      | 1900           |
| Reino Unido     | GB     | 20 %      | 2000           |

El sistema deberá obtener el país del cliente al simular y aplicar el impuesto después de acumular la base completa y antes de convertir divisas:

```text
taxCents = roundHalfUp(baseCents × rateBps / 10000)
totalCents = baseCents + taxCents
```

El impuesto se redondeará una sola vez sobre la base completa, no por tramo. Para valores no negativos, half-up aproxima al entero más cercano y resuelve la mitad exacta hacia arriba. Los importes EUR deberán expresarse en céntimos enteros; se exigirá exactitud en operaciones intermedias y se rechazarán resultados que no puedan representarse como enteros seguros, sin entregar importes parciales.

Ejemplo: 15 usuarios en España producirán base de 140,00 EUR, impuesto de 29,40 EUR y total de 169,40 EUR.

Un país sin tasa configurada deberá impedir el cálculo con error explícito; no equivale a una tasa del 0 %. La presencia y validez de la política deberán comprobarse incluso con cero usuarios. Un fallo de configuración no deberá presentarse como un dato incorrecto introducido por el usuario.

Registrar un cliente de otro país no implica que pueda simularse con esta política. Las tasas deberán quedar identificadas por versión y no cambiar de significado bajo la misma versión. Las tasas sintéticas usadas para comprobar casos límite no constituyen políticas de producto.

Esta política simplifica la simulación: no contempla exenciones, inversión del sujeto pasivo, territorialidad ni todas las circunstancias tributarias de una operación real. No se presentará como liquidación fiscal legal o asesoramiento tributario.

## BR04 — Identificación fiscal

**Origen:** el control algorítmico obligatorio para España procede del enunciado. La normalización, categorías admitidas, unicidad y límites de soporte se concretan en la [especificación fiscal](../specs/003-customers-api/fiscal-rules.md), el [contrato de clientes](../specs/003-customers-api/spec.md) y sus [aclaraciones](../specs/003-customers-api/clarifications.md).

El sistema deberá recortar espacios exteriores y convertir a mayúsculas el identificador normalizado, conservando ceros iniciales. No eliminará separadores o caracteres interiores arbitrariamente. El país deberá normalizarse antes de elegir la regla aplicable.

Para España se exigirá forma canónica de nueve caracteres, sin prefijo VAT ES ni separadores internos:

| Categoría                                       | Formato y control requerido                                                                                 |
| ----------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| DNI                                             | Ocho dígitos y letra según resto módulo 23 y tabla TRWAGMYFPDXBNJZSQVHLCKE.                                 |
| NIE                                             | X/Y/Z, siete dígitos y letra; sustituir prefijo por 0/1/2 y aplicar el control módulo 23.                   |
| NIF especiales K/L/M                            | Prefijo, siete dígitos y letra; módulo 23 sobre los siete dígitos, sin convertir el prefijo.                |
| NIF de entidades, denominado coloquialmente CIF | Prefijo, siete dígitos y carácter de control de entidad; tipo de carácter según la clasificación siguiente. |

En entidades, los prefijos ABCDEFGHJUV exigirán dígito y NPQRSW exigirán letra. No se aceptarán ambos tipos por defecto. El control se obtendrá sumando los dígitos en posiciones pares de los siete dígitos y las cifras de los dígitos impares duplicados; su complemento módulo 10 determinará el dígito o la letra correspondiente de JABCDEFGHI. La referencia fiscal enlazada detalla fuentes y el criterio adoptado ante discrepancias documentales.

El alcance admitido para K/L/M utiliza la parte numérica verificable de siete dígitos; no promete cubrir formatos alfanuméricos más amplios sin una regla documentada. No se admitirán NIE antiguos de diez caracteres.

Para países distintos de ES se exigirán presencia, longitud y formato estructural del contrato de alta, pero no se aplicará el checksum español ni se prometerá validez fiscal internacional. Los identificadores inválidos deberán rechazarse sin crear el cliente y con indicación del campo afectado.

No se permitirá registrar dos clientes con el mismo país e identificador normalizado. Nombre y email no serán únicos por esta regla. La validación de nuevas altas no autoriza a modificar o eliminar registros históricos preexistentes.

Un formato y checksum correctos no acreditan existencia, titularidad o alta censal. No se deberá describir un cliente como «empresa verificada» basándose únicamente en este control.

## BR05 — Divisas

**Origen:** visualización mediante tipos de cambio de API pública según el enunciado; catálogo y precisión concretados en las [aclaraciones de divisas](../specs/006-currency/clarifications.md).

La moneda base del cálculo y del histórico deberá ser EUR. Las únicas monedas de visualización admitidas serán EUR, USD y GBP, todas con dos decimales. EUR será identidad y no necesitará tasa externa.

La conversión se realizará únicamente sobre el total final EUR, después del impuesto:

```text
totalDestinoMinor = roundHalfUp(totalEurCents × tasaEURaDestino)
```

La fórmula expresa unidades menores porque las monedas admitidas comparten exponente dos. La tasa deberá ser positiva, finita, válida y referida explícitamente a EUR→destino. Se deberá preservar su precisión decimal y redondear una sola vez al final; no convertir desde una cantidad ya convertida, invertir la tasa o redondear resultados intermedios.

El desglose, la base y el impuesto permanecerán en EUR. No se convertirán líneas por separado ni se modificarán los céntimos originales. La moneda seleccionada y la tasa de visualización no se almacenarán como parte de la simulación.

La conversión deberá identificarse como orientativa, con fecha de referencia y atribución de la fuente. No deberá presentarse una tasa caducada como vigente ni una cantidad EUR bajo etiqueta USD/GBP. La tasa actual aplicada a un histórico no reproduce necesariamente el cambio existente cuando se guardó.

Si no existe una tasa válida o falla su obtención, el total EUR deberá seguir disponible y se comunicará la limitación, permitiendo una nueva consulta explícita. El fallo de conversión no impedirá guardar una simulación EUR válida ni provocará un nuevo guardado. «Tiempo real» no deberá interpretarse como garantía de cotización bursátil continua.

## BR06 — Histórico de simulaciones

**Origen:** persistir la simulación es requisito del enunciado; conservación inmutable y contexto histórico son políticas de [persistencia](../specs/002-persistence/clarifications.md) y [simulaciones](../specs/005-simulations-api/spec.md).

Cada simulación guardada deberá conservar cliente, tres consumos, moneda EUR, base, impuesto, total, tasa aplicada, desglose, versiones de precios e impuestos, identificador y fecha de creación. Deberá incluir una instantánea de nombre de empresa, identificador fiscal normalizado, país y plan coherentes con el cliente utilizado al calcular.

La fecha deberá representar un instante UTC, no una fecha contable. El sistema deberá calcular el resultado autoritativo a partir de los consumos y del cliente existente; no confiará en precios, tasas o snapshots aportados por el consumidor.

Las simulaciones serán inmutables: no se permitirá editar, eliminar o recalcular automáticamente las guardadas con tarifas, impuestos o datos actuales del cliente. Los cambios posteriores afectarán únicamente a nuevas simulaciones. La consulta deberá devolver importes y contexto originales, con orden de fecha descendente y desempate estable por identificador.

Un fallo antes de confirmar el guardado no deberá dejar una simulación parcial en el histórico. Si la comunicación falla después de que el guardado pudiera haberse confirmado, el resultado se considerará incierto: no se afirmará que no existe ni se reenviará automáticamente; deberá ofrecerse comprobar el histórico.

Se impedirá repetir la misma acción mientras su envío está pendiente. Dos guardados deliberados podrán crear dos registros diferentes: el MVP no garantiza deduplicación avanzada de solicitudes. Una confirmación deberá mostrar el resultado guardado aunque difiera de la previsualización y comunicar la discrepancia sin alterar el registro.

## Invariantes de negocio

- Cada usuario se contabilizará una sola vez en el tramo correspondiente.
- Los consumos sin tarifa definida y la elección de plan no generarán cargos añadidos.
- Las cantidades monetarias deberán ser exactas dentro de su rango admitido; el desglose sumará la base y base más impuesto será igual al total.
- El impuesto se aplicará antes de cualquier conversión orientativa.
- La ausencia de una regla fiscal o tasa válida no se sustituirá silenciosamente por un valor de reserva inventado.
- El servidor determinará el resultado persistido y las simulaciones conservarán sus hechos originales.
- Un estado de guardado incierto no se presentará como éxito o fracaso confirmado sin evidencia.
