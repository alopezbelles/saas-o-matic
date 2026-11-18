# Estrategia de testing y aseguramiento de calidad

## 1. Propósito y estrategia

Las pruebas deben verificar requisitos y reglas, detectar regresiones, comprobar integraciones y proteger datos y resultados históricos. La estrategia debe ofrecer evidencia de comportamientos previsibles ante entradas inválidas, fallos internos y servicios externos no disponibles, y permitir evaluar una entrega reproducible.

La selección será proporcional al riesgo y alcance: una edición documental no exige las mismas suites que una modificación monetaria o transaccional. No se añadirán pruebas redundantes solo para aumentar recuentos ni porcentajes de cobertura no aprobados. Esta estrategia es normativa; no afirma que cada práctica se aplicara desde el inicio ni presenta resultados históricos como comprobaciones actuales.

Fuentes: [requisitos](requirements.md), [reglas](business-rules.md), [contratos](api-contracts.md), [protocolo SDD](sdd-harness.md) y [trazabilidad](traceability.md). Los resultados pertenecen a `specs/<feature>/validation.md`, no a este documento.

## 2. Niveles de prueba

### Unitarias

Deberán comprobar funciones y validadores aislados: tramos, impuestos, redondeos, límites monetarios, control fiscal, conversión y parsing de entradas. Se utilizarán esperados independientes de la función productiva, fronteras y casos negativos; comprobar fixtures por sí solo no acredita una regla implementada.

El proyecto utiliza Node Test Runner para shared y unitarias API, con pruebas JavaScript sobre módulos compilados. No se deberá confundir ausencia de HTTP/DB con ausencia de validación runtime: los contratos también deben rechazar tipos y valores inválidos.

### Integración

Deberán comprobar colaboraciones reales entre API, operaciones de datos, SQLite y CLI cuando afecten al alcance. Incluyen migraciones, claves foráneas, unicidad, snapshots, rollback, reapertura, bloqueo y recuperación, además de respuestas HTTP y privacidad de errores.

Se deberá distinguir una prueba del servicio/repositorio de una prueba de endpoint. Los fallos de inserción deben comprobarse contra la operación real cuando se pretenda acreditar atomicidad, no solo simulando un rechazo frontend. El cierre de proceso mediante evento simulado no deberá presentarse como entrega de una señal nativa del sistema operativo.

### Frontend y componentes

Vitest con React Testing Library y jsdom deberá comprobar renderizado e interacción, formularios, estados, navegación contextual, respuesta al error y coordinación asíncrona. Los adaptadores deben probar payload, status, DTO y envelope, sin asumir que un cast garantiza datos válidos.

Las pruebas deberán cubrir respuestas fuera de orden, aborto, timeout, cambios de parámetros y conservación de campos, además del camino satisfactorio. Mocks de transporte y reloj son apropiados para controlar estas condiciones, pero no acreditan conectividad real.

Web mantiene además Node Test Runner para contrato/cliente FX, composición y smoke de la aplicación compilada. El smoke HTTP de HTML/bundle no sustituye componentes, un recorrido E2E o revisión de accesibilidad.

### End-to-end

Playwright con Chromium deberá verificar recorridos completos con API Express, Vite y SQLite temporales reales, por ejemplo alta → ficha → simulación → confirmación → historial y recarga. Los escenarios deben comprobar resultado persistido y recuperación, no solo que una página pueda abrirse.

La suite de navegador utiliza FX controlado para ser determinista. Esto no convierte el recorrido interno en un mock de API/DB, pero tampoco demuestra una petición al proveedor real. El smoke externo se ejecutará separadamente cuando esté justificado.

## 3. Áreas prioritarias de cobertura

