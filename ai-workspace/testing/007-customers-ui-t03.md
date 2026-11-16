# 007-T03 — Alta integrada y recuperación segura

16 de noviembre de 2026. Base 83b9432. Alcance autorizado: T03; [instrucción previa](../prompts/007-customers-ui.md#t03--instrucción-previa-de-implementación), [validación canónica](../../specs/007-customers-ui/validation.md#t03--alta-integrada-y-recuperación-segura).

## Controles ejecutados

Con Node 22.19.0 y pnpm 10.33.4, Path de Node y herramientas locales habilitado:

| Comando                                             | Resultado                                                                                                                      |
| --------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| pnpm.cmd lint                                       | Código 0, sin errores ni advertencias                                                                                          |
| pnpm.cmd typecheck                                  | Código 0, shared/web/API strict                                                                                                |
| pnpm.cmd build                                      | Código 0, ambas aplicaciones                                                                                                   |
| pnpm.cmd --filter @saas-o-matic/web test:components | Primera ampliación 47/47 correctas                                                                                             |
| pnpm.cmd test                                       | Código 0, 171 correctas: 36 shared, 12 API unitarias, 49 integración, 22 node web, 49 componentes/transporte, 1 gates y 2 docs |

[Salida global real](007-customers-ui-t03.txt). Gates ejecutado secuencialmente dentro de test, sin otros controles de código simultáneos. No sumar la ejecución parcial anterior al total final.

## Casos comprobados

WEB-API-02: payload normalizado de cinco campos, 201/DTO, rechazo de entradas inválidas antes de fetch, errores HTTP sin reintento, configuración derivada y rechazo de proyección inválida/vacía. WEB-FORM-01: formato compartido, foco/resumen/enlaces a campos, planes demo, bloqueo de doble envío y controles, 422/409/503 preservando valores, red/timeout/201 ilegible con resultado incierto y comprobación en otra pestaña, configuración fallida/reintento explícito, aborto y éxito tardío ignorado al desmontar.

Dos regresiones de navegación verifican cancelación contextual y éxito→ID persistido→retorno con búsqueda/página. Pruebas anteriores de listado, proxy, FX, backend y contratos conservadas.

## Navegador real

Diagnóstico temporal .cache/007-t03-browser.mjs ejecutado con PLAYWRIGHT_BROWSERS_PATH apuntando a .cache/playwright. Chromium, Vite y API usan puertos propios; SQLite se crea mediante createTestContext y se limpia tras cerrar recursos, verificando la ruta. No utiliza DB existente.

Flujo: formulario con configuración real → DNI de control inválido/422 y foco en resumen → corrección/201 → URL del ID persistido y anuncio → listado muestra cliente → duplicado/409, total permanece uno. Se consulta GET del ID para confirmar datos guardados. Cuatro anchos 320/390/768/1440, scrollWidth igual al viewport, cero errores de página. [Salida real](007-customers-ui-t03-browser.txt), [capturas revisadas](../visuals/007-customers-ui-t03.md).

## Límites

Cierre documental: pnpm.cmd test:docs (2 pruebas), pnpm.cmd format:check y git diff --check correctos, código 0. Auditoría git diff --exit-code -- apps/api packages/shared/src pnpm-lock.yaml devuelve 0; .cache/002-tests vacío tras cerrar las pruebas.

Ficha completa e historial son T04. Runner E2E mantenido, zoom 200%, auditoría exhaustiva de contraste/teclado y aceptación humana final pertenecen a T05; este diagnóstico no los sustituye. No se cambia dominio/backend/persistencia/dependencias. Sin commits/pushes.
