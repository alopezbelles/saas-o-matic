# 007-T02 — Revisión técnica

16 de noviembre de 2026. Revisión durante T02 sobre base 0436e20 y cambios de trabajo. [Evidencia](../testing/007-customers-ui-t02.md).

**CUMPLE TÉCNICAMENTE T02.** RF1 conforme y RF4 conforme para listado; sus casos futuros de ficha/historial siguen pendientes. RF5 parcial en pantallas existentes.

## Contratos y responsabilidades

Transporte GET separa aborto/timeout, HTTP y protocolo; devuelve envelope validado con mensajes de producto controlados. CustomerPage/DTO se validan antes de renderizar. Se evita aplicar validación fiscal/email de alta a filas históricas ya guardadas. Queries reutilizan parseCustomerQuery y paginación existente; datos no se obtienen de fixtures en producción.

useCustomers controla vigencia con cleanup/abort y estado por query/reintento. La página mantiene búsqueda/debounce y URL, sin perder DOM/foco de input. Historial del navegador y retorno de placeholders conservan q/offset. El destino de retorno se valida como listado local.

Tabla desktop y reflujo móvil reutilizan tokens y acción «+ Nuevo cliente»; label accesible, estados anunciados y controles nativos. Sin nuevas dependencias, endpoints o SQL. Build/dev prevén shared compilado al consumirlo desde web.

## Verificación y límites

152 pruebas globales correctas. Smoke con proxy real/API/SQLite temporal verifica listado y recuperación a cuatro tamaños; capturas inspeccionadas. Incidencia inicial del selector status corregida y conservada. [Capturas](../visuals/007-customers-ui-t02.md).

Archivos revisados mantienen responsabilidades cohesionadas y menos de 300 líneas cada uno. No se desarrolla alta/ficha completa ni se afirma aceptación humana final. Documentación de cierre/enlaces se verifica aparte; no se equipara este smoke con el flujo de alta E2E de T05.
