# 006 — Infraestructura de conversión de moneda

Estado: alcance y decisiones confirmados por Alex. Preparación documental autorizada; implementación pendiente de indicación por tarea.

## Objetivo y contexto

Preparar conversión orientativa del total EUR a USD o GBP y un cliente del proveedor reutilizable desde la futura interfaz. La web actual contiene únicamente la pantalla inicial. Esta spec no incorpora pantallas, componentes ni hooks React.

## Relación con las anteriores

- 001: conservar monorepo pnpm, TypeScript y herramientas existentes.
- 002: histórico y snapshots EUR; D05 prohíbe persistir FX.
- 003: clientes y validación fiscal, sin cambios.
- 004: reutilizar motor puro y utilidades monetarias en packages/shared.
- 005: consumir totalCents autoritativo sin alterar API, precios, impuestos, guardado ni histórico.

## Requisitos funcionales

- **006-RF1:** CUANDO se proporcione un total EUR entero seguro no negativo y una tasa válida EUR→USD o EUR→GBP, EL MÓDULO devolverá unidades menores enteras seguras y moneda con half-up una sola vez al final. EUR será identidad sin red.
- **006-RF2:** CUANDO se soliciten tasas sin caché vigente, EL CLIENTE consultará el proveedor con base EUR, validará la respuesta y expondrá una operación asíncrona con metadatos y errores diferenciados. Las llamadas concurrentes compartirán petición.
- **006-RF3:** SI ocurre fallo HTTP, red, timeout, respuesta inválida o caducidad, EL CLIENTE devolverá un error identificable sin modificar EUR ni publicar tasas caducadas como vigentes. Permitirá una nueva solicitud explícita sin reintentos automáticos.
- **006-RF4:** MIENTRAS la caché sea vigente, EL CLIENTE reutilizará tasas para conversiones sucesivas y cambios USD/GBP sin petición adicional. Al caducar, requerirá nueva consulta.

## Reglas

- Catálogo cerrado EUR/USD/GBP, exponente 2 explícito por moneda. JPY/KWD no soportadas.
- Convertir solo total final desde EUR; sin líneas convertidas ni conversiones encadenadas.
- Tasa decimal positiva finita; intermediarios BigInt y comprobación de entero seguro. Sin operaciones monetarias flotantes ni dependencias nuevas.
- Conservar fecha de actualización, caducidad, fuente y atribución para futuros consumidores.
- ExchangeRate-API directo desde navegador, sin proxy ni clave. No enviar importes, datos de clientes ni identificadores fiscales.
- Caché en memoria por pestaña hasta caducidad del proveedor; sin almacenamiento persistente, polling ni tasas caducadas. Timeout 5 segundos.
- La conversión actual de un histórico es orientativa, no reproduce el tipo existente al guardar.
- La futura UI deberá mostrar fecha, atribución, carga, errores y alternativa EUR; se definirá y probará en próximas specs.

## Casos límite

HTTP 200 result:error; 429; timeout; JSON inválido; base distinta de EUR; EUR distinto de 1; moneda ausente; tasas cero/negativas/no finitas; fechas futuras/caducadas/incoherentes; concurrencia; recuperación tras fallo; notación científica; mitad exacta; overflow y moneda no soportada.

## Fuera de alcance

UI, hooks React, formularios, selector, simulador, formato visual, E2E de usuario, snapshots FX, migraciones, nuevos endpoints, proxy, nuevas librerías, otras monedas o proveedores y cotización bursátil.

## Definición de completado

T01–T05 verificadas con evidencia real, controles pertinentes correctos y límites externos explícitos. No equivale a aceptación humana ni autoriza implementar automáticamente. CORS real requiere comprobación desde navegador; un fallo exige consultar alternativa.

No registrar esta preparación en ai-workspace hasta nueva indicación de Alex.