| Área                     | Comprobaciones que deben considerarse                                                                                                                            |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Clientes                 | Cinco datos, normalización, control fiscal por familia, ceros iniciales, duplicados por país/fiscal, búsqueda literal, paginación y detalle.                     |
| Persistencia             | Esquema y migraciones, referencias, restricciones, destinos seguros, operaciones atómicas, reapertura, snapshots y conservación de datos previos.                |
| Precios e impuestos      | Fronteras 0/10/11/15/50/51/1000, acumulación, ausencia de cargos secundarios, desglose coherente, redondeo único, política inválida, país sin tarifa y overflow. |
| Divisas                  | EUR identidad, oráculos USD/GBP, mitad exacta y adyacentes, notación científica, payload/fechas inválidos, vigencia y recuperación.                              |
| Simulaciones e histórico | Configuración compatible, resultado autoritativo, discrepancias, commit/201, historial sin recálculo, orden y persistencia tras recarga.                         |
| Errores y privacidad     | Rechazo controlado, errores DB/API/FX, logs y respuestas sanitizados, markup persistido como texto y consultas tratadas como datos.                              |
| Interfaz                 | Estados independientes, búsqueda/URL/retorno, envío único, guardado incierto, campos retenidos, teclado, foco, reflujo y contenido largo.                        |

Los casos concretos e identificadores deberán consultarse en las specs y la matriz de trazabilidad. Las pruebas no deberán introducir precios, impuestos, países o reglas de reserva distintos de los aprobados. Las políticas sintéticas de prueba deberán identificarse como tales.

## 4. Entorno y aislamiento

Las pruebas deberán usar datos sintéticos deterministas y contextos propios. Integración y E2E utilizarán bases SQLite temporales bajo `.cache/002-tests`, con marcas de contexto y guardas de acceso; no deberán abrir bases de desarrollo o demo del usuario. Una prueba de demo debe utilizar una demo temporal propia.

El entorno E2E crea API/Vite con puertos propios y comprueba el proxy real, sustituyendo únicamente el destino necesario para aislarlo. No requiere servidores personales ya arrancados. Los fixtures deben preparar explícitamente datos y cerrar recursos aunque falle una aserción.

Antes de limpiar se deberán verificar destino absoluto, pertenencia al área temporal y propiedad del recurso. La limpieza solo afectará a conexiones, procesos, archivos y puertos propios; no se usarán borrados amplios o reset de bases reales para facilitar una prueba.

El descubrimiento de suites debe permanecer separado:

- Shared/API: Node Test Runner sobre los archivos declarados por sus scripts.
- Node web: `test/*.test.mjs`, con compilación de módulos de prueba currency mediante tsconfig.test.
- Vitest: `src/**/*.test.{ts,tsx}`, jsdom y setup propio; no recoge E2E o pruebas Node.
- Playwright: `e2e/**/*.spec.mjs`, un worker, sin paralelismo completo ni retries configurados y con forbidOnly.

El runner de navegador usa `.cache/playwright`; resultados, capturas y trazas se generan bajo `.cache/007-e2e`, nombre técnico compartido que no identifica por sí solo una versión o feature. Los artefactos pueden sobrescribirse. La instalación del navegador es explícita mediante el script existente de web y no forma parte de cada ejecución de pruebas.

Reloj y transporte deben controlarse para debounce, caducidad y timeouts cuando proceda. Una ejecución con almacén o herramientas del host no acredita otra máquina limpia o compatibilidad con todos los sistemas operativos.

## 5. Controles técnicos

Los comandos siguientes están declarados en los scripts del monorepo. En PowerShell podrá emplearse pnpm.cmd. Se debe revisar su definición vigente antes de ejecutarlos.

