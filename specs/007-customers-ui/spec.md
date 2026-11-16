# 007 — Listado, alta y ficha de clientes

Estado: decisiones confirmadas por Alex; T01 completada técnicamente. T02–T05 pendientes de indicación. Sin aceptación humana final.

## Contexto y fuentes

Hacer accesibles las operaciones de clientes mediante pantallas en español. La web actual contiene la pantalla inicial y módulos FX sin integración visual; las pantallas de esta spec aún no existen.

Fuentes: decisiones de Alex en esta conversación y revisión visual completa de las cuatro páginas de interfaces.pdf, facilitado en `C:/Users/alope/Desktop/roams/interfaces.pdf`. Pantallas: listado, alta, ficha con historial y simulador. Las tres primeras guían 007; el simulador queda fuera. El PDF es referencia visual, no fuente de nuevos planes, tarifas, datos reales o endpoints. La ubicación es externa al repositorio; no se ha copiado el documento ni se garantiza su disponibilidad en otro equipo.

[Diseño existente](../../docs/design.md) y [producto](../../docs/product.md) aportan contexto; las aclaraciones específicas de 007 prevalecen sobre propuestas antiguas incompatibles. No atribuir R03/R10/R11/N06 a docs/requirements.md, que no define esos requisitos. No se certifica revisión del enunciado oficial completo de Roams.

## Dependencias y relación

- 001: React/TypeScript/Vite, pnpm y controles existentes.
- 002: persistencia y planes DEMO_BASIC/DEMO_PRO.
- 003: POST/GET /customers y GET /customers/:id, parsers y errores.
- 005: GET /billing-config y GET /customers/:id/simulations ya disponibles. Configuración proporciona países mediante ratesByCountry, no catálogo de planes.
- 004/006: se conservan, pero 007 no integra cálculo ni conversión FX.

## Requisitos funcionales y aceptación EARS

- **007-RF1:** CUANDO se abra el listado o cambie su búsqueda/página, EL SISTEMA consultará clientes paginados, mostrará resultados y total, y distinguirá carga, lista vacía, búsqueda sin coincidencias y fallo recuperable sin perder la consulta.
- **007-RF2:** CUANDO se envíe el alta, EL SISTEMA validará formato con reglas compartidas, enviará exactamente los cinco campos existentes y, tras 201 válido, navegará a la ficha creada. Ante 422/409/503 conservará valores y presentará errores comprensibles; bloqueará doble envío y no repetirá POST automáticamente ante resultado incierto.
- **007-RF3:** CUANDO se abra una ficha válida, EL SISTEMA mostrará empresa, fiscal, email, país y plan con historial paginado de importes EUR guardados. Distinguirá ID inválido, cliente inexistente y error temporal; un fallo del historial no ocultará los datos del cliente disponibles.
- **007-RF4:** SI una consulta anterior termina después de una búsqueda/página o ficha nueva, EL SISTEMA ignorará su resultado. La búsqueda tendrá debounce de 250 ms; búsqueda y páginas quedarán en URL y al volver se recuperará el listado anterior.
- **007-RF5:** CUANDO se navegue entre listado, alta y ficha, EL SISTEMA ofrecerá rutas directas con React Router, navegación superior, breadcrumbs, foco visible y presentación responsive basada en tokens compartidos. Teclado, errores y estados tendrán semántica accesible.

## Pantallas y comportamiento acordado

### Listado

Ruta /customers; / redirige a ella. Empresa, identificador fiscal, país, plan y «Ver cliente». Omitir «Última simulación»: el contrato no proporciona ese dato y no se ampliará API ni hará una consulta por cliente. Botón «Nuevo cliente». Sin KPI ni sección global de simulaciones.

Páginas de 20 con «Anterior/Siguiente», total y estado de página. Parámetros de URL q/offset; cambiar búsqueda vuelve a offset 0. Abrir ficha/alta y regresar conserva el contexto. Sin clientes y sin coincidencias tienen mensajes distintos; una página fuera de resultados ofrece volver a la primera sin afirmar que no existen clientes.

### Alta

Ruta /customers/new. Cinco campos: companyName, taxId, contactEmail, countryCode y planCode. Sin contactName. Labels persistentes; campo fiscal identificado como DNI/NIF/CIF, sin prometer identidad/censo verificados. Validación estructural compartida; algoritmo fiscal autoritativo en backend al enviar.

Países de ratesByCountry en GET /billing-config: configuración actual ES/FR/DE/GB, mostrados España/Francia/Alemania/Reino Unido. No hardcodear otra política ni modificar países aceptados por API. Planes desde PLAN_CODES de shared: DEMO_BASIC → «Básico (demo)», DEMO_PRO → «Profesional (demo)». Aclarar que actualmente no cambian la tarifa; no inventar prestaciones.

Si configuración no está disponible, mostrar fallo/reintento y bloquear alta hasta disponer de países válidos, conservando campos. Sin fixtures de producción. Cancelar vuelve al listado con contexto; tras creación correcta mostrar confirmación accesible y ficha. Error de red/timeout o respuesta de éxito ilegible puede dejar resultado incierto: no reenviar automáticamente; ofrecer comprobar clientes antes de repetir.

### Ficha e historial

Ruta /customers/:id. Tarjetas corporativa y de contacto con datos existentes, sin inventar contacto nominal. Historial de 20 por página, estado en URL mediante historyOffset: fecha, usuarios, almacenamiento, llamadas API, moneda EUR y total mensual guardado. Orden de API, sin recalcular ni aplicar FX. Estados independientes de carga, vacío y error/reintento.

No mostrar «Nueva simulación» ni «Ver detalle» hasta que sus flujos existan en otra spec; tampoco enlaces rotos o pantallas simuladas. Clientes de países ajenos al selector siguen siendo consultables.

## Diseño y calidad

Navegación superior y contenido centrado; tema claro, tarjetas blancas y azul para acciones según PDF, con fuente del sistema. CSS Modules para estilos locales, tokens.css global y global.css pequeño. No Tailwind, fuentes descargadas, tema oscuro ni librería UI.

Escritorio con tabla/lista estructurada; móvil con tarjetas o reflujo accesible sin pérdida de datos. Verificar 320, 390, 768 y 1440 px, zoom 200%, teclado, foco, labels y estados anunciados sin ruido. Objetivo WCAG 2.2 AA en lo implementado, sin afirmar certificación global. Ajustar colores del PDF si lo exige contraste.

## Fuera de alcance

Simulador, hooks/selector FX, conversión del histórico, detalle de simulación, columna última simulación, edición/borrado, KPI, nuevos endpoints/tablas, autenticación, despliegue o diseño de un sistema UI publicable.

## Definición de completado y límites

RF enlazados a pruebas reales, controles globales pertinentes correctos y navegación/alta/historial verificados con datos aislados. Distinguir aprobación de decisiones, conformidad técnica y aceptación humana de la entrega. Dependencias autorizadas en [aclaraciones](clarifications.md), ejecución incremental en [tareas](tasks.md).

La preparación se limitó a los cinco documentos y excluyó ai-workspace. Alex autorizó después T01 y el registro del progreso, sin autorización de commits/pushes. Las tareas posteriores siguen sujetas a su indicación.