| Comando                 | Responsabilidad                                                                                                                                                            |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pnpm lint`             | ESLint del repositorio, con warnings tratados como fallo.                                                                                                                  |
| `pnpm typecheck`        | Preparar shared y comprobar tipos de los workspaces y configuración API correspondiente.                                                                                   |
| `pnpm format:check`     | Comprobar formato con Prettier sin corregirlo.                                                                                                                             |
| `pnpm build`            | Compilar los paquetes del workspace, incluida la web Vite.                                                                                                                 |
| `pnpm test:unit`        | Compilar shared/API y ejecutar unitarias de shared y contratos/fiscal/política API.                                                                                        |
| `pnpm test:integration` | Compilar shared/API y ejecutar integración HTTP/SQLite/CLI, incluida demo temporal.                                                                                        |
| `pnpm test:web`         | Compilar web y ejecutar su suite Node y sus pruebas de componentes Vitest.                                                                                                 |
| `pnpm test:e2e`         | Preparar shared/API y ejecutar Playwright/Chromium contra el entorno temporal.                                                                                             |
| `pnpm test:gates`       | Verificar que tipos, lint y tests rechazan errores deliberados introducidos en archivos propios temporales.                                                                |
| `pnpm test:docs`        | Comprobar destinos locales de enlaces inline, contexto de spec activa y expectativas documentales/scripts codificadas. No es un validador completo de Markdown o anclas.   |
| `pnpm test`             | Ejecutar secuencialmente unitarias, integración, web, gates y documentos. No incluye E2E ni equivale a ejecutar lint, typecheck, formato y build como controles separados. |

**No se deberá ejecutar test:gates en paralelo con lint, tipos, build u otros controles de código.** Sus errores temporales podrían interferir con ejecuciones ajenas. Debe comprobarse la retirada de sus recursos; un fallo del gate no deberá atribuirse automáticamente al producto.

Para una corrección se deberán ejecutar primero las pruebas afectadas y las regresiones de consumidores pertinentes. El cierre integrado requerirá los controles del plan y E2E cuando se afirme un recorrido real. No se deberán repetir indiscriminadamente todas las suites después de una edición de texto sin motivo técnico.

Los controles documentales deberán contemplar también enlaces de referencia y anclas cuando se utilicen: el test existente solo inspecciona determinados patrones. Los acoplamientos del gate a texto o spec concreta deben revisarse al cambiar la documentación, sin modificar la prueba automáticamente para ocultar una carencia real.

## 6. UI, responsive y accesibilidad

La revisión deberá seguir [diseño](design.md) y los alcances aprobados de interfaz/calidad: anchos CSS 320, 390, 768 y 1440, estados relevantes y contenido largo válido. No bastará capturar la pantalla con datos cortos y sin errores.

Se deberán considerar reflujo y desbordamiento, controles y acciones visibles, etiquetas, IDs y referencias accesibles, errores asociados, teclado, foco de navegación/confirmación/paginación y recuperación sin desplazar una elección posterior del usuario.

Las mediciones de geometría, asociaciones y contraste podrán automatizarse; las capturas deberán inspeccionarse para valorar jerarquía y legibilidad. Una captura por sí sola no acredita interacción y un test automatizado no equivale a revisión humana. Si la comprobación visual la realiza el agente, no se atribuirá al responsable del proyecto.

Se debe distinguir ampliación CSS, viewport equivalente y uso del zoom nativo. Debe declararse si no se comprobaron lector de pantalla u otros navegadores. Contraste representativo y controles parciales no constituyen certificación exhaustiva WCAG.

Un defecto reproducible debe permanecer visible hasta resolverlo. Los fallos esperados pueden conservar una reproducción conocida, pero un código cero del runner con esa expectativa no permite declarar conforme el requisito afectado. La regresión deberá exigir éxito ordinario después de la corrección.

## 7. Integraciones externas y resiliencia

Las ejecuciones ordinarias deberán mantener FX determinista con fixtures o fetch/reloj inyectados. Se deberán cubrir HTTP no satisfactorio, error lógico con HTTP 200, fallo de red, JSON inválido, base/tasas incorrectas, fechas incoherentes o vencidas, timeout de respuesta y cuerpo, concurrencia y respuesta tardía.

Se deberán comprobar petición compartida, reutilización mientras haya vigencia y recuperación explícita tras fallo sin publicar tasas viejas. Modificar importe no deberá causar una nueva consulta o reintento implícito. El resultado EUR y los datos originales deberán conservarse.

Una comprobación real del proveedor deberá ejecutarse explícitamente, con datos temporales y sin interceptar FX, cuando el alcance lo requiera. El script existente `apps/web/e2e/fx-live.mjs` está separado del patrón de descubrimiento de specs Playwright y no forma parte de la suite ordinaria. Su ejecución requiere preparar API/shared y permisos efectivos de navegador/red; no es un requisito para cada test.

La comprobación real debe registrar origen, respuesta, vigencia, CORS observado, conversión y atribución sin datos privados. Un fetch de Node no demuestra CORS de navegador. Un bloqueo de sandbox o fallo del navegador no demuestra un defecto del proveedor. Una consulta correcta tampoco garantiza otro dominio o disponibilidad futura.

En API/DB se deberán verificar indisponibilidad, ocupación, errores de inserción y recuperación sin datos parciales. En web, timeout o respuesta ilegible después de un posible commit deberán tratarse como incertidumbre, no como evidencia de rollback. La resiliencia no debe basarse en reenvíos automáticos de POST.

## 8. Evidencias e informes

La fuente principal de cada validación será `specs/<feature>/validation.md`. Deberá registrar, cuando corresponda:

- Requisito/caso y alcance comprobado, entorno y versión o contexto identificable.
- Comandos efectivamente ejecutados, códigos de salida y resultados observados.
- Fallos iniciales, hipótesis, causa verificada, corrección y repetición posterior.
- Controles omitidos o bloqueados, límites, artefactos disponibles y cuestiones pendientes.

Se deberán distinguir pruebas previstas, implementadas, ejecutadas y superadas. No se fabricarán logs ausentes ni se presentarán fixtures coherentes como prueba de código productivo. Los resultados de ejecuciones distintas no deberán sumarse como cobertura nueva.

[ai-workspace/features](../ai-workspace/features/) explicará instrucciones, colaboración e iteraciones significativas, enlazando la validación canónica. Los registros adicionales que existan en testing/reviews podrán conservar salidas o informes específicos; no es obligatorio crear archivos en todas las carpetas. Capturas y reportes temporales deberán identificar su contexto y limitación de conservación.

Las evidencias históricas enlazadas desde versiones anteriores de este documento se consultan en las validaciones de [001](../specs/001-foundation/validation.md), [002](../specs/002-persistence/validation.md), [003](../specs/003-customers-api/validation.md), [004](../specs/004-billing/validation.md), [005](../specs/005-simulations-api/validation.md), [006](../specs/006-currency/validation.md), [007](../specs/007-customers-ui/validation.md), [008](../specs/008-simulator-ui/validation.md), [009](../specs/009-quality/validation.md) y [010](../specs/010-delivery/validation.md). Este enlace no convierte un estado parcial en el resultado actual.

El [índice de artefactos](../ai-workspace/testing/008-010-evidence-index.md) detalla límites de evidencia efímera; el [ensayo de entrega](../ai-workspace/testing/010-delivery-t03.md) conserva el método de instalación aislada. Esta estrategia no sustituye sus resultados ni acredita una nueva ejecución.

## 9. Criterios de validación y cierre

Una tarea podrá considerarse técnicamente validada cuando sus requisitos y criterios estén revisados, las comprobaciones pertinentes hayan pasado y exista evidencia suficiente del alcance declarado, sin regresiones o defectos conocidos que impidan la conformidad. Cualquier comprobación no ejecutada deberá quedar visible con motivo e impacto; no se marcará como superada por inspección.

Los defectos deben contar con reproducción y verificación posterior proporcionadas. La documentación afectada debe ser coherente y enlazar resultados reales. Si falta una aprobación imprescindible o existe una decisión fuera del alcance, se deberá solicitar revisión del resultado concreto antes del cierre dependiente.

Se mantendrán separados:

- **Implementación completada:** los cambios previstos están realizados.
- **Validación técnica:** los controles pertinentes respaldan el comportamiento dentro de sus límites.
- **Aceptación humana:** el responsable confirma expresamente su revisión o aceptación.
- **Preparación de entrega o despliegue:** requiere su propio alcance y verificaciones; no autoriza publicar.

Una suite correcta no acredita aceptación humana, ausencia absoluta de defectos o seguridad certificada. Tampoco autoriza commits, push, publicación o despliegue. La revisión debe informar qué se comprobó, qué permanece pendiente y qué limitaciones condicionan sus conclusiones.
